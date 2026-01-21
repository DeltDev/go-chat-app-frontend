<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ChatBubble from './ChatBubble.vue';
import api from '../services/api';

const route = useRoute();
const router = useRouter();

const userId = ref('');
const username = ref('');
const roomId = ref('');
const roomName = ref('');

const messages = ref([]);
const newMessage = ref('');
const isConnected = ref(false);
const isConnecting = ref(true);
const clients = ref([]);

let ws = null;
const messagesContainer = ref(null);

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

watch(messages, () => {
  scrollToBottom();
}, { deep: true });

const connectWebSocket = () => {
  const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';
  const wsEndpoint = `${wsUrl}/api/v1/chat/ws/joinRoom/${roomId.value}?userId=${userId.value}&username=${username.value}`;
  
  ws = new WebSocket(wsEndpoint);
  
  ws.onopen = () => {
    isConnected.value = true;
    isConnecting.value = false;
    console.log('WebSocket connected');
  };
  
  ws.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      messages.value.push(message);
    } catch (e) {
      console.error('Failed to parse message:', e);
    }
  };
  
  ws.onclose = () => {
    isConnected.value = false;
    console.log('WebSocket disconnected');
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    isConnecting.value = false;
  };
};

const sendMessage = () => {
  if (!newMessage.value.trim() || !ws || ws.readyState !== WebSocket.OPEN) {
    return;
  }
  
  ws.send(newMessage.value.trim());
  newMessage.value = '';
};

const fetchClients = async () => {
  try {
    const response = await api.get(`/ws/getClients/${roomId.value}`);
    clients.value = response.data || [];
  } catch (err) {
    console.error('Failed to fetch clients:', err);
  }
};

const leaveRoom = () => {
  if (ws) {
    ws.close();
  }
  router.push('/dashboard');
};

onMounted(async () => {
  try {
    const response = await api.get('/check-auth');
    userId.value = response.data.id || '';
    username.value = response.data.user || '';
  } catch (err) {
    console.error('Failed to get user info:', err);
    router.push('/login');
    return;
  }

  roomId.value = route.params.roomId;
  roomName.value = route.query.name || 'Chat Room';
  
  if (!roomId.value) {
    router.push('/dashboard');
    return;
  }

  connectWebSocket();

  fetchClients();
});

onUnmounted(() => {
  if (ws) {
    ws.close();
  }
});
</script>

<template>
  <div class="w-full h-screen max-w-4xl mx-auto flex flex-col p-4">
    <div class="flex-1 flex flex-col bg-emerald-900/90 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-700 overflow-hidden">

      <div class="flex items-center justify-between px-6 py-4 border-b border-emerald-700 bg-gradient-to-r from-emerald-800 to-emerald-900">
        <div class="flex items-center gap-3">
          <button 
            @click="leaveRoom"
            class="p-2 rounded-lg hover:bg-emerald-700/80 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 class="text-lg font-bold text-emerald-100">{{ roomName }}</h1>
            <p class="text-xs text-emerald-400">{{ clients.length }} participant{{ clients.length !== 1 ? 's' : '' }}</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <div 
            class="w-2 h-2 rounded-full"
            :class="isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'"
          ></div>
          <span class="text-xs text-emerald-400">
            {{ isConnecting ? 'Connecting...' : (isConnected ? 'Connected' : 'Disconnected') }}
          </span>
        </div>
      </div>

      <div 
        ref="messagesContainer"
        class="flex-1 overflow-y-auto px-6 py-4 bg-gradient-to-b from-emerald-800/50 to-emerald-900"
      >

        <div v-if="isConnecting" class="flex items-center justify-center h-full">
          <div class="text-center">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500 mx-auto mb-3"></div>
            <p class="text-emerald-400 text-sm">Joining room...</p>
          </div>
        </div>

        <div v-else-if="messages.length === 0" class="flex items-center justify-center h-full">
          <div class="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-emerald-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p class="text-emerald-300 font-medium">No messages yet</p>
            <p class="text-emerald-500 text-sm mt-1">Be the first to say hello!</p>
          </div>
        </div>

        <div v-else class="space-y-1">
          <ChatBubble 
            v-for="(msg, index) in messages" 
            :key="index"
            :message="msg"
            :isOwn="msg.username === username"
          />
        </div>
      </div>

      <div class="px-6 py-4 border-t border-emerald-700 bg-emerald-900">
        <form @submit.prevent="sendMessage" class="flex items-center gap-3">
          <div class="flex-1 relative">
            <input 
              v-model="newMessage"
              type="text"
              placeholder="Type your message..."
              :disabled="!isConnected"
              class="w-full px-4 py-3 pr-12 rounded-xl border border-emerald-600 bg-emerald-800 text-emerald-100 text-sm placeholder-emerald-500 focus:outline-none focus:border-emerald-400 focus:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              @keyup.enter="sendMessage"
            />
          </div>
          <button 
            type="submit"
            :disabled="!isConnected || !newMessage.trim()"
            class="p-3 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
