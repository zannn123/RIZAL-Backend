<script setup>
import Pagination from '../Pagination.vue';

const emit = defineEmits(['next', 'open-pdf']);
</script>

<template>
  <div class="flex flex-col animate-fadeIn w-full">
    <div class="flex flex-col">
      <h1 class="text-[2.5rem] leading-[1.1] mb-[1.5rem] font-bold mt-4">
        Do you <br> <span class="text-[#ffc107]">Agree?</span>
      </h1>
      
      <p class="text-[0.9rem] text-[#b0b0b0] leading-[1.5] mb-[1rem]">
        By continuing, you confirm that you have read, understood, and agreed to the
        <a href="#" class="text-[#ffc107] hover:underline" @click.prevent="$emit('open-pdf')">Terms of Service</a> and 
        <a href="#" class="text-[#ffc107] hover:underline" @click.prevent="$emit('open-pdf')">Privacy Policy</a>.
      </p>

      <Pagination :currentSlide="2" class="mb-2" />

      <button 
        class="w-full p-[0.9rem] rounded-[20px] text-[1rem] font-semibold cursor-pointer shadow-[0_4px_15px_rgba(48,79,254,0.4)] z-[200] shrink-0 text-white mt-0 mb-0 bg-gradient-to-r from-[#1a237e] to-[#304ffe]"
        @click="$emit('next')"
      >
        Agree & Continue
      </button>
    </div>
  </div>
</template>
