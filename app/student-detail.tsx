import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  GraduationCap,
  Target,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  FileText,
  FileImage,
  File,
  Star,
  TrendingUp,
  User,
  School,
} from 'lucide-react-native';

interface StudentDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  location: string;
  address: string;
  nationality: string;
  appliedDate: string;
  program: string;
  status: 'pending' | 'approved' | 'rejected' | 'reviewing';
  gpa: number;
  testScore: number;
  languageScore: {
    test: string;
    score: number;
    date: string;
  };
  education: Array<{
    school: string;
    degree: string;
    major: string;
    gpa: number;
    startDate: string;
    endDate: string;
  }>;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  awards: string[];
  personalStatement: string;
  uploadedFiles: Array<{
    id: string;
    name: string;
    type: string;
    size: string;
    uploadedDate: string;
    category: string;
  }>;
}

// Mock detailed student data
const mockStudentDetail: StudentDetail = {
  id: 'ST001',
  name: 'Nguyễn Văn An',
  email: 'an.nguyen@email.com',
  phone: '+84 912 345 678',
  dateOfBirth: '2002-05-15',
  location: 'Hà Nội, Việt Nam',
  address: '123 Đường Láng, Quận Đống Đa, Hà Nội',
  nationality: 'Việt Nam',
  appliedDate: '2024-11-10',
  program: 'Khoa học Máy tính',
  status: 'approved',
  gpa: 3.8,
  testScore: 95,
  languageScore: {
    test: 'IELTS',
    score: 7.5,
    date: '2024-08-20',
  },
  education: [
    {
      school: 'Đại học Bách Khoa Hà Nội',
      degree: 'Cử nhân',
      major: 'Công nghệ Thông tin',
      gpa: 3.8,
      startDate: '2020-09',
      endDate: '2024-06',
    },
    {
      school: 'Trường THPT Chu Văn An',
      degree: 'Tốt nghiệp THPT',
      major: 'Khoa học Tự nhiên',
      gpa: 9.2,
      startDate: '2017-09',
      endDate: '2020-06',
    },
  ],
  experience: [
    {
      title: 'Thực tập sinh Phát triển Phần mềm',
      company: 'VNG Corporation',
      duration: '6 tháng',
      description: 'Phát triển ứng dụng web sử dụng React và Node.js',
    },
  ],
  awards: [
    'Học bổng Xuất sắc Đại học Bách Khoa (2021-2023)',
    'Giải Nhì Cuộc thi Lập trình ACM-ICPC Vùng',
    'Giải Ba Olympic Tin học Quốc gia',
  ],
  personalStatement: 'Tôi là một sinh viên đam mê công nghệ với mong muốn theo đuổi nghiên cứu về trí tuệ nhân tạo và học máy. Trong quá trình học tập, tôi đã tích lũy được kiến thức vững chắc về các nguyên lý cơ bản của khoa học máy tính và có kinh nghiệm thực tế trong phát triển phần mềm.',
  uploadedFiles: [
    {
      id: 'F001',
      name: 'Bằng tốt nghiệp.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadedDate: '2024-11-10',
      category: 'Văn bằng',
    },
    {
      id: 'F002',
      name: 'Bảng điểm đại học.pdf',
      type: 'pdf',
      size: '1.8 MB',
      uploadedDate: '2024-11-10',
      category: 'Văn bằng',
    },
    {
      id: 'F003',
      name: 'Chứng chỉ IELTS.pdf',
      type: 'pdf',
      size: '950 KB',
      uploadedDate: '2024-11-10',
      category: 'Chứng chỉ',
    },
  ],
};

const StatusConfig = {
  approved: { label: 'Đã Duyệt', color: '#10B981', icon: CheckCircle2 },
  rejected: { label: 'Từ Chối', color: '#EF4444', icon: XCircle },
  reviewing: { label: 'Đang Xét', color: '#3B82F6', icon: Clock },
  pending: { label: 'Chờ Xử Lý', color: '#F59E0B', icon: Clock },
};

interface StudentDetailScreenProps {
  studentId?: string;
  onBack?: () => void;
}

