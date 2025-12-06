import React, { useEffect, useState } from 'react';
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
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { getArticlesApi, ArticleApi } from '@/services/api';

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

const defaultImage =
  'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=400';

const STATIC_CATEGORIES = [
  'Tất cả',
  'Tuyển sinh',
  'Ngành học',
  'Học bổng',
  'Đời sống',
  'Nghề nghiệp',
];

export default function ArticlesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { token } = useAuth();         

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getArticlesApi(token);

        const mapped: Article[] = data.map((a: ArticleApi) => {
          const created = a.create_at ? new Date(a.create_at) : null;
          return {
            id: a.article_id,
            title: a.title,
            summary: a.description || '',
 
            content: a.url || '',
            readTime: '5 phút đọc', 
            publishDate: created
              ? created.toLocaleDateString('vi-VN')
              : 'Không rõ',
            category: a.major_name || 'Tuyển sinh',
            imageUrl: defaultImage,  
            tags: [
              a.major_name || '',
              a.specialization_name || '',
            ].filter(Boolean) as string[],
          };
        });

        setArticles(mapped);
        setFilteredArticles(mapped);
      } catch (err) {
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [token]);

  // 2) Lọc theo category + search
  useEffect(() => {
    let filtered = [...articles];

    if (selectedCategory !== 'Tất cả') {
      filtered = filtered.filter(
        (article) => article.category === selectedCategory
      );
    }

    if (searchText) {
      const q = searchText.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(q) ||
          article.summary.toLowerCase().includes(q) ||
          article.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    setFilteredArticles(filtered);
  }, [searchText, selectedCategory, articles]);

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
      {STATIC_CATEGORIES.map((category, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.categoryButton,
            selectedCategory === category && styles.selectedCategoryButton,
          ]}
          onPress={() => setSelectedCategory(category)}
        >
          <Text
            style={[
              styles.categoryButtonText,
              selectedCategory === category &&
                styles.selectedCategoryButtonText,
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Đang tải bài viết...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Bài viết Tuyển sinh" showLogo={false} />

      {/* Search */}
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <View
          style={[
            styles.searchInputContainer,
            { backgroundColor: colors.card },
          ]}
        >
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Tìm kiếm bài viết..."
            placeholderTextColor={colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {renderCategoryFilter()}

      <View style={styles.resultsInfo}>
        <Text style={styles.resultsText}>
          Tìm thấy {filteredArticles.length} bài viết
        </Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={16} color="#FF6600" />
          <Text style={styles.filterButtonText}>Bộ lọc</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredArticles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderArticleCard}
        style={styles.articlesList}
        contentContainerStyle={styles.articlesContent}
        showsVerticalScrollIndicator={false}
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
