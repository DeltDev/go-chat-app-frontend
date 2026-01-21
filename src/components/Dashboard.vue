<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; 
import api from '../services/api';

const router = useRouter(); 

const username = ref('');

const rooms = ref([]);
const isLoadingRooms = ref(false);
const showCreateModal = ref(false);
const newRoomName = ref('');
const isCreatingRoom = ref(false);
const errorMessage = ref('');

onMounted(async () => {
  try {
    const response = await api.get('/check-auth');
    username.value = response.data.user || 'User';
  } catch (err) {
    console.error("Failed to get user info", err);
  }
  fetchRooms();
});

const fetchRooms = async () => {
  isLoadingRooms.value = true;
  errorMessage.value = '';
  try {
    const response = await api.get('/ws/getRooms');
    rooms.value = response.data || [];
  } catch (err) {
    console.error("Failed to fetch rooms", err);
    errorMessage.value = 'Failed to load rooms';
  } finally {
    isLoadingRooms.value = false;
  }
};

const createRoom = async () => {
  if (!newRoomName.value.trim()) {
    errorMessage.value = 'Room name is required';
    return;
  }
  
  isCreatingRoom.value = true;
  errorMessage.value = '';
  
  try {
    const roomId = crypto.randomUUID();
    await api.post('/ws/createRoom', {
      id: roomId,
      name: newRoomName.value.trim()
    });
    
    newRoomName.value = '';
    showCreateModal.value = false;
    await fetchRooms();
  } catch (err) {
    console.error("Failed to create room", err);
    errorMessage.value = err.response?.data?.error || 'Failed to create room';
  } finally {
    isCreatingRoom.value = false;
  }
};

const openCreateModal = () => {
  errorMessage.value = '';
  newRoomName.value = '';
  showCreateModal.value = true;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
  newRoomName.value = '';
  errorMessage.value = '';
};

const joinRoom = (room) => {
  router.push({
    path: `/chat/${room.id}`,
    query: { name: room.name }
  });
};

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
  <div class="w-full max-w-2xl px-4">

    <div class="p-6 sm:p-8 rounded-2xl bg-emerald-900/90 backdrop-blur-sm border border-emerald-700 shadow-xl">

      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold text-emerald-100">Welcome, {{ username }}!</h1>
          <p class="text-emerald-400 text-sm mt-1">Manage your chat rooms</p>
        </div>
        <button 
          @click="handleLogout"
          class="py-2 px-4 text-sm font-medium rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors focus:outline-none cursor-pointer shadow-sm hover:shadow-md"
        >
          Logout
        </button>
      </div>

      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-emerald-200">Available Rooms</h2>
        <button 
          @click="openCreateModal"
          class="flex items-center gap-2 py-2 px-4 text-sm font-medium rounded-lg text-white bg-emerald-500 hover:bg-emerald-600 transition-colors focus:outline-none cursor-pointer shadow-sm hover:shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Room
        </button>
      </div>

      <div v-if="errorMessage && !showCreateModal" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
        {{ errorMessage }}
      </div>

      <div v-if="isLoadingRooms" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>

      <div v-else-if="rooms.length === 0" class="text-center py-12 bg-emerald-800/50 rounded-xl border border-dashed border-emerald-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-emerald-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p class="text-emerald-300 font-medium">No rooms available</p>
        <p class="text-emerald-500 text-sm mt-1">Create a new room to get started</p>
      </div>

      <div v-else class="space-y-3">
        <div 
          v-for="room in rooms" 
          :key="room.id"
          class="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-800 to-emerald-700 rounded-xl border border-emerald-600 hover:border-emerald-500 transition-all hover:shadow-sm group"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <div>
              <h3 class="font-medium text-emerald-100">{{ room.name }}</h3>
              <p class="text-xs text-emerald-400">ID: {{ room.id.substring(0, 8) }}...</p>
            </div>
          </div>
          <button 
            @click="joinRoom(room)"
            class="py-2 px-4 text-sm font-medium rounded-lg text-white bg-emerald-500 hover:bg-emerald-600 transition-colors focus:outline-none cursor-pointer shadow-sm opacity-0 group-hover:opacity-100"
          >
            Join
          </button>
        </div>
      </div>

      <button 
        v-if="!isLoadingRooms"
        @click="fetchRooms"
        class="mt-6 w-full py-2 px-4 text-sm font-medium rounded-lg text-emerald-200 bg-emerald-800 hover:bg-emerald-700 transition-colors focus:outline-none cursor-pointer"
      >
        Refresh Rooms
      </button>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div 
          v-if="showCreateModal" 
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="closeCreateModal"
        >
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          
          <div class="relative w-full max-w-md bg-emerald-900 rounded-2xl shadow-2xl p-6 transform transition-all border border-emerald-700">
            <h3 class="text-xl font-bold text-emerald-100 mb-4">Create New Room</h3>

            <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
              {{ errorMessage }}
            </div>
            
            <form @submit.prevent="createRoom">
              <div class="mb-6">
                <label class="text-emerald-200 text-sm font-medium mb-2 block">Room Name</label>
                <input 
                  v-model="newRoomName"
                  type="text"
                  placeholder="Enter room name"
                  class="w-full text-emerald-100 text-sm border border-emerald-600 bg-emerald-800 px-4 py-3 rounded-lg outline-emerald-500 focus:border-emerald-400 transition-colors placeholder-emerald-500"
                  :disabled="isCreatingRoom"
                />
              </div>
              
              <div class="flex gap-3">
                <button 
                  type="button"
                  @click="closeCreateModal"
                  class="flex-1 py-2.5 px-4 text-sm font-medium rounded-lg text-emerald-200 bg-emerald-800 hover:bg-emerald-700 transition-colors focus:outline-none cursor-pointer"
                  :disabled="isCreatingRoom"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  :disabled="isCreatingRoom || !newRoomName.trim()"
                  class="flex-1 py-2.5 px-4 text-sm font-medium rounded-lg text-white bg-emerald-500 hover:bg-emerald-600 transition-colors focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isCreatingRoom ? 'Creating...' : 'Create Room' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95) translateY(10px);
}
</style>