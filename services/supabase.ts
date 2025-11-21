import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// Check if Supabase environment variables are configured
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Use demo credentials if environment variables are not set
const defaultUrl = 'https://demo.supabase.co';
const defaultKey = 'demo-key';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(
  supabaseUrl || defaultUrl, 
  supabaseAnonKey || defaultKey, 
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
