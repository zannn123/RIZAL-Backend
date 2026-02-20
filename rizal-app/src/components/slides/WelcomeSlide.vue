<script setup>
import Pagination from '../Pagination.vue';

const emit = defineEmits(['next']);
</script>

<template>
  <div class="flex flex-col animate-fadeIn w-full">
    <div class="flex flex-col">
      <h1 class="text-[2.5rem] leading-[1.1] mb-[1.5rem] font-bold mt-4">
        Welcome, <br> <span class="text-[#ffc107]">Illustrados</span>
      </h1>
      
      <p class="text-[0.9rem] text-[#b0b0b0] leading-[1.5] mb-[1rem]">
        <span class="text-[#ffc107]">R</span>ecord & <span class="text-[#ffc107]">I</span>ntegrated <span class="text-[#ffc107]">Z</span>one for <span class="text-[#ffc107]">A</span>ttendance & <span class="text-[#ffc107]">L</span>ogging (R.I.Z.A.L.) is designed to simplify your daily attendance monitoring at JRMSU. Track your records and stay informed.
      </p>

      <!-- Pagination above button -->
      <Pagination :currentSlide="1" class="mb-2" />

      <button 
        class="w-full p-[0.9rem] rounded-[20px] text-[1rem] font-semibold cursor-pointer shadow-[0_4px_15px_rgba(48,79,254,0.4)] z-[200] shrink-0 text-white mt-0 mb-0 bg-gradient-to-r from-[#1a237e] to-[#304ffe]"
        @click="$emit('next')"
      >
        Next
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Additional animations if needed */
</style>
