<script setup>
import { ref, computed } from 'vue';
import { Search, MoreVertical, Shield, UserX, Trash2 } from 'lucide-vue-next';

const users = ref([
  { id: '2023-0001', name: 'Jose Rizal', email: 'jose@rizal.edu', college: 'Engineering', status: 'Active', role: 'Student' },
  { id: '2023-0002', name: 'Maria Clara', email: 'maria@rizal.edu', college: 'Arts & Sciences', status: 'Pending', role: 'Student' },
  { id: 'ADMIN-01', name: 'Admin User', email: 'admin@rizal.edu', college: 'Any', status: 'Active', role: 'Admin' },
  { id: 'SG-01', name: 'SG Officer', email: 'sg@rizal.edu', college: 'Any', status: 'Active', role: 'SG' },
]);

const searchQuery = ref('');
const filterStatus = ref('All');

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          user.id.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus = filterStatus.value === 'All' || user.status === filterStatus.value;
    return matchesSearch && matchesStatus;
  });
});

const getStatusColor = (status) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-700';
    case 'Pending': return 'bg-amber-100 text-amber-700';
    case 'Inactive': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
        <p class="text-sm text-gray-500">Manage system access and student records</p>
      </div>
      <button class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium transition-colors">
        Export Data
      </button>
    </div>

    <!-- Filters & Search -->
    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
      <div class="relative flex-1">
        <Search class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search items..." 
          class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
      </div>
      <select 
        v-model="filterStatus"
        class="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      >
        <option value="All">All Status</option>
        <option value="Active">Active</option>
        <option value="Pending">Pending</option>
        <option value="Inactive">Inactive</option>
      </select>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
            <tr>
              <th class="px-6 py-4">Name / Email</th>
              <th class="px-6 py-4">ID Number</th>
              <th class="px-6 py-4">Department</th>
              <th class="px-6 py-4">Role</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="font-medium text-gray-900">{{ user.name }}</div>
                <div class="text-gray-500 text-xs">{{ user.email }}</div>
              </td>
              <td class="px-6 py-4 font-mono text-gray-600">{{ user.id }}</td>
              <td class="px-6 py-4 text-gray-600">{{ user.college }}</td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-semibold">
                  <Shield v-if="user.role === 'Admin'" class="w-3 h-3" />
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span :class="['px-2.5 py-0.5 rounded-full text-xs font-medium', getStatusColor(user.status)]">
                  {{ user.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button class="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition">
                    <MoreVertical class="w-4 h-4" />
                  </button>
                  <button class="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
                <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                    No users found matching your criteria.
                </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
