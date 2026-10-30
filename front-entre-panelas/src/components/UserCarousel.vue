<template>
    <div class="user-carousel-container">
        <div class="search-item">
            <button class="circle-btn search-btn" @click="handleSearchClick" aria-label="Pesquisar" type="button">
                <img src="../../public/iconPaginas/lupa_icon_cinza.png" alt="Lupa para pesquisa" class="search-icon">
            </button>
            <span class="item-label">Pesquisa</span>
        </div>

        <div class="carousel-scroll">
            <div v-for="user in users" :key="user.id" class="user-item">
                <UserAvatar 
                    :fotoUrl="user.fotoUrl" 
                    :nome="user.nome" 
                    :iniciais="user.iniciais" 
                    tamanho="72"
                    borda="white"
                    sombra
                    :tamanhoFonte="24"
                    :pesoFonte="500"
                />
                <span class="item-label" :title="user.nome">{{ user.nome }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import UserAvatar from '@/components/UserAvatar.vue';

const props = defineProps({
    users: {
        type: Array,
        required: true,
        default: () => []
    }
});

const emit = defineEmits(['search-click']);

const handleSearchClick = () => {
    emit('search-click');
};
</script>

<style scoped>
.user-carousel-container {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 12px 16px;
    background-color: transparent;
    box-sizing: border-box;
}

.search-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    margin-right: 20px;
    z-index: 2;
}

.carousel-scroll {
    display: flex;
    align-items: center;
    gap: 20px;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-behavior: smooth;
    white-space: nowrap;
    cursor: pointer;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.carousel-scroll::-webkit-scrollbar {
    display: none;
}

.user-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    width: 80px;
}

.circle-btn {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    box-sizing: border-box;
}

.search-btn {
    background-color: #FFFFFF;
    border: 1.5px solid var(--cinza-branco);
    cursor: pointer;
    padding: 0;
    transition: transform 0.15s ease, background-color 0.15s ease;
}

.search-btn:hover {
    background-color: #F5F1E8;
    transform: scale(1.03);
}

.search-btn:active {
    transform: scale(0.97);
}

.search-icon {
    width: 28px;
    height: 28px;
}

.item-label {
    margin-top: 8px;
    font-size: 14px;
    color: #333333;
    text-align: center;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>