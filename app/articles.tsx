import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import Header from '@/components/layout/Header';
import {
  Search,
  Clock,
  ArrowRight,
  Calendar,
  Tag,
  Filter,
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useRouter } from 'expo-router';

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
}

const allArticles: Article[] = [
  {
    id: 1,
    title: 'Hướng dẫn đăng ký xét tuyển ĐH FPT 2025',
    summary: 'Tìm hiểu chi tiết về quy trình đăng ký, hồ sơ cần thiết và lịch trình tuyển sinh năm 2025.',
    content: 'Chi tiết về quy trình đăng ký xét tuyển...',
    readTime: '5 phút đọc',
    publishDate: '15 Nov 2025',
    category: 'Hướng dẫn',
    imageUrl: 'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['Đăng ký', 'Xét tuyển', 'Hướng dẫn']
  },
  {
    id: 2,
    title: 'Điểm chuẩn và học phí các ngành tại ĐH FPT',
    summary: 'Thông tin mới nhất về điểm chuẩn, học phí và chính sách hỗ trợ tài chính cho sinh viên.',
    content: 'Thông tin chi tiết về điểm chuẩn...',
    readTime: '7 phút đọc',
    publishDate: '12 Nov 2025',
    category: 'Thông tin',
    imageUrl: 'https://images.pexels.com/photos/159775/library-la-trobe-study-students-159775.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['Điểm chuẩn', 'Học phí', 'Tài chính']
  },
  {
    id: 3,
    title: 'Kinh nghiệm chuẩn bị hồ sơ xét tuyển',
    summary: 'Chia sẻ từ những sinh viên đã trúng tuyển về cách chuẩn bị hồ sơ ấn tượng.',
    content: 'Kinh nghiệm từ sinh viên...',
    readTime: '6 phút đọc',
    publishDate: '8 Nov 2025',
    category: 'Kinh nghiệm',
    imageUrl: 'https://images.pexels.com/photos/1925536/pexels-photo-1925536.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['Hồ sơ', 'Kinh nghiệm', 'Tuyển sinh']
  },
  {
    id: 4,
    title: 'Các ngành học hot tại ĐH FPT năm 2025',
    summary: 'Tổng quan về các ngành học được quan tâm nhiều nhất và cơ hội việc làm sau tốt nghiệp.',
    content: 'Các ngành học hot...',
    readTime: '8 phút đọc',
    publishDate: '5 Nov 2025',
    category: 'Ngành học',
    imageUrl: 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['Ngành học', 'Việc làm', 'Xu hướng']
  },
  {
    id: 5,
    title: 'Học bổng và hỗ trợ tài chính cho sinh viên',
    summary: 'Thông tin về các loại học bổng, điều kiện xét duyệt và cách thức đăng ký.',
    content: 'Thông tin về học bổng...',
    readTime: '6 phút đọc',
    publishDate: '2 Nov 2025',
    category: 'Học bổng',
    imageUrl: 'https://images.pexels.com/photos/5088180/pexels-photo-5088180.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['Học bổng', 'Hỗ trợ', 'Tài chính']
  },
  {
    id: 6,
    title: 'Cuộc sống sinh viên tại ĐH FPT',
    summary: 'Khám phá môi trường học tập, hoạt động ngoại khóa và cơ sở vật chất tại trường.',
    content: 'Cuộc sống sinh viên...',
    readTime: '5 phút đọc',
    publishDate: '30 Oct 2025',
    category: 'Đời sống',
    imageUrl: 'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['Sinh viên', 'Đời sống', 'Hoạt động']
  },
  {
    id: 7,
    title: 'Cơ hội thực tập và việc làm sau tốt nghiệp',
    summary: 'Tìm hiểu về chương trình thực tập và mạng lưới doanh nghiệp đối tác của ĐH FPT.',
    content: 'Cơ hội thực tập...',
    readTime: '9 phút đọc',
    publishDate: '25 Oct 2025',
    category: 'Nghề nghiệp',
    imageUrl: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['Thực tập', 'Việc làm', 'Nghề nghiệp']
  },
  {
    id: 8,
    title: 'Lịch sử và thành tựu của ĐH FPT',
    summary: 'Hành trình 20 năm phát triển và những thành tựu đáng tự hào của ĐH FPT.',
    content: 'Lịch sử phát triển...',
    readTime: '10 phút đọc',
    publishDate: '20 Oct 2025',
    category: 'Giới thiệu',
    imageUrl: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['Lịch sử', 'Thành tựu', 'ĐH FPT']
  }
];

