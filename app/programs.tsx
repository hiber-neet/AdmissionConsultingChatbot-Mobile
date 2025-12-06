import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Code, Briefcase, Palette, Database, Smartphone, Globe } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';

interface ProgramCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  duration: string;
  career: string;
  detail: string;         
}

function ProgramCard({
  icon,
  title,
  description,
  duration,
  career,
  detail,
}: ProgramCardProps) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);

  return (
    <View
      style={[
        styles.programCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.programHeader}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: colors.background },
          ]}
        >
          {icon}
        </View>
        <View style={styles.programHeaderText}>
          <Text style={[styles.programTitle, { color: colors.text }]}>
            {title}
          </Text>
          <Text
            style={[styles.programDuration, { color: colors.textSecondary }]}
          >
            {duration}
          </Text>
        </View>
      </View>

      <Text
        style={[styles.programDescription, { color: colors.textSecondary }]}
      >
        {description}
      </Text>

      <View style={styles.careerSection}>
        <Text
          style={[styles.careerLabel, { color: colors.textSecondary }]}
        >
          Nghề nghiệp:
        </Text>
        <Text style={[styles.careerText, { color: colors.text }]}>
          {career}
        </Text>
      </View>

   
      {expanded && (
        <View
          style={[
            styles.detailBox,
            { backgroundColor: colors.background },
          ]}
        >
          <Text style={[styles.detailText, { color: colors.text }]}>
            {detail}
          </Text>
        </View>
      )}

      <Pressable
        style={[styles.detailButton, { backgroundColor: colors.primary }]}
        onPress={() => setExpanded(prev => !prev)}
      >
        <Text style={styles.detailButtonText}>
          {expanded ? 'Thu gọn' : 'Xem chi tiết'}
        </Text>
      </Pressable>
    </View>
  );
}

export default function ProgramsScreen() {
  const { colors } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Các ngành đào tạo
        </Text>
        <Text
          style={[styles.headerSubtitle, { color: colors.textSecondary }]}
        >
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
          detail="Sinh viên được học từ cấu trúc dữ liệu – giải thuật, lập trình hướng đối tượng, đến thiết kế hệ thống, DevOps và điện toán đám mây. Chương trình chú trọng làm dự án thật với doanh nghiệp, quy trình Agile/Scrum và kỹ năng làm việc nhóm, giúp bạn sẵn sàng trở thành lập trình viên full-stack sau khi tốt nghiệp."
        />

        <ProgramCard
          icon={<Smartphone size={28} color={colors.primary} />}
          title="Thiết kế đồ họa số"
          description="Đào tạo designer sáng tạo với kỹ năng thiết kế UI/UX, motion graphics, và các công cụ Adobe Creative Suite."
          duration="4 năm"
          career="UI/UX Designer, Graphic Designer, Motion Designer, Art Director"
          detail="Bạn sẽ được rèn luyện tư duy thẩm mỹ, bố cục, màu sắc, typo và trải nghiệm người dùng. Sinh viên làm việc nhiều với Figma, Adobe Photoshop, Illustrator, After Effects… để xây dựng portfolio cá nhân gồm logo, bộ nhận diện, UI app/web và motion video – là lợi thế lớn khi ứng tuyển agency hoặc product company."
        />

        <ProgramCard
          icon={<Database size={28} color={colors.primary} />}
          title="An toàn thông tin"
          description="Chuyên gia bảo mật mạng, phòng chống tấn công mạng, quản trị hệ thống an toàn và ethical hacking."
          duration="4 năm"
          career="Security Engineer, Penetration Tester, Security Analyst, SOC Analyst"
          detail="Chương trình tập trung vào hệ điều hành, mạng máy tính, mã hóa dữ liệu, kỹ thuật tấn công – phòng thủ, giám sát và ứng phó sự cố. Sinh viên được thực hành trên các lab mô phỏng tấn công, CTF, và các công cụ như Wireshark, Kali Linux, SIEM… để hiểu cách bảo vệ hệ thống trong môi trường doanh nghiệp thực tế."
        />

        <ProgramCard
          icon={<Briefcase size={28} color={colors.primary} />}
          title="Quản trị kinh doanh"
          description="Đào tạo nhà quản lý hiện đại, kết hợp kiến thức kinh doanh truyền thống với công nghệ số và startup."
          duration="4 năm"
          career="Business Analyst, Project Manager, Product Manager, Entrepreneur"
          detail="Sinh viên được học quản trị, marketing, tài chính, nhân sự cùng kỹ năng phân tích dữ liệu, lập kế hoạch kinh doanh và quản lý dự án. Trong quá trình học có nhiều đồ án mô phỏng doanh nghiệp thật, pitching ý tưởng khởi nghiệp và làm việc trực tiếp với mentor từ doanh nghiệp."
        />

        <ProgramCard
          icon={<Globe size={28} color="#FF6600" />}
          title="Digital Marketing"
          description="Chuyên gia marketing số, SEO/SEM, Social Media Marketing, Content Marketing và phân tích dữ liệu khách hàng."
          duration="4 năm"
          career="Digital Marketing Manager, SEO Specialist, Social Media Manager, Growth Hacker"
          detail="Bạn được học cách xây dựng chiến dịch trên Facebook, TikTok, Google, SEO/SEM, email marketing và đo lường bằng các công cụ analytics. Sinh viên thường xuyên làm project thực tế: nghiên cứu khách hàng, lập kế hoạch nội dung, chạy thử quảng cáo và đọc số liệu để tối ưu hiệu quả."
        />

        <ProgramCard
          icon={<Palette size={28} color="#FF6600" />}
          title="Thiết kế game"
          description="Đào tạo game designer và developer với kỹ năng Unity, Unreal Engine, 3D modeling và game mechanics."
          duration="4 năm"
          career="Game Designer, Game Developer, 3D Artist, Level Designer"
          detail="Chương trình bao gồm xây dựng cốt truyện, thiết kế gameplay, hệ thống nhiệm vụ, lập trình trong Unity/Unreal và thiết kế nhân vật – bối cảnh 3D. Sinh viên sẽ làm nhiều prototype và demo game, qua đó hiểu quy trình sản xuất game từ ý tưởng đến sản phẩm có thể chơi được."
        />

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Học phí & Học bổng</Text>
          <Text style={styles.infoText}>
             Học phí: 22 - 27 triệu đồng/kỳ{'\n'}
             Học bổng: Lên đến 100% học phí cho thí sinh xuất sắc{'\n'}
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
  detailBox: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
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
