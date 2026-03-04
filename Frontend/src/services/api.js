/**
 * ============================================================
 * API SERVICE LAYER
 * ============================================================
 *
 * This file connects the frontend to the FastAPI backend.
 *
 * Functions that have matching backend endpoints use real fetch() calls.
 * Functions WITHOUT matching backend endpoints still use mock data
 * from src/mock/db.js (these are marked with ⬇️ MOCK below).
 *
 * The API_BASE is configurable via the VITE_API_URL environment variable.
 * Default: http://localhost:8000
 * ============================================================
 */

import * as mockDb from '../mock/db.js';

// -----------------------------------------------------------
// 🔧 BASE URL & HELPERS
// -----------------------------------------------------------
// Points to the live Render backend
const API_BASE = import.meta.env.VITE_API_URL || 'https://rizal-backend.onrender.com';

/**
 * Shared fetch wrapper that adds auth headers and handles errors.
 * All authenticated API calls should use this.
 */
async function apiFetch(path, options = {}) {
    const token = getToken();
    const headers = {
        ...(options.headers || {}),
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    if (options.body && typeof options.body === 'string') {
        headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        let detail = `Request failed (${res.status})`;
        try {
            const err = await res.json();
            detail = err.detail || detail;
        } catch (_) { /* ignore parse errors */ }
        throw new Error(detail);
    }

    // 204 No Content
    if (res.status === 204) return null;
    return res.json();
}

/**
 * Transform a backend user object into the shape the frontend views expect.
 * Backend: { id, email, first_name, middle_name, last_name, is_active, created_at, roles, student_profile, ssg_profile }
 * Frontend: { id, name, email, role, college, program, studentId, faceScanRegistered, status, ... }
 */
function formatUserFromBackend(u) {
    // Build full name
    const nameParts = [u.first_name, u.middle_name, u.last_name].filter(Boolean);
    const name = nameParts.join(' ') || u.email;

    // Extract primary role
    let role = 'student';
    if (u.roles && u.roles.length > 0) {
        const roleNames = u.roles.map(r => (r.role ? r.role.name : r)).filter(Boolean);
        if (roleNames.includes('admin')) role = 'admin';
        else if (roleNames.includes('ssg')) role = 'sg';
        else if (roleNames.includes('student')) role = 'student';
        else role = roleNames[0] || 'student';
    }

    // Extract student profile data if present
    const sp = u.student_profile || {};
    const college = sp.department?.name || u.department_name || '';
    const program = sp.program?.name || '';
    const studentId = sp.student_id || '';
    const faceScanRegistered = sp.is_face_registered || false;

    return {
        id: sp.student_id || u.id,
        name,
        email: u.email,
        role,
        college,
        program,
        studentId,
        phone: '',
        department: college,
        bio: '',
        faceScanRegistered,
        status: u.is_active ? 'Active' : 'Inactive',
        createdAt: u.created_at,
    };
}

/**
 * Transform a backend event object into the shape the frontend views expect.
 * Backend: { id, name, location, start_datetime, end_datetime, status, departments, programs, ... }
 * Frontend: { id, name, date, time, location, college, status, attendees, attendanceOpen, ... }
 */
function formatEventFromBackend(e) {
    const startDt = e.start_datetime ? new Date(e.start_datetime) : null;
    const date = startDt ? startDt.toISOString().split('T')[0] : '';
    const time = startDt
        ? startDt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
        : '';

    // Map backend status to frontend status (capitalize first letter)
    let status = e.status || 'upcoming';
    status = status.charAt(0).toUpperCase() + status.slice(1);

    // College = first department name (or null for campus-wide)
    const college = (e.departments && e.departments.length > 0)
        ? e.departments[0].name
        : null;

    return {
        id: e.id,
        name: e.name,
        date,
        time,
        location: e.location || '',
        description: e.description || '',
        college,
        status,
        attendees: e.attendances ? e.attendances.length : 0,
        attendanceOpen: status === 'Ongoing',
        latitude: e.latitude || 0,
        longitude: e.longitude || 0,
        radiusMeters: e.radiusMeters || 150,
    };
}


// -----------------------------------------------------------
// 🔐 AUTH — POST /login
// -----------------------------------------------------------
/**
 * Authenticate a user by email and password.
 *
 * Backend: POST /login
 *   Request:  { email, password }
 *   Response: { access_token, token_type, email, roles, user_id, first_name, last_name, is_admin }
 */
export async function loginUser(email, password, rememberMe = false) {
    try {
        const data = await apiFetch('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        // Build user object from login response
        const roles = data.roles || [];
        let role = 'student';
        if (roles.includes('admin')) role = 'admin';
        else if (roles.includes('ssg')) role = 'sg';

        // After login, fetch full profile for extra data (college, faceScan, etc.)
        // Store the token first so apiFetch can use it
        const tempStorage = rememberMe ? localStorage : sessionStorage;
        tempStorage.setItem('auth_token', data.access_token);

        let college = '';
        let faceScanRegistered = false;
        let studentId = '';
        try {
            const profile = await apiFetch('/users/me');
            const formatted = formatUserFromBackend(profile);
            college = formatted.college;
            faceScanRegistered = formatted.faceScanRegistered;
            studentId = formatted.studentId;
        } catch (_) {
            // Profile fetch failed, continue with basic data
        }

        const nameParts = [data.first_name, data.last_name].filter(Boolean);
        const name = nameParts.join(' ') || email;

        return {
            token: data.access_token,
            user: {
                id: studentId || data.user_id,
                name,
                email: data.email || email,
                role,
                college,
                faceScanRegistered,
                rememberMe,
            },
        };
    } catch (err) {
        // If backend is unreachable, fall back to mock for development
        console.warn('Backend login failed, falling back to mock:', err.message);
        await delay(800);
        const user = mockDb.users.find(u => u.email === email);
        if (!user) throw new Error('Invalid email or password.');
        if (user.password !== password) throw new Error('Invalid email or password.');

        return {
            token: 'mock-jwt-token-' + user.id,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                college: user.college,
                faceScanRegistered: user.faceScanRegistered,
                rememberMe,
            },
        };
    }
}

// -----------------------------------------------------------
// 👤 USERS — GET /users
// -----------------------------------------------------------
/**
 * Get all users (admin, sg, students).
 *
 * Backend: GET /users
 *   Response: [ { id, email, first_name, last_name, is_active, roles, student_profile, ... } ]
 */
export async function getUsers() {
    try {
        const users = await apiFetch('/users');
        return users.map(formatUserFromBackend);
    } catch (err) {
        console.warn('Backend getUsers failed, falling back to mock:', err.message);
        await delay(300);
        return mockDb.users;
    }
}

// -----------------------------------------------------------
// 👤 USERS — POST /users (Create Account)
// -----------------------------------------------------------
/**
 * Create a new user account (admin-side).
 *
 * Backend: POST /users
 *   Request:  { email, password, first_name, last_name, roles }
 *   Response: { id, email, first_name, last_name, ... }
 */
export async function createUser(userData) {
    try {
        // Map frontend field names to backend schema
        const nameParts = (userData.fullName || '').trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // Map frontend role to backend role enum
        let roles = [userData.role || 'student'];
        if (roles[0] === 'sg') roles = ['ssg'];

        const payload = {
            email: userData.email,
            password: userData.password || 'Temp1234!',
            first_name: firstName,
            last_name: lastName,
            roles,
        };

        const created = await apiFetch('/users', {
            method: 'POST',
            body: JSON.stringify(payload),
        });

        return formatUserFromBackend(created);
    } catch (err) {
        console.warn('Backend createUser failed, falling back to mock:', err.message);
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
            createdAt: new Date().toISOString(),
        };
        mockDb.users.push(newUser);
        return newUser;
    }
}

