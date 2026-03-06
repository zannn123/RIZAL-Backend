export const users = [
    {
        id: 'ADMIN-01',
        studentId: 'ADMIN-01',
        name: 'Admin User',
        email: 'admin@university.edu',
        password: 'AdminPass123!',
        role: 'admin',
        college: 'Administration',
        faceScanRegistered: true,
        is_active: true,
        created_at: '2025-01-01T00:00:00Z',
    },
    {
        id: 8,
        studentId: '24-A-00123',
        name: 'New Deploy',
        email: 'newtest@university.edu',
        password: 'TestPass123',
        role: 'student',
        college: 'College of Engineering',
        program: 'BS Computer Science',
        department: 'College of Engineering',
        faceScanRegistered: true,
        is_active: true,
        created_at: '2025-02-01T00:00:00Z',
    }
];

export const events = [];
export const colleges = [];
export const metadata = { colleges: [], programs: {} };
export const announcements = [];
export const attendanceRecords = [];
export const dashboardStats = { totalStudents: 0, activeEvents: 0, attendanceRate: 100, pendingApprovals: 0 };
export const recentActivity = [];
export const weeklyAttendance = { dates: [], values: [] };
export const loginRecords = [];
