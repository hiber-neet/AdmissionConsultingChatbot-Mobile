// hooks/useProtectedRoute.ts
import { useEffect } from "react";
import {
  useRouter,
  useSegments,
  useRootNavigationState,
} from "expo-router";
import { useAuth } from "@/contexts/AuthContext";

export function useProtectedRoute() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    // ❗ Quan trọng: chưa sẵn sàng thì KHÔNG navigate
    if (loading || !rootNavigationState?.key) return;

    const first = segments[0];
    const inProtectedGroup = first === "(tabs)";
    const inAuthPages = first === "login" || first === "register";

    // Chưa login mà đang vào vùng cần bảo vệ -> đá về login
    if (!user && inProtectedGroup) {
      router.replace("/login");
      return;
    }

    // Đã login mà vẫn ở login/register -> đưa về tabs
    if (user && inAuthPages) {
      router.replace("/(tabs)");
      return;
    }
  }, [user, loading, segments, rootNavigationState?.key]);
}
