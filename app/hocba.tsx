import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Header from "@/components/layout/Header";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { Save } from "lucide-react-native";

type SubjectKey =
  | "math"
  | "literature"
  | "english"
  | "physics"
  | "chemistry"
  | "biology"
  | "history"
  | "geography";

type Subject = { key: SubjectKey; label: string };

type Scores = Record<SubjectKey, string>;

const ENDPOINTS = {
  upload: "/academic-score/upload",
  getByUser: (userId: number | string) =>
    `/academic-score/users/${userId}/academic-scores`,
};

// ✅ ĐÚNG THEO API FIELD (giống SUBJECT_API_FIELDS ở web)
const SUBJECTS: Subject[] = [
  { key: "math", label: "Toán học(*)" },
  { key: "literature", label: "Ngữ văn(*)" },
  { key: "english", label: "Ngoại ngữ" },
  { key: "physics", label: "Vật lý" },
  { key: "chemistry", label: "Hóa học" },
  { key: "biology", label: "Sinh học" },
  { key: "history", label: "Lịch sử" },
  { key: "geography", label: "Địa lý" },
];

const SUBJECTS_LEFT = SUBJECTS.slice(0, Math.ceil(SUBJECTS.length / 2));
const SUBJECTS_RIGHT = SUBJECTS.slice(Math.ceil(SUBJECTS.length / 2));

function initScores(): Scores {
  return {
    math: "",
    literature: "",
    english: "",
    physics: "",
    chemistry: "",
    biology: "",
    history: "",
    geography: "",
  };
}

async function getTokenFromStorage() {
  return (await AsyncStorage.getItem("access_token")) ?? "";
}

