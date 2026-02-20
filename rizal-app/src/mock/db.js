/**
 * ============================================================
 * MOCK DATABASE — Based on db_sample.json
 * ============================================================
 * 
 * This file contains all mock data.
 * It mirrors the structure from db_sample.json but with
 * expanded sample data for testing all dashboard pages.
 * 
 * 🔴 BACKEND TEAM: When the real API is ready, this file
 *    will no longer be used. The frontend will fetch data
 *    from your REST API endpoints instead.
 *    See: src/services/api.js for the switch.
 * ============================================================
 */

// =====================
// USERS (from db_sample.json → users[])
// =====================
export const users = [
    {
        id: 'ADMIN-01',
        name: 'System Administrator',
        email: 'admin@rizal.edu',
        password: 'password123',
        rememberMe: true,
        role: 'admin',
        college: 'Admin Office',
        phone: '+63 912 345 6789',
        department: 'IT Department',
        bio: 'System Administrator for the R.I.Z.A.L. Attendance Recognition System at JRMSU College of Engineering.',
        status: 'Active',
        createdAt: '2024-01-01T08:00:00Z'
    },
    {
        id: 'SG-01',
        name: 'Carlos Santos',
        email: 'sg_president@rizal.edu',
        password: 'password123',
        rememberMe: true,
        role: 'sg',
        college: 'College of Engineering',
        phone: '+63 917 111 2233',
        department: 'Student Government',
        bio: 'SG President for the College of Engineering. Overseeing student activities and event management.',
        status: 'Active',
        createdAt: '2024-01-02T09:00:00Z'
    },
    {
        id: 'SG-02',
        name: 'Ana Lopez',
        email: 'sg_vp@rizal.edu',
        password: 'password123',
        rememberMe: true,
        role: 'sg',
        college: 'College of Arts and Sciences',
        phone: '+63 918 222 3344',
        department: 'Student Government',
        bio: 'SG Vice President for the College of Arts and Sciences.',
        status: 'Active',
        createdAt: '2024-01-05T10:00:00Z'
    },
    {
        id: 'SG-03',
        name: 'Rico Mendoza',
        email: 'sg_sec@rizal.edu',
        password: 'password123',
        rememberMe: true,
        role: 'sg',
        college: 'College of Business',
        phone: '+63 919 333 4455',
        department: 'Student Government',
        bio: 'SG Secretary for the College of Business.',
        status: 'Active',
        createdAt: '2024-01-06T10:00:00Z'
    },
    {
        id: 'SG-04',
        name: 'Lisa Ramos',
        email: 'sg_ed@rizal.edu',
        password: 'password123',
        rememberMe: true,
        role: 'sg',
        college: 'College of Education',
        phone: '+63 920 444 5566',
        department: 'Student Government',
        bio: 'SG Education Officer for the College of Education.',
        status: 'Active',
        createdAt: '2024-01-07T10:00:00Z'
    },
    {
        id: '2023-0001',
        name: 'Jose Rizal',
        email: 'jose.rizal@rizal.edu',
        password: 'password123',
        rememberMe: true,
        role: 'student',
        studentId: '2023-0001',
        college: 'College of Engineering',
        program: 'BS Computer Engineering',
        phone: '+63 921 555 6677',
        department: 'College of Engineering',
        bio: 'BS Computer Engineering student at JRMSU.',
        faceScanRegistered: true,
        status: 'Active',
        createdAt: '2024-02-14T10:30:00Z'
    },
    {
        id: '2023-0002',
        name: 'Maria Clara',
        email: 'maria.clara@rizal.edu',
        password: 'password123',
        rememberMe: true,
        role: 'student',
        studentId: '2023-0002',
        college: 'College of Arts and Sciences',
        program: 'BA Psychology',
        phone: '+63 922 666 7788',
        department: 'College of Arts and Sciences',
        bio: 'BA Psychology student at JRMSU.',
        faceScanRegistered: false,
        status: 'Pending',
        createdAt: '2024-02-15T11:45:00Z'
    },
    {
        id: '2023-0003',
        name: 'Juan Luna',
        email: 'juan.luna@rizal.edu',
        password: 'password123',
        rememberMe: true,
        role: 'student',
        studentId: '2023-0003',
        college: 'College of Engineering',
        program: 'BS Civil Engineering',
        phone: '+63 923 777 8899',
        department: 'College of Engineering',
        bio: 'BS Civil Engineering student at JRMSU.',
        faceScanRegistered: true,
        status: 'Active',
        createdAt: '2024-02-16T09:00:00Z'
    },
    {
        id: '2023-0004',
        name: 'Andres Bonifacio',
        email: 'andres.b@rizal.edu',
        password: 'password123',
        rememberMe: true,
        role: 'student',
        studentId: '2023-0004',
        college: 'College of Business',
        program: 'BS Accountancy',
        phone: '+63 924 888 9900',
        department: 'College of Business',
        bio: 'BS Accountancy student at JRMSU.',
        faceScanRegistered: true,
        status: 'Active',
        createdAt: '2024-02-17T08:30:00Z'
    },
    {
        id: '2023-0005',
        name: 'Gabriela Silang',
        email: 'gab.silang@rizal.edu',
        password: 'password123',
        rememberMe: true,
        role: 'student',
        studentId: '2023-0005',
        college: 'College of Education',
        program: 'B Secondary Education',
        phone: '+63 925 999 0011',
        department: 'College of Education',
        bio: 'B Secondary Education student at JRMSU.',
        faceScanRegistered: true,
        status: 'Active',
        createdAt: '2024-02-18T07:15:00Z'
    },
    {
        id: '2023-0006',
        name: 'Emilio Aguinaldo',
        email: 'emilio.a@rizal.edu',
        password: 'password123',
        rememberMe: false,
        role: 'student',
        studentId: '2023-0006',
        college: 'College of Arts and Sciences',
        program: 'BS Biology',
        phone: '+63 926 000 1122',
        department: 'College of Arts and Sciences',
        bio: 'BS Biology student at JRMSU.',
        faceScanRegistered: false,
        status: 'Pending',
        createdAt: '2024-02-19T14:00:00Z'
    }
];

