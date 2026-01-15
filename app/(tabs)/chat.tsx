import { useState, useCallback, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import Header from "@/components/layout/Header";
import { Send, Paperclip, Smile } from "lucide-react-native";
import { WS_BASE_URL } from "../../services/config";



export default function ChatScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();

const CHATBOT_PREFILL_KEY = "chatbot_prefill_message";

const [prefillMessage, setPrefillMessage] = useState<string | null>(null);
const prefillSentRef = useRef(false);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [connected, setConnected] = useState(false);

  // ✅ NEW giống ChatGuestPage: đánh dấu đã welcome
  const [hasWelcomed, setHasWelcomed] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const botBufferRef = useRef<string>("");

 
const WS_URL = `${WS_BASE_URL}/chat/ws/chat`;

  // helper flush buffer thành 1 tin nhắn bot
  const flushBotBuffer = () => {
    const fullText = (botBufferRef.current || "").trim();
    if (fullText) {
      const botMsg: IMessage = {
        _id: Math.random().toString(),
        text: fullText,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "FPT Bot",
          avatar: "https://cdn-icons-png.flaticon.com/512/4712/4712108.png",
        },
      };
      setMessages((prev) => GiftedChat.append(prev, [botMsg]));
    }
    botBufferRef.current = "";
    setLoading(false);
  };

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WS connected");
      setConnected(true);
      setHasWelcomed(false);
      botBufferRef.current = "";

      const userId = user?.user_id ?? null;
      ws.send(
        JSON.stringify({
          user_id: userId,
          session_id: null, // để BE tự tạo
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const ev = data?.event || data?.type;

        if (ev === "session_created") {
          setSessionId(data.session_id);
          console.log("Session created:", data.session_id);
          return;
        }

        if (ev === "chunk") {
          botBufferRef.current += data.content ?? "";
          return;
        }

        // ✅ QUAN TRỌNG: BE dùng "go" để kết thúc đoạn chào
        if (ev === "go") {
          flushBotBuffer();       // đẩy lời chào ra UI
          setHasWelcomed(true);   // mark đã chào
          return;
        }

        if (ev === "done") {
          flushBotBuffer();       // đẩy câu trả lời ra UI
          setHasWelcomed(true);
          return;
        }

        if (ev === "error") {
          // optional: hiển thị message lỗi nếu BE có message
          const errText =
            data?.message ||
            "Xin lỗi, đã có lỗi xảy ra. Bạn thử lại giúp mình nhé.";
          botBufferRef.current = ""; // tránh dính buffer
          setLoading(false);

          const botMsg: IMessage = {
            _id: Math.random().toString(),
            text: errText,
            createdAt: new Date(),
            user: {
              _id: 2,
              name: "FPT Bot",
              avatar: "https://cdn-icons-png.flaticon.com/512/4712/4712108.png",
            },
          };
          setMessages((prev) => GiftedChat.append(prev, [botMsg]));
          return;
        }
      } catch (err) {
        console.log("WS message parse error:", err);
      }
    };

    ws.onerror = (e) => {
      console.log("WS error:", e);
    };

    ws.onclose = () => {
      console.log("WS closed");
      setConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [WS_URL, user?.user_id]);

useFocusEffect(
  useCallback(() => {
    let mounted = true;

    (async () => {
      try {
        const raw = await AsyncStorage.getItem(CHATBOT_PREFILL_KEY);
        if (!raw) return;

        await AsyncStorage.removeItem(CHATBOT_PREFILL_KEY);

        // ✅ parse giống ChatGuestPage.jsx
        let initial = raw;
        try {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === "object" && "text" in parsed) {
            initial = String((parsed as any).text);
          } else if (parsed && typeof parsed === "object" && "answers" in parsed) {
            initial = `Phân tích "answers":${JSON.stringify((parsed as any).answers)}`;
          } else {
            initial = JSON.stringify(parsed);
          }
        } catch {
          // raw giữ nguyên
        }

        if (mounted) {
          prefillSentRef.current = false;
          setPrefillMessage(initial);
        }
      } catch {}
    })();

    return () => {
      mounted = false;
    };
  }, [])
);


