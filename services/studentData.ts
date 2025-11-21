import { Student, StudentDetail, StudentStats, ProgramData, GeographicData, TopPage, MonthlyData } from '../types/student';

// Mock Student Data
export const mockStudents: Student[] = [
  {
    id: 'ST001',
    name: 'Nguyễn Văn An',
    email: 'an.nguyen@email.com',
    phone: '+84 912 345 678',
    dateOfBirth: '2002-05-15',
    location: 'Hà Nội',
    address: '123 Đường Láng, Quận Đống Đa, Hà Nội',
    nationality: 'Việt Nam',
    appliedDate: '2024-11-10',
    program: 'Khoa học Máy tính',
    status: 'approved',
    gpa: 3.8,
    testScore: 95,
    uploadedFiles: 5,
    languageScore: {
      test: 'IELTS',
      score: 7.5,
      date: '2024-08-20',
    },
  },
  {
    id: 'ST002',
    name: 'Trần Thị Bình',
    email: 'binh.tran@email.com',
    phone: '+84 987 654 321',
    dateOfBirth: '2001-12-08',
    location: 'TP. Hồ Chí Minh',
    address: '456 Nguyễn Huệ, Quận 1, TP. HCM',
    nationality: 'Việt Nam',
    appliedDate: '2024-11-12',
    program: 'Quản trị Kinh doanh',
    status: 'reviewing',
    gpa: 3.6,
    testScore: 88,
    uploadedFiles: 4,
    languageScore: {
      test: 'TOEFL',
      score: 98,
      date: '2024-09-15',
    },
  },
  {
    id: 'ST003',
    name: 'Lê Hoàng Minh',
    email: 'minh.le@email.com',
    phone: '+84 909 876 543',
    dateOfBirth: '2002-03-22',
    location: 'Đà Nẵng',
    address: '789 Hùng Vương, Hải Châu, Đà Nẵng',
    nationality: 'Việt Nam',
    appliedDate: '2024-11-08',
    program: 'Kỹ thuật Phần mềm',
    status: 'pending',
    gpa: 3.9,
    testScore: 92,
    uploadedFiles: 3,
    languageScore: {
      test: 'IELTS',
      score: 7.0,
      date: '2024-07-10',
    },
  },
  {
    id: 'ST004',
    name: 'Phạm Thị Cẩm',
    email: 'cam.pham@email.com',
    phone: '+84 932 123 456',
    dateOfBirth: '2001-09-18',
    location: 'Cần Thơ',
    address: '321 Trần Hưng Đạo, Ninh Kiều, Cần Thơ',
    nationality: 'Việt Nam',
    appliedDate: '2024-11-05',
    program: 'Khoa học Dữ liệu',
    status: 'rejected',
    gpa: 3.2,
    testScore: 75,
    uploadedFiles: 2,
    languageScore: {
      test: 'IELTS',
      score: 6.0,
      date: '2024-06-20',
    },
  },
  {
    id: 'ST005',
    name: 'Vũ Đăng Khoa',
    email: 'khoa.vu@email.com',
    phone: '+84 945 678 901',
    dateOfBirth: '2002-07-11',
    location: 'Hải Phòng',
    address: '555 Lạch Tray, Ngô Quyền, Hải Phòng',
    nationality: 'Việt Nam',
    appliedDate: '2024-11-14',
    program: 'MBA',
    status: 'reviewing',
    gpa: 3.7,
    testScore: 89,
    uploadedFiles: 6,
    languageScore: {
      test: 'TOEFL',
      score: 105,
      date: '2024-08-30',
    },
  },
  {
    id: 'ST006',
    name: 'Ngô Thị Lan',
    email: 'lan.ngo@email.com',
    phone: '+84 956 789 012',
    dateOfBirth: '2001-11-25',
    location: 'Huế',
    address: '777 Lê Lợi, Phú Nhuận, Huế',
    nationality: 'Việt Nam',
    appliedDate: '2024-11-06',
    program: 'Tài chính',
    status: 'approved',
    gpa: 3.5,
    testScore: 85,
    uploadedFiles: 4,
    languageScore: {
      test: 'IELTS',
      score: 6.5,
      date: '2024-05-15',
    },
  },
];

