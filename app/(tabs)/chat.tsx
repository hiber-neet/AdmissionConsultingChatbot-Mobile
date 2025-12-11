import { useState, useCallback, useEffect, useRef } from "react";
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

export default function ChatScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [connected, setConnected] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const botBufferRef = useRef<string>("");

  // URL WebSocket (android emulator dùng 10.0.2.2)
  const WS_BASE = Platform.select({
    web: "ws://localhost:8000",
    ios: "ws://localhost:8000",
    android: "ws://10.0.2.2:8000",
  });
  const WS_URL = `${WS_BASE}/chat/ws/chat`;

  // Kết nối WebSocket
  useEffect(() => {
  const ws = new WebSocket(WS_URL);
  wsRef.current = ws;

  ws.onopen = () => {
    console.log("WS connected");
    setConnected(true);

    const userId = user?.user_id ?? null;
    ws.send(JSON.stringify({
      user_id: userId,
      session_id: null,        // để BE tự tạo lần đầu
    }));
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      if (data.event === "session_created") {
        setSessionId(data.session_id);      // chỉ set state, KHÔNG reconnect nữa
        console.log("Session created:", data.session_id);
        return;
      }

      if (data.event === "chunk") {
        botBufferRef.current += data.content;
        return;
      }

      if (data.event === "done") {
        const fullText = botBufferRef.current.trim();
        if (fullText) {
          const botMsg: IMessage = {
            _id: Math.random().toString(),
            text: fullText,
            createdAt: new Date(),
            user: {
              _id: 2,
              name: "FPT Bot",
              avatar:
                "https://cdn-icons-png.flaticon.com/512/4712/4712108.png",
            },
          };
          setMessages((prev) => GiftedChat.append(prev, [botMsg]));
        }
        botBufferRef.current = "";
        setLoading(false);
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

  // Lời chào local để có sẵn 1 tin nhắn
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Xin chào! Tôi là Chatbot tuyển sinh FPT. Bạn muốn hỏi gì về chương trình học hoặc quy trình xét tuyển?",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "FPT Bot",
          avatar:
            "https://cdn-icons-png.flaticon.com/512/4712/4712108.png",
        },
      },
    ]);
  }, []);

  // Gửi 1 tin nhắn (từ input)
  const onSend = useCallback(
    (newMessages: IMessage[] = []) => {
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
            avatar:
              "https://cdn-icons-png.flaticon.com/512/4712/4712108.png",
          },
        };
        setMessages((prev) => GiftedChat.append(prev, [errMsg]));
        return;
      }

      setLoading(true);
      ws.send(
        JSON.stringify({
          message: text,
        })
      );
    },
    []
  );

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const message: IMessage = {
      _id: Math.random().toString(),
      text: inputText.trim(),
      createdAt: new Date(),
      user: {
        _id: 1,
        name: user?.email || "Khách",
        avatar:
          "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
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
            marginVertical: 4,
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
          avatar:
            "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
        }}
        renderLoading={() => (
          <View style={{ alignItems: "center", marginVertical: 10 }}>
            <ActivityIndicator color={colors.primary} />
          </View>
        )}
        showUserAvatar
        messagesContainerStyle={{
          backgroundColor: colors.background,
        }}
        renderBubble={renderBubble}
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
