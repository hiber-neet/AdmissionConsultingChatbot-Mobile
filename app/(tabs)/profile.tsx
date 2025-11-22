import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { User, LogOut, Mail, Calendar } from 'lucide-react-native';
import { router } from 'expo-router';
import Header from '@/components/layout/Header';

export default function ProfileScreen() {
  const { user, signOut, loading } = useAuth();
  const { colors } = useTheme();

  const handleLogout = () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đăng xuất",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
              router.replace('/login');
            } catch (error) {
              Alert.alert("Lỗi", "Không thể đăng xuất. Vui lòng thử lại.");
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Hồ sơ cá nhân" showLogo={false} />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Đang tải...</Text>
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
            {user?.user_metadata?.full_name || user?.email || 'Người dùng'}
          </Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user?.email || 'No email'}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Thông tin tài khoản</Text>
          
          <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
              <Mail size={20} color={colors.textSecondary} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Email:</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{user?.email}</Text>
            </View>
            
            <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
              <Calendar size={20} color={colors.textSecondary} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Tham gia:</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'Không xác định'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsSection}>
          <Pressable style={[styles.logoutButton, { backgroundColor: colors.error || '#dc3545' }]} onPress={handleLogout}>
            <LogOut size={20} color="#fff" />
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
  },
  infoSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    flex: 2,
    textAlign: 'right',
  },
  actionsSection: {
    marginTop: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    gap: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