// -----------------------------------------------------------
// 📅 EVENTS — GET /events
// -----------------------------------------------------------
/**
 * Get all events.
 *
 * Backend: GET /events
 *   Response: [ { id, name, location, start_datetime, end_datetime, status, departments, programs, ... } ]
 */
export async function getEvents() {
    try {
        const events = await apiFetch('/events');
        return events.map(formatEventFromBackend);
    } catch (err) {
        console.warn('Backend getEvents failed, falling back to mock:', err.message);
        await delay(300);
        return [...mockDb.events];
    }
}

// -----------------------------------------------------------
// 📅 EVENTS — POST /events (Create Event)
// -----------------------------------------------------------
/**
 * Create a new event.
 *
 * Backend: POST /events
 *   Request:  { name, location, start_datetime, end_datetime, status, department_ids, program_ids }
 *   Response: { id, name, location, start_datetime, ... }
 */
export async function createEvent(eventData) {
    try {
        // Parse date + time into ISO datetime
        let startDatetime = eventData.start_datetime;
        let endDatetime = eventData.end_datetime;

        if (!startDatetime && eventData.date) {
            // Convert "2026-02-25" + "08:00 AM" → ISO datetime
            const dateStr = eventData.date;
            const timeStr = eventData.time || '08:00 AM';
            startDatetime = new Date(`${dateStr} ${timeStr}`).toISOString();
            // Default end = start + 8 hours
            endDatetime = endDatetime || new Date(new Date(startDatetime).getTime() + 8 * 60 * 60 * 1000).toISOString();
        }

        const payload = {
            name: eventData.name,
            location: eventData.location || '',
            start_datetime: startDatetime,
            end_datetime: endDatetime,
            status: (eventData.status || 'upcoming').toLowerCase(),
            department_ids: eventData.department_ids || [],
            program_ids: eventData.program_ids || [],
        };

        const created = await apiFetch('/events', {
            method: 'POST',
            body: JSON.stringify(payload),
        });

        return formatEventFromBackend(created);
    } catch (err) {
        console.warn('Backend createEvent failed, falling back to mock:', err.message);
        await delay(800);
        const newEvent = {
            id: Date.now(),
            ...eventData,
            status: 'Planning',
            attendees: 0,
        };
        mockDb.events.unshift(newEvent);
        return newEvent;
    }
}

