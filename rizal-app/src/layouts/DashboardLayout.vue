<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTheme } from '../composables/useTheme';
import {
  LayoutDashboard,
  Users,
  ScanLine,
  LogOut,
  Menu,
  X,
  UserCircle,
  Sun,
  Moon,
  Bell,
  Search,
  Calendar,
  Building2,
  ClipboardList,
  Activity,
  UserPlus,
  ChevronDown
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const { isDark, toggleTheme } = useTheme();
const isSidebarOpen = ref(false);
const isProfileOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Mock Role - In real app, get from store/auth
const userRole = computed(() => {
  if (route.path.includes('/admin')) return 'Admin';
  if (route.path.includes('/sg')) return 'SG';
  return 'Student';
});

const menuItems = computed(() => {
  if (userRole.value === 'Admin') {
    return [
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Profile', path: '/admin/profile', icon: UserCircle },
      { name: 'Events', path: '/admin/events', icon: Calendar },
      { name: 'Colleges', path: '/admin/colleges', icon: Building2 },
      { name: 'Students', path: '/admin/students', icon: Users },
      { name: 'Login Records', path: '/admin/logs', icon: Activity },
      { name: 'Attendance', path: '/admin/attendance', icon: ClipboardList },
      { name: 'Create Account', path: '/admin/create-account', icon: UserPlus },
    ];
  } else if (userRole.value === 'SG') {
    return [
      { name: 'Account Approvals', path: '/sg/approvals', icon: ScanLine },
      { name: 'Registered Lists', path: '/sg/list', icon: Users },
    ];
  } else {
    return [
      { name: 'My Profile', path: '/student/profile', icon: UserCircle },
      { name: 'ID Status', path: '/student/pending', icon: ScanLine },
    ];
  }
});

const handleLogout = () => {
  // Clear all auth data from both storages
  localStorage.removeItem('auth_token');
  localStorage.removeItem('current_user');
  localStorage.removeItem('auth_storage');
  sessionStorage.removeItem('auth_token');
  sessionStorage.removeItem('current_user');
  router.push('/');
};

const isActive = (path) => route.path === path;
</script>

<template>
  <!-- h-screen + overflow-hidden = sidebar stays fixed, only <main> scrolls -->
  <div class="h-screen overflow-hidden gradient-bg font-poppins flex transition-colors duration-300">

    <!-- Mobile Backdrop -->
    <Transition name="fade">
      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
        @click="toggleSidebar"
      ></div>
    </Transition>

    <!-- ===== SIDEBAR ===== -->
    <aside
      :class="[
        'fixed lg:relative top-0 inset-y-0 left-0 z-50 w-[260px] h-screen glass-sidebar flex flex-col transform transition-all duration-300 ease-in-out shrink-0',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <!-- Logo -->
      <div class="h-16 flex items-center px-5 shrink-0 border-b border-gray-200 dark:border-white/[0.06]">
        <img src="../assets/icon.png" alt="RIZAL" class="w-8 h-8 rounded-lg mr-2.5 object-cover" />
        <span class="text-lg font-bold text-gray-800 dark:text-white tracking-wider">
          R.I.Z.A.L.
        </span>
        <button @click="toggleSidebar" class="ml-auto lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Nav Section -->
      <div class="px-3 mt-4 flex-1 overflow-y-auto">
        <p class="text-[0.65rem] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-semibold px-3 mb-2">
          {{ userRole }} Menu
        </p>
        <nav class="space-y-1">
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            @click="isSidebarOpen = false"
            :class="[
              'flex items-center gap-3 px-3 py-2.5 text-[0.82rem] font-medium rounded-xl transition-all duration-200',
              isActive(item.path)
                ? 'bg-brand-500/10 dark:bg-[#304ffe]/20 text-brand-600 dark:text-[#8c9eff] border border-brand-500/20 dark:border-[#304ffe]/30'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.05] hover:text-gray-900 dark:hover:text-white'
            ]"
          >
            <div
              :class="[
                'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                isActive(item.path)
                  ? 'bg-gradient-to-br from-brand-600 dark:from-[#1a237e] to-brand-500 dark:to-[#304ffe] text-white shadow-md shadow-brand-500/30 dark:shadow-[#304ffe]/30'
                  : 'bg-gray-100 dark:bg-white/[0.06] text-gray-500 dark:text-gray-400'
              ]"
            >
              <component :is="item.icon" class="w-4 h-4" />
            </div>
            {{ item.name }}
          </router-link>
        </nav>
      </div>

      <!-- Sidebar Footer -->
      <div class="p-3 mt-auto shrink-0 border-t border-gray-200 dark:border-white/[0.06]">
        <button
          @click="handleLogout"
          class="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-500 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          <div class="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
            <LogOut class="w-4 h-4" />
          </div>
          Sign Out
        </button>
      </div>
    </aside>

    <!-- ===== MAIN AREA ===== -->
    <div class="flex-1 flex flex-col min-w-0 relative z-[1]">

      <!-- ===== TOP BAR ===== -->
      <header class="h-16 glass-topbar sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6 shrink-0">
        <!-- Left: Hamburger + Search -->
        <div class="flex items-center gap-3">
          <button
            @click="toggleSidebar"
            class="lg:hidden p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.06] hover:text-gray-800 dark:hover:text-white"
          >
            <Menu class="w-5 h-5" />
          </button>

          <div class="hidden md:flex items-center bg-gray-100/80 dark:bg-white/[0.06] rounded-xl border border-gray-200/50 dark:border-white/[0.08] px-3 py-2 w-72 focus-within:border-brand-500/40 dark:focus-within:border-[#304ffe]/40 transition-colors">
            <Search class="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search anything..."
              class="bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 w-full"
            />
          </div>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center gap-2">
          <!-- Dark Mode Toggle -->
          <button
            @click="toggleTheme"
            class="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/[0.06] text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
            :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          >
            <Moon v-if="!isDark" class="w-5 h-5" />
            <Sun v-else class="w-5 h-5 text-amber-400" />
          </button>

          <!-- Notifications -->
          <button class="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/[0.06] text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white relative transition-colors">
            <Bell class="w-5 h-5" />
            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 dark:bg-[#ffc107] rounded-full ring-2 ring-white dark:ring-[#0a1230]"></span>
          </button>

          <!-- Profile -->
          <div class="relative ml-1">
            <button
              @click="isProfileOpen = !isProfileOpen"
              class="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors"
            >
              <div class="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-600 dark:from-[#1a237e] to-brand-500 dark:to-[#304ffe] flex items-center justify-center text-white font-bold text-xs shadow-md">
                {{ userRole[0] }}
              </div>
              <div class="hidden sm:block text-left">
                <p class="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-tight">{{ userRole }} User</p>
                <p class="text-[0.65rem] text-gray-500 dark:text-gray-400">admin@rizal.edu</p>
              </div>
              <ChevronDown class="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 hidden sm:block" />
            </button>
          </div>
        </div>
      </header>

      <!-- ===== PAGE CONTENT ===== -->
      <main class="flex-1 overflow-y-auto p-4 lg:p-6">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Page transition */
.page-enter-active {
  transition: all 0.25s ease-out;
}
.page-leave-active {
  transition: all 0.15s ease-in;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Backdrop transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
