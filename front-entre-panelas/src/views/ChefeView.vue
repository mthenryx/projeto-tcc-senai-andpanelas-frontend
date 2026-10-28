<template>
    <div class="chefe-view-layout">
        <!-- 1. Componente de Menu Lateral Existente -->
        <MenuLateral />

        <!-- 2. Área Principal do Chat (Centro) -->
        <main class="chat-main-area">
            <!-- Header do Chat com Status Dinâmico -->
            <header class="chat-header">
                <div class="chefe-info">
                    <button class="back-btn" @click="voltar" aria-label="Voltar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                    </button>
                    <div class="chefe-avatar-header">
                        <img src="/icon chefinho.png" alt="Chefinho IA" />
                    </div>
                    <div>
                        <h2 class="chefe-title-header">Chefinho</h2>
                        <span class="chefe-subtitle">
                            <img src="../../public/icon_varinha_magica.png" alt="icon varinha"> 
                            Assistente culinário IA
                        </span>
                    </div>
                </div>

                <!-- Status Online/Offline Dinâmico -->
                <div class="status-indicator-badge" :class="{ 'offline': !statusOnline }">
                    <span class="status-dot"></span>
                    {{ statusOnline ? 'Online' : 'Offline' }}
                </div>
            </header>

            <div class="messages-scroll-area" ref="scrollContainer">
                <ChatMessage 
                    v-for="(msg, index) in mensagensAtuais" 
                    :key="index"
                    :texto="msg.texto"
                    :remetente="msg.remetente"
                    :digitando="msg.digitando"
                />
            </div>

            <div class="chat-input-section">

                <div class="suggestions-chips">
                    <button 
                        v-for="(sugestao, index) in sugestoesPreProntas" 
                        :key="index"
                        class="chip-btn"
                        @click="enviarMensagem(sugestao)"
                    >
                        {{ sugestao }}
                    </button>
                </div>

                <div class="input-wrapper">
                    <input 
                        type="text" 
                        v-model="novaMensagemTexto" 
                        @keyup.enter="enviarMensagem(novaMensagemTexto)"
                        placeholder="Pergunte ao Chefinho..." 
                        class="chat-input"
                    />
                    <button 
                        class="send-btn" 
                        @click="enviarMensagem(novaMensagemTexto)"
                        aria-label="Enviar mensagem"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
            </div>
        </main>

        <aside class="recent-conversations-sidebar">
            <h3 class="sidebar-title">Conversas recentes</h3>

            <div class="conversations-list">
                <div 
                    v-for="conversa in conversasRecentes" 
                    :key="conversa.id" 
                    class="conversation-item"
                    @click="carregarConversa(conversa.id)"
                >
                    <span class="conversation-text">{{ conversa.titulo }}</span>
                   
                    <div class="dropdown-container" @click.stop>
                        <button class="options-btn" @click="toggleMenu(conversa.id)" aria-label="Opções da conversa">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="1"></circle>
                                <circle cx="12" cy="5" r="1"></circle>
                                <circle cx="12" cy="19" r="1"></circle>
                            </svg>
                        </button>

                        <div v-if="menuAbertoId === conversa.id" class="dropdown-menu">
                            <button class="delete-option" @click="excluirConversa(conversa.id)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                                Excluir conversa
                            </button>
                        </div>
                    </div>
                </div>

                <div v-if="conversasRecentes.length === 0" class="empty-conversations">
                    Nenhuma conversa recente.
                </div>
            </div>
        </aside>
    </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import MenuLateral from '@/components/BarraNavegacao.vue';
import ChatMessage from '@/components/ChatMessage.vue';

const statusOnline = ref(false);

const mensagemPadrao = {
    remetente: 'chefinho',
    texto: `Olá! Sou o **Chefinho** 🧑‍🍳✨ Seu assistente culinário pessoal!\n\nPosso te ajudar a:\n• Criar receitas personalizadas\n• Sugerir substituições de ingredientes\n• Explicar técnicas culinárias\n• Adaptar receitas para dietas\n\nO que vamos cozinhar hoje? 😋`
};

const mensagensAtuais = ref([mensagemPadrao]);
const novaMensagemTexto = ref('');
const scrollContainer = ref(null);

const sugestoesPreProntas = [
    'Sugira uma receita com frango e limão',
    'Substituto para manteiga em bolos',
    'Receita vegana para jantar rápido'
];

const conversasRecentes = ref([
    { id: 1, titulo: 'Como fazer um frango...' },
    { id: 2, titulo: 'Como fazer um frango...' },
    { id: 3, titulo: 'Como fazer um frango...' },
    { id: 4, titulo: 'Como fazer um frango...' },
    { id: 5, titulo: 'Como fazer um frango...' }
]);

const menuAbertoId = ref(null);

const toggleMenu = (id) => {
    menuAbertoId.value = menuAbertoId.value === id ? null : id;
};

const rolarParaBaixo = async () => {
    await nextTick();
    if (scrollContainer.value) {
        scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
    }
};

