<template>
    <div class="chefe-view-layout">
        <MenuLateral />
        
        <main class="chat-main-area">
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

                <div class="status-indicator-badge" :class="{ 'offline': !statusOnline }">
                    <span class="status-dot"></span>
                    {{ statusOnline ? 'Online' : 'Offline' }}
                </div>
            </header>

            <div class="messages-scroll-area" ref="scrollContainer">
                <div v-if="carregandoMensagens" class="loading-messages">
                    Carregando conversa...
                </div>

                <template v-else>
                    <ChatMessage 
                        v-for="(msg, index) in mensagensAtuais" 
                        :key="index"
                        :texto="msg.texto"
                        :remetente="msg.remetente"
                        :digitando="msg.digitando"
                    />
                </template>
            </div>

            <div class="chat-input-section">
                <p v-if="erroApi" class="chat-error-banner">{{ erroApi }}</p>

                <div class="suggestions-chips">
                    <button 
                        v-for="(sugestao, index) in sugestoesPreProntas" 
                        :key="index"
                        class="chip-btn"
                        :disabled="enviandoMensagem"
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
                        maxlength="3000"
                        :disabled="enviandoMensagem"
                    />
                    <button 
                        class="send-btn" 
                        @click="enviarMensagem(novaMensagemTexto)"
                        :disabled="enviandoMensagem || !novaMensagemTexto.trim()"
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

        <aside class="recent-conversations-sidebar" :class="{ 'recolhido': !conversasAbertas }">
            <h3 class="sidebar-title" @click="conversasAbertas = !conversasAbertas">
                <span>Conversas recentes</span>
                <span class="sidebar-chevron" :class="{ 'aberta': conversasAbertas }">›</span>
            </h3>

            <div class="conversations-list">
                <div v-if="carregandoConversas" class="empty-conversations">
                    Carregando conversas...
                </div>

                <template v-else>
                    <div 
                        v-for="conversa in conversasRecentes" 
                        :key="conversa.id" 
                        class="conversation-item"
                        :class="{ 'ativa': conversa.id === conversaAtualId }"
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
                </template>
            </div>
        </aside>
    </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue';
import MenuLateral from '@/components/BarraNavegacao.vue';
import ChatMessage from '@/components/ChatMessage.vue';
import authService from '@/services/authService';
import { getUsuarioLogado } from '@/services/usuarios';
import {
    getListarConversasChefinho,
    postCriarConversaChefinho,
    getBuscarConversaChefinho,
    deleteConversaChefinho,
    postMensagemChefinho
} from '@/services/chefinho';

const statusOnline = ref(false);
const conversasAbertas = ref(false);

const mensagemPadrao = {
    remetente: 'chefinho',
    padrao: true,
    texto: `Olá! Sou o **Chefinho** 🧑‍🍳✨ Seu assistente culinário pessoal!\n\nPosso te ajudar a:\n• Criar receitas personalizadas\n• Sugerir substituições de ingredientes\n• Explicar técnicas culinárias\n• Adaptar receitas para dietas\n\nO que vamos cozinhar hoje? 😋`
};

const conversaAtualId = ref(null);
const mensagensAtuais = ref([mensagemPadrao]);
const novaMensagemTexto = ref('');
const scrollContainer = ref(null);

const sugestoesPreProntas = [
    'Sugira uma receita com frango e limão',
    'Substituto para manteiga em bolos',
    'Receita vegana para jantar rápido'
];

const conversasRecentes = ref([]);
const carregandoConversas = ref(false);
const carregandoMensagens = ref(false);
const enviandoMensagem = ref(false);
const erroApi = ref('');
const menuAbertoId = ref(null);

const extrairIdDoToken = (token) => {
    try {
        if (!token) return null;
        const payloadBase64 = token.split('.')[1];
        if (!payloadBase64) return null;
        const payload = JSON.parse(atob(payloadBase64));
        return payload?.id || payload?.id_usuario || payload?.sub || null;
    } catch {
        return null;
    }
};

