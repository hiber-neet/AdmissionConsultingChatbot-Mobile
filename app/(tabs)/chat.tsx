import { useState, useCallback, useEffect } from "react";
import { View, Text, ActivityIndicator, SafeAreaView } from "react-native";
import { GiftedChat, IMessage, Message, MessageProps } from "react-native-gifted-chat";
import { colors } from "../../constants/colors";
import { useAuth } from "../../hooks/useAuth";
import { chatApi } from "../../services/api";
import { Link } from "expo-router";

export default function ChatScreen() {
  const { user } = useAuth();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Xin chào! Tôi là Chatbot tuyển sinh FPT. Bạn muốn hỏi gì về chương trình học hoặc quy trình xét tuyển?",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "FPT Bot",
          avatar: "https://cdn-icons-png.flaticon.com/512/4712/4712108.png",
        },
      },
    ]);
  }, []);

  // Hàm gửi tin nhắn
  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    setMessages((prev) => GiftedChat.append(prev, newMessages));
    const text = newMessages[0].text;

    try {
      setLoading(true);
      const reply = await chatApi.sendMessage(user?.id || "guest", text);
      const botMsg: IMessage = {
        _id: Math.random().toString(),
        text: reply,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "FPT Bot",
          avatar: "https://cdn-icons-png.flaticon.com/512/4712/4712108.png",
        },
      };
      setMessages((prev) => GiftedChat.append(prev, [botMsg]));
    } catch (e: any) {
      setMessages((prev) =>
        GiftedChat.append(prev, [
          {
            _id: Math.random().toString(),
            text: "Lỗi khi gửi tin. Vui lòng thử lại.",
            createdAt: new Date(),
            user: { _id: 2, name: "FPT Bot" },
          },
        ])
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: "700", color: colors.primary }}>
          Chatbot tuyển sinh 🎓
        </Text>

        <Link href="/" asChild>
          <Text style={{ color: colors.text, fontSize: 14 }}>🏠 Trang chủ</Text>
        </Link>
      </View>

      <GiftedChat
        messages={messages}
        onSend={(msgs) => onSend(msgs)}
        user={{
          _id: 1,
          name: user?.email || "Khách",
          avatar: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
        }}
        placeholder="Nhập tin nhắn..."
        renderLoading={() => (
          <View style={{ alignItems: "center", marginVertical: 10 }}>
            <ActivityIndicator color={colors.primary} />
          </View>
        )}
        alwaysShowSend
        showUserAvatar
  renderMessage={(props: MessageProps<IMessage>) => {
    const isBot = props.currentMessage?.user?._id === 2;

    // marginBottom áp vào *container* của message => avatar + bubble cùng nhích
    return (
      <Message
        {...props}
        containerStyle={{
          left:  { marginBottom: isBot ? 20 : 0 }, // bot (bên trái)
          right: { marginBottom: 20 },             // user (bên phải) nếu bạn muốn
        }}
      />
    );
  }}
      />

      {loading && (
        <View style={{ position: "absolute", bottom: 70, alignSelf: "center" }}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}
    </SafeAreaView>
  );
}
