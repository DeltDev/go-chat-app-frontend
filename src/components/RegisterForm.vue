<script setup>
import { ref, onMounted } from 'vue'; 
import { useRouter } from 'vue-router';
import api from '../services/api'; 

const router = useRouter();

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const isLoading = ref(false);
const errorMessage = ref('');


const handleRegister = async () => {
  errorMessage.value = '';

  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Passwords do not match.";
    return;
  }
  
  isLoading.value = true;

  try {
    await api.post('/signup', {
      username: username.value,
      email: email.value,
      password: password.value
    });

    alert('Registration successful! Please login.');
    router.push('/login');
    
  } catch (error) { 
    console.error(error);
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data.error || 'Registration failed.';
    } else {
      errorMessage.value = 'Network error. Is the backend running?';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="max-w-[480px] w-full">
    <div class="p-6 sm:p-8 rounded-2xl bg-emerald-50 border border-emerald-500 shadow-sm">
      <h1 class="text-slate-900 text-center text-3xl font-semibold">Register</h1>
      
      <form class="mt-12 space-y-6" @submit.prevent="handleRegister">
        
        <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span class="block sm:inline">{{ errorMessage }}</span>
        </div>

        <div>
          <label class="text-slate-900 text-sm font-medium mb-2 block">Username</label>
          <div class="relative flex items-center">
            <input 
              v-model="username" 
              name="username" 
              type="text" 
              required 
              class="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-emerald-600" 
              placeholder="Enter username" 
            />
             </div>
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
              placeholder="Create password" 
            />
            </div>
        </div>

        <div>
          <label class="text-slate-900 text-sm font-medium mb-2 block">Confirm Password</label>
          <div class="relative flex items-center">
            <input 
              v-model="confirmPassword"
              name="confirm_password" 
              type="password" 
              required 
              class="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-emerald-600" 
              placeholder="Confirm password" 
            />
            </div>
        </div>

        <div class="!mt-12">
          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full py-2 px-4 text-[15px] font-medium tracking-wide rounded-md text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none cursor-pointer disabled:bg-emerald-300 disabled:cursor-not-allowed"
          >
            {{ isLoading ? 'Registering...' : 'Register' }}
          </button>
        </div>
        
        <p class="text-slate-900 text-sm !mt-6 text-center">
          Already have an account? 
          <router-link 
            to="/login"
            class="text-emerald-600 hover:underline ml-1 whitespace-nowrap font-semibold"
          >
            Login here
          </router-link>
        </p>
      </form>
    </div>
  </div>
</template>