import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Code, Briefcase, Palette, Database, Smartphone, Globe } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';

interface ProgramCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  duration: string;
  career: string;
}

function ProgramCard({ icon, title, description, duration, career }: ProgramCardProps) {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.programCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.programHeader}>
        <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>{icon}</View>
        <View style={styles.programHeaderText}>
          <Text style={[styles.programTitle, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.programDuration, { color: colors.textSecondary }]}>{duration}</Text>
        </View>
      </View>
      <Text style={[styles.programDescription, { color: colors.textSecondary }]}>{description}</Text>
      <View style={styles.careerSection}>
        <Text style={[styles.careerLabel, { color: colors.textSecondary }]}>Nghề nghiệp:</Text>
        <Text style={[styles.careerText, { color: colors.text }]}>{career}</Text>
      </View>
      <Pressable style={[styles.detailButton, { backgroundColor: colors.primary }]}>
        <Text style={styles.detailButtonText}>Xem chi tiết</Text>
      </Pressable>
    </View>
  );
}

export default function ProgramsScreen() {
  const { colors } = useTheme();
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Các ngành đào tạo</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          Chương trình đào tạo chất lượng cao, kết hợp lý thuyết và thực hành
        </Text>
      </View>

      <View style={styles.content}>
        <ProgramCard
          icon={<Code size={28} color={colors.primary} />}
          title="Kỹ thuật phần mềm"
          description="Đào tạo kỹ sư phần mềm chuyên nghiệp, thành thạo các công nghệ lập trình hiện đại như Java, .NET, Python, và các framework phổ biến."
          duration="4 năm"
          career="Software Engineer, Full-stack Developer, DevOps Engineer, Solution Architect"
        />

        <ProgramCard
          icon={<Smartphone size={28} color={colors.primary} />}
          title="Thiết kế đồ họa số"
          description="Đào tạo designer sáng tạo với kỹ năng thiết kế UI/UX, motion graphics, và các công cụ Adobe Creative Suite."
          duration="4 năm"
          career="UI/UX Designer, Graphic Designer, Motion Designer, Art Director"
        />

        <ProgramCard
          icon={<Database size={28} color={colors.primary} />}
          title="An toàn thông tin"
          description="Chuyên gia bảo mật mạng, phòng chống tấn công mạng, quản trị hệ thống an toàn và ethical hacking."
          duration="4 năm"
          career="Security Engineer, Penetration Tester, Security Analyst, SOC Analyst"
        />

        <ProgramCard
          icon={<Briefcase size={28} color={colors.primary} />}
          title="Quản trị kinh doanh"
          description="Đào tạo nhà quản lý hiện đại, kết hợp kiến thức kinh doanh truyền thống với công nghệ số và startup."
          duration="4 năm"
          career="Business Analyst, Project Manager, Product Manager, Entrepreneur"
        />

        <ProgramCard
          icon={<Globe size={28} color="#FF6600" />}
          title="Digital Marketing"
          description="Chuyên gia marketing số, SEO/SEM, Social Media Marketing, Content Marketing và phân tích dữ liệu khách hàng."
          duration="4 năm"
          career="Digital Marketing Manager, SEO Specialist, Social Media Manager, Growth Hacker"
        />

        <ProgramCard
          icon={<Palette size={28} color="#FF6600" />}
          title="Thiết kế game"
          description="Đào tạo game designer và developer với kỹ năng Unity, Unreal Engine, 3D modeling và game mechanics."
          duration="4 năm"
          career="Game Designer, Game Developer, 3D Artist, Level Designer"
        />

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Học phí & Học bổng</Text>
          <Text style={styles.infoText}>
            • Học phí: 22 - 27 triệu đồng/kỳ{'\n'}
            • Học bổng: Lên đến 100% học phí cho thí sinh xuất sắc{'\n'}
            • Hỗ trợ vay vốn: Lãi suất ưu đãi cho sinh viên
          </Text>
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
  programCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  programHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF4ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  programHeaderText: {
    flex: 1,
  },
  programTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  programDuration: {
    fontSize: 14,
    color: '#999',
  },
  programDescription: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 15,
  },
  careerSection: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  careerLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  careerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  detailButton: {
    backgroundColor: '#FF6600',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 10,
    marginBottom: 40,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6600',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
  },
});
