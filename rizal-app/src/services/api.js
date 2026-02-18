/**
 * ============================================================
 * API SERVICE LAYER
 * ============================================================
 *
 * This is the SINGLE FILE where you swap mock data → real API.
 *
 * RIGHT NOW:  Functions return data from src/mock/db.js
 * LATER:      Replace each function body with a fetch() call
 *
 * 🔴 BACKEND TEAM: Each function below maps to one API endpoint.
 *    The function name tells you what endpoint to build.
 *    The return shape tells you what JSON to return.
 *
 * Example swap (for getUsers):
 *   BEFORE: return mockDb.users;
 *   AFTER:  const res = await fetch('/api/users'); return res.json();
 * ============================================================
 */

import * as mockDb from '../mock/db.js';

// -----------------------------------------------------------
// 🔐 AUTH — POST /api/auth/login
// -----------------------------------------------------------
/**
 * Authenticate a user by email and password.
 *
 * 🔴 BACKEND: POST /api/auth/login
 *    Request:  { email, password, rememberMe }
 *    Response: { token, user: { id, name, email, role, college } }
 */
export async function loginUser(email, password, rememberMe = false) {
    // ⬇️ MOCK: Simulate login by matching email in mock DB
    await delay(800); // Simulate network latency
    const user = mockDb.users.find(u => u.email === email);

    if (!user) {
        throw new Error('User not found');
    }

    // ⬇️ MOCK: We don't check passwords in mock mode
    // 🔴 BACKEND: The real API should validate the hashed password
    return {
        token: 'mock-jwt-token-' + user.id,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            college: user.college,
            rememberMe: rememberMe
        }
    };
}

// -----------------------------------------------------------
// 👤 USERS — GET /api/users
// -----------------------------------------------------------
/**
 * Get all users (admin, sg, students).
 *
 * 🔴 BACKEND: GET /api/users
 *    Response: [ { id, name, email, role, college, program, status, ... } ]
 */
export async function getUsers() {
    // ⬇️ MOCK: Return mock users from db.js
    await delay(300);
    return mockDb.users;

    // 🔴 BACKEND REPLACEMENT:
    // const res = await fetch('/api/users', {
    //   headers: { 'Authorization': `Bearer ${getToken()}` }
    // });
    // if (!res.ok) throw new Error('Failed to fetch users');
    // return res.json();
}

// -----------------------------------------------------------
// 👤 USERS — POST /api/users (Create Account)
// -----------------------------------------------------------
/**
 * Create a new user account (admin-side).
 *
 * 🔴 BACKEND: POST /api/users
 *    Request:  { fullName, studentId, email, password, college, program, role }
 *    Response: { id, name, email, role, status: 'Active' }
 */
export async function createUser(userData) {
    // ⬇️ MOCK: Add to mock array (won't persist on refresh)
    await delay(1200);
    const newUser = {
        id: 'NEW-' + Date.now(),
        name: userData.fullName,
        email: userData.email,
        role: userData.role,
        college: userData.college || 'Admin Office',
        program: userData.program || '-',
        studentId: userData.studentId,
        status: 'Active',
        faceScanRegistered: false,
        createdAt: new Date().toISOString()
    };
    mockDb.users.push(newUser);
    return newUser;

    // 🔴 BACKEND REPLACEMENT:
    // const res = await fetch('/api/users', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${getToken()}`
    //   },
    //   body: JSON.stringify(userData)
    // });
    // if (!res.ok) throw new Error('Failed to create user');
    // return res.json();
}

// -----------------------------------------------------------
// 📅 EVENTS — GET /api/events
// -----------------------------------------------------------
/**
 * Get all events.
 *
 * 🔴 BACKEND: GET /api/events
 *    Response: [ { id, name, date, time, location, college, status, attendees } ]
 */
export async function getEvents() {
    // ⬇️ MOCK: Return mock events from db.js
    await delay(300);
    return [...mockDb.events];

    // 🔴 BACKEND REPLACEMENT:
    // const res = await fetch('/api/events', {
    //   headers: { 'Authorization': `Bearer ${getToken()}` }
    // });
    // return res.json();
}

