<script setup>
import { ref, onMounted } from 'vue';
import { Building2, Users, ChevronDown, ChevronRight, GraduationCap, Plus, X, Trash2 } from 'lucide-vue-next';
// ⬇️ MOCK DATA: imported from API service
// 🔴 BACKEND: see src/services/api.js → getColleges(), createCollege()
import { getColleges, createCollege as apiCreateCollege } from '../../services/api.js';

const isLoading = ref(true);
const showCreateModal = ref(false);
const isSubmitting = ref(false);

// ⬇️ MOCK DATA: loaded from API service on mount
// 🔴 BACKEND: will be populated by GET /api/colleges
const colleges = ref([]);

const newCollege = ref({
  name: '',
  dean: '',
  sgOfficer: '',
  programs: [''],
});

onMounted(async () => {
  try {
    // 🔴 BACKEND: Replace getColleges() body in services/api.js with fetch('/api/colleges')
    colleges.value = await getColleges();
  } catch (err) {
    console.error('Failed to load colleges:', err);
  } finally {
    isLoading.value = false;
  }
});

const toggleCollege = (index) => {
  colleges.value[index].expanded = !colleges.value[index].expanded;
};

const totalStudents = () => colleges.value.reduce((sum, c) => sum + c.students, 0);

// Programs input management
const addProgram = () => {
  newCollege.value.programs.push('');
};

const removeProgram = (index) => {
  if (newCollege.value.programs.length > 1) {
    newCollege.value.programs.splice(index, 1);
  }
};

// Create college
const handleCreate = async () => {
  if (!newCollege.value.name.trim()) return;
  isSubmitting.value = true;
  try {
    const programs = newCollege.value.programs
      .filter(p => p.trim())
      .map(p => ({ name: p.trim() }));

    // 🔴 BACKEND: Replace apiCreateCollege() body in services/api.js with POST /api/colleges
    const created = await apiCreateCollege({
      name: newCollege.value.name.trim(),
      dean: newCollege.value.dean.trim(),
      sgOfficer: newCollege.value.sgOfficer.trim(),
      programs,
    });
    colleges.value.push(created);
    newCollege.value = { name: '', dean: '', sgOfficer: '', programs: [''] };
    showCreateModal.value = false;
  } catch (err) {
    console.error('Failed to create college:', err);
  } finally {
    isSubmitting.value = false;
  }
};

const openCreateModal = () => {
  newCollege.value = { name: '', dean: '', sgOfficer: '', programs: [''] };
  showCreateModal.value = true;
};
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Colleges</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ colleges.length }} colleges · {{ totalStudents().toLocaleString() }} total students</p>
      </div>
      <button @click="openCreateModal" class="btn-primary flex items-center gap-2">
        <Plus class="w-4 h-4" /> Add College
      </button>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center py-16">
      <div class="w-8 h-8 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin"></div>
    </div>

    <!-- College Cards -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div v-for="(college, i) in colleges" :key="college.name" class="glass-card overflow-hidden">
        <!-- Header -->
        <div class="p-6 cursor-pointer" @click="toggleCollege(i)">
          <div class="flex items-start gap-4">
            <div :class="['stat-icon bg-gradient-to-br shrink-0', college.color]">
              <Building2 class="w-5 h-5 text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <h3 class="font-bold text-gray-900 dark:text-white text-sm">{{ college.name }}</h3>
                <component :is="college.expanded ? ChevronDown : ChevronRight" class="w-4 h-4 text-gray-400 shrink-0" />
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ college.dean }}</p>
              <div class="flex items-center gap-4 mt-3">
                <div class="flex items-center gap-1.5">
                  <Users class="w-3.5 h-3.5 text-gray-400" />
                  <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ college.students }}</span>
                  <span class="text-xs text-gray-400">students</span>
                </div>
                <span class="text-xs text-gray-300 dark:text-gray-600">|</span>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  SG: <span class="font-semibold text-gray-700 dark:text-gray-300">{{ college.sgOfficer }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Expanded Programs -->
        <Transition name="expand">
          <div v-if="college.expanded" class="border-t border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-black/20 px-6 py-4 space-y-2">
            <p class="text-[0.65rem] uppercase tracking-widest text-gray-400 font-semibold mb-2">Programs</p>
            <div v-for="prog in college.programs" :key="prog.name" class="flex items-center justify-between py-2">
              <div class="flex items-center gap-2">
                <GraduationCap class="w-4 h-4 text-gray-400" />
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ prog.name }}</span>
              </div>
              <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">{{ prog.students }} students</span>
            </div>
            <div v-if="!college.programs || college.programs.length === 0" class="text-xs text-gray-400 py-2">
              No programs added yet
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Create College Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" @click.self="showCreateModal = false">
          <div class="glass-card w-full max-w-lg p-8 space-y-5 animate-fade-in">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">Add New College</h2>
              <button @click="showCreateModal = false" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.06] text-gray-400 transition">
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- College Name -->
            <div>
              <label class="form-label">College Name <span class="text-red-400">*</span></label>
              <input v-model="newCollege.name" class="form-input" placeholder="e.g. College of Information Technology" />
            </div>

            <!-- Dean & SG Officer -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="form-label">Dean</label>
                <input v-model="newCollege.dean" class="form-input" placeholder="e.g. Dr. Juan Cruz" />
              </div>
              <div>
                <label class="form-label">SG Officer</label>
                <input v-model="newCollege.sgOfficer" class="form-input" placeholder="e.g. Maria Santos" />
              </div>
            </div>

            <!-- Programs -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="form-label mb-0">Programs</label>
                <button @click="addProgram" type="button" class="text-xs text-brand-500 hover:text-brand-600 font-semibold flex items-center gap-1">
                  <Plus class="w-3 h-3" /> Add Program
                </button>
              </div>
              <div class="space-y-2">
                <div v-for="(prog, pi) in newCollege.programs" :key="pi" class="flex items-center gap-2">
                  <input v-model="newCollege.programs[pi]" class="form-input flex-1" :placeholder="'e.g. BS Computer Science'" />
                  <button v-if="newCollege.programs.length > 1" @click="removeProgram(pi)" type="button" class="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition shrink-0">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 pt-2">
              <button @click="showCreateModal = false" class="btn-ghost flex-1">Cancel</button>
              <button @click="handleCreate" :disabled="isSubmitting || !newCollege.name.trim()" class="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed">
                {{ isSubmitting ? 'Creating...' : 'Create College' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.expand-enter-active, .expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.expand-enter-from, .expand-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.expand-enter-to, .expand-leave-from {
  max-height: 300px;
  opacity: 1;
}
.fade-enter-active, .fade-leave-active { transition: all 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
