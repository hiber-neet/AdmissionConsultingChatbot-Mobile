import { View, Text, TextInput, Pressable } from "react-native";
import { useState } from "react";
import { colors } from "../constants/colors";
import { Link } from "expo-router";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const onRegister = () => {
    if (password !== confirm) {
      alert("Mật khẩu nhập lại không trùng!");
      return;
    }
    alert(`Đăng ký thành công cho ${email}`);
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

      <Pressable
        onPress={onRegister}
        style={{
          backgroundColor: colors.primary,
          padding: 14,
          borderRadius: 12,
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>Đăng ký</Text>
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
