<script setup>
defineProps({
  message: {
    type: Object,
    required: true
  },
  isOwn: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <div 
    class="flex w-full mb-3"
    :class="isOwn ? 'justify-end' : 'justify-start'"
  >
    <div 
      class="max-w-[75%] relative group"
      :class="isOwn ? 'order-2' : 'order-1'"
    >
      <p 
        class="text-xs font-medium mb-1 px-1"
        :class="isOwn ? 'text-right text-emerald-300' : 'text-left text-emerald-400'"
      >
        {{ isOwn ? 'You' : message.username }}
      </p>
      <div 
        class="px-4 py-2.5 rounded-2xl shadow-sm transition-shadow hover:shadow-md"
        :class="[
          isOwn 
            ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-br-md' 
            : 'bg-emerald-800 border border-emerald-600 text-emerald-100 rounded-bl-md'
        ]"
      >
        <p class="text-sm leading-relaxed break-words whitespace-pre-wrap">
          {{ message.content }}
        </p>
      </div>
      <div 
        class="absolute bottom-0 w-3 h-3"
        :class="[
          isOwn 
            ? 'right-0 translate-x-1/2 bg-emerald-600' 
            : 'left-0 -translate-x-1/2 bg-emerald-800 border-l border-b border-emerald-600'
        ]"
        style="clip-path: polygon(0 0, 100% 0, 100% 100%);"
        :style="isOwn ? {} : { transform: 'translateX(-50%) scaleX(-1)' }"
      ></div>
    </div>
  </div>
</template>