// Mock Detailed Student Data
export const mockStudentDetail: StudentDetail = {
  id: 'ST001',
  name: 'Nguyễn Văn An',
  email: 'an.nguyen@email.com',
  phone: '+84 912 345 678',
  dateOfBirth: '2002-05-15',
  location: 'Hà Nội',
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
    {
      title: 'Developer Freelance',
      company: 'Tự do',
      duration: '1 năm',
      description: 'Phát triển các website và ứng dụng mobile cho khách hàng cá nhân',
    },
  ],
  awards: [
    'Học bổng Xuất sắc Đại học Bách Khoa (2021-2023)',
    'Giải Nhì Cuộc thi Lập trình ACM-ICPC Vùng',
    'Giải Ba Olympic Tin học Quốc gia',
    'Giải Nhất Hackathon FPT 2024',
  ],
  personalStatement: 'Tôi là một sinh viên đam mê công nghệ với mong muốn theo đuổi nghiên cứu về trí tuệ nhân tạo và học máy. Trong quá trình học tập, tôi đã tích lũy được kiến thức vững chắc về các nguyên lý cơ bản của khoa học máy tính và có kinh nghiệm thực tế trong phát triển phần mềm. Tôi tin rằng chương trình học này sẽ giúp tôi phát triển kỹ năng và kiến thức cần thiết để đóng góp vào lĩnh vực công nghệ.',
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
    {
      id: 'F004',
      name: 'Thư giới thiệu - PGS. Trần Văn A.pdf',
      type: 'pdf',
      size: '450 KB',
      uploadedDate: '2024-11-11',
      category: 'Thư giới thiệu',
    },
    {
      id: 'F005',
      name: 'CV-Resume.pdf',
      type: 'pdf',
      size: '320 KB',
      uploadedDate: '2024-11-11',
      category: 'Hồ sơ',
    },
  ],
};

// Mock Statistics
export const mockStudentStats: StudentStats = {
  total: 1256,
  approved: 892,
  rejected: 119,
  reviewing: 145,
  pending: 100,
  averageGpa: 3.65,
  averageTestScore: 87.3,
};

// Mock Program Data
export const mockProgramData: ProgramData[] = [
  { program: 'Khoa học Máy tính', count: 1240, growth: 18 },
  { program: 'Quản trị Kinh doanh', count: 980, growth: 12 },
  { program: 'Kỹ thuật Phần mềm', count: 850, growth: 15 },
  { program: 'Khoa học Dữ liệu', count: 720, growth: 25 },
  { program: 'MBA', count: 650, growth: 8 },
  { program: 'Tài chính', count: 540, growth: -3 },
  { program: 'Kỹ thuật', count: 480, growth: 5 },
  { program: 'Y học', count: 320, growth: 22 },
];

// Mock Geographic Data
export const mockGeographicData: GeographicData[] = [
  { location: 'Hà Nội', count: 2520, percentage: 35 },
  { location: 'TP. Hồ Chí Minh', count: 1890, percentage: 26 },
  { location: 'Đà Nẵng', count: 980, percentage: 14 },
  { location: 'Cần Thơ', count: 650, percentage: 9 },
  { location: 'Hải Phòng', count: 480, percentage: 7 },
  { location: 'Huế', count: 320, percentage: 4 },
  { location: 'Khác', count: 360, percentage: 5 },
];

// Mock Top Pages Data
export const mockTopPages: TopPage[] = [
  { page: 'Học Bổng Toàn Phần', views: 8420, avgTime: '4:32' },
  { page: 'Yêu Cầu Tuyển Sinh', views: 7280, avgTime: '3:45' },
  { page: 'Hướng Dẫn Visa', views: 6890, avgTime: '5:18' },
  { page: 'Chi Phí & Học Phí', views: 6120, avgTime: '3:22' },
  { page: 'Chương Trình MBA', views: 5680, avgTime: '4:05' },
  { page: 'Khoa học Máy tính', views: 5200, avgTime: '3:58' },
  { page: 'Quy trình Đăng ký', views: 4890, avgTime: '6:12' },
];

