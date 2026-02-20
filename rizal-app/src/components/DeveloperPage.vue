<script setup>
import { ref } from 'vue';

// Import local images
import scrammerImg from '@/assets/dev/scrammer.png';
import member3Img from '@/assets/dev/member3.jpg';
import docSpecialistImg from '@/assets/dev/doc_specialist.png';

const emit = defineEmits(['back']);

const members = ref([
    {
        name: "Lance Celicious",
        role: "Scrammer",
        desc: "Responsible for facilitating agile processes, removing blockers, and ensuring the team delivers efficiently.",
        course: "BSCPE 2",
        socialLink: "https://www.facebook.com/100077976213350/",
        socialType: "facebook",
        image: scrammerImg
    },
    {
        name: "Member 2",
        role: "Project Manager",
        desc: "Responsible for project scheduling, feature prioritization, and team coordination to deliver a responsive web application.",
        course: "BSCPE 2",
        socialLink: "https://www.facebook.com",
        socialType: "facebook",
        image: member3Img // Fallback from original
    },
    {
        name: "Gloryzann H. Aclao",
        role: "Front End Developer",
        desc: "Tasked with crafting responsive user interfaces, implementing dynamic interactions, and ensuring a smooth experience across all devices.",
        course: "BSCPE 2",
        socialLink: "https://www.linkedin.com/in/gloryzann-aclao-025421366/",
        socialType: "linkedin",
        image: member3Img
    },
    {
        name: "Member 4",
        role: "Backend Developer",
        desc: "Responsible for developing and maintaining server-side logic, managing database interactions, and ensuring secure data flow across the system.",
        course: "BSCPE 2",
        socialLink: "https://www.facebook.com",
        socialType: "facebook",
        image: member3Img // Fallback
    },
    {
        name: "Member 5",
        role: "Asst. Backend Developer",
        desc: "Assists in building APIs, handling data models, and supporting the lead backend developer in system architecture decisions.",
        course: "BSCPE 2",
        socialLink: "https://www.facebook.com",
        socialType: "facebook",
        image: member3Img // Fallback
    },
    {
        name: "Member 6",
        role: "QA Tester",
        desc: "Tasked with verifying functionality, identifying UI/UX issues, and ensuring a consistent experience across devices and browsers.",
        course: "BSCPE 2",
        socialLink: "https://www.facebook.com",
        socialType: "facebook",
        image: member3Img // Fallback
    },
    {
        name: "Ganriel Ryan Duterte",
        role: "Documentation Specialist",
        desc: "Responsible for writing technical documentation, user guides, and maintaining project records for future reference.",
        course: "BSCPE 2",
        socialLink: "https://www.facebook.com/100041201544146/",
        socialType: "facebook",
        image: docSpecialistImg
    }
]);

const tooltip = ref({
    visible: false,
    top: 0,
    left: 0,
    opacity: 0,
    member: {},
    arrowClass: '',
    isTopRow: true
});

let hideTimeout = null;

const showTooltip = (event, member, index) => {
    // Clear any pending hide
    if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
    }

    const rect = event.target.getBoundingClientRect();
    const isTopRow = index < 4;
    
    // Slight vertical offset to bridge the gap
    const gap = 10; 
    
    tooltip.value = {
        visible: true,
        member: member,
        left: rect.left + rect.width / 2,
        top: isTopRow ? rect.bottom + gap : rect.top - gap,
        opacity: 1,
        isTopRow: isTopRow,
        arrowClass: isTopRow ? 'bottom-[100%] border-r-0 border-b-0 border-l border-t top-[-6px]' : 'top-[100%] bottom-[-6px]'
    };
};

const hideTooltip = () => {
    // Delay hiding to allow moving mouse into the tooltip
    hideTimeout = setTimeout(() => {
        tooltip.value.visible = false;
        tooltip.value.opacity = 0;
    }, 200); // 200ms grace period
};

const cancelHide = () => {
    if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
    }
};
</script>

