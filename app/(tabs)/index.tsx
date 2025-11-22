import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { Award, Users, Globe, TrendingUp, FileText, Clock, ArrowRight } from 'lucide-react-native';
import { Link, useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import Header from '@/components/layout/Header';
export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const handleArticlePress = (articleId: number) => {
    router.push(`/article/${articleId}` as any);
  };

  const admissionArticles = [
    {
      id: 1,
      title: 'Hướng dẫn đăng ký xét tuyển ĐH FPT 2025',
      summary: 'Tìm hiểu chi tiết về quy trình đăng ký, hồ sơ cần thiết và lịch trình tuyển sinh năm 2025.',
      readTime: '5 phút đọc',
      publishDate: '15 Nov 2025',
      imageUrl: 'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 2,
      title: 'Điểm chuẩn và học phí các ngành tại ĐH FPT',
      summary: 'Thông tin mới nhất về điểm chuẩn, học phí và chính sách hỗ trợ tài chính cho sinh viên.',
      readTime: '7 phút đọc',
      publishDate: '12 Nov 2025',
      imageUrl: 'https://images.pexels.com/photos/159775/library-la-trobe-study-students-159775.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 3,
      title: 'Kinh nghiệm chuẩn bị hồ sơ xét tuyển',
      summary: 'Chia sẻ từ những sinh viên đã trúng tuyển về cách chuẩn bị hồ sơ ấn tượng.',
      readTime: '6 phút đọc',
      publishDate: '8 Nov 2025',
      imageUrl: 'https://images.pexels.com/photos/1925536/pexels-photo-1925536.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Trang chủ" showLogo={true} />
      <ScrollView style={styles.scrollContent}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=1200' }}
          style={styles.headerImage}
        />
        <View style={styles.headerOverlay}>
          <Text style={styles.logo}>FPT UNIVERSITY</Text>
          <Text style={styles.tagline}>Đào tạo nhân lực công nghệ hàng đầu Việt Nam</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Chào mừng đến với ĐH FPT</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Đại học FPT là trường đại học tư thân đầu tiên ở Việt Nam do Tập đoàn FPT thành lập,
            với sứ mệnh đào tạo nguồn nhân lực chất lượng cao trong lĩnh vực công nghệ thông tin
            và kinh doanh.
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Award size={32} color="#FF6600" />
            <Text style={styles.statNumber}>95%</Text>
            <Text style={styles.statLabel}>Sinh viên có việc làm</Text>
          </View>
          <View style={styles.statCard}>
            <Users size={32} color="#FF6600" />
            <Text style={styles.statNumber}>20,000+</Text>
            <Text style={styles.statLabel}>Sinh viên</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Globe size={32} color="#FF6600" />
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Cơ sở toàn quốc</Text>
          </View>
          <View style={styles.statCard}>
            <TrendingUp size={32} color="#FF6600" />
            <Text style={styles.statNumber}>Top 10</Text>
            <Text style={styles.statLabel}>ĐH hàng đầu VN</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tại sao chọn ĐH FPT?</Text>

          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>🎓 Chương trình đào tạo hiện đại</Text>
            <Text style={styles.featureText}>
              Liên tục cập nhật theo xu hướng công nghệ mới nhất, tích hợp thực hành và dự án thực tế
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>💼 Cam kết việc làm</Text>
            <Text style={styles.featureText}>
              95% sinh viên có việc làm ngay sau tốt nghiệp với mức lương khởi điểm cao
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>🌏 Môi trường quốc tế</Text>
            <Text style={styles.featureText}>
              Cơ hội học tập và thực tập tại các tập đoàn công nghệ hàng đầu thế giới
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>🏢 Cơ sở vật chất hiện đại</Text>
            <Text style={styles.featureText}>
              Phòng lab, thư viện, khu giải trí được trang bị theo tiêu chuẩn quốc tế
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 Bài viết về Tuyển sinh</Text>
          <Text style={styles.sectionDescription}>
            Cập nhật thông tin mới nhất về quy trình tuyển sinh và kinh nghiệm ứng tuyển
          </Text>
          
          {admissionArticles.map((article) => (
            <Pressable 
              key={article.id} 
              style={styles.articleCard}
              onPress={() => handleArticlePress(article.id)}
            >
              <Image source={{ uri: article.imageUrl }} style={styles.articleImage} />
              <View style={styles.articleContent}>
                <Text style={styles.articleTitle}>{article.title}</Text>
                <Text style={styles.articleSummary}>{article.summary}</Text>
                <View style={styles.articleMeta}>
                  <View style={styles.articleMetaItem}>
                    <Clock size={14} color="#666" />
                    <Text style={styles.articleMetaText}>{article.readTime}</Text>
                  </View>
                  <Text style={styles.articleDate}>{article.publishDate}</Text>
                </View>
                <View style={styles.readMoreContainer}>
                  <Text style={styles.readMoreText}>Đọc thêm</Text>
                  <ArrowRight size={16} color="#FF6600" />
                </View>
              </View>
            </Pressable>
          ))}
          
          <Link href="/articles" asChild>
            <Pressable style={styles.viewAllArticlesButton}>
              <Text style={styles.viewAllArticlesText}>Xem tất cả bài viết</Text>
              <ArrowRight size={18} color="#FF6600" />
            </Pressable>
          </Link>
        </View>

        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Sẵn sàng gia nhập ĐH FPT?</Text>
          <Link href="/admissions" asChild>
            <Pressable style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>Đăng ký xét tuyển ngay!</Text>
            </Pressable>
          </Link>
        </View>
         <Link href="/login" asChild>
        <Pressable
          style={{
            backgroundColor: "#FF6A00",
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 10,
            marginTop: 20,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Đi tới trang Login</Text>
        </Pressable>
      </Link>
      </View>
      
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flex: 1,
  },
  header: {
    height: 300,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
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
    marginBottom: 15,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6600',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  featureCard: {
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
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  ctaSection: {
    backgroundColor: '#FF6600',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    minHeight: 120,
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 28,
  },
  ctaButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6600',
    textAlign: 'center',
  },
  articleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  articleImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  articleContent: {
    padding: 16,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    lineHeight: 24,
  },
  articleSummary: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  articleMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  articleMetaText: {
    fontSize: 12,
    color: '#666',
  },
  articleDate: {
    fontSize: 12,
    color: '#666',
  },
  readMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  readMoreText: {
    fontSize: 14,
    color: '#FF6600',
    fontWeight: '600',
  },
  viewAllArticlesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#FF6600',
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  viewAllArticlesText: {
    fontSize: 16,
    color: '#FF6600',
    fontWeight: '600',
  },
});





