<script setup>
import { ref, onMounted } from 'vue'; 
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');


const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    await api.post('/login', {
      email: email.value,
      password: password.value
    });
    
    router.push('/dashboard');
    
  } catch (error) {
    console.error(error);
    errorMessage.value = error.response?.data?.error || 'Invalid email or password';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="max-w-[480px] w-full">
    <div class="p-6 sm:p-8 rounded-2xl bg-emerald-50 border border-emerald-500 shadow-sm">
      <h1 class="text-slate-900 text-center text-3xl font-semibold">Login</h1>
      
      <form class="mt-12 space-y-6" @submit.prevent="handleLogin">
        
        <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {{ errorMessage }}
        </div>

        <div>
          <label class="text-slate-900 text-sm font-medium mb-2 block">Email</label>
          <div class="relative flex items-center">
            <input 
              v-model="email"
              name="email" 
              type="email" 
              required 
              class="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-emerald-600" 
              placeholder="Enter email" 
            />
          </div>
        </div>
        
        <div>
           <label class="text-slate-900 text-sm font-medium mb-2 block">Password</label>
           <div class="relative flex items-center">
             <input 
               v-model="password"
               name="password" 
               type="password" 
               required 
               class="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-emerald-600" 
               placeholder="Enter password" 
             />
           </div>
        </div>

        <div class="!mt-12">
          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full py-2 px-4 text-[15px] font-medium tracking-wide rounded-md text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none cursor-pointer disabled:opacity-50"
          >
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>
        </div>

        <p class="text-slate-900 text-sm !mt-6 text-center">
          Don't have an account? 
          <router-link 
            to="/register" 
            class="text-emerald-600 hover:underline ml-1 whitespace-nowrap font-semibold"
          >
            Register here
          </router-link>
        </p>
      </form>
    </div>
  </div>
</template>