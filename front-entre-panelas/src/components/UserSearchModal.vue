<template>
<div v-if="isOpen" class="modal-overlay" @click.self="fecharModal">
    <div class="modal-container">

        <div class="modal-header">
            <h2 class="modal-title">Buscar pessoas</h2>
            <button class="close-btn" @click="fecharModal" aria-label="Fechar">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>

        <div class="search-box-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" class="search-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
                type="text" 
                v-model="termoPesquisa" 
                placeholder="Buscar por nome ou @usuário" 
                class="search-input"
            />
        </div>

        <div class="users-scroll-list">
            <div v-for="user in usuariosFiltrados" :key="user.id" class="user-row">
                
                <div class="user-avatar" :style="{ backgroundColor: getUserColor(user) }">
                    {{ user.iniciais }}
                </div>

                <div class="user-info">
                    <span class="user-name">{{ user.nome }}</span>
                    <span class="user-username">@{{ user.username }}</span>
                </div>

                <button 
                    class="follow-btn" 
                    :class="{ 'following': user.seguindo }"
                    @click="toggleSeguir(user)"
                >
                    {{ user.seguindo ? 'Deixar de seguir' : 'Seguir' }}
                </button>
            </div>

            <div v-if="usuariosFiltrados.length === 0" class="empty-state">
                Nenhum usuário encontrado.
            </div>
        </div>

    </div>
</div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
isOpen: {
    type: Boolean,
    required: true
},
users: {
    type: Array,
    required: true,
    default: () => []
}
});

const emit = defineEmits(['close', 'update:users']);

const termoPesquisa = ref('');

const usuariosFiltrados = computed(() => {
if (!termoPesquisa.value.trim()) return props.users;

const termo = termoPesquisa.value.toLowerCase().trim();
return props.users.filter(user => 
    user.nome.toLowerCase().includes(termo) || 
    user.username.toLowerCase().includes(termo)
);
});

const toggleSeguir = (user) => {
user.seguindo = !user.seguindo;
emit('update:users', props.users);
};

const fecharModal = () => {
emit('close');
};

const getUserColor = (user) => {
const colorPalette = [
    '#71B89A', '#72CE18', '#D7001E', '#8C5023', '#2A80B9', 
    '#8E44AD', '#E67E22', '#16A085', '#D35400', '#C0392B'
];
const str = `${user.id}-${user.nome || ''}`;
let hash = 0;
for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
}
const index = Math.abs(hash) % colorPalette.length;
return colorPalette[index];
};
</script>

<style scoped>
.modal-overlay {
position: fixed;
top: 0;
left: 0;
width: 100vw;
height: 100vh;
background-color: rgba(0, 0, 0, 0.5);
display: flex;
align-items: center;
justify-content: center;
z-index: 1000;
padding: 16px;
box-sizing: border-box;
}

.modal-container {
background-color: #FAF6ED;
width: 100%;
max-width: 520px;
border-radius: 28px;
box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
display: flex;
flex-direction: column;
padding: 24px;
box-sizing: border-box;
max-height: 85vh;
}

/* Cabeçalho */
.modal-header {
display: flex;
align-items: center;
justify-content: space-between;
margin-bottom: 20px;
}

.modal-title {
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
font-size: 24px;
font-weight: 700;
color: #4A1512;
margin: 0;
}

.close-btn {
background-color: #EFE7D8;
border: none;
width: 36px;
height: 36px;
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
cursor: pointer;
color: #4A1512;
transition: background-color 0.2s;
}

.close-btn:hover {
background-color: #E2D7C3;
}

.search-box-wrapper {
position: relative;
display: flex;
align-items: center;
margin-bottom: 16px;
}

.search-input-icon {
position: absolute;
left: 18px;
width: 20px;
height: 20px;
color: #7A6B68;
}

.search-input {
width: 100%;
height: 50px;
background-color: #FFFFFF;
border: 1.5px solid #E6D9C3;
border-radius: 25px;
padding-left: 50px;
padding-right: 20px;
font-size: 15px;
color: #333333;
outline: none;
box-sizing: border-box;
transition: border-color 0.2s;
}

.search-input::placeholder {
color: #9C8E8B;
}

.search-input:focus {
border-color: #4A1512;
}

.users-scroll-list {
display: flex;
flex-direction: column;
overflow-y: auto;
max-height: 400px;
padding-right: 4px;
scrollbar-width: thin;
scrollbar-color: #D9CBB3 transparent;
}

.users-scroll-list::-webkit-scrollbar {
width: 6px;
}

.users-scroll-list::-webkit-scrollbar-thumb {
background-color: #D9CBB3;
border-radius: 10px;
}

.user-row {
display: flex;
align-items: center;
padding: 14px 8px;
border-bottom: 1px solid #EEDBCE;
}

.user-row:last-child {
border-bottom: none;
}

.user-avatar {
width: 50px;
height: 50px;
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
color: #FFFFFF;
font-weight: 600;
font-size: 18px;
flex-shrink: 0;
margin-right: 14px;
box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.user-info {
display: flex;
flex-direction: column;
flex: 1;
min-width: 0;
}

.user-name {
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
font-size: 16px;
font-weight: 700;
color: #4A1512;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
}

.user-username {
font-size: 13px;
color: #7A6B68;
margin-top: 2px;
}

.follow-btn {
background-color: #6B2125; 
color: #FFFFFF;
border: none;
padding: 8px 18px;
border-radius: 20px;
font-size: 13px;
font-weight: 600;
cursor: pointer;
transition: background-color 0.2s, transform 0.1s;
flex-shrink: 0;
}

.follow-btn:hover {
background-color: #52191C;
}

.follow-btn:active {
transform: scale(0.97);
}

.follow-btn.following {
background-color: transparent;
color: #4A1512;
border: 1.5px solid #4A1512;
}

.follow-btn.following:hover {
background-color: #F0E6D8;
}

.empty-state {
text-align: center;
padding: 30px;
color: #7A6B68;
font-size: 14px;
}
</style>