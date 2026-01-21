<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import ParticleBackground from './components/ParticleBackground.vue';

const route = useRoute();
const transitionName = ref('fade-up');


watch(() => route.meta.index, (newIndex, oldIndex) => {

  if (newIndex === 3) {
    transitionName.value = 'fade-up';
    return;
  }
  

  if (oldIndex === 3) {
    transitionName.value = 'fade-up';
    return;
  }

  if (newIndex > oldIndex) {
    transitionName.value = 'slide-left'; 
  } else {
    transitionName.value = 'slide-right'; 
  }
});
</script>

<template>
  <ParticleBackground v-if="route.meta.showParticles" />

  <div v-if="route.meta.fullscreen" class="h-screen w-full bg-gradient-to-br from-emerald-950 to-emerald-900">
    <router-view v-slot="{ Component }">
      <transition :name="transitionName" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>

  <div v-else class="flex h-screen flex-col items-center justify-center gap-8 z-10 relative overflow-hidden">
    
    <h1 class="text-4xl font-bold transition-colors duration-300"
        :class="route.meta.showParticles ? 'text-white' : 'text-slate-900'">
      {{ route.name === 'Dashboard' ? 'Dashboard' : 'Mock Chat App' }}
    </h1>
    
    <router-view v-slot="{ Component }">
      <transition :name="transitionName" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    
  </div>
</template>

<style>

.fade-up-enter-active, .fade-up-leave-active { transition: all 0.4s ease; }
.fade-up-enter-from { opacity: 0; transform: translateY(20px); }
.fade-up-leave-to   { opacity: 0; transform: translateY(-20px); }

.slide-left-enter-active, .slide-left-leave-active { transition: all 0.3s ease-in-out; }
.slide-left-enter-from { opacity: 0; transform: translateX(100px); }
.slide-left-leave-to   { opacity: 0; transform: translateX(-100px); }

.slide-right-enter-active, .slide-right-leave-active { transition: all 0.3s ease-in-out; }
.slide-right-enter-from { opacity: 0; transform: translateX(-100px); }
.slide-right-leave-to   { opacity: 0; transform: translateX(100px); }
</style>