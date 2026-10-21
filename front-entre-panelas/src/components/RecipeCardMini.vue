<template>
    <div class="recipe-card-mini" @click="$emit('click')">
        <div class="recipe-image-container" :style="{ backgroundImage: `url(${imagemUrl})` }">
            <span class="difficulty-badge" :class="dificuldadeClass">
                {{ dificuldade }}
            </span>
        </div>

        <div class="recipe-content">
            <h3 class="recipe-title">{{ titulo }}</h3>

            <div class="recipe-metadata">
                <div class="meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>{{ tempo }}</span>
                </div>

                <div class="meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span>{{ porcoes }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    id: { type: [Number, String], required: true },
    imagemUrl: { type: String, required: true },
    titulo: { type: String, required: true },
    tempo: { type: String, required: true },
    porcoes: { type: String, required: true },
    dificuldade: { type: String, required: true }
});

defineEmits(['click']);

const dificuldadeClass = computed(() => {
    const diff = props.dificuldade.toLowerCase().trim();
    if (diff.includes('fácil') || diff.includes('facil')) return 'badge-facil';
    if (diff.includes('médio') || diff.includes('medio')) return 'badge-medio';
    return 'badge-dificil';
});
</script>

<style scoped>
.recipe-card-mini {
    background-color: #FFFFFF;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
    border: 1px solid var(--bege);
    width: 100%;
    max-width: 320px;
    font-family: "Inter", sans-serif;
    cursor: pointer;
}

.recipe-image-container {
    height: 180px;
    background-size: cover;
    background-position: center;
    position: relative;
    display: flex;
    justify-content: flex-end;
    padding: 12px;
    box-sizing: border-box;
}

.difficulty-badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    color: #FFFFFF;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    height: fit-content;
}

.badge-facil {
    background-color: var(--verde);
}

.badge-medio {
    background-color: var(--amarelo);
}

.badge-dificil {
    background-color: var(--vermelho);
}

.recipe-content {
    padding: 16px;
    background-color: var(--cinza-claro);
}

.recipe-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--marrom);
    margin-bottom: 12px;
    line-height: 1.3;
}

.recipe-metadata {
    display: flex;
    gap: 16px;
    font-size: 13px;
    color: var(--cinza);
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
}

.meta-item svg {
    color: var(--marrom);
}
</style>