import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Home Screen</Text>
      <Text style={{ marginVertical: 8 }}>Welcome to your app!</Text>

      {/* Nút đi tới Login */}
      <Link href="/login" asChild>
        <Pressable
          style={{
            backgroundColor: "#FF6A00",
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 10,
            marginTop: 20,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Đi tới trang Login</Text>
        </Pressable>
      </Link>
    </View>
  );
}