export default function HocBaScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  const [token, setToken] = useState("");
  const [scores, setScores] = useState<Scores>(() => initScores());
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const uid = (user as any)?.user_id ?? (user as any)?.id;

  useEffect(() => {
    (async () => setToken(await getTokenFromStorage()))();
  }, []);

  // ✅ giống web: đếm số môn đã nhập (chỉ cần có value)
  const filledCount = useMemo(() => {
    let c = 0;
    for (const s of SUBJECTS) {
      if ((scores[s.key] ?? "").trim()) c++;
    }
    return c;
  }, [scores]);

  // ✅ TB chỉ tính các môn đã nhập
  const overallAvg = useMemo(() => {
    const values: number[] = [];
    for (const s of SUBJECTS) {
      const raw = (scores[s.key] ?? "").trim();
      if (!raw) continue;
      const n = parseFloat(raw);
      if (!Number.isNaN(n)) values.push(n);
    }
    if (!values.length) return null;
    const avg = values.reduce((sum, x) => sum + x, 0) / values.length;
    return Math.round(avg * 100) / 100;
  }, [scores]);

  // ✅ LOGIC CHUẨN GIỐNG handleScoreChange bên web
  const normalizeScoreInput = (rawValue: string) => {
    let value = rawValue ?? "";

    // chỉ cho số và dấu chấm
    value = value.replace(/[^0-9.]/g, "");

    // nếu nhập nhiều dấu . -> giữ 1 dấu đầu
    const firstDot = value.indexOf(".");
    if (firstDot !== -1) {
      const before = value.slice(0, firstDot + 1);
      const after = value.slice(firstDot + 1).replace(/\./g, "");
      value = before + after;
    }

    // giới hạn số lượng chữ số (web: digits > 2 thì cắt)
    const digits = value.replace(/\./g, "");
    if (digits.length > 2) value = digits.slice(0, 2);

    // nếu là 2 chữ số (vd 11) -> chuyển thành 1.1
    if (/^[0-9]{2}$/.test(value)) {
      const intVal = parseInt(value, 10);
      if (intVal > 10) value = (intVal / 10).toFixed(1);
    }

    // nếu dạng x.y -> clamp <=10
    if (/^[0-9]\.[0-9]$/.test(value)) {
      let f = parseFloat(value);
      if (f > 10) f = 10;
      value = f.toString();
    }

    // clamp >10
    let num = parseFloat(value);
    if (!Number.isNaN(num) && num > 10) value = "10";

    // chỉ cho tối đa 1 chữ số thập phân
    value = value.match(/^\d{1,2}(\.\d{0,1})?/)?.[0] || "";

    return value;
  };

  const setScore = (key: SubjectKey, rawValue: string) => {
    const value = normalizeScoreInput(rawValue);
    setScores((prev) => ({ ...prev, [key]: value }));
  };

  // ✅ giống web: payload chỉ gồm môn đã nhập, parseFloat
  const buildPayload = () => {
    const payload: Partial<Record<SubjectKey, number>> = {};

    for (const s of SUBJECTS) {
      const raw = (scores[s.key] ?? "").trim();
      if (!raw) continue;

      const n = parseFloat(raw);
      if (!Number.isNaN(n)) {
        payload[s.key] = n;
      }
    }

    return payload;
  };

  const fillFromResponse = (data: any) => {
    const next = initScores();
    for (const s of SUBJECTS) {
      const v = data?.[s.key];
      if (v !== null && v !== undefined) next[s.key] = String(v);
    }
    setScores(next);
  };

  const fetchAcademicScores = async () => {
    if (!uid || !token) return;

    try {
      setLoading(true);
      const res = await api.get(ENDPOINTS.getByUser(uid), {
        headers: { Authorization: `Bearer ${token}` },
      });

      const raw = res?.data;
      if (raw) fillFromResponse(raw);
      else setScores(initScores());
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404 || status === 500) {
        // giống web: 404/500 thì bỏ qua
        return;
      }
      Alert.alert(
        "Lỗi tải học bạ",
        err?.response?.data?.detail ?? "Không thể tải học bạ."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || !uid) return;
    fetchAcademicScores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, uid]);

  // ✅ VALIDATE GIỐNG WEB
  const validateBeforeSave = () => {
    const payload = buildPayload();
    const count = Object.keys(payload).length;

    if (count < 6) {
      Alert.alert("Chưa đủ môn", "Cần nhập tối thiểu 06 môn.");
      return false;
    }

    // range check 0..10 (web đã normalize nhưng vẫn check cho chắc)
    for (const [k, v] of Object.entries(payload)) {
      const n = Number(v);
      if (Number.isNaN(n) || n < 0 || n > 10) {
        Alert.alert("Điểm không hợp lệ", `${k} phải nằm trong khoảng 0 - 10.`);
        return false;
      }
    }

    return true;
  };

  const saveAcademicScores = async () => {
    if (!token) {
      Alert.alert("Thiếu token", "Không tìm thấy access_token để gọi API.");
      return;
    }
    if (!validateBeforeSave()) return;

    try {
      setUploading(true);

      const payload = buildPayload(); // ✅ chỉ gửi môn đã nhập

      await api.post(ENDPOINTS.upload, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert("Thành công", "Đã lưu học bạ.");
      await fetchAcademicScores();
    } catch (err: any) {
      Alert.alert(
        "Lỗi lưu học bạ",
        err?.response?.data?.detail ?? "Lưu thất bại, vui lòng kiểm tra lại."
      );
    } finally {
      setUploading(false);
    }
  };

  const renderScoreInput = (subjectKey: SubjectKey) => {
    return (
      <TextInput
        value={scores[subjectKey]}
        onChangeText={(v) => setScore(subjectKey, v)}
        keyboardType="decimal-pad"
        maxLength={4}
        placeholder="0.0"
        placeholderTextColor="rgba(255,255,255,0.55)"
        style={[
          styles.scoreInput,
          { color: "#fff", borderColor: "rgba(255,255,255,0.35)" },
        ]}
      />
    );
  };

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Học bạ" showLogo={false} />
        <View style={styles.center}>
          <Text style={[styles.title, { color: colors.text }]}>
            Bạn chưa đăng nhập
          </Text>
          <Text style={[styles.sub, { color: colors.textSecondary }]}>
            Vui lòng đăng nhập để nhập và lưu học bạ.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Header title="Học bạ" showLogo={false} />

      <ScrollView contentContainerStyle={styles.content}>
        <View
          style={[
            styles.outerCard,
            { borderColor: colors.border, backgroundColor: colors.card },
          ]}
        >
          <View style={styles.orangePanel}>
            {/* ✅ giữ UI, chỉ đổi đúng text theo web */}
            <Text style={styles.orangeNote}>
              Cần nhập tối thiểu 06 môn cho cả bảng điểm, nếu điểm là số thập
              phân, sử dụng dấu chấm
            </Text>

            <View
              style={[
                styles.gridWrap,
                { flexDirection: isWide ? "row" : "column" },
              ]}
            >
              {/* LEFT */}
              <View style={[styles.col, { marginRight: isWide ? 10 : 0 }]}>
                <View style={styles.headerRow}>
                  <Text style={styles.headerCellLeft}>Môn học</Text>
                  <Text style={styles.headerCellRight}>Học kỳ</Text>
                </View>

                {SUBJECTS_LEFT.map((s) => (
                  <View key={s.key} style={styles.rowItem}>
                    <Text style={styles.subjectName}>{s.label}</Text>
                    <View style={styles.scoreCell}>{renderScoreInput(s.key)}</View>
                  </View>
                ))}
              </View>

              {/* RIGHT */}
              <View
                style={[
                  styles.col,
                  { marginLeft: isWide ? 10 : 0, marginTop: isWide ? 0 : 18 },
                ]}
              >
                <View style={styles.headerRow}>
                  <Text style={styles.headerCellLeft}>Môn học</Text>
                  <Text style={styles.headerCellRight}>Học kỳ</Text>
                </View>

                {SUBJECTS_RIGHT.map((s) => (
                  <View key={s.key} style={styles.rowItem}>
                    <Text style={styles.subjectName}>{s.label}</Text>
                    <View style={styles.scoreCell}>{renderScoreInput(s.key)}</View>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.footerBar}>
              <View style={styles.footerInfo}>
                <Text style={styles.footerText}>
                  Đã nhập:{" "}
                  <Text style={styles.footerBold}>{filledCount}</Text>/
                  {SUBJECTS.length} môn
                </Text>
                {/* <Text style={styles.footerText}>
                  TB:{" "}
                  <Text style={styles.footerBold}>
                    {overallAvg === null ? "--" : overallAvg.toFixed(2)}
                  </Text>
                </Text> */}
              </View>

              <Pressable
                onPress={saveAcademicScores}
                disabled={uploading}
                style={[styles.saveBtn, { opacity: uploading ? 0.7 : 1 }]}
              >
                {uploading ? (
                  <>
                    <ActivityIndicator color="#fff" />
                    <Text style={styles.saveBtnText}>Đang lưu...</Text>
                  </>
                ) : (
                  <>
                    <Save size={22} color="#fff" />
                    <Text style={styles.saveBtnText}>Lưu</Text>
                  </>
                )}
              </Pressable>
            </View>

            {loading && (
              <View style={styles.loadingInline}>
                <ActivityIndicator color="#fff" />
                <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 28 },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: { fontSize: 18, fontWeight: "800" },
  sub: { marginTop: 6, fontSize: 13, textAlign: "center", lineHeight: 18 },

  outerCard: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: "hidden",
    padding: 12,
  },

  orangePanel: {
    backgroundColor: "#F97316",
    borderRadius: 14,
    padding: 14,
  },

  orangeNote: {
    color: "#fff",
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
    fontWeight: "700",
  },

  gridWrap: { gap: 18 },
  col: { flex: 1 },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.25)",
  },
  headerCellLeft: {
    flex: 1,
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },
  headerCellRight: {
    width: 130,
    textAlign: "center",
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },

  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  subjectName: {
    flex: 1,
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },
  scoreCell: { width: 130, alignItems: "center" },

  scoreInput: {
    width: 110,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  footerBar: { marginTop: 16, alignItems: "center" },
  footerInfo: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  footerText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  footerBold: { fontWeight: "900", fontSize: 14 },

  saveBtn: {
    backgroundColor: "#6D28D9",
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 26,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  saveBtnText: { color: "#fff", fontSize: 20, fontWeight: "900" },

  loadingInline: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "center",
  },
  loadingText: { color: "#fff", fontWeight: "800" },
});