// -----------------------------------------------------------
// 📅 EVENTS — POST /api/events (Create Event)
// -----------------------------------------------------------
/**
 * Create a new event.
 *
 * 🔴 BACKEND: POST /api/events
 *    Request:  { name, date, time, location }
 *    Response: { id, name, date, time, location, status, attendees: 0 }
 */
export async function createEvent(eventData) {
    // ⬇️ MOCK: Add to mock array
    await delay(800);
    const newEvent = {
        id: Date.now(),
        ...eventData,
        status: 'Planning',
        attendees: 0
    };
    mockDb.events.unshift(newEvent);
    return newEvent;

    // 🔴 BACKEND REPLACEMENT:
    // const res = await fetch('/api/events', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${getToken()}`
    //   },
    //   body: JSON.stringify(eventData)
    // });
    // return res.json();
}

// -----------------------------------------------------------
// 🏫 COLLEGES — GET /api/colleges
// -----------------------------------------------------------
/**
 * Get all colleges with programs and student counts.
 *
 * 🔴 BACKEND: GET /api/colleges
 *    Response: [ { name, dean, students, sgOfficer, programs: [...] } ]
 */
export async function getColleges() {
    // ⬇️ MOCK: Return mock colleges from db.js
    await delay(300);
    return mockDb.colleges.map(c => ({ ...c, expanded: false }));

    // 🔴 BACKEND REPLACEMENT:
    // const res = await fetch('/api/colleges', {
    //   headers: { 'Authorization': `Bearer ${getToken()}` }
    // });
    // return res.json();
}

// -----------------------------------------------------------
// 🏫 COLLEGES — POST /api/colleges
// -----------------------------------------------------------
/**
 * Create a new college.
 *
 * 🔴 BACKEND: POST /api/colleges
 *    Request:  { name, dean, sgOfficer, programs: [{ name }] }
 *    Response: { name, dean, students, sgOfficer, color, programs: [...] }
 */
export async function createCollege(collegeData) {
    // ⬇️ MOCK: Add to mock db
    await delay(400);
    const colors = [
        'from-blue-500 to-cyan-400',
        'from-purple-500 to-violet-400',
        'from-emerald-500 to-teal-400',
        'from-amber-500 to-orange-400',
        'from-rose-500 to-pink-400',
        'from-indigo-500 to-blue-400',
        'from-teal-500 to-green-400',
    ];
    const newCollege = {
        name: collegeData.name,
        dean: collegeData.dean || 'TBD',
        students: 0,
        sgOfficer: collegeData.sgOfficer || 'TBD',
        color: colors[mockDb.colleges.length % colors.length],
        programs: (collegeData.programs || []).map(p => ({
            name: typeof p === 'string' ? p : p.name,
            students: 0,
        })),
    };
    mockDb.colleges.push(newCollege);
    return { ...newCollege, expanded: false };

    // 🔴 BACKEND REPLACEMENT:
    // const res = await fetch('/api/colleges', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${getToken()}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(collegeData)
    // });
    // return res.json();
}

// -----------------------------------------------------------
// 📋 ATTENDANCE — GET /api/attendance
// -----------------------------------------------------------
/**
 * Get attendance records, optionally filtered by event.
 *
 * 🔴 BACKEND: GET /api/attendance?event=...&status=...
 *    Response: [ { id, studentId, student, event, date, checkIn, checkOut, status } ]
 */
export async function getAttendanceRecords() {
    // ⬇️ MOCK: Return mock attendance from db.js
    await delay(300);
    return [...mockDb.attendanceRecords];

    // 🔴 BACKEND REPLACEMENT:
    // const res = await fetch('/api/attendance', {
    //   headers: { 'Authorization': `Bearer ${getToken()}` }
    // });
    // return res.json();
}

// -----------------------------------------------------------
// 📊 LOGIN RECORDS — GET /api/logs
// -----------------------------------------------------------
/**
 * Get login/session records.
 *
 * 🔴 BACKEND: GET /api/logs
 *    Response: [ { id, userId, user, email, role, device, browser, ip, loginTime, status } ]
 */
export async function getLoginRecords() {
    // ⬇️ MOCK: Return mock login records from db.js
    await delay(300);
    return [...mockDb.loginRecords];

    // 🔴 BACKEND REPLACEMENT:
    // const res = await fetch('/api/logs', {
    //   headers: { 'Authorization': `Bearer ${getToken()}` }
    // });
    // return res.json();
}

