<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTheme } from '../composables/useTheme';
import { getCurrentUser } from '../services/api.js';
import * as mockDb from '../mock/db.js';
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
  ClipboardCheck,
  Activity,
  UserPlus,
  ChevronDown
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const { isDark, toggleTheme } = useTheme();
const isSidebarOpen = ref(false);
const isProfileOpen = ref(false);

// Get actual logged-in user info for the header
const loggedInUser = getCurrentUser();

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Mock Role - In real app, get from store/auth
const userRole = computed(() => {
  if (route.path.includes('/admin')) return 'Admin';
  if (route.path.includes('/sg')) return 'SG';
  return 'Student';
});

// Check if student has completed face scan registration
const isStudentRegistered = computed(() => {
  const currentUser = getCurrentUser();
  if (currentUser) {
    const dbUser = mockDb.users.find(u => u.id === currentUser.id);
    return dbUser ? dbUser.faceScanRegistered : false;
  }
  return false;
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
  } else if (isStudentRegistered.value) {
    // Registered student → full dashboard
    return [
      { name: 'My Profile', path: '/student/profile', icon: UserCircle },
      { name: 'Events', path: '/student/events', icon: Calendar },
      { name: 'Attendance', path: '/student/attendance', icon: ClipboardCheck },
      { name: 'Announcements', path: '/student/announcements', icon: Bell },
    ];
  } else {
    // Unregistered student → QR pending only
    return [
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

const isActive = (path) => {
  if (path === '/admin/dashboard' && route.path === '/admin') return true;
  return route.path === path || route.path.startsWith(path + '/');
};
</script>

<template>
  <div class="min-h-[100dvh] gradient-bg font-poppins flex p-4 lg:p-5 transition-colors duration-300 relative">
    
    <!-- Background Image -->
    <img 
      src="../assets/bg.png" 
      alt="Background" 
      class="fixed inset-0 w-full h-full object-cover object-top sm:object-center z-0 pointer-events-none transition-opacity duration-300 opacity-90 dark:opacity-30" 
    />

    <!-- Main glass container wrapping the entire application -->
    <div class="glass-panel w-full max-w-[1800px] mx-auto h-[calc(100dvh-2rem)] lg:h-[calc(100dvh-2.5rem)] flex flex-row relative z-10">

      <!-- Mobile Backdrop -->
      <Transition name="fade">
        <div
          v-if="isSidebarOpen"
          class="absolute inset-0 bg-white/60 dark:bg-black/40 backdrop-blur-md z-40 lg:hidden rounded-[2.5rem]"
          @click="toggleSidebar"
        ></div>
      </Transition>

      <aside
        :class="[
          'absolute lg:relative top-0 inset-y-0 left-0 z-50 w-[260px] h-full glass-sidebar flex flex-col transform transition-transform duration-300 ease-in-out shrink-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        ]"
      >
        <!-- Logo -->
        <div class="h-24 flex items-center px-8 shrink-0">
          <img src="../assets/aura.png" alt="Aura" class="w-10 h-10 rounded-xl mr-3 object-cover shadow-md shadow-brand-500/20" />
          <span class="text-xl font-bold text-gray-900 dark:text-white tracking-widest">
            AURA <span class="text-brand-500 text-2xl leading-none">.</span>
          </span>
          <button @click="toggleSidebar" class="ml-auto lg:hidden text-gray-500 hover:text-gray-900 dark:hover:text-white">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Nav Section -->
        <div class="px-5 mt-2 flex-1 overflow-y-auto custom-scrollbar">
          <p class="text-[0.65rem] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-bold px-3 mb-3">
            {{ userRole }} Menu
          </p>
          <nav class="space-y-1.5">
            <router-link
              v-for="item in menuItems"
              :key="item.path"
              :to="item.path"
              @click="isSidebarOpen = false"
              :class="[
                'flex items-center gap-3.5 px-4 py-3 text-[0.85rem] font-semibold rounded-2xl transition-all duration-300',
                isActive(item.path)
                  ? 'bg-white shadow-md shadow-black/5 dark:bg-[#111836] dark:shadow-black/20 text-brand-600 dark:text-brand-400 scale-[1.02]'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/[0.04] hover:text-gray-900 dark:hover:text-white'
              ]"
            >
              <component :is="item.icon" :class="['w-5 h-5', isActive(item.path) ? 'text-brand-500' : 'opacity-70']" />
              {{ item.name }}
            </router-link>
          </nav>
        </div>

        <!-- Sidebar Footer -->
        <div class="p-5 mt-auto shrink-0 border-t border-gray-200/50 dark:border-white/[0.04]">
          <button
            @click="handleLogout"
            class="flex items-center gap-3 w-full px-4 py-3 text-[0.85rem] font-semibold text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all duration-300"
          >
            <LogOut class="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      <!-- ===== MAIN AREA ===== -->
      <div class="flex-1 flex flex-col min-w-0 relative z-[1]">

        <!-- ===== TOP BAR ===== -->
        <header class="h-24 sticky top-0 z-30 flex items-center justify-between px-6 lg:px-10 shrink-0">
          <!-- Left: Hamburger + Search -->
          <div class="flex items-center gap-4">
            <button
              @click="toggleSidebar"
              class="lg:hidden p-3 rounded-full glass-pill text-gray-700 dark:text-gray-200 hover:text-brand-600 dark:hover:text-brand-400"
            >
              <Menu class="w-5 h-5" />
            </button>

            <!-- Pill-shaped Search -->
            <div class="hidden md:flex items-center glass-pill px-5 py-3 w-80 lg:w-96 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
              <Search class="w-4 h-4 text-gray-400 mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Search resources, users, events..."
                class="bg-transparent outline-none text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 w-full font-medium"
              />
            </div>
          </div>

          <!-- Right: Actions Pill -->
          <div class="glass-pill px-2 py-1.5 flex items-center gap-1 sm:gap-2">
            <!-- Dark Mode Toggle -->
            <button
              @click="toggleTheme"
              class="p-2.5 rounded-full hover:bg-white dark:hover:bg-black/30 text-gray-500 dark:text-gray-400 transition-colors"
              :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
            >
              <Moon v-if="!isDark" class="w-4 h-4" />
              <Sun v-else class="w-4 h-4 text-amber-500" />
            </button>

            <!-- Notifications -->
            <button
              @click="userRole === 'Student' ? router.push('/student/announcements') : null"
              class="p-2.5 rounded-full hover:bg-white dark:hover:bg-black/30 text-gray-500 dark:text-gray-400 relative transition-colors"
            >
              <Bell class="w-4 h-4" />
              <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full border-2 border-white/50 dark:border-transparent"></span>
            </button>
            
            <div class="w-[1px] h-6 bg-gray-200 dark:bg-white/10 mx-1 sm:mx-2"></div>

            <!-- Profile Dropdown Trigger -->
            <div class="relative">
              <button
                @click="isProfileOpen = !isProfileOpen"
                class="flex items-center gap-3 p-1 pr-4 rounded-full hover:bg-white dark:hover:bg-black/30 transition-colors"
              >
                <div class="h-8 w-8 rounded-full bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-brand-500/20">
                  {{ loggedInUser?.name?.charAt(0) || userRole[0] }}
                </div>
                <div class="hidden sm:block text-left">
                  <p class="text-[0.75rem] font-bold text-gray-900 dark:text-gray-100 leading-tight">{{ loggedInUser?.name || (userRole + ' User') }}</p>
                  <p class="text-[0.65rem] font-medium text-gray-500 dark:text-gray-400">{{ userRole }}</p>
                </div>
                <ChevronDown :class="['w-3.5 h-3.5 text-gray-400 transition-transform duration-300', isProfileOpen ? 'rotate-180' : '']" />
              </button>

              <!-- Profile Dropdown -->
              <Transition name="dropdown">
                <div
                  v-if="isProfileOpen"
                  class="absolute right-0 mt-3 w-60 glass-card p-2 overflow-hidden z-50 origin-top-right"
                >
                  <!-- User Info -->
                  <div class="px-4 py-3 border-b border-gray-100 dark:border-white/[0.05]">
                    <p class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ loggedInUser?.name || 'User' }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{{ loggedInUser?.email || 'user@rizal.edu' }}</p>
                  </div>

                  <!-- Menu Items -->
                  <div class="py-2 space-y-1">
                    <router-link
                      v-if="userRole === 'Student'"
                      to="/student/profile"
                      @click="isProfileOpen = false"
                      class="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-white/[0.04] hover:text-brand-600 dark:hover:text-brand-400 rounded-xl transition-colors"
                    >
                      <UserCircle class="w-4 h-4 opacity-70" />
                      My Profile
                    </router-link>
                    <router-link
                      v-if="userRole === 'Admin'"
                      to="/admin/profile"
                      @click="isProfileOpen = false"
                      class="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-white/[0.04] hover:text-brand-600 dark:hover:text-brand-400 rounded-xl transition-colors"
                    >
                      <UserCircle class="w-4 h-4 opacity-70" />
                      My Profile
                    </router-link>
                    <router-link
                      v-if="userRole === 'Student' && isStudentRegistered"
                      to="/student/profile"
                      @click="isProfileOpen = false"
                      class="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-white/[0.04] hover:text-brand-600 dark:hover:text-brand-400 rounded-xl transition-colors"
                    >
                      <ScanLine class="w-4 h-4 opacity-70" />
                      Offline QR Code
                    </router-link>
                  </div>

                  <!-- Sign Out -->
                  <div class="border-t border-gray-100 dark:border-white/[0.05] pt-2 pb-1">
                    <button
                      @click="handleLogout"
                      class="flex items-center gap-3 w-full px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50/50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                      <LogOut class="w-4 h-4 opacity-80" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </Transition>

              <!-- Click outside -->
              <div v-if="isProfileOpen" class="fixed inset-0 z-40" @click="isProfileOpen = false"></div>
            </div>
          </div>
        </header>

        <!-- ===== PAGE CONTENT ===== -->
        <main class="flex-1 overflow-y-auto px-6 lg:px-10 pb-6 lg:pb-10">
          <router-view v-slot="{ Component }">
            <transition name="page" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </main>
      </div>
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

/* Dropdown transition */
.dropdown-enter-active {
  transition: all 0.15s ease-out;
}
.dropdown-leave-active {
  transition: all 0.1s ease-in;
}
.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-4px) scale(0.95);
}
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.95);
}
</style>
