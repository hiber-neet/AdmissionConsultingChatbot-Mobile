import { Tabs } from 'expo-router';
import { Home, Settings, User, Bot, MessageCircle, BookOpen } from 'lucide-react-native';
import { useTheme } from '../../contexts/ThemeContext';

export default function TabLayout() {
  const { colors } = useTheme();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
      

            {/* <Tabs.Screen
        name="hocba"
        options={{
          title: 'Học bạ',
          tabBarIcon: ({ size, color }) => <BookOpen size={size} color={color} />,
        }}
      /> */}

      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chatbot',
          tabBarIcon: ({ size, color }) => (
            <Bot size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="students"
        options={{
          title: 'Message',
          tabBarIcon: ({ size, color }) => (
            <MessageCircle size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
