import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Bell, Moon, Globe, HelpCircle, Shield, Info, AlertCircle } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { storage } from '@/utils/storage';
import { isSupabaseConfigured } from '@/services/supabase';
import * as Linking from 'expo-linking';
import Header from '@/components/layout/Header';

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  type: 'toggle' | 'link' | 'button';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

function SettingItem({ icon, title, description, type, value, onPress, onToggle }: SettingItemProps) {
  return (
    <Pressable style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingContent}>
        <View style={styles.iconContainer}>{icon}</View>
        <View style={styles.textContainer}>
          <Text style={styles.settingTitle}>{title}</Text>
          {description && <Text style={styles.settingDescription}>{description}</Text>}
        </View>
        {type === 'toggle' && (
          <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={value ? '#fff' : '#f4f3f4'}
          />
        )}
      </View>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedNotifications = await storage.getItem('notifications');
      const savedDarkMode = await storage.getItem('darkMode');
      
      if (savedNotifications !== null) {
        setNotifications(JSON.parse(savedNotifications));
      }
      if (savedDarkMode !== null) {
        setDarkMode(JSON.parse(savedDarkMode));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleNotificationToggle = async (value: boolean) => {
    setNotifications(value);
    await storage.setItem('notifications', JSON.stringify(value));
  };

  const handleDarkModeToggle = async (value: boolean) => {
    setDarkMode(value);
    await storage.setItem('darkMode', JSON.stringify(value));
    // Note: Implementing actual dark mode would require theme context
    Alert.alert('Thông báo', 'Chế độ tối sẽ được cập nhật trong phiên bản tiếp theo.');
  };

  const openWebsite = () => {
    Linking.openURL('https://daihoc.fpt.edu.vn');
  };

  const openSupport = () => {
    Linking.openURL('mailto:tuyen.sinh@fpt.edu.vn?subject=Hỗ trợ ứng dụng');
  };

  const showAbout = () => {
    Alert.alert(
      'Về ứng dụng',
      'FPT University Admission App\nPhiên bản: 1.0.0\n\nỨng dụng tư vấn tuyển sinh chính thức của Đại học FPT.',
      [{ text: 'Đóng', style: 'default' }]
    );
  };

  const showPrivacy = () => {
    Alert.alert(
      'Chính sách bảo mật',
      'Thông tin cá nhân của bạn được bảo mật theo tiêu chuẩn của FPT University. Chúng tôi chỉ sử dụng thông tin để tư vấn tuyển sinh.',
      [{ text: 'Đóng', style: 'default' }]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Cài đặt" showLogo={false} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {!isSupabaseConfigured && (
          <View style={styles.demoWarning}>
            <AlertCircle size={20} color={colors.warning} />
            <View style={styles.demoWarningText}>
              <Text style={styles.demoWarningTitle}>Chế độ Demo</Text>
              <Text style={styles.demoWarningDescription}>
                Supabase chưa được cấu hình. Vui lòng cập nhật file .env
              </Text>
            </View>
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông báo</Text>
          <SettingItem
            icon={<Bell size={24} color={colors.primary} />}
            title="Thông báo push"
            description="Nhận thông báo về tuyển sinh"
            type="toggle"
            value={notifications}
            onToggle={handleNotificationToggle}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Giao diện</Text>
          <SettingItem
            icon={<Moon size={24} color={colors.primary} />}
            title="Chế độ tối"
            description="Chuyển sang giao diện tối"
            type="toggle"
            value={darkMode}
            onToggle={handleDarkModeToggle}
          />
          <SettingItem
            icon={<Globe size={24} color={colors.primary} />}
            title="Ngôn ngữ"
            description="Tiếng Việt"
            type="button"
            onPress={() => Alert.alert('Thông báo', 'Tính năng này đang được phát triển.')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hỗ trợ</Text>
          <SettingItem
            icon={<Globe size={24} color={colors.primary} />}
            title="Website FPT University"
            description="Truy cập website chính thức"
            type="link"
            onPress={openWebsite}
          />
          <SettingItem
            icon={<HelpCircle size={24} color={colors.primary} />}
            title="Hỗ trợ"
            description="Liên hệ đội ngũ hỗ trợ"
            type="link"
            onPress={openSupport}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Về ứng dụng</Text>
          <SettingItem
            icon={<Shield size={24} color={colors.primary} />}
            title="Chính sách bảo mật"
            description="Xem chính sách bảo mật"
            type="button"
            onPress={showPrivacy}
          />
          <SettingItem
            icon={<Info size={24} color={colors.primary} />}
            title="Về ứng dụng"
            description="Thông tin phiên bản"
            type="button"
            onPress={showAbout}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  settingItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  demoWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    borderColor: colors.warning,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  demoWarningText: {
    flex: 1,
    marginLeft: 12,
  },
  demoWarningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
  },
  demoWarningDescription: {
    fontSize: 12,
    color: '#856404',
    marginTop: 2,
  },
});
