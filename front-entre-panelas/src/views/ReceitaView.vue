<template>
    <div class="corpo">
        <BarraNavegacao></BarraNavegacao>
        <div class="coluna">
            <div class="conteudo">
                <LoadingSpinner v-if="carregando" style="margin: auto;" />

                <div v-else class="recipe-container">
                    <div class="recipe-banner-edge" :style="{ backgroundImage: `url(${receita.imagemUrl})` }">
                        <button class="back-btn" @click="voltar" aria-label="Voltar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                                stroke-linejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                <polyline points="12 19 5 12 12 5"></polyline>
                            </svg>
                        </button>
                        <div class="category-badge" v-if="receita.categoria">
                            <span>{{ receita.categoria }}</span>
                        </div>
                    </div>

                    <div class="recipe-content-inner">
                        <div class="recipe-header-section">
                            <h1 class="recipe-title">{{ receita.titulo }}</h1>
                            <p class="recipe-description">{{ receita.descricao }}</p>

                            <div class="author-row">
                                <div class="author-info-left" @click="abrirPerfilAutor">
                                    <div class="avatar">
                                        <UserAvatar 
                                            :fotoUrl="receita.autorFotoUrl" 
                                            :nome="receita.autorNome" 
                                            :iniciais="receita.authorIniciais" 
                                            tamanho="42"
                                            :tamanhoFonte="14"
                                            :pesoFonte="600"
                                        />
                                    </div>
                                    <div class="author-text">
                                        <span class="author-name">{{ receita.autorNome }}</span>
                                        <span class="author-username">@{{ receita.autorUsername }}</span>
                                    </div>
                                </div>

                                <!-- Botão de seguir só exibe se NÃO for o usuário logado E NÃO for o Chefinho -->
                                <button v-if="!ehUsuarioAtual && !ehChefinho && receita.autorId" class="follow-btn"
                                    :class="{ 'following': receita.seguindo }" @click="toggleSeguir">
                                    {{ receita.seguindo ? 'Seguindo' : 'Seguir' }}
                                </button>
                            </div>

                            <button class="report-link-btn" @click="abrirModalDenuncia">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                                    <line x1="4" y1="22" x2="4" y2="15"></line>
                                </svg>
                                <span>Denunciar</span>
                            </button>
                        </div>

                        <div class="metrics-grid">
                            <div class="metric-card">
                                <div class="metric-icon-img-box">
                                    <img src="/Delivery Time.png" alt="Tempo" class="metric-icon"
                                        :style="{ filter: getIconFilter('tempo') }" />
                                </div>
                                <span class="metric-val">{{ receita.tempo }}</span>
                                <span class="metric-lbl">TEMPO</span>
                            </div>

                            <div class="metric-card">
                                <div class="metric-icon-img-box">
                                    <img src="/Stairs Up.png" alt="Nível" class="metric-icon"
                                        :style="{ filter: getIconFilter(receita.dificuldade) }" />
                                </div>
                                <span class="metric-val">{{ receita.dificuldade }}</span>
                                <span class="metric-lbl">NÍVEL</span>
                            </div>

                            <div class="metric-card">
                                <div class="metric-icon-img-box">
                                    <img src="/Expensive Price.png" alt="Custo" class="metric-icon"
                                        :style="{ filter: getIconFilter(receita.custo) }" />
                                </div>
                                <span class="metric-val">{{ receita.custo }}</span>
                                <span class="metric-lbl">CUSTO</span>
                            </div>

                            <div class="metric-card">
                                <div class="metric-icon-img-box">
                                    <img src="/Restaurant.png" alt="Porções" class="metric-icon"
                                        :style="{ filter: getIconFilter('porcoes') }" />
                                </div>
                                <span class="metric-val">{{ receita.porcoes }}</span>
                                <span class="metric-lbl">PORÇÕES</span>
                            </div>
                        </div>

                        <div class="tags-row" v-if="receita.tags && receita.tags.length">
                            <span v-for="tag in receita.tags" :key="tag" class="recipe-tag">
                                {{ tag.startsWith('#') ? tag : `#${tag}` }}
                            </span>
                        </div>

                        <div class="action-buttons-row">
                            <button class="interact-btn" :class="{ 'liked': receita.curtido }" @click="toggleCurtir">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    :fill="receita.curtido ? 'currentColor' : 'none'" stroke="currentColor"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path
                                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
                                    </path>
                                </svg>
                                <span>{{ receita.curtidas }}</span>
                            </button>

                            <button class="interact-btn" :class="{ 'saved': receita.salvo }" @click="toggleSalvar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    :fill="receita.salvo ? 'currentColor' : 'none'" stroke="currentColor"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                </svg>
                                <span>Salvar</span>
                            </button>

                            <button class="interact-btn primary-action" @click="adicionarTudoLista">
                                <img src="../../public/icon_carrinho_compras.png" alt="Carrinho de compras" class="carrinho">
                                <span>Lista</span>
                            </button>
                        </div>

                        <!-- O container de vídeo só aparece se existir vídeo -->
                        <div class="video-container" v-if="dadosVideo">
                            <iframe 
                                v-if="dadosVideo.tipo === 'youtube'"
                                class="video-element"
                                :src="dadosVideo.embedUrl"
                                title="Vídeo da receita"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen
                            ></iframe>

                            <video 
                                v-else-if="dadosVideo.tipo === 'direto'"
                                class="video-element"
                                controls
                                :poster="receita.imagemUrl"
                            >
                                <source :src="dadosVideo.url" type="video/mp4" />
                                Seu navegador não suporta a exibição deste vídeo.
                            </video>
                        </div>

                        <div class="tabs-switch-container">
                            <button class="switch-tab-btn" :class="{ 'active': abaAtivaSecao === 'ingredientes' }"
                                @click="abaAtivaSecao = 'ingredientes'">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                                </svg>
                                <span>Ingredientes</span>
                            </button>
                            <button class="switch-tab-btn" :class="{ 'active': abaAtivaSecao === 'preparo' }"
                                @click="abaAtivaSecao = 'preparo'">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <line x1="8" y1="6" x2="21" y2="6"></line>
                                    <line x1="8" y1="12" x2="21" y2="12"></line>
                                    <line x1="8" y1="18" x2="21" y2="18"></line>
                                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                                </svg>
                                <span>Modo De Preparo</span>
                            </button>
                        </div>

                        <div v-if="abaAtivaSecao === 'ingredientes'" class="section-content-box">
                            <div class="section-subtitle-bar">PARA {{ (receita.porcoes || '').toUpperCase() }}</div>

                            <div class="ingredients-list">
                                <div v-for="(ingrediente, index) in receita.ingredientes" :key="index"
                                    class="ingredient-row">
                                    <span class="ing-name">{{ ingrediente.nome }}</span>
                                    <span class="ing-measure">{{ ingrediente.quantidade }}</span>
                                </div>
                            </div>

                            <button class="add-all-list-btn" @click="adicionarTudoLista">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                <span>Adicionar tudo à lista de compras</span>
                            </button>
                        </div>

                        <div v-if="abaAtivaSecao === 'preparo'" class="section-content-box">
                            <div class="steps-list">
                                <div v-for="(etapa, index) in receita.passos" :key="index" class="step-row">
                                    <div class="step-number-badge">{{ index + 1 }}</div>
                                    <div class="step-text">{{ etapa }}</div>
                                </div>
                            </div>
                        </div>

                        <div class="comments-section">
                            <div class="comments-header">
                                <h3>Comentários ({{ comentarios.length }})</h3>
                            </div>

                            <div class="add-comment-box">
                                <div class="avatar">
                                    <UserAvatar 
                                        :fotoUrl="usuarioAtual.fotoUrl" 
                                        :nome="usuarioAtual.nome" 
                                        :iniciais="usuarioAtual.iniciais" 
                                        tamanho="32"
                                        :tamanhoFonte="12"
                                        :pesoFonte="600"
                                    />
                                </div>
                                <input type="text" v-model="novoComentarioTexto" placeholder="Adicione um comentário..."
                                    @keyup.enter="adicionarComentario" />
                            </div>

                            <div class="comments-list">
                                <div v-for="comentario in comentarios" :key="comentario.id" class="comment-item">
                                    <div class="avatar">
                                        <UserAvatar 
                                            :fotoUrl="comentario.fotoUrl" 
                                            :nome="comentario.nome" 
                                            :iniciais="comentario.iniciais" 
                                            tamanho="30"
                                            :tamanhoFonte="12"
                                            :pesoFonte="600"
                                        />
                                    </div>
                                    <div class="comment-body">
                                        <div class="comment-user-info">
                                            <span class="comment-username">@{{ comentario.username }}</span>
                                            <span class="comment-time" v-if="comentario.tempo">{{ comentario.tempo }}</span>
                                        </div>

                                        <div v-if="comentarioEditandoId === comentario.id" class="edit-comment-area">
                                            <input type="text" v-model="textoEditado"
                                                @keyup.enter="salvarEdicao(comentario.id)" />
                                            <div class="edit-actions">
                                                <button @click="salvarEdicao(comentario.id)"
                                                    class="save-edit-btn">Salvar</button>
                                                <button @click="comentarioEditandoId = null"
                                                    class="cancel-edit-btn">Cancelar</button>
                                            </div>
                                        </div>
                                        <p v-else class="comment-text">{{ comentario.texto }}</p>

                                        <div class="comment-actions-footer" v-if="podeEditarOuExcluir(comentario)">
                                            <button v-if="comentario.autorId === usuarioAtual.id"
                                                class="action-icon-btn edit" @click="iniciarEdicao(comentario)"
                                                title="Editar comentário">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <path
                                                        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7">
                                                    </path>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z">
                                                    </path>
                                                </svg>
                                            </button>
                                            <button class="action-icon-btn delete"
                                                @click="excluirComentario(comentario.id)" title="Excluir comentário">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path
                                                        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                                                    </path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <ReportModal :is-open="isReportOpen" tipo="receita" :target-id="receita.id" @close="isReportOpen = false"
            @send="tratarEnvioDenuncia" />

        <transition name="fade-popup">
            <div v-if="mostrarPopupSucesso" class="popup-sucesso-overlay">
                <div class="popup-sucesso-card">
                    <img src="/icon_ok.png" alt="Sucesso" class="popup-ok-icon" />
                    <p>{{ mensagemPopup }}</p>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BarraNavegacao from '@/components/BarraNavegacao.vue';
