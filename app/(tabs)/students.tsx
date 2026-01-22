import React, { useEffect, useMemo, useRef, useState } from "react";
import EventSource, { EventSourceListener } from "react-native-sse";
import "react-native-url-polyfill/auto";
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
} from "react-native";
import Header from "@/components/layout/Header";
import { Send, CheckCheck, Star } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE_URL, WS_BASE_URL } from "../../services/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

type QueueStatus = "idle" | "in_queue" | "chatting" | "ended" | "timeout" | "rejected";

interface Message {
  id: string;
  text: string;
  senderId: number;
  senderType: "student" | "officer";
  timestamp: Date;
  delivered: boolean;
  read: boolean;
  senderName?: string;
  senderAvatar?: string;
}

// Shape message giống liveMessages  
type LiveMsg = {
  interaction_id?: number | string;
  sender_id: number;
  message_text: string;
  timestamp?: string;
};

export default function StudentsScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();

const API_BASE = API_BASE_URL;      
const WS_BASE  = WS_BASE_URL;

  const flatListRef = useRef<FlatList>(null);

  const wsRef = useRef<WebSocket | null>(null);
const sseRef = useRef<any>(null);

  const queueTimeoutRef = useRef<any>(null);

  const [queueStatus, setQueueStatus] = useState<QueueStatus>("idle");
  const [queueId, setQueueId] = useState<number | null>(null);

  const [sessionId, setSessionId] = useState<number | null>(null);

  // messages UI (RN)
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // rating modal
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState<number | null>(null);

  // timeout modal  
  const [showQueueTimeoutModal, setShowQueueTimeoutModal] = useState(false);

  const meId = useMemo(() => Number(user?.user_id || 0), [user?.user_id]);

  // =========================
  // Helpers
  // =========================
  const closeWS = () => {
    const ws = wsRef.current;
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
      try {
        ws.close();
      } catch {}
    }
    wsRef.current = null;
  };

  const closeSSE = () => {
    const es = sseRef.current;
    if (es) {
      try {
        es.close();
      } catch {}
    }
    sseRef.current = null;
  };

  const resetChatState = () => {
    closeWS();
    setSessionId(null);
    setQueueId(null);
    setMessages([]);
  };

  // =========================
  // JOIN / CANCEL QUEUE
  // =========================
  const joinQueue = async () => {
    if (!meId) {
      Alert.alert("Lỗi", "Không tìm thấy thông tin sinh viên");
      return;
    }

    try {
      // ✅ đúng với live_chat_controller.py: /live-chat/join_queue?customer_id=...
      const url = `${API_BASE}/live_chat/livechat/live-chat/join_queue?customer_id=${meId}`;
      const res = await fetch(url, { method: "POST" });
      const data = await res.json();

      if (!res.ok || data?.error) {
        throw new Error(data?.error || "Join queue failed");
      }

      setQueueStatus("in_queue");
      setQueueId(data.queue_id ?? data.id ?? null);
      // SSE effect sẽ tự mở vì queueStatus === in_queue
    } catch (e) {
      console.log("joinQueue error", e);
      Alert.alert("Lỗi", "Không thể gửi yêu cầu tư vấn, vui lòng thử lại.");
    }
  };

  const cancelQueue = async () => {
    if (!meId) return;
    try {
      const url = `${API_BASE}/live_chat/livechat/customer/cancel_queue?customer_id=${meId}`;
      const res = await fetch(url, { method: "POST" });
      const data = await res.json();

      if (!res.ok || data?.error) {
        throw new Error(data?.error || "Cancel failed");
      }

      setQueueStatus("idle");
      setQueueId(null);
    } catch (e) {
      console.log("cancelQueue error", e);
      Alert.alert("Lỗi", "Không thể hủy yêu cầu, vui lòng thử lại.");
    }
  };

  // =========================
  // SSE: lắng nghe accepted / rejected / chat_ended
  // =========================
