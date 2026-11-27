<template>
    <div class="corpo">
        <BarraNavegacao />

        <div class="coluna">
            <header class="header-topo none">
                <div class="header-titles">
                    <h2>Buscar</h2>
                    <p>Encontre pessoas, receitas, ingredientes e comunidades</p>
                </div>
            </header>

            <div class="conteudo">
                <div class="search-container">
                    <div class="search-input-wrapper">
                        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input
                            type="text"
                            v-model="termoBusca"
                            :placeholder="placeholderDinamico"
                            @input="tratarDigitacaoBusca"
                            @keyup.enter="executarBusca"
                        />
                        <button
                            v-if="termoBusca"
                            class="clear-search-btn"
                            @click="resetarBusca"
                            aria-label="Limpar busca"
                        >
                            ×
                        </button>
                    </div>

                    <div class="tabs-filter">
                        <button class="tab-pill" :class="{ active: abaAtiva === 'usuarios' }"
                            @click="mudarAba('usuarios')">
                            Pessoas
                        </button>
                        <button class="tab-pill" :class="{ active: abaAtiva === 'receitas' }"
                            @click="mudarAba('receitas')">
                            Receitas
                        </button>
                        <button class="tab-pill" :class="{ active: abaAtiva === 'ingredientes' }"
                            @click="mudarAba('ingredientes')">
                            Ingredientes
                        </button>
                    </div>

                    <LoadingSpinner v-if="carregando" />

                    <div v-else-if="abaAtiva === 'usuarios'" class="tab-content">
                        <section class="section-block">
                            <div class="results-header">
                                <h3 class="section-label">
                                    {{ termoBusca.trim() ? `Resultados para "${termoBusca.trim()}"` : 'Pessoas na plataforma' }}
                                </h3>
                                <span class="results-count" v-if="usuariosExibidos.length > 0">
                                    {{ usuariosExibidos.length }} {{ usuariosExibidos.length === 1 ? 'usuário' : 'usuários' }}
                                </span>
                            </div>

                            <div v-if="usuariosExibidos.length > 0" class="users-list">
                                <div
                                    v-for="user in usuariosExibidos"
                                    :key="user.id"
                                    class="user-card"
                                    @click="abrirPerfilUsuario(user.id)"
                                >
                                    <div class="user-card-left">
                                        <UserAvatar
                                            :fotoUrl="user.fotoUrl"
                                            :nome="user.nome"
                                            :iniciais="user.iniciais"
                                            tamanho="48"
                                            :tamanhoFonte="16"
                                            :pesoFonte="600"
                                        />
                                        <div class="user-card-info">
                                            <h4>{{ user.nome }}</h4>
                                            <span class="user-handle">@{{ user.username }}</span>
                                            <p v-if="user.descricao" class="user-bio">{{ user.descricao }}</p>
                                        </div>
                                    </div>

                                    <button
                                        v-if="Number(user.id) !== Number(usuarioLogadoId)"
                                        class="follow-pill-btn"
                                        :class="{ following: user.seguindo }"
                                        @click.stop="toggleSeguirUsuario(user)"
                                    >
                                        {{ user.seguindo ? 'Seguindo' : 'Seguir' }}
                                    </button>
                                </div>
                            </div>

                            <div v-else class="empty-state-container">
                                <h3 class="empty-title">Nenhum usuário encontrado</h3>
                                <p class="empty-desc">
                                    Não encontramos nenhum perfil correspondente à sua pesquisa.
                                </p>
                                <button v-if="termoBusca" class="btn-voltar-empty" @click="resetarBusca">
                                    ← limpar filtro
                                </button>
                            </div>
                        </section>
                    </div>

                    <div v-else-if="abaAtiva === 'receitas'" class="tab-content">

                        <template v-if="buscaReceitaAtiva">
                            <div class="results-header results-header-recipes">
                                <button class="btn-voltar-inline" @click="resetarBusca">
                                    ← Voltar para explorar
                                </button>
                                <div class="results-tools">
                                    <span class="results-count">
                                        {{ tituloResultadoReceitas }} ({{ resultadosReceitas.length }})
                                    </span>
                                    <label class="sort-control">
                                        <span>Ordenar por</span>
                                        <select v-model="ordenacaoReceitas" aria-label="Ordenar receitas encontradas">
                                            <option value="relevancia">Relevância</option>
                                            <option value="recentes">Mais recentes</option>
                                            <option value="curtidas">Mais curtidas</option>
                                            <option value="tempo">Menor tempo</option>
                                        </select>
                                    </label>
                                </div>
                            </div>

                            <section v-if="carregandoSugestao || sugestaoChefinho" class="chefinho-suggestion-section">
                                <div v-if="sugestaoChefinho" class="chefinho-suggestion-banner">
                                    <div class="chefinho-suggestion-message">
                                        <img src="/iconPaginas/chefe_icon_cinza.png" alt="Chefinho" />
                                        <div>
                                            <strong>Dica do Chefinho</strong>
                                            <p>O Chefinho teve uma ideia, o que você acha?</p>
                                        </div>
                                    </div>
                                    <div class="chefinho-suggestion-actions">
                                        <button type="button" class="suggestion-like-btn" :disabled="salvandoSugestao" @click="salvarSugestaoChefinho">
                                            {{ salvandoSugestao ? 'Salvando...' : 'Gostei' }}
                                        </button>
                                        <button type="button" class="suggestion-dislike-btn" :disabled="salvandoSugestao" @click="recusarSugestaoChefinho">
                                            Não gostei
                                        </button>
                                    </div>
                                </div>
                                <div v-if="carregandoSugestao" class="suggestion-status">Preparando uma ideia...</div>
                                <p v-if="mensagemErroSugestao" class="suggestion-error" role="alert">{{ mensagemErroSugestao }}</p>
                                <RecipeCardMini
                                    v-if="sugestaoChefinho"
                                    :id="'chefinho-suggestion'"
                                    :imagemUrl="sugestaoChefinho.foto || ''"
                                    :titulo="sugestaoChefinho.titulo || 'Receita sugerida pelo Chefinho'"
                                    :tempo="formatarTempo(sugestaoChefinho.tempo)"
                                    :porcoes="formatarPorcoes(sugestaoChefinho.porcao)"
                                    :dificuldade="sugestaoChefinho.dificuldade || 'Fácil'"
                                    @click="abrirSugestaoChefinho"
                                />
                            </section>

                            <div v-if="resultadosReceitasOrdenados.length > 0" class="recipes-results-list">
                                <RecipeCard
                                    v-for="receita in resultadosReceitasOrdenados"
                                    :key="receita.id"
                                    :id="receita.id"
                                    :imagemUrl="receita.imagemUrl"
                                    :titulo="receita.titulo"
                                    :tempo="receita.tempo"
                                    :porcoes="receita.porcoes"
                                    :custo="receita.custo"
                                    :curtidas="receita.curtidas"
                                    :comentarios="receita.comentarios"
                                    :autorNome="receita.autorNome"
                                    :authorIniciais="receita.authorIniciais"
                                    :autorFotoUrl="receita.autorFotoUrl"
                                    :dificuldade="receita.dificuldade"
                                    v-model:salvo="receita.salvo"
                                    @toggle-save="tratarSalvarReceita"
                                />
                            </div>

                            <div v-else-if="!carregandoSugestao && !sugestaoChefinho" class="empty-state-container">
                                <h3 class="empty-title">Nenhuma receita encontrada</h3>
                                <p class="empty-desc">
                                    Não encontramos receitas com esse nome. O Chefinho também não conseguiu gerar uma sugestão agora.
                                </p>
                                <button class="btn-voltar-empty" @click="resetarBusca">
                                    ← voltar
                                </button>

                                <div class="banner-chefinho" @click="irParaChefinho">
                                    <div class="chefinho-avatar">
                                        <img src="/iconPaginas/chefe_icon_cinza.png" alt="Chefinho IA" />
                                    </div>
                                    <div class="chefinho-text">
                                        <h5>Dica do Chefinho</h5>
                                        <p>Otimize suas compras e reduza o desperdício com ajuda da IA →</p>
                                    </div>
                                </div>
                            </div>
                        </template>

                        <template v-else>
                            <section class="section-block" v-if="emAlta.length > 0">
                                <h3 class="section-label">Em alta agora 🔥</h3>
                                <div class="chips-row">
                                    <button v-for="tag in emAlta" :key="tag" class="chip-btn" @click="buscarPorTermo(tag)">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                            stroke-linejoin="round">
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                        </svg>
                                        <span>{{ tag }}</span>
                                    </button>
                                </div>
                            </section>

                            <section class="section-block">
                                <h3 class="section-label">Explorar por categoria</h3>
                                <div class="categories-grid">
                                    <div v-for="cat in categorias" :key="cat.id" class="category-card"
                                        :style="{ backgroundColor: cat.bg }" @click="buscarPorCategoria(cat)">
                                        <span class="cat-icon">{{ cat.icon }}</span>
                                        <span class="cat-nome">{{ cat.nome }}</span>
                                    </div>
                                </div>
                            </section>
                        </template>
                    </div>

                    <div v-else-if="abaAtiva === 'ingredientes'" class="tab-content">
                        <section class="section-block">
                            <h3 class="section-label-bold">Quais ingredientes você procura na receita?</h3>

                            <div class="ingredient-inputs-row">
                                <input type="text" v-model="novoIngredienteNome" class="input-field flex-grow"
                                    placeholder="Digite um ingrediente..." ref="inputNomeRef" @keyup.enter="adicionarIngredienteInput" />

                                <button class="add-ing-btn" @click="adicionarIngredienteInput" aria-label="Adicionar">
                                    {{ editandoIndex !== null ? '✓' : '+' }}
                                </button>
                            </div>

                            <p class="subtext">Toque para adicionar rapidamente:</p>
                            <div class="chips-row wrap">
                                <button v-for="ing in ingredientesRapidosFiltrados" :key="ing" class="chip-btn light"
                                    @click="adicionarIngredienteRapido(ing)">
                                    + {{ ing }}
                                </button>
                            </div>

                            <div v-if="ingredientesSelecionados.length > 0" class="selected-ingredients-block">
                                <div class="selected-header">
                                    <span>Meus Ingredientes ({{ ingredientesSelecionados.length }}) <small
                                            class="edit-hint">(Clique para editar)</small></span>
                                    <button class="clear-btn" @click="limparIngredientes">Limpar tudo</button>
                                </div>
                                <div class="selected-chips-row">
                                    <div v-for="(item, index) in ingredientesSelecionados" :key="index"
                                        class="selected-chip" @click="carregarParaEdicao(index)">
                                        <span class="texto-chip-ativo">{{ item.nome }}</span>
                                        <button class="remove-chip-btn"
                                            @click.stop="removerIngrediente(index)">×</button>
                                    </div>
                                </div>
                            </div>

                            <button 
                                class="action-submit-btn" 
                                :class="{ 'desativado': ingredientesSelecionados.length === 0 }"
                                :disabled="ingredientesSelecionados.length === 0"
                                @click="executarBuscaPorIngredientes"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                                <span>O que posso fazer?</span>
                            </button>
                        </section>

                        <section v-if="buscaIngredientesRealizada" class="section-block">
                            <div class="results-header">
                                <h3 class="section-label">Receitas compatíveis ({{ resultadosIngredientes.length }})</h3>
                            </div>

                            <div v-if="resultadosIngredientes.length > 0" class="recipes-results-list">
                                <div v-for="item in resultadosIngredientes" :key="item.receita.id" class="compat-card-wrapper">
                                    <RecipeCard
                                        :id="item.receita.id"
                                        :imagemUrl="item.receita.imagemUrl"
                                        :titulo="item.receita.titulo"
                                        :tempo="item.receita.tempo"
                                        :porcoes="item.receita.porcoes"
                                        :custo="item.receita.custo"
                                        :curtidas="item.receita.curtidas"
                                        :comentarios="item.receita.comentarios"
                                        :compatibilidade="item.compatibilidade"
                                        :autorNome="item.receita.autorNome"
                                        :authorIniciais="item.receita.authorIniciais"
                                        :autorFotoUrl="item.receita.autorFotoUrl"
                                        :dificuldade="item.receita.dificuldade"
                                        v-model:salvo="item.receita.salvo"
                                        @toggle-save="tratarSalvarReceita"
                                    />
                                </div>
                            </div>

                            <div v-else class="empty-state-container">
                                <h3 class="empty-title">Nenhuma receita encontrada</h3>
                                <p class="empty-desc">
                                    Não encontramos receitas com essa combinação de ingredientes.
                                </p>
                                <div class="banner-chefinho" @click="irParaChefinho">
                                    <div class="chefinho-avatar">
                                        <img src="/iconPaginas/chefe_icon_cinza.png" alt="Chefinho IA" />
                                    </div>
                                    <div class="chefinho-text">
                                        <h5>Pergunte ao Chefinho IA</h5>
                                        <p>Crie uma receita personalizada com os ingredientes que você tem →</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                    
                    <div class="banner-geladeira" @click="irParaGeladeira">
                        <div class="geladeira-icon-box">
                            <img src="/icon_cubo_de_gelo.png" alt="Geladeira" class="geladeira-img-icon" />
                        </div>
                        <div class="geladeira-text">
                            <h4>Buscar pela Geladeira</h4>
                            <p>Diga o que tem em casa e sugerimos receitas para economizar.</p>
                        </div>
                        <span class="chevron-arrow">›</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BarraNavegacao from '@/components/BarraNavegacao.vue';
