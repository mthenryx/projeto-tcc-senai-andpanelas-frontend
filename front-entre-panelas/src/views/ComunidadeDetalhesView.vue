<template>
    <div class="corpo">
        <!-- Barra de navegação global reutilizada -->
        <BarraNavegacao />

        <div class="coluna">
            <!-- HEADER COM BANNER DE CAPA -->
            <header class="banner-capa-header" :style="{ backgroundImage: `url(${comunidade.banner_url})` }">
                <div class="banner-overlay">
                    <!-- Botão Voltar para o Histórico -->
                    <button class="back-btn-circle" @click="voltar" aria-label="Voltar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                    </button>

                    <!-- Título e Stats sobrepostos na capa (Utilizando os ícones PNG com filtro marrom/branco) -->
                    <div class="banner-info-bottom">
                        <h1 class="comunidade-titulo">{{ comunidade.nome }}</h1>
                        <div class="comunidade-stats">
                            <span class="stat-item-capa">
                                <img src="/iconPaginas/comunidade_icon_cinza.png" alt="Membros"
                                    class="icone-estendido-marrom" />
                                {{ comunidade.quantidade_pessoas }} membros
                            </span>
                            <span class="stat-item-capa">
                                <img src="/icon_fileira.png" alt="Receitas" class="icone-estendido-marrom" />
                                {{ comunidade.quantidade_receitas }} receitas
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <!-- CONTEÚDO DA PÁGINA -->
            <main class="conteudo-principal">
                <!-- Descrição -->
                <p class="comunidade-descricao">{{ comunidade.descricao }}</p>

                <!-- Avatares em Grupo (Até 5 participantes + Contador restante) -->
                <div class="membros-avatares-row">
                    <div class="avatares-stack">
                        <div v-for="(membro, idx) in primeirosMembros" :key="membro.id" class="avatar-circle"
                            :style="{ backgroundColor: obterCorAvatar(idx) }">
                            {{ obterIniciais(membro.nome) }}
                        </div>
                    </div>
                    <span class="membros-restantes-text" v-if="membrosRestantesCount > 0">
                        +{{ membrosRestantesCount }} outros membros
                    </span>
                </div>

                <!-- Botão Denunciar -->
                <div class="denunciar-row">
                    <button class="btn-denunciar" @click="abrirModalDenuncia">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                            <line x1="4" y1="22" x2="4" y2="15"></line>
                        </svg>
                        Denunciar
                    </button>
                </div>

                <!-- Ações do Usuário: Participar / Sair / Editar -->
                <div class="acoes-comunidade-row">
                    <template v-if="!ehCriador">
                        <button type="button" class="btn-acao-participacao" :class="{ 'participando': ehParticipante }"
                            @click="alternarParticipacao">
                            {{ ehParticipante ? 'Sair da comunidade' : 'Participar da comunidade' }}
                        </button>
                    </template>

                    <template v-else>
                        <div class="criador-badge-info">
                            <span>Você é o moderador / criador desta comunidade</span>
                        </div>
                    </template>

                    <button class="btn-share-icon" title="Compartilhar" @click="compartilhar">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                            <polyline points="16 6 12 2 8 6"></polyline>
                            <line x1="12" y1="2" x2="12" y2="15"></line>
                        </svg>
                    </button>
                </div>

                <!-- ABAS DE NAVEGAÇÃO: RECEITAS vs MEMBROS (Com ícones PNG customizados e contraste ativo) -->
                <div class="abas-container">
                    <button class="aba-btn" :class="{ active: abaAtiva === 'receitas' }" @click="abaAtiva = 'receitas'">
                        <img src="/icon_fileira.png" alt="Receitas" class="icone-aba" />
                        Receitas
                    </button>
                    <button class="aba-btn" :class="{ active: abaAtiva === 'membros' }" @click="abaAtiva = 'membros'">
                        <img src="/iconPaginas/comunidade_icon_cinza.png" alt="Membros" class="icone-aba" />
                        Membros
                    </button>
                </div>

                <!-- Botão de Editar Comunidade (Se o usuário atual for o criador) -->
                <div v-if="ehCriador" class="btn-editar-wrapper">
                    <button class="btn-editar-comunidade" @click="irParaEdicao">
                        ✏️ Editar comunidade
                    </button>
                </div>

                <!-- ABA 1: RECEITAS DA COMUNIDADE (Utilizando RecipeCard.vue) -->
                <div v-if="abaAtiva === 'receitas'" class="lista-receitas-grid">
                    <RecipeCard v-for="rec in receitasComunidade" :key="rec.id" :id="rec.id" :imagemUrl="rec.imagem_url"
                        :titulo="rec.titulo" :tempo="rec.tempo" :porcoes="String(rec.porcoes)" :custo="rec.custo"
                        :curtidas="rec.curtidas" :comentarios="rec.comentarios" :autorNome="rec.autor_nome"
                        :authorIniciais="obterIniciais(rec.autor_nome)" :dificuldade="rec.dificuldade"
                        v-model:salvo="rec.salvo" />
                    <div v-if="receitasComunidade.length === 0" class="sem-resultados">
                        <p>Nenhuma receita cadastrada nesta comunidade ainda.</p>
                    </div>
                </div>

                <!-- ABA 2: LISTA DE MEMBROS (Com Badge MOD para o Criador) -->
                <div v-else-if="abaAtiva === 'membros'" class="lista-membros-vertical">
                    <div v-for="membro in comunidade.participantes" :key="membro.id" class="membro-card-item">
                        <div class="membro-left">
                            <img v-if="membro.foto_url" :src="membro.foto_url" :alt="membro.nome" class="membro-foto" />
                            <div v-else class="membro-avatar-fallback"
                                :style="{ backgroundColor: obterCorAvatar(membro.id) }">
                                {{ obterIniciais(membro.nome) }}
                            </div>

                            <div class="membro-info">
                                <h4 class="membro-nome">{{ membro.nome }}</h4>
                                <p class="membro-sub">
                                    {{ membro.id === comunidade.criador_id ? 'Moderador(a)' : 'Membro' }} • {{
                                    membro.quantidade_receitas }} receitas
                                </p>
                            </div>
                        </div>

                        <!-- BADGE MODERADOR (Apenas para o criador da comunidade) -->
                        <div v-if="membro.id === comunidade.criador_id" class="badge-mod">
                            MOD
                        </div>
                    </div>
                </div>
            </main>
        </div>

        <!-- MODAL DE DENÚNCIA REUTILIZADO -->
        <ReportModal :isOpen="modalDenunciaAberto" tipo="comunidade" :targetId="comunidade.id"
            @close="modalDenunciaAberto = false" @send="tratarEnvioDenuncia" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import BarraNavegacao from '@/components/BarraNavegacao.vue';
