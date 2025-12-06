// app/login.tsx (hoặc tương đương)
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { Link } from "expo-router";

export default function LoginScreen() {
  const { login, loading } = useAuth();
  const { colors } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    try {
      await login(email.trim(), password);
      // KHÔNG cần router.replace ở đây, useProtectedRoute sẽ tự đẩy sang /(tabs)
      // nếu bạn thích navigate tay thì có thể thêm:
      // router.replace("/(tabs)");
    } catch (e: any) {
      setError(e.message || "Đăng nhập thất bại");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 24,
        backgroundColor: colors.background,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "700",
          color: colors.primary,
          marginBottom: 16,
        }}
      >
        FPT Admissions
      </Text>

      <Text
        style={{
          fontSize: 16,
          color: colors.text,
          marginBottom: 24,
        }}
      >
        Đăng nhập để bắt đầu tư vấn tuyển sinh
      </Text>

      {/* Block gợi ý tài khoản demo (hiển thị cố định, không phụ thuộc Supabase) */}
      {/* <View
        style={{
          backgroundColor: colors.card,
          padding: 12,
          borderRadius: 8,
          marginBottom: 20,
          borderLeftWidth: 4,
          borderLeftColor: colors.primary,
        }}
      >
        <Text
          style={{ fontSize: 14, color: colors.text, fontWeight: "600" }}
        >
          Chế độ Demo:
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: colors.textSecondary,
            marginTop: 4,
          }}
        >
          admin@fpt.edu.vn / 123
        </Text>
      </View> */}

      <TextInput
        placeholder="Email"
        placeholderTextColor={colors.textSecondary}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          padding: 12,
          marginBottom: 20,
          backgroundColor: colors.card,
          color: colors.text,
        }}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Mật khẩu"
        placeholderTextColor={colors.textSecondary}
        autoCapitalize="none"
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          padding: 12,
          marginBottom: 20,
          backgroundColor: colors.card,
          color: colors.text,
        }}
        value={password}
        onChangeText={setPassword}
      />

      {error && (
        <Text style={{ color: "red", marginBottom: 8 }}>{error}</Text>
      )}

      <Pressable
        onPress={onSubmit}
        disabled={loading}
        style={{
          backgroundColor: colors.primary,
          padding: 14,
          borderRadius: 12,
          alignItems: "center",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            Đăng nhập
          </Text>
        )}
      </Pressable>

      <Link href="/register" asChild>
        <Pressable style={{ marginTop: 20 }}>
          <Text style={{ color: colors.text, textAlign: "center" }}>
            Chưa có tài khoản?{" "}
            <Text
              style={{ fontWeight: "bold", color: colors.primary }}
            >
              Đăng ký ngay
            </Text>
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}