<template>
  <div class="fixed top-0 left-0 w-full h-full z-[10000] bg-black flex flex-col items-center justify-center animate-fadeIn">
    <div class="w-full max-w-[900px] h-full flex flex-col overflow-hidden p-[1rem_1.5rem] relative">
      <!-- Back Button -->
      <button 
        class="inline-flex items-center gap-[0.5rem] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,193,7,0.25)] text-[#ffc107] p-[0.5rem_1rem] rounded-[12px] text-[0.8rem] font-semibold cursor-pointer transition-all duration-300 mb-[0.5rem] hover:bg-[rgba(255,193,7,0.12)] hover:border-[rgba(255,193,7,0.5)] hover:-translate-x-[3px] hover:shadow-[0_4px_15px_rgba(255,193,7,0.15)]"
        @click="$emit('back')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
        </svg>
        Back
      </button>

      <!-- Branding -->
      <div class="text-center p-[0.4rem_0.5rem]">
        <div class="text-[2rem] mb-[0.3rem] animate-pulse">⚡</div>
        <h2 class="text-[1.4rem] font-extrabold text-white tracking-[1px] mb-[0.2rem]">Byte<span class="text-[#ffc107]">Force</span></h2>
        <p class="text-[0.7rem] text-[#888] mb-[0.4rem]">The people behind R.I.Z.A.L.</p>
        <div class="w-[40px] h-[2px] bg-gradient-to-r from-[#4b4eff] to-[#ffc107] rounded-[2px] mx-auto mb-[0.4rem]"></div>
        <p class="text-[0.7rem] text-[#999] leading-[1.4] max-w-[260px] mx-auto">We build smart solutions for modern campuses. Innovation through code.</p>
      </div>

      <!-- Grid -->
      <h3 class="text-[0.95rem] font-bold text-white mb-[0.5rem] text-center mt-2">The <span class="text-[#ffc107]">Team</span></h3>
      
      <div class="dev-grid flex flex-wrap justify-center gap-[0.6rem] pt-0 pb-0 flex-1 content-start overflow-y-auto overflow-x-hidden w-full scrollbar-thin">
         
         <!-- Dynamic Member Cards -->
         <div 
            v-for="(member, index) in members" 
            :key="index"
            class="glass-card flex-[0_1_calc(25%-0.6rem)] min-w-[140px] max-w-[200px] relative rounded-[16px] cursor-pointer z-1 transition-transform duration-300 hover:scale-105 hover:z-[1000] group"
         >
            <div class="glass-card-inner flex flex-col items-center text-center p-[0.8rem_0.5rem] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-[16px] backdrop-blur-[12px] group-hover:bg-[rgba(75,78,255,0.08)] group-hover:border-[rgba(75,78,255,0.25)]">
                <div class="dev-avatar w-[clamp(50px,10vw,80px)] h-[clamp(50px,10vw,80px)] rounded-full overflow-hidden border-2 border-[rgba(255,255,255,0.08)] mb-2 group-hover:border-[rgba(75,78,255,0.25)]">
                    <img :src="member.image" class="w-full h-full object-cover">
                </div>
                <span class="text-[0.75rem] font-semibold text-[#eee]">{{ member.name }}</span>
                <span class="text-[0.65rem] text-[#888]">{{ member.role }}</span>

                <!-- Hover Events Overlay -->
                <div 
                    class="absolute inset-0 z-10" 
                    @mouseenter="showTooltip($event, member, index)" 
                    @mouseleave="hideTooltip"
                ></div>
            </div>
         </div>

      </div>

      <!-- Teleported Tooltip -->
      <Teleport to="body">
          <div 
            v-if="tooltip.visible"
            class="fixed w-[220px] p-4 bg-[rgba(18,18,30,0.96)] rounded-[12px] border border-[rgba(75,78,255,0.2)] z-[10001] flex flex-col items-center text-center shadow-xl pointer-events-auto transition-opacity duration-200"
            @mouseenter="cancelHide"
            @mouseleave="hideTooltip"
            :style="{ 
                top: tooltip.top + 'px', 
                left: tooltip.left + 'px', 
                opacity: tooltip.opacity,
                transform: tooltip.isTopRow ? 'translateX(-50%)' : 'translateX(-50%) translateY(-100%)'
            }"
          >
               <p class="text-[0.75rem] text-[#ccc] mb-2">{{ tooltip.member.desc }}</p>
               <span class="text-[0.65rem] text-[#888] font-bold uppercase bg-[rgba(255,255,255,0.05)] px-2 py-1 rounded">{{ tooltip.member.course }}</span>
               
               <a :href="tooltip.member.socialLink" target="_blank" 
                  class="mt-[0.3rem] inline-flex items-center gap-[0.3rem] font-semibold border border-[rgba(255,255,255,0.1)] text-[0.75rem] text-white no-underline px-[0.9rem] py-[0.4rem] rounded-[20px] pointer-events-auto"
                  :class="tooltip.member.socialType === 'linkedin' ? 'bg-[#0A66C2]' : 'bg-[#1877F2]'"
               >
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                       <path v-if="tooltip.member.socialType === 'facebook'" d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                       <path v-else d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
                   </svg>
                   {{ tooltip.member.socialType === 'linkedin' ? 'LinkedIn' : 'Facebook' }}
               </a>
               
               <!-- Arrow -->
               <div 
                  class="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-[rgba(18,18,30,0.96)] rotate-45 border-r border-b border-[rgba(75,78,255,0.2)]"
                  :class="tooltip.arrowClass"
               ></div>
          </div>
      </Teleport>
    </div>
  </div>
</template>

<style scoped>
/* Custom flex basis fallback if calc() behaves oddly in Tailwind classes sometimes */
.glass-card {
    flex: 0 1 calc(25% - 0.6rem);
}
@media (max-width: 380px) {
    .glass-card {
        flex: 0 1 calc(33.33% - 0.5rem);
    }
}
</style>
