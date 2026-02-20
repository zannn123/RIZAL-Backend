<script setup>
import Pagination from '../Pagination.vue';
import FaceScanAnimation from '../FaceScanAnimation.vue';
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import ErrorModal from '../ErrorModal.vue';
// ⬇️ MOCK DATA: imported from API service
// 🔴 BACKEND: see src/services/api.js → loginUser(), saveAuth()
import { loginUser, saveAuth, getCurrentUser, clearAuth } from '../../services/api.js';

const emit = defineEmits(['next', 'create-account']);
const router = useRouter();

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);
const isLoading = ref(false);
const loginStep = ref('credentials'); // 'credentials' | 'facescan' | 'done'
const faceScanState = ref('scanning'); // 'scanning' | 'success' | 'error'
const detectedRole = ref('');
const statusText = ref('Initializing Camera...');
const scanProgress = ref(0);
const isAutoLogin = ref(false); // true when skipping credentials for a remembered user

// Camera & Detection Refs
const videoRef = ref(null);
const cameraStream = ref(null);
let detectionInterval = null;
let noFaceTimer = null;
let progressInterval = null;

const errorState = ref({ show: false, message: '' });
const showError = (msg) => { errorState.value = { show: true, message: msg }; };
const closeError = () => { errorState.value.show = false; };

// ===== CAMERA =====
const startCamera = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: 640, height: 480 }
        });
        cameraStream.value = stream;
        await nextTick();
        if (videoRef.value) {
            videoRef.value.srcObject = stream;
        }
        statusText.value = 'Position your face in the frame...';
        resetNoFaceTimer();
    } catch (err) {
        console.error('Camera error:', err);
        statusText.value = 'Camera access denied.';
        faceScanState.value = 'error';
    }
};

const stopCamera = () => {
    if (cameraStream.value) {
        cameraStream.value.getTracks().forEach(track => track.stop());
        cameraStream.value = null;
    }
    if (detectionInterval) { clearInterval(detectionInterval); detectionInterval = null; }
    if (noFaceTimer) { clearTimeout(noFaceTimer); noFaceTimer = null; }
    if (progressInterval) { clearInterval(progressInterval); progressInterval = null; }
};

// ===== FACE DETECTION USING face-api.js =====
const resetNoFaceTimer = () => {
    if (noFaceTimer) clearTimeout(noFaceTimer);
    if (faceScanState.value === 'success') return;

    noFaceTimer = setTimeout(() => {
        if (faceScanState.value !== 'success') {
            faceScanState.value = 'error';
            statusText.value = 'No face detected. Make sure you are in good lighting.';
            stopCamera();
        }
    }, 5000); // 5 second timeout
};

const onVideoPlay = () => {
    const video = videoRef.value;
    if (!video || !window.faceapi) {
        // face-api.js not loaded — fallback: show error
        statusText.value = 'Face detection library not loaded.';
        faceScanState.value = 'error';
        return;
    }

    statusText.value = 'Scanning for face...';

    detectionInterval = setInterval(async () => {
        if (faceScanState.value === 'success') return;

        try {
            const detections = await window.faceapi.detectAllFaces(
                video,
                new window.faceapi.TinyFaceDetectorOptions()
            );

            if (detections.length > 0) {
                // FACE FOUND!
                if (noFaceTimer) { clearTimeout(noFaceTimer); noFaceTimer = null; }

                if (faceScanState.value !== 'success') {
                    // Start fill progress animation
                    onFaceDetected();
                }
            }
        } catch (err) {
            // Detection may fail on some frames, that's OK
        }
    }, 200);
};

const onFaceDetected = () => {
    statusText.value = 'Face detected! Verifying...';
    scanProgress.value = 0;

    // Animate progress from 0 to 100
    progressInterval = setInterval(() => {
        scanProgress.value += 5;
        if (scanProgress.value >= 100) {
            clearInterval(progressInterval);
            progressInterval = null;
            onFaceScanSuccess();
        }
    }, 60);

    // Stop the detection loop
    if (detectionInterval) { clearInterval(detectionInterval); detectionInterval = null; }
};

const loadFaceModels = async () => {
    if (!window.faceapi) return;

    statusText.value = 'Loading AI Models...';
    try {
        await window.faceapi.nets.tinyFaceDetector.loadFromUri(
            'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights'
        );
    } catch (err) {
        console.error('Model load error:', err);
        statusText.value = 'Error loading face detection models.';
        faceScanState.value = 'error';
    }
};