import ReportModal from '@/components/ReportModal.vue';
import RecipeCard from '@/components/RecipeCard.vue';

const router = useRouter();
const route = useRoute();

const abaAtiva = ref('membros');
const modalDenunciaAberto = ref(false);

const usuarioAtualId = ref(101);

const comunidade = ref({
    id: route.params.id || 1,
    nome: 'Veganos Criativos',
    descricao: 'Receitas plant-based deliciosas para mostrar que vegano não come só salada! 🌱',
    banner_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200',
    quantidade_pessoas: '12.4k',
    quantidade_receitas: '3.2k',
    criador_id: 1,
    participantes: [
        { id: 1, nome: 'Mariana Lima', foto_url: '', quantidade_receitas: 89 },
        { id: 2, nome: 'Ana Costa', foto_url: '', quantidade_receitas: 47 },
        { id: 3, nome: 'Pedro Souza', foto_url: '', quantidade_receitas: 21 },
        { id: 4, nome: 'Beatriz Alves', foto_url: '', quantidade_receitas: 63 },
        { id: 5, nome: 'Carlos Ferreira', foto_url: '', quantidade_receitas: 22 },
        { id: 101, nome: 'Matheus Henry', foto_url: '', quantidade_receitas: 12 }
    ]
});

const ehParticipante = ref(true);

const ehCriador = computed(() => {
    return usuarioAtualId.value === comunidade.value.criador_id;
});

const primeirosMembros = computed(() => {
    return comunidade.value.participantes.slice(0, 5);
});

const membrosRestantesCount = computed(() => {
    const total = comunidade.value.participantes.length;
    return total > 5 ? total - 5 : 0;
});

const receitasComunidade = ref([
    {
        id: 101,
        titulo: 'Pão de Queijo Mineiro',
        dificuldade: 'Fácil',
        autor_nome: 'Carlos Ferreira',
        tempo: '35min',
        porcoes: 3,
        custo: 'Econômico',
        curtidas: 756,
        comentarios: 54,
        salvo: false,
        imagem_url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600'
    },
    {
        id: 102,
        titulo: 'Risoto de Cogumelos Selvagens',
        dificuldade: 'Médio',
        autor_nome: 'Mariana Lima',
        tempo: '45min',
        porcoes: 2,
        custo: 'Moderado',
        curtidas: 1240,
        comentarios: 98,
        salvo: true,
        imagem_url: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=600'
    }
]);

const voltar = () => {
    router.back();
};

const obterIniciais = (nome) => {
    if (!nome) return '';
    const partes = nome.trim().split(' ');
    if (partes.length >= 2) {
        return (partes[0][0] + partes[1][0]).toUpperCase();
    }
    return partes[0].substring(0, 2).toUpperCase();
};

const coresAvatar = ['#BFE3D5', '#FCE3B4', '#FCD2D1', '#D4E3FC', '#E3D4FC'];
const obterCorAvatar = (index) => {
    return coresAvatar[index % coresAvatar.length];
};

const alternarParticipacao = () => {
    if (ehCriador.value) return;
    ehParticipante.value = !ehParticipante.value;
};

const irParaEdicao = () => {
    router.push({
        path: '/criar-comunidade',
        query: { id: comunidade.value.id }
    });
};

const abrirModalDenuncia = () => {
    modalDenunciaAberto.value = true;
};

const tratarEnvioDenuncia = (dadosDenuncia) => {
    console.log('Denúncia enviada com sucesso:', dadosDenuncia);
    modalDenunciaAberto.value = false;
};

