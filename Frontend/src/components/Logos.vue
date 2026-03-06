<script setup>
const props = defineProps({
  isCompact: Boolean
});
</script>

<template>
  <div 
    class="header-logos flex items-center gap-3 pt-[0.5rem] pb-0 transition-all duration-[800ms] z-50 shrink-0 -ml-2"
    :class="{ 'scale-[0.8] -mb-[0.1rem] origin-left': isCompact }"
  >
    <img src="@/assets/aura.png" alt="Aura" class="h-[80px] object-contain" />
  </div>
</template>

<style scoped>
.header-logos {
    transition-timing-function: cubic-bezier(0.25, 1, 0.5, 1);
}
</style>
