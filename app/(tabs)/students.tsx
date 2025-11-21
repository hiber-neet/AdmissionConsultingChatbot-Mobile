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
  Circle,
  Paperclip,
  Smile,
  CheckCheck,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  text: string;
  sender: 'student' | 'officer';
  timestamp: Date;
  delivered: boolean;
  read: boolean;
  senderName?: string;
  senderAvatar?: string;
}

interface AdmissionOfficer {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date;
  specialization: string;
}

const admissionOfficers: AdmissionOfficer[] = [
  {
    id: 'officer1',
    name: 'Thầy Nguyễn Văn Minh',
    avatar: 'https://i.pravatar.cc/150?img=1',
    status: 'online',
    specialization: 'Khoa học Máy tính',
  },
  {
    id: 'officer2',
    name: 'Cô Trần Thị Lan',
    avatar: 'https://i.pravatar.cc/150?img=2',
    status: 'online',
    specialization: 'Quản trị Kinh doanh',
  },
  {
    id: 'officer3',
    name: 'Thầy Lê Hoàng Nam',
    avatar: 'https://i.pravatar.cc/150?img=3',
    status: 'away',
    lastSeen: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    specialization: 'Kỹ thuật Phần mềm',
  },
];

const initialMessages: Message[] = [
  {
    id: '1',
    text: 'Chào em! Tôi là thầy Minh từ phòng tuyển sinh. Em có câu hỏi gì về chương trình học không?',
    sender: 'officer',
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    delivered: true,
    read: true,
    senderName: 'Thầy Nguyễn Văn Minh',
    senderAvatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    text: 'Chào thầy ạ! Em muốn tìm hiểu về chương trình Khoa học Máy tính và điều kiện tuyển sinh ạ.',
    sender: 'student',
    timestamp: new Date(Date.now() - 50 * 60 * 1000), // 50 minutes ago
    delivered: true,
    read: true,
  },
  {
    id: '3',
    text: 'Tốt lắm! Chương trình Khoa học Máy tính của chúng ta có 4 năm học với nhiều chuyên ngành như AI, Phần mềm, Mạng máy tính. Điểm chuẩn năm ngoái là 24.5 điểm.',
    sender: 'officer',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    delivered: true,
    read: true,
    senderName: 'Thầy Nguyễn Văn Minh',
    senderAvatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '4',
    text: 'Em có thể gửi bảng điểm của em để thầy tư vấn cụ thể hơn không?',
    sender: 'officer',
    timestamp: new Date(Date.now() - 40 * 60 * 1000),
    delivered: true,
    read: true,
    senderName: 'Thầy Nguyễn Văn Minh',
    senderAvatar: 'https://i.pravatar.cc/150?img=1',
  },
];

export default function StudentsScreen() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [currentOfficer] = useState(admissionOfficers[0]);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim() === '') return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: 'student',
      timestamp: new Date(),
      delivered: true,
      read: false,
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate officer response after 2-3 seconds
    setTimeout(() => {
      const responses = [
        'Cảm ơn em đã chia sẻ! Để tôi xem xét và tư vấn cho em.',
        'Thông tin rất hữu ích. Em có thể cho biết thêm về sở thích và định hướng tương lai không?',
        'Tôi sẽ kiểm tra và phản hồi em trong ít phút nữa.',
        'Dựa trên thông tin này, tôi nghĩ em có cơ hội tốt với chương trình này.',
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const officerMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'officer',
        timestamp: new Date(),
        delivered: true,
        read: false,
        senderName: currentOfficer.name,
        senderAvatar: currentOfficer.avatar,
      };

      setMessages(prev => [...prev, officerMessage]);
    }, Math.random() * 2000 + 1000); // Random delay 1-3 seconds
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isStudent = item.sender === 'student';
    
    return (
      <View style={[
        styles.messageContainer,
        isStudent ? styles.studentMessage : styles.officerMessage
      ]}>
        {!isStudent && (
          <Image source={{ uri: item.senderAvatar }} style={styles.avatar} />
        )}
        
        <View style={[
          styles.messageBubble,
          isStudent ? styles.studentBubble : styles.officerBubble
        ]}>
          {!isStudent && (
            <Text style={styles.senderName}>{item.senderName}</Text>
          )}
          <Text style={[
            styles.messageText,
            isStudent ? styles.studentText : styles.officerText
          ]}>
            {item.text}
          </Text>
          <View style={styles.messageFooter}>
            <Text style={[
              styles.timestamp,
              isStudent ? styles.studentTimestamp : styles.officerTimestamp
            ]}>
              {item.timestamp.toLocaleTimeString('vi-VN', { 
                hour: '2-digit', 
                minute: '2-digit' 
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

  const renderHeader = () => (
    <View style={styles.chatHeader}>
      <View style={styles.officerInfo}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: currentOfficer.avatar }} style={styles.headerAvatar} />
          <View style={[
            styles.statusIndicator,
            { backgroundColor: currentOfficer.status === 'online' ? '#10B981' : '#6B7280' }
          ]} />
        </View>
        <View style={styles.officerDetails}>
          <Text style={styles.officerName}>{currentOfficer.name}</Text>
          <Text style={styles.officerStatus}>
            {currentOfficer.status === 'online' 
              ? 'Đang hoạt động' 
              : `Hoạt động ${currentOfficer.lastSeen?.toLocaleTimeString('vi-VN') || ''}`
            }
          </Text>
          <Text style={styles.specialization}>{currentOfficer.specialization}</Text>
        </View>
      </View>
      <View style={styles.chatActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Phone size={20} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Video size={20} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <MoreVertical size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Tư vấn Tuyển sinh" showLogo={false} />
      
      {renderHeader()}
      
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TouchableOpacity style={styles.attachButton}>
            <Paperclip size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.textInput}
            placeholder="Nhập tin nhắn..."
            placeholderTextColor={colors.textSecondary}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={1000}
          />
          
          <TouchableOpacity style={styles.emojiButton}>
            <Smile size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.sendButton, newMessage.trim() ? styles.sendButtonActive : null]}
            onPress={sendMessage}
            disabled={!newMessage.trim()}
          >
            <Send size={18} color={newMessage.trim() ? '#FFFFFF' : colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  chatHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  officerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
  },
  headerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  officerDetails: {
    marginLeft: 12,
    flex: 1,
  },
  officerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  officerStatus: {
    fontSize: 12,
    color: '#10B981',
    marginBottom: 2,
  },
  specialization: {
    fontSize: 11,
    color: '#6B7280',
  },
  chatActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  messagesList: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  studentMessage: {
    justifyContent: 'flex-end',
  },
  officerMessage: {
    justifyContent: 'flex-start',
  },
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
  studentBubble: {
    backgroundColor: '#3B82F6',
    borderBottomRightRadius: 6,
    marginLeft: 'auto',
  },
  officerBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  senderName: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  studentText: {
    color: '#FFFFFF',
  },
  officerText: {
    color: '#111827',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 11,
    fontWeight: '400',
  },
  studentTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  officerTimestamp: {
    color: '#6B7280',
  },
  readIndicator: {
    marginLeft: 4,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  attachButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    backgroundColor: '#F9FAFB',
  },
  emojiButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  sendButton: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#3B82F6',
  },
});