useEffect(() => {
  if (!prefillMessage) return;
  if (!connected || !hasWelcomed) return;

  const ws = wsRef.current;
  if (!ws || ws.readyState !== WebSocket.OPEN) return;
  if (prefillSentRef.current) return;

  // ✅ hiển thị như 1 tin nhắn user
  const userMsg: IMessage = {
    _id: Math.random().toString(),
    text: prefillMessage,
    createdAt: new Date(),
    user: {
      _id: 1,
      name: user?.email || "Khách",
      avatar: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
    },
  };

  setMessages((prev) => GiftedChat.append(prev, [userMsg]));

  setLoading(true);
  botBufferRef.current = ""; // tránh dính buffer
  ws.send(JSON.stringify({ message: prefillMessage }));

  prefillSentRef.current = true;
  setPrefillMessage(null);
}, [prefillMessage, connected, hasWelcomed, user?.email]);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    if (!newMessages.length) return;

    const text = newMessages[0].text;
    setMessages((prev) => GiftedChat.append(prev, newMessages));
    setInputText("");

    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.log("WS not connected");
      const errMsg: IMessage = {
        _id: Math.random().toString(),
        text: "Không kết nối được tới máy chủ. Vui lòng thử lại sau.",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "FPT Bot",
          avatar: "https://cdn-icons-png.flaticon.com/512/4712/4712108.png",
        },
      };
      setMessages((prev) => GiftedChat.append(prev, [errMsg]));
      return;
    }

    setLoading(true);
    botBufferRef.current = ""; // ✅ reset buffer trước khi hỏi (tránh dính greeting)
    ws.send(JSON.stringify({ message: text }));
  }, []);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const message: IMessage = {
      _id: Math.random().toString(),
      text: inputText.trim(),
      createdAt: new Date(),
      user: {
        _id: 1,
        name: user?.email || "Khách",
        avatar: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
      },
    };

    onSend([message]);
  };

  const renderBubble = (props: any) => {
    return (
      <View
        style={[
          {
            padding: 12,
            borderRadius: 20,
            maxWidth: "75%",
            marginVertical: 10,
          },
          props.position === "right"
            ? {
                backgroundColor: colors.primary,
                borderBottomRightRadius: 6,
                alignSelf: "flex-end",
                marginRight: 8,
              }
            : {
                backgroundColor: colors.card,
                borderBottomLeftRadius: 6,
                alignSelf: "flex-start",
                marginLeft: 8,
                borderWidth: 1,
                borderColor: colors.border,
              },
        ]}
      >
        <Text
          style={{
            fontSize: 16,
            lineHeight: 20,
            color: props.position === "right" ? "#FFFFFF" : colors.text,
          }}
        >
          {props.currentMessage?.text}
        </Text>
        <Text
          style={{
            fontSize: 11,
            marginTop: 4,
            alignSelf: "flex-end",
            color:
              props.position === "right"
                ? "rgba(255, 255, 255, 0.7)"
                : colors.textSecondary,
          }}
        >
          {props.currentMessage?.createdAt
            ? new Date(props.currentMessage.createdAt).toLocaleTimeString(
                "vi-VN",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )
            : ""}
        </Text>
      </View>
    );
  };

  const renderInputToolbar = () => {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          backgroundColor: colors.card,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            paddingHorizontal: 16,
            paddingVertical: 12,
            gap: 8,
          }}
        >
          <TouchableOpacity
            style={{
              padding: 8,
              borderRadius: 20,
              backgroundColor: colors.background,
            }}
          >
            <Paperclip size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
              maxHeight: 100,
              backgroundColor: colors.background,
              color: colors.text,
            }}
            placeholder="Nhập tin nhắn..."
            placeholderTextColor={colors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
          />

          <TouchableOpacity
            style={{
              padding: 8,
              borderRadius: 20,
              backgroundColor: colors.background,
            }}
          >
            <Smile size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              padding: 12,
              borderRadius: 20,
              backgroundColor: inputText.trim()
                ? colors.primary
                : colors.border,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Send
              size={18}
              color={
                inputText.trim() ? "#FFFFFF" : colors.textSecondary
              }
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Chatbot tuyển sinh 🎓" showLogo={false} />

      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: 1,
          name: user?.email || "Khách",
          avatar: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
        }}
        renderLoading={() => (
          <View style={{ alignItems: "center", marginVertical: 10 }}>
            <ActivityIndicator color={colors.primary} />
          </View>
        )}
        renderBubble={renderBubble}
        showUserAvatar
        messagesContainerStyle={{ backgroundColor: colors.background }}
        renderInputToolbar={() => null}
      />

      {renderInputToolbar()}

      {loading && (
        <View
          style={{
            position: "absolute",
            bottom: 70,
            alignSelf: "center",
          }}
        >
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}
    </View>
  );
}