// -----------------------------------------------------------
// 🏫 COLLEGES — GET /departments
// -----------------------------------------------------------
/**
 * Get all colleges with programs and student counts.
 *
 * Backend: GET /departments (departments = colleges in this app)
 *   + GET /programs for program details
 */
export async function getColleges() {
    try {
        const departments = await apiFetch('/departments');
        const programs = await apiFetch('/programs');

        // Map departments → colleges format the frontend expects
        return departments.map(dept => {
            // Find programs associated with this department
            const deptPrograms = programs.filter(p =>
                p.department_ids && p.department_ids.includes(dept.id)
            );

            return {
                id: dept.id,
                name: dept.name,
                dean: 'TBD',
                students: 0,
                sgOfficer: 'TBD',
                color: 'from-blue-500 to-cyan-400',
                programs: deptPrograms.map(p => ({
                    name: p.name,
                    students: 0,
                })),
                expanded: false,
            };
        });
    } catch (err) {
        console.warn('Backend getColleges failed, falling back to mock:', err.message);
        await delay(300);
        return mockDb.colleges.map(c => ({ ...c, expanded: false }));
    }
}

// -----------------------------------------------------------
// 🏫 COLLEGES — POST /departments
// -----------------------------------------------------------
/**
 * Create a new college (department in backend).
 *
 * Backend: POST /departments
 *   Request:  { name }
 *   Response: { id, name }
 */
