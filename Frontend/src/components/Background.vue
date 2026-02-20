<template>
  <div class="background-wrapper">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
  </div>
</template>

<style scoped>
.background-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  pointer-events: none; /* Ensure clicks pass through */
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: float 20s infinite ease-in-out alternate;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: #0a1f44;
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: #1a237e;
  bottom: -50px;
  right: -50px;
  animation-delay: -5s;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: #ffc107;
  top: 40%;
  left: 40%;
  opacity: 0.15;
  animation-duration: 25s;
}

@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, 50px) scale(1.1); }
  100% { transform: translate(-20px, -30px) scale(0.9); }
}
</style>
