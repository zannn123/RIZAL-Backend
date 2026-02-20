<script setup>
import { ref, computed, onMounted } from 'vue';
import { Search, ClipboardList, Download, Calendar } from 'lucide-vue-next';
// ⬇️ MOCK DATA: imported from API service
// 🔴 BACKEND: see src/services/api.js → getAttendanceRecords()
import { getAttendanceRecords } from '../../services/api.js';

const searchQuery = ref('');
const filterEvent = ref('All');
const filterStatus = ref('All');
const isLoading = ref(true);

// ⬇️ MOCK DATA: loaded from API service on mount
// 🔴 BACKEND: will be populated by GET /api/attendance
const attendanceRecords = ref([]);

onMounted(async () => {
  try {
    // 🔴 BACKEND: Replace getAttendanceRecords() body in services/api.js with fetch('/api/attendance')
    attendanceRecords.value = await getAttendanceRecords();
  } catch (err) {
    console.error('Failed to load attendance:', err);
  } finally {
    isLoading.value = false;
  }
});

// Get unique event names for filter dropdown
const events = computed(() => [...new Set(attendanceRecords.value.map(r => r.event))]);

const filteredRecords = computed(() => {
  return attendanceRecords.value.filter(r => {
    const matchSearch = r.student.toLowerCase().includes(searchQuery.value.toLowerCase()) || r.studentId.includes(searchQuery.value);
    const matchEvent = filterEvent.value === 'All' || r.event === filterEvent.value;
    const matchStatus = filterStatus.value === 'All' || r.status === filterStatus.value;
    return matchSearch && matchEvent && matchStatus;
  });
});

const presentCount = computed(() => attendanceRecords.value.filter(r => r.status === 'Present').length);
const lateCount = computed(() => attendanceRecords.value.filter(r => r.status === 'Late').length);
const absentCount = computed(() => attendanceRecords.value.filter(r => r.status === 'Absent').length);

const getStatusBadge = (status) => {
  switch (status) {
    case 'Present': return 'badge-green';
    case 'Late': return 'badge-amber';
    case 'Absent': return 'badge-red';
    default: return 'badge-gray';
  }
};
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Attendance</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">Track and manage event attendance records</p>
      </div>
      <button class="btn-primary flex items-center gap-2">
        <Download class="w-4 h-4" /> Export CSV
      </button>
    </div>

    <!-- Summary Stats -->
    <div class="grid grid-cols-3 gap-4">
      <div class="stat-card">
        <div class="stat-icon bg-gradient-to-br from-emerald-500 to-teal-400">
          <ClipboardList class="w-5 h-5 text-white" />
        </div>
        <div>
          <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Present</p>
          <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ presentCount }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon bg-gradient-to-br from-amber-500 to-orange-400">
          <ClipboardList class="w-5 h-5 text-white" />
        </div>
        <div>
          <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Late</p>
          <p class="text-2xl font-bold text-amber-600 dark:text-amber-400">{{ lateCount }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon bg-gradient-to-br from-red-500 to-rose-400">
          <ClipboardList class="w-5 h-5 text-white" />
        </div>
        <div>
          <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Absent</p>
          <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ absentCount }}</p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="glass-card p-4 flex flex-col md:flex-row gap-3">
      <div class="relative flex-1">
        <Search class="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input v-model="searchQuery" type="text" placeholder="Search student or ID..." class="form-input pl-10" />
      </div>
      <select v-model="filterEvent" class="form-input w-full md:w-56">
        <option value="All">All Events</option>
        <option v-for="e in events" :key="e" :value="e">{{ e }}</option>
      </select>
      <select v-model="filterStatus" class="form-input w-full md:w-36">
        <option value="All">All Status</option>
        <option value="Present">Present</option>
        <option value="Late">Late</option>
        <option value="Absent">Absent</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center py-16">
      <div class="w-8 h-8 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin"></div>
    </div>

    <!-- Table -->
    <div v-else class="glass-card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Student ID</th>
              <th>Event</th>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rec in filteredRecords" :key="rec.id">
              <td class="font-medium text-gray-900 dark:text-white">{{ rec.student }}</td>
              <td class="font-mono text-xs text-gray-500">{{ rec.studentId }}</td>
              <td>
                <div class="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar class="w-3.5 h-3.5 shrink-0" /> {{ rec.event }}
                </div>
              </td>
              <td class="text-sm text-gray-600 dark:text-gray-400">{{ rec.date }}</td>
              <td class="text-sm text-gray-600 dark:text-gray-400">{{ rec.checkIn }}</td>
              <td class="text-sm text-gray-600 dark:text-gray-400">{{ rec.checkOut }}</td>
              <td><span :class="['badge', getStatusBadge(rec.status)]">{{ rec.status }}</span></td>
            </tr>
            <tr v-if="filteredRecords.length === 0">
              <td colspan="7" class="text-center py-8 text-gray-400">No attendance records found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
