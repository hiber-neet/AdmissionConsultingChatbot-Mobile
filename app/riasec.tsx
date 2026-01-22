import React, { useEffect, useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import Header from "@/components/layout/Header";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";

type Trait = "R" | "I" | "A" | "S" | "E" | "C";
type AnswerValue = 0 | 1;

const TRAIT_LABEL: Record<Trait, string> = {
  R: "Realistic (Thực tế)",
  I: "Investigative (Nghiên cứu)",
  A: "Artistic (Nghệ thuật)",
  S: "Social (Xã hội)",
  E: "Enterprising (Quản trị/Kinh doanh)",
  C: "Conventional (Quy củ/Hệ thống)",
};

const TRAIT_SUMMARY: Record<Trait, string> = {
  R: "Thực hành, thích làm việc với máy móc, công cụ, môi trường ngoài trời.",
  I: "Phân tích, thích tìm hiểu nguyên lý, dữ liệu, nghiên cứu.",
  A: "Sáng tạo, thẩm mỹ, thích thiết kế/biểu đạt.",
  S: "Giúp đỡ, giao tiếp, đào tạo, chăm sóc cộng đồng.",
  E: "Dẫn dắt, thuyết phục, kinh doanh, lập chiến lược.",
  C: "Tổ chức, quy trình, chi tiết, dữ liệu – thích làm việc theo chuẩn.",
};

const TRAIT_MAJORS: Record<Trait, string[]> = {
  R: ["Kỹ thuật cơ khí", "Xây dựng", "Kỹ thuật điện - điện tử", "Logistics vận hành"],
  I: ["Khoa học máy tính / AI", "Phân tích dữ liệu", "Sinh học / Hóa học ứng dụng"],
  A: ["Thiết kế đồ họa", "Thiết kế UX/UI", "Truyền thông đa phương tiện", "Kiến trúc"],
  S: ["Sư phạm / Đào tạo", "Công tác xã hội", "Y tế cộng đồng", "Tâm lý học"],
  E: ["Quản trị kinh doanh", "Marketing", "Tài chính - Khởi nghiệp", "Quản trị du lịch"],
  C: ["Kế toán - Kiểm toán", "Quản trị hệ thống thông tin", "Thư ký - Hành chính"],
};

const LIKERT = [
  { value: 1 as AnswerValue, label: "Đồng ý" },
  { value: 0 as AnswerValue, label: "Không đồng ý" },
];

const QUESTIONS: { id: string; trait: Trait; text: string }[] = [
  { id: "q1", trait: "R", text: "Tôi thích sửa chữa hoặc lắp ráp máy móc, đồ vật." },
  { id: "q2", trait: "R", text: "Tôi thích các hoạt động ngoài trời, vận động thể chất." },
  { id: "q3", trait: "R", text: "Tôi thích dùng công cụ để tạo ra thứ gì đó hữu ích." },
  { id: "q4", trait: "R", text: "Tôi thích vận hành máy móc, thiết bị kỹ thuật." },
  { id: "q5", trait: "R", text: "Tôi thấy hứng thú với các công việc yêu cầu thao tác tay khéo léo." },

  { id: "q6", trait: "I", text: "Tôi thích phân tích vấn đề và tìm ra nguyên lý đằng sau." },
  { id: "q7", trait: "I", text: "Tôi hứng thú với nghiên cứu khoa học / dữ liệu." },
  { id: "q8", trait: "I", text: "Tôi thích viết code, giải thuật hoặc thí nghiệm." },
  { id: "q9", trait: "I", text: "Tôi thường đặt nhiều câu hỏi 'vì sao' về mọi thứ xung quanh." },
  { id: "q10", trait: "I", text: "Tôi thích đọc sách/chuyên mục chuyên sâu để hiểu vấn đề đến gốc rễ." },

  { id: "q11", trait: "A", text: "Tôi thích vẽ, thiết kế, chụp ảnh hoặc sáng tác." },
  { id: "q12", trait: "A", text: "Tôi quan tâm thẩm mỹ và cách thể hiện ý tưởng." },
  { id: "q13", trait: "A", text: "Tôi thích những công việc không quá gò bó, có tự do sáng tạo." },
  { id: "q14", trait: "A", text: "Tôi thích tham gia biểu diễn, kể chuyện hoặc đóng vai." },
  { id: "q15", trait: "A", text: "Tôi thấy hứng thú với việc sắp xếp bố cục, màu sắc cho ấn phẩm/không gian." },

  { id: "q16", trait: "S", text: "Tôi thích hỗ trợ, lắng nghe và hướng dẫn người khác." },
  { id: "q17", trait: "S", text: "Tôi làm việc nhóm tốt và muốn tạo giá trị cho cộng đồng." },
  { id: "q18", trait: "S", text: "Tôi kiên nhẫn khi giải thích điều khó cho người khác." },
  { id: "q19", trait: "S", text: "Mọi người thường tìm đến tôi để xin lời khuyên hoặc chia sẻ." },
  { id: "q20", trait: "S", text: "Tôi thích tham gia hoạt động tình nguyện, CLB hoặc chương trình hỗ trợ người khác." },

  { id: "q21", trait: "E", text: "Tôi thích dẫn dắt nhóm và đưa ra quyết định." },
  { id: "q22", trait: "E", text: "Tôi quan tâm kinh doanh/khởi nghiệp, thuyết phục người khác." },
  { id: "q23", trait: "E", text: "Tôi thích thương lượng, xây dựng quan hệ và đạt mục tiêu." },
  { id: "q24", trait: "E", text: "Tôi thích đặt mục tiêu doanh số/kết quả và tìm cách đạt được." },
  { id: "q25", trait: "E", text: "Tôi cảm thấy tự tin khi thuyết trình hoặc nói trước đám đông." },

  { id: "q26", trait: "C", text: "Tôi chú ý chi tiết và làm việc có trình tự rõ ràng." },
  { id: "q27", trait: "C", text: "Tôi thấy thoải mái với số liệu, biểu mẫu, quy trình." },
  { id: "q28", trait: "C", text: "Tôi thích công việc ổn định, quy củ và có hướng dẫn rõ ràng." },
  { id: "q29", trait: "C", text: "Tôi hài lòng khi hoàn thành giấy tờ, bảng biểu gọn gàng, không sai sót." },
  { id: "q30", trait: "C", text: "Tôi thích sắp xếp dữ liệu/hồ sơ để dễ tra cứu và quản lý." },
];

const CHATBOT_PREFILL_KEY = "chatbot_prefill_message";

async function getToken() {
  return (await AsyncStorage.getItem("access_token")) ?? "";
}

export default function RiasecScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();

  const [token, setToken] = useState("");
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [submitted, setSubmitted] = useState(false);

  const [serverSummary, setServerSummary] = useState<string | null>(null);
  const [serverScores, setServerScores] = useState<Record<Trait, number> | null>(null);
  const [loadedAt, setLoadedAt] = useState<string | null>(null);

  const [loadingLast, setLoadingLast] = useState(false);
  const [saving, setSaving] = useState(false);

  const uid = (user as any)?.user_id ?? (user as any)?.id;

  useEffect(() => {
    (async () => setToken(await getToken()))();
  }, []);

  // ====== load last result (nếu login) ======
  useEffect(() => {
    const fetchLast = async () => {
      if (!uid || !token) return;

      try {
        setLoadingLast(true);
        const res = await api.get(`/riasec/users/${uid}/riasec/results`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const items = res.data;
        if (Array.isArray(items) && items.length > 0) {
          const latest = items[0];

          setServerScores({
            R: latest.score_realistic ?? 0,
            I: latest.score_investigative ?? 0,
            A: latest.score_artistic ?? 0,
            S: latest.score_social ?? 0,
            E: latest.score_enterprising ?? 0,
            C: latest.score_conventional ?? 0,
          });

          setServerSummary(latest.result || latest.summary || null);
          setSubmitted(true);

          setLoadedAt(
            latest.created_at
              ? new Date(latest.created_at).toLocaleDateString("vi-VN")
              : null
          );
        }
      } catch (e: any) {
        // không có thì thôi
      } finally {
        setLoadingLast(false);
      }
    };

    fetchLast();
  }, [uid, token]);

  const allAnswered = Object.keys(answers).length === QUESTIONS.length;

  const localScores = useMemo(() => {
    const init: Record<Trait, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    for (const q of QUESTIONS) {
      const v = answers[q.id] ?? 0;
      init[q.trait] += v;
    }
    return init;
  }, [answers]);

  const scores = serverScores ?? localScores;
  const insets = useSafeAreaInsets();
  const ranking = useMemo(() => {
    return (Object.keys(scores) as Trait[])
      .map((t) => ({ trait: t, score: scores[t] }))
      .sort((a, b) => b.score - a.score);
  }, [scores]);

  const top3 = ranking.slice(0, 3).map((r) => r.trait).join("") as string;

  const onPick = (qid: string, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const handleSubmit = () => {
    if (!allAnswered) {
      Alert.alert("Chưa đủ", "Bạn cần trả lời tất cả câu hỏi trước khi xem kết quả.");
      return;
    }
    setSubmitted(true);
    setLoadedAt(null);
    setServerScores(null);
    setServerSummary(null);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setServerScores(null);
    setServerSummary(null);
    setLoadedAt(null);
  };

  const postRiasecToServer = async () => {
    if (!token) {
      Alert.alert("Thiếu token", "Bạn cần đăng nhập để lưu kết quả.");
      return null;
    }

    const payload = {
      score_realistic: scores.R,
      score_investigative: scores.I,
      score_artistic: scores.A,
      score_social: scores.S,
      score_enterprising: scores.E,
      score_conventional: scores.C,
      result:
        `Top 3: ${top3}. ` +
        (Object.keys(scores) as Trait[]).map((t) => `${t}=${scores[t]}`).join(", "),
    };

    try {
      setSaving(true);
      const res = await api.post(`/riasec/submit`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const summaryFromServer = res.data?.summary ?? res.data?.result ?? null;
      if (summaryFromServer) setServerSummary(summaryFromServer);

      setServerScores({
        R: payload.score_realistic,
        I: payload.score_investigative,
        A: payload.score_artistic,
        S: payload.score_social,
        E: payload.score_enterprising,
        C: payload.score_conventional,
      });

      setSubmitted(true);
      return res.data;
    } catch (e) {
      Alert.alert("Lỗi", "Có lỗi khi gửi kết quả RIASEC. Thử lại sau nhé.");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!uid) {
      Alert.alert("Chưa đăng nhập", "Bạn cần đăng nhập để lưu kết quả vào hệ thống.");
      return;
    }
    if (!submitted) {
      Alert.alert("Chưa có kết quả", "Hãy làm bài và xem kết quả trước.");
      return;
    }
    const data = await postRiasecToServer();
    if (data) Alert.alert("Thành công", "Đã lưu kết quả RIASEC!");
  };

  const handleSendToChatbot = async () => {
    if (!submitted) {
      Alert.alert("Chưa có kết quả", "Bạn cần xem kết quả trước khi gửi cho chatbot.");
      return;
    }

    // Nếu có login thì lưu DB trước
    if (uid && token) await postRiasecToServer();

    const json = {
      student_id: uid ? String(uid) : `guest-${Date.now()}`,
      answers: {
        R: scores.R,
        I: scores.I,
        A: scores.A,
        S: scores.S,
        E: scores.E,
        C: scores.C,
      },
    };

    await AsyncStorage.setItem(CHATBOT_PREFILL_KEY, JSON.stringify(json));

    // route chatbot của bạn thường là "/chatbot"
    router.push("/chat");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="RIASEC" showLogo={false} />

<ScrollView
  contentContainerStyle={[
    styles.content,
    { paddingBottom: insets.bottom + 20 },
  ]}
>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.h1, { color: colors.text }]}>Trắc nghiệm RIASEC</Text>
          <Text style={[styles.p, { color: colors.textSecondary }]}>
            Đánh giá xu hướng nghề nghiệp theo 6 nhóm: R, I, A, S, E, C.
          </Text>

          {loadedAt ? (
            <Text style={[styles.small, { color: colors.textSecondary }]}>
              Đã tải kết quả gần nhất lúc: {loadedAt}
            </Text>
          ) : null}

          {loadingLast ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator />
              <Text style={[styles.small, { color: colors.textSecondary }]}>
                Đang tải kết quả gần nhất...
              </Text>
            </View>
          ) : null}
        </View>

        {!submitted ? (
          <>
            {QUESTIONS.map((q, idx) => {
              const selected = answers[q.id];
              return (
                <View
                  key={q.id}
                  style={[styles.qCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                  <View style={styles.qHeader}>
                    <Text style={[styles.qText, { color: colors.text }]}>
                      {idx + 1}. {q.text}
                    </Text>
                    <Text style={[styles.qTrait, { color: colors.textSecondary }]}>
                      {TRAIT_LABEL[q.trait]}
                    </Text>
                  </View>

                  <View style={styles.optionsRow}>
                    {LIKERT.map((opt) => {
                      const active = selected === opt.value;
                      return (
                        <Pressable
                          key={opt.value}
                          onPress={() => onPick(q.id, opt.value)}
                          style={[
                            styles.optBtn,
                            {
                              borderColor: active ? "#EB5A0D" : colors.border,
                              backgroundColor: active ? "rgba(235,90,13,0.12)" : colors.card,
                            },
                          ]}
                        >
                          <Text style={[styles.optText, { color: colors.text }]}>
                            {opt.label}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              );
            })}

            <View style={[styles.bottomBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.small, { color: colors.textSecondary }]}>
                Đã trả lời: {Object.keys(answers).length}/{QUESTIONS.length}
              </Text>

              <Pressable
                onPress={handleSubmit}
                disabled={!allAnswered}
                style={[
                  styles.primaryBtn,
                  { opacity: allAnswered ? 1 : 0.5 },
                ]}
              >
                <Text style={styles.primaryBtnText}>Xem kết quả</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <View style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.h2, { color: colors.text }]}>Kết quả tóm tắt</Text>

              <Text style={[styles.p, { color: colors.textSecondary }]}>
                Điểm (0–5 mỗi nhóm):{" "}
                {(Object.keys(scores) as Trait[]).map((t) => `${t}=${scores[t]}`).join(", ")}
              </Text>

              <Text style={[styles.p, { color: colors.textSecondary, marginTop: 8 }]}>
                Top 3 của bạn: <Text style={{ color: "#EB5A0D", fontWeight: "900" }}>{top3}</Text>
              </Text>

              {serverSummary ? (
                <View style={styles.summaryBox}>
                  <Text style={[styles.summaryTitle, { color: colors.text }]}>
                    Gợi ý phân tích từ hệ thống:
                  </Text>
                  <Text style={[styles.p, { color: colors.textSecondary }]}>
                    {serverSummary}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* Giải thích nhanh Top 3 */}
            <View style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.h2, { color: colors.text }]}>Ý nghĩa nhóm mạnh</Text>

              {ranking.slice(0, 3).map((r) => (
                <View key={r.trait} style={{ marginTop: 10 }}>
                  <Text style={[styles.traitTitle, { color: colors.text }]}>
                    {r.trait} — {TRAIT_LABEL[r.trait]}
                  </Text>
                  <Text style={[styles.p, { color: colors.textSecondary }]}>
                    {TRAIT_SUMMARY[r.trait]}
                  </Text>

                  <Text style={[styles.small, { color: colors.textSecondary, marginTop: 6 }]}>
                    Gợi ý ngành: {TRAIT_MAJORS[r.trait].join(" • ")}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.actionsRow}>
              <Pressable
                onPress={handleSendToChatbot}
                disabled={saving}
                style={[styles.darkBtn, { opacity: saving ? 0.7 : 1 }]}
              >
                {saving ? <ActivityIndicator color="#fff" /> : null}
                <Text style={styles.darkBtnText}>Đưa kết quả cho chatbot</Text>
              </Pressable>

              {uid ? (
                <Pressable
                  onPress={handleSave}
                  disabled={saving}
                  style={[styles.greenBtn, { opacity: saving ? 0.7 : 1 }]}
                >
                  {saving ? <ActivityIndicator color="#fff" /> : null}
                  <Text style={styles.greenBtnText}>Lưu kết quả</Text>
                </Pressable>
              ) : null}

              <Pressable onPress={handleReset} style={[styles.outlineBtn, { borderColor: colors.border }]}>
                <Text style={[styles.outlineBtnText, { color: colors.text }]}>Làm lại</Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 26 },

  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },

  h1: { fontSize: 18, fontWeight: "900" },
  h2: { fontSize: 16, fontWeight: "900" },
  p: { marginTop: 6, fontSize: 13, lineHeight: 18 },
  small: { marginTop: 6, fontSize: 12 },

  loadingRow: { flexDirection: "row", gap: 10, alignItems: "center", marginTop: 8 },

  qCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  qHeader: { marginBottom: 10 },
  qText: { fontSize: 14, fontWeight: "800", lineHeight: 20 },
  qTrait: { marginTop: 6, fontSize: 12 },

  optionsRow: { flexDirection: "row", gap: 10 },
  optBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  optText: { fontSize: 13, fontWeight: "800" },

  bottomBar: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  primaryBtn: {
    backgroundColor: "#EB5A0D",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  primaryBtnText: { color: "#fff", fontWeight: "900" },

  resultCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  summaryBox: {
    marginTop: 12,
    borderRadius: 12,
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.04)",
  },
  summaryTitle: { fontWeight: "900", marginBottom: 6 },

  traitTitle: { fontSize: 13, fontWeight: "900" },

  actionsRow: { gap: 10, marginBottom: 18 },
  darkBtn: {
    backgroundColor: "#111827",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  darkBtnText: { color: "#fff", fontWeight: "900" },

  greenBtn: {
    backgroundColor: "#16A34A",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  greenBtnText: { color: "#fff", fontWeight: "900" },

  outlineBtn: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineBtnText: { fontWeight: "900" },
});
