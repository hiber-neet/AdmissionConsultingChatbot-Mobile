// Student Module Types

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  location: string;
  address?: string;
  nationality?: string;
  appliedDate: string;
  program: string;
  status: 'pending' | 'approved' | 'rejected' | 'reviewing';
  gpa: number;
  testScore?: number;
  uploadedFiles?: number;
  avatar?: string;
  languageScore?: {
    test: string;
    score: number;
    date: string;
  };
}

export interface StudentDetail extends Omit<Student, 'uploadedFiles'> {
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

export interface StatusConfig {
  label: string;
  color: string;
  icon: any;
}

export interface StudentFilters {
  status?: string;
  program?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
  gpaRange?: {
    min: number;
    max: number;
  };
  location?: string;
}

export interface StudentStats {
  total: number;
  approved: number;
  rejected: number;
  reviewing: number;
  pending: number;
  averageGpa: number;
  averageTestScore: number;
}

export interface InsightData {
  label: string;
  value: number;
  change: number;
  color: string;
}

export interface ChartData {
  name: string;
  value: number;
  color: string;
}

export interface ProgramData {
  program: string;
  count: number;
  growth: number;
}

export interface GeographicData {
  location: string;
  count: number;
  percentage: number;
}

export interface TopPage {
  page: string;
  views: number;
  avgTime: string;
}

export interface MonthlyData {
  month: string;
  applications: number;
  inquiries: number;
}

// Navigation types
export type StudentStackParamList = {
  Students: undefined;
  StudentManagement: undefined;
  StudentDetail: { studentId: string };
  StudentInsights: undefined;
  Applications: undefined;
};

// Hook types
export interface UseStudentsProps {
  filters?: StudentFilters;
  sortBy?: 'name' | 'appliedDate' | 'gpa' | 'status';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface UseStudentsReturn {
  students: Student[];
  loading: boolean;
  error: string | null;
  total: number;
  stats: StudentStats;
  refresh: () => void;
  loadMore: () => void;
  hasMore: boolean;
}

// API types
export interface StudentListResponse {
  students: Student[];
  total: number;
  page: number;
  totalPages: number;
  stats: StudentStats;
}

export interface StudentDetailResponse {
  student: StudentDetail;
}

export interface UpdateStudentStatusRequest {
  studentId: string;
  status: 'approved' | 'rejected' | 'reviewing' | 'pending';
  reason?: string;
  reviewedBy: string;
}

export interface StudentSearchRequest {
  query: string;
  filters?: StudentFilters;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Component Props
export interface StudentCardProps {
  student: Student;
  onPress?: (student: Student) => void;
  onStatusUpdate?: (student: Student, action: string) => void;
  showActions?: boolean;
  compact?: boolean;
}

export interface StudentFilterProps {
  filters: StudentFilters;
  onFiltersChange: (filters: StudentFilters) => void;
  programs: string[];
  locations: string[];
}

export interface StudentStatsCardProps {
  stats: StudentStats;
  period: 'today' | 'week' | 'month';
}

// Form types
export interface StudentFormData {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  location: string;
  address: string;
  nationality: string;
  program: string;
  gpa: number;
  testScore: number;
  languageScore: {
    test: string;
    score: number;
    date: string;
  };
}

export interface StudentValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  program?: string;
  gpa?: string;
  testScore?: string;
  [key: string]: string | undefined;
}

// Redux/State types
export interface StudentState {
  students: Student[];
  currentStudent: StudentDetail | null;
  filters: StudentFilters;
  loading: boolean;
  error: string | null;
  stats: StudentStats | null;
  insights: {
    programs: ProgramData[];
    geographic: GeographicData[];
    monthly: MonthlyData[];
    topPages: TopPage[];
  } | null;
}

export interface StudentAction {
  type: string;
  payload?: any;
}

// Constants
export const STUDENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  REVIEWING: 'reviewing',
} as const;

export const STUDENT_SORT_OPTIONS = {
  NAME: 'name',
  APPLIED_DATE: 'appliedDate',
  GPA: 'gpa',
  STATUS: 'status',
} as const;

export const STUDENT_SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export const STUDENT_PROGRAMS = [
  'Khoa học Máy tính',
  'Quản trị Kinh doanh',
  'Kỹ thuật Phần mềm',
  'Khoa học Dữ liệu',
  'MBA',
  'Tài chính',
  'Kỹ thuật',
  'Y học',
  'Luật',
  'Nghệ thuật',
] as const;

export const STUDENT_LOCATIONS = [
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Đà Nẵng',
  'Cần Thơ',
  'Hải Phòng',
  'Huế',
  'Nha Trang',
  'Vũng Tàu',
  'Quy Nhon',
  'Khác',
] as const;