import ReportModal from '@/components/ReportModal.vue';
import UserAvatar from '@/components/UserAvatar.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

import { authService } from '@/services/authService';
import {
    getBuscarReceita,
    postCurtirReceita,
    deleteCurtirReceita,
    postSalvarReceita,
    deleteSalvarReceita,
    getComentariosReceita,
    postComentarioReceita
} from '@/services/receitas';
import { putComentario, deleteComentario } from '@/services/comentarios';
import {
    getUsuarioLogado,
    getSeguindoUsuario,
    postSeguirUsuario,
    postDeixarSeguirUsuario
} from '@/services/usuarios';
import { postAdicionarReceitaListaCompras } from '@/services/listaCompras';
import { postDenunciaReceita } from '@/services/denuncias';

const route = useRoute();
const router = useRouter();

const CHEFINHO_ID = 1;
const MAPA_CUSTO = { 1: 'Econômico', 2: 'Moderado', 3: 'Alto' };
const MAPA_DIFICULDADE = { 1: 'Fácil', 2: 'Médio', 3: 'Difícil' };
const MAPA_UNIDADE = { 1: 'g', 2: 'kg', 3: 'ml', 4: 'L', 5: 'un' };

const gerarIniciais = (nome) => {
    if (!nome) return 'US';
    const partes = nome.trim().split(/\s+/);
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
};