import UserAvatar from '@/components/UserAvatar.vue';
import RecipeCard from '@/components/RecipeCard.vue';
import RecipeCardMini from '@/components/RecipeCardMini.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

import { authService } from '@/services/authService';
import {
    getListarUsuarios,
    postSeguirUsuario,
    postDeixarSeguirUsuario
} from '@/services/usuarios';
import {
    getBuscarReceitasPorNome,
    getBuscarReceitasPorCategoria,
    postBuscarReceitasPorIngredientes,
    getBuscasEmAlta,
    postSalvarSugestaoChefinho,
    postSalvarReceita,
    deleteSalvarReceita
} from '@/services/receitas';
import { postSugestaoBuscaReceita } from '@/services/chefinho';
import { getListarCategorias } from '@/services/catalogo';

const router = useRouter();
const usuarioLogadoId = computed(() => authService.getUserId());

const MAPA_CUSTO = { 1: 'Econômico', 2: 'Moderado', 3: 'Alto' };
const MAPA_DIFICULDADE = { 1: 'Fácil', 2: 'Médio', 3: 'Difícil' };

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

const normalizarReceita = (rec) => {
    if (!rec) return null;
    const autorNome = rec.usuario?.nome || 'Chef Entre Panelas';
    return {
        id: rec.id,
        imagemUrl: rec.foto || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
        titulo: rec.titulo || 'Receita',
        tempo: formatarTempo(rec.tempo),
        porcoes: formatarPorcoes(rec.porcao ?? rec.id_porcao),
        custo: MAPA_CUSTO[rec.id_custo] || (typeof rec.custo === 'string' ? rec.custo : 'Econômico'),
        dificuldade: MAPA_DIFICULDADE[rec.id_dificuldade] || (typeof rec.dificuldade === 'string' ? rec.dificuldade : 'Fácil'),
        curtidas: Number(rec.qtd_curtidas ?? rec.qtd_curtida ?? 0),
        comentarios: Array.isArray(rec.comentarios) ? rec.comentarios.length : Number(rec.qtd_comentarios ?? 0),
        autorNome,
        authorIniciais: gerarIniciais(autorNome),
        autorFotoUrl: rec.usuario?.foto_perfil || '',
        salvo: Boolean(rec.salvo_pelo_usuario ?? rec.eh_salva_pelo_usuario)
    };
};

