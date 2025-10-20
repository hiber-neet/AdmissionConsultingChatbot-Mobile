import { useState, useCallback } from "react";
import { useRouter } from "expo-router";

export function useAuth() {
  const router = useRouter();

  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState(false);

 
  const demoAccount = {
    email: "admin@fpt.edu.vn",
    password: "123",
  };

 
  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);

    await new Promise((r) => setTimeout(r, 800));  

    if (email === demoAccount.email && password === demoAccount.password) {
      // nếu đúng tài khoản mẫu
      setUser({ id: "demo-user", email });
      router.replace("/");  
    } else {
      // nếu sai tài khoản
      throw new Error("Email hoặc mật khẩu không đúng");
    }

    setLoading(false);
  }, [router]);

 
  const logout = useCallback(() => {
    setUser(null);
    router.replace("/login");
  }, [router]);

  return { user, loading, login, logout };
}
