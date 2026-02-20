<script setup>
import { onMounted, ref } from 'vue';
import { Download, AlertCircle, CheckCircle2 } from 'lucide-vue-next';
import QrcodeVue from 'qrcode.vue'; // [NEW] Import QR Library

const studentData = ref({});
const qrValue = ref('');

onMounted(() => {
  // --- BACKEND INTEGRATION NOTE ---
  // Ideally, you should fetch the student status from your API here
  // const response = await fetch('/api/student/status');
  // const data = await response.json();
  
  const data = localStorage.getItem('tempStudent');
  if (data) {
    studentData.value = JSON.parse(data);
    
    // --- QR DATA FORMAT ---
    // This string is what the SG officer will scan.
    // It should contain a unique ID that the backend can verify.
    // Example: JSON string or just the ID.
    qrValue.value = JSON.stringify({
        id: studentData.value.studentId,
        name: studentData.value.fullName,
        type: 'student_registration'
    });
  }
});
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    
    <!-- Header Card -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="text-center md:text-left">
        <h1 class="text-2xl font-bold text-gray-900">Registration Pending</h1>
        <p class="text-gray-500 mt-1 max-w-lg">
          Your account has been created but requires face verification. Please present this QR code at the Student Government office.
        </p>
      </div>
      <div class="inline-flex items-center px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold border border-amber-200 animate-pulse">
        <AlertCircle class="w-4 h-4 mr-2" />
        Action Required
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- QR Code Card -->
      <div class="col-span-1 md:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div class="relative group">
          
          <!-- REAL QR CODE -->
          <div class="bg-white p-4 rounded-xl shadow-inner border border-gray-100 mb-6 relative overflow-hidden">
             <!-- 
                value: The string to encode
                size: Size in pixels
                level: Error correction level (L, M, Q, H)
             -->
             <QrcodeVue 
                v-if="qrValue"
                :value="qrValue" 
                :size="200" 
                level="H" 
                render-as="svg"
                class="mx-auto"
             />
             <div v-else class="w-[200px] h-[200px] flex items-center justify-center text-gray-400 text-sm">
                Generating QR...
             </div>
          </div>
          
          <div class="absolute -bottom-3 -right-3 bg-indigo-600 text-white p-2 rounded-lg shadow-lg">
            <CheckCircle2 class="w-5 h-5" />
          </div>
        </div>

        <h3 class="text-lg font-bold text-gray-900 mb-1">{{ studentData.fullName || 'Student Name' }}</h3>
        <p class="text-sm font-mono text-gray-500 tracking-wider mb-6">{{ studentData.studentId || 'ID-XXXX' }}</p>

        <button class="flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all text-sm font-medium">
          <Download class="w-4 h-4" />
          Save QR Code
        </button>
      </div>

      <!-- Instructions & Details (Unchanged) -->
      <div class="col-span-1 md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h3 class="text-lg font-bold text-gray-900 mb-6">Next Steps</h3>
        
        <div class="space-y-6">
          <div class="flex gap-4">
            <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">1</div>
            <div>
              <h4 class="font-semibold text-gray-900">Visit SG Office</h4>
              <p class="text-sm text-gray-500 mt-1">Go to the Student Government office located at the Ground Floor, Main Building.</p>
            </div>
          </div>
          
          <div class="flex gap-4">
            <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">2</div>
            <div>
              <h4 class="font-semibold text-gray-900">Present QR Code</h4>
              <p class="text-sm text-gray-500 mt-1">Show the QR code on the left to the SG officer. They will scan it to retrieve your details.</p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">3</div>
            <div>
              <h4 class="font-semibold text-gray-900">Face Registration</h4>
              <p class="text-sm text-gray-500 mt-1">The officer will take a scan of your face to register you in the biometric system.</p>
            </div>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-gray-100">
            <h4 class="font-semibold text-gray-900 mb-2">Student Information</h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <span class="block text-gray-400 text-xs">College</span>
                    <span class="text-gray-700">{{ studentData.college || '-' }}</span>
                </div>
                 <div>
                    <span class="block text-gray-400 text-xs">Program</span>
                    <span class="text-gray-700">{{ studentData.program || '-' }}</span>
                </div>
                 <div>
                    <span class="block text-gray-400 text-xs">Email</span>
                    <span class="text-gray-700">{{ studentData.email || '-' }}</span>
                </div>
            </div>
        </div>

      </div>

    </div>
  </div>
</template>

<style scoped>
/* Removed scanning animation since we have a static QR now */
</style>
