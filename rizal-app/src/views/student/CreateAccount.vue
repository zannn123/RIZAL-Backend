<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { User, CreditCard, Mail, BookOpen, GraduationCap, ArrowRight } from 'lucide-vue-next';

const router = useRouter();

const form = ref({
  fullName: '',
  studentId: '',
  email: '',
  college: '',
  program: ''
});

const colleges = ['College of Engineering', 'College of Arts and Sciences', 'College of Business', 'College of Education'];
const programs = {
  'College of Engineering': ['BS Computer Engineering', 'BS Civil Engineering', 'BS Electronics Engineering'],
  'College of Arts and Sciences': ['BA Psychology', 'BS Biology', 'BA Communication'],
  'College of Business': ['BS Accountancy', 'BS Business Administration'],
  'College of Education': ['B Secondary Education', 'B Elementary Education']
};

const availablePrograms = ref([]);

const handleCollegeChange = () => {
  availablePrograms.value = programs[form.value.college] || [];
  form.value.program = '';
};

const handleSubmit = async () => {
  // --- BACKEND API INTEGRATION POINT ---
  // In a real application, you would send this data to your server.
  // 
  // Example API Call:
  // try {
  //    const response = await fetch('https://your-api.com/api/students/register', {
  //        method: 'POST',
  //        headers: { 'Content-Type': 'application/json' },
  //        body: JSON.stringify(form.value)
  //    });
  //    
  //    if (!response.ok) throw new Error('Registration failed');
  //    
  //    const result = await response.json();
  //    // The backend should return the unique student ID or the QR string
  //    // Save it to state management (Pinia/Vuex) or LocalStorage
  // } catch (error) {
  //    console.error(error);
  // }

  // --- SIMULATION (Delete this when connecting backend) ---
  console.log('Submitting Registration:', form.value);
  
  // We store the data in LocalStorage to pass it to the next page
  // The 'QRPending' page will read this to generate the QR code.
  localStorage.setItem('tempStudent', JSON.stringify(form.value));
  
  // Redirect to QR Page
  router.push('/student/pending');
};
</script>

<template>
  <div class="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0 z-0">
      <div class="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/30 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/30 rounded-full blur-[120px]"></div>
    </div>

    <div class="w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10">
      
      <div class="p-8 pb-0">
        <h2 class="text-3xl font-bold text-white mb-2 font-poppins">Create Account</h2>
        <p class="text-gray-400">Join the Rizal University system.</p>
      </div>

      <form @submit.prevent="handleSubmit" class="p-8 space-y-5">
        
        <!-- Full Name -->
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-300 ml-1">Full Name</label>
          <div class="relative">
            <User class="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input 
              v-model="form.fullName"
              type="text" 
              placeholder="Jose Rizal" 
              class="w-full bg-black/40 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              required
            />
          </div>
        </div>

        <!-- Student ID & Email Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="space-y-1">
             <label class="text-sm font-medium text-gray-300 ml-1">Student ID</label>
            <div class="relative">
              <CreditCard class="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input 
                v-model="form.studentId"
                type="text" 
                placeholder="2023-0001" 
                class="w-full bg-black/40 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all wait-input"
                required
              />
            </div>
          </div>

           <div class="space-y-1">
             <label class="text-sm font-medium text-gray-300 ml-1">Email</label>
            <div class="relative">
              <Mail class="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input 
                v-model="form.email"
                type="email" 
                placeholder="jose@rizal.edu" 
                class="w-full bg-black/40 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                required
              />
            </div>
          </div>
        </div>

        <!-- College & Program -->
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-300 ml-1">College</label>
          <div class="relative">
            <Bank class="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            
            <div class="relative">
                <BookOpen class="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <select 
                v-model="form.college"
                @change="handleCollegeChange"
                class="w-full bg-black/40 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white appearance-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                required
                >
                <option value="" disabled selected>Select College</option>
                <option v-for="c in colleges" :key="c" :value="c">{{ c }}</option>
                </select>
                <!-- Custom arrow could go here -->
            </div>
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-300 ml-1">Program</label>
          <div class="relative">
            <GraduationCap class="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <select 
              v-model="form.program"
              class="w-full bg-black/40 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white appearance-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              required
              :disabled="!form.college"
            >
              <option value="" disabled selected>Select Program</option>
              <option v-for="p in availablePrograms" :key="p" :value="p">{{ p }}</option>
            </select>
          </div>
        </div>

        <!-- Submit Button -->
        <button 
          type="submit"
          class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/30 transform transition-all duration-200 hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 mt-6"
        >
          <span>Generate QR Code</span>
          <ArrowRight class="w-5 h-5" />
        </button>

        <div class="text-center pt-2">
            <router-link to="/" class="text-sm text-gray-400 hover:text-white transition-colors">Cancel and return home</router-link>
        </div>

      </form>
    </div>
  </div>
</template>

<style scoped>
/* Additional custom styles if needed */
</style>
