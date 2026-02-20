<script setup>
import { ref, computed, onMounted } from 'vue';
import { Calendar, MapPin, Clock, Plus, Search, Edit3, Trash2, Eye, Building2, Users, ChevronRight, ArrowLeft } from 'lucide-vue-next';
// ⬇️ MOCK DATA: imported from API service
// 🔴 BACKEND: see src/services/api.js → getEvents(), createEvent(), getColleges()
import { getEvents, createEvent as apiCreateEvent, getColleges } from '../../services/api.js';

const searchQuery = ref('');
const filterStatus = ref('All');
const showCreateModal = ref(false);
const isLoading = ref(true);

// ⬇️ MOCK DATA: loaded from API service on mount
// 🔴 BACKEND: this will be populated by GET /api/events and GET /api/colleges
const events = ref([]);
const colleges = ref([]);

// Two-step view: null = show colleges, object = show events for that college
const selectedCollege = ref(null);

const newEvent = ref({ name: '', date: '', time: '', location: '', status: 'Planning' });

onMounted(async () => {
  try {
    // 🔴 BACKEND: Replace with fetch('/api/events') and fetch('/api/colleges')
    const [eventsData, collegesData] = await Promise.all([
      getEvents(),
      getColleges()
    ]);
    events.value = eventsData;
    colleges.value = collegesData;
  } catch (err) {
    console.error('Failed to load data:', err);
  } finally {
    isLoading.value = false;
  }
});

// Count events per college
const getCollegeEventCount = (collegeName) => {
  return events.value.filter(e => e.college === collegeName).length;
};

// Get upcoming events count per college
const getCollegeUpcomingCount = (collegeName) => {
  return events.value.filter(e => e.college === collegeName && e.status === 'Upcoming').length;
};

// Select a college to view its events
const selectCollege = (college) => {
  selectedCollege.value = college;
  searchQuery.value = '';
  filterStatus.value = 'All';
};

// Go back to college list
const goBack = () => {
  selectedCollege.value = null;
  searchQuery.value = '';
  filterStatus.value = 'All';
};

// Filtered events for the selected college
const filteredEvents = computed(() => {
  if (!selectedCollege.value) return [];
  return events.value.filter(e => {
    const matchCollege = e.college === selectedCollege.value.name;
    const matchSearch = e.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchStatus = filterStatus.value === 'All' || e.status === filterStatus.value;
    return matchCollege && matchSearch && matchStatus;
  });
});

const getStatusBadge = (status) => {
  switch (status) {
    case 'Upcoming': return 'badge-blue';
    case 'Completed': return 'badge-green';
    case 'Planning': return 'badge-amber';
    case 'Cancelled': return 'badge-red';
    default: return 'badge-gray';
  }
};

const createEvent = async () => {
  try {
    // 🔴 BACKEND: Replace apiCreateEvent() body in services/api.js with POST /api/events
    const eventData = {
      ...newEvent.value,
      college: selectedCollege.value ? selectedCollege.value.name : null
    };
    const created = await apiCreateEvent(eventData);
    events.value.unshift(created);
    newEvent.value = { name: '', date: '', time: '', location: '', status: 'Planning' };
    showCreateModal.value = false;
  } catch (err) {
    console.error('Failed to create event:', err);
  }
};
</script>