const obterIdUsuarioLogado = async () => {
    const usuarioSalvo = authService.getUser();
    if (usuarioSalvo?.id) {
        localStorage.setItem('id_usuario', String(usuarioSalvo.id));
        return Number(usuarioSalvo.id);
    }

    const idDiretoStorage = localStorage.getItem('id_usuario');
    if (idDiretoStorage) {
        return Number(idDiretoStorage);
    }

    try {
        const res = await getUsuarioLogado();
        const dadosUsuario = res?.response?.dados || res?.dados || res;

        if (dadosUsuario?.id) {
            authService.setUser({ ...(usuarioSalvo || {}), ...dadosUsuario });
            localStorage.setItem('id_usuario', String(dadosUsuario.id));
            return Number(dadosUsuario.id);
        }
    } catch {
        const idToken = extrairIdDoToken(authService.getToken());
        if (idToken) {
            authService.setUser({ ...(usuarioSalvo || {}), id: Number(idToken) });
            localStorage.setItem('id_usuario', String(idToken));
            return Number(idToken);
        }
    }

    return null;
};

const verificarStatusChefinho = async () => {
    try {
        const chefinhoBaseUrl = import.meta.env.VITE_CHEFINHO_API_URL || 'http://localhost:3001/v1/chefinho';
        const response = await fetch(`${chefinhoBaseUrl}/status`);
        const data = await response.json().catch(() => null);
        statusOnline.value = response.status === 200 && Boolean(data?.success);
    } catch {
        statusOnline.value = false;
    }
};

const carregarListaConversas = async () => {
    carregandoConversas.value = true;
    try {
        const res = await getListarConversasChefinho();
        const lista = res?.response?.dados || res?.dados || [];
        conversasRecentes.value = Array.isArray(lista) ? lista : [];
    } catch (error) {
        erroApi.value = error.message || 'Não foi possível carregar as conversas recentes.';
    } finally {
        carregandoConversas.value = false;
    }
};

const toggleMenu = (id) => {
    menuAbertoId.value = menuAbertoId.value === id ? null : id;
};

const fecharMenuExterno = () => {
    menuAbertoId.value = null;
};

const rolarParaBaixo = async () => {
    await nextTick();
    if (scrollContainer.value) {
        scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
    }
};

const montarHistoricoCronologico = () => {
    return mensagensAtuais.value
        .filter((msg) => !msg.padrao && !msg.digitando && msg.texto)
        .slice(-10)
        .map((msg) => ({
            papel: msg.remetente === 'user' ? 'user' : 'agente',
            mensagem: msg.texto.slice(0, 3000)
        }));
};

const enviarMensagem = async (textoParaEnviar) => {
    const textoLimpo = textoParaEnviar?.trim();
    if (!textoLimpo || enviandoMensagem.value) return;

    erroApi.value = '';
    enviandoMensagem.value = true;

    const historicoConversa = montarHistoricoCronologico();

    mensagensAtuais.value.push({
        remetente: 'user',
        texto: textoLimpo
    });

    novaMensagemTexto.value = '';
    await rolarParaBaixo();

    mensagensAtuais.value.push({
        remetente: 'chefinho',
        texto: '',
        digitando: true
    });
    await rolarParaBaixo();

    try {
        if (!conversaAtualId.value) {
            const idUsuario = await obterIdUsuarioLogado();

            if (!idUsuario) {
                throw new Error('Não foi possível identificar o usuário logado para criar a conversa.');
            }

            const resNovaConversa = await postCriarConversaChefinho({
                titulo: textoLimpo.slice(0, 100),
                id_usuario: idUsuario
            });

            const idConversaCriada =
                resNovaConversa?.response?.dados?.id ||
                resNovaConversa?.response?.conversa?.id ||
                resNovaConversa?.response?.id ||
                resNovaConversa?.dados?.id ||
                resNovaConversa?.id;

            if (!idConversaCriada) {
                throw new Error('A API não retornou o ID da conversa criada.');
            }

            conversaAtualId.value = idConversaCriada;
            await carregarListaConversas();
        }

        const resMensagem = await postMensagemChefinho(conversaAtualId.value, {
            historico_conversa: historicoConversa,
            pergunta_atual: textoLimpo
        });

        const textoResposta =
            resMensagem?.response?.resposta_chefinho?.conteudo ||
            resMensagem?.resposta_chefinho?.conteudo ||
            'Não recebi uma resposta do Chefinho no momento.';

        mensagensAtuais.value.pop();
        mensagensAtuais.value.push({
            remetente: 'chefinho',
            texto: textoResposta
        });
    } catch (error) {
        mensagensAtuais.value.pop();
        erroApi.value = error.message || 'Erro ao enviar mensagem para o Chefinho.';
        await verificarStatusChefinho();
    } finally {
        enviandoMensagem.value = false;
        await rolarParaBaixo();
    }
};