// =====================
// REGISTRATIONS (from db_sample.json → registrations[])
// =====================
export const registrations = [
    {
        registrationId: 'REG-001',
        studentId: '2023-0002',
        status: 'pending_approval',
        submissionDate: '2024-02-15T11:45:00Z'
    },
    {
        registrationId: 'REG-002',
        studentId: '2023-0006',
        status: 'pending_approval',
        submissionDate: '2024-02-19T14:00:00Z'
    }
];

// =====================
// METADATA (from db_sample.json → metadata)
// =====================
export const metadata = {
    colleges: [
        'College of Engineering',
        'College of Arts and Sciences',
        'College of Business',
        'College of Education'
    ],
    programs: {
        'College of Engineering': ['BS Computer Engineering', 'BS Civil Engineering', 'BS Electronics Engineering'],
        'College of Arts and Sciences': ['BA Psychology', 'BS Biology', 'BA Communication'],
        'College of Business': ['BS Accountancy', 'BS Business Administration'],
        'College of Education': ['B Secondary Education', 'B Elementary Education']
    }
};

// =====================
// EVENTS (extra mock data for Events page)
// =====================
export const events = [
    { id: 1, name: 'Engineering Summit 2026', date: '2026-02-25', time: '08:00 AM', location: 'Main Auditorium', college: 'College of Engineering', status: 'Upcoming', attendees: 245 },
    { id: 2, name: 'College Week Kick-off', date: '2026-03-01', time: '09:00 AM', location: 'Campus Grounds', college: null, status: 'Upcoming', attendees: 0 },
    { id: 3, name: 'Tech Talk: AI in Education', date: '2026-03-10', time: '02:00 PM', location: 'Room 302, Engineering Bldg', college: 'College of Engineering', status: 'Planning', attendees: 0 },
    { id: 4, name: 'Intramurals Opening', date: '2026-01-15', time: '07:00 AM', location: 'Sports Complex', college: null, status: 'Completed', attendees: 1280 },
    { id: 5, name: 'Research Colloquium', date: '2026-01-20', time: '01:00 PM', location: 'Conference Hall', college: 'College of Arts and Sciences', status: 'Completed', attendees: 89 },
];

// =====================
// COLLEGES (extra mock data for Colleges page)
// =====================
export const colleges = [
    {
        name: 'College of Engineering',
        dean: 'Dr. Juan Dela Cruz',
        students: 856,
        sgOfficer: 'Carlos Santos',
        color: 'from-blue-500 to-cyan-400',
        programs: [
            { name: 'BS Computer Engineering', students: 312 },
            { name: 'BS Civil Engineering', students: 280 },
            { name: 'BS Electronics Engineering', students: 264 },
        ]
    },
    {
        name: 'College of Arts and Sciences',
        dean: 'Dr. Maria Reyes',
        students: 724,
        sgOfficer: 'Ana Lopez',
        color: 'from-purple-500 to-violet-400',
        programs: [
            { name: 'BA Psychology', students: 290 },
            { name: 'BS Biology', students: 215 },
            { name: 'BA Communication', students: 219 },
        ]
    },
    {
        name: 'College of Business',
        dean: 'Dr. Pedro Garcia',
        students: 680,
        sgOfficer: 'Rico Mendoza',
        color: 'from-emerald-500 to-teal-400',
        programs: [
            { name: 'BS Accountancy', students: 350 },
            { name: 'BS Business Administration', students: 330 },
        ]
    },
    {
        name: 'College of Education',
        dean: 'Dr. Teresa Bautista',
        students: 587,
        sgOfficer: 'Lisa Ramos',
        color: 'from-amber-500 to-orange-400',
        programs: [
            { name: 'B Secondary Education', students: 310 },
            { name: 'B Elementary Education', students: 277 },
        ]
    },
];

