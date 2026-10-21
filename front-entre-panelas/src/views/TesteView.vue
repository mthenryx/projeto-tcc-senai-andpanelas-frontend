<template>
    <div class="chat-container">
        <div class="messages-list">
            <ChatMessage v-for="msg in mensagens" :key="msg.id" :texto="msg.texto" :remetente="msg.remetente"
                :digitando="msg.digitando" />
        </div>

        <div class="input-container">
            <input v-model="perguntaInput" type="text" placeholder="Pergunte algo ao Chefinho..."
                @keyup.enter="enviarMensagem" />
            <button @click="enviarMensagem">Enviar</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import ChatMessage from '@/components/ChatMessage.vue';

const perguntaInput = ref('');
const mensagens = ref([
    {
        id: 1,
        remetente: 'chefinho',
        texto: 'Olá! Sou o Chefinho 👨‍🍳✨ O que vamos cozinhar hoje?',
        digitando: false
    }
]);

const enviarMensagem = async () => {
    if (!perguntaInput.value.trim()) return;

    const textoUsuario = perguntaInput.value;
    perguntaInput.value = '';

    mensagens.value.push({
        id: Date.now(),
        remetente: 'user',
        texto: textoUsuario,
        digitando: false
    });

    const idTemp = Date.now() + 1;
    mensagens.value.push({
        id: idTemp,
        remetente: 'chefinho',
        texto: '',
        digitando: true
    });

    setTimeout(() => {
        const msgIa = mensagens.value.find(m => m.id === idTemp);
        if (msgIa) {
            msgIa.texto = 'Encontrei uma ótima opção! Que tal um **Frango ao Limão Siciliano** com ervas finas?';
            msgIa.digitando = false;
        }
    }, 2500);
};
</script>