useEffect(() => {
  if (!meId) return;

  // nếu không ở trạng thái cần SSE thì đóng luôn
  if (queueStatus !== "in_queue" && queueStatus !== "chatting") {
    if (sseRef.current) {
      try {
        sseRef.current.removeAllEventListeners?.();
        sseRef.current.close?.();
      } catch {}
      sseRef.current = null;
    }
    return;
  }

  let cancelled = false;

  (async () => {
    // lấy access_token nếu SSE endpoint cần auth
    const token = await AsyncStorage.getItem("access_token");

    const sseUrl = `${API_BASE}/live_chat/livechat/sse/customer/${meId}`;

    // đóng SSE cũ
    if (sseRef.current) {
      try {
        sseRef.current.removeAllEventListeners?.();
        sseRef.current.close?.();
      } catch {}
      sseRef.current = null;
    }

    const es = new EventSource(sseUrl, {
      headers: token
        ? {
            Authorization: {
              toString: () => `Bearer ${token}`,
            },
          }
        : undefined,
    });

    sseRef.current = es;

const safeJson = (raw?: string | null) => {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

    const onMessage: EventSourceListener = (event) => {
      if (cancelled) return;

      if (event.type === "open") {
        console.log("[SSE] open");
        return;
      }

      if (event.type === "error" || event.type === "exception") {
        console.log("[SSE] error", event);
        return;
      }

      if (event.type !== "message") return;

      const payload = safeJson(event.data);
      if (!payload) return;

      const ev = payload.event || payload?.data?.event;
      const data = payload.data || payload;

      if (!ev || ev === "ping" || ev === "connected") return;

      console.log("[SSE]", ev, data);

      if (ev === "queued") {
        setQueueStatus("in_queue");
        setQueueId(data.queue_id ?? data.id ?? null);
        return;
      }

      if (ev === "accepted") {
        const sid = Number(data.session_id || 0);
        if (!sid) return;

        setSessionId(sid);
        setQueueStatus("chatting");
        setShowQueueTimeoutModal(false);
        Alert.alert("Thông báo", "Bạn đã được kết nối với chuyên viên tuyển sinh.");
        return;
      }

      if (ev === "rejected") {
        setQueueStatus("rejected");
        resetChatState();
        Alert.alert("Thông báo", data.reason || "Yêu cầu tư vấn đã bị từ chối.");
        return;
      }

      if (ev === "chat_ended") {
        closeWS();
        setQueueStatus("ended");
        setSessionId(null);
        setMessages([]);
        setShowRatingModal(true);
        setRating(null);
        Alert.alert("Thông báo", "Phiên tư vấn đã kết thúc.");
        return;
      }
    };

    // lắng nghe các event cơ bản
    es.addEventListener("open", onMessage);
    es.addEventListener("message", onMessage);
    es.addEventListener("error", onMessage);
 es.addEventListener("exception" as any, onMessage as any);
  })();

  return () => {
    cancelled = true;
    if (sseRef.current) {
      try {
        sseRef.current.removeAllEventListeners?.();
        sseRef.current.close?.();
      } catch {}
      sseRef.current = null;
    }
  };
}, [API_BASE, meId, queueStatus]);

  // =========================
  // AUTO TIMEOUT 3 PHÚT (giống UserProfile)
  // =========================
  useEffect(() => {
    if (queueStatus === "in_queue") {
      if (queueTimeoutRef.current) clearTimeout(queueTimeoutRef.current);

      queueTimeoutRef.current = setTimeout(async () => {
        // cố gắng cancel queue trên server
        try {
          await cancelQueue();
        } catch {}

        setQueueStatus("timeout");
        setQueueId(null);
        setShowQueueTimeoutModal(true);
      }, 3 * 60 * 1000);
    } else {
      if (queueTimeoutRef.current) {
        clearTimeout(queueTimeoutRef.current);
        queueTimeoutRef.current = null;
      }
    }

    return () => {
      if (queueTimeoutRef.current) {
        clearTimeout(queueTimeoutRef.current);
        queueTimeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queueStatus]);

  const handleReconnectAfterTimeout = async () => {
    setShowQueueTimeoutModal(false);
    resetChatState();
    setQueueStatus("idle");
    await joinQueue();
  };

  // =========================
  // WS: connect khi có sessionId + đang chatting
  // =========================
  useEffect(() => {
    if (!sessionId || queueStatus !== "chatting") return;

    // đóng WS cũ nếu có
    closeWS();

    const wsUrl = `${WS_BASE}/live_chat/livechat/chat/${sessionId}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("[WS] connected session:", sessionId);
      // Load history khi vừa connect (giống kiểu "có session thì xem lại")
      fetchHistory(sessionId).catch(() => {});
    };

    ws.onmessage = (event) => {
      if (event.type === "message" && !event.data) return;
      let data: any;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }

      const ev = data.event;
      if (ev === "chat_connected") return;

      if (ev === "message") {
        // map về format giống web: message_text
        const incoming: LiveMsg = {
          interaction_id: data.interaction_id,
          sender_id: Number(data.sender_id),
          message_text: data.message ?? data.message_text ?? "",
          timestamp: data.timestamp,
        };

        // ignore echo của mình
        if (Number(incoming.sender_id) === meId) return;

        const msg: Message = {
          id: String(incoming.interaction_id ?? `${Date.now()}-${Math.random()}`),
          text: incoming.message_text,
          senderId: Number(incoming.sender_id),
          senderType: "officer",
          timestamp: incoming.timestamp ? new Date(incoming.timestamp) : new Date(),
          delivered: true,
          read: true,
        };

        setMessages((prev) => [...prev, msg]);
        return;
      }

      if (ev === "chat_ended") {
        closeWS();
        setQueueStatus("ended");
        setSessionId(null);
        setMessages([]);
        setShowRatingModal(true);
        setRating(null);
        Alert.alert("Thông báo", "Phiên tư vấn đã kết thúc.");
      }
    };

    ws.onerror = (e) => {
      console.log("[WS] error", e);
    };

    ws.onclose = () => {
      console.log("[WS] closed");
    };

    return () => {
      closeWS();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [WS_BASE, sessionId, queueStatus, meId]);

  // =========================
  // LOAD HISTORY (endpoint có sẵn)
  // =========================
  const fetchHistory = async (sid: number) => {
    try {
      const url = `${API_BASE}/live_chat/livechat/session/${sid}/messages`;
      const res = await fetch(url);
      if (!res.ok) return;

      const list = await res.json();
      if (!Array.isArray(list)) return;

      const mapped: Message[] = list.map((m: any) => {
        const sender = Number(m.sender_id);
        const isMe = sender === meId;

        return {
          id: String(m.interaction_id ?? `${m.timestamp}-${Math.random()}`),
          text: m.message_text ?? m.message ?? "",
          senderId: sender,
          senderType: isMe ? "student" : "officer",
          timestamp: m.timestamp ? new Date(m.timestamp) : new Date(),
          delivered: true,
          read: !isMe,
        };
      });

      setMessages(mapped);
    } catch (e) {
      console.log("fetchHistory error", e);
    }
  };

  // =========================
  // SEND MESSAGE
  // =========================
  const sendMessage = () => {
    const text = newMessage.trim();
    if (!text) return;

    if (queueStatus !== "chatting" || !sessionId) {
      Alert.alert("Không thể gửi", "Bạn chưa được kết nối với tư vấn viên.");
      return;
    }

    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      Alert.alert("Lỗi", "Kết nối chat bị ngắt, vui lòng thử lại.");
      return;
    }

    const localMsg: Message = {
      id: String(Date.now()),
      text,
      senderId: meId,
      senderType: "student",
      timestamp: new Date(),
      delivered: true,
      read: false,
    };

    setMessages((prev) => [...prev, localMsg]);
    setNewMessage("");

    ws.send(JSON.stringify({ sender_id: meId, message: text }));
  };

  // =========================
  // END LIVE CHAT
  // =========================
  const endChat = async () => {
    if (!sessionId || !meId) {
      Alert.alert("Thông báo", "Hiện không có phiên tư vấn nào đang hoạt động.");
      return;
    }

    try {
      const url = `${API_BASE}/live_chat/livechat/live-chat/end?session_id=${sessionId}&ended_by=${meId}`;
      const res = await fetch(url, { method: "POST" });
      const data = await res.json();

      if (!res.ok || data?.error) throw new Error(data?.error || "End failed");

      closeWS();
      setQueueStatus("ended");
      setSessionId(null);
      setMessages([]);
      setShowRatingModal(true);
      setRating(null);
    } catch (e) {
      console.log("endChat error", e);
      Alert.alert("Lỗi", "Không thể kết thúc phiên tư vấn. Vui lòng thử lại.");
    }
  };

  // rating submit 
  const submitRating = () => {
    if (!rating) {
      Alert.alert("Thông báo", "Vui lòng chọn số sao đánh giá.");
      return;
    }
    setShowRatingModal(false);
    setRating(null);
    Alert.alert("Cảm ơn bạn", "Đánh giá của bạn đã được ghi nhận.");
  };

  // cleanup when unmount
  useEffect(() => {
    return () => {
      closeSSE();
      closeWS();
      if (queueTimeoutRef.current) clearTimeout(queueTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto scroll
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  // =========================
  // RENDER
  // =========================
  const renderMessage = ({ item }: { item: Message }) => {
    const isStudent = item.senderType === "student";

    return (
      <View
        style={[
          styles.messageContainer,
          isStudent ? styles.studentMessage : styles.officerMessage,
        ]}
      >
        {/* {!isStudent && (
          <Image
            source={{ uri: item.senderAvatar || "https://i.pravatar.cc/150?img=1" }}
            style={styles.avatar}
          />
        )} */}

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
              {item.timestamp.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
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
    if (queueStatus === "in_queue") text = "Bạn đang trong hàng đợi, vui lòng chờ tư vấn viên...";
    if (queueStatus === "chatting") text = "Bạn đã được kết nối, hãy bắt đầu trò chuyện.";
    if (queueStatus === "ended") text = "Phiên chat đã kết thúc. Bạn có thể bắt đầu lại.";
    if (queueStatus === "timeout") text = "Tư vấn viên đang bận. Vui lòng thử kết nối lại.";
    if (queueStatus === "rejected") text = "Yêu cầu bị từ chối. Bạn có thể gửi lại yêu cầu.";

    const showJoinButton = queueStatus === "idle" || queueStatus === "ended" || queueStatus === "timeout" || queueStatus === "rejected";
    const showCancelButton = queueStatus === "in_queue";
    const showEndButton = queueStatus === "chatting";

    return (
      <View style={[styles.statusBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={{ flex: 1, color: colors.textSecondary, fontSize: 13 }}>{text}</Text>

        {showCancelButton && (
          <TouchableOpacity
            style={[styles.queueButton, { backgroundColor: colors.border, marginLeft: 8 }]}
            onPress={cancelQueue}
          >
            <Text style={{ color: colors.text, fontSize: 13, fontWeight: "600" }}>
              Hủy
            </Text>
          </TouchableOpacity>
        )}

        {showJoinButton && (
          <TouchableOpacity
            style={[styles.queueButton, { backgroundColor: colors.primary, marginLeft: 8 }]}
            onPress={joinQueue}
          >
            <Text style={{ color: "#fff", fontSize: 13, fontWeight: "600" }}>
              Yêu cầu tư vấn
            </Text>
          </TouchableOpacity>
        )}

        {showEndButton && (
          <TouchableOpacity
            style={[styles.queueButton, { backgroundColor: colors.border, marginLeft: 8 }]}
            onPress={endChat}
          >
            <Text style={{ color: colors.text, fontSize: 13, fontWeight: "600" }}>
              Kết thúc
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
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
  >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        style={[styles.messagesList, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      />

 
        <View style={styles.inputWrapper}>
          <TextInput
            style={[
              styles.textInput,
              { backgroundColor: colors.background, color: colors.text, borderColor: colors.border },
            ]}
            placeholder={
              queueStatus === "chatting" ? "Nhập tin nhắn..." : "Hãy vào hàng chờ để bắt đầu chat..."
            }
            placeholderTextColor={colors.textSecondary}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={1000}
            editable={queueStatus === "chatting"}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: newMessage.trim() && queueStatus === "chatting" ? colors.primary : colors.border },
            ]}
            onPress={sendMessage}
            disabled={!newMessage.trim() || queueStatus !== "chatting"}
          >
            <Send size={18} color={newMessage.trim() && queueStatus === "chatting" ? "#FFFFFF" : colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Timeout modal */}
      {showQueueTimeoutModal && (
        <View style={styles.ratingOverlay}>
          <View style={[styles.ratingContainer, { backgroundColor: colors.card }]}>
            <Text style={[styles.ratingTitle, { color: colors.text }]}>
              Các tư vấn viên đang bận
            </Text>
            <Text style={{ color: colors.textSecondary, textAlign: "center", marginBottom: 12 }}>
              Vui lòng thử kết nối lại sau ít phút.
            </Text>

            <View style={styles.ratingActions}>
              <TouchableOpacity
                style={[styles.ratingButton, { backgroundColor: colors.primary }]}
                onPress={handleReconnectAfterTimeout}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>Kết nối lại</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Rating modal */}
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
                    fill={rating && rating >= star ? "#F59E0B" : "transparent"}
                    color={rating && rating >= star ? "#F59E0B" : colors.textSecondary}
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
                <Text style={{ color: colors.text }}>Bỏ qua</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.ratingButton, { backgroundColor: colors.primary }]}
                onPress={submitRating}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>
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
    flexDirection: "row",
    alignItems: "center",
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
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-end",
  },
  studentMessage: { justifyContent: "flex-end" },
  officerMessage: { justifyContent: "flex-start" },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    marginRight: 8,
  },

  messageBubble: {
    maxWidth: "75%",
    borderRadius: 20,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  studentBubble: { borderBottomRightRadius: 6, marginLeft: "auto" },
  officerBubble: { borderBottomLeftRadius: 6, borderWidth: 1 },

  messageText: { fontSize: 16, lineHeight: 20 },
  studentText: { color: "#FFFFFF" },

  messageFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  timestamp: { fontSize: 11, fontWeight: "400" },
  studentTimestamp: { color: "rgba(255, 255, 255, 0.7)" },
  readIndicator: { marginLeft: 4 },

  inputContainer: { borderTopWidth: 1 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
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
    justifyContent: "center",
    alignItems: "center",
  },

  ratingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  ratingContainer: {
    width: "80%",
    borderRadius: 16,
    padding: 16,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  starButton: { marginHorizontal: 4 },
  ratingActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  ratingButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
});
