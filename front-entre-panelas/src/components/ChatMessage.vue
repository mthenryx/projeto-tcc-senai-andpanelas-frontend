<template>
    <div class="message-wrapper" :class="remetente">
        <div v-if="remetente === 'chefinho'" class="avatar-container">
            <img src="/icon chefinho.png" alt="Chefinho IA" class="avatar-img" />
        </div>
        <div class="message-bubble" :class="remetente">
            <div v-if="remetente === 'chefinho'" class="message-content" v-html="textoFormatado"></div>
            <div v-else class="message-content">
                {{ texto }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    texto: {
        type: String,
        required: true
    },
    remetente: {
        type: String,
        default: 'chefinho',
        validator: (value) => ['chefinho', 'user'].includes(value)
    }
});


const textoFormatado = computed(() => {
    if (!props.texto) return '';
    return props.texto
        .replace(/\n/g, '<br>')
        .replace(/• (.*?)(<br>|$)/g, '<ul><li>$1</li></ul>');
});
</script>

<style scoped>
.message-wrapper {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
    width: 100%;
}

.message-wrapper.user {
    justify-content: flex-end;
}

.message-wrapper.chefinho {
    justify-content: flex-start;
}

.avatar-container {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f7c948;
}

.avatar-img {
    width: 30px;
    height: 30px;
    object-fit: cover;
}

.message-bubble {
    max-width: 80%;
    padding: 14px 18px;
    font-family: "Inter", sans-serif;
    font-size: 14px;
    line-height: 1.5;
    box-sizing: border-box;
}

.message-bubble.chefinho {
    background-color: #ffffff;
    border: 1px solid #f3efea;
    border-radius: 18px;
    color: #4a2512;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.message-bubble.user {
    background-color: #72bca5;
    color: #ffffff;
    border-radius: 20px 20px 0px 20px;
    font-weight: 500;
}

.message-content :deep(ul) {
    margin: 6px 0;
    padding-left: 20px;
}

.message-content :deep(li) {
    margin-bottom: 4px;
}
</style>