// --- Estado Geral ---
const carregando = ref(false);
const termoBusca = ref('');
const abaAtiva = ref('usuarios');

const placeholderDinamico = computed(() => {
    if (abaAtiva.value === 'usuarios') return 'Buscar usuários por nome ou @username...';
    if (abaAtiva.value === 'ingredientes') return 'Filtrar sugestões de ingredientes...';
    return 'Buscar receitas pelo nome...';
});

// --- Aba Usuários (Lógica adaptada do UserSearchModal + API) ---
const listaUsuarios = ref([]);
const idsUsuariosSeguidos = ref(new Set());

const normalizarUsuario = (u) => ({
    id: u.id,
    nome: u.nome || 'Usuário',
    username: u.username || 'usuario',
    descricao: u.descricao || '',
    fotoUrl: u.foto_perfil || '',
    iniciais: gerarIniciais(u.nome),
    seguindo: Boolean(u.segue_usuario) || idsUsuariosSeguidos.value.has(Number(u.id))
});

const usuariosExibidos = computed(() => {
    const termo = termoBusca.value.toLocaleLowerCase('pt-BR').replace(/^@/, '').trim();
    if (!termo) return listaUsuarios.value;

    return listaUsuarios.value.filter(user =>
        user.nome.toLocaleLowerCase('pt-BR').includes(termo) ||
        user.username.toLocaleLowerCase('pt-BR').includes(termo)
    );
});

const carregarUsuariosIniciais = async () => {
    const userId = authService.getUserId();
    try {
        const usuariosRes = await getListarUsuarios();
        const dados = usuariosRes?.response?.usuarios || [];
        listaUsuarios.value = dados
            .filter(u => Number(u.id) !== Number(userId) && Number(u.id) !== 1)
            .map(normalizarUsuario);
    } catch (erro) {
        console.error('Erro ao listar usuários:', erro);
        listaUsuarios.value = [];
    }
};

