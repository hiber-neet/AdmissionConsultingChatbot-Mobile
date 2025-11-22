import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  colors: ColorScheme;
}

interface ColorScheme {
  // Background colors
  background: string;
  surface: string;
  card: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textInverse: string;
  
  // Brand colors
  primary: string;
  primaryDark: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  
  // Border and divider colors
  border: string;
  divider: string;
  
  // Shadow colors
  shadow: string;
  
  // Overlay colors
  overlay: string;
  modalBackground: string;
}

const lightColors: ColorScheme = {
  background: '#F9FAFB',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  
  text: '#1F2937',
  textSecondary: '#6B7280',
  textInverse: '#FFFFFF',
  
  primary: '#FF6600',
  primaryDark: '#E55A00',
  
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  
  border: '#E5E7EB',
  divider: '#F3F4F6',
  
  shadow: '#000000',
  
  overlay: 'rgba(0, 0, 0, 0.5)',
  modalBackground: 'rgba(0, 0, 0, 0.8)',
};

const darkColors: ColorScheme = {
  background: '#111827',
  surface: '#1F2937',
  card: '#374151',
  
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textInverse: '#1F2937',
  
  primary: '#FF6600',
  primaryDark: '#E55A00',
  
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  
  border: '#4B5563',
  divider: '#374151',
  
  shadow: '#000000',
  
  overlay: 'rgba(0, 0, 0, 0.7)',
  modalBackground: 'rgba(0, 0, 0, 0.9)',
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
  colors: lightColors,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme === 'dark') {
        setIsDark(true);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);