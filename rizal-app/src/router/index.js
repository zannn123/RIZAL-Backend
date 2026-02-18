import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: LandingPage
        },

        // Student Routes (standalone, no dashboard layout)
        {
            path: '/student/create',
            name: 'student-create',
            component: () => import('../views/student/CreateAccount.vue')
        },

        // Student Routes with Dashboard Layout
        {
            path: '/student',
            component: DashboardLayout,
            children: [
                {
                    path: 'pending',
                    name: 'student-pending',
                    component: () => import('../views/student/QRPending.vue')
                },
            ]
        },

        // SG Routes
        {
            path: '/sg',
            component: DashboardLayout,
            children: [
                {
                    path: 'approvals',
                    name: 'sg-approvals',
                    component: () => import('../views/sg/AccountApprovals.vue')
                },
            ]
        },

        // Admin Routes
        {
            path: '/admin',
            component: DashboardLayout,
            children: [
                {
                    path: 'dashboard',
                    name: 'admin-dashboard',
                    component: () => import('../views/admin/AdminDashboard.vue')
                },
                {
                    path: 'profile',
                    name: 'admin-profile',
                    component: () => import('../views/admin/Profile.vue')
                },
                {
                    path: 'events',
                    name: 'admin-events',
                    component: () => import('../views/admin/Events.vue')
                },
                {
                    path: 'colleges',
                    name: 'admin-colleges',
                    component: () => import('../views/admin/Colleges.vue')
                },
                {
                    path: 'students',
                    name: 'admin-students',
                    component: () => import('../views/admin/Students.vue')
                },
                {
                    path: 'logs',
                    name: 'admin-logs',
                    component: () => import('../views/admin/LoggedInRecords.vue')
                },
                {
                    path: 'attendance',
                    name: 'admin-attendance',
                    component: () => import('../views/admin/Attendance.vue')
                },
                {
                    path: 'create-account',
                    name: 'admin-create-account',
                    component: () => import('../views/admin/AdminCreateAccount.vue')
                },
                // Redirect /admin/users to /admin/students (backwards compatibility)
                {
                    path: 'users',
                    redirect: '/admin/students'
                },
            ]
        },
    ]
})

export default router
