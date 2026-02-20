<script setup>
import Background from '../components/Background.vue';
import Logos from '../components/Logos.vue';
import WelcomeSlide from '../components/slides/WelcomeSlide.vue';
import TermsSlide from '../components/slides/TermsSlide.vue';
import LoginSlide from '../components/slides/LoginSlide.vue';
import FaceScanSlide from '../components/slides/FaceScanSlide.vue';
import DeveloperPage from '../components/DeveloperPage.vue';
import PdfViewer from '../components/PdfViewer.vue';
import { ref, computed, onMounted } from 'vue';
import { getCurrentUser } from '../services/api.js';

const currentSlide = ref(1);
const showPdf = ref(false);
const showDevPage = ref(false);

// Auto-skip to login slide if a remembered user exists
onMounted(() => {
  const rememberedUser = getCurrentUser();
  // Only auto-skip if saved in localStorage (rememberMe was true)
  if (rememberedUser && localStorage.getItem('auth_token')) {
    currentSlide.value = 3;
  }
});

const nextSlide = (slide) => {
  currentSlide.value = slide;
};

const openPdf = () => {
  showPdf.value = true;
};

const closePdf = () => {
  showPdf.value = false;
};

const openDevPage = () => {
  showDevPage.value = true;
};

const closeDevPage = () => {
  showDevPage.value = false;
};
</script>

<template>
  <div class="relative w-full h-screen bg-black text-white overflow-hidden flex justify-center">
    <Background />
    
    <div class="app-container relative w-full max-w-[480px] h-screen flex flex-col z-10 overflow-hidden" v-show="!showDevPage">
      
      <!-- Scrollable Content Area -->
      <div class="flex-1 w-full overflow-y-auto h-full flex flex-col p-4 sm:p-[1.5rem_2rem] scrollbar-hide">
          <div class="min-h-full flex flex-col justify-center pb-[3rem]">
              <!-- HEADER LOGOS -->
              <!-- Only show logos if not in Developer Page (controlled by v-show on container) -->
              <!-- Pass isCompact for Slide 3+ -->
              <Logos :isCompact="currentSlide >= 3" />

              <!-- SLIDES -->
              <WelcomeSlide v-if="currentSlide === 1" @next="nextSlide(2)" />
              <TermsSlide v-if="currentSlide === 2" @next="nextSlide(3)" @open-pdf="openPdf" />
              <LoginSlide v-if="currentSlide === 3" /> 
              <!-- NOTE: Create Account button in original triggered alert. Here mapping to DevPage? No, original had alert. -->
              <!-- Original logic: "Create Account" -> alert. "Developed by ByteForce" -> DevPage. -->
              <!-- We should keep alert for Create Account and link "ByteForce" to DevPage. -->
              <!-- LoginSlide emits 'create-account'. Let's handle it properly. -->
              
              <FaceScanSlide v-if="currentSlide === 4" />
          </div>
      </div>

      <!-- DEVELOPER CREDIT (Slide 4 hides it in original, but let's check Logic) -->
      <!-- "if (slideNumber === 4) { ... devCredit.style.display = 'none'; }" -->
      <div 
        v-if="currentSlide !== 4"
        class="dev-credit absolute bottom-[1rem] left-0 w-full text-center text-[0.7rem] text-[#555] z-[200] tracking-[0.5px] py-[0.5rem] shrink-0 pointer-events-none"
      >
        Developed by <span class="text-[#7c7fff] cursor-pointer font-semibold transition-all duration-300 hover:text-[#ffc107] hover:shadow-[0_0_8px_rgba(255,193,7,0.4)] pointer-events-auto" @click="openDevPage">ByteForce</span>
      </div>
    </div>

    <!-- OVERLAYS -->
    <DeveloperPage v-if="showDevPage" @back="closeDevPage" />
    <PdfViewer v-if="showPdf" @close="closePdf" />

  </div>
</template>

<style scoped>
/* Scoped styles for the landing page if any */
</style>