export default function StudentDetailScreen({ studentId, onBack }: StudentDetailScreenProps) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'education' | 'documents' | 'statement'>('overview');
  const student = mockStudentDetail; // In real app, fetch by studentId
  
  const statusConfig = StatusConfig[student.status];
  const StatusIcon = statusConfig.icon;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      // Navigate back
      console.log('Navigate back');
    }
  };

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${student.email}`);
  };

  const handlePhonePress = () => {
    const phoneUrl = Platform.OS === 'ios' 
      ? `telprompt:${student.phone}` 
      : `tel:${student.phone}`;
    Linking.openURL(phoneUrl);
  };

  const handleStatusUpdate = (newStatus: string) => {
    Alert.alert(
      'Cập nhật trạng thái',
      `Thay đổi trạng thái thành "${newStatus}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xác nhận', 
          onPress: () => {
            console.log('Update status to:', newStatus);
            // Implement status update logic
          }
        },
      ]
    );
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return FileText;
      case 'image':
        return FileImage;
      default:
        return File;
    }
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <View style={styles.tabContent}>
            {/* Academic Performance */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Target size={20} color="#3B82F6" />
                <Text style={styles.sectionTitle}>Thành Tích Học Tập</Text>
              </View>
              <View style={styles.sectionContent}>
                <View style={styles.progressItem}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>GPA Tích Lũy</Text>
                    <Text style={styles.progressValue}>{student.gpa.toFixed(2)}/4.0</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${(student.gpa / 4.0) * 100}%` }]} />
                  </View>
                </View>
                
                <View style={styles.progressItem}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Điểm Test Đầu Vào</Text>
                    <Text style={styles.progressValue}>{student.testScore}/100</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${student.testScore}%` }]} />
                  </View>
                </View>
                
                <View style={styles.progressItem}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>{student.languageScore.test}</Text>
                    <Text style={styles.progressValue}>{student.languageScore.score}/9.0</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${(student.languageScore.score / 9.0) * 100}%` }]} />
                  </View>
                  <Text style={styles.progressNote}>
                    Ngày thi: {new Date(student.languageScore.date).toLocaleDateString('vi-VN')}
                  </Text>
                </View>
              </View>
            </View>

            {/* Awards and Achievements */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Award size={20} color="#F59E0B" />
                <Text style={styles.sectionTitle}>Giải Thưởng & Thành Tích</Text>
              </View>
              <View style={styles.sectionContent}>
                {student.awards.map((award, index) => (
                  <View key={index} style={styles.awardItem}>
                    <View style={styles.awardIcon}>
                      <Star size={14} color="#F59E0B" />
                    </View>
                    <Text style={styles.awardText}>{award}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Experience */}
            {student.experience.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <TrendingUp size={20} color="#10B981" />
                  <Text style={styles.sectionTitle}>Kinh Nghiệm</Text>
                </View>
                <View style={styles.sectionContent}>
                  {student.experience.map((exp, index) => (
                    <View key={index} style={styles.experienceItem}>
                      <Text style={styles.experienceTitle}>{exp.title}</Text>
                      <Text style={styles.experienceCompany}>
                        {exp.company} • {exp.duration}
                      </Text>
                      <Text style={styles.experienceDescription}>{exp.description}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        );

      case 'education':
        return (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <School size={20} color="#3B82F6" />
                <Text style={styles.sectionTitle}>Quá trình Học tập</Text>
              </View>
              <View style={styles.sectionContent}>
                {student.education.map((edu, index) => (
                  <View key={index} style={styles.educationItem}>
                    <View style={styles.educationHeader}>
                      <Text style={styles.educationSchool}>{edu.school}</Text>
                      <Text style={styles.educationGrade}>
                        GPA: {edu.gpa.toFixed(1)}
                      </Text>
                    </View>
                    <Text style={styles.educationDegree}>{edu.degree} - {edu.major}</Text>
                    <Text style={styles.educationDate}>
                      {edu.startDate} - {edu.endDate}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        );

      case 'documents':
        return (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <FileText size={20} color="#6B7280" />
                <Text style={styles.sectionTitle}>Tài Liệu ({student.uploadedFiles.length})</Text>
              </View>
              <View style={styles.sectionContent}>
                {student.uploadedFiles.map((file) => {
                  const FileIcon = getFileIcon(file.type);
                  return (
                    <TouchableOpacity key={file.id} style={styles.fileItem}>
                      <View style={styles.fileInfo}>
                        <View style={styles.fileIconContainer}>
                          <FileIcon size={18} color="#3B82F6" />
                        </View>
                        <View style={styles.fileDetails}>
                          <Text style={styles.fileName}>{file.name}</Text>
                          <Text style={styles.fileCategory}>{file.category}</Text>
                          <Text style={styles.fileMeta}>
                            {file.size} • {new Date(file.uploadedDate).toLocaleDateString('vi-VN')}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity style={styles.downloadButton}>
                        <Download size={16} color="#3B82F6" />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        );

      case 'statement':
        return (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <User size={20} color="#8B5CF6" />
                <Text style={styles.sectionTitle}>Bản Tự Thuật</Text>
              </View>
              <View style={styles.sectionContent}>
                <Text style={styles.statementText}>{student.personalStatement}</Text>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Hồ Sơ Học Sinh</Text>
          <Text style={styles.headerSubtitle}>Thông tin chi tiết và tài liệu</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Student Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.studentName}>{student.name}</Text>
                <View style={styles.badges}>
                  <View style={styles.idBadge}>
                    <Text style={styles.idText}>{student.id}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusConfig.color + '20' }]}>
                    <StatusIcon size={12} color={statusConfig.color} />
                    <Text style={[styles.statusText, { color: statusConfig.color }]}>
                      {statusConfig.label}
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={styles.appliedDate}>
                Đăng ký: {new Date(student.appliedDate).toLocaleDateString('vi-VN')}
              </Text>
            </View>
          </View>

          {/* Contact Information */}
          <View style={styles.contactGrid}>
            <TouchableOpacity style={styles.contactItem} onPress={handleEmailPress}>
              <Mail size={16} color="#6B7280" />
              <Text style={styles.contactText}>{student.email}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactItem} onPress={handlePhonePress}>
              <Phone size={16} color="#6B7280" />
              <Text style={styles.contactText}>{student.phone}</Text>
            </TouchableOpacity>
            <View style={styles.contactItem}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.contactText}>{student.location}</Text>
            </View>
            <View style={styles.contactItem}>
              <Calendar size={16} color="#6B7280" />
              <Text style={styles.contactText}>
                Sinh: {new Date(student.dateOfBirth).toLocaleDateString('vi-VN')}
              </Text>
            </View>
            <View style={styles.contactItem}>
              <Globe size={16} color="#6B7280" />
              <Text style={styles.contactText}>{student.nationality}</Text>
            </View>
            <View style={styles.contactItem}>
              <GraduationCap size={16} color="#6B7280" />
              <Text style={styles.contactText}>{student.program}</Text>
            </View>
          </View>

          {/* Key Metrics */}
          <View style={styles.metricsRow}>
            <View style={styles.metric}>
              <Target size={16} color="#3B82F6" />
              <Text style={styles.metricLabel}>GPA</Text>
              <Text style={styles.metricValue}>{student.gpa.toFixed(2)}</Text>
            </View>
            <View style={styles.metric}>
              <Award size={16} color="#10B981" />
              <Text style={styles.metricLabel}>Điểm Test</Text>
              <Text style={styles.metricValue}>{student.testScore}</Text>
            </View>
            <View style={styles.metric}>
              <BookOpen size={16} color="#F59E0B" />
              <Text style={styles.metricLabel}>{student.languageScore.test}</Text>
              <Text style={styles.metricValue}>{student.languageScore.score}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.approveButton]}
              onPress={() => handleStatusUpdate('Duyệt')}
            >
              <CheckCircle2 size={16} color="white" />
              <Text style={styles.actionButtonText}>Duyệt Hồ Sơ</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleStatusUpdate('Từ chối')}
            >
              <XCircle size={16} color="white" />
              <Text style={styles.actionButtonText}>Từ Chối</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { key: 'overview', label: 'Tổng Quan', icon: Target },
              { key: 'education', label: 'Học Vấn', icon: School },
              { key: 'documents', label: `Tài Liệu (${student.uploadedFiles.length})`, icon: FileText },
              { key: 'statement', label: 'Bản Tự Thuật', icon: User },
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tab, selectedTab === tab.key && styles.activeTab]}
                  onPress={() => setSelectedTab(tab.key as any)}
                >
                  <TabIcon 
                    size={16} 
                    color={selectedTab === tab.key ? '#3B82F6' : '#6B7280'} 
                  />
                  <Text style={[styles.tabText, selectedTab === tab.key && styles.activeTabText]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Tab Content */}
        {renderTabContent()}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  scrollContainer: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    marginBottom: 8,
  },
  studentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  idBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  idText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  appliedDate: {
    fontSize: 13,
    color: '#6B7280',
  },
  contactGrid: {
    marginBottom: 20,
    gap: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 2,
  },
  contactText: {
    fontSize: 13,
    color: '#4B5563',
    flex: 1,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    marginBottom: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  metric: {
    alignItems: 'center',
    gap: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  approveButton: {
    backgroundColor: '#10B981',
  },
  rejectButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  tabContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingVertical: 12,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 16,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#EBF4FF',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#3B82F6',
  },
  tabContent: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingTop: 20,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  sectionContent: {
    gap: 12,
  },
  progressItem: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  progressValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  progressNote: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
  },
  awardItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  awardIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  awardText: {
    fontSize: 13,
    color: '#374151',
    flex: 1,
    lineHeight: 18,
  },
  experienceItem: {
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#10B981',
  },
  experienceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  experienceCompany: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  experienceDescription: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  educationItem: {
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  educationSchool: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  educationGrade: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  educationDegree: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 2,
  },
  educationDate: {
    fontSize: 11,
    color: '#6B7280',
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  fileIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EBF4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  fileCategory: {
    fontSize: 11,
    color: '#3B82F6',
    marginBottom: 1,
  },
  fileMeta: {
    fontSize: 10,
    color: '#6B7280',
  },
  downloadButton: {
    padding: 8,
  },
  statementText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
    textAlign: 'justify',
  },
  bottomPadding: {
    height: 40,
  },
});