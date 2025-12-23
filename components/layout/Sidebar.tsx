import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  SafeAreaView,
  Pressable,
} from 'react-native';
import {
  Home,
  MessageCircle,
  Users,
  User,
  Settings,
  GraduationCap,
  BookOpen,
  Phone,
  UserPlus,
  LogIn,
  BarChart3,
  Eye,
  UserCheck,
  X,
  MessageSquare,
  FileText,
  ClipboardList,
  Brain,
  
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

interface MenuItem {
  title: string;
  route: string;
  icon: React.ComponentType<any>;
  description: string;
  requireAuth?: boolean;
}

const menuItems: MenuItem[] = [
  {
    title: 'Trang chủ',
    route: '/',
    icon: Home,
    description: 'Trang chủ chính',
  },
  {
    title: 'Bài viết Tuyển sinh',
    route: '/articles',
    icon: FileText,
    description: 'Xem tất cả bài viết về tuyển sinh',
  },
  {
    title: 'Chat AI',
    route: '/chat',
    icon: MessageCircle,
    description: 'Chatbot tuyển sinh',
  },
  {
    title: 'Chat trực tiếp',
    route: '/live-chat',
    icon: MessageSquare,
    description: 'Chat với cán bộ',
  },
  {
    title: 'Hồ sơ',
    route: '/profile',
    icon: User,
    description: 'Thông tin cá nhân',
    requireAuth: true,
  },

{
  title: "RIASEC",
  route: "/riasec",
  icon: Brain,
  description: "Trắc nghiệm định hướng nghề nghiệp",
  // requireAuth: false, // để guest vẫn vào làm bài được
},

  {
  title: "Học bạ",
  route: "/hocba",
  icon: ClipboardList,
  description: "Quản lý học bạ",
  requireAuth: true,
},

  {
    title: 'Cài đặt',
    route: '/settings',
    icon: Settings,
    description: 'Tùy chỉnh app',
    requireAuth: true,
  },
  {
    title: 'Chương trình học',
    route: '/programs',
    icon: BookOpen,
    description: 'Danh sách ngành',
  },
  {
    title: 'Tuyển sinh',
    route: '/admissions',
    icon: GraduationCap,
    description: 'Thông tin xét tuyển',
  },
  {
    title: 'Liên hệ',
    route: '/contact',
    icon: Phone,
    description: 'Thông tin liên hệ',
  },
  // {
  //   title: 'Đăng ký',
  //   route: '/register',
  //   icon: UserPlus,
  //   description: 'Tạo tài khoản',
  // },
  // {
  //   title: 'Đăng nhập',
  //   route: '/login',
  //   icon: LogIn,
  //   description: 'Đăng nhập hệ thống',
  // },
];

export default function Sidebar({ isVisible, onClose }: SidebarProps) {
  const { user } = useAuth();
  const { colors } = useTheme();
  const isAuthenticated = !!user;

  const handleNavigate = (route: string) => {
    router.push(route as any);
    onClose();
  };

  const filteredMenuItems = menuItems.filter(item => {
    if (item.requireAuth && !isAuthenticated) return false;
    return true;
  });

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.sidebar, { backgroundColor: colors.surface }]}>
          <SafeAreaView style={styles.sidebarContent}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
              <View style={styles.headerLeft}>
                <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
                  <GraduationCap size={24} color="white" />
                </View>
                <View style={styles.headerText}>
                  <Text style={[styles.appName, { color: colors.text }]}>FPT University</Text>
                  <Text style={[styles.appTagline, { color: colors.textSecondary }]}>Admission Portal</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* User Info */}
            {isAuthenticated && user && (
              <View style={[styles.userInfo, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                <View style={[styles.userAvatar, { backgroundColor: colors.primary }]}>
                  <Text style={styles.userAvatarText}>
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </Text>
                </View>
                <View style={styles.userDetails}>
                  <Text style={[styles.userName, { color: colors.text }]}>
                    {user.email || 'Người dùng'}
                  </Text>
                  <Text style={[styles.userRole, { color: colors.textSecondary }]}>
                    {user.role === 'admin' ? 'Quản trị viên' : 'Sinh viên'}
                  </Text>
                </View>
              </View>
            )}

            {/* Menu Items */}
            <ScrollView style={styles.menuContainer}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ĐIỀU HƯỚNG</Text>
              {filteredMenuItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.menuItem}
                    onPress={() => handleNavigate(item.route)}
                  >
                    <View style={styles.menuItemIcon}>
                      <IconComponent size={20} color={colors.primary} />
                    </View>
                    <View style={styles.menuItemContent}>
                      <Text style={[styles.menuItemTitle, { color: colors.text }]}>{item.title}</Text>
                      <Text style={[styles.menuItemDescription, { color: colors.textSecondary }]}>{item.description}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Footer */}
            <View style={[styles.footer, { borderTopColor: colors.border }]}>
              <Text style={[styles.footerText, { color: colors.textSecondary }]}>© 2024 FPT University</Text>
              <Text style={[styles.footerSubText, { color: colors.textSecondary }]}>Version 1.0.0</Text>
            </View>
          </SafeAreaView>
        </View>
        
        <Pressable style={styles.backdrop} onPress={onClose} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: '80%',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  sidebarContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  appName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  appTagline: {
    fontSize: 11,
    color: '#6B7280',
  },
  closeButton: {
    padding: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#EBF4FF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 11,
    color: '#6B7280',
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 2,
  },
  menuItemIcon: {
    width: 32,
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  menuItemDescription: {
    fontSize: 11,
    color: '#6B7280',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 2,
  },
  footerSubText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
});