<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  Users, Calendar, Building2, TrendingUp,
  Clock, UserCheck, ChevronLeft, ChevronRight, MapPin
} from 'lucide-vue-next';
// ⬇️ MOCK DATA: imported from API service (swap to real API later)
// 🔴 BACKEND: see src/services/api.js → getDashboardData()
import { getDashboardData } from '../../services/api.js';

const stats = ref([]);
const chartData = ref([]);
const maxChart = ref(100);
const recentActivity = ref([]);
const upcomingEvents = ref([]);
const allEvents = ref([]);
const isLoading = ref(true);

// Icon & color mapping for stat cards
const statConfig = [
  { key: 'totalStudents', label: 'Total Students', icon: Users, color: 'from-blue-500 to-cyan-400' },
  { key: 'activeEvents', label: 'Active Events', icon: Calendar, color: 'from-emerald-500 to-teal-400' },
  { key: 'totalColleges', label: 'Colleges', icon: Building2, color: 'from-purple-500 to-violet-400' },
  { key: 'attendanceRate', label: 'Attendance Rate', icon: TrendingUp, color: 'from-amber-500 to-orange-400', suffix: '%' },
];

// Activity icon mapping
const activityIcons = { checkin: UserCheck, approval: Users, registration: Calendar, account: Users };

// ===== CALENDAR LOGIC =====
const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());
const selectedDate = ref(null);

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const calendarDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1).getDay();
  const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear.value, currentMonth.value, 0).getDate();

  const days = [];

  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: daysInPrevMonth - i, current: false, date: null });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayEvents = allEvents.value.filter(e => e.date === dateStr);
    const isToday = d === today.getDate() && currentMonth.value === today.getMonth() && currentYear.value === today.getFullYear();
    days.push({ day: d, current: true, date: dateStr, events: dayEvents, isToday });
  }

  // Next month leading days (fill to 42 = 6 rows)
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({ day: i, current: false, date: null });
  }

  return days;
});

const selectedDayEvents = computed(() => {
  if (!selectedDate.value) return [];
  return allEvents.value.filter(e => e.date === selectedDate.value);
});

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

const selectDay = (day) => {
  if (day.current && day.date) {
    selectedDate.value = selectedDate.value === day.date ? null : day.date;
  }
};

// ===== LOAD DATA ON MOUNT =====
onMounted(async () => {
  try {
    // 🔴 BACKEND: This call fetches from mock/db.js right now.
    //    When your API is ready, just update getDashboardData() in services/api.js
    //    to fetch from GET /api/dashboard — no changes needed here!
    const data = await getDashboardData();

    // Map stats to display format
    stats.value = statConfig.map(cfg => ({
      label: cfg.label,
      value: (cfg.suffix ? data.stats[cfg.key] + cfg.suffix : data.stats[cfg.key].toLocaleString()),
      icon: cfg.icon,
      color: cfg.color,
    }));

    // Chart data
    chartData.value = data.weeklyAttendance;
    maxChart.value = Math.max(...data.weeklyAttendance.map(d => d.value));

    // Recent activity
    recentActivity.value = data.recentActivity.map(a => ({
      ...a,
      icon: activityIcons[a.type] || Users
    }));

    // Events
    upcomingEvents.value = data.upcomingEvents;
    allEvents.value = data.allEvents || data.upcomingEvents;
  } catch (err) {
    console.error('Dashboard load error:', err);
  } finally {
    isLoading.value = false;
  }
});

