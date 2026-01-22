import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { MapPin, Phone, Mail, Facebook, Globe, MessageCircle } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';

interface ContactCardProps {
  icon: React.ReactNode;
  title: string;
  content: string;
  action?: () => void;
}

function ContactCard({ icon, title, content, action }: ContactCardProps) {
  const { colors } = useTheme();
  
  return (
    <Pressable style={[styles.contactCard, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={action}>
      <View style={[styles.iconCircle, { backgroundColor: colors.background }]}>{icon}</View>
      <View style={styles.contactContent}>
        <Text style={[styles.contactTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.contactText, { color: colors.textSecondary }]}>{content}</Text>
      </View>
    </Pressable>
  );
}

interface CampusCardProps {
  name: string;
  address: string;
  phone: string;
}

function CampusCard({ name, address, phone }: CampusCardProps) {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.campusCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.campusName, { color: colors.text }]}>{name}</Text>
      <View style={styles.campusInfo}>
        <MapPin size={16} color={colors.textSecondary} />
        <Text style={[styles.campusAddress, { color: colors.textSecondary }]}>{address}</Text>
      </View>
      <View style={styles.campusInfo}>
        <Phone size={16} color={colors.textSecondary} />
        <Text style={[styles.campusPhone, { color: colors.textSecondary }]}>{phone}</Text>
      </View>
    </View>
  );
}

export default function ContactScreen() {
  const { colors } = useTheme();
  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleWebsite = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Liên hệ</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn cho bạn
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Thông tin liên hệ</Text>

          <ContactCard
            icon={<Phone size={24} color={colors.primary} />}
            title="Hotline tư vấn"
            content="1900 636939"
            action={() => handleCall('1900636939')}
          />

          <ContactCard
            icon={<Mail size={24} color={colors.primary} />}
            title="Email"
            content="tuyen.sinh@fpt.edu.vn"
            action={() => handleEmail('tuyen.sinh@fpt.edu.vn')}
          />

          <ContactCard
            icon={<Globe size={24} color={colors.primary} />}
            title="Website"
            content="https://daihoc.fpt.edu.vn"
            action={() => handleWebsite('https://daihoc.fpt.edu.vn')}
          />

        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hệ thống cơ sở</Text>

          <CampusCard
            name="Cơ sở Hà Nội"
            address="Khu Công nghệ cao Hòa Lạc, Km29 Đại lộ Thăng Long, Hà Nội"
            phone="024 7300 5588"
          />

          <CampusCard
            name="Cơ sở TP. Hồ Chí Minh"
            address="Lô E2a-7, Đường D1, Khu Công nghệ cao, P. Long Thạnh Mỹ, Tp. Thủ Đức"
            phone="028 7300 5588"
          />

          <CampusCard
            name="Cơ sở Đà Nẵng"
            address="Khu đô thị công nghệ FPT Đà Nẵng, P. Hòa Hải, Q. Ngũ Hành Sơn"
            phone="0236 7300 999"
          />

          <CampusCard
            name="Cơ sở Cần Thơ"
            address="600 Nguyễn Văn Cừ nối dài, P. An Bình, Q. Ninh Kiều"
            phone="0292 7300 800"
          />

          <CampusCard
            name="Cơ sở Quy Nhơn"
            address="Khu đô thị Bắc An Phú, TP. Quy Nhơn, Bình Định"
            phone="0256 7300 800"
          />
        </View>

        {/* <View style={styles.socialSection}>
          <Text style={styles.sectionTitle}>Kết nối với chúng tôi</Text>

          <View style={styles.socialButtons}>
            <Pressable style={styles.socialButton}>
              <Facebook size={24} color="#1877F2" />
              <Text style={styles.socialButtonText}>Facebook</Text>
            </Pressable>

            <Pressable style={styles.socialButton}>
              <Globe size={24} color="#0088CC" />
              <Text style={styles.socialButtonText}>Zalo</Text>
            </Pressable>
          </View>
        </View> */}

        <View style={styles.workingHours}>
          <Text style={styles.workingTitle}>Giờ làm việc</Text>
          <View style={styles.workingTime}>
            <Text style={styles.workingDay}>Thứ 2 - Thứ 6:</Text>
            <Text style={styles.workingTimeText}>8:00 - 17:30</Text>
          </View>
          <View style={styles.workingTime}>
            <Text style={styles.workingDay}>Thứ 7 - Chủ nhật:</Text>
            <Text style={styles.workingTimeText}>8:00 - 12:00</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#FF6600',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    lineHeight: 24,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF4ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  contactText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  campusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  campusName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  campusInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  campusAddress: {
    fontSize: 15,
    color: '#666',
    marginLeft: 10,
    flex: 1,
    lineHeight: 22,
  },
  campusPhone: {
    fontSize: 15,
    color: '#666',
    marginLeft: 10,
  },
  socialSection: {
    marginBottom: 30,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  formDescription: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 20,
  },
  formButton: {
    backgroundColor: '#FF6600',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  formButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  workingHours: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 40,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6600',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  workingTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  workingDay: {
    fontSize: 15,
    color: '#666',
  },
  workingTimeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
});