const enviarMensagem = async (textoParaEnviar) => {
    if (!textoParaEnviar || !textoParaEnviar.trim()) return;

    mensagensAtuais.value.push({
        remetente: 'user',
        texto: textoParaEnviar.trim()
    });

    novaMensagemTexto.value = '';
    await rolarParaBaixo();

    mensagensAtuais.value.push({
        remetente: 'chefinho',
        texto: '',
        digitando: true
    });
    await rolarParaBaixo();

    setTimeout(async () => {
        mensagensAtuais.value.pop();
        mensagensAtuais.value.push({
            remetente: 'chefinho',
            texto: `Ótima escolha! "${textoParaEnviar}" é excelente. Em breve traremos mais dicas personalizadas para você!`
        });
        await rolarParaBaixo();
    }, 1500);
};

const carregarConversa = (id) => {
    mensagensAtuais.value = [
        mensagemPadrao,
        { remetente: 'user', texto: `Continuando a conversa antiga #${id}` },
        { remetente: 'chefinho', texto: 'Claro! Como posso te ajudar a retomar essa receita?' }
    ];
    rolarParaBaixo();
};

const excluirConversa = (id) => {
    conversasRecentes.value = conversasRecentes.value.filter(c => c.id !== id);
    menuAbertoId.value = null;
};

const voltar = () => {
    history.back();
};
</script>

<style scoped>
.chefe-view-layout {
    display: flex;
    width: 100vw;
    height: 100vh;
    background-color: #fdfbf7;
    font-family: "Inter", sans-serif;
    box-sizing: border-box;
    overflow: hidden;
}

.chat-main-area {
    margin-left: 200px; 
    margin-right: 260px; 
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #faf8f5;
    position: relative;
    min-width: 0; 
}

.chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    background-color: #3b2219;
    color: #ffffff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.chefe-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.back-btn {
    background: none;
    border: none;
    color: #ffffff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-radius: 50%;
    transition: background-color 0.2s;
}

.back-btn:hover {
    background-color: rgba(255,255,255,0.1);
}

.chefe-avatar-header {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    background-color: #f7c948;
    display: flex;
    align-items: center;
    justify-content: center;
}

.chefe-avatar-header img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.chefe-title-header {
    font-size: 16px;
    font-weight: 700;
    margin: 0;
    color: #ffffff;
}

.chefe-subtitle {
    margin-top: 5px;
    font-size: 12px;
    color: #FED7AA;
    display: flex;
    align-items: center;
    justify-content: center;
}

.chefe-subtitle img {
    height: auto;
    width: 15px;
}

.status-indicator-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    background-color: rgba(46, 125, 50, 0.2);
    border: 1px solid rgba(76, 175, 80, 0.4);
    color: #81c784;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
}

.status-indicator-badge.offline {
    background-color: rgba(183, 28, 28, 0.2);
    border-color: rgba(229, 57, 53, 0.4);
    color: #e57373;
}

.status-dot {
    width: 8px;
    height: 8px;
    background-color: currentColor;
    border-radius: 50%;
}

.messages-scroll-area {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.chat-input-section {
    padding: 16px 24px;
    background-color: #ffffff;
    border-top: 1px solid #f3efea;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.suggestions-chips {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: 6px;
    width: 100%;
    max-width: 100%; 
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; 
}

.suggestions-chips::-webkit-scrollbar {
    display: none;
}

.chip-btn {
    background-color: #ffffff;
    border: 1px solid #ebdccc;
    color: #6b4c3b;
    padding: 6px 14px;
    border-radius: 18px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s;
    flex-shrink: 0; 
}

.chip-btn:hover {
    background-color: #f7f3ed;
    border-color: #72bca5;
    color: #3b2219;
}

.input-wrapper {
    display: flex;
    align-items: center;
    background-color: #ffffff;
    border: 1px solid #ebdccc;
    border-radius: 24px;
    padding: 6px 6px 6px 16px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.02);
}

.chat-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 14px;
    font-family: "Inter", sans-serif;
    color: #4a2512;
    background: transparent;
}

.chat-input::placeholder {
    color: #a89f91;
}

.send-btn {
    background-color: #72bca5;
    border: none;
    color: #ffffff;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s;
}

.send-btn:hover {
    background-color: #52ab8b;
}

.recent-conversations-sidebar {
    position: fixed;
    right: 0;
    top: 0;
    width: 260px;
    height: 100vh;
    background-color: #ffffff;
    border-left: 1px solid var(--bege, #f3efea);
    display: flex;
    flex-direction: column;
    padding: 20px 16px;
    box-sizing: border-box;
    z-index: 10;
}

.sidebar-title {
    font-size: 14px;
    font-weight: 600;
    color: #4a2512;
    margin-bottom: 16px;
}

.conversations-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.conversation-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    color: #6b4c3b;
    position: relative;
    transition: background-color 0.2s;
}

.conversation-item:hover {
    background-color: #f7f3ed;
    color: #3b2219;
}

.conversation-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
}

.dropdown-container {
    position: relative;
}

.options-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #a89f91;
    padding: 4px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.options-btn:hover {
    color: #4a2512;
    background-color: rgba(0,0,0,0.05);
}

.dropdown-menu {
    position: absolute;
    right: 0;
    top: 28px;
    background-color: #5A4A42;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    border-radius: 8px;
    z-index: 20;
    padding: 4px;
    white-space: nowrap;
}

.delete-option {
    background: none;
    border: none;
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 8px 12px;
    font-size: 12px;
    color: white;
    cursor: pointer;
    border-radius: 4px;
    text-align: left;
}

.empty-conversations {
    font-size: 13px;
    color: #a89f91;
    text-align: center;
    padding-top: 20px;
}
</style>