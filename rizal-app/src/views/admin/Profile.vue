<script setup>
import { ref, onMounted } from 'vue';
import { UserCircle, Mail, Shield, Edit3, Save, Camera } from 'lucide-vue-next';
// ⬇️ MOCK DATA: imported from API service
// 🔴 BACKEND: see src/services/api.js → getProfile(), updateProfile()
import { getProfile, updateProfile } from '../../services/api.js';

const isEditing = ref(false);
const isLoading = ref(true);
const isSaving = ref(false);
const profile = ref({
  name: '',
  email: '',
  role: '',
  phone: '',
  department: '',
  bio: '',
  college: '',
});

onMounted(async () => {
  try {
    // 🔴 BACKEND: Replace getProfile() body in services/api.js with fetch('/api/profile')
    const data = await getProfile();
    profile.value = {
      name: data.name || '',
      email: data.email || '',
      role: data.role ? data.role.charAt(0).toUpperCase() + data.role.slice(1) : '',
      phone: data.phone || '',
      department: data.department || '',
      bio: data.bio || '',
      college: data.college || '',
    };
  } catch (err) {
    console.error('Failed to load profile:', err);
  } finally {
    isLoading.value = false;
  }
});

const toggleEdit = async () => {
  if (isEditing.value) {
    // Save changes
    isSaving.value = true;
    try {
      // 🔴 BACKEND: Replace updateProfile() body in services/api.js with PUT /api/profile
      await updateProfile({
        name: profile.value.name,
        phone: profile.value.phone,
        department: profile.value.department,
        bio: profile.value.bio,
      });
      isEditing.value = false;
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      isSaving.value = false;
    }
  } else {
    isEditing.value = true;
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6 animate-fade-in">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400">Manage your account information</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-16">
      <div class="w-8 h-8 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin"></div>
    </div>

    <template v-else>
      <!-- Profile Header Card -->
      <div class="glass-card p-8">
        <div class="flex flex-col sm:flex-row items-center gap-6">
          <!-- Avatar -->
          <div class="relative group">
            <div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-brand-500/30">
              {{ profile.name.charAt(0) }}
            </div>
            <button class="absolute -bottom-1 -right-1 w-8 h-8 bg-white dark:bg-slate-700 rounded-lg shadow-md flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-brand-500 transition-colors opacity-0 group-hover:opacity-100">
              <Camera class="w-4 h-4" />
            </button>
          </div>

          <div class="text-center sm:text-left flex-1">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ profile.name }}</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center sm:justify-start gap-1.5 mt-1">
              <Mail class="w-4 h-4" /> {{ profile.email }}
            </p>
            <div class="mt-2">
              <span class="badge badge-blue">
                <Shield class="w-3 h-3" /> {{ profile.role }}
              </span>
            </div>
          </div>

          <button @click="toggleEdit" :disabled="isSaving" :class="[isEditing ? 'btn-primary' : 'btn-ghost border border-gray-200 dark:border-gray-700']">
            <Save v-if="isEditing" class="w-4 h-4 inline mr-1" />
            <Edit3 v-else class="w-4 h-4 inline mr-1" />
            {{ isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile' }}
          </button>
        </div>
      </div>

      <!-- Profile Details -->
      <div class="glass-card p-8">
        <h3 class="font-semibold text-gray-900 dark:text-white mb-6">Account Details</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="form-label">Full Name</label>
            <input v-model="profile.name" :disabled="!isEditing" :class="['form-input', !isEditing && 'opacity-70 cursor-default']" />
          </div>
          <div>
            <label class="form-label">Email Address</label>
            <input v-model="profile.email" disabled :class="['form-input opacity-70 cursor-default']" />
          </div>
          <div>
            <label class="form-label">Phone Number</label>
            <input v-model="profile.phone" :disabled="!isEditing" :class="['form-input', !isEditing && 'opacity-70 cursor-default']" />
          </div>
          <div>
            <label class="form-label">Department</label>
            <input v-model="profile.department" :disabled="!isEditing" :class="['form-input', !isEditing && 'opacity-70 cursor-default']" />
          </div>
          <div class="md:col-span-2">
            <label class="form-label">Bio</label>
            <textarea v-model="profile.bio" rows="3" :disabled="!isEditing" :class="['form-input resize-none', !isEditing && 'opacity-70 cursor-default']"></textarea>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
