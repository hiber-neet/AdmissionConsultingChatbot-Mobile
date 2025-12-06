// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginApi, registerApi, RegisterPayload } from "../services/api";
import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  sub?: string;
  user_id?: number;
  email?: string;
  exp?: number;
};

type AuthUser = {
  user_id: number;
  email: string;
};

type AuthContextType = {
  user: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
  setLoading(true);
  setError(null);
  try {
    const data = await loginApi(email, password);  // BE trả { access_token, token_type }
    const token = data.access_token;

    // Decode JWT để lấy user_id, email...
    const decoded = jwtDecode<DecodedToken>(token);
    console.log("Decoded token:", decoded);

    // BE thường dùng user_id hoặc sub làm ID
    const userId =
      decoded.user_id ?? (decoded.sub ? parseInt(decoded.sub, 10) : NaN);

    if (!userId || Number.isNaN(userId)) {
      throw new Error("Không tìm thấy user_id trong token");
    }

    setToken(token);
    setUser({
      user_id: userId,
      email: decoded.email || email,
      // full_name sẽ lấy từ /profile nên tạm bỏ hoặc để rỗng
    });

    await AsyncStorage.setItem("access_token", token);
  } catch (e: any) {
    console.log("login error", e?.response?.data || e.message);
    setError(e?.response?.data?.detail || "Đăng nhập thất bại");
    throw e;
  } finally {
    setLoading(false);
  }
};

  const register = async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);
    try {
      // 1) Gọi BE tạo user
      await registerApi(payload);

      // 2) Sau khi đăng ký xong, tự login luôn
      await login(payload.email, payload.password);
    } catch (e: any) {
      console.log("register error", e?.response?.data || e.message);
      setError(e?.response?.data?.detail || "Đăng ký thất bại");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("access_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, error, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