const carregarConversa = async (id) => {
    if (carregandoMensagens.value || enviandoMensagem.value) return;

    erroApi.value = '';
    carregandoMensagens.value = true;
    conversaAtualId.value = id;
    menuAbertoId.value = null;
    conversasAbertas.value = false;

    try {
        const res = await getBuscarConversaChefinho(id);
        const mensagensApi = res?.response?.mensagens || res?.mensagens || [];

        if (Array.isArray(mensagensApi) && mensagensApi.length > 0) {
            mensagensAtuais.value = mensagensApi.map((msg) => ({
                remetente: msg.tipo_remetente === 'usuario' ? 'user' : 'chefinho',
                texto: msg.conteudo
            }));
        } else {
            mensagensAtuais.value = [mensagemPadrao];
        }
    } catch (error) {
        erroApi.value = error.message || 'Erro ao carregar os detalhes da conversa.';
    } finally {
        carregandoMensagens.value = false;
        await rolarParaBaixo();
    }
};

const excluirConversa = async (id) => {
    erroApi.value = '';
    menuAbertoId.value = null;

    try {
        await deleteConversaChefinho(id);
        conversasRecentes.value = conversasRecentes.value.filter((c) => c.id !== id);

        if (conversaAtualId.value === id) {
            conversaAtualId.value = null;
            mensagensAtuais.value = [mensagemPadrao];
        }
    } catch (error) {
        erroApi.value = error.message || 'Não foi possível excluir a conversa.';
    }
};

const voltar = () => {
    history.back();
};

onMounted(() => {
    document.addEventListener('click', fecharMenuExterno);
    obterIdUsuarioLogado();
    verificarStatusChefinho();
    carregarListaConversas();
});

onUnmounted(() => {
    document.removeEventListener('click', fecharMenuExterno);
});
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
    margin-right: 230px; 
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
    padding: 10px 20px;
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

.loading-messages {
    text-align: center;
    font-size: 13px;
    color: #a89f91;
    padding: 24px 0;
}