const formatarTempo = (tempo) => {
    if (!tempo) return '30min';
    if (typeof tempo === 'string' && tempo.includes(':')) {
        const [horas, minutos] = tempo.split(':').map(Number);
        const totalMin = (horas || 0) * 60 + (minutos || 0);
        return totalMin > 0 ? `${totalMin}min` : tempo;
    }
    return String(tempo);
};

const formatarPorcoes = (porcao) => {
    const num = Number(porcao) || 1;
    return `${num} ${num === 1 ? 'porção' : 'porções'}`;
};

const carregando = ref(true);

const usuarioAtual = ref({
    id: authService.getUserId(),
    nome: 'Usuário',
    username: 'usuario',
    iniciais: 'US',
    fotoUrl: ''
});

const receita = ref({
    id: null,
    titulo: '',
    descricao: '',
    categoria: '',
    imagemUrl: '',
    videoUrl: '',
    tempo: '',
    dificuldade: '',
    custo: '',
    porcoes: '',
    autorId: null,
    autorNome: '',
    autorUsername: '',
    authorIniciais: '',
    autorFotoUrl: '',
    seguindo: false,
    curtido: false,
    curtidas: 0,
    salvo: false,
    tags: [],
    ingredientes: [],
    passos: []
});

const comentarios = ref([]);

