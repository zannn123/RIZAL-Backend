<script setup>
const emit = defineEmits(['close']);
</script>

<template>
  <div class="fixed top-0 left-0 w-full h-full bg-white z-[9999] animate-fadeIn">
    <div class="p-[10px]">
      <button 
        class="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
        @click="$emit('close')"
      >
        Close
      </button>
    </div>

    <iframe src="/RIZAL_Terms_and_Privacy.pdf" class="w-full h-[90%] border-none">
    </iframe>
  </div>
</template>
