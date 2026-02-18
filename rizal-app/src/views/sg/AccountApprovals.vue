<script setup>
import { ref, computed } from 'vue';
import { Camera, QrCode, UserCheck, CheckCircle, XCircle } from 'lucide-vue-next';

// State
const isScanning = ref(false);
const scannedData = ref(null);
const faceScanStatus = ref('idle'); // idle, scanning, success, error
const showCamera = ref(false);

// Mock Database
const pendingStudents = [
  {
    id: '2023-0001',
    name: 'Jose Rizal',
    program: 'BS Computer Engineering',
    college: 'College of Engineering',
    email: 'jose@rizal.edu',
    faceRegistered: false
  }
];

// Actions
const startQRScan = () => {
    isScanning.value = true;
    setTimeout(() => {
        isScanning.value = false;
        scannedData.value = pendingStudents[0]; // Mock result
    }, 1500);
};

const startFaceScan = () => {
    showCamera.value = true;
    faceScanStatus.value = 'scanning';
    
    setTimeout(() => {
        faceScanStatus.value = 'success';
        if (scannedData.value) {
            scannedData.value.faceRegistered = true;
        }
    }, 3000);
};

const registerUser = () => {
    if (!scannedData.value?.faceRegistered) return;
    alert(`Successfully registered ${scannedData.value.name}!`);
    resetFlow();
};

const resetFlow = () => {
    scannedData.value = null;
    faceScanStatus.value = 'idle';
    showCamera.value = false;
};

const canRegister = computed(() => faceScanStatus.value === 'success');

</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Account Approvals</h1>
      <span class="text-sm text-gray-500">Student Government Interface</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Left Panel: Scanner & Controls -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
        
        <div v-if="!scannedData" class="flex flex-col items-center space-y-6">
            <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center relative">
                <QrCode class="w-10 h-10 text-gray-400" />
                <div v-if="isScanning" class="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            
            <p class="text-gray-500 text-center max-w-xs">
                {{ isScanning ? 'Scanning QR Code...' : 'Waiting for Student QR Code' }}
            </p>

            <button 
                @click="startQRScan" 
                :disabled="isScanning"
                class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium flex items-center gap-2"
            >
                <Camera class="w-5 h-5" />
                {{ isScanning ? 'Scanning...' : 'Simulate Scan' }}
            </button>
        </div>

        <!-- FOUND STUDENT STATE -->
        <div v-else class="w-full space-y-6">
            <!-- Profile Card -->
            <div class="bg-indigo-50 p-6 rounded-xl border border-indigo-100 flex items-start gap-4">
                <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-indigo-600 shadow-sm">
                    {{ scannedData.name[0] }}
                </div>
                <div>
                    <h3 class="font-bold text-gray-900 text-lg">{{ scannedData.name }}</h3>
                    <p class="text-indigo-600 font-medium">{{ scannedData.program }}</p>
                    <p class="text-gray-500 text-sm mt-1">{{ scannedData.id }} • {{ scannedData.college }}</p>
                </div>
            </div>

            <!-- Face Scan Section -->
            <div class="border-t border-gray-100 pt-6">
                <h4 class="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <UserCheck class="w-5 h-5 text-gray-500" />
                    Biometric Verification
                </h4>

                <div class="bg-gray-900 rounded-xl aspect-video relative overflow-hidden flex items-center justify-center">
                    <div v-if="!showCamera" class="text-gray-500">Camera Feed Placeholder</div>
                    
                    <div v-else-if="faceScanStatus === 'scanning'" class="absolute inset-0 flex items-center justify-center">
                         <div class="w-48 h-48 border-2 border-indigo-500/50 rounded-full animate-pulse relative">
                            <div class="absolute inset-x-0 h-0.5 bg-indigo-500 top-1/2 animate-[scan_1.5s_ease-in-out_infinite]"></div>
                         </div>
                         <p class="absolute bottom-4 text-white text-sm font-medium">Align Face within Frame</p>
                    </div>

                    <div v-else-if="faceScanStatus === 'success'" class="absolute inset-0 bg-green-500/20 flex flex-col items-center justify-center backdrop-blur-sm">
                        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                            <CheckCircle class="w-8 h-8 text-green-600" />
                        </div>
                        <p class="text-white font-bold text-lg">Face Verified</p>
                    </div>
                </div>

                 <div class="mt-4 flex gap-3">
                    <button 
                        @click="startFaceScan"
                        v-if="faceScanStatus !== 'success'"
                        class="flex-1 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
                    >
                        Start Face Scan
                    </button>
                 </div>
            </div>

            <!-- Final Actions -->
             <div class="flex gap-3 pt-4 border-t border-gray-100">
                <button @click="resetFlow" class="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button 
                    @click="registerUser"
                    :disabled="!canRegister"
                    class="flex-1 px-4 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
                >
                    Confirm Registration
                </button>
             </div>

        </div>

      </div>

      <!-- Right Panel: Instructions or Recent Logs -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 class="font-bold text-gray-900 mb-4">Registration Protocols</h3>
        <ul class="space-y-4">
             <li class="flex gap-3">
                <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">1</div>
                <p class="text-sm text-gray-600">Verify student ID card matches provided details.</p>
            </li>
            <li class="flex gap-3">
                <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">2</div>
                <p class="text-sm text-gray-600">Ensure environment is well-lit before face scanning.</p>
            </li>
            <li class="flex gap-3">
                <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">3</div>
                <p class="text-sm text-gray-600">Confirm correct College and Program assignment.</p>
            </li>
        </ul>

        <div class="mt-8">
            <h4 class="font-bold text-gray-900 mb-3">Recent Activity</h4>
            <div class="space-y-3">
                <div class="p-3 bg-gray-50 rounded-lg text-sm flex justify-between items-center">
                    <span class="text-gray-700">Maria Clara</span>
                    <span class="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">Registered</span>
                </div>
                 <div class="p-3 bg-gray-50 rounded-lg text-sm flex justify-between items-center">
                    <span class="text-gray-700">Juan Luna</span>
                    <span class="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">Registered</span>
                </div>
            </div>
        </div>
      </div>

    </div>
  </div>
</template>