const toggleSeguirUsuario = async (user) => {
    const estadoAnterior = user.seguindo;
    user.seguindo = !estadoAnterior;

    if (user.seguindo) {
        idsUsuariosSeguidos.value.add(Number(user.id));
    } else {
        idsUsuariosSeguidos.value.delete(Number(user.id));
    }

    try {
        if (user.seguindo) {
            await postSeguirUsuario(user.id);
        } else {
            await postDeixarSeguirUsuario(user.id);
        }
    } catch (erro) {
        console.error('Erro ao seguir/deixar de seguir usuário:', erro);
        user.seguindo = estadoAnterior;
        if (estadoAnterior) {
            idsUsuariosSeguidos.value.add(Number(user.id));
        } else {
            idsUsuariosSeguidos.value.delete(Number(user.id));
        }
    }
};

const abrirPerfilUsuario = (userId) => {
    if (Number(userId) === Number(usuarioLogadoId.value)) {
        router.push('/perfil');
    } else {
        router.push({ path: '/others-perfil', query: { id: userId } });
    }
};

const ESTILOS_CATEGORIAS = {
    1: { icon: '☕', bg: '#FCECDA' },
    2: { icon: '🥗', bg: '#E3F4ED' },
    3: { icon: '🌙', bg: '#EFEBE8' },
    4: { icon: '🍰', bg: '#FDE69E' },
    5: { icon: '🥪', bg: '#FCECDA' },
    6: { icon: '🍲', bg: '#EFEBE8' },
    7: { icon: '🥬', bg: '#E3F4ED' },
    8: { icon: '🥤', bg: '#FDE0E0' }
};

const categorias = ref([
    { id: 1, nome: 'Café da manhã', icon: '☕', bg: '#FCECDA' },
    { id: 2, nome: 'Almoço', icon: '🥗', bg: '#E3F4ED' },
    { id: 3, nome: 'Jantar', icon: '🌙', bg: '#EFEBE8' },
    { id: 4, nome: 'Sobremesa', icon: '🍰', bg: '#FDE69E' },
    { id: 5, nome: 'Lanche', icon: '🥪', bg: '#FCECDA' },
    { id: 6, nome: 'Sopa', icon: '🍲', bg: '#EFEBE8' },
    { id: 7, nome: 'Salada', icon: '🥬', bg: '#E3F4ED' },
    { id: 8, nome: 'Bebida', icon: '🥤', bg: '#FDE0E0' }
]);

const buscaReceitaAtiva = ref(false);
const tituloResultadoReceitas = ref('');
const resultadosReceitas = ref([]);
const emAlta = ref([]);
const sugestaoChefinho = ref(null);
const carregandoSugestao = ref(false);
const salvandoSugestao = ref(false);
const mensagemErroSugestao = ref('');
const ordenacaoReceitas = ref('relevancia');
let sequenciaBuscaReceitas = 0;

const extrairMinutos = (tempo) => {
    if (typeof tempo === 'number' && Number.isFinite(tempo)) return tempo;
    const texto = String(tempo || '').trim().toLowerCase();
    const formatoHora = texto.match(/^(\d{1,3}):(\d{1,2})(?::(\d{1,2}))?$/);
    if (formatoHora) return Number(formatoHora[1]) * 60 + Number(formatoHora[2]);
    const valor = texto.match(/\d+(?:[,.]\d+)?/);
    return valor ? Number(valor[0].replace(',', '.')) : Number.POSITIVE_INFINITY;
};

const resultadosReceitasOrdenados = computed(() => {
    const itens = resultadosReceitas.value.map((receita, indice) => ({ receita, indice }));
    itens.sort((a, b) => {
        if (ordenacaoReceitas.value === 'recentes') {
            return Number(b.receita.id || 0) - Number(a.receita.id || 0) || a.indice - b.indice;
        }
        if (ordenacaoReceitas.value === 'curtidas') {
            return Number(b.receita.curtidas || 0) - Number(a.receita.curtidas || 0) || a.indice - b.indice;
        }
        if (ordenacaoReceitas.value === 'tempo') {
            return extrairMinutos(a.receita.tempo) - extrairMinutos(b.receita.tempo) || a.indice - b.indice;
        }
        if (ordenacaoReceitas.value === 'relevancia') {
            const termo = termoBusca.value.trim().toLocaleLowerCase('pt-BR');
            if (!termo) return a.indice - b.indice;
            const pontuar = (titulo) => {
                const texto = String(titulo || '').toLocaleLowerCase('pt-BR');
                if (texto === termo) return 0;
                if (texto.startsWith(termo)) return 1;
                return texto.includes(termo) ? 2 : 3;
            };
            return pontuar(a.receita.titulo) - pontuar(b.receita.titulo) || a.indice - b.indice;
        }
        return a.indice - b.indice;
    });
    return itens.map(item => item.receita);
});

const abrirSugestaoChefinho = () => {
    if (!sugestaoChefinho.value) return;
    try {
        sessionStorage.setItem('entre-panelas:receita-sugestao-chefinho', JSON.stringify(sugestaoChefinho.value));
        router.push({ name: 'receita-sugestao' });
    } catch (erro) {
        console.error('Não foi possível abrir a sugestão do Chefinho:', erro);
    }
};


const salvarSugestaoChefinho = async () => {
    if (!sugestaoChefinho.value || salvandoSugestao.value) return;
    salvandoSugestao.value = true;
    mensagemErroSugestao.value = '';
    try {
        const resposta = await postSalvarSugestaoChefinho(sugestaoChefinho.value);
        const idReceita = Number(resposta?.response?.id ?? resposta?.response?.receita?.id ?? resposta?.response?.id_receita);
        if (!Number.isInteger(idReceita) || idReceita <= 0) {
            throw new Error('A API não confirmou o cadastro da receita sugerida.')
        }
        sessionStorage.removeItem('entre-panelas:receita-sugestao-chefinho');
        await router.push({ name: 'receita', params: { id: idReceita } });
    } catch (erro) {
        console.error('Erro ao salvar a sugestão do Chefinho:', erro);
        mensagemErroSugestao.value = erro?.message || 'Não foi possível salvar a sugestão do Chefinho.';
    } finally {
        salvandoSugestao.value = false;
    }
};

