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
                <div class="circle-btn user-avatar" :style="{ backgroundColor: getUserColor(user) }">
                    <span class="initials">{{ user.iniciais }}</span>
                </div>
                <span class="item-label" :title="user.nome">{{ user.nome }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

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

const getUserColor = (user) => {
    const colorPalette = [
        '#71B89A', '#72CE18', '#D7001E', '#8C5023', '#2A80B9',
        '#8E44AD', '#E67E22', '#16A085', '#D35400', '#C0392B',
        '#27AE60', '#2980B9', '#8E44AD', '#F39C12', '#D35400',
        '#C0392B', '#BDC3C7', '#7F8C8D', '#2C3E50', '#16A085',
        '#9B59B6', '#E74C3C', '#1ABC9C', '#34495E', '#00A8FF'
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

.user-avatar {
    border: 2px solid #FFFFFF;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.initials {
    color: #FFFFFF;
    font-size: 24px;
    font-weight: 500;
    letter-spacing: 0.5px;
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