<script setup>
const emit = defineEmits(['to-register']);
</script>

<template>
  <div class="max-w-[480px] w-full">
    <div class="p-6 sm:p-8 rounded-2xl bg-emerald-50 border border-emerald-500 shadow-sm">
      <h1 class="text-slate-900 text-center text-3xl font-semibold">Login</h1>
      <form class="mt-12 space-y-6">
        <div>
          <label class="text-slate-900 text-sm font-medium mb-2 block">Email</label>
          <div class="relative flex items-center">
            <input name="email" type="email" required class="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-emerald-600" placeholder="Enter email" />
             </div>
        </div>
        <div>
           <label class="text-slate-900 text-sm font-medium mb-2 block">Password</label>
           <div class="relative flex items-center">
             <input name="password" type="password" required class="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-emerald-600" placeholder="Enter password" />
             </div>
        </div>

        <div class="!mt-12">
          <button type="button" class="w-full py-2 px-4 text-[15px] font-medium tracking-wide rounded-md text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none cursor-pointer">
            Login
          </button>
        </div>

        <p class="text-slate-900 text-sm !mt-6 text-center">
          Don't have an account? 
          <a 
            href="#" 
            @click.prevent="$emit('to-register')" 
            class="text-emerald-600 hover:underline ml-1 whitespace-nowrap font-semibold"
          >
            Register here
          </a>
        </p>
      </form>
    </div>
  </div>
</template>