// Event color by status
const eventDotColor = (status) => {
  switch(status) {
    case 'Upcoming': return 'bg-blue-500';
    case 'Planning': return 'bg-amber-500';
    case 'Completed': return 'bg-emerald-500';
    default: return 'bg-gray-400';
  }
};
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header -->
    <div>
      <p class="text-sm text-gray-500 dark:text-gray-400">Welcome back, Admin 👋</p>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="w-8 h-8 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin"></div>
    </div>

    <template v-else>
      <!-- Stat Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div v-for="stat in stats" :key="stat.label" class="stat-card">
          <div :class="['stat-icon bg-gradient-to-br', stat.color]">
            <component :is="stat.icon" class="w-5 h-5 text-white" />
          </div>
          <div class="min-w-0">
            <p class="text-xs text-gray-500 dark:text-gray-400 font-medium">{{ stat.label }}</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white mt-0.5">{{ stat.value }}</p>
          </div>
        </div>
      </div>

      <!-- Charts + Activity Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Weekly Attendance Chart — Improved -->
        <div class="lg:col-span-2 glass-card p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="font-semibold text-gray-900 dark:text-white">Weekly Attendance</h3>
            <span class="text-xs text-gray-400 font-medium bg-gray-100 dark:bg-white/[0.06] px-2.5 py-1 rounded-full">This Week</span>
          </div>
          <div class="flex items-end gap-3 h-48">
            <div v-for="(bar, i) in chartData" :key="bar.day" class="flex-1 flex flex-col items-center gap-2 h-full group">
              <span class="text-[0.65rem] font-bold text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">{{ bar.value }}%</span>
              <div class="w-full relative rounded-xl overflow-hidden bg-gray-100 dark:bg-white/[0.06] flex-1">
                <div
                  class="absolute bottom-0 left-0 right-0 rounded-xl transition-all duration-700 ease-out group-hover:brightness-110"
                  :class="bar.value >= 80 ? 'bg-gradient-to-t from-emerald-600 to-emerald-400' : bar.value >= 50 ? 'bg-gradient-to-t from-brand-600 to-brand-400' : 'bg-gradient-to-t from-amber-500 to-amber-300'"
                  :style="{ height: (bar.value / maxChart * 100) + '%', transitionDelay: (i * 80) + 'ms' }"
                ></div>
              </div>
              <span class="text-[0.7rem] text-gray-500 dark:text-gray-400 font-semibold shrink-0">{{ bar.day }}</span>
            </div>
          </div>
          <!-- Legend -->
          <div class="flex items-center justify-center gap-5 mt-4 pt-3 border-t border-gray-100 dark:border-white/[0.06]">
            <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span class="text-[0.65rem] text-gray-400">≥80%</span></div>
            <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-brand-500"></span><span class="text-[0.65rem] text-gray-400">50–79%</span></div>
            <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span class="text-[0.65rem] text-gray-400">&lt;50%</span></div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="glass-card p-6">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div class="space-y-4">
            <div v-for="(item, i) in recentActivity" :key="i" class="flex gap-3">
              <div class="w-8 h-8 rounded-lg bg-brand-500/10 dark:bg-brand-500/20 flex items-center justify-center shrink-0">
                <component :is="item.icon" class="w-4 h-4 text-brand-500" />
              </div>
              <div class="min-w-0">
                <p class="text-sm text-gray-800 dark:text-gray-200 font-medium leading-tight">{{ item.user }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ item.action }}</p>
                <p class="text-[0.6rem] text-gray-400 mt-0.5 flex items-center gap-1">
                  <Clock class="w-3 h-3" />{{ item.time }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Calendar Widget + Upcoming Events Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Mini Calendar Widget (compact square) -->
        <div class="glass-card p-4">
          <!-- Header -->
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Calendar</h3>
            <div class="flex items-center gap-1">
              <button @click="prevMonth" class="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-white/[0.06] text-gray-400 transition-colors">
                <ChevronLeft class="w-3.5 h-3.5" />
              </button>
              <span class="text-[0.7rem] font-semibold text-gray-600 dark:text-gray-300 min-w-[90px] text-center">
                {{ monthNames[currentMonth].slice(0,3) }} {{ currentYear }}
              </span>
              <button @click="nextMonth" class="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-white/[0.06] text-gray-400 transition-colors">
                <ChevronRight class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <!-- Day headers -->
          <div class="grid grid-cols-7 mb-0.5">
            <div v-for="d in dayNames" :key="d" class="text-center text-[0.55rem] font-semibold text-gray-400 dark:text-gray-500 py-0.5">
              {{ d.charAt(0) }}
            </div>
          </div>

          <!-- Calendar grid — compact -->
          <div class="grid grid-cols-7 gap-[2px]">
            <button
              v-for="(day, idx) in calendarDays" :key="idx"
              @click="selectDay(day)"
              :class="[
                'relative w-full aspect-square flex flex-col items-center justify-center rounded-lg text-[0.65rem] transition-all duration-150',
                day.current
                  ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-white/[0.08]'
                  : 'text-gray-300 dark:text-gray-600 cursor-default',
                day.isToday && selectedDate !== day.date
                  ? 'bg-brand-500/15 dark:bg-[#304ffe]/25 text-brand-600 dark:text-[#8c9eff] font-bold ring-1 ring-brand-500/40 dark:ring-[#304ffe]/40'
                  : '',
                selectedDate === day.date
                  ? 'bg-brand-500 dark:bg-[#304ffe] text-white font-bold shadow-md shadow-brand-500/30 dark:shadow-[#304ffe]/30'
                  : day.current ? 'text-gray-600 dark:text-gray-300 font-medium' : ''
              ]"
            >
              {{ day.day }}
              <!-- Event dot -->
              <div v-if="day.events && day.events.length" class="absolute bottom-0.5 flex gap-[2px]">
                <span
                  v-for="(ev, ei) in day.events.slice(0, 2)" :key="ei"
                  :class="['w-[3px] h-[3px] rounded-full', selectedDate === day.date ? 'bg-white/80' : eventDotColor(ev.status)]"
                ></span>
              </div>
            </button>
          </div>

          <!-- Selected day event preview -->
          <div v-if="selectedDate" class="mt-3 pt-3 border-t border-gray-100 dark:border-white/[0.06]">
            <div v-if="selectedDayEvents.length" class="space-y-1.5">
              <div v-for="ev in selectedDayEvents" :key="ev.id"
                class="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-white/[0.04]">
                <span :class="['w-1.5 h-5 rounded-full shrink-0', eventDotColor(ev.status)]"></span>
                <div class="min-w-0 flex-1">
                  <p class="text-[0.7rem] font-semibold text-gray-800 dark:text-gray-200 truncate">{{ ev.name }}</p>
                  <p class="text-[0.6rem] text-gray-400 truncate">{{ ev.location }}</p>
                </div>
              </div>
            </div>
            <p v-else class="text-[0.65rem] text-gray-400 text-center py-1">No events</p>
          </div>
        </div>

        <!-- Upcoming Events (takes 2 columns) -->
        <div class="lg:col-span-2 glass-card p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-gray-900 dark:text-white">Upcoming Events</h3>
            <router-link to="/admin/events" class="text-xs text-brand-500 hover:text-brand-600 font-semibold">View All →</router-link>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div v-for="event in upcomingEvents" :key="event.name"
              class="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06] hover:border-brand-500/30 dark:hover:border-[#304ffe]/30 transition-colors">
              <div class="flex items-start justify-between gap-2 mb-2.5">
                <p class="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-tight">{{ event.name }}</p>
                <span :class="['badge text-[0.6rem] shrink-0', event.status === 'Upcoming' ? 'badge-blue' : 'badge-amber']">{{ event.status }}</span>
              </div>
              <div class="space-y-1 text-[0.7rem] text-gray-500 dark:text-gray-400">
                <p class="flex items-center gap-1.5"><Calendar class="w-3 h-3 shrink-0" /> {{ event.date }}</p>
                <p class="flex items-center gap-1.5"><MapPin class="w-3 h-3 shrink-0" /> {{ event.location }}</p>
              </div>
            </div>
            <div v-if="!upcomingEvents.length" class="col-span-2 text-center py-8 text-gray-400 text-sm">
              No upcoming events
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
