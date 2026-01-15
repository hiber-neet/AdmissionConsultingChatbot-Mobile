  import { useEffect } from 'react';
  import { Stack } from 'expo-router';
  import { StatusBar } from 'expo-status-bar';
  import { useFrameworkReady } from '@/hooks/useFrameworkReady';
  import { AuthProvider } from '@/contexts/AuthContext';
  import { ThemeProvider } from '@/contexts/ThemeContext';
  import { useProtectedRoute } from '@/hooks/useProtectedRoute';
export const unstable_settings = {
  initialRouteName: "login",
};
  function RootLayoutNav() {
    useProtectedRoute();
    
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="admissions" />
        <Stack.Screen name="programs" />
        <Stack.Screen name="contact" />
        <Stack.Screen name="+not-found" />
      </Stack>
    );
  }

  export default function RootLayout() {
    useFrameworkReady();

    return (
      <ThemeProvider>
        <AuthProvider>
          <RootLayoutNav />
          <StatusBar style="auto" />
        </AuthProvider>
      </ThemeProvider>
    );
  }
