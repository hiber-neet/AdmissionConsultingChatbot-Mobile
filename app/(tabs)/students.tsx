import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import Header from '@/components/layout/Header';
import {
  Send,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  CheckCheck,
  Star,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  text: string;
  senderId: number;
  senderType: 'student' | 'officer';
  timestamp: Date;
  delivered: boolean;
  read: boolean;
  senderName?: string;
  senderAvatar?: string;
}

export default function StudentsScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();

  const OFFICIAL_ID = 1;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [queueStatus, setQueueStatus] = useState<'idle' | 'waiting' | 'accepted' | 'rejected'>('idle');
  const [queueId, setQueueId] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);

  const flatListRef = useRef<FlatList>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const sseRef = useRef<EventSource | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState<number | null>(null);

  const API_BASE = Platform.select({
    web: 'http://localhost:8000',
    ios: 'http://localhost:8000',
    android: 'http://10.0.2.2:8000',
  })!;
  const WS_BASE = Platform.select({
    web: 'ws://localhost:8000',
    ios: 'ws://localhost:8000',
    android: 'ws://10.0.2.2:8000',
  })!;

  // ====== JOIN QUEUE ==================================================
  const joinQueue = async () => {
    if (!user?.user_id) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin sinh viên');
      return;
    }
    try {
      const url = `${API_BASE}/live_chat/livechat/live-chat/join_queue?customer_id=${user.user_id}&official_id=${OFFICIAL_ID}`;
      const res = await fetch(url, { method: 'POST' });
      if (!res.ok) {
        throw new Error('Join queue failed');
      }
      const data = await res.json();
      setQueueStatus('waiting');
      setQueueId(data.id);
    } catch (e) {
      console.log('joinQueue error', e);
      Alert.alert('Lỗi', 'Không thể gửi yêu cầu tư vấn, vui lòng thử lại.');
    }
  };

  // ====== SSE==============================