const recusarSugestaoChefinho = () => {
    mensagemErroSugestao.value = '';
    sugestaoChefinho.value = null;
    sessionStorage.removeItem('entre-panelas:receita-sugestao-chefinho');
};

const carregarDadosReceitas = async () => {
    try {
        const [altaRes, catRes] = await Promise.all([
            getBuscasEmAlta().catch(() => null),
            getListarCategorias().catch(() => null)
        ]);

        const listaAlta = altaRes?.response?.dados || [];
        if (Array.isArray(listaAlta) && listaAlta.length > 0) {
            emAlta.value = listaAlta
                .map(item => item.nome)
                .filter(Boolean);
        }

        const listaCats = catRes?.response?.dados || [];
        if (listaCats.length > 0) {
            categorias.value = listaCats.map(c => ({
                id: c.id,
                nome: c.categoria,
                icon: ESTILOS_CATEGORIAS[c.id]?.icon || '🍽️',
                bg: ESTILOS_CATEGORIAS[c.id]?.bg || '#FCECDA'
            }));
        }
    } catch (erro) {
        console.error('Erro ao carregar metadados de receitas:', erro);
    }
};

const buscarPorTermo = async (termo) => {
    termoBusca.value = termo;
    await buscarReceitasPorNomeApi(termo);
};

const buscarReceitasPorNomeApi = async (nome) => {
    const query = nome.trim().slice(0, 50);
    if (!query) return;

    const idBusca = ++sequenciaBuscaReceitas;
    carregando.value = true;
    buscaReceitaAtiva.value = true;
    tituloResultadoReceitas.value = `Resultados para \"${query}\"`;
    resultadosReceitas.value = [];
    sugestaoChefinho.value = null;
    carregandoSugestao.value = false;

    let receitasEncontradas = [];
    try {
        const res = await getBuscarReceitasPorNome({ nome: query, limite: 30 });
        const dados = res?.response?.receitas || res?.response?.usuarios || res?.response?.dados || [];
        receitasEncontradas = Array.isArray(dados) ? dados : [];
        if (idBusca !== sequenciaBuscaReceitas) return;
        resultadosReceitas.value = receitasEncontradas.map(normalizarReceita).filter(Boolean);
    } catch (erro) {
        // A busca pode retornar 404 quando não há receitas na base. Ainda assim,
        // a consulta ao Chefinho deve ocorrer com encontrados_db vazio.
        console.warn('Busca no catálogo sem resultados ou com erro:', erro?.message || erro);
        if (idBusca !== sequenciaBuscaReceitas) return;
        resultadosReceitas.value = [];
    } finally {
        if (idBusca === sequenciaBuscaReceitas) carregando.value = false;
    }

    if (idBusca !== sequenciaBuscaReceitas) return;
    carregandoSugestao.value = true;

    const encontradosDb = receitasEncontradas.slice(0, 50).map((receita) => ({
        titulo: receita.titulo || '',
        descricao: receita.descricao || '',
        foto: receita.foto || '',
        video: receita.video || '',
        tempo: receita.tempo || '00:30:00',
        custo: receita.custo?.[0]?.tipo_custo || receita.custo || MAPA_CUSTO[receita.id_custo] || 'Baixo',
        dificuldade: receita.dificuldade?.[0]?.dificuldade || receita.dificuldade || MAPA_DIFICULDADE[receita.id_dificuldade] || 'Fácil',
        porcao: Number(receita.porcao?.[0]?.numero_porcao ?? receita.porcao ?? receita.id_porcao ?? 1)
    }));

    try {
        const sugestaoRes = await postSugestaoBuscaReceita({
            pesquisa_usuario: query,
            encontrados_db: encontradosDb
        });
        if (idBusca !== sequenciaBuscaReceitas) return;
        const resposta = sugestaoRes?.response || {};
        sugestaoChefinho.value = resposta.possui_sugestao && resposta.receita
            ? resposta.receita
            : null;
    } catch (erro) {
        if (idBusca === sequenciaBuscaReceitas) {
            console.warn('O Chefinho não conseguiu sugerir uma receita:', erro?.message || erro);
            sugestaoChefinho.value = null;
        }
    } finally {
        if (idBusca === sequenciaBuscaReceitas) carregandoSugestao.value = false;
    }
};

const buscarPorCategoria = async (cat) => {
    ++sequenciaBuscaReceitas;
    sugestaoChefinho.value = null;
    carregandoSugestao.value = false;
    carregando.value = true;
    buscaReceitaAtiva.value = true;
    tituloResultadoReceitas.value = `Categoria: ${cat.nome}`;

    try {
        const res = await getBuscarReceitasPorCategoria({ id_categoria: cat.id, limite: 30 });
        const dados = res?.response?.usuarios || res?.response?.receitas || res?.response?.dados || [];
        resultadosReceitas.value = dados.map(normalizarReceita).filter(Boolean);
    } catch (erro) {
        console.error('Erro ao buscar receitas por categoria:', erro);
        resultadosReceitas.value = [];
    } finally {
        carregando.value = false;
    }
};

const tratarSalvarReceita = async ({ id, salvo }) => {
    try {
        if (salvo) {
            await postSalvarReceita(id);
        } else {
            await deleteSalvarReceita(id);
        }
    } catch (erro) {
        console.error('Erro ao salvar/remover receita:', erro);
    }
};

// --- Aba Ingredientes ---
const inputNomeRef = ref(null);
const novoIngredienteNome = ref('');
const editandoIndex = ref(null);
const ingredientesSelecionados = ref([]);
const buscaIngredientesRealizada = ref(false);
const resultadosIngredientes = ref([]);

const ingredientesRapidos = ref([
    'frango', 'ovo', 'queijo', 'tomate', 'cebola', 'alho',
    'arroz', 'feijão', 'batata', 'cenoura', 'leite', 'manteiga',
    'farinha', 'açúcar', 'azeite', 'pimentão', 'carne moída',
    'creme de leite', 'milho', 'ervilha', 'manjericão', 'pimenta',
    'limão', 'sal', 'pimenta do reino', 'margarina', 'aveia', 'mel'
]);

