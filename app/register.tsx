import { View, Text, TextInput, Pressable, ActivityIndicator } from "react-native";
import { useState } from "react";
import { colors } from "../constants/colors";
import { useAuth } from "../contexts/AuthContext";
import { Link, router } from "expo-router";
import { validateEmail, validatePassword } from "../utils/validation";

export default function RegisterScreen() {
  const { register, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onRegister = async () => {
    setError(null);
    
    // Validation
    if (!validateEmail(email)) {
      setError("Email không hợp lệ");
      return;
    }
    if (!validatePassword(password)) {
      setError("Mật khẩu phải có ít nhất 8 ký tự");
      return;
    }
    if (password !== confirm) {
      setError("Mật khẩu nhập lại không trùng!");
      return;
    }
    
    try {
      await register(email, password);
      alert("Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.");
      router.replace("/login");
    } catch (e: any) {
      setError(e.message || "Đăng ký thất bại");
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
          marginBottom: 20,
        }}
      >
        Tạo tài khoản mới
      </Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          padding: 12,
          marginBottom: 20,
        }}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Mật khẩu"
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          padding: 12,
          marginBottom: 20,
        }}
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        placeholder="Nhập lại mật khẩu"
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          padding: 12,
          marginBottom: 20,
        }}
        value={confirm}
        onChangeText={setConfirm}
      />

      {error && <Text style={{color : "red" , marginBottom: 8}}>{error}</Text>}
      
      <Pressable
        onPress={onRegister}
        disabled={loading}
        style={{
          backgroundColor: colors.primary,
          padding: 14,
          borderRadius: 12,
          alignItems: "center",
          marginBottom: 20,
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff"/>
        ) : (
          <Text style={{ color: "#fff", fontWeight: "600" }}>Đăng ký</Text>
        )}
      </Pressable>

 
      <Link href="/login" asChild>
        <Pressable>
          <Text style={{ color: colors.text, textAlign: "center" }}>
             Đã có tài khoản? Đăng nhập
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}
