<script setup>
import { ref, computed } from 'vue';
import ParticleBackground from './components/ParticleBackground.vue';
import LoginForm from './components/LoginForm.vue';
import RegisterForm from './components/RegisterForm.vue';

const currentView = ref('Login'); 
const direction = ref('slide-left');

const activeComponent = computed(() => {
  return currentView.value === 'Login' ? LoginForm : RegisterForm;
});

const showRegister = () => {
  direction.value = 'slide-left';
  currentView.value = 'Register';
};

const showLogin = () => {
  direction.value = 'slide-right';
  currentView.value = 'Login';
};
</script>

<template>
  <ParticleBackground />
  
  <div class="flex h-screen flex-col items-center justify-center gap-8 z-10 relative overflow-hidden">
    
    <Transition name="fade-up" mode="out-in">
      <h1 :key="currentView" class="text-white text-4xl font-bold">
        Mock Chat App
      </h1>
    </Transition>
    
    <Transition :name="direction" mode="out-in">
      <component 
        :is="activeComponent" 
        @to-register="showRegister" 
        @to-login="showLogin"
      />
    </Transition>
  </div>
</template>

<style>

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.3s ease-in-out; 
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease-in-out;
}

.slide-left-enter-from { opacity: 0; transform: translateX(100px); }
.slide-left-leave-to   { opacity: 0; transform: translateX(-100px); }

.slide-right-enter-from { opacity: 0; transform: translateX(-100px); }
.slide-right-leave-to   { opacity: 0; transform: translateX(100px); }
</style>