// ===== LOGIN FLOW =====
const validateLogin = async () => {
    if (!email.value || !password.value) {
        showError("Please enter both email and password.");
        return;
    }

    isLoading.value = true;

    try {
        // 🔴 BACKEND: loginUser() currently matches email against mock/db.js users.
        //    When your API is ready, it will POST to /api/auth/login instead.
        //    See: src/services/api.js → loginUser()
        const authResult = await loginUser(email.value, password.value, rememberMe.value);

        // Save auth token + user data to localStorage
        // 🔴 BACKEND: saveAuth() stores the JWT token for authenticated requests
        //    rememberMe controls whether to persist session across browser restarts
        saveAuth(authResult.token, authResult.user, rememberMe.value);

        // Role is now determined by the API response, not hardcoded email matching
        detectedRole.value = authResult.user.role;

        isLoading.value = false;
        loginStep.value = 'facescan';
        faceScanState.value = 'scanning';
        scanProgress.value = 0;

        // Load models then start camera
        await loadFaceModels();
        await startCamera();

    } catch (error) {
        showError("Login Failed: " + error.message);
        isLoading.value = false;
    }
};

const onFaceScanSuccess = () => {
    faceScanState.value = 'success';
    statusText.value = 'Face Verified Successfully!';
    stopCamera();

    setTimeout(() => {
        loginStep.value = 'done';
        if (detectedRole.value === 'admin') { router.push('/admin/dashboard'); }
        else if (detectedRole.value === 'sg') { router.push('/sg/approvals'); }
        else { router.push('/student/pending'); }
    }, 1500);
};

const retryFaceScan = async () => {
    faceScanState.value = 'scanning';
    scanProgress.value = 0;
    statusText.value = 'Retrying...';
    await startCamera();
};

const cancelFaceScan = () => {
    stopCamera();
    loginStep.value = 'credentials';
    faceScanState.value = 'scanning';
    scanProgress.value = 0;
    // If this was an auto-login attempt, clear the remembered session
    if (isAutoLogin.value) {
        clearAuth();
        isAutoLogin.value = false;
    }
};

const createAccount = () => { router.push('/student/create'); };

onMounted(async () => {
    if (window.grecaptcha && window.grecaptcha.render) {
        try {
            window.grecaptcha.render('recaptcha-container', {
                'sitekey': '6LcwPGYsAAAAAJM344gXtvBszYY0hIY69zaavxaH',
                'theme': 'dark'
            });
        } catch (e) {}
    }

    // Auto-login: if a remembered user exists in localStorage, skip to face scan
    const rememberedUser = getCurrentUser();
    if (rememberedUser && localStorage.getItem('auth_token')) {
        isAutoLogin.value = true;
        detectedRole.value = rememberedUser.role;
        loginStep.value = 'facescan';
        faceScanState.value = 'scanning';
        scanProgress.value = 0;

        await loadFaceModels();
        await startCamera();
    }
});

onBeforeUnmount(() => { stopCamera(); });
</script>

