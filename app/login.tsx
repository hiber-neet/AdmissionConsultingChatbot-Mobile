import { View, Text, TextInput, Pressable, ActivityIndicator } from "react-native";
import { useState } from "react";
import { colors } from "../constants/colors";  
import { useAuth } from "../hooks/useAuth";  
import { Link } from "expo-router";
export default function LoginScreen(){
    const {login, loading} = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const onSubmit = async () => {
        setError(null);
        try{
            await login (email.trim(), password);
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
autoCapitalize="none"
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
      Chưa có tài khoản? Đăng ký ngay
    </Text>
  </Pressable>
</Link>
        </View>
    );
}

