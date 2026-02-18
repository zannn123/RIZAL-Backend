<script setup>
import { ref, computed, onMounted } from 'vue';
import { Search, Activity, Monitor, Smartphone, Clock } from 'lucide-vue-next';
// ⬇️ MOCK DATA: imported from API service
// 🔴 BACKEND: see src/services/api.js → getLoginRecords()
import { getLoginRecords } from '../../services/api.js';

const searchQuery = ref('');
const filterRole = ref('All');
const isLoading = ref(true);

// ⬇️ MOCK DATA: loaded from API service on mount
// 🔴 BACKEND: will be populated by GET /api/logs
const records = ref([]);

onMounted(async () => {
  try {
    // 🔴 BACKEND: Replace getLoginRecords() body in services/api.js with fetch('/api/logs')
    records.value = await getLoginRecords();
  } catch (err) {
    console.error('Failed to load login records:', err);
  } finally {
    isLoading.value = false;
  }
});

const activeSessions = computed(() => records.value.filter(r => r.status === 'Active').length);
const todayLogins = computed(() => records.value.filter(r => r.loginTime.includes('2026-02-18')).length);

const filteredRecords = computed(() => {
  return records.value.filter(r => {
    const matchSearch = r.user.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchRole = filterRole.value === 'All' || r.role === filterRole.value;
    return matchSearch && matchRole;
  });
});
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Login Records</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400">Monitor site traffic and user sessions</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="stat-card">
        <div class="stat-icon bg-gradient-to-br from-emerald-500 to-teal-400">
          <Activity class="w-5 h-5 text-white" />
        </div>
        <div>
          <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Active Sessions</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ activeSessions }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon bg-gradient-to-br from-blue-500 to-cyan-400">
          <Clock class="w-5 h-5 text-white" />
        </div>
        <div>
          <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Today's Logins</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ todayLogins }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon bg-gradient-to-br from-purple-500 to-violet-400">
          <Monitor class="w-5 h-5 text-white" />
        </div>
        <div>
          <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Records</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ records.length }}</p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="glass-card p-4 flex flex-col md:flex-row gap-3">
      <div class="relative flex-1">
        <Search class="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input v-model="searchQuery" type="text" placeholder="Search user..." class="form-input pl-10" />
      </div>
      <select v-model="filterRole" class="form-input w-full md:w-36">
        <option value="All">All Roles</option>
        <option value="Student">Student</option>
        <option value="SG">SG</option>
        <option value="Admin">Admin</option>
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
              <th>User</th>
              <th>Role</th>
              <th>Device</th>
              <th>Browser</th>
              <th>IP Address</th>
              <th>Login Time</th>
              <th>Session</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rec in filteredRecords" :key="rec.id">
              <td>
                <div class="font-medium text-gray-900 dark:text-white text-sm">{{ rec.user }}</div>
                <div class="text-xs text-gray-500">{{ rec.email }}</div>
              </td>
              <td><span :class="['badge', rec.role === 'Admin' ? 'badge-red' : rec.role === 'SG' ? 'badge-blue' : 'badge-gray']">{{ rec.role }}</span></td>
              <td>
                <div class="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                  <Monitor v-if="rec.device === 'Desktop'" class="w-4 h-4" />
                  <Smartphone v-else class="w-4 h-4" />
                  {{ rec.device }}
                </div>
              </td>
              <td class="text-sm text-gray-600 dark:text-gray-400">{{ rec.browser }}</td>
              <td class="font-mono text-xs text-gray-500">{{ rec.ip }}</td>
              <td class="text-sm text-gray-600 dark:text-gray-400">{{ rec.loginTime }}</td>
              <td>
                <span :class="['badge', rec.status === 'Active' ? 'badge-green' : 'badge-gray']">
                  <span v-if="rec.status === 'Active'" class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  {{ rec.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
