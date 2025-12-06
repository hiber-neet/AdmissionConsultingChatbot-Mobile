import { View, Text, StyleSheet, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { User, LogOut, Mail, Phone } from 'lucide-react-native';
import { router } from 'expo-router';
import Header from '@/components/layout/Header';
import { getProfileApi, UserProfile } from '@/services/api';

export default function ProfileScreen() {
  const { user, token, logout, loading } = useAuth();
  const { colors } = useTheme();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState<boolean>(true);
const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !token) {
        setProfileLoading(false);
        return;
      }
      try {
        const data = await getProfileApi(user.user_id, token);
        setProfile(data);
      } catch (e) {
        console.error(e);
        Alert.alert('Lỗi', 'Không tải được thông tin hồ sơ');
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [user, token]);

const handleLogout = async () => {
  if (loggingOut) return;    

  try {
    setLoggingOut(true);
    console.log('LOGOUT BUTTON PRESSED');   

    await logout();              
    router.replace('/login');    
  } catch (error) {
    console.error(error);
    Alert.alert('Lỗi', 'Không thể đăng xuất. Vui lòng thử lại.');
  } finally {
    setLoggingOut(false);
  }
};


  if (loading || profileLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Hồ sơ cá nhân" showLogo={false} />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Đang tải...</Text>
        </View>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Hồ sơ cá nhân" showLogo={false} />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Không tìm thấy thông tin hồ sơ
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Hồ sơ cá nhân" showLogo={false} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
            <User size={40} color="#fff" />
          </View>
          <Text style={[styles.userName, { color: colors.text }]}>
            {profile.full_name || 'Người dùng'}
          </Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            {profile.email}
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Thông tin tài khoản</Text>

          <View
            style={[
              styles.infoCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
              <Mail size={20} color={colors.textSecondary} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Email:</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{profile.email}</Text>
            </View>

            <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
              <Phone size={20} color={colors.textSecondary} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>SĐT:</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{profile.phone_number}</Text>
            </View>
          </View>
        </View>

 <View style={styles.actionsSection}>
          <Pressable
            onPress={handleLogout}
            disabled={loggingOut}
            style={[
              styles.logoutButton,
              { backgroundColor: colors.error || '#dc3545', opacity: loggingOut ? 0.7 : 1 },
            ]}
          >
            {loggingOut ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <LogOut size={20} color="#fff" />
                <Text style={styles.logoutText}>Đăng xuất</Text>
              </>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16 },
  header: { alignItems: 'center', marginBottom: 30 },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  userName: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  userEmail: { fontSize: 16 },
  infoSection: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 15 },
  infoCard: { borderRadius: 12, padding: 16 },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  infoLabel: { fontSize: 16, marginLeft: 12, flex: 1 },
  infoValue: { fontSize: 16, flex: 2, textAlign: 'right' },
  actionsSection: { marginTop: 20 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    gap: 10,
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