useEffect(() => {
  if (!user?.user_id) return;

  const sseUrl = `${API_BASE}/live_chat/livechat/sse/customer/${user.user_id}`;
  const es = new EventSource(sseUrl);
  sseRef.current = es;

  const parseSSEData = (raw: string) => {
    console.log('raw SSE data:', raw);
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch (err) {

      try {
        const fixed = raw
          .replace(/'/g, '"')         // ' -> "
          .replace(/\bNone\b/g, 'null')
          .replace(/\bTrue\b/g, 'true')
          .replace(/\bFalse\b/g, 'false');
        return JSON.parse(fixed);
      } catch (err2) {
        console.log('SSE parse error:', err2);
        return null;
      }
    }
  };

  const makeHandler =
    (type: 'queued' | 'accepted' | 'rejected' | 'message') =>
    (event: MessageEvent) => {
      const payload = parseSSEData(event.data);
      if (!payload) return;

      const data = (payload as any).data || payload;

      console.log('SSE event:', type, data);

      if (type === 'queued') {
        setQueueStatus('waiting');
        setQueueId(data.queue_id);
      } else if (type === 'accepted') {
        setQueueStatus('accepted');
        setSessionId(data.session_id);
        connectWebSocket(data.session_id);
        Alert.alert('Thông báo', 'Bạn đã được kết nối với chuyên viên tuyển sinh.');
      } else if (type === 'rejected') {
         setQueueStatus('rejected');
      setSessionId(null);

      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
        Alert.alert('Thông báo', data.reason || 'Yêu cầu tư vấn đã bị từ chối.');
      }
    };

  es.addEventListener('queued', makeHandler('queued'));
  es.addEventListener('accepted', makeHandler('accepted'));
  es.addEventListener('rejected', makeHandler('rejected'));
  es.onmessage = makeHandler('message');
  es.onerror = (e) => {
    console.log('SSE error:', e);
  };

  return () => {
    es.close();
  };
}, [user?.user_id]);

  // ====== WEBSOCKET====================================
  const connectWebSocket = (sid: number) => {
    const wsUrl = `${WS_BASE}/live_chat/livechat/chat/${sid}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Live chat WS connected');
    };

    ws.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    if (data.event === 'chat_connected') {
      return;
    }

    if (data.event === 'message') {
      // 🔥 bỏ qua echo từ chính mình
      if (data.sender_id === user?.user_id) {
        return;
      }

      const isStudent = data.sender_id === user?.user_id;
      const msg: Message = {
        id: `${data.timestamp}-${Math.random()}`,
        text: data.message,
        senderId: data.sender_id,
        senderType: isStudent ? 'student' : 'officer',
        timestamp: new Date(data.timestamp),
        delivered: true,
        read: true,
      };
      setMessages((prev) => [...prev, msg]);
    }

    if (data.event === 'chat_ended') {
      Alert.alert('Thông báo', 'Phiên tư vấn đã kết thúc.');
      ws.close();
      setSessionId(null);
      setQueueStatus('idle');
    }
  } catch (err) {
    console.log('WS message parse error', err);
  }
};

    ws.onerror = (e) => {
      console.log('WS error', e);
    };

    ws.onclose = () => {
      console.log('Live chat WS closed');
    };
  };

  // ====== GỬI TIN NHẮN ===============================================
  const sendMessage = () => {
    if (!newMessage.trim()) return;

 if (queueStatus !== 'accepted') {
    Alert.alert(
      'Không thể gửi tin nhắn',
      'Phiên tư vấn đã kết thúc hoặc bị từ chối. Vui lòng gửi lại yêu cầu tư vấn mới.'
    );
    return;
  }


    if (!sessionId) {
      Alert.alert('Đang chờ', 'Bạn chưa được kết nối với chuyên viên. Vui lòng đợi được chấp nhận.');
      return;
    }

    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      Alert.alert('Lỗi', 'Kết nối chat đã bị ngắt, hãy thử lại.');
      return;
    }

    const msgText = newMessage.trim();

    // Push ngay vào UI
    const localMsg: Message = {
      id: Date.now().toString(),
      text: msgText,
      senderId: user?.user_id || 0,
      senderType: 'student',
      timestamp: new Date(),
      delivered: true,
      read: false,
    };
    setMessages((prev) => [...prev, localMsg]);
    setNewMessage('');

    // Gửi lên WS cho BE
    ws.send(
      JSON.stringify({
        sender_id: user?.user_id,
        message: msgText,
      })
    );
  };

// ====== KẾT THÚC CHAT ======
  const endChat = () => {
  if (!sessionId || !user?.user_id) {
    Alert.alert('Thông báo', 'Hiện không có phiên tư vấn nào đang hoạt động.');
    return;
  }

  // 💻 Web: Alert không hiển thị -> mở thẳng modal rating
  if (Platform.OS === 'web') {
    console.log('endChat clicked - open rating modal on web');
    setShowRatingModal(true);
    return;
  }

  // 📱 Mobile: dùng Alert.confirm như bình thường
  Alert.alert(
    'Kết thúc chat',
    'Bạn muốn kết thúc và đánh giá phiên tư vấn này?',
    [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Kết thúc',
        style: 'destructive',
        onPress: () => setShowRatingModal(true),
      },
    ]
  );
};

  const submitRating = async () => {
  if (!sessionId || !user?.user_id) {
    Alert.alert('Thông báo', 'Phiên tư vấn đã kết thúc hoặc không tồn tại.');
    return;
  }

  if (!rating) {
    Alert.alert('Thông báo', 'Vui lòng chọn số sao đánh giá.');
    return;
  }

  try {
    const url =
      `${API_BASE}/live_chat/livechat/live-chat/end` +
      `?session_id=${sessionId}` +
      `&ended_by=${user.user_id}` +
      `&rating=${rating}`;

    const res = await fetch(url, { method: 'POST' });
    if (!res.ok) {
      throw new Error('End session failed');
    }

    // đóng WS
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close();
    }

    setSessionId(null);
    setQueueStatus('idle');
    setShowRatingModal(false);
    setRating(null);

    Alert.alert('Cảm ơn bạn', 'Đánh giá của bạn đã được ghi nhận.');
  } catch (e) {
    console.log('submitRating error', e);
    Alert.alert('Lỗi', 'Không thể kết thúc phiên tư vấn. Vui lòng thử lại.');
  }
};








  // Auto scroll
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // ====== RENDER UI ===================================================
  const renderMessage = ({ item }: { item: Message }) => {
    const isStudent = item.senderType === 'student';

    return (
      <View
        style={[
          styles.messageContainer,
          isStudent ? styles.studentMessage : styles.officerMessage,
        ]}
      >
        {!isStudent && (
          <Image
            source={{ uri: item.senderAvatar || 'https://i.pravatar.cc/150?img=1' }}
            style={styles.avatar}
          />
        )}

        <View
          style={[
            styles.messageBubble,
            isStudent
              ? [styles.studentBubble, { backgroundColor: colors.primary }]
              : [styles.officerBubble, { backgroundColor: colors.card, borderColor: colors.border }],
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isStudent ? styles.studentText : { color: colors.text },
            ]}
          >
            {item.text}
          </Text>
          <View style={styles.messageFooter}>
            <Text
              style={[
                styles.timestamp,
                isStudent ? styles.studentTimestamp : { color: colors.textSecondary },
              ]}
            >
              {item.timestamp.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
            {isStudent && (
              <CheckCheck
                size={16}
                color={item.read ? colors.primary : colors.textSecondary}
                style={styles.readIndicator}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderStatusBar = () => {
  let text = 'Nhấn "Yêu cầu tư vấn" để vào hàng đợi.';
  if (queueStatus === 'waiting') text = 'Bạn đang trong hàng đợi, vui lòng chờ chuyên viên chấp nhận...';
  if (queueStatus === 'accepted') text = 'Bạn đã được kết nối, hãy bắt đầu trò chuyện.';
  if (queueStatus === 'rejected') text = 'Yêu cầu bị từ chối. Bạn có thể gửi lại yêu cầu.';
  const showQueueButton = queueStatus === 'idle' || queueStatus === 'rejected';
  const showEndButton = queueStatus === 'accepted';
  return (
      <View
        style={[
          styles.statusBar,
          { backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <Text style={{ flex: 1, color: colors.textSecondary, fontSize: 13 }}>
          {text}
        </Text>

        {showQueueButton && (
          <TouchableOpacity
            style={[
              styles.queueButton,
              { backgroundColor: colors.primary, marginLeft: 8 },
            ]}
            onPress={joinQueue}
          >
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>
              Yêu cầu tư vấn
            </Text>
          </TouchableOpacity>
        )}

        {showEndButton && (
          <TouchableOpacity
            style={[
              styles.queueButton,
              { backgroundColor: colors.border, marginLeft: 8 },
            ]}
            onPress={endChat}
          >
            <Text style={{ color: colors.text, fontSize: 13, fontWeight: '600' }}>
              Kết thúc chat
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
};


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Tư vấn trực tiếp" showLogo={false} />

      {renderStatusBar()}

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        style={[styles.messagesList, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.inputContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={[
              styles.textInput,
              { backgroundColor: colors.background, color: colors.text, borderColor: colors.border },
            ]}
            placeholder="Nhập tin nhắn..."
            placeholderTextColor={colors.textSecondary}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={1000}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: newMessage.trim() ? colors.primary : colors.border },
            ]}
            onPress={sendMessage}
            disabled={!newMessage.trim()}
          >
            <Send size={18} color={newMessage.trim() ? '#FFFFFF' : colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
        {showRatingModal && (
        <View style={styles.ratingOverlay}>
          <View style={[styles.ratingContainer, { backgroundColor: colors.card }]}>
            <Text style={[styles.ratingTitle, { color: colors.text }]}>
              Đánh giá phiên tư vấn
            </Text>

            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  style={styles.starButton}
                >
                  <Star
                    size={30}
                    fill={rating && rating >= star ? '#F59E0B' : 'transparent'}
                    color={
                      rating && rating >= star ? '#F59E0B' : colors.textSecondary
                    }
                  />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.ratingActions}>
              <TouchableOpacity
                style={[styles.ratingButton, { backgroundColor: colors.border }]}
                onPress={() => {
                  setShowRatingModal(false);
                  setRating(null);
                }}
              >
                <Text style={{ color: colors.text }}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.ratingButton, { backgroundColor: colors.primary }]}
                onPress={submitRating}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>
                  Gửi đánh giá
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  queueButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  messagesList: { flex: 1 },
  messagesContent: { padding: 16, paddingBottom: 8 },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  studentMessage: { justifyContent: 'flex-end' },
  officerMessage: { justifyContent: 'flex-start' },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 20,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  studentBubble: { borderBottomRightRadius: 6, marginLeft: 'auto' },
  officerBubble: { borderBottomLeftRadius: 6, borderWidth: 1 },
  messageText: { fontSize: 16, lineHeight: 20 },
  studentText: { color: '#FFFFFF' },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timestamp: { fontSize: 11, fontWeight: '400' },
  studentTimestamp: { color: 'rgba(255, 255, 255, 0.7)' },
  readIndicator: { marginLeft: 4 },
  inputContainer: { borderTopWidth: 1 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  iconButton: { padding: 8, borderRadius: 20 },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    padding: 12,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
   ratingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingContainer: {
    width: '80%',
    borderRadius: 16,
    padding: 16,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  starButton: {
    marginHorizontal: 4,
  },
  ratingActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  ratingButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
});
