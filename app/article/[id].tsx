  import React, { useEffect, useState } from "react";
  import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
  } from "react-native";
  import { useLocalSearchParams, useRouter } from "expo-router";
  import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react-native";
  import { useTheme } from "@/contexts/ThemeContext";
  import { getArticleApi } from "@/services/api";
  import Markdown from "react-native-markdown-display";
  import { Linking } from "react-native";

  type ArticleUI = {
    id: number;
    title: string;
    summary: string;
    content: string;
    publishDate: string;
    category: string;
    imageUrl: string;
    author: string;
    tags: string[];
    readTime: string;
    url?: string; 
  };

  const DEFAULT_IMAGE =
    "https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg";

  export default function ArticleDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { colors } = useTheme();

    const [article, setArticle] = useState<ArticleUI | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (!id) return;

      const fetchArticle = async () => {
        try {
          const api = await getArticleApi(Number(id));

          // setArticle({
          //   id: api.article_id,
          //   title: api.title,
          //   summary: api.description ?? "",
          //   content: api.note ?? "",
          //   publishDate: new Date(api.create_at).toLocaleDateString("vi-VN"),
          //   category:
          //     api.specialization_name ||
          //     api.major_name ||
          //     "Chung",
          //   imageUrl: api.link_image || DEFAULT_IMAGE,
          //   author: api.author_name || "Ẩn danh",
          //   tags: [api.major_name, api.specialization_name].filter(
          //     Boolean
          //   ) as string[],
          //   readTime: "5 phút đọc",
          //   url: api.url || undefined,
          // });

          setArticle({
  id: api.article_id,
  title: api.title,
  summary: api.description ?? "",
  content: (api.note ?? "").replace(/^Đã phê duyệt\s*/i, ""),
  publishDate: new Date(api.create_at).toLocaleDateString("vi-VN"),
  category:
    api.specialization_name ||
    api.major_name ||
    "Chung",
  imageUrl: api.link_image || DEFAULT_IMAGE,
  author: api.author_name || "Ẩn danh",
  tags: [api.major_name, api.specialization_name].filter(Boolean) as string[],
  readTime: "5 phút đọc",
  url: api.url || undefined,
});
        } catch (error) {
          console.error("Fetch article error:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchArticle();
    }, [id]);

    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (!article) {
      return (
        <View style={styles.center}>
          <Text>Không tìm thấy bài viết</Text>
        </View>
      );
    }

    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Chi tiết bài viết
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Image */}
          <Image source={{ uri: article.imageUrl }} style={styles.image} />

          {/* Content */}
          <View style={[styles.content, { backgroundColor: colors.card }]}>
            <View style={styles.category}>
              <Text style={styles.categoryText}>{article.category}</Text>
            </View>

            <Text style={[styles.title, { color: colors.text }]}>
              {article.title}
            </Text>


            <View style={styles.meta}>
              <Calendar size={14} color="#666" />
              <Text style={styles.metaText}>{article.publishDate}</Text>

              <Clock size={14} color="#666" />
              <Text style={styles.metaText}>{article.readTime}</Text>
            </View>

            <Text style={[styles.summary, { color: colors.textSecondary }]}>
              {article.summary}
            </Text>

            <Markdown style={{ body: styles.markdown }}>
              {article.content}
            </Markdown>

{article.url && (
  <TouchableOpacity
    onPress={() => Linking.openURL(article.url as string)}
    style={{ marginTop: 12 }}
  >
    <Text style={{ color: "#2563EB", fontWeight: "600" }}>
      🔗 Xem nguồn bài viết
    </Text>
  </TouchableOpacity>
)}

            {/* Tags */}
            <View style={styles.tags}>
              {article.tags.map((t, i) => (
                <View key={i} style={styles.tag}>
                  <Tag size={12} color="#FF6600" />
                  <Text style={styles.tagText}>{t}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: { flex: 1 },
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      justifyContent: "space-between",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "bold",
    },
    image: {
      width: "100%",
      height: 240,
    },
    content: {
      padding: 16,
    },
    category: {
      backgroundColor: "#FEF3E2",
      alignSelf: "flex-start",
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      marginBottom: 12,
    },
    categoryText: {
      color: "#FF6600",
      fontWeight: "600",
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 8,
    },
    summary: {
      fontSize: 15,
      marginBottom: 12,
    },
    meta: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 16,
    },
    metaText: {
      fontSize: 12,
      color: "#666",
    },
    markdown: {
      fontSize: 16,
      lineHeight: 26,
    },
    tags: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 16,
    },
    tag: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: "#FEF3E2",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    tagText: {
      color: "#FF6600",
      fontSize: 12,
    },
  });
