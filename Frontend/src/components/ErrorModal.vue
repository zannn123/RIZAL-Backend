<script setup>
import { onMounted } from 'vue';

const props = defineProps({
    message: String
});

const emit = defineEmits(['close']);

const close = () => {
    emit('close');
};
</script>

<template>
  <div class="fixed inset-0 z-[20000] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-fadeIn" @click.self="close">
    <div class="bg-[#1a1a2e] border border-red-500/30 w-full max-w-[320px] rounded-[24px] p-6 flex flex-col items-center text-center shadow-[0_10px_40px_rgba(0,0,0,0.5)] transform scale-100 animate-popIn relative overflow-hidden">
        
        <!-- Glow Effect -->
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-orange-500"></div>

        <!-- Animated X Icon (SVG replacement for Lottie to work immediately) -->
        <div class="w-[80px] h-[80px] mb-4 relative flex items-center justify-center">
            <!-- Ring -->
            <svg class="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="283" stroke-dashoffset="0" class="animate-drawCircle opacity-20" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#ef4444" stroke-width="3" stroke-dasharray="283" stroke-dashoffset="283" class="animate-drawCircle" />
            </svg>
            <!-- X Mark -->
            <div class="absolute inset-0 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 10L30 30" stroke="#ef4444" stroke-width="4" stroke-linecap="round" class="animate-drawX1" />
                    <path d="M30 10L10 30" stroke="#ef4444" stroke-width="4" stroke-linecap="round" class="animate-drawX2" />
                </svg>
            </div>
        </div>

        <!-- Error Message -->
        <h3 class="text-white text-[1.2rem] font-bold mb-2">Ooops!</h3>
        <p class="text-[#ccc] text-[0.9rem] leading-relaxed mb-6">{{ message }}</p>

        <!-- Button -->
        <button 
            @click="close"
            class="w-full py-3 rounded-[16px] bg-red-600 hover:bg-red-700 text-white font-semibold tracking-wide transition-all duration-200 shadow-[0_4px_15px_rgba(220,38,38,0.4)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.6)] active:scale-95"
        >
            Try Again
        </button>
    </div>
  </div>
</template>

<style scoped>
.animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
}

.animate-popIn {
    animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes popIn {
    0% { opacity: 0; transform: scale(0.8) translateY(20px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
}

.animate-drawCircle {
    animation: drawCircle 0.8s ease-out forwards;
}

.animate-drawX1 {
    stroke-dasharray: 30;
    stroke-dashoffset: 30;
    animation: drawLine 0.4s ease-out 0.4s forwards;
}

.animate-drawX2 {
    stroke-dasharray: 30;
    stroke-dashoffset: 30;
    animation: drawLine 0.4s ease-out 0.6s forwards;
}

@keyframes drawCircle {
    to { stroke-dashoffset: 0; }
}

@keyframes drawLine {
    to { stroke-dashoffset: 0; }
}
</style>