const compartilhar = () => {
    if (navigator.share) {
        navigator.share({
            title: comunidade.value.nome,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copiado para a área de transferência!');
    }
};
</script>

<style scoped>
.corpo {
    display: flex;
    width: 100%;
    min-height: 100vh;
    background-color: var(--cinza-claro, #FAF8F5);
    font-family: "Inter", sans-serif;
}

.coluna {
    width: calc(100% - 200px);
    margin-left: 200px;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

/* Header Banner com Capa */
.banner-capa-header {
    width: 100%;
    height: 220px;
    background-size: cover;
    background-position: center;
    position: relative;
}

.banner-overlay {
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.7) 100%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px 32px;
    box-sizing: border-box;
}

.back-btn-circle {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #FFFFFF;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--marrom, #4A3E3D);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.banner-info-bottom {
    color: #FFFFFF;
}

.comunidade-titulo {
    font-family: "Playfair Display", serif;
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 6px 0;
}

.comunidade-stats {
    display: flex;
    gap: 16px;
    font-size: 12px;
    color: #EFEAE1;
}

.stat-item-capa {
    display: flex;
    align-items: center;
    gap: 6px;
}

/* Tratamento de contraste dos ícones PNG via CSS Filter */
.icone-estendido-marrom {
    width: 14px;
    height: 14px;
    object-fit: contain;
    filter: brightness(100);
}

.conteudo-principal {
    padding: 24px 32px 60px 32px;
    max-width: 900px;
    width: 100%;
    box-sizing: border-box;
}

.comunidade-descricao {
    font-size: 13px;
    color: var(--marrom, #4A3E3D);
    margin: 0 0 16px 0;
    line-height: 1.5;
}

.membros-avatares-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
}

.avatares-stack {
    display: flex;
    align-items: center;
}

.avatar-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    color: var(--marrom, #4A3E3D);
    margin-left: -8px;
}

.avatar-circle:first-child {
    margin-left: 0;
}

.membros-restantes-text {
    font-size: 12px;
    color: var(--cinza, #8C827A);
}

.denunciar-row {
    margin-bottom: 20px;
}

.btn-denunciar {
    background: none;
    border: none;
    color: var(--cinza, #8C827A);
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    padding: 0;
}

.btn-denunciar:hover {
    color: var(--vermelho, #D9534F);
}

.acoes-comunidade-row {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 28px;
}

.btn-acao-participacao {
    flex: 1;
    background-color: var(--verde, #72BCA5);
    color: #FFFFFF;
    border: none;
    padding: 12px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-acao-participacao.participando {
    background-color: #E3F4ED;
    color: var(--verde-escuro, #2E6F59);
}

.btn-share-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    border: 1px solid #EFEAE1;
    background-color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--marrom, #4A3E3D);
}

/* Abas Receitas / Membros */
.abas-container {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
}

.aba-btn {
    flex: 1;
    padding: 12px;
    border-radius: 12px;
    border: 1px solid #EFEAE1;
    background-color: #FFFFFF;
    color: #7A675B;
    /* Cor padrão Marrom #7A675B */
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
}

/* Ícones dentro das abas (Padrão Marrom #7A675B) */
.icone-aba {
    width: 16px;
    height: 16px;
    object-fit: contain;
    filter: brightness(0) saturate(100%) invert(44%) sepia(13%) saturate(1062%) hue-rotate(345deg) brightness(93%) contrast(87%);
    transition: filter 0.2s;
}

/* Quando a aba estiver ATIVA ou com FOCO: Fundo escuro e ícones BRANCOS (#FFFFFF) */
.aba-btn.active,
.aba-btn:focus {
    background-color: #3B2416;
    color: #FFFFFF;
    border-color: #3B2416;
    outline: none;
}

.aba-btn.active .icone-aba,
.aba-btn:focus .icone-aba {
    filter: brightness(0) invert(1);
    /* Torna o ícone totalmente branco */
}

.btn-editar-wrapper {
    margin-bottom: 16px;
}

.btn-editar-comunidade {
    background-color: #FFFFFF;
    border: 1px solid #EFEAE1;
    color: var(--marrom, #4A3E3D);
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
}

.lista-membros-vertical {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.membro-card-item {
    background-color: #FFFFFF;
    border: 1px solid #EFEAE1;
    border-radius: 16px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.membro-left {
    display: flex;
    align-items: center;
    gap: 16px;
}

.membro-foto {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
}

.membro-avatar-fallback {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    color: var(--marrom, #4A3E3D);
}

.membro-nome {
    font-size: 14px;
    font-weight: 700;
    color: var(--marrom, #4A3E3D);
    margin: 0 0 2px 0;
}

.membro-sub {
    font-size: 11px;
    color: var(--cinza, #8C827A);
    margin: 0;
}

.badge-mod {
    background-color: #E2881A;
    color: #FFFFFF;
    font-size: 10px;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: 12px;
    letter-spacing: 0.5px;
}

.lista-receitas-grid {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.sem-resultados {
    text-align: center;
    padding: 30px;
    color: var(--cinza);
    font-size: 14px;
}
</style>