// -----------------------------------------------------------
// 👤 PROFILE — GET /api/profile, PUT /api/profile
// -----------------------------------------------------------
/**
 * Get the current user's profile data.
 *
 * 🔴 BACKEND: GET /api/profile
 *    Response: { name, email, role, phone, department, bio, college, ... }
 */
export async function getProfile(userId = 'ADMIN-01') {
    // ⬇️ MOCK: Find user by ID (defaults to admin)
    await delay(300);
    const user = mockDb.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    // Return profile data (exclude password)
    const { password, ...profile } = user;
    return profile;

    // 🔴 BACKEND REPLACEMENT:
    // const res = await fetch('/api/profile', {
    //   headers: { 'Authorization': `Bearer ${getToken()}` }
    // });
    // return res.json();
}

/**
 * Update the current user's profile data.
 *
 * 🔴 BACKEND: PUT /api/profile
 *    Body: { name, phone, department, bio }
 */
export async function updateProfile(profileData, userId = 'ADMIN-01') {
    // ⬇️ MOCK: Update user in mock db
    await delay(400);
    const userIndex = mockDb.users.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error('User not found');
    Object.assign(mockDb.users[userIndex], profileData);
    const { password, ...updated } = mockDb.users[userIndex];
    return updated;

    // 🔴 BACKEND REPLACEMENT:
    // const res = await fetch('/api/profile', {
    //   method: 'PUT',
    //   headers: {
    //     'Authorization': `Bearer ${getToken()}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(profileData)
    // });
    // return res.json();
}

// -----------------------------------------------------------
// 📈 DASHBOARD — GET /api/dashboard
// -----------------------------------------------------------
/**
 * Get dashboard overview data (stats, recent activity, chart).
 *
 * 🔴 BACKEND: GET /api/dashboard
 *    Response: { stats: {...}, recentActivity: [...], weeklyAttendance: [...] }
 */
export async function getDashboardData() {
    // ⬇️ MOCK: Build dashboard data from mock db
    await delay(400);
    return {
        stats: mockDb.dashboardStats,
        recentActivity: mockDb.recentActivity,
        weeklyAttendance: mockDb.weeklyAttendance,
        upcomingEvents: mockDb.events.filter(e => e.status === 'Upcoming'),
        allEvents: mockDb.events
    };

    // 🔴 BACKEND REPLACEMENT:
    // const res = await fetch('/api/dashboard', {
    //   headers: { 'Authorization': `Bearer ${getToken()}` }
    // });
    // return res.json();
}

// -----------------------------------------------------------
// 🗂️ METADATA — GET /api/metadata
// -----------------------------------------------------------
/**
 * Get dropdown metadata (colleges list, programs per college).
 *
 * 🔴 BACKEND: GET /api/metadata
 *    Response: { colleges: [...], programs: { "College": ["Program1", ...] } }
 */
export async function getMetadata() {
    // ⬇️ MOCK: Return metadata from db.js
    await delay(100);
    return mockDb.metadata;

    // 🔴 BACKEND REPLACEMENT:
    // const res = await fetch('/api/metadata');
    // return res.json();
}

// -----------------------------------------------------------
// HELPERS
// -----------------------------------------------------------
/** Simulate network delay for mock data */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get stored auth token.
 * 🔴 BACKEND: Used by all authenticated requests.
 */
export function getToken() {
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || '';
}

/**
 * Get current logged-in user from localStorage or sessionStorage.
 */
export function getCurrentUser() {
    const data = localStorage.getItem('current_user') || sessionStorage.getItem('current_user');
    return data ? JSON.parse(data) : null;
}

/**
 * Save auth data after login.
 * 🔴 BACKEND: rememberMe=true uses localStorage (persists across sessions),
 *    rememberMe=false uses sessionStorage (clears when browser closes).
 */
export function saveAuth(token, user, rememberMe = false) {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('auth_token', token);
    storage.setItem('current_user', JSON.stringify(user));
    // Also flag which storage was used, so getToken/getCurrentUser can check both
    localStorage.setItem('auth_storage', rememberMe ? 'local' : 'session');
}

/**
 * Clear auth data on logout (both storages).
 */
export function clearAuth() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    localStorage.removeItem('auth_storage');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('current_user');
}