const categories = ['Tất cả', 'Hướng dẫn', 'Thông tin', 'Kinh nghiệm', 'Ngành học', 'Học bổng', 'Đời sống', 'Nghề nghiệp', 'Giới thiệu'];

export default function ArticlesScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [filteredArticles, setFilteredArticles] = useState(allArticles);

  React.useEffect(() => {
    let filtered = allArticles;

    // Filter by category
    if (selectedCategory !== 'Tất cả') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    // Filter by search text
    if (searchText) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchText.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchText.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    setFilteredArticles(filtered);
  }, [searchText, selectedCategory]);

  const handleArticlePress = (articleId: number) => {
    router.push(`/article/${articleId}` as any);
  };

  const renderArticleCard = ({ item }: { item: Article }) => (
    <TouchableOpacity
      style={styles.articleCard}
      onPress={() => handleArticlePress(item.id)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.articleImage} />
      <View style={styles.articleContent}>
        <View style={styles.articleHeader}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <View style={styles.articleMeta}>
            <Clock size={12} color="#666" />
            <Text style={styles.metaText}>{item.readTime}</Text>
          </View>
        </View>
        
        <Text style={styles.articleTitle}>{item.title}</Text>
        <Text style={styles.articleSummary}>{item.summary}</Text>
        
        <View style={styles.articleFooter}>
          <View style={styles.dateContainer}>
            <Calendar size={12} color="#666" />
            <Text style={styles.dateText}>{item.publishDate}</Text>
          </View>
          <View style={styles.readMoreContainer}>
            <Text style={styles.readMoreText}>Đọc thêm</Text>
            <ArrowRight size={14} color="#FF6600" />
          </View>
        </View>
        
        <View style={styles.tagsContainer}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Tag size={10} color="#FF6600" />
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryFilter = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.categoriesContainer}
      contentContainerStyle={styles.categoriesContent}
    >
      {categories.map((category, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.categoryButton,
            selectedCategory === category && styles.selectedCategoryButton
          ]}
          onPress={() => setSelectedCategory(category)}
        >
          <Text style={[
            styles.categoryButtonText,
            selectedCategory === category && styles.selectedCategoryButtonText
          ]}>
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <Header title="Bài viết Tuyển sinh" showLogo={false} />
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm bài viết..."
            placeholderTextColor="#666"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Category Filter */}
      {renderCategoryFilter()}

      {/* Results Info */}
      <View style={styles.resultsInfo}>
        <Text style={styles.resultsText}>
          Tìm thấy {filteredArticles.length} bài viết
        </Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={16} color="#FF6600" />
          <Text style={styles.filterButtonText}>Bộ lọc</Text>
        </TouchableOpacity>
      </View>

      {/* Articles List - Takes most space */}
      <FlatList
        data={filteredArticles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderArticleCard}
        style={styles.articlesList}
        contentContainerStyle={styles.articlesContent}
        showsVerticalScrollIndicator={false}
        numColumns={1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    maxHeight: 40,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 8,
    alignItems: 'center',
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedCategoryButton: {
    backgroundColor: '#FF6600',
    borderColor: '#FF6600',
  },
  categoryButtonText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  selectedCategoryButtonText: {
    color: '#FFFFFF',
  },
  resultsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#FF6600',
    fontWeight: '500',
  },
  articlesList: {
    flex: 1,
  },
  articlesContent: {
    padding: 16,
    paddingBottom: 32,
  },
  articleCard: {
    backgroundColor: '#FFFFFF',
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
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#FF6600',
    fontWeight: '600',
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
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
    marginBottom: 16,
  },
  articleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  readMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readMoreText: {
    fontSize: 14,
    color: '#FF6600',
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    color: '#FF6600',
    fontWeight: '500',
  },
});
