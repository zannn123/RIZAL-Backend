<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { User, CreditCard, Mail, BookOpen, GraduationCap, Shield, ArrowRight, CheckCircle } from 'lucide-vue-next';
// ⬇️ MOCK DATA: imported from API service
// 🔴 BACKEND: see src/services/api.js → createUser(), getMetadata()
import { createUser, getMetadata } from '../../services/api.js';

const router = useRouter();
const isSubmitting = ref(false);
const showSuccess = ref(false);

const form = ref({
  fullName: '',
  studentId: '',
  email: '',
  password: '',
  college: '',
  program: '',
  role: 'Student',
});

// ⬇️ MOCK DATA: College/program dropdowns loaded from API service
// 🔴 BACKEND: will be populated by GET /api/metadata
const colleges = ref([]);
const programsMap = ref({});
const availablePrograms = ref([]);

onMounted(async () => {
  try {
    // 🔴 BACKEND: Replace getMetadata() body in services/api.js with fetch('/api/metadata')
    const meta = await getMetadata();
    colleges.value = meta.colleges;
    programsMap.value = meta.programs;
  } catch (err) {
    console.error('Failed to load metadata:', err);
  }
});

const handleCollegeChange = () => {
  availablePrograms.value = programsMap.value[form.value.college] || [];
  form.value.program = '';
};

const handleSubmit = async () => {
  isSubmitting.value = true;

  try {
    // 🔴 BACKEND: Replace createUser() body in services/api.js with POST /api/users
    await createUser(form.value);
    
    isSubmitting.value = false;
    showSuccess.value = true;

    setTimeout(() => {
      showSuccess.value = false;
      form.value = { fullName: '', studentId: '', email: '', password: '', college: '', program: '', role: 'Student' };
      availablePrograms.value = [];
    }, 2000);
  } catch (err) {
    console.error('Create account error:', err);
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6 animate-fade-in">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400">Admin-side account creation with role assignment</p>
    </div>

    <!-- Success Toast -->
    <Transition name="fade">
      <div v-if="showSuccess" class="glass-card p-4 border-l-4 border-emerald-500 flex items-center gap-3">
        <CheckCircle class="w-5 h-5 text-emerald-500 shrink-0" />
        <p class="text-sm font-medium text-emerald-700 dark:text-emerald-400">Account created successfully!</p>
      </div>
    </Transition>

    <form @submit.prevent="handleSubmit" class="glass-card p-8 space-y-6">

      <!-- Role Selector -->
      <div>
        <label class="form-label">Account Role</label>
        <div class="grid grid-cols-3 gap-3">
          <button
            v-for="role in ['Student', 'SG', 'Admin']"
            :key="role"
            type="button"
            @click="form.role = role"
            :class="[
              'py-2.5 rounded-xl text-sm font-semibold border transition-all flex items-center justify-center gap-2',
              form.role === role
                ? 'bg-brand-500/10 dark:bg-brand-500/20 border-brand-500 text-brand-600 dark:text-brand-400'
                : 'bg-white/50 dark:bg-slate-800/50 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300'
            ]"
          >
            <Shield v-if="role === 'Admin'" class="w-4 h-4" />
            {{ role }}
          </button>
        </div>
      </div>

      <!-- Full Name -->
      <div>
        <label class="form-label">Full Name</label>
        <div class="relative">
          <User class="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input v-model="form.fullName" type="text" placeholder="Jose Rizal" class="form-input pl-10" required />
        </div>
      </div>

      <!-- Student ID & Email -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label class="form-label">ID Number</label>
          <div class="relative">
            <CreditCard class="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input v-model="form.studentId" type="text" placeholder="2023-0001" class="form-input pl-10" required />
          </div>
        </div>
        <div>
          <label class="form-label">Email</label>
          <div class="relative">
            <Mail class="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input v-model="form.email" type="email" placeholder="user@rizal.edu" class="form-input pl-10" required />
          </div>
        </div>
      </div>

      <!-- Password -->
      <div>
        <label class="form-label">Temporary Password</label>
        <input v-model="form.password" type="password" placeholder="••••••••" class="form-input" required />
      </div>

      <!-- College & Program (only for Student/SG) -->
      <template v-if="form.role !== 'Admin'">
        <div>
          <label class="form-label">College</label>
          <div class="relative">
            <BookOpen class="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <!-- 🔴 BACKEND: colleges dropdown populated from GET /api/metadata -->
            <select v-model="form.college" @change="handleCollegeChange" class="form-input pl-10 appearance-none" required>
              <option value="" disabled>Select College</option>
              <option v-for="c in colleges" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
        </div>
        <div v-if="form.role === 'Student'">
          <label class="form-label">Program</label>
          <div class="relative">
            <GraduationCap class="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <!-- 🔴 BACKEND: programs dropdown populated from GET /api/metadata -->
            <select v-model="form.program" class="form-input pl-10 appearance-none" required :disabled="!form.college">
              <option value="" disabled>Select Program</option>
              <option v-for="p in availablePrograms" :key="p" :value="p">{{ p }}</option>
            </select>
          </div>
        </div>
      </template>

      <!-- Submit -->
      <button
        type="submit"
        :disabled="isSubmitting"
        class="btn-primary w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span v-if="!isSubmitting">Create Account</span>
        <span v-else>Creating...</span>
        <ArrowRight v-if="!isSubmitting" class="w-4 h-4" />
      </button>
    </form>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
