<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import FaceScanAnimation from '../FaceScanAnimation.vue';

const videoRef = ref(null);
const statusText = ref("Initializing Camera...");
const scanState = ref('scanning'); // 'scanning', 'success', 'error'
let detectionInterval = null;
let noFaceTimer = null;

const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    if (videoRef.value) {
      videoRef.value.srcObject = stream;
      statusText.value = "Position your face in the frame...";
      
      // Start "No Face" timer - if no face found in 5 seconds, show error
      resetNoFaceTimer();
    }
  } catch (err) {
    console.error(err);
    statusText.value = "Error accessing camera.";
    scanState.value = 'error';
  }
};

const resetNoFaceTimer = () => {
    if (noFaceTimer) clearTimeout(noFaceTimer);
    if (scanState.value === 'success') return; // Don't error if already success

    noFaceTimer = setTimeout(() => {
        if (scanState.value !== 'success') {
            scanState.value = 'error';
            statusText.value = "Scan face not in the dark";
        }
    }, 5000); // 5 seconds timeout
};

const startDetection = async () => {
  statusText.value = "Loading AI Models...";
  
  // Ensure faceapi is available (loaded via CDN in index.html)
  if (!window.faceapi) {
    statusText.value = "Face API not loaded.";
    return;
  }

  try {
    await window.faceapi.nets.tinyFaceDetector.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights');
    startCamera();
  } catch (err) {
    console.error(err);
    statusText.value = "Error loading AI models.";
    scanState.value = 'error';
  }
};

const onPlay = () => {
    const video = videoRef.value;
    if (!video || !window.faceapi) return;

    // Detection loop moved here
    detectionInterval = setInterval(async () => {
        if (scanState.value === 'success') return;

        const detections = await window.faceapi.detectAllFaces(video, new window.faceapi.TinyFaceDetectorOptions());
        
        if (detections.length > 0) {
            // Face Found
            if (noFaceTimer) clearTimeout(noFaceTimer); // Stop error timer
            
            // Only transition if not already success
            if (scanState.value !== 'success') {
                scanState.value = 'success';
                statusText.value = "Face Verified Successfully!";
                
                // Stop processing
                clearInterval(detectionInterval);
                if (video.srcObject) {
                    video.srcObject.getTracks().forEach(track => track.stop());
                }
            }

        } else {
            // No face found in this frame
            // We rely on the timer to trigger the error if this persists
            if (scanState.value === 'error') {
                 // If we were in error state, maybe we can try scanning again? 
                 // For now, let's keep it simple. User might need to refresh or we can auto-retry.
                 // Let's Auto-retry: if in error and we see a face (unlikely if logic is strict, but let's reset if user moves into light)
                 // Actually, if detection is running, we can recover.
                 // But for "Scan face not in the dark", usually implies environment issue.
            }
        }
    }, 100);
};

onMounted(() => {
  startDetection();
});

onUnmounted(() => {
  if (detectionInterval) clearInterval(detectionInterval);
  if (noFaceTimer) clearTimeout(noFaceTimer);
  if (videoRef.value && videoRef.value.srcObject) {
    videoRef.value.srcObject.getTracks().forEach(track => track.stop());
  }
});
</script>

<template>
  <div class="flex flex-col animate-fadeIn w-full items-center">
    
    <h1 class="text-[2rem] sm:text-[2.5rem] leading-[1.1] mb-[1rem] sm:mb-[1.5rem] font-bold mt-4 text-center">
      Face <span class="text-[#ffc107]">Scan.</span>
    </h1>

    <!-- Animation Component -->
    <FaceScanAnimation :state="scanState" />

    <!-- Camera Preview (Hidden if success/error? No, maybe keep it but blur it or overlay) -->
    <!-- User wanted animation *above*. Just like iPhone (Lock Screen). -->
    <!-- We can keep the camera preview below it, or replace it. -->
    <!-- Let's keep camera but maybe smaller or less prominent if animation is the focus. -->
    
    <div 
        class="scanner-wrapper relative w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] mx-auto rounded-full border-4 border-[rgba(255,255,255,0.1)] overflow-hidden shadow-[0_0_30px_rgba(75,78,255,0.2)] bg-black transition-all duration-500"
        :class="{ 
            'border-[#00e676] shadow-[0_0_40px_rgba(0,230,118,0.4)] opacity-50': scanState === 'success',
            'border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)]': scanState === 'error'
        }"
    >
        <video 
          ref="videoRef" 
          id="webcam" 
          autoplay 
          playsinline 
          muted 
          class="w-full h-full object-cover transform -scale-x-100"
          @play="onPlay"
        ></video>

        <!-- Only show scan line overlay if scanning -->
        <div v-if="scanState === 'scanning'" class="scan-overlay absolute top-0 left-0 w-full h-full rounded-full z-10 shadow-[inset_0_0_20px_#000]">
          <div class="scan-line w-full h-[4px] bg-[#4b4eff] shadow-[0_0_15px_#4b4eff] absolute top-0 animate-scanMove"></div>
        </div>
    </div>

    <!-- Status Text -->
    <p 
        class="mt-[1.5rem] text-center font-medium transition-colors duration-300"
        :class="{
            'text-[#ccc]': scanState === 'scanning',
            'text-[#00e676]': scanState === 'success',
            'text-red-500 animate-pulse': scanState === 'error'
        }"
    >
      {{ statusText }}
    </p>

    <!-- Retry Button (Only on Error) -->
    <button 
        v-if="scanState === 'error'"
        @click="() => { scanState = 'scanning'; statusText = 'Retrying...'; resetNoFaceTimer(); }"
        class="mt-4 px-6 py-2 bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] rounded-full text-sm font-semibold transition-all"
    >
        Try Again
    </button>

  </div>
</template>

<style scoped>
@keyframes scanMove {
    0% { top: 0%; opacity: 0; }
    20% { opacity: 1; }
    80% { opacity: 1; }
    100% { top: 100%; opacity: 0; }
}

.animate-scanMove {
    animation: scanMove 2s infinite ease-in-out;
}
</style>
