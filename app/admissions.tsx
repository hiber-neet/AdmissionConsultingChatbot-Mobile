import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { CheckCircle, Calendar, FileText, Award } from 'lucide-react-native';

export default function AdmissionsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tuyển sinh 2025</Text>
        <Text style={styles.headerSubtitle}>
          Thông tin chi tiết về quy trình xét tuyển và hồ sơ đăng ký
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức xét tuyển</Text>

          <View style={styles.methodCard}>
            <View style={styles.methodHeader}>
              <Award size={24} color="#FF6600" />
              <Text style={styles.methodTitle}>Xét tuyển học bạ</Text>
            </View>
            <Text style={styles.methodDescription}>
              Xét điểm trung bình các môn trong học bạ THPT (lớp 10, 11, 12)
            </Text>
            <View style={styles.requirementBox}>
              <Text style={styles.requirementLabel}>Điểm tối thiểu:</Text>
              <Text style={styles.requirementValue}>18.0/30 điểm (3 môn)</Text>
            </View>
          </View>

          <View style={styles.methodCard}>
            <View style={styles.methodHeader}>
              <FileText size={24} color="#FF6600" />
              <Text style={styles.methodTitle}>Xét tuyển kỳ thi THPT</Text>
            </View>
            <Text style={styles.methodDescription}>
              Xét điểm thi tốt nghiệp THPT quốc gia
            </Text>
            <View style={styles.requirementBox}>
              <Text style={styles.requirementLabel}>Điểm tối thiểu:</Text>
              <Text style={styles.requirementValue}>18.0/30 điểm (3 môn)</Text>
            </View>
          </View>

          <View style={styles.methodCard}>
            <View style={styles.methodHeader}>
              <CheckCircle size={24} color="#FF6600" />
              <Text style={styles.methodTitle}>Xét tuyển thẳng</Text>
            </View>
            <Text style={styles.methodDescription}>
              Dành cho thí sinh đạt giải trong các kỳ thi học sinh giỏi hoặc có chứng chỉ quốc tế
            </Text>
            <View style={styles.bulletList}>
              <Text style={styles.bulletItem}>• Giải nhất, nhì, ba cấp quốc gia</Text>
              <Text style={styles.bulletItem}>• IELTS từ 6.5 trở lên</Text>
              <Text style={styles.bulletItem}>• SAT từ 1200 trở lên</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hồ sơ đăng ký</Text>

          <View style={styles.documentCard}>
            <CheckCircle size={20} color="#4CAF50" />
            <Text style={styles.documentText}>Bản sao học bạ THPT (công chứng)</Text>
          </View>

          <View style={styles.documentCard}>
            <CheckCircle size={20} color="#4CAF50" />
            <Text style={styles.documentText}>Bản sao giấy khai sinh (công chứng)</Text>
          </View>

          <View style={styles.documentCard}>
            <CheckCircle size={20} color="#4CAF50" />
            <Text style={styles.documentText}>4 ảnh 3x4 (chụp trong vòng 6 tháng)</Text>
          </View>

          <View style={styles.documentCard}>
            <CheckCircle size={20} color="#4CAF50" />
            <Text style={styles.documentText}>Giấy chứng nhận ưu tiên (nếu có)</Text>
          </View>

          <View style={styles.documentCard}>
            <CheckCircle size={20} color="#4CAF50" />
            <Text style={styles.documentText}>Phiếu đăng ký xét tuyển (online)</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lịch tuyển sinh</Text>

          <View style={styles.timelineCard}>
            <View style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineContent}>
                <View style={styles.timelineHeader}>
                  <Calendar size={18} color="#FF6600" />
                  <Text style={styles.timelineDate}>Tháng 1 - Tháng 5</Text>
                </View>
                <Text style={styles.timelineTitle}>Tiếp nhận hồ sơ đợt 1</Text>
                <Text style={styles.timelineDescription}>
                  Xét tuyển sớm, ưu tiên học bổng cao
                </Text>
              </View>
            </View>

            <View style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineContent}>
                <View style={styles.timelineHeader}>
                  <Calendar size={18} color="#FF6600" />
                  <Text style={styles.timelineDate}>Tháng 6 - Tháng 7</Text>
                </View>
                <Text style={styles.timelineTitle}>Tiếp nhận hồ sơ đợt 2</Text>
                <Text style={styles.timelineDescription}>
                  Xét tuyển sau kỳ thi THPT quốc gia
                </Text>
              </View>
            </View>

            <View style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineContent}>
                <View style={styles.timelineHeader}>
                  <Calendar size={18} color="#FF6600" />
                  <Text style={styles.timelineDate}>Tháng 8</Text>
                </View>
                <Text style={styles.timelineTitle}>Nhập học</Text>
                <Text style={styles.timelineDescription}>
                  Làm thủ tục nhập học và đóng học phí
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.scholarshipSection}>
          <Text style={styles.scholarshipTitle}>Học bổng tân sinh viên</Text>
          <Text style={styles.scholarshipSubtitle}>Giá trị lên đến 100% học phí</Text>

          <View style={styles.scholarshipCard}>
            <Text style={styles.scholarshipType}>🏆 Học bổng 100%</Text>
            <Text style={styles.scholarshipCondition}>
              Điểm thi THPT ≥ 27/30 hoặc giải nhất cấp quốc gia
            </Text>
          </View>

          <View style={styles.scholarshipCard}>
            <Text style={styles.scholarshipType}>🥈 Học bổng 50%</Text>
            <Text style={styles.scholarshipCondition}>
              Điểm thi THPT từ 24-26.99/30 hoặc giải nhì, ba cấp quốc gia
            </Text>
          </View>

          <View style={styles.scholarshipCard}>
            <Text style={styles.scholarshipType}>🥉 Học bổng 30%</Text>
            <Text style={styles.scholarshipCondition}>
              Điểm thi THPT từ 22-23.99/30 hoặc giải khuyến khích
            </Text>
          </View>
        </View>

        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Bắt đầu hành trình của bạn</Text>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Đăng ký xét tuyển</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Tải hướng dẫn chi tiết</Text>
          </Pressable>
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
  methodCard: {
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
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  methodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
  },
  methodDescription: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 15,
  },
  requirementBox: {
    backgroundColor: '#FFF4ED',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6600',
  },
  requirementLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  requirementValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6600',
  },
  bulletList: {
    marginTop: 10,
  },
  bulletItem: {
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  documentText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  timelineCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF6600',
    marginTop: 5,
    marginRight: 15,
  },
  timelineContent: {
    flex: 1,
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timelineDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6600',
    marginLeft: 8,
  },
  timelineTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  timelineDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  scholarshipSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scholarshipTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  scholarshipSubtitle: {
    fontSize: 16,
    color: '#FF6600',
    marginBottom: 20,
  },
  scholarshipCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
  },
  scholarshipType: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  scholarshipCondition: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  ctaSection: {
    marginBottom: 40,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#FF6600',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#FF6600',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF6600',
  },
  secondaryButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FF6600',
  },
});
