import { View, Text, TextInput, Pressable, ActivityIndicator, Alert } from "react-native";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { Link, router } from "expo-router";
import { validateEmail, validatePassword } from "../utils/validation";
import { Picker } from "@react-native-picker/picker";

export default function RegisterScreen() {
  const { register, loading } = useAuth();
  const { colors } = useTheme();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [major, setMajor] = useState<string>("");         
  const [region, setRegion] = useState<string>("");

  const onRegister = async () => {
    setError(null);
    
    // Basic validation
    if (!fullName.trim()) {
      setError("Vui lòng nhập họ tên");
      return;
    }
    if (!email.trim()) {
      setError("Vui lòng nhập email");
      return;
    }
    if (!phoneNumber.trim()) {
      setError("Vui lòng nhập số điện thoại");
      return;
    }
    if (!password.trim()) {
      setError("Vui lòng nhập mật khẩu");
      return;
    }
    if (password !== confirm) {
      setError("Mật khẩu nhập lại không trùng!");
      return;
    }
    
    // Validation
    if (!validateEmail(email)) {
      setError("Email không hợp lệ");
      return;
    }
    if (!validatePassword(password)) {
      setError("Mật khẩu phải có ít nhất 8 ký tự");
      return;
    }
    
    // Phone number validation (Vietnamese format)
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!phoneRegex.test(phoneNumber.trim())) {
      setError("Số điện thoại không hợp lệ");
      return;
    }
    
    try {
      await register({
        fullName,
        email,
        phone: phoneNumber,
        interest_desired_major: major, 
        interest_region:"", 
        password,
    });
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
          marginBottom: 16,
        }}
      >
        Đăng ký tài khoản
      </Text>

      <Text
        style={{
          fontSize: 16,
          color: colors.text,
          marginBottom: 24,
        }}
      >
        Tạo tài khoản để bắt đầu tư vấn tuyển sinh
      </Text>
      <TextInput
        placeholder="Họ và tên"
        placeholderTextColor={colors.textSecondary}
        autoCapitalize="words"
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          padding: 12,
          marginBottom: 20,
          backgroundColor: colors.card,
          color: colors.text,
        }}
        value={fullName}
        onChangeText={setFullName}
      />

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
        placeholder="Số điện thoại"
        placeholderTextColor={colors.textSecondary}
        keyboardType="phone-pad"
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          padding: 12,
          marginBottom: 20,
          backgroundColor: colors.card,
          color: colors.text,
        }}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

 <View
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          marginBottom: 20,
          overflow: "hidden",
          backgroundColor: colors.card,
        }}
      >
        <Picker
          selectedValue={major}
          onValueChange={(value) => setMajor(value)}
          style={{ color: colors.text }}
        >
          <Picker.Item label="Chọn ngành học" value="" />
          <Picker.Item label="Kỹ thuật phần mềm" value="software" />
          <Picker.Item label="Thiết kế đồ họa" value="design" />
          <Picker.Item label="Trí tuệ nhân tạo" value="ai" />
          <Picker.Item label="An ninh mạng" value="security" />
          <Picker.Item label="Kinh doanh số" value="business" />
          <Picker.Item label="Thiết kế trò chơi" value="game" />
        </Picker>
      </View>

      <TextInput
        placeholder="Mật khẩu"
        placeholderTextColor={colors.textSecondary}
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

      <TextInput
        placeholder="Nhập lại mật khẩu"
        placeholderTextColor={colors.textSecondary}
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
            Đã có tài khoản? <Text style={{ fontWeight: "bold", color: colors.primary }}>Đăng nhập ngay</Text>
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}
