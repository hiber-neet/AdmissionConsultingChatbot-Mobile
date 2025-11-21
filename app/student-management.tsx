import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import {
  Search,
  Filter,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Target,
  Award,
  ArrowRight,
  BarChart3,
} from 'lucide-react-native';

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  appliedDate: string;
  program: string;
  status: 'pending' | 'approved' | 'rejected' | 'reviewing';
  gpa: number;
  uploadedFiles: number;
  testScore?: number;
  avatar?: string;
}

const mockStudents: Student[] = [
  {
    id: 'ST001',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@email.com',
    phone: '+84 912 345 678',
    location: 'Hà Nội',
    appliedDate: '2024-11-10',
    program: 'Khoa học Máy tính',
    status: 'approved',
    gpa: 3.8,
    uploadedFiles: 5,
    testScore: 95,
  },
  {
    id: 'ST002',
    name: 'Trần Thị Bình',
    email: 'binh.tran@email.com',
    phone: '+84 987 654 321',
    location: 'Hồ Chí Minh',
    appliedDate: '2024-11-12',
    program: 'Quản trị Kinh doanh',
    status: 'reviewing',
    gpa: 3.6,
    uploadedFiles: 4,
    testScore: 88,
  },
  {
    id: 'ST003',
    name: 'Lê Hoàng Minh',
    email: 'minh.le@email.com',
    phone: '+84 909 876 543',
    location: 'Đà Nẵng',
    appliedDate: '2024-11-08',
    program: 'Kỹ thuật Phần mềm',
    status: 'pending',
    gpa: 3.9,
    uploadedFiles: 3,
    testScore: 92,
  },
  {
    id: 'ST004',
    name: 'Phạm Thị Cẩm',
    email: 'cam.pham@email.com',
    phone: '+84 932 123 456',
    location: 'Cần Thơ',
    appliedDate: '2024-11-05',
    program: 'Khoa học Dữ liệu',
    status: 'rejected',
    gpa: 3.2,
    uploadedFiles: 2,
    testScore: 75,
  },
];

const StatusConfig = {
  approved: { label: 'Đã Duyệt', color: '#10B981', icon: CheckCircle2 },
  rejected: { label: 'Từ Chối', color: '#EF4444', icon: XCircle },
  reviewing: { label: 'Đang Xét', color: '#3B82F6', icon: Clock },
  pending: { label: 'Chờ Xử Lý', color: '#F59E0B', icon: Clock },
};

