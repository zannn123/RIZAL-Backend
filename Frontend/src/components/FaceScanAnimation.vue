<script setup>
import { computed } from 'vue';

const props = defineProps({
  state: {
    type: String, // 'scanning', 'success', 'error'
    default: 'scanning'
  }
});
</script>

<template>
  <div class="relative w-[120px] h-[120px] mx-auto mb-6 flex items-center justify-center">
    
    <!-- Inner Content -->
    <div class="relative w-full h-full flex items-center justify-center overflow-visible">
        
        <transition name="pop" mode="out-in">
            <!-- Scanning State: Hidden -->
            <div v-if="state === 'scanning'" key="scan" class="w-full h-full"></div>

            <!-- Success State: Face ID Style Check -->
            <div v-else-if="state === 'success'" key="success" class="flex items-center justify-center w-full h-full relative">
                <!-- Glow -->
                <div class="absolute inset-0 bg-[#00e676]/10 rounded-full blur-xl animate-pulse-fast"></div>
                
                <!-- Face ID Brackets (The "Frame") -->
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#00e676" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute inset-0 m-auto animate-drawFrame">
                     <!-- Top Left -->
                     <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                     <!-- Top Right -->
                     <path d="M16 3h3a2 2 0 0 1 2 2v3" />
                     <!-- Bottom Left -->
                     <path d="M8 21H5a2 2 0 0 1-2-2v-3" />
                     <!-- Bottom Right -->
                     <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                </svg>

                <!-- Checkmark in Center -->
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#00e676" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="relative z-10 animate-drawCheck">
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            </div>

            <!-- Error State: Warning Icon -->
            <div v-else-if="state === 'error'" key="error" class="flex flex-col items-center justify-center">
                 <div class="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse-fast"></div>
                
                 <!-- Red Brackets for Error -->
                 <svg width="100" height="100" viewBox="0 0 24 24" fill="none" class="absolute inset-0 m-auto text-red-500 animate-shake">
                     <path d="M8 3H5a2 2 0 0 0-2 2v3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                     <path d="M16 3h3a2 2 0 0 1 2 2v3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                     <path d="M8 21H5a2 2 0 0 1-2-2v-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                     <path d="M16 21h3a2 2 0 0 0 2-2v-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" class="text-red-500 animate-shake relative z-10">
                     <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
        </transition>

    </div>
  </div>
</template>

<style scoped>
.pop-enter-active {
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.pop-leave-active {
  transition: opacity 0.2s ease;
}
.pop-leave-to {
  opacity: 0;
}

@keyframes popIn {
  0% { opacity: 0; transform: scale(0.5); }
  100% { opacity: 1; transform: scale(1); }
}

.animate-drawCheck {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: draw 0.6s ease-out 0.2s forwards; /* Slight delay to sync with frame */
}

.animate-drawFrame {
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    animation: draw 0.6s ease-out forwards;
}

@keyframes draw {
  to { stroke-dashoffset: 0; }
}

.animate-pulse-fast {
    animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.2; }
}

.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
</style>
