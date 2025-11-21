import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Target,
  Award,
  Calendar 
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
  testScore?: number;
  uploadedFiles?: number;
}

interface StudentCardProps {
  student: Student;
  onPress?: (student: Student) => void;
  onStatusUpdate?: (student: Student, action: string) => void;
  showActions?: boolean;
  compact?: boolean;
}

const StatusConfig = {
  approved: { label: 'Đã Duyệt', color: '#10B981', icon: CheckCircle2 },
  rejected: { label: 'Từ Chối', color: '#EF4444', icon: XCircle },
  reviewing: { label: 'Đang Xét', color: '#3B82F6', icon: Clock },
  pending: { label: 'Chờ Xử Lý', color: '#F59E0B', icon: Clock },
};

export function StudentCard({ 
  student, 
  onPress, 
  onStatusUpdate, 
  showActions = true, 
  compact = false 
}: StudentCardProps) {
  const statusConfig = StatusConfig[student.status];
  const StatusIcon = statusConfig.icon;

  const handlePress = () => {
    if (onPress) {
      onPress(student);
    }
  };

  const handleStatusAction = (action: string) => {
    if (onStatusUpdate) {
      onStatusUpdate(student, action);
    }
  };

  if (compact) {
    return (
      <TouchableOpacity style={styles.compactCard} onPress={handlePress}>
        <View style={styles.compactHeader}>
          <View style={styles.studentAvatar}>
            <Text style={styles.avatarText}>
              {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </Text>
          </View>
          <View style={styles.compactInfo}>
            <Text style={styles.compactName}>{student.name}</Text>
            <Text style={styles.compactProgram}>{student.program}</Text>
            <View style={[styles.compactStatus, { backgroundColor: statusConfig.color + '20' }]}>
              <StatusIcon size={10} color={statusConfig.color} />
              <Text style={[styles.compactStatusText, { color: statusConfig.color }]}>
                {statusConfig.label}
              </Text>
            </View>
          </View>
        </View>
        <ArrowRight size={16} color="#9CA3AF" />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.studentCard} onPress={handlePress}>
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
          <Text style={styles.statValue}>{student.testScore || 'N/A'}</Text>
        </View>
        <View style={styles.statItem}>
          <Calendar size={16} color="#F59E0B" />
          <Text style={styles.statLabel}>Ngày nộp</Text>
          <Text style={styles.statValue}>
            {new Date(student.appliedDate).toLocaleDateString('vi-VN')}
          </Text>
        </View>
      </View>

      {showActions && (
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => handleStatusAction('Duyệt')}
          >
            <CheckCircle2 size={16} color="white" />
            <Text style={styles.actionButtonText}>Duyệt</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleStatusAction('Từ chối')}
          >
            <XCircle size={16} color="white" />
            <Text style={styles.actionButtonText}>Từ chối</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  compactInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  compactName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  studentId: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  compactProgram: {
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
  compactStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  compactStatusText: {
    fontSize: 10,
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
  actionButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'white',
  },
});