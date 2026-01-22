// services/api.ts
import axios from "axios";
import { Platform } from "react-native";
import { API_BASE_URL } from "./config";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});




// ----- ARTICLES -----
export type ArticleApi = {
  article_id: number;
  title: string;
  description: string | null;
  url: string | null;
  status: string;
  create_at: string;
  created_by: number;
  major_id: number | null;
  specialization_id: number | null;
  author_name?: string | null;
  major_name?: string | null;
  specialization_name?: string | null;
  note?: string | null;
  link_image?: string | null;
};

export const getArticlesApi = async (
  token?: string | null
): Promise<ArticleApi[]> => {
  const res = await api.get<ArticleApi[]>("/articles", {
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : undefined,
  });
  return res.data;
};

export const getArticleApi = async (
  articleId: number,
  token?: string | null
): Promise<ArticleApi> => {
  const res = await api.get<ArticleApi>(`/articles/${articleId}`, {
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : undefined,
  });
  return res.data;
};

// ----PROFILE ---
export type UserProfile = {
user_id: number;
  full_name: string;
  email: string;
  phone_number: string;
  permission: string[];
  role_name: string | null;
  student_profile: {
    interest: {
      interest_id: number;
      desired_major: string;
      region: string;
    } | null;
  } | null;
  consultant_profile: {
    status: boolean;
    is_leader: boolean;
  } | null;
  content_manager_profile: {
    is_leader: boolean;
  } | null;
  admission_official_profile: {
    rating: number;
    current_sessions: number;
    max_sessions: number;
    status: string;
  } | null;
};

// ---- API lấy profile ----
export const getProfileApi = async (userId: number, token: string) => {
  const res = await api.get<UserProfile>(`/profile/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// ---------------- REGISTER ----------------
export type RegisterPayload = {
  fullName: string;
  email: string;
  phone: string;
  interest_desired_major: string;
  interest_region: string;
  password: string;
};

export const registerApi = async (payload: RegisterPayload) => {
  const body = {
 
    full_name: payload.fullName,
    email: payload.email,
    password: payload.password,
    phone_number: payload.phone,

    status: true,
    role_id: 0,
    permissions: [],
    consultant_is_leader: false,
    content_manager_is_leader: false,
    interest_desired_major: payload.interest_desired_major,
    interest_region:"",
  };
  const res = await api.post("/auth/register", body);
  return res.data;
};

// ---------------- LOGIN ----------------
export const loginApi = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

// Lưu session_id để giữ “phiên” chat giống web
let chatSessionId: string | null = null;

export const chatApi = {
  async sendMessage(userId: string, text: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl =
          API_BASE_URL.replace(/^http/, "ws") + "/chat/ws/chat";

        const ws = new WebSocket(wsUrl);

        let partial = "";
        let done = false;

        ws.onopen = () => {
          // 1) Gửi thông tin user + session hiện tại (nếu có)
          ws.send(
            JSON.stringify({
              user_id: userId || "guest",
              session_id: chatSessionId,
            })
          );

          // 2) Gửi câu hỏi
          ws.send(
            JSON.stringify({
              message: text,
              user_id: userId || "guest",
              session_id: chatSessionId,
            })
          );
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            const ev = data.event || data.type;

            switch (ev) {
              case "session_created": {
                if (data.session_id) {
                  chatSessionId = data.session_id;
                }
                break;
              }

              case "chunk": {
                const chunk =
                  data.content ?? data.text ?? data.message ?? "";
                partial += chunk;
                break;
              }

              case "done": {
                done = true;
                ws.close();
                const finalText =
                  partial.trim() || "(không có phản hồi từ chatbot)";
                resolve(finalText);
                break;
              }

              case "error": {
                done = true;
                ws.close();
                reject(
                  new Error(
                    data.message ||
                      "Đã xảy ra lỗi khi xử lý câu hỏi."
                  )
                );
                break;
              }

              default:
              // có thể thêm log nếu cần
            }
          } catch (e) {
            console.warn("Không parse được WS message:", event.data, e);
          }
        };

        ws.onerror = (err) => {
          console.error("WebSocket error:", err);
          if (!done) {
            done = true;
            reject(
              new Error(
                "Không thể kết nối tới chatbot. Vui lòng thử lại sau."
              )
            );
          }
        };

        ws.onclose = () => {
          if (!done) {
            reject(
              new Error(
                "Kết nối chatbot bị đóng trước khi nhận phản hồi."
              )
            );
          }
        };
      } catch (error) {
        console.error("Chat API Error:", error);
        reject(
          new Error("Không thể gửi tin nhắn. Vui lòng thử lại sau.")
        );
      }
    });
  },
};