<template>
  <div class="flex flex-col animate-fadeIn w-full">

    <!-- ===== STEP 1: EMAIL + PASSWORD ===== -->
    <div v-if="loginStep === 'credentials'" class="flex flex-col">
      <h1 class="text-[2rem] sm:text-[2.5rem] leading-[1.1] mb-[1rem] sm:mb-[1.5rem] font-bold">
        Log <span class="text-[#ffc107]">In.</span>
      </h1>

      <form @submit.prevent="validateLogin">
        <div class="mb-[0.8rem] sm:mb-[1.2rem]">
          <label class="block text-[0.8rem] mb-[0.3rem] text-[#ccc]">Email</label>
          <input v-model="email" type="email" placeholder="admin@rizal.edu"
            class="w-full p-[0.8rem] sm:p-[1rem] bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-[12px] text-white outline-none focus:border-[#ffc107]" />
        </div>
        <div class="mb-[0.8rem] sm:mb-[1.2rem] relative">
          <label class="block text-[0.8rem] mb-[0.3rem] text-[#ccc]">Password</label>
          <div class="relative">
            <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="********"
              class="w-full p-[0.8rem] sm:p-[1rem] pr-12 bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-[12px] text-white outline-none focus:border-[#ffc107]" />
            <button type="button" @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1">
              <!-- Eye open -->
              <svg v-if="!showPassword" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <!-- Eye closed -->
              <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            </button>
          </div>
        </div>
        <div class="flex items-center justify-between mb-[1rem] sm:mb-[1.5rem]">
          <label class="flex items-center gap-2 cursor-pointer group">
            <div class="relative">
              <input v-model="rememberMe" type="checkbox" class="sr-only peer" />
              <div class="w-[18px] h-[18px] rounded-[5px] border border-[rgba(255,255,255,0.25)] bg-[rgba(255,255,255,0.08)] peer-checked:bg-[#304ffe] peer-checked:border-[#304ffe] transition-all duration-200 flex items-center justify-center">
                <svg v-if="rememberMe" class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
            </div>
            <span class="text-[0.8rem] text-[#aaa] group-hover:text-white transition-colors">Remember me</span>
          </label>
          <a href="#" class="text-[#ccc] no-underline text-[0.8rem] hover:text-[#ffc107] transition-colors">Forgot Password?</a>
        </div>
        <div class="recaptcha-wrapper mb-[0.5rem] sm:mb-[1rem] flex justify-center">
          <div id="recaptcha-container"></div>
        </div>
        <Pagination :currentSlide="3" class="mb-2" />
        <button type="button" @click="validateLogin" :disabled="isLoading"
          class="w-full p-[0.8rem] sm:p-[0.9rem] rounded-[20px] text-[0.9rem] sm:text-[1rem] font-semibold cursor-pointer shadow-[0_4px_15px_rgba(48,79,254,0.4)] z-[200] shrink-0 text-white bg-gradient-to-r from-[#1a237e] to-[#304ffe] disabled:opacity-70 disabled:cursor-not-allowed">
          {{ isLoading ? 'Verifying...' : 'Log In' }}
        </button>
        <button type="button" @click="createAccount"
          class="w-full p-[0.8rem] sm:p-[1rem] bg-transparent text-[#b0b0b0] border border-[rgba(255,255,255,0.15)] rounded-[20px] text-[0.9rem] sm:text-[1rem] font-semibold cursor-pointer mt-[0.5rem] sm:mt-[0.6rem] transition-all duration-300 z-[200] hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,193,7,0.4)] hover:text-[#ffc107]">
          Create Account
        </button>
      </form>
    </div>

    <!-- ===== STEP 2: FACE SCAN (Real Camera + face-api.js) ===== -->
    <div v-else-if="loginStep === 'facescan'" class="flex flex-col items-center text-center facescan-container">

      <!-- Back Button -->
      <button @click="cancelFaceScan" class="self-start mb-3 flex items-center gap-1.5 text-[rgba(255,255,255,0.6)] hover:text-white text-sm transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back
      </button>

      <h2 class="text-[1.4rem] sm:text-[1.6rem] font-bold mb-1">Face ID Verification</h2>
      <p class="text-[rgba(255,255,255,0.5)] text-[0.85rem] mb-6">
        Position your face within the circle
      </p>

      <!-- Camera Circle with Scanning Ring -->
      <div class="relative w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] mx-auto mb-6">

        <!-- Pulsing outer glow -->
        <div class="absolute -inset-4 rounded-full animate-pulse" :class="{
          'bg-[#304ffe]/10': faceScanState === 'scanning',
          'bg-[#00e676]/10': faceScanState === 'success',
          'bg-red-500/10': faceScanState === 'error'
        }" style="animation-duration: 2s; filter: blur(20px);"></div>

        <!-- Progress ring (SVG circle) -->
        <svg class="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] -rotate-90 z-10" viewBox="0 0 120 120">
          <!-- Track -->
          <circle cx="60" cy="60" r="56" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="2.5" />
          <!-- Progress arc -->
          <circle cx="60" cy="60" r="56"
            fill="none"
            :stroke="faceScanState === 'success' ? '#00e676' : faceScanState === 'error' ? '#ef4444' : '#304ffe'"
            stroke-width="2.5"
            stroke-linecap="round"
            :stroke-dasharray="351.86"
            :stroke-dashoffset="351.86 - (351.86 * scanProgress / 100)"
            class="transition-all duration-300"
          />
        </svg>

        <!-- Dashed scanning ring (spins during scan) -->
        <div v-if="faceScanState === 'scanning'"
          class="absolute -inset-1 rounded-full border border-dashed border-[#304ffe]/40 animate-spin z-10"
          style="animation-duration: 6s;">
        </div>

        <!-- Camera viewport -->
        <div class="w-full h-full rounded-full overflow-hidden border-[2px] relative z-0 transition-colors duration-500" :class="{
          'border-[rgba(255,255,255,0.12)]': faceScanState === 'scanning',
          'border-[#00e676]': faceScanState === 'success',
          'border-red-500': faceScanState === 'error'
        }">
          <!-- Live camera feed -->
          <video ref="videoRef" autoplay playsinline muted
            @play="onVideoPlay"
            class="w-full h-full object-cover scale-x-[-1]">
          </video>

          <!-- Scan line -->
          <div v-if="faceScanState === 'scanning'" class="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#304ffe] to-transparent shadow-[0_0_15px_#304ffe] z-20 animate-scanLine"></div>

          <!-- Success overlay -->
          <div v-if="faceScanState === 'success'" class="absolute inset-0 bg-[rgba(0,230,118,0.08)] z-20 flex items-center justify-center">
            <FaceScanAnimation state="success" />
          </div>

          <!-- Error overlay -->
          <div v-if="faceScanState === 'error'" class="absolute inset-0 bg-[rgba(239,68,68,0.1)] z-20 flex items-center justify-center">
            <FaceScanAnimation state="error" />
          </div>
        </div>

        <!-- Face icon placeholder (when no camera yet) -->
        <div v-if="faceScanState === 'scanning' && !cameraStream"
          class="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="rgba(48,79,254,0.4)" stroke-width="1.5" stroke-linecap="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3"/>
            <path d="M16 3h3a2 2 0 0 1 2 2v3"/>
            <path d="M8 21H5a2 2 0 0 1-2-2v-3"/>
            <path d="M16 21h3a2 2 0 0 0 2-2v-3"/>
            <circle cx="9" cy="9" r="1"/>
            <circle cx="15" cy="9" r="1"/>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
          </svg>
        </div>
      </div>

      <!-- Progress % -->
      <p v-if="scanProgress > 0 && faceScanState !== 'error'" class="text-[#ffc107] text-[2rem] font-bold mb-1 tabular-nums">
        {{ scanProgress }}%
      </p>

      <!-- Status Text -->
      <p class="text-sm font-medium transition-colors duration-300 mt-1" :class="{
        'text-[rgba(255,255,255,0.6)]': faceScanState === 'scanning',
        'text-[#00e676]': faceScanState === 'success',
        'text-red-400': faceScanState === 'error'
      }">
        {{ statusText }}
      </p>

      <!-- Retry / Cancel buttons -->
      <div class="flex gap-3 mt-5">
        <button v-if="faceScanState === 'error'" @click="retryFaceScan"
          class="px-6 py-2.5 bg-gradient-to-r from-[#1a237e] to-[#304ffe] text-white rounded-[20px] text-[0.85rem] font-semibold cursor-pointer shadow-lg transition-transform hover:scale-105">
          Try Again
        </button>
        <button v-if="faceScanState !== 'success'" @click="cancelFaceScan"
          class="px-5 py-2.5 bg-transparent text-[#b0b0b0] border border-[rgba(255,255,255,0.15)] rounded-[20px] text-[0.85rem] font-medium cursor-pointer transition-all hover:bg-[rgba(255,255,255,0.05)] hover:text-white">
          Cancel
        </button>
      </div>
    </div>

    <Teleport to="body">
      <ErrorModal v-if="errorState.show" :message="errorState.message" @close="closeError" />
    </Teleport>
  </div>
</template>

<style scoped>
@keyframes scanLine {
  0% { top: 0%; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}
.animate-scanLine {
  animation: scanLine 2.5s ease-in-out infinite;
}
</style>

<!-- Unscoped styles so they can target Google's reCAPTCHA iframe -->
<style>
.recaptcha-wrapper {
  display: flex;
  justify-content: center;
  overflow: hidden;
  max-width: 100%;
}
/* The normal reCAPTCHA is 304px wide. Scale it to fit the container. */
.recaptcha-wrapper > div {
  transform-origin: center top;
  transform: scale(1);
  transition: transform 0.2s ease;
}
@media (max-width: 480px) {
  .recaptcha-wrapper > div {
    transform: scale(0.88);
    margin: -6px 0;
  }
}
@media (max-width: 380px) {
  .recaptcha-wrapper > div {
    transform: scale(0.78);
    margin: -10px 0;
  }
}
@media (max-width: 320px) {
  .recaptcha-wrapper > div {
    transform: scale(0.65);
    margin: -16px 0;
  }
}
</style>