<template>
  <div class="space-y-6 animate-fade-in">

    <!-- ===== VIEW 1: COLLEGE SELECTION ===== -->
    <template v-if="!selectedCollege">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Events</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">Select a college to view its events</p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex justify-center py-16">
        <div class="w-8 h-8 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin"></div>
      </div>

      <!-- College Cards Grid -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          v-for="college in colleges"
          :key="college.name"
          @click="selectCollege(college)"
          class="glass-card overflow-hidden cursor-pointer group hover:ring-2 hover:ring-brand-500/40 transition-all duration-300"
        >
          <div class="p-6">
            <div class="flex items-start gap-4">
              <div :class="['stat-icon bg-gradient-to-br shrink-0', college.color]">
                <Building2 class="w-5 h-5 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <h3 class="font-bold text-gray-900 dark:text-white text-sm group-hover:text-brand-400 transition-colors">{{ college.name }}</h3>
                  <ChevronRight class="w-4 h-4 text-gray-400 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ college.dean }}</p>
                <div class="flex items-center gap-4 mt-3">
                  <div class="flex items-center gap-1.5">
                    <Users class="w-3.5 h-3.5 text-gray-400" />
                    <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ college.students }}</span>
                    <span class="text-xs text-gray-400">students</span>
                  </div>
                  <span class="text-xs text-gray-300 dark:text-gray-600">|</span>
                  <div class="flex items-center gap-1.5">
                    <Calendar class="w-3.5 h-3.5 text-gray-400" />
                    <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ getCollegeEventCount(college.name) }}</span>
                    <span class="text-xs text-gray-400">events</span>
                  </div>
                  <span class="text-xs text-gray-300 dark:text-gray-600">|</span>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    SG: <span class="font-semibold text-gray-700 dark:text-gray-300">{{ college.sgOfficer }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- ===== VIEW 2: EVENTS FOR SELECTED COLLEGE ===== -->
    <template v-else>
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <button @click="goBack"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ selectedCollege.name }}</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ selectedCollege.dean }} · {{ selectedCollege.students }} students · SG: {{ selectedCollege.sgOfficer }}
            </p>
          </div>
        </div>
        <button @click="showCreateModal = true" class="btn-primary flex items-center gap-2">
          <Plus class="w-4 h-4" /> Create Event
        </button>
      </div>

      <!-- Filters -->
      <div class="glass-card p-4 flex flex-col md:flex-row gap-3">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input v-model="searchQuery" type="text" placeholder="Search events..." class="form-input pl-10" />
        </div>
        <select v-model="filterStatus" class="form-input w-full md:w-44">
          <option value="All">All Status</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Planning">Planning</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <!-- Events Table -->
      <div class="glass-card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Date & Time</th>
                <th>Location</th>
                <th>Attendees</th>
                <th>Status</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="event in filteredEvents" :key="event.id">
                <td>
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-lg bg-brand-500/10 dark:bg-brand-500/20 flex items-center justify-center shrink-0">
                      <Calendar class="w-4 h-4 text-brand-500" />
                    </div>
                    <span class="font-medium text-gray-900 dark:text-white">{{ event.name }}</span>
                  </div>
                </td>
                <td>
                  <div class="text-gray-700 dark:text-gray-300 text-sm">{{ event.date }}</div>
                  <div class="text-xs text-gray-400 flex items-center gap-1"><Clock class="w-3 h-3" />{{ event.time }}</div>
                </td>
                <td>
                  <div class="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-sm">
                    <MapPin class="w-3.5 h-3.5 shrink-0" /> {{ event.location }}
                  </div>
                </td>
                <td class="text-gray-700 dark:text-gray-300 font-medium">{{ event.attendees.toLocaleString() }}</td>
                <td><span :class="['badge', getStatusBadge(event.status)]">{{ event.status }}</span></td>
                <td class="text-right">
                  <div class="flex items-center justify-end gap-1">
                    <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] text-gray-500 dark:text-gray-400 transition"><Eye class="w-4 h-4" /></button>
                    <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] text-gray-500 dark:text-gray-400 transition"><Edit3 class="w-4 h-4" /></button>
                    <button class="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-500 dark:text-gray-400 hover:text-red-500 transition"><Trash2 class="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredEvents.length === 0">
                <td colspan="6" class="text-center py-8 text-gray-400">No events found for this college.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- Create Event Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" @click.self="showCreateModal = false">
          <div class="glass-card w-full max-w-lg p-8 space-y-5 animate-fade-in">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Create New Event</h2>
            <p v-if="selectedCollege" class="text-sm text-gray-500 dark:text-gray-400 -mt-3">
              For: <span class="font-semibold text-gray-700 dark:text-gray-300">{{ selectedCollege.name }}</span>
            </p>
            <div>
              <label class="form-label">Event Name</label>
              <input v-model="newEvent.name" class="form-input" placeholder="e.g. Engineering Summit" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="form-label">Date</label>
                <input v-model="newEvent.date" type="date" class="form-input" />
              </div>
              <div>
                <label class="form-label">Time</label>
                <input v-model="newEvent.time" type="time" class="form-input" />
              </div>
            </div>
            <div>
              <label class="form-label">Location</label>
              <input v-model="newEvent.location" class="form-input" placeholder="e.g. Main Auditorium" />
            </div>
            <div class="flex gap-3 pt-2">
              <button @click="showCreateModal = false" class="btn-ghost flex-1">Cancel</button>
              <button @click="createEvent" class="btn-primary flex-1">Create Event</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