const formatarComentarioApi = (c) => {
    const autorNome = c.usuario?.nome || 'Usuário';
    return {
        id: c.id,
        autorId: c.usuario?.id ?? c.id_usuario,
        nome: autorNome,
        username: c.usuario?.username || 'usuario',
        iniciais: gerarIniciais(autorNome),
        fotoUrl: c.usuario?.foto_perfil || '',
        texto: c.comentario || '',
        tempo: ''
    };
};

const carregarUsuarioAtual = async () => {
    const userLocal = authService.getUser();
    if (userLocal) {
        usuarioAtual.value = {
            id: Number(userLocal.id ?? authService.getUserId()),
            nome: userLocal.nome || 'Usuário',
            username: userLocal.username || 'usuario',
            iniciais: gerarIniciais(userLocal.nome),
            fotoUrl: userLocal.foto_perfil || ''
        };
    }

    try {
        const res = await getUsuarioLogado();
        const dados = res?.response?.dados || res?.dados;
        if (dados) {
            usuarioAtual.value = {
                id: Number(dados.id),
                nome: dados.nome || 'Usuário',
                username: dados.username || 'usuario',
                iniciais: gerarIniciais(dados.nome),
                fotoUrl: dados.foto_perfil || ''
            };
        }
    } catch {
        // Fallback para dados locais
    }
};

const carregarReceita = async (idReceita) => {
    carregando.value = true;
    try {
        const res = await getBuscarReceita(idReceita);
        const dados = res?.response?.dados || res?.dados;
        if (!dados) return;

        const autorNome = dados.usuario?.nome || 'Chef Entre Panelas';
        const autorId = dados.usuario?.id ?? dados.id_usuario ?? null;

        const ingredientesFormatados = Array.isArray(dados.ingredientes)
            ? dados.ingredientes.map(ing => {
                const unidade = ing.unidade_medida || MAPA_UNIDADE[ing.id_unidade_medida] || '';
                return {
                    nome: ing.nome,
                    quantidade: `${ing.quantidade}${unidade ? ` ${unidade}` : ''}`
                };
            })
            : [];

        const passosFormatados = Array.isArray(dados.modo_preparo)
            ? [...dados.modo_preparo]
                .sort((a, b) => (a.ordem_preparo || 0) - (b.ordem_preparo || 0))
                .map(p => p.metodo_preparo)
            : [];

        let jaSegueAutor = false;
        if (usuarioAtual.value.id && autorId && Number(autorId) !== Number(usuarioAtual.value.id) && Number(autorId) !== CHEFINHO_ID) {
            try {
                const segRes = await getSeguindoUsuario(usuarioAtual.value.id, { limite: 100 });
                const listaSeg = segRes?.response?.dados || [];
                jaSegueAutor = listaSeg.some(u => Number(u.id) === Number(autorId));
            } catch {
                jaSegueAutor = false;
            }
        }

        receita.value = {
            id: dados.id,
            titulo: dados.titulo || '',
            descricao: dados.descricao || '',
            categoria: Array.isArray(dados.categorias) && dados.categorias.length > 0 ? dados.categorias[0] : '',
            imagemUrl: dados.foto || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
            videoUrl: dados.video || '',
            tempo: formatarTempo(dados.tempo),
            dificuldade: MAPA_DIFICULDADE[dados.id_dificuldade] || 'Fácil',
            custo: MAPA_CUSTO[dados.id_custo] || 'Econômico',
            porcoes: formatarPorcoes(dados.id_porcao),
            autorId,
            autorNome,
            autorUsername: dados.usuario?.username || 'chef',
            authorIniciais: gerarIniciais(autorNome),
            autorFotoUrl: dados.usuario?.foto_perfil || '',
            seguindo: jaSegueAutor,
            curtido: Boolean(dados.eh_curtida_pelo_usuario),
            curtidas: Number(dados.qtd_curtidas ?? dados.qtd_curtida ?? 0),
            salvo: Boolean(dados.eh_salva_pelo_usuario),
            tags: Array.isArray(dados.tags) ? dados.tags : [],
            ingredientes: ingredientesFormatados,
            passos: passosFormatados
        };

        if (Array.isArray(dados.comentarios)) {
            comentarios.value = dados.comentarios.map(formatarComentarioApi);
        } else {
            const comRes = await getComentariosReceita(idReceita).catch(() => null);
            const listaCom = comRes?.response?.dados || [];
            comentarios.value = listaCom.map(formatarComentarioApi);
        }
    } catch (erro) {
        console.error('Erro ao buscar detalhes da receita:', erro);
    } finally {
        carregando.value = false;
    }
};

