<script setup>
const props = defineProps({
  currentSlide: Number
});
</script>

<template>
  <div class="flex gap-[6px] z-[200] py-[0.8rem] shrink-0">
    <span 
      v-for="i in 3" 
      :key="i"
      class="dot bg-[#444] rounded-full transition-all duration-[400ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
      :class="currentSlide === i ? 'w-[30px] rounded-[10px] bg-[#4b4eff]' : 'w-[8px] h-[8px]'"
    ></span>
  </div>
</template>

<style scoped>
/* Replaced scoped CSS with Tailwind classes in template where possible, kept complex transition */
</style>
