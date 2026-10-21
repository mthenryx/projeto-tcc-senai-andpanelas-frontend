Arquivo para testar components, layout e designs

<template>
    <div class="chat-container">
        <div class="messages-list">
            <ChatMessage v-for="msg in mensagens" :key="msg.id" :texto="msg.texto" :remetente="msg.remetente" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import ChatMessage from '@/components/ChatMessage.vue';

const mensagens = ref([
    {
        id: 1,
        remetente: 'chefinho',
        texto: 'Olá! Sou o Chefinho 👨‍🍳✨ Seu assistente culinário pessoal!\n\nPosso te ajudar a:\n• Criar receitas personalizadas\n• Sugerir substituições de ingredientes\n• Explicar técnicas culinárias\n• Adaptar receitas para dietas\n\nO que vamos cozinhar hoje? 😋'
    },
    {
        id: 2,
        remetente: 'user',
        texto: 'Sugira uma receita com frango e limão'
    }
]);
</script>

<style scoped>
.chat-container {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}

.messages-list {
    display: flex;
    flex-direction: column;
}
</style>