onMounted(async () => {
    await carregarUsuarioAtual();
    if (route.params.id) {
        await carregarReceita(route.params.id);
    }
});

watch(() => route.params.id, (novoId) => {
    if (novoId) {
        carregarReceita(novoId);
    }
});

const ehUsuarioAtual = computed(() => {
    return Number(receita.value.autorId) === Number(usuarioAtual.value.id);
});

const ehChefinho = computed(() => {
    return Number(receita.value.autorId) === CHEFINHO_ID;
});

const dadosVideo = computed(() => {
    const url = receita.value.videoUrl;
    if (!url || typeof url !== 'string' || !url.trim()) return null;

    const regExpYoutube = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExpYoutube);

    if (match && match[2].length === 11) {
        return {
            tipo: 'youtube',
            embedUrl: `https://www.youtube.com/embed/${match[2]}`
        };
    }

    return {
        tipo: 'direto',
        url
    };
});

const abaAtivaSecao = ref('ingredientes');
const isReportOpen = ref(false);
const novoComentarioTexto = ref('');
const comentarioEditandoId = ref(null);
const textoEditado = ref('');
const mostrarPopupSucesso = ref(false);
const mensagemPopup = ref('Adicionado com sucesso!');

const exibirPopup = (texto) => {
    mensagemPopup.value = texto;
    mostrarPopupSucesso.value = true;
    setTimeout(() => {
        mostrarPopupSucesso.value = false;
    }, 2000);
};

const abrirPerfilAutor = () => {
    if (ehChefinho.value) {
        router.push('/chefinho');
    } else if (ehUsuarioAtual.value) {
        router.push('/perfil');
    } else if (receita.value.autorId) {
        router.push({ path: '/others-perfil', query: { id: receita.value.autorId } });
    }
};

const abrirModalDenuncia = () => { isReportOpen.value = true; };

const tratarEnvioDenuncia = async (dados) => {
    try {
        await postDenunciaReceita({
            id_usuario: usuarioAtual.value.id,
            id_receita: Number(receita.value.id),
            motivo: dados.motivo,
            detalhe: dados.detalhe
        });
        isReportOpen.value = false;
        exibirPopup('Denúncia enviada com sucesso!');
    } catch (erro) {
        console.error('Erro ao enviar denúncia:', erro);
    }
};

const toggleCurtir = async () => {
    const estadoAnterior = receita.value.curtido;
    receita.value.curtido = !estadoAnterior;
    receita.value.curtidas += receita.value.curtido ? 1 : -1;

    try {
        if (receita.value.curtido) {
            await postCurtirReceita(receita.value.id);
        } else {
            await deleteCurtirReceita(receita.value.id);
        }
    } catch (erro) {
        console.error('Erro ao curtir/descurtir receita:', erro);
        receita.value.curtido = estadoAnterior;
        receita.value.curtidas += estadoAnterior ? 1 : -1;
    }
};

const toggleSalvar = async () => {
    const estadoAnterior = receita.value.salvo;
    receita.value.salvo = !estadoAnterior;

    try {
        if (receita.value.salvo) {
            await postSalvarReceita(receita.value.id);
        } else {
            await deleteSalvarReceita(receita.value.id);
        }
    } catch (erro) {
        console.error('Erro ao salvar/remover receita:', erro);
        receita.value.salvo = estadoAnterior;
    }
};