const ingredientesRapidosFiltrados = computed(() => {
    if (abaAtiva.value !== 'ingredientes' || !termoBusca.value.trim()) {
        return ingredientesRapidos.value;
    }
    const termo = termoBusca.value.toLowerCase().trim();
    return ingredientesRapidos.value.filter(ing => ing.toLowerCase().includes(termo));
});

const adicionarIngredienteRapido = (nome) => {
    const jaExiste = ingredientesSelecionados.value.some(
        item => item.nome.toLowerCase() === nome.toLowerCase()
    );
    if (!jaExiste) {
        ingredientesSelecionados.value.push({ nome });
    }
};

const adicionarIngredienteInput = () => {
    if (!novoIngredienteNome.value.trim()) return;

    if (editandoIndex.value !== null) {
        ingredientesSelecionados.value[editandoIndex.value].nome = novoIngredienteNome.value.trim();
        editandoIndex.value = null;
    } else {
        ingredientesSelecionados.value.push({
            nome: novoIngredienteNome.value.trim()
        });
    }

    novoIngredienteNome.value = '';
};

const carregarParaEdicao = (index) => {
    const item = ingredientesSelecionados.value[index];
    novoIngredienteNome.value = item.nome;
    editandoIndex.value = index;
    if (inputNomeRef.value) {
        inputNomeRef.value.focus();
    }
};

const removerIngrediente = (index) => {
    if (editandoIndex.value === index) {
        editandoIndex.value = null;
        novoIngredienteNome.value = '';
    }
    ingredientesSelecionados.value.splice(index, 1);
};

const limparIngredientes = () => {
    ingredientesSelecionados.value = [];
    editandoIndex.value = null;
    novoIngredienteNome.value = '';
    buscaIngredientesRealizada.value = false;
    resultadosIngredientes.value = [];
};

const executarBuscaPorIngredientes = async () => {
    if (ingredientesSelecionados.value.length === 0) return;

    carregando.value = true;
    buscaIngredientesRealizada.value = true;

    try {
        const payload = {
            ingredientes: ingredientesSelecionados.value.map(item => ({ nome: item.nome }))
        };
        const res = await postBuscarReceitasPorIngredientes(payload);
        const receitasBase = res?.response?.receitas_base || res?.response?.receitas || [];

        resultadosIngredientes.value = receitasBase
            .map(item => ({
                receita: normalizarReceita(item.receita || item),
                compatibilidade: item.compatibilidade_percentual ?? item.compatibilidade ?? null
            }))
            .filter(item => item.receita !== null);
    } catch (erro) {
        console.error('Erro ao buscar receitas por ingredientes:', erro);
        resultadosIngredientes.value = [];
    } finally {
        carregando.value = false;
    }
};

// --- Controle de Abas e Busca ---
const mudarAba = (aba) => {
    ++sequenciaBuscaReceitas;
    sugestaoChefinho.value = null;
    carregandoSugestao.value = false;
    abaAtiva.value = aba;
    termoBusca.value = '';
    buscaReceitaAtiva.value = false;
};

const tratarDigitacaoBusca = () => {
    if (abaAtiva.value === 'receitas' && !termoBusca.value.trim()) {
        ++sequenciaBuscaReceitas;
        buscaReceitaAtiva.value = false;
        resultadosReceitas.value = [];
        sugestaoChefinho.value = null;
        carregandoSugestao.value = false;
    }
};

const executarBusca = () => {
    if (!termoBusca.value.trim()) return;

    if (abaAtiva.value === 'receitas') {
        buscarReceitasPorNomeApi(termoBusca.value);
    }
};

const resetarBusca = () => {
    ++sequenciaBuscaReceitas;
    termoBusca.value = '';
    buscaReceitaAtiva.value = false;
    resultadosReceitas.value = [];
    sugestaoChefinho.value = null;
    carregandoSugestao.value = false;
};

const irParaGeladeira = () => router.push('/geladeira');
const irParaChefinho = () => router.push('/chefinho');

onMounted(async () => {
    carregando.value = true;
    await Promise.all([
        carregarUsuariosIniciais(),
        carregarDadosReceitas()
    ]);
    carregando.value = false;
});
</script>

<style scoped>
.corpo {
    display: flex;
    width: 100%;
    min-height: 100vh;
    background-color: var(--cinza-claro);
    font-family: "Inter", sans-serif;
}

.coluna {
    width: calc(100% - 200px);
    min-width: 0;
    margin-left: 200px;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.header-topo {
    width: 100%;
    height: 60px;
    background-color: white;
    border-bottom: 1px solid var(--bege);
    display: flex;
    align-items: center;
    padding: 0 24px;
    box-sizing: border-box;
    gap: 16px;
}

.back-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--marrom);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
}

.header-titles h2 {
    font-family: "Inter", serif;
    font-size: 18px;
    color: var(--marrom);
    margin: 0;
    font-weight: 500;
}

.header-titles p {
    font-size: 11px;
    color: var(--cinza);
    margin: 1px 0 0 0;
}

.conteudo {
    background-color: var(--cinza-claro);
    flex: 1;
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 24px 16px 40px 16px;
    box-sizing: border-box;
}

.search-container {
    width: 100%;
    max-width: 1000px;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.search-input-wrapper {
    position: relative;
    width: 100%;
}

.search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--cinza);
}

.search-input-wrapper input {
    width: 100%;
    padding: 14px 42px 14px 46px;
    border: 1px solid var(--bege);
    border-radius: 25px;
    background-color: #FFFFFF;
    font-size: 14px;
    color: var(--marrom);
    outline: none;
    box-sizing: border-box;
}

.search-input-wrapper input::placeholder {
    color: var(--cinza-branco);
}

