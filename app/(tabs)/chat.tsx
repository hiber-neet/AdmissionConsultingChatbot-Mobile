import { useState, useCallback, useEffect } from "react";
import { View, Text, ActivityIndicator, SafeAreaView, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView } from "react-native";
import { GiftedChat, IMessage, Message, MessageProps } from "react-native-gifted-chat";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { chatApi } from "../../services/api";
import { Link } from "expo-router";
import Header from '@/components/layout/Header';
import { Send, Paperclip, Smile } from 'lucide-react-native';

export default function ChatScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');

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
    setInputText(''); // Clear input after sending

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
      console.error('Chat error:', e);
      const errorMsg = e.message || "Lỗi khi gửi tin. Vui lòng kiểm tra kết nối mạng và thử lại.";
      setMessages((prev) =>
        GiftedChat.append(prev, [
          {
            _id: Math.random().toString(),
            text: errorMsg,
            createdAt: new Date(),
            user: { _id: 2, name: "FPT Bot", avatar: "https://cdn-icons-png.flaticon.com/512/4712/4712108.png" },
          },
        ])
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  const sendMessage = () => {
    if (inputText.trim() === '') return;

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
            maxWidth: '75%',
            marginVertical: 4,
          },
          props.position === 'right'
            ? {
                backgroundColor: colors.primary,
                borderBottomRightRadius: 6,
                alignSelf: 'flex-end',
                marginRight: 8,
              }
            : {
                backgroundColor: colors.card,
                borderBottomLeftRadius: 6,
                alignSelf: 'flex-start',
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
            color: props.position === 'right' ? '#FFFFFF' : colors.text,
          }}
        >
          {props.currentMessage?.text}
        </Text>
        <Text
          style={{
            fontSize: 11,
            marginTop: 4,
            alignSelf: 'flex-end',
            color: props.position === 'right' ? 'rgba(255, 255, 255, 0.7)' : colors.textSecondary,
          }}
        >
          {props.currentMessage?.createdAt
            ? new Date(props.currentMessage.createdAt).toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
              })
            : ''}
        </Text>
      </View>
    );
  };

  const renderInputToolbar = (props: any) => {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          backgroundColor: colors.card,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            paddingHorizontal: 16,
            paddingVertical: 12,
            gap: 8,
          }}
        >
          <TouchableOpacity style={{
            padding: 8,
            borderRadius: 20,
            backgroundColor: colors.background,
          }}>
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
          
          <TouchableOpacity style={{
            padding: 8,
            borderRadius: 20,
            backgroundColor: colors.background,
          }}>
            <Smile size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={{
              padding: 12,
              borderRadius: 20,
              backgroundColor: inputText.trim() ? colors.primary : colors.border,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Send size={18} color={inputText.trim() ? '#FFFFFF' : colors.textSecondary} />
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
        onSend={(msgs) => onSend(msgs)}
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
        showUserAvatar
        messagesContainerStyle={{
          backgroundColor: colors.background,
        }}
        renderBubble={renderBubble}
        renderInputToolbar={() => null}
      />
      
      {renderInputToolbar({})}

      {loading && (
        <View style={{ position: "absolute", bottom: 70, alignSelf: "center" }}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}
    </View>
  );
}