const toggleSeguir = async () => {
    if (ehChefinho.value || !receita.value.autorId) return;
    const estadoAnterior = receita.value.seguindo;
    receita.value.seguindo = !estadoAnterior;

    try {
        if (receita.value.seguindo) {
            await postSeguirUsuario(receita.value.autorId);
        } else {
            await postDeixarSeguirUsuario(receita.value.autorId);
        }
    } catch (erro) {
        console.error('Erro ao seguir/deixar de seguir:', erro);
        receita.value.seguindo = estadoAnterior;
    }
};

const ingredientesAdicionadosNaLista = ref(false);

const adicionarTudoLista = async () => {
    if (ingredientesAdicionadosNaLista.value || !receita.value.id) return;

    try {
        await postAdicionarReceitaListaCompras(receita.value.id);
        ingredientesAdicionadosNaLista.value = true;
        exibirPopup('Adicionado com sucesso!');
    } catch (erro) {
        console.error('Erro ao adicionar à lista de compras:', erro);
        if (erro.message?.toLowerCase().includes('já estão')) {
            ingredientesAdicionadosNaLista.value = true;
            exibirPopup('Ingredientes já estão na lista!');
        }
    }
};

const voltar = () => { window.history.back(); };

const podeEditarOuExcluir = (comentario) => {
    return Number(comentario.autorId) === Number(usuarioAtual.value.id) ||
           Number(receita.value.autorId) === Number(usuarioAtual.value.id);
};

const adicionarComentario = async () => {
    const texto = novoComentarioTexto.value.trim();
    if (!texto || !receita.value.id) return;

    novoComentarioTexto.value = '';
    try {
        await postComentarioReceita(receita.value.id, { comentario: texto });
        const comRes = await getComentariosReceita(receita.value.id);
        const listaCom = comRes?.response?.dados || [];
        comentarios.value = listaCom.map(formatarComentarioApi);
    } catch (erro) {
        console.error('Erro ao comentar:', erro);
        comentarios.value.unshift({
            id: Date.now(),
            autorId: usuarioAtual.value.id,
            nome: usuarioAtual.value.nome,
            username: usuarioAtual.value.username,
            iniciais: usuarioAtual.value.iniciais,
            fotoUrl: usuarioAtual.value.fotoUrl,
            texto,
            tempo: 'agora'
        });
    }
};

const iniciarEdicao = (comentario) => {
    comentarioEditandoId.value = comentario.id;
    textoEditado.value = comentario.texto;
};

const salvarEdicao = async (id) => {
    const texto = textoEditado.value.trim();
    const com = comentarios.value.find(c => c.id === id);
    if (!com || !texto) {
        comentarioEditandoId.value = null;
        return;
    }

    const textoAnterior = com.texto;
    com.texto = texto;
    comentarioEditandoId.value = null;
    textoEditado.value = '';

    try {
        await putComentario(id, { comentario: texto });
    } catch (erro) {
        console.error('Erro ao editar comentário:', erro);
        com.texto = textoAnterior;
    }
};

const excluirComentario = async (id) => {
    const backup = [...comentarios.value];
    comentarios.value = comentarios.value.filter(c => c.id !== id);

    try {
        await deleteComentario(id);
    } catch (erro) {
        console.error('Erro ao excluir comentário:', erro);
        comentarios.value = backup;
    }
};

const getIconFilter = (tipo) => {
    const t = (tipo || '').toLowerCase();

    if (t.includes('fácil') || t.includes('facil') || t.includes('econômico') || t.includes('economico') || t.includes('baixo')) {
        return 'invert(61%) sepia(32%) saturate(650%) hue-rotate(95deg) brightness(90%) contrast(90%)';
    }

    if (t.includes('médio') || t.includes('medio') || t.includes('moderado')) {
        return 'invert(78%) sepia(85%) saturate(550%) hue-rotate(358deg) brightness(105%) contrast(100%)';
    }

    if (t.includes('difícil') || t.includes('dificil') || t.includes('alto')) {
        return 'invert(22%) sepia(88%) saturate(2500%) hue-rotate(345deg) brightness(95%) contrast(100%)';
    }

    return 'none';
};
</script>