.chat-error-banner {
    margin: 0;
    padding: 8px 12px;
    border-radius: 10px;
    background-color: #fdecea;
    border: 1px solid #f5c2c0;
    color: #b71c1c;
    font-size: 12px;
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

.chip-btn:hover:not(:disabled) {
    background-color: #f7f3ed;
    border-color: #72bca5;
    color: #3b2219;
}

.chip-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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

.send-btn:hover:not(:disabled) {
    background-color: #52ab8b;
}

.send-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.recent-conversations-sidebar {
    position: fixed;
    right: 0;
    top: 0;
    width: 230px;
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

.conversation-item:hover,
.conversation-item.ativa {
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

.sidebar-chevron {
    display: none;
}

@media (max-width: 768px) {
    .sidebar-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 10px;
    }

    .sidebar-chevron {
        display: inline-block;
        font-size: 20px;
        font-weight: 400;
        color: #6b4c3b;
        transition: transform 0.3s ease;
        transform: rotate(0deg);
    }

    .sidebar-chevron.aberta {
        transform: rotate(90deg);
    }

    .recent-conversations-sidebar.recolhido .conversations-list {
        display: none;
    }

    .chefe-view-layout {
        flex-direction: column;
        height: 100vh;
    }

    .chat-main-area {
        margin-left: 0;
        margin-right: 0;
        flex: 1;
        min-height: 0;
        height: auto;
        background-color: #8b7e74;
    }

    .chat-header {
        display: none;
    }

    .messages-scroll-area {
        padding: 16px 12px;
    }

    .chat-input-section {
        padding: 12px;
    }

    .recent-conversations-sidebar {
        position: relative;
        right: auto;
        top: auto;
        width: 100%;
        height: auto;
        flex-shrink: 0;
        border-left: none;
        border-bottom: 1px solid var(--bege, #f3efea);
        padding: 12px 16px;
    }

    .sidebar-title {
        margin-bottom: 0;
        cursor: pointer;
    }

    .conversations-list {
        max-height: 260px;
    }

    .recent-conversations-sidebar {
        order: 1;
        padding: 12px 16px 16px 16px;
    }

    .chat-main-area {
        order: 2;
    }

    .sidebar-title {
        font-size: 15px;
        font-weight: 700;
        color: #3b2219;
    }

    .recent-conversations-sidebar {
        position: relative;
        z-index: 20;
    }

    .recent-conversations-sidebar:not(.recolhido) .conversations-list {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        z-index: 21;
        max-height: 260px;
        overflow-y: auto;
        padding: 0 16px;
        background-color: #ffffff;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
        border-bottom-left-radius: 15px;
        border-bottom-right-radius: 15px;
    }
}

@media (max-width: 480px) {
    .chefe-view-layout {
        flex-direction: column;
        height: 100vh;
        height: 100dvh;
        overflow: hidden;
        background-color: #fcfaf6;
    }

    .chat-main-area {
        display: contents;
    }

    .chat-header {
        order: 1;
        display: flex !important;
        background-color: #3b2219;
        padding: 10px 16px;
        height: auto;
    }

    .back-btn {
        display: none;
    }

    .chefe-title-header {
        font-size: 15px;
    }

    .chefe-subtitle {
        margin-top: 2px;
        font-size: 11px;
        justify-content: flex-start;
    }

    .chefe-subtitle img {
        display: none;
    }

    .status-indicator-badge {
        background-color: rgba(255, 255, 255, 0.15);
        border: none;
        color: #ffffff;
        padding: 4px 10px;
        font-size: 11px;
    }

    .recent-conversations-sidebar {
        order: 2;
        position: relative;
        right: auto;
        top: auto;
        width: 100%;
        height: auto;
        flex-shrink: 0;
        background-color: #ffffff;
        border-left: none;
        border-bottom: 1px solid #efeae1;
        padding: 10px 16px;
        z-index: 10;
    }

    .sidebar-title {
        font-size: 13px;
        font-weight: 600;
        color: #4a2512;
        margin-bottom: 0;
    }

    .messages-scroll-area {
        order: 3;
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        background-color: #fcfaf6;
        padding: 16px;
    }

    .chat-input-section {
        order: 4;
        background-color: #fcfaf6;
        border-top: none;
        padding: 8px 16px 80px 16px;
        gap: 8px;
    }

    .suggestions-chips {
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
        overflow: visible;
    }

    .chip-btn {
        background-color: #ffffff;
        border: 1px solid #efeae1;
        color: #4a2512;
        font-size: 12px;
        padding: 8px 14px;
        border-radius: 20px;
        width: fit-content;
    }

    .input-wrapper {
        background-color: #ffffff;
        border: 1px solid #efeae1;
        border-radius: 24px;
        padding: 4px 6px 4px 16px;
    }

    .chat-input {
        font-size: 13px;
    }

    .send-btn {
        width: 34px;
        height: 34px;
        background-color: #72bca5;
    }
}
</style>