// Mock Monthly Data
export const mockMonthlyData: MonthlyData[] = [
  { month: 'T6', applications: 420, inquiries: 680 },
  { month: 'T7', applications: 450, inquiries: 720 },
  { month: 'T8', applications: 580, inquiries: 890 },
  { month: 'T9', applications: 620, inquiries: 920 },
  { month: 'T10', applications: 680, inquiries: 1050 },
  { month: 'T11', applications: 750, inquiries: 1180 },
];

// Service Functions
export class StudentDataService {
  // Simulate API delay
  private static delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get all students with filtering and pagination
  static async getStudents(
    filters?: any,
    sortBy?: string,
    sortOrder?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{
    students: Student[];
    total: number;
    page: number;
    totalPages: number;
    stats: StudentStats;
  }> {
    await this.delay();

    let filteredStudents = [...mockStudents];

    // Apply filters
    if (filters?.status && filters.status !== 'all') {
      filteredStudents = filteredStudents.filter(s => s.status === filters.status);
    }

    if (filters?.program) {
      filteredStudents = filteredStudents.filter(s => 
        s.program.toLowerCase().includes(filters.program.toLowerCase())
      );
    }

    if (filters?.location) {
      filteredStudents = filteredStudents.filter(s => 
        s.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Apply sorting
    if (sortBy) {
      filteredStudents.sort((a, b) => {
        const aVal = a[sortBy as keyof Student];
        const bVal = b[sortBy as keyof Student];
        
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortOrder === 'desc' 
            ? bVal.localeCompare(aVal)
            : aVal.localeCompare(bVal);
        }
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
        }
        
        return 0;
      });
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

    return {
      students: paginatedStudents,
      total: filteredStudents.length,
      page,
      totalPages: Math.ceil(filteredStudents.length / limit),
      stats: mockStudentStats,
    };
  }

  // Get student by ID
  static async getStudentById(studentId: string): Promise<StudentDetail> {
    await this.delay();
    
    // In a real app, this would fetch from API
    // For now, return mock detail data for any ID
    return mockStudentDetail;
  }

  // Update student status
  static async updateStudentStatus(
    studentId: string, 
    status: 'approved' | 'rejected' | 'reviewing' | 'pending',
    reason?: string
  ): Promise<Student> {
    await this.delay();

    // Find and update student in mock data
    const studentIndex = mockStudents.findIndex(s => s.id === studentId);
    if (studentIndex !== -1) {
      mockStudents[studentIndex].status = status;
      return mockStudents[studentIndex];
    }

    throw new Error('Student not found');
  }

  // Search students
  static async searchStudents(query: string): Promise<Student[]> {
    await this.delay();

    const lowercaseQuery = query.toLowerCase();
    return mockStudents.filter(student => 
      student.name.toLowerCase().includes(lowercaseQuery) ||
      student.email.toLowerCase().includes(lowercaseQuery) ||
      student.program.toLowerCase().includes(lowercaseQuery) ||
      student.id.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Get insights data
  static async getInsights(): Promise<{
    programs: ProgramData[];
    geographic: GeographicData[];
    monthly: MonthlyData[];
    topPages: TopPage[];
  }> {
    await this.delay();

    return {
      programs: mockProgramData,
      geographic: mockGeographicData,
      monthly: mockMonthlyData,
      topPages: mockTopPages,
    };
  }

  // Get student statistics
  static async getStudentStats(): Promise<StudentStats> {
    await this.delay();
    return mockStudentStats;
  }

  // Get available programs
  static getPrograms(): string[] {
    return [...new Set(mockStudents.map(s => s.program))].sort();
  }

  // Get available locations
  static getLocations(): string[] {
    return [...new Set(mockStudents.map(s => s.location))].sort();
  }
}

export default StudentDataService;