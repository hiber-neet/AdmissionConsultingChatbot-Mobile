import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export function useProtectedRoute() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(tabs)';
    const inAuthPages = segments[0] === 'login' || segments[0] === 'register';

    if (!user && inAuthGroup) {
      // User is not signed in and trying to access protected route
      router.replace('/login');
    } else if (user && inAuthPages) {
      // User is signed in and trying to access auth pages
      router.replace('/(tabs)');
    }
  }, [user, segments, loading]);
}