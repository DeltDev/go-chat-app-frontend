<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router'; 
import api from '../services/api';

const router = useRouter(); 


const handleLogout = async () => {
  try {
    await api.get('/logout'); 
  } catch (err) {
    console.error("Logout error", err);
  } finally {
    router.push('/login'); 
  }
};
</script>

<template>
  <div class="max-w-[480px] w-full">
    <div class="p-6 sm:p-8 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200 shadow-xl text-center">
      <h1 class="text-2xl font-bold text-slate-800 mb-4">Welcome Home!</h1>
      <p class="text-slate-600 mb-8">You have successfully authenticated via JWT.</p>
      
      <button 
        @click="handleLogout"
        class="w-full py-2 px-4 text-[15px] font-medium tracking-wide rounded-md text-white bg-red-500 hover:bg-red-600 transition-colors focus:outline-none cursor-pointer"
      >
        Logout
      </button>
    </div>
  </div>
</template>