.clear-search-btn {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: #EFEAE1;
    border: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    color: var(--marrom);
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.tabs-filter {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    scrollbar-width: none;
}

.tabs-filter::-webkit-scrollbar {
    display: none;
}

.tab-pill {
    background: none;
    border: none;
    font-size: 14px;
    font-weight: 600;
    color: var(--cinza);
    padding: 8px 18px;
    border-radius: 20px;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s;
}

.tab-pill.active {
    background-color: var(--marrom);
    color: #FFFFFF;
}

.tab-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.section-block {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.results-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.results-count {
    font-size: 12px;
    color: var(--cinza);
    font-weight: 500;
}

.btn-voltar-inline {
    background: none;
    border: none;
    color: var(--verde-escuro);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
}

.btn-voltar-inline:hover {
    text-decoration: underline;
}

/* Cards de Usuários integrados ao estilo da BuscarView */
.users-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.user-card {
    background-color: #FFFFFF;
    border: 1px solid var(--bege);
    border-radius: 16px;
    padding: 14px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    cursor: pointer;
    transition: border-color 0.2s, transform 0.1s;
}

.user-card:hover {
    border-color: var(--verde);
    transform: translateY(-1px);
}

.user-card-left {
    display: flex;
    align-items: center;
    gap: 14px;
    flex: 1;
    min-width: 0;
}

.user-card-left :deep(.user-avatar-component) {
    width: 48px !important;
    height: 48px !important;
    min-width: 48px !important;
    min-height: 48px !important;
    max-width: 48px !important;
    max-height: 48px !important;
    flex: 0 0 48px;
}

.user-card-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.user-card-info h4 {
    font-size: 15px;
    font-weight: 700;
    color: var(--marrom);
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.user-handle {
    font-size: 12px;
    color: var(--cinza);
    margin-top: 2px;
}

.user-bio {
    font-size: 12px;
    color: #6E655F;
    margin: 4px 0 0 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.follow-pill-btn {
    background-color: var(--verde);
    color: #FFFFFF;
    border: 1px solid var(--verde);
    padding: 7px 18px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.2s;
}

.follow-pill-btn:hover {
    background-color: var(--verde-escuro);
    border-color: var(--verde-escuro);
}

.follow-pill-btn.following {
    background-color: #E3F4ED;
    color: var(--verde-escuro);
    border-color: var(--verde);
}

.section-label {
    font-size: 14px;
    font-weight: 700;
    color: var(--marrom);
    margin: 0;
}

.section-label-bold {
    font-family: "Inter", sans-serif;
    font-size: 18px;
    color: var(--marrom);
    margin: 0;
    font-weight: 700;
}

.chips-row {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    scrollbar-width: none;
}

.chips-row.wrap {
    flex-wrap: wrap;
}

.chip-btn {
    background-color: #FFFFFF;
    border: 1px solid var(--bege);
    border-radius: 20px;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 500;
    color: var(--marrom);
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    white-space: nowrap;
    transition: 0.2s;
}

.chip-btn.light {
    background-color: #FAF8F5;
    border-color: #E0D5C1;
    color: var(--marrom);
}

.chip-btn:hover {
    background-color: rgba(114, 188, 165, 0.15);
    color: var(--verde-escuro);
    border-color: var(--verde);
}

.categories-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
}

.category-card {
    padding: 18px 20px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: transform 0.1s;
}

.category-card:hover {
    transform: translateY(-2px);
}

.cat-icon {
    font-size: 18px;
}

.cat-nome {
    font-size: 14px;
    font-weight: 700;
    color: var(--marrom);
}

.recipes-results-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.results-header-recipes {
    gap: 16px;
    flex-wrap: wrap;
}

.results-tools {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 14px;
    flex-wrap: wrap;
}

.sort-control {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--cinza);
    font-size: 12px;
}

.sort-control select {
    max-width: 190px;
    border: 1px solid var(--bege);
    border-radius: 10px;
    padding: 8px 10px;
    color: var(--marrom);
    background: #fff;
    font: inherit;
}

.chefinho-suggestion-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 0;
    border: 0;
    border-radius: 18px;
    background: transparent;
}

.chefinho-suggestion-banner {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    padding: 18px 22px;
    border: 1px solid var(--bege);
    border-radius: 16px;
    background: #fff8e9;
    box-sizing: border-box;
}

.chefinho-suggestion-message {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
}

.chefinho-suggestion-message img {
    width: 54px;
    height: 54px;
    flex: 0 0 54px;
    object-fit: contain;
}

.chefinho-suggestion-message strong {
    display: block;
    color: var(--marrom);
    font-size: 15px;
    margin-bottom: 4px;
}

.chefinho-suggestion-message p {
    margin: 0;
    color: var(--marrom);
    font-size: 14px;
}

.chefinho-suggestion-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
}

.suggestion-like-btn,
.suggestion-dislike-btn {
    border: 0;
    border-radius: 10px;
    padding: 10px 18px;
    font: inherit;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
}

.suggestion-like-btn {
    background: #72bca5;
    color: #fff;
}

.suggestion-dislike-btn {
    background: #bc0b27;
    color: #fff;
}

.suggestion-like-btn:disabled,
.suggestion-dislike-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.chefinho-suggestion-section :deep(.recipe-card-mini) {
    max-width: 380px;
}

.chefinho-suggestion-section :deep(.recipe-image-container) {
    height: 212px;
}

@media (max-width: 650px) {
    .chefinho-suggestion-banner {
        align-items: flex-start;
        flex-direction: column;
    }

    .chefinho-suggestion-actions {
        width: 100%;
    }

    .suggestion-like-btn,
    .suggestion-dislike-btn {
        flex: 1;
    }
}

.suggestion-error {
    margin: 8px 0 0;
    color: #a12f2f;
    font-size: 13px;
}

.suggestion-status {
    color: var(--cinza);
    font-size: 12px;
}

.compat-card-wrapper {
    position: relative;
}

.compat-badge {
    display: inline-block;
    background-color: #E3F4ED;
    color: var(--verde-escuro);
    border: 1px solid var(--verde);
    font-size: 12px;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 14px;
    margin-bottom: -6px;
}

.ingredient-inputs-row {
    display: flex;
    gap: 12px;
    align-items: center;
}

.input-field {
    padding: 12px 16px;
    border: 1px solid #E0D5C1;
    border-radius: 12px;
    background-color: #FFFFFF;
    font-size: 14px;
    outline: none;
    color: var(--marrom);
    box-sizing: border-box;
}