export async function createCollege(collegeData) {
    try {
        const dept = await apiFetch('/departments', {
            method: 'POST',
            body: JSON.stringify({ name: collegeData.name }),
        });

        // Create programs if provided
        if (collegeData.programs && collegeData.programs.length > 0) {
            for (const prog of collegeData.programs) {
                const progName = typeof prog === 'string' ? prog : prog.name;
                try {
                    await apiFetch('/programs', {
                        method: 'POST',
                        body: JSON.stringify({
                            name: progName,
                            department_ids: [dept.id],
                        }),
                    });
                } catch (_) { /* program creation is best-effort */ }
            }
        }

        return {
            id: dept.id,
            name: dept.name,
            dean: collegeData.dean || 'TBD',
            students: 0,
            sgOfficer: collegeData.sgOfficer || 'TBD',
            color: 'from-blue-500 to-cyan-400',
            programs: (collegeData.programs || []).map(p => ({
                name: typeof p === 'string' ? p : p.name,
                students: 0,
            })),
            expanded: false,
        };
    } catch (err) {
        console.warn('Backend createCollege failed, falling back to mock:', err.message);
        await delay(400);
        const colors = [
            'from-blue-500 to-cyan-400',
            'from-purple-500 to-violet-400',
            'from-emerald-500 to-teal-400',
            'from-amber-500 to-orange-400',
            'from-rose-500 to-pink-400',
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
    }
}

// -----------------------------------------------------------
// 📋 ATTENDANCE — GET /attendance/students
// -----------------------------------------------------------
/**
 * Get attendance records, optionally filtered by event.
 *
 * Backend: GET /attendance/students (overview endpoint)
 */
export async function getAttendanceRecords() {
    try {
        const data = await apiFetch('/attendance/students');

        // Transform the overview response into individual records
        if (Array.isArray(data)) {
            return data.map(record => ({
                id: record.id || 0,
                studentId: record.student_id || '',
                student: record.student_name || '',
                event: record.event_name || '',
                date: record.date || '',
                checkIn: record.time_in || '-',
                checkOut: record.time_out || '-',
                status: record.status ? (record.status.charAt(0).toUpperCase() + record.status.slice(1)) : 'Present',
            }));
        }

        // If the response has a different shape (paginated), extract records
        const records = data.students || data.items || [];
        return records.map(record => ({
            id: record.id || 0,
            studentId: record.student_id || '',
            student: record.student_name || record.name || '',
            event: '',
            date: '',
            checkIn: '-',
            checkOut: '-',
            status: 'Present',
        }));
    } catch (err) {
        console.warn('Backend getAttendanceRecords failed, falling back to mock:', err.message);
        await delay(300);
        return [...mockDb.attendanceRecords];
    }
}

// -----------------------------------------------------------
// 📍 LOCATION VERIFICATION — POST /api/attendance/verify-location
// -----------------------------------------------------------
/**
 * Verify student is within the event's geofence radius.
 * Uses the Haversine formula to calculate distance between two GPS points.
 *
 * ⬇️ MOCK: No backend endpoint exists for geofence verification yet.
 */
export async function verifyEventLocation(eventId, userLat, userLng) {
    await delay(500);

    // Try to get event from backend first, fall back to mock
    let event;
    try {
        const backendEvent = await apiFetch(`/events/${eventId}`);
        event = formatEventFromBackend(backendEvent);
    } catch (_) {
        event = mockDb.events.find(e => e.id === eventId);
    }

    if (!event) throw new Error('Event not found.');

    // Haversine formula — calculates distance in meters between two GPS points
    const R = 6371000;
    const dLat = ((event.latitude || 0) - userLat) * Math.PI / 180;
    const dLng = ((event.longitude || 0) - userLng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(userLat * Math.PI / 180) * Math.cos((event.latitude || 0) * Math.PI / 180) *
        Math.sin(dLng / 2) ** 2;
    const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const radius = event.radiusMeters || 150;

    return {
        verified: distance <= radius,
        distance: Math.round(distance),
        maxRadius: radius,
        eventLocation: event.location,
    };
}

// -----------------------------------------------------------
// 📋 STUDENT ATTENDANCE STATUS — GET /api/attendance/status/:eventId/:studentId
// -----------------------------------------------------------
/**
 * Check if a student already has attendance for an event.
 *
 * ⬇️ MOCK: Complex query not directly available as single backend endpoint.
 */
export async function getStudentAttendanceForEvent(eventId, studentId) {
    await delay(200);
    const event = mockDb.events.find(e => e.id === eventId);
    const record = mockDb.attendanceRecords.find(
        r => r.event === event?.name && r.studentId === studentId && r.status !== 'Absent'
    );
    return {
        hasAttendance: !!record,
        record: record || null,
    };
}

// -----------------------------------------------------------
// ✅ MARK ATTENDANCE — POST /api/attendance/mark
// -----------------------------------------------------------
/**
 * Mark student attendance after face verification.
 *
 * ⬇️ MOCK: Backend uses a different attendance flow (face_scan/manual endpoints).
 */
export async function markAttendance(eventId, studentId, faceVerified = false) {
    await delay(600);

    if (!faceVerified) throw new Error('Face verification required.');

    const event = mockDb.events.find(e => e.id === eventId);
    if (!event) throw new Error('Event not found.');

    const now = new Date();
    const checkInTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const user = mockDb.users.find(u => u.studentId === studentId || u.id === studentId);

    const newRecord = {
        id: mockDb.attendanceRecords.length + 1,
        studentId,
        student: user?.name || 'Unknown',
        event: event.name,
        date: now.toISOString().split('T')[0],
        checkIn: checkInTime,
        checkOut: '-',
        status: 'Present',
    };

    mockDb.attendanceRecords.push(newRecord);

    return {
        success: true,
        checkIn: checkInTime,
        record: newRecord,
    };
}

// -----------------------------------------------------------
// 📊 LOGIN RECORDS — GET /api/logs
// -----------------------------------------------------------
/**
 * Get login/session records.
 *
 * ⬇️ MOCK: Backend has no login logs endpoint yet.
 */
export async function getLoginRecords() {
    await delay(300);
    return [...mockDb.loginRecords];
}

// -----------------------------------------------------------
// 👤 PROFILE — GET /users/me, PATCH /users/{id}
// -----------------------------------------------------------
/**
 * Get the current user's profile data.
 *
 * Backend: GET /users/me
 */
export async function getProfile(userId = null) {
    try {
        const profile = await apiFetch('/users/me');
        return formatUserFromBackend(profile);
    } catch (err) {
        console.warn('Backend getProfile failed, falling back to mock:', err.message);
        await delay(300);
        const mockUserId = userId || 'ADMIN-01';
        const user = mockDb.users.find(u => u.id === mockUserId);
        if (!user) throw new Error('User not found');
        const { password, ...profileData } = user;
        return profileData;
    }
}

/**
 * Update the current user's profile data.
 *
 * Backend: PATCH /users/{id}
 */
export async function updateProfile(profileData, userId = null) {
    try {
        // Get current user to find their backend ID
        const currentUser = getCurrentUser();
        const backendId = currentUser?.backendId || currentUser?.id;

        if (!backendId) throw new Error('No user ID available for update');

        // Map frontend fields to backend schema
        const nameParts = (profileData.name || '').trim().split(' ');
        const payload = {};
        if (profileData.name) {
            payload.first_name = nameParts[0] || '';
            payload.last_name = nameParts.slice(1).join(' ') || '';
        }
        if (profileData.email) payload.email = profileData.email;

        const updated = await apiFetch(`/users/${backendId}`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
        });

        return formatUserFromBackend(updated);
    } catch (err) {
        console.warn('Backend updateProfile failed, falling back to mock:', err.message);
        await delay(400);
        const mockUserId = userId || 'ADMIN-01';
        const userIndex = mockDb.users.findIndex(u => u.id === mockUserId);
        if (userIndex === -1) throw new Error('User not found');
        Object.assign(mockDb.users[userIndex], profileData);
        const { password, ...updated } = mockDb.users[userIndex];
        return updated;
    }
}

// -----------------------------------------------------------
// 📈 DASHBOARD — GET /api/dashboard
// -----------------------------------------------------------
/**
 * Get dashboard overview data (stats, recent activity, chart).
 *
 * ⬇️ MOCK: Backend has no dashboard aggregation endpoint yet.
 */
export async function getDashboardData() {
    await delay(400);
    return {
        stats: mockDb.dashboardStats,
        recentActivity: mockDb.recentActivity,
        weeklyAttendance: mockDb.weeklyAttendance,
        upcomingEvents: mockDb.events.filter(e => e.status === 'Upcoming'),
        allEvents: mockDb.events,
    };
}

// -----------------------------------------------------------
// 🗂️ METADATA — GET /api/metadata
// -----------------------------------------------------------
/**
 * Get dropdown metadata (colleges list, programs per college).
 *
 * Tries backend first (departments + programs), falls back to mock.
 */
export async function getMetadata() {
    try {
        const departments = await apiFetch('/departments');
        const programs = await apiFetch('/programs');

        const colleges = departments.map(d => d.name);
        const programsByCollege = {};
        for (const dept of departments) {
            const deptPrograms = programs.filter(p =>
                p.department_ids && p.department_ids.includes(dept.id)
            );
            programsByCollege[dept.name] = deptPrograms.map(p => p.name);
        }

        return { colleges, programs: programsByCollege };
    } catch (err) {
        console.warn('Backend getMetadata failed, falling back to mock:', err.message);
        await delay(100);
        return mockDb.metadata;
    }
}

// -----------------------------------------------------------
// 📢 ANNOUNCEMENTS — GET /api/announcements
// -----------------------------------------------------------
/**
 * Get announcements, optionally filtered by college.
 *
 * ⬇️ MOCK: Backend has no announcements endpoint yet.
 */
export async function getAnnouncements(college = null) {
    await delay(300);
    if (college) {
        return mockDb.announcements.filter(a => a.college === null || a.college === college);
    }
    return [...mockDb.announcements];
}

// -----------------------------------------------------------
// 📅 STUDENT EVENTS — GET /events
// -----------------------------------------------------------
/**
 * Get events relevant to a student (their college events + campus-wide).
 *
 * Backend: GET /events (same endpoint, filtered client-side by college)
 */
export async function getStudentEvents(college = null) {
    try {
        const events = await apiFetch('/events');
        let formatted = events.map(formatEventFromBackend);

        if (college) {
            formatted = formatted.filter(e => e.college === null || e.college === college);
        }

        return formatted;
    } catch (err) {
        console.warn('Backend getStudentEvents failed, falling back to mock:', err.message);
        await delay(300);
        if (college) {
            return mockDb.events.filter(e => e.college === null || e.college === college);
        }
        return [...mockDb.events];
    }
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
 * Used by all authenticated requests via apiFetch().
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
 * rememberMe=true uses localStorage (persists across sessions),
 * rememberMe=false uses sessionStorage (clears when browser closes).
 */
export function saveAuth(token, user, rememberMe = false) {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('auth_token', token);
    storage.setItem('current_user', JSON.stringify(user));
    localStorage.setItem('auth_storage', rememberMe ? 'local' : 'session');
}

/**
 * Clear auth data on logout (both storages).
 */
export function clearAuth() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    localStorage.removeItem('auth_storage');
    localStorage.removeItem('offline_qr');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('current_user');
}

// -----------------------------------------------------------
// 📱 OFFLINE QR CODE CACHE
// -----------------------------------------------------------

/**
 * Cache QR code data to localStorage for offline access.
 * Only works if Remember Me was enabled (auth_storage === 'local').
 */
export function cacheOfflineQR(qrData) {
    const authStorage = localStorage.getItem('auth_storage');
    if (authStorage !== 'local') return false;

    localStorage.setItem('offline_qr', JSON.stringify({
        ...qrData,
        cachedAt: new Date().toISOString(),
    }));
    return true;
}

/**
 * Get cached QR data for offline display.
 * Returns null if no cached data or Remember Me was off.
 */
export function getOfflineQR() {
    const data = localStorage.getItem('offline_qr');
    return data ? JSON.parse(data) : null;
}

/**
 * Check if the user is using Remember Me (persistent session).
 */
export function isRememberMe() {
    return localStorage.getItem('auth_storage') === 'local';
}
