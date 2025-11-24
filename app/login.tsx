import { View, Text, TextInput, Pressable, ActivityIndicator, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { Link, router } from "expo-router";
import { isSupabaseConfigured } from "../services/supabase";

export default function LoginScreen(){
    const {login, loading} = useAuth();
    const { colors } = useTheme();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        if (!isSupabaseConfigured) {
            Alert.alert(
                "Chế độ Demo",
                "Supabase chưa được cấu hình. Sử dụng tài khoản demo:\n\n• admin@fpt.edu.vn / 123\n• demo@fpt.edu.vn / demo123\n• test@student.fpt.edu.vn / test123",
                [{ text: "Đóng" }]
            );
        }
    }, []);
    const onSubmit = async () => {
        setError(null);
        try{
            await login(email.trim(), password);
            router.replace('/(tabs)');
        }catch (e : any){
            setError(e.message || "Đăng nhập thất bại");
        }
    };

 
    return (
        <View style={{
            flex: 1,
            justifyContent: "center",
            padding: 24,
            backgroundColor: colors.background,
        }}>

<Text style={{
fontSize: 28,
fontWeight: "700",
color: colors.primary,
marginBottom: 16
}}>
    FPT Admissions
</Text>

<Text 
style={{
          fontSize: 16,
          color: colors.text,
          marginBottom: 24,
        }}>
Đăng nhập để bắt đầu tư vấn tuyển sinh
</Text>

{!isSupabaseConfigured && (
  <View style={{
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  }}>
    <Text style={{ fontSize: 14, color: colors.text, fontWeight: '600' }}>Chế độ Demo:</Text>
    <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>
      admin@fpt.edu.vn / 123
    </Text>
  </View>
)}


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
{error && <Text style={{color : "red" , marginBottom: 8}}>{error}</Text>}
<Pressable
 onPress = {onSubmit}
style ={{
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
}}>
{loading ? (
    <ActivityIndicator color="#fff"/>)
    : 
    (<Text style={{color: "#fff", fontWeight: "600"}}>Đăng nhập</Text>)
    
}

</Pressable>
    
<Link href="/register" asChild>
  <Pressable style={{ marginTop: 20 }}>
    <Text style={{ color: colors.text, textAlign: "center" }}>
      Chưa có tài khoản? <Text style={{ fontWeight: "bold", color: colors.primary }}>Đăng ký ngay</Text>
    </Text>
  </Pressable>
</Link>
        </View>
    );
}