export default function StudentManagementScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'list' | 'insights'>('list');

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.program.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusStats = () => {
    const stats = {
      total: mockStudents.length,
      approved: mockStudents.filter(s => s.status === 'approved').length,
      rejected: mockStudents.filter(s => s.status === 'rejected').length,
      reviewing: mockStudents.filter(s => s.status === 'reviewing').length,
      pending: mockStudents.filter(s => s.status === 'pending').length,
    };
    return stats;
  };

  const stats = getStatusStats();

  const handleStudentPress = (student: Student) => {
    Alert.alert(
      'Xem hồ sơ học sinh',
      `Mở hồ sơ chi tiết của ${student.name}?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xem', 
          onPress: () => {
            // Navigate to student detail screen
            console.log('Navigating to student detail:', student.id);
          }
        },
      ]
    );
  };

  const handleStatusAction = (student: Student, action: string) => {
    Alert.alert(
      'Xác nhận thao tác',
      `${action} hồ sơ của ${student.name}?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xác nhận', 
          onPress: () => {
            console.log(`${action} student:`, student.id);
            // Implement status update logic here
          }
        },
      ]
    );
  };

  const renderStudentCard = (student: Student) => {
    const statusConfig = StatusConfig[student.status];
    const StatusIcon = statusConfig.icon;

    return (
      <TouchableOpacity
        key={student.id}
        style={styles.studentCard}
        onPress={() => handleStudentPress(student)}
      >
        <View style={styles.studentHeader}>
          <View style={styles.studentAvatar}>
            <Text style={styles.avatarText}>
              {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </Text>
          </View>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{student.name}</Text>
            <Text style={styles.studentId}>{student.id}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusConfig.color + '20' }]}>
              <StatusIcon size={12} color={statusConfig.color} />
              <Text style={[styles.statusText, { color: statusConfig.color }]}>
                {statusConfig.label}
              </Text>
            </View>
          </View>
          <ArrowRight size={20} color="#9CA3AF" />
        </View>

        <View style={styles.studentDetails}>
          <View style={styles.detailRow}>
            <Mail size={14} color="#6B7280" />
            <Text style={styles.detailText}>{student.email}</Text>
          </View>
          <View style={styles.detailRow}>
            <Phone size={14} color="#6B7280" />
            <Text style={styles.detailText}>{student.phone}</Text>
          </View>
          <View style={styles.detailRow}>
            <MapPin size={14} color="#6B7280" />
            <Text style={styles.detailText}>{student.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <GraduationCap size={14} color="#6B7280" />
            <Text style={styles.detailText}>{student.program}</Text>
          </View>
        </View>

        <View style={styles.studentStats}>
          <View style={styles.statItem}>
            <Target size={16} color="#3B82F6" />
            <Text style={styles.statLabel}>GPA</Text>
            <Text style={styles.statValue}>{student.gpa.toFixed(1)}</Text>
          </View>
          <View style={styles.statItem}>
            <Award size={16} color="#10B981" />
            <Text style={styles.statLabel}>Test</Text>
            <Text style={styles.statValue}>{student.testScore}</Text>
          </View>
          <View style={styles.statItem}>
            <Calendar size={16} color="#F59E0B" />
            <Text style={styles.statLabel}>Ngày nộp</Text>
            <Text style={styles.statValue}>
              {new Date(student.appliedDate).toLocaleDateString('vi-VN')}
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => handleStatusAction(student, 'Duyệt')}
          >
            <CheckCircle2 size={16} color="white" />
            <Text style={styles.actionButtonText}>Duyệt</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleStatusAction(student, 'Từ chối')}
          >
            <XCircle size={16} color="white" />
            <Text style={styles.actionButtonText}>Từ chối</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.viewButton]}
            onPress={() => handleStudentPress(student)}
          >
            <Eye size={16} color="#3B82F6" />
            <Text style={[styles.actionButtonText, { color: '#3B82F6' }]}>Xem</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderInsights = () => (
    <View style={styles.insightsContainer}>
      <Text style={styles.sectionTitle}>Thống kê tổng quan</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Users size={24} color="#3B82F6" />
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Tổng số học sinh</Text>
        </View>
        
        <View style={styles.statCard}>
          <CheckCircle2 size={24} color="#10B981" />
          <Text style={styles.statNumber}>{stats.approved}</Text>
          <Text style={styles.statLabel}>Đã duyệt</Text>
        </View>
        
        <View style={styles.statCard}>
          <Clock size={24} color="#F59E0B" />
          <Text style={styles.statNumber}>{stats.reviewing + stats.pending}</Text>
          <Text style={styles.statLabel}>Đang xử lý</Text>
        </View>
        
        <View style={styles.statCard}>
          <XCircle size={24} color="#EF4444" />
          <Text style={styles.statNumber}>{stats.rejected}</Text>
          <Text style={styles.statLabel}>Từ chối</Text>
        </View>
      </View>

      <View style={styles.insightCard}>
        <Text style={styles.insightTitle}>Chương trình phổ biến</Text>
        <View style={styles.programList}>
          <View style={styles.programItem}>
            <Text style={styles.programName}>Khoa học Máy tính</Text>
            <Text style={styles.programCount}>25 ứng viên</Text>
          </View>
          <View style={styles.programItem}>
            <Text style={styles.programName}>Quản trị Kinh doanh</Text>
            <Text style={styles.programCount}>18 ứng viên</Text>
          </View>
          <View style={styles.programItem}>
            <Text style={styles.programName}>Kỹ thuật Phần mềm</Text>
            <Text style={styles.programCount}>15 ứng viên</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quản lý Học sinh</Text>
        <Text style={styles.headerSubtitle}>
          Danh sách và thông tin chi tiết học sinh
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'list' && styles.activeTab]}
          onPress={() => setSelectedTab('list')}
        >
          <Users size={18} color={selectedTab === 'list' ? '#3B82F6' : '#6B7280'} />
          <Text style={[styles.tabText, selectedTab === 'list' && styles.activeTabText]}>
            Danh sách ({filteredStudents.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'insights' && styles.activeTab]}
          onPress={() => setSelectedTab('insights')}
        >
          <BarChart3 size={18} color={selectedTab === 'insights' ? '#3B82F6' : '#6B7280'} />
          <Text style={[styles.tabText, selectedTab === 'insights' && styles.activeTabText]}>
            Thống kê
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'list' && (
        <>
          {/* Search and Filter */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBox}>
              <Search size={20} color="#6B7280" />
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm học sinh..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowFilters(!showFilters)}
            >
              <Filter size={20} color="#3B82F6" />
            </TouchableOpacity>
          </View>

          {/* Filter Options */}
          {showFilters && (
            <View style={styles.filterContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity
                  style={[styles.filterChip, selectedStatus === 'all' && styles.activeFilterChip]}
                  onPress={() => setSelectedStatus('all')}
                >
                  <Text style={[styles.filterText, selectedStatus === 'all' && styles.activeFilterText]}>
                    Tất cả
                  </Text>
                </TouchableOpacity>
                {Object.entries(StatusConfig).map(([status, config]) => (
                  <TouchableOpacity
                    key={status}
                    style={[styles.filterChip, selectedStatus === status && styles.activeFilterChip]}
                    onPress={() => setSelectedStatus(status)}
                  >
                    <Text style={[styles.filterText, selectedStatus === status && styles.activeFilterText]}>
                      {config.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Student List */}
          <ScrollView style={styles.studentList} showsVerticalScrollIndicator={false}>
            {filteredStudents.map(renderStudentCard)}
            <View style={styles.bottomPadding} />
          </ScrollView>
        </>
      )}

      {selectedTab === 'insights' && renderInsights()}
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
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#3B82F6',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'white',
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#1F2937',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#EBF4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: '#3B82F6',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeFilterText: {
    color: 'white',
  },
  studentList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  studentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  studentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  studentId: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  studentDetails: {
    marginBottom: 12,
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#4B5563',
  },
  studentStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 1,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 4,
  },
  approveButton: {
    backgroundColor: '#10B981',
  },
  rejectButton: {
    backgroundColor: '#EF4444',
  },
  viewButton: {
    backgroundColor: '#EBF4FF',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'white',
  },
  bottomPadding: {
    height: 20,
  },
  // Insights styles
  insightsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '47%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  insightCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  programList: {
    gap: 8,
  },
  programItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  programName: {
    fontSize: 14,
    color: '#1F2937',
  },
  programCount: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
});