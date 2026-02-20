<script setup>
import { computed } from 'vue';

const props = defineProps({
  isCompact: Boolean
});
</script>

<template>
  <div 
    class="header-logos flex gap-[15px] pt-[0.7rem] pb-[0.3rem] transition-all duration-[800ms] z-50 shrink-0"
    :class="{ 'scale-75 -mb-[0.8rem] origin-left': isCompact }"
  >
    <img src="@/assets/icon.png" alt="Logo 1" class="logo-icon w-[clamp(40px,8vw,65px)] h-[clamp(40px,8vw,65px)] object-contain bg-transparent" />
    <img src="@/assets/jrmsu_icon.png" alt="Logo 2" class="logo-icon w-[clamp(40px,8vw,65px)] h-[clamp(40px,8vw,65px)] object-contain bg-transparent" />
  </div>
</template>

<style scoped>
.header-logos {
    transition-timing-function: cubic-bezier(0.25, 1, 0.5, 1);
}
</style>