.flex-grow {
    flex: 1;
}

.input-field::placeholder {
    color: var(--cinza-branco);
}

.add-ing-btn {
    background-color: var(--verde);
    color: #FFFFFF;
    border: none;
    border-radius: 12px;
    width: 44px;
    height: 44px;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background-color 0.2s;
}

.add-ing-btn:hover {
    background-color: var(--verde-escuro);
}

.subtext {
    font-size: 12px;
    color: var(--cinza);
    margin: 4px 0 0 0;
}

.selected-ingredients-block {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 10px;
}

.selected-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    font-weight: 700;
    color: var(--marrom);
}

.edit-hint {
    font-size: 11px;
    font-weight: 400;
    color: var(--cinza);
}

.clear-btn {
    background: none;
    border: none;
    font-size: 11px;
    color: var(--cinza);
    cursor: pointer;
}

.clear-btn:hover {
    color: var(--vermelho);
}

.selected-chips-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.selected-chip {
    background-color: rgba(114, 188, 165, 0.15);
    border: 1px solid var(--verde);
    color: var(--marrom);
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.selected-chip:hover {
    background-color: rgba(114, 188, 165, 0.25);
}

.texto-chip-ativo {
    text-transform: capitalize;
}

.remove-chip-btn {
    background: none;
    border: none;
    color: var(--verde-escuro);
    font-size: 14px;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.action-submit-btn {
    background-color: var(--verde);
    color: #FFFFFF;
    border: none;
    border-radius: 12px;
    padding: 14px;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
    transition: all 0.2s;
}

.action-submit-btn:hover:not(:disabled) {
    background-color: var(--verde-escuro);
}

.action-submit-btn.desativado {
    opacity: 0.45;
    cursor: not-allowed;
}

.communities-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.community-card {
    background-color: #FFFFFF;
    border: 1px solid var(--bege);
    border-radius: 16px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 16px;
    cursor: pointer;
    transition: border-color 0.2s;
}

.community-card:hover {
    border-color: var(--verde);
}

.com-icon-box {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background-color: rgba(114, 188, 165, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--marrom);
    overflow: hidden;
    flex-shrink: 0;
}

.com-avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.com-info h4 {
    font-size: 14px;
    font-weight: 700;
    color: var(--marrom);
    margin: 0;
}

.com-info p {
    font-size: 12px;
    color: var(--cinza);
    margin: 2px 0 0 0;
}

.sem-resultados {
    text-align: center;
    padding: 20px;
    color: var(--cinza);
    font-size: 13px;
}

.empty-state-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 32px 16px;
    gap: 12px;
}

.empty-title {
    font-family: "Playfair Display", serif;
    font-size: 22px;
    color: var(--marrom);
    margin: 0;
    font-weight: 700;
}

.empty-desc {
    font-size: 13px;
    color: var(--cinza);
    max-width: 380px;
    margin: 0;
}

.btn-voltar-empty {
    background-color: var(--verde);
    color: #FFFFFF;
    border: none;
    border-radius: 20px;
    padding: 8px 24px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 8px;
}

.banner-chefinho {
    background-color: #FCECDA;
    border-radius: 16px;
    padding: 14px 18px;
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    margin-top: 24px;
    cursor: pointer;
    box-sizing: border-box;
}

.chefinho-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.chefinho-avatar img {
    width: 20px;
    height: auto;
}

.chefinho-text {
    text-align: left;
}

.chefinho-text h5 {
    font-size: 13px;
    font-weight: 700;
    color: var(--marrom);
    margin: 0;
}

.chefinho-text p {
    font-size: 11px;
    color: #6E655F;
    margin: 2px 0 0 0;
}

.banner-geladeira {
    background-color: rgba(114, 188, 165, 0.15);
    border-radius: 16px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    cursor: pointer;
    margin-top: 10px;
}

.geladeira-icon-box {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background-color: var(--azul);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
}

.geladeira-img-icon {
    width: 22px;
    height: 22px;
    object-fit: contain;
}

.geladeira-text {
    flex: 1;
}

.geladeira-text h4 {
    font-size: 14px;
    font-weight: 700;
    color: var(--marrom);
    margin: 0;
}

.geladeira-text p {
    font-size: 11px;
    color: #6E655F;
    margin: 2px 0 0 0;
}

.chevron-arrow {
    font-size: 20px;
    color: var(--marrom);
    font-weight: 700;
}

@media (max-width: 768px) {
    .corpo {
        flex-direction: column;
    }

    .coluna {
        width: 100%;
        margin-left: 0;
        flex: 1;
        min-height: auto;
    }

    .header-topo {
        height: auto;
        min-height: 60px;
        padding: 12px 16px;
    }

    .header-titles h2 {
        font-size: 16px;
    }

    .conteudo {
        padding: 30px 12px 32px 12px;
    }

    .search-container {
        gap: 20px;
    }

    .search-input-wrapper input {
        font-size: 13px;
        padding: 12px 38px 12px 42px;
        border-radius: 10px;
    }

    .tabs-filter {
        gap: 6px;
    }

    .tab-pill {
        font-size: 13px;
        padding: 6px 12px;
    }

    .user-card {
        padding: 12px 14px;
    }

    .follow-pill-btn {
        padding: 6px 14px;
        font-size: 12px;
    }

    .section-block {
        gap: 16px;
    }

    .section-label-bold {
        font-size: 16px;
    }

    .categories-grid {
        gap: 10px;
    }

    .category-card {
        padding: 14px 12px;
    }

    .cat-nome {
        font-size: 13px;
    }

    .community-card {
        padding: 12px;
        gap: 12px;
    }

    .empty-title {
        font-size: 20px;
    }

    .banner-geladeira {
        padding: 14px 16px;
        gap: 12px;
    }

    .none {
        display: none;
    }
}

@media (max-width: 480px) {
    .header-topo {
        display: flex;
    }

    .search-container {
        margin-bottom: 50px;
    }
}
</style>