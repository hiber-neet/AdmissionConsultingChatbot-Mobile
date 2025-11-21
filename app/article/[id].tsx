import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Clock,
  Calendar,
  Tag,
  Share2,
  Bookmark,
  Heart,
  MessageCircle,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface Article {
  id: number;
  title: string;
  summary: string;
  content: string;
  readTime: string;
  publishDate: string;
  category: string;
  imageUrl: string;
  tags: string[];
  author: string;
  views: number;
}

// Sample full articles data (in real app, this would come from API)
const articlesData: Article[] = [
  {
    id: 1,
    title: 'Hướng dẫn đăng ký xét tuyển ĐH FPT 2025',
    summary: 'Tìm hiểu chi tiết về quy trình đăng ký, hồ sơ cần thiết và lịch trình tuyển sinh năm 2025.',
    content: `
# Quy trình đăng ký xét tuyển ĐH FPT 2025

Đại học FPT là một trong những trường đại học hàng đầu về công nghệ thông tin tại Việt Nam. Với phương châm "Học để làm việc", ĐH FPT luôn chú trọng đào tạo sinh viên có kỹ năng thực tế cao, đáp ứng nhu cầu của thị trường lao động.

## 1. Điều kiện xét tuyển

### Đối với thí sinh tốt nghiệp THPT
- Có bằng tốt nghiệp THPT hoặc tương đương
- Điểm trung bình học tập tối thiểu: 6.5/10
- Không có yêu cầu về điểm thi THPT Quốc gia

### Đối với thí sinh đã có bằng đại học
- Có bằng tốt nghiệp đại học chính quy
- Điểm trung bình tích lũy tối thiểu: 2.0/4.0

## 2. Hồ sơ đăng ký

### Hồ sơ bắt buộc:
1. **Đơn đăng ký xét tuyển** (theo mẫu của trường)
2. **Bản sao công chứng** bằng tốt nghiệp THPT
3. **Bản sao công chứng** học bạ THPT (3 năm)
4. **Giấy khai sinh** (bản sao có công chứng)
5. **CMND/CCCD** (bản sao)
6. **4 ảnh 3x4** (nền trắng, chụp trong vòng 6 tháng)

### Hồ sơ bổ sung (nếu có):
- Chứng chỉ ngoại ngữ (IELTS, TOEIC, TOEFL...)
- Chứng chỉ tin học (MOS, IC3...)
- Giấy khen, bằng khen học tập
- Giải thưởng cuộc thi học sinh giỏi

## 3. Lịch trình tuyển sinh

### Đợt 1: Tháng 3 - Tháng 5
- **Nhận hồ sơ:** 01/03/2025 - 30/04/2025
- **Công bố kết quả:** 15/05/2025
- **Nhập học:** 20/05/2025 - 31/05/2025

### Đợt 2: Tháng 6 - Tháng 8  
- **Nhận hồ sơ:** 01/06/2025 - 31/07/2025
- **Công bố kết quả:** 15/08/2025
- **Nhập học:** 20/08/2025 - 31/08/2025

### Đợt 3: Tháng 9 - Tháng 11
- **Nhận hồ sơ:** 01/09/2025 - 31/10/2025
- **Công bố kết quả:** 15/11/2025
- **Nhập học:** 20/11/2025 - 30/11/2025

## 4. Cách thức nộp hồ sơ

### Nộp trực tiếp:
- **Địa chỉ:** Khu Công nghệ cao Hòa Lạc, Km29 Đại lộ Thăng Long, Thạch Thất, Hà Nội
- **Thời gian:** Thứ 2 - Thứ 6 (8h00 - 17h00), Thứ 7 (8h00 - 12h00)

### Nộp qua đường bưu điện:
- Gửi hồ sơ về địa chỉ trên
- Ghi rõ "HỒ SƠ XÉT TUYỂN ĐẠI HỌC FPT"

### Nộp online:
- Truy cập website: [daihoc.fpt.edu.vn](https://daihoc.fpt.edu.vn)
- Đăng ký tài khoản và nộp hồ sơ trực tuyến

## 5. Lệ phí xét tuyển

- **Lệ phí xét tuyển:** 100.000 VNĐ/ngành
- **Phương thức thanh toán:**
  - Chuyển khoản ngân hàng
  - Thanh toán trực tiếp tại trường
  - Thanh toán online qua cổng thanh toán

## 6. Kết quả xét tuyển

- Kết quả được thông báo qua:
  - Website chính thức của trường
  - Email đăng ký
  - SMS thông báo
  - Điện thoại trực tiếp

## 7. Lưu ý quan trọng

⚠️ **Những điều cần nhớ:**
- Kiểm tra kỹ thông tin trước khi nộp hồ sơ
- Nộp hồ sơ sớm để có nhiều cơ hội được xét tuyển
- Chuẩn bị đầy đủ hồ sơ theo yêu cầu
- Theo dõi thông tin tuyển sinh trên website chính thức

**Liên hệ hỗ trợ:**
- **Hotline:** 1900 63 67 33
- **Email:** tuyensinh@fpt.edu.vn
- **Fanpage:** facebook.com/fptuniversity

Chúc các bạn thí sinh hoàn thành thủ tục đăng ký thành công và trở thành sinh viên ĐH FPT!
    `,
    readTime: '5 phút đọc',
    publishDate: '15 Nov 2025',
    category: 'Hướng dẫn',
    imageUrl: 'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Đăng ký', 'Xét tuyển', 'Hướng dẫn'],
    author: 'Ban Tuyển sinh ĐH FPT',
    views: 1250,
  },
  {
    id: 2,
    title: 'Điểm chuẩn và học phí các ngành tại ĐH FPT',
    summary: 'Thông tin mới nhất về điểm chuẩn, học phí và chính sách hỗ trợ tài chính cho sinh viên.',
    content: `
# Điểm chuẩn và học phí các ngành tại ĐH FPT 2025

Thông tin chi tiết về điểm chuẩn, học phí và các chính sách hỗ trợ tài chính tại Đại học FPT năm 2025.

## Điểm chuẩn các ngành

### Khối ngành Công nghệ thông tin
- **Kỹ thuật phần mềm:** 22.5 điểm
- **Hệ thống thông tin:** 22.0 điểm  
- **An toàn thông tin:** 23.0 điểm
- **Trí tuệ nhân tạo:** 24.0 điểm

### Khối ngành Kinh tế
- **Quản trị kinh doanh:** 21.5 điểm
- **Marketing:** 21.0 điểm
- **Tài chính - Ngân hàng:** 22.0 điểm

## Học phí 2025

### Ngành Công nghệ thông tin
- **Học phí/kỳ:** 29.000.000 VNĐ
- **Học phí/năm:** 58.000.000 VNĐ

### Ngành Kinh tế  
- **Học phí/kỳ:** 26.000.000 VNĐ
- **Học phí/năm:** 52.000.000 VNĐ

## Chính sách hỗ trợ học phí

### Học bổng học tập
- **Học bổng xuất sắc:** Miễn 100% học phí
- **Học bổng giỏi:** Miễn 50% học phí
- **Học bổng khá:** Miễn 25% học phí

### Hỗ trợ tài chính
- **Vay ngân hàng:** Lãi suất ưu đãi 0%
- **Trả góp học phí:** Không lãi suất
- **Làm thêm tại trường:** 15.000 - 25.000 VNĐ/giờ

Liên hệ phòng Tài chính để biết thêm chi tiết!
    `,
    readTime: '7 phút đọc',
    publishDate: '12 Nov 2025',
    category: 'Thông tin',
    imageUrl: 'https://images.pexels.com/photos/159775/library-la-trobe-study-students-159775.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['Điểm chuẩn', 'Học phí', 'Tài chính'],
    author: 'Phòng Đào tạo',
    views: 892,
  },
  // Add more articles as needed...
];

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const articleId = parseInt(id as string);
  
  const article = articlesData.find(a => a.id === articleId);

  if (!article) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bài viết</Text>
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Không tìm thấy bài viết</Text>
        </View>
      </View>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${article.title}\n\n${article.summary}\n\nĐọc thêm tại ứng dụng ĐH FPT`,
        title: article.title,
      });
    } catch (error) {
      console.error('Error sharing article:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết bài viết</Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Share2 size={24} color="#FF6600" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <Image source={{ uri: article.imageUrl }} style={styles.heroImage} />
        
        {/* Article Header */}
        <View style={styles.articleHeader}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{article.category}</Text>
          </View>
          
          <Text style={styles.title}>{article.title}</Text>
          <Text style={styles.summary}>{article.summary}</Text>
          
          {/* Meta Information */}
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Calendar size={14} color="#666" />
              <Text style={styles.metaText}>{article.publishDate}</Text>
            </View>
            <View style={styles.metaItem}>
              <Clock size={14} color="#666" />
              <Text style={styles.metaText}>{article.readTime}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaText}>{article.views} lượt xem</Text>
            </View>
          </View>

          <View style={styles.authorContainer}>
            <Text style={styles.authorText}>Bởi {article.author}</Text>
          </View>
        </View>

        {/* Article Content */}
        <View style={styles.articleContent}>
          <Text style={styles.contentText}>{article.content}</Text>
        </View>

        {/* Tags */}
        <View style={styles.tagsContainer}>
          <Text style={styles.tagsTitle}>Thẻ liên quan:</Text>
          <View style={styles.tagsRow}>
            {article.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Tag size={12} color="#FF6600" />
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Heart size={20} color="#666" />
            <Text style={styles.actionButtonText}>Thích</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Bookmark size={20} color="#666" />
            <Text style={styles.actionButtonText}>Lưu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Share2 size={20} color="#666" />
            <Text style={styles.actionButtonText}>Chia sẻ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MessageCircle size={20} color="#666" />
            <Text style={styles.actionButtonText}>Bình luận</Text>
          </TouchableOpacity>
        </View>

        {/* Related Articles */}
        <View style={styles.relatedSection}>
          <Text style={styles.relatedTitle}>Bài viết liên quan</Text>
          <TouchableOpacity 
            style={styles.backToListButton}
            onPress={() => router.push('/articles')}
          >
            <Text style={styles.backToListText}>Xem tất cả bài viết</Text>
            <ArrowLeft size={16} color="#FF6600" style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingTop: 48,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  shareButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  heroImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  articleHeader: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 12,
    color: '#FF6600',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 32,
    marginBottom: 12,
  },
  summary: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
  },
  authorContainer: {
    marginTop: 8,
  },
  authorText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  articleContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 8,
  },
  contentText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 26,
  },
  tagsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 8,
  },
  tagsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    color: '#FF6600',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 8,
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  relatedSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 8,
    marginBottom: 32,
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  backToListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backToListText: {
    fontSize: 14,
    color: '#FF6600',
    fontWeight: '600',
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 18,
    color: '#666',
  },
});