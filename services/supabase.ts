import "react-native-url-polyfill/auto";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lấy env từ Expo
const envUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const envAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Chỉ chấp nhận URL bắt đầu bằng http:// hoặc https://
const hasValidUrl =
  typeof envUrl === "string" && /^https?:\/\//.test(envUrl.trim());
const hasKey = typeof envAnonKey === "string" && envAnonKey.trim().length > 0;

// Expo chỉ coi là "đã cấu hình Supabase" khi URL + KEY đều hợp lệ
export const isSupabaseConfigured: boolean = hasValidUrl && hasKey;

// Nếu không cấu hình hợp lệ thì KHÔNG tạo client, để app chạy ở chế độ demo
let supabaseClient: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  supabaseClient = createClient(envUrl!.trim(), envAnonKey!.trim(), {
    auth: {
      persistSession: false,
    },
  });
} else {
  console.warn(
    "[Supabase] Chưa cấu hình hoặc URL/KEY không hợp lệ. App sẽ chạy ở chế độ DEMO (không dùng Supabase)."
  );
}

export const supabase = supabaseClient;