// =====================
// ATTENDANCE RECORDS (extra mock data for Attendance page)
// =====================
export const attendanceRecords = [
    { id: 1, studentId: '2023-0001', student: 'Jose Rizal', event: 'Engineering Summit 2026', date: '2026-02-25', checkIn: '08:05 AM', checkOut: '04:30 PM', status: 'Present' },
    { id: 2, studentId: '2023-0002', student: 'Maria Clara', event: 'Engineering Summit 2026', date: '2026-02-25', checkIn: '08:45 AM', checkOut: '04:30 PM', status: 'Late' },
    { id: 3, studentId: '2023-0003', student: 'Juan Luna', event: 'Engineering Summit 2026', date: '2026-02-25', checkIn: '-', checkOut: '-', status: 'Absent' },
    { id: 4, studentId: '2023-0004', student: 'Andres Bonifacio', event: 'Intramurals Opening', date: '2026-01-15', checkIn: '06:55 AM', checkOut: '12:00 PM', status: 'Present' },
    { id: 5, studentId: '2023-0001', student: 'Jose Rizal', event: 'Intramurals Opening', date: '2026-01-15', checkIn: '07:10 AM', checkOut: '12:00 PM', status: 'Present' },
    { id: 6, studentId: '2023-0002', student: 'Maria Clara', event: 'Intramurals Opening', date: '2026-01-15', checkIn: '-', checkOut: '-', status: 'Absent' },
    { id: 7, studentId: '2023-0005', student: 'Gabriela Silang', event: 'Intramurals Opening', date: '2026-01-15', checkIn: '07:00 AM', checkOut: '12:00 PM', status: 'Present' },
];

// =====================
// LOGIN RECORDS (extra mock data for LoggedInRecords page)
// =====================
export const loginRecords = [
    { id: 1, userId: 'ADMIN-01', user: 'System Admin', email: 'admin@rizal.edu', role: 'Admin', device: 'Desktop', browser: 'Firefox', ip: '192.168.1.10', loginTime: '2026-02-18 07:55 AM', status: 'Active' },
    { id: 2, userId: 'SG-01', user: 'Carlos Santos', email: 'sg_president@rizal.edu', role: 'SG', device: 'Desktop', browser: 'Chrome', ip: '192.168.1.22', loginTime: '2026-02-18 07:30 AM', status: 'Active' },
    { id: 3, userId: '2023-0001', user: 'Jose Rizal', email: 'jose.rizal@rizal.edu', role: 'Student', device: 'Mobile', browser: 'Chrome', ip: '192.168.1.45', loginTime: '2026-02-18 08:12 AM', status: 'Active' },
    { id: 4, userId: '2023-0002', user: 'Maria Clara', email: 'maria.clara@rizal.edu', role: 'Student', device: 'Mobile', browser: 'Safari', ip: '192.168.1.67', loginTime: '2026-02-17 06:45 PM', status: 'Expired' },
    { id: 5, userId: '2023-0003', user: 'Juan Luna', email: 'juan.luna@rizal.edu', role: 'Student', device: 'Desktop', browser: 'Edge', ip: '192.168.1.88', loginTime: '2026-02-17 04:20 PM', status: 'Expired' },
    { id: 6, userId: 'SG-02', user: 'Ana Lopez', email: 'sg_vp@rizal.edu', role: 'SG', device: 'Mobile', browser: 'Chrome', ip: '192.168.1.33', loginTime: '2026-02-17 02:10 PM', status: 'Expired' },
    { id: 7, userId: '2023-0004', user: 'Andres Bonifacio', email: 'andres.b@rizal.edu', role: 'Student', device: 'Mobile', browser: 'Chrome', ip: '192.168.1.90', loginTime: '2026-02-17 11:05 AM', status: 'Expired' },
];

// =====================
// DASHBOARD STATS (computed from above data)
// =====================
export const dashboardStats = {
    totalStudents: users.filter(u => u.role === 'student').length,
    activeEvents: events.filter(e => e.status === 'Upcoming').length,
    totalColleges: colleges.length,
    attendanceRate: 89 // percentage
};

export const recentActivity = [
    { userId: '2023-0001', user: 'Jose Rizal', action: 'Checked in at Engineering Summit', time: '2 min ago', type: 'checkin' },
    { userId: '2023-0002', user: 'Maria Clara', action: 'Account approved by SG', time: '15 min ago', type: 'approval' },
    { userId: '2023-0003', user: 'Juan Luna', action: 'Registered for Tech Talk', time: '1 hr ago', type: 'registration' },
    { userId: '2023-0004', user: 'Andres Bonifacio', action: 'New account created', time: '3 hrs ago', type: 'account' },
    { userId: '2023-0005', user: 'Gabriela Silang', action: 'Checked in at Intramurals', time: '5 hrs ago', type: 'checkin' },
];

export const weeklyAttendance = [
    { day: 'Mon', value: 72 },
    { day: 'Tue', value: 85 },
    { day: 'Wed', value: 60 },
    { day: 'Thu', value: 90 },
    { day: 'Fri', value: 78 },
    { day: 'Sat', value: 40 },
    { day: 'Sun', value: 20 },
];
