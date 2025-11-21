import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/services/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSupabaseConfigured) {
      // Use real Supabase authentication
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        (() => {
          setSession(session);
          setUser(session?.user ?? null);
        })();
      });

      return () => subscription.unsubscribe();
    } else {
      // Use demo authentication
      setLoading(false);
      console.warn('Supabase not configured. Using demo authentication mode.');
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        // Use Supabase authentication
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
      } else {
        // Use demo authentication
        await new Promise((r) => setTimeout(r, 800));
        
        const demoAccounts = [
          { email: 'admin@fpt.edu.vn', password: '123' },
          { email: 'demo@fpt.edu.vn', password: 'demo123' },
          { email: 'test@student.fpt.edu.vn', password: 'test123' },
        ];
        
        const validAccount = demoAccounts.find(
          acc => acc.email === email.trim() && acc.password === password
        );
        
        if (!validAccount) {
          throw new Error('Email hoặc mật khẩu không đúng');
        }
        
        // Create mock user session
        const mockUser = {
          id: 'demo-user-' + Date.now(),
          email: email.trim(),
          app_metadata: {},
          aud: 'authenticated',
          user_metadata: { full_name: 'Demo User' },
          created_at: new Date().toISOString(),
        } as User;
        
        setUser(mockUser);
        setSession({ user: mockUser } as Session);
      }
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        // Use Supabase authentication
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        if (data.user && !data.session) {
          throw new Error('Please check your email to confirm your account');
        }
      } else {
        // Use demo registration
        await new Promise((r) => setTimeout(r, 800));
        
        // Simulate successful registration
        console.log('Demo registration successful for:', email);
      }
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    } else {
      // Demo sign out
      setUser(null);
      setSession(null);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, login, register, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
