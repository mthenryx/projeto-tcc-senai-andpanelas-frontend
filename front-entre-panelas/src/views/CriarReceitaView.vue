<template>
    <div class="corpo">

        <BarraNavegacao />

        <div class="coluna">
            <header class="header-topo none" v-if="etapaAtual <= 3">
                <div class="header-left">
                    <button class="back-btn" @click="voltarEtapa" aria-label="Voltar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                    </button>
                    <div class="header-titles">
                        <h2>{{ isModoEdicao ? 'Editar Receita' : 'Nova Receita' }}</h2>
                        <p>Etapa {{ etapaAtual }} de 3</p>
                    </div>
                </div>
            </header>

            <div class="conteudo">
                <div v-if="carregandoInicial" class="form-container loading-box">
                    <p class="loading-text">
                        {{ isModoEdicao ? 'Carregando dados da receita...' : 'Carregando opções do formulário...' }}
                    </p>
                </div>

                <div class="form-container" v-else-if="!sucessoPublicacao">

                    <div class="progress-bar-container">
                        <div class="progress-segment" :class="{ active: etapaAtual >= 1 }"></div>
                        <div class="progress-segment" :class="{ active: etapaAtual >= 2 }"></div>
                        <div class="progress-segment" :class="{ active: etapaAtual >= 3 }"></div>
                    </div>

                    <div v-if="erroApi" class="api-error-banner">
                        {{ erroApi }}
                    </div>

                    <div v-if="etapaAtual === 1" class="etapa-content">
                        <h3 class="section-title">Informações da receita</h3>

                        <div class="upload-box" @click="dispararInputFoto"
                            :class="{ 'error-upload-box': erros.foto, 'has-file': previewFoto }">
                            <input type="file" ref="fileFotoRef" accept="image/*" @change="tratarUploadFoto"
                                style="display: none;" />
                            <div v-if="!previewFoto" class="upload-placeholder">
                                <img src="/icon_camera_receita.png" alt="Câmera" class="upload-icon-img" />
                                <span class="upload-title-text">Adicionar foto da receita</span>
                                <span class="upload-sub-text">Toque para escolher da galeria ou tirar foto</span>
                            </div>
                            <div v-else class="preview-container">
                                <img :src="previewFoto" alt="Pré-visualização da foto" class="preview-media" />
                                <span class="change-overlay">
                                    {{ enviandoFoto ? 'Enviando foto...' : 'Alterar foto' }}
                                </span>
                            </div>
                        </div>

                        <div class="upload-box" @click="dispararInputVideo" :class="{ 'has-file': previewVideo }">
                            <input type="file" ref="fileVideoRef" accept="video/*" @change="tratarUploadVideo"
                                style="display: none;" />
                            <div v-if="!previewVideo" class="upload-placeholder">
                                <img src="/icon_play.png" alt="Vídeo" class="upload-icon-img" />
                                <span class="upload-title-text">Adicionar vídeo da receita</span>
                                <span class="upload-sub-text">Toque para escolher da galeria um vídeo</span>
                            </div>
                            <div v-else class="preview-container video-preview">
                                <video :src="previewVideo" class="preview-media" controls></video>
                                <span class="change-overlay">
                                    {{ enviandoVideo ? 'Enviando vídeo...' : 'Alterar vídeo' }}
                                </span>
                            </div>
                        </div>

                        <div class="input-group">
                            <label class="input-label">Nome da receita <span class="required">*</span></label>
                            <input type="text" v-model="form.titulo" class="text-input"
                                :class="{ 'error-input': erros.titulo }"
                                placeholder="Ex: Bolo de Cenoura com Brigadeiro" @input="erros.titulo = false"
                                maxlength="50" />
                        </div>

                        <div class="input-group">
                            <label class="input-label">Descrição <span class="required">*</span></label>
                            <textarea v-model="form.descricao" class="textarea-input"
                                :class="{ 'error-input': erros.descricao }" rows="3"
                                placeholder="Conte um pouco sobre essa receita..." @input="erros.descricao = false"
                                maxlength="200"></textarea>
                        </div>

                        <div class="input-group">
                            <label class="input-label">Categoria <span class="required">*</span></label>
                            <div class="categories-chips-row">
                                <button type="button" v-for="cat in categoriasDisponiveis" :key="cat.id"
                                    class="cat-chip"
                                    :class="{ active: form.categoriaId === cat.id, 'error-border': erros.categoria && !form.categoriaId }"
                                    @click="selecionarCategoria(cat.id)">
                                    {{ cat.nome }}
                                </button>
                            </div>
                        </div>

                        <div class="row-dupla">
                            <div class="input-group flex-1">
                                <label class="input-label">Dificuldade <span class="required">*</span></label>
                                <select v-model.number="form.id_dificuldade" class="select-input">
                                    <option v-for="dif in dificuldadesDisponiveis" :key="dif.id" :value="dif.id">
                                        {{ dif.nome }}
                                    </option>
                                </select>
                            </div>

                            <div class="input-group flex-1">
                                <label class="input-label">Custo estimado <span class="required">*</span></label>
                                <select v-model.number="form.id_custo" class="select-input">
                                    <option v-for="custo in custosDisponiveis" :key="custo.id" :value="custo.id">
                                        {{ custo.nome }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div class="row-dupla">
                            <div class="input-group flex-1">
                                <label class="input-label">Tempo (minutos) <span class="required">*</span></label>
                                <input type="number" v-model.number="form.tempo" min="1" max="1440" class="text-input"
                                    :class="{ 'error-input': erros.tempo }" @input="erros.tempo = false" />
                            </div>

                            <div class="input-group flex-1">
                                <label class="input-label">Porções <span class="required">*</span></label>
                                <select v-model.number="form.id_porcao" class="select-input">
                                    <option v-for="porcao in porcoesDisponiveis" :key="porcao.id" :value="porcao.id">
                                        {{ porcao.nome }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <button type="button" class="btn-primary-ingrediente" :disabled="enviandoFoto || enviandoVideo"
                            @click="avancarParaEtapa2">
                            {{ enviandoFoto || enviandoVideo ? 'Aguarde o envio da mídia...' : 'Próximo: Ingredientes →' }}
                        </button>
                    </div>

                    <div v-if="etapaAtual === 2" class="etapa-content">
                        <h3 class="section-title">Ingredientes</h3>

                        <div class="dynamic-list-container">
                            <div v-for="(ing, index) in form.ingredientes" :key="ing.id || index" class="dynamic-row">
                                <input type="text" v-model="ing.nome" class="text-input flex-2"
                                    :class="{ 'error-input': erros.ingredientes && !ing.nome.trim() }"
                                    placeholder="Ingrediente" maxlength="35" />

                                <select v-model.number="ing.id_unidade_medida" class="select-input flex-1"
                                    :class="{ 'error-input': erros.ingredientes && !ing.id_unidade_medida }">
                                    <option value="" disabled>Unidade de medida</option>
                                    <option v-for="uni in unidadesMedidaDisponiveis" :key="uni.id" :value="uni.id">
                                        {{ uni.nome }}
                                    </option>
                                </select>

                                <input type="number" v-model.number="ing.quantidade" min="0" max="1000" step="any"
                                    class="text-input flex-1"
                                    :class="{ 'error-input': erros.ingredientes && (ing.quantidade === '' || ing.quantidade <= 0) }"
                                    placeholder="Qtd." />

                                <button type="button" class="remove-row-btn" @click="removerIngrediente(index)"
                                    aria-label="Remover">
                                    ✕
                                </button>
                            </div>
                        </div>

                        <button type="button" class="btn-dashed-add" @click="adicionarIngrediente">
                            + Adicionar ingrediente
                        </button>

                        <div class="navigation-buttons-row">
                            <button type="button" class="btn-secondary" @click="etapaAtual = 1">
                                ← Voltar
                            </button>
                            <button type="button" class="btn-primary" @click="avancarParaEtapa3">
                                Próximo: Preparo →
                            </button>
                        </div>
                    </div>

                    <div v-if="etapaAtual === 3" class="etapa-content">
                        <h3 class="section-title">Modo de preparo</h3>

                        <div class="dynamic-list-container">
                            <div v-for="(passo, index) in form.passos" :key="passo.id || index"
                                class="dynamic-row passo-row">
                                <span class="step-badge-num">{{ index + 1 }}</span>
                                <textarea v-model="passo.metodo_preparo" class="textarea-input flex-1" rows="2"
                                    :class="{ 'error-input': erros.passos && !passo.metodo_preparo.trim() }"
                                    :placeholder="`Passo ${index + 1}...`" maxlength="250"></textarea>
                                <button type="button" class="remove-row-btn" @click="removerPasso(index)"
                                    aria-label="Remover">
                                    ✕
                                </button>
                            </div>
                        </div>

                        <button type="button" class="btn-dashed-add" @click="adicionarPasso">
                            + Adicionar passo
                        </button>

                        <div class="input-group" style="margin-top: 24px;">
                            <label class="input-label">Tags (opcional)</label>
                            <div class="tag-input-row">
                                <input type="text" v-model="novaTagInput" maxlength="30" class="text-input"
                                    placeholder="Ex: CoisasRapidas, Vegano..." @keyup.enter.prevent="adicionarTag()" />
                                <button type="button" class="btn-add-tag" @click="adicionarTag()">+</button>
                            </div>

                            <div class="suggested-tags-row" v-if="tagsSugeridasFiltradas.length > 0">
                                <button type="button" v-for="tagSug in tagsSugeridasFiltradas" :key="tagSug.id"
                                    class="suggested-tag-btn" @click="adicionarTag(tagSug.nome)">
                                    + #{{ tagSug.nome }}
                                </button>
                            </div>

                            <div class="chips-tags-list" v-if="form.tags.length > 0">
                                <span v-for="(tag, idx) in form.tags" :key="idx" class="tag-chip-item">
                                    #{{ tag }} <button type="button" @click="removerTag(idx)">×</button>
                                </span>
                            </div>
                        </div>

                        <div class="input-group">
                            <label class="input-label">Relacione a comunidade na qual participa</label>
                            <select v-model="form.comunidadeId" class="select-input">
                                <option :value="null">Não está relacionado a nenhuma comunidade</option>
                                <option v-for="com in comunidadesDisponiveis" :key="com.id" :value="com.id">
                                    {{ com.nome }}
                                </option>
                            </select>
                        </div>

                        <div class="navigation-buttons-row">
                            <button type="button" class="btn-secondary" :disabled="enviandoReceita"
                                @click="etapaAtual = 2">
                                ← Voltar
                            </button>
                            <button type="button" class="btn-danger-primary" :disabled="enviandoReceita"
                                @click="salvarReceita">
                                {{
                                    enviandoReceita
                                        ? (isModoEdicao ? 'Salvando...' : 'Publicando...')
                                        : (isModoEdicao ? 'Salvar alterações' : 'Publicar receita')
                                }}
                            </button>
                        </div>
                    </div>

                </div>

                <div v-else class="success-screen-container">
                    <div class="success-icon-wrapper">
                        <img src="/icon_ok.png" alt="Sucesso" class="success-ok-icon" />
                    </div>

                    <h2 class="success-title">
                        {{ isModoEdicao ? 'Receita atualizada!' : 'Receita publicada!' }}
                    </h2>
                    <p class="success-desc">
                        {{
                            isModoEdicao
                                ? 'As alterações da sua receita foram salvas com sucesso.'
                                : 'Sua receita foi compartilhada com a comunidade. Agora é esperar os elogios!'
                        }}
                    </p>

                    <div class="success-actions">
                        <button type="button" class="btn-primary-ingrediente" @click="verMinhaReceita">
                            Ver minha receita →
                        </button>
                        <button type="button" class="link-feed-btn" @click="irParaFeed">
                            Ir para o feed
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import BarraNavegacao from '@/components/BarraNavegacao.vue';
import { authService } from '@/services/authService';
import {
    postReceita,
    putReceita,
    getBuscarReceita
} from '@/services/receitas';
import {
    getListarCategorias,
    getListarTags
} from '@/services/catalogo';
import { getListarComunidades } from '@/services/comunidades';

const router = useRouter();
const route = useRoute();

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_PRESET;

const receitaIdEdicao = computed(() => {
    const idParam = route.params.id || route.query.id || route.query.editar;
    return idParam ? Number(idParam) : null;
});
const isModoEdicao = computed(() => Boolean(receitaIdEdicao.value));

const etapaAtual = ref(1);
const sucessoPublicacao = ref(false);
const carregandoInicial = ref(false);
const enviandoReceita = ref(false);
const enviandoFoto = ref(false);
const enviandoVideo = ref(false);
const erroApi = ref('');
const receitaSalvaId = ref(null);
const usuarioLogadoId = ref(null);

const fileFotoRef = ref(null);
const fileVideoRef = ref(null);
const previewFoto = ref(null);
const previewVideo = ref(null);

const DIFICULDADES_PADRAO = [
    { id: 1, nome: 'Fácil' },
    { id: 2, nome: 'Médio' },
    { id: 3, nome: 'Difícil' }
];

const CUSTOS_PADRAO = [
    { id: 1, nome: 'Econômico' },
    { id: 2, nome: 'Moderado' },
    { id: 3, nome: 'Alto' }
];

const PORCOES_PADRAO = Array.from({ length: 15 }, (_, idx) => {
    const qtd = idx + 1;
    return { id: qtd, nome: qtd === 1 ? '1 porção' : `${qtd} porções` };
});

const UNIDADES_PADRAO = [
    { id: 1, nome: 'g' },
    { id: 2, nome: 'kg' },
    { id: 3, nome: 'ml' },
    { id: 4, nome: 'L' },
    { id: 5, nome: 'un' }
];

const categoriasDisponiveis = ref([]);
const dificuldadesDisponiveis = ref([...DIFICULDADES_PADRAO]);
const custosDisponiveis = ref([...CUSTOS_PADRAO]);
const porcoesDisponiveis = ref([...PORCOES_PADRAO]);
const unidadesMedidaDisponiveis = ref([...UNIDADES_PADRAO]);
const tagsDisponiveis = ref([]);
const comunidadesDisponiveis = ref([]);

const form = reactive({
    titulo: '',
    descricao: '',
    categoriaId: null,
    id_dificuldade: 1,
    id_custo: 1,
    tempo: 30,
    id_porcao: 4,
    fotoUrl: '',
    videoUrl: '',
    ingredientes: [
        { id: null, nome: '', id_unidade_medida: '', quantidade: 1 },
        { id: null, nome: '', id_unidade_medida: '', quantidade: 1 }
    ],
    passos: [
        { id: null, metodo_preparo: '' },
        { id: null, metodo_preparo: '' }
    ],
    tags: [],
    comunidadeId: null
});

const erros = reactive({
    titulo: false,
    descricao: false,
    categoria: false,
    tempo: false,
    foto: false,
    ingredientes: false,
    passos: false
});

const novaTagInput = ref('');

const tagsSugeridasFiltradas = computed(() => {
    return tagsDisponiveis.value
        .filter(t => !form.tags.some(adicionada => adicionada.toLowerCase() === t.nome.toLowerCase()))
        .slice(0, 10);
});

const extrairLista = (res) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.response?.dados)) return res.response.dados;
    if (Array.isArray(res?.response?.categoria)) return res.response.categoria;
    if (Array.isArray(res?.response?.tag)) return res.response.tag;
    if (Array.isArray(res?.response?.comunidade)) return res.response.comunidade;
    if (Array.isArray(res?.response?.categoriaPrincipal)) return res.response.categoriaPrincipal;
    if (Array.isArray(res?.response)) return res.response;
    if (Array.isArray(res?.dados)) return res.dados;
    if (Array.isArray(res?.categoria)) return res.categoria;
    if (Array.isArray(res?.tag)) return res.tag;
    if (Array.isArray(res?.comunidade)) return res.comunidade;
    if (Array.isArray(res?.categorias)) return res.categorias;
    if (Array.isArray(res?.tags)) return res.tags;
    if (Array.isArray(res?.comunidades)) return res.comunidades;
    if (Array.isArray(res?.data)) return res.data;
    return [];
};

const formatarMinutosParaTempo = (totalMinutos) => {
    const mins = Math.max(1, Number(totalMinutos) || 0);
    const horas = Math.floor(mins / 60);
    const restoMinutos = mins % 60;
    const hh = String(horas).padStart(2, '0');
    const mm = String(restoMinutos).padStart(2, '0');
    return `${hh}:${mm}:00`;
};

const converterTempoParaMinutos = (tempoStr) => {
    if (!tempoStr) return 30;
    if (typeof tempoStr === 'number') return tempoStr;
    const partes = String(tempoStr).split(':').map(Number);
    if (partes.length >= 2 && !isNaN(partes[0]) && !isNaN(partes[1])) {
        return (partes[0] * 60) + partes[1];
    }
    return 30;
};

const obterIdUsuarioAtual = () => {
    const usuarioLocal = authService.getUser?.() || authService.getUsuario?.();
    const idDireto = usuarioLocal?.id ?? usuarioLocal?.id_usuario ?? usuarioLocal?.usuario?.id;
    if (idDireto) return Number(idDireto);

    try {
        for (const chave of ['usuario', 'user', 'userData']) {
            const salvo = localStorage.getItem(chave);
            if (salvo) {
                const parsed = JSON.parse(salvo);
                const idSalvo = parsed?.id ?? parsed?.id_usuario ?? parsed?.usuario?.id;
                if (idSalvo) return Number(idSalvo);
            }
        }
    } catch {
        // ignora erro de parse no localStorage
    }

    const token = authService.getToken?.();
    if (token) {
        try {
            const payloadBase64 = token.split('.')[1];
            if (payloadBase64) {
                const decoded = JSON.parse(atob(payloadBase64));
                const idToken = decoded?.id || decoded?.id_usuario || decoded?.sub;
                if (idToken && !isNaN(Number(idToken))) {
                    return Number(idToken);
                }
            }
        } catch {
            // ignora caso o token não seja decodificável diretamente
        }
    }

    return null;
};

const carregarOpcoesDaApi = async () => {
    usuarioLogadoId.value = obterIdUsuarioAtual();

    const [catRes, tagsRes, comRes] = await Promise.all([
        getListarCategorias().catch(() => null),
        getListarTags({ limite: 50 }).catch(() => null),
        getListarComunidades({ limite: 100 }).catch(() => null)
    ]);

    const listaCategorias = extrairLista(catRes);
    if (listaCategorias.length > 0) {
        categoriasDisponiveis.value = listaCategorias.map(c => ({
            id: Number(c.id),
            nome: c.categoria || c.nome
        }));
    }

    const listaTags = extrairLista(tagsRes);
    if (listaTags.length > 0) {
        tagsDisponiveis.value = listaTags
            .map(t => ({
                id: t.id,
                nome: String(t.nome_tag || t.nome || '').replace(/^#+/, '').trim()
            }))
            .filter(t => t.nome.length > 0);
    }

    const listaComunidades = extrairLista(comRes);
    if (listaComunidades.length > 0) {
        const possuiFlagParticipacao = listaComunidades.some(
            c => typeof c.participa === 'boolean' || typeof c.eh_membro === 'boolean'
        );
        const filtradas = possuiFlagParticipacao
            ? listaComunidades.filter(c => c.participa === true || c.eh_membro === true)
            : listaComunidades;

        comunidadesDisponiveis.value = filtradas.map(c => ({
            id: Number(c.id),
            nome: c.nome
        }));
    }
};

const preencherFormularioParaEdicao = async (id) => {
    try {
        if (!usuarioLogadoId.value) {
            router.replace('/login');
            return;
        }

        const res = await getBuscarReceita(id);
        const receita = Array.isArray(res?.response) ? res.response[0] : (res?.response?.dados || res?.response || res?.dados || res);

        if (!receita || !receita.titulo) {
            throw new Error('Não foi possível carregar os dados desta receita.');
        }

        const donoReceitaId = Number(receita.id_usuario || receita.usuario?.id);
        if (donoReceitaId && donoReceitaId !== Number(usuarioLogadoId.value)) {
            router.replace(`/receita/${id}`);
            return;
        }

        form.titulo = receita.titulo || '';
        form.descricao = receita.descricao || '';
        form.fotoUrl = receita.foto || '';
        previewFoto.value = receita.foto || null;
        form.videoUrl = receita.video || '';
        previewVideo.value = receita.video || null;
        form.tempo = converterTempoParaMinutos(receita.tempo);

        if (receita.id_dificuldade) form.id_dificuldade = Number(receita.id_dificuldade);
        if (receita.id_custo) form.id_custo = Number(receita.id_custo);
        if (receita.id_porcao) form.id_porcao = Number(receita.id_porcao);
        if (receita.id_usuario && !usuarioLogadoId.value) {
            usuarioLogadoId.value = Number(receita.id_usuario);
        }

        const catsReceita = receita.categorias || receita.categoria || [];
        if (Array.isArray(catsReceita) && catsReceita.length > 0) {
            const primeira = catsReceita[0];
            if (typeof primeira === 'object' && primeira !== null && primeira.id) {
                form.categoriaId = Number(primeira.id);
            } else if (typeof primeira === 'string') {
                const encontrada = categoriasDisponiveis.value.find(
                    c => c.nome.toLowerCase() === primeira.toLowerCase()
                );
                if (encontrada) form.categoriaId = encontrada.id;
            }
        } else if (receita.id_categoria) {
            form.categoriaId = Number(receita.id_categoria);
        }

        const comReceita = receita.comunidade || receita.comunidades;
        if (Array.isArray(comReceita) && comReceita.length > 0) {
            const primeiraCom = comReceita[0];
            form.comunidadeId = typeof primeiraCom === 'object' ? Number(primeiraCom.id) : Number(primeiraCom);
        } else if (comReceita && typeof comReceita === 'object' && comReceita.id) {
            form.comunidadeId = Number(comReceita.id);
        } else if (receita.id_comunidade) {
            form.comunidadeId = Number(receita.id_comunidade);
        } else {
            form.comunidadeId = null;
        }

        if (Array.isArray(receita.tags)) {
            form.tags = receita.tags
                .map(t => (typeof t === 'string' ? t : (t.nome_tag || t.nome || '')))
                .map(t => t.replace(/^#+/, '').trim())
                .filter(Boolean);
        }

        if (Array.isArray(receita.ingredientes) && receita.ingredientes.length > 0) {
            form.ingredientes = receita.ingredientes.map(ing => {
                let unidadeId = ing.id_unidade_medida ? Number(ing.id_unidade_medida) : '';
                if (!unidadeId && ing.unidade_medida) {
                    const uniEncontrada = unidadesMedidaDisponiveis.value.find(
                        u => u.nome.toLowerCase() === String(ing.unidade_medida).toLowerCase()
                    );
                    if (uniEncontrada) unidadeId = uniEncontrada.id;
                }
                return {
                    id: ing.id ? Number(ing.id) : null,
                    nome: ing.nome || '',
                    id_unidade_medida: unidadeId,
                    quantidade: ing.quantidade !== undefined ? Number(ing.quantidade) : 1
                };
            });
        }

        if (Array.isArray(receita.modo_preparo) && receita.modo_preparo.length > 0) {
            const passosOrdenados = [...receita.modo_preparo].sort(
                (a, b) => (Number(a.ordem_preparo) || 0) - (Number(b.ordem_preparo) || 0)
            );
            form.passos = passosOrdenados.map(passo => ({
                id: passo.id ? Number(passo.id) : null,
                metodo_preparo: passo.metodo_preparo || ''
            }));
        }
    } catch (erro) {
        console.error('Erro ao carregar receita para edição:', erro);
        erroApi.value = erro.message || 'Erro ao carregar os dados da receita para edição.';
    }
};

onMounted(async () => {
    carregandoInicial.value = true;
    erroApi.value = '';
    try {
        await carregarOpcoesDaApi();
        if (isModoEdicao.value) {
            await preencherFormularioParaEdicao(receitaIdEdicao.value);
        }
    } finally {
        carregandoInicial.value = false;
    }
});

const dispararInputFoto = () => { fileFotoRef.value.click(); };
const dispararInputVideo = () => { fileVideoRef.value.click(); };

const enviarParaCloudinary = async (arquivo, tipo) => {
    const formData = new FormData();
    formData.append('file', arquivo);
    formData.append('upload_preset', uploadPreset);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${tipo}/upload`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (data.secure_url) {
            return data.secure_url;
        }
        throw new Error('Falha no upload para o Cloudinary');
    } catch (error) {
        console.error('Erro no upload:', error);
        alert('Erro ao carregar o arquivo para a nuvem. Tente novamente.');
        return null;
    }
};

const tratarUploadFoto = async (event) => {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    previewFoto.value = URL.createObjectURL(arquivo);
    erros.foto = false;
    enviandoFoto.value = true;

    try {
        const urlServidor = await enviarParaCloudinary(arquivo, 'image');
        if (urlServidor) {
            form.fotoUrl = urlServidor;
        }
    } finally {
        enviandoFoto.value = false;
    }
};

const tratarUploadVideo = async (event) => {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    previewVideo.value = URL.createObjectURL(arquivo);
    enviandoVideo.value = true;

    try {
        const urlServidor = await enviarParaCloudinary(arquivo, 'video');
        if (urlServidor) {
            form.videoUrl = urlServidor;
        }
    } finally {
        enviandoVideo.value = false;
    }
};

const selecionarCategoria = (catId) => {
    form.categoriaId = catId;
    erros.categoria = false;
};

const avancarParaEtapa2 = () => {
    if (enviandoFoto.value || enviandoVideo.value) return;

    erros.titulo = !form.titulo.trim();
    erros.descricao = !form.descricao.trim();
    erros.categoria = !form.categoriaId;
    erros.tempo = !form.tempo || form.tempo <= 0;
    erros.foto = !form.fotoUrl;

    if (erros.titulo || erros.descricao || erros.categoria || erros.tempo || erros.foto) {
        return;
    }
    erroApi.value = '';
    etapaAtual.value = 2;
};

const avancarParaEtapa3 = () => {
    const temIngredientesInvalidos = form.ingredientes.some(
        i => !i.nome.trim() || !i.id_unidade_medida || i.quantidade === '' || i.quantidade <= 0 || i.quantidade > 1000
    );
    erros.ingredientes = temIngredientesInvalidos || form.ingredientes.length === 0;

    if (erros.ingredientes) {
        return;
    }
    erroApi.value = '';
    etapaAtual.value = 3;
};

const adicionarIngrediente = () => {
    form.ingredientes.push({ id: null, nome: '', id_unidade_medida: '', quantidade: 1 });
};

const removerIngrediente = (index) => {
    if (form.ingredientes.length > 1) {
        form.ingredientes.splice(index, 1);
    }
};

const adicionarPasso = () => {
    form.passos.push({ id: null, metodo_preparo: '' });
};

const removerPasso = (index) => {
    if (form.passos.length > 1) {
        form.passos.splice(index, 1);
    }
};

const adicionarTag = (tagSugerida = null) => {
    let t = (tagSugerida !== null ? tagSugerida : novaTagInput.value).trim();
    if (!t) return;

    t = t.replace(/^#+/, '').replace(/\s+/g, '');

    if (t.length > 0 && !form.tags.some(existente => existente.toLowerCase() === t.toLowerCase())) {
        form.tags.push(t);
    }
    if (tagSugerida === null) {
        novaTagInput.value = '';
    }
};

const removerTag = (index) => {
    form.tags.splice(index, 1);
};

const montarPayloadReceita = () => {
    const ingredientesFormatados = form.ingredientes.map(ing => {
        const item = {
            nome: ing.nome.trim(),
            quantidade: String(ing.quantidade),
            id_unidade_medida: Number(ing.id_unidade_medida)
        };
        if (isModoEdicao.value && ing.id) {
            item.id = Number(ing.id);
        }
        return item;
    });

    const modoPreparoFormatado = form.passos.map((passo, idx) => {
        const item = {
            metodo_preparo: passo.metodo_preparo.trim(),
            ordem_preparo: idx + 1
        };
        if (isModoEdicao.value && passo.id) {
            item.id = Number(passo.id);
        }
        return item;
    });

    return {
        titulo: form.titulo.trim(),
        descricao: form.descricao.trim(),
        tempo: formatarMinutosParaTempo(form.tempo),
        foto: form.fotoUrl,
        video: form.videoUrl || '',
        id_custo: Number(form.id_custo),
        id_dificuldade: Number(form.id_dificuldade),
        id_porcao: Number(form.id_porcao),
        id_usuario: Number(usuarioLogadoId.value),
        ingredientes: ingredientesFormatados,
        modo_preparo: modoPreparoFormatado,
        categoria: form.categoriaId ? [{ id: Number(form.categoriaId) }] : [],
        comunidade: form.comunidadeId ? [{ id: Number(form.comunidadeId) }] : [],
        tags: form.tags.map(tag => ({ nome_tag: tag }))
    };
};

const salvarReceita = async () => {
    const temPassosInvalidos = form.passos.some(p => !p.metodo_preparo.trim());
    erros.passos = temPassosInvalidos || form.passos.length === 0;

    if (erros.passos || enviandoReceita.value) {
        return;
    }

    erroApi.value = '';

    if (!usuarioLogadoId.value) {
        usuarioLogadoId.value = obterIdUsuarioAtual();
    }

    if (!usuarioLogadoId.value) {
        erroApi.value = 'Não foi possível identificar o usuário autenticado. Faça login novamente.';
        return;
    }

    enviandoReceita.value = true;

    try {
        const payload = montarPayloadReceita();
        let res;

        if (isModoEdicao.value) {
            res = await putReceita(receitaIdEdicao.value, payload);
            receitaSalvaId.value = receitaIdEdicao.value;
        } else {
            res = await postReceita(payload);
            receitaSalvaId.value =
                res?.response?.id ||
                res?.response?.dados?.id ||
                res?.id ||
                null;

            if (!receitaSalvaId.value) {
                throw new Error('A API não retornou o ID da receita criada. Verifique a resposta do servidor antes de considerar a publicação concluída.');
            }
        }

        sucessoPublicacao.value = true;
    } catch (erro) {
        console.error('Erro ao salvar receita:', erro);
        erroApi.value = erro.message || (isModoEdicao.value
            ? 'Erro ao atualizar a receita. Verifique os dados e tente novamente.'
            : 'Erro ao publicar a receita. Verifique os dados e tente novamente.');
    } finally {
        enviandoReceita.value = false;
    }
};

const verMinhaReceita = () => {
    if (receitaSalvaId.value) {
        router.push(`/receita/${receitaSalvaId.value}`);
    } else {
        router.push('/home');
    }
};

const irParaFeed = () => {
    router.push('/home');
};

const voltarEtapa = () => {
    if (etapaAtual.value > 1) {
        etapaAtual.value--;
    } else {
        router.back();
    }
};
</script>

<style scoped>
.corpo {
    display: flex;
    width: 100%;
    min-height: 100vh;
    background-color: var(--cinza-claro);
    font-family: "Inter", sans-serif;
}

.error-upload-box {
    border-color: var(--vermelho) !important;
    background-color: #FFFDFD;
}

.loading-box {
    align-items: center;
    justify-content: center;
    min-height: 240px;
}

.loading-text {
    font-size: 14px;
    color: var(--cinza);
    font-weight: 500;
}

.api-error-banner {
    background-color: #FDECEA;
    border: 1px solid #F5C2C7;
    color: #842029;
    padding: 12px 16px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 500;
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
}

.header-left {
    display: flex;
    align-items: center;
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
    font-family: "Inter", sans-serif;
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
    padding: 30px 16px 60px 16px;
    box-sizing: border-box;
}

.form-container {
    width: 100%;
    max-width: 820px;
    background-color: #FFFFFF;
    border: 1px solid #EFEAE1;
    border-radius: 20px;
    padding: 32px;
    box-sizing: border-box;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.progress-bar-container {
    display: flex;
    gap: 12px;
    width: 100%;
    margin-bottom: 10px;
}

.progress-segment {
    flex: 1;
    height: 6px;
    background-color: #EFEAE1;
    border-radius: 4px;
    transition: background-color 0.3s ease;
}

.progress-segment.active {
    background-color: var(--verde);
}

.etapa-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.section-title {
    font-family: "Playfair Display", serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--marrom);
    margin: 0;
}

.upload-box {
    width: 100%;
    height: 140px;
    border: 2px dashed #EFEAE1;
    border-radius: 16px;
    background-color: #FAF8F5;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s;
}

.upload-box:hover {
    border-color: var(--verde);
}

.upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 6px;
    padding: 12px;
}

.upload-icon-img {
    border-radius: 10px;
    width: 40px;
    height: 40px;
    object-fit: contain;
}

.upload-title-text {
    font-size: 13px;
    font-weight: 600;
    color: var(--marrom);
}

.upload-sub-text {
    font-size: 11px;
    color: var(--cinza);
}

.preview-container {
    width: 100%;
    height: 100%;
    position: relative;
}

.preview-media {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.change-overlay {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background-color: rgba(0, 0, 0, 0.6);
    color: #FFFFFF;
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 11px;
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.input-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--marrom);
}

.required {
    color: var(--vermelho);
}

.text-input,
.textarea-input,
.select-input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #EFEAE1;
    border-radius: 12px;
    background-color: #FFFFFF;
    font-size: 12px;
    color: var(--marrom);
    outline: none;
    box-sizing: border-box;
    font-family: "Inter", sans-serif;
}

.select-input {
    appearance: none;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238C827A' stroke-width='2.5'><polyline points='6 9 12 15 18 9'/></svg>");
    background-repeat: no-repeat;
    background-position: right 18px center;
}

.text-input:focus,
.textarea-input:focus,
.select-input:focus {
    border-color: var(--verde);
}

.error-input,
.error-border {
    border-color: var(--vermelho) !important;
    background-color: #FFFDFD;
}

.row-dupla {
    display: flex;
    gap: 16px;
}

.flex-1 {
    flex: 1;
}

.flex-2 {
    flex: 2;
}

.flex-3 {
    flex: 3;
}

.categories-chips-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.cat-chip {
    background-color: #FAF8F5;
    border: 1px solid #EFEAE1;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    color: var(--cinza);
    cursor: pointer;
    transition: all 0.2s;
}

.cat-chip.active {
    background-color: var(--amarelo);
    color: var(--marrom);
    border-color: var(--amarelo);
}

.dynamic-list-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.dynamic-row {
    display: flex;
    gap: 10px;
    align-items: center;
}

.passo-row {
    padding: 8px;
    border-radius: 12px;
}

.step-badge-num {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background-color: var(--bege);
    color: var(--marrom);
    font-weight: 700;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.remove-row-btn {
    background: none;
    border: none;
    color: var(--vermelho);
    font-size: 16px;
    cursor: pointer;
    padding: 6px;
}

.btn-dashed-add {
    width: 100%;
    padding: 12px;
    border: 1px dashed var(--verde);
    border-radius: 12px;
    background-color: #E3F4ED;
    color: var(--verde-escuro);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    text-align: center;
    margin-top: 4px;
}

.tag-input-row {
    display: flex;
    gap: 8px;
}

.btn-add-tag {
    background-color: var(--marrom);
    color: #FFFFFF;
    border: none;
    border-radius: 12px;
    width: 46px;
    font-size: 18px;
    cursor: pointer;
}

.suggested-tags-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 6px;
}

.suggested-tag-btn {
    background-color: #F4F1EB;
    border: 1px dashed #D8CFC2;
    border-radius: 12px;
    padding: 4px 10px;
    font-size: 11px;
    color: var(--marrom);
    cursor: pointer;
    transition: background-color 0.2s;
}

.suggested-tag-btn:hover {
    background-color: #EAE3D5;
}

.chips-tags-list {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 8px;
}

.tag-chip-item {
    background-color: #FAF8F5;
    border: 1px solid #EFEAE1;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    color: var(--cinza);
    display: flex;
    align-items: center;
    gap: 6px;
}

.tag-chip-item button {
    background: none;
    border: none;
    color: var(--vermelho);
    cursor: pointer;
    font-weight: bold;
}

.navigation-buttons-row {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    margin-top: 16px;
}

.btn-primary {
    background-color: var(--verde);
    color: #FFFFFF;
    border: none;
    border-radius: 14px;
    padding: 14px 24px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    width: 50%;
    text-align: center;
}

.btn-primary-ingrediente {
    background-color: var(--verde);
    color: #FFFFFF;
    border: none;
    border-radius: 14px;
    padding: 14px 24px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
    text-align: center;
}

.btn-secondary {
    background-color: #FFFFFF;
    border: 1px solid #EFEAE1;
    color: var(--marrom);
    border-radius: 14px;
    padding: 14px 24px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    width: 50%;
}

.btn-danger-primary {
    background-color: #bc0b27;
    color: #FFFFFF;
    border: none;
    border-radius: 14px;
    padding: 14px 24px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    width: 50%;
}

.btn-primary:disabled,
.btn-primary-ingrediente:disabled,
.btn-secondary:disabled,
.btn-danger-primary:disabled {
    opacity: 0.65;
    cursor: not-allowed;
}

.success-screen-container {
    align-self: center;
    width: 100%;
    max-width: 600px;
    margin: 40px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 16px;
    border-radius: 20px;
    padding: 40px;
    box-sizing: border-box;
}

.success-icon-wrapper {
    width: 70px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.success-ok-icon {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.success-title {
    font-family: "Playfair Display", serif;
    font-size: 24px;
    font-weight: 700;
    color: var(--marrom);
    margin: 0;
}

.success-desc {
    font-size: 13px;
    color: var(--cinza);
    max-width: 380px;
    margin: 0;
    line-height: 1.5;
}

.success-actions {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 12px;
    margin-top: 10px;
}

.link-feed-btn {
    background: none;
    border: none;
    color: var(--cinza);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
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
        padding: 0 16px;
    }

    .conteudo {
        padding: 20px 12px 40px 12px;
    }

    .form-container {
        padding: 20px;
        height: fit-content;
    }

    .row-dupla {
        gap: 12px;
    }

    .row-dupla > .input-group {
        min-width: 0;
    }

    .dynamic-row {
        gap: 8px;
    }

    .dynamic-row input,
    .dynamic-row select,
    .dynamic-row textarea {
        min-width: 0;
    }

    .upload-box {
        height: 120px;
    }

    .section-title {
        font-size: 18px;
    }

    .navigation-buttons-row {
        flex-wrap: wrap;
    }

    .btn-primary,
    .btn-secondary {
        flex: 1;
        padding: 12px 16px;
        text-align: center;
    }

    .success-screen-container {
        padding: 24px;
    }

    .success-title {
        font-size: 20px;
    }
}

@media (max-width: 480px) {
    .header-topo.none {
        display: flex !important;
        background-color: #ffffff;
        border-bottom: 1px solid #efeae1;
        height: auto;
        padding: 14px 16px;
    }

    .header-titles h2 {
        font-size: 18px;
    }

    .header-titles p {
        font-size: 11px;
    }

    .conteudo {
        padding: 12px 16px 80px 16px;
        background-color: #fcfaf6;
    }

    .form-container {
        padding: 0;
        background-color: transparent;
        border: none;
        box-shadow: none;
        gap: 20px;
    }

    .progress-bar-container {
        gap: 8px;
        margin-bottom: 4px;
    }

    .progress-segment {
        height: 6px;
        background-color: #fce8c7;
        border-radius: 4px;
    }

    .progress-segment.active {
        background-color: #72bca5;
    }

    .section-title {
        font-family: "Playfair Display", serif;
        font-size: 20px;
        font-weight: 700;
        color: #4a2512;
    }

    .etapa-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px 12px;
    }

    .section-title,
    .input-group,
    .row-dupla,
    .dynamic-list-container,
    .btn-dashed-add,
    .navigation-buttons-row,
    .btn-primary-ingrediente {
        grid-column: 1 / -1;
    }

    .upload-box {
        height: 110px;
        border-radius: 16px;
        border: 1.5px dashed #dcd4c8;
        background-color: #ffffff;
        padding: 8px;
    }

    .upload-placeholder {
        gap: 6px;
        padding: 4px;
    }

    .upload-icon-img {
        width: 34px;
        height: 28px;
        filter: brightness(0) saturate(100%) invert(58%) sepia(11%) saturate(768%) hue-rotate(345deg) brightness(92%) contrast(85%);
    }

    .upload-title-text {
        font-size: 11px;
        color: #4a2512;
        font-weight: 600;
    }

    .upload-sub-text {
        display: none;
    }

    .text-input,
    .textarea-input,
    .select-input {
        background-color: #ffffff;
        border-radius: 12px;
        border: 1px solid #efeae1;
        font-size: 13px;
        color: #4a2512;
    }

    .cat-chip {
        padding: 6px 14px;
        font-size: 12px;
    }

    .cat-chip.active {
        background-color: #f5b041;
        color: #ffffff;
        border-color: #f5b041;
    }

    .row-dupla {
        display: flex;
        gap: 10px;
    }

    .dynamic-row {
        gap: 6px;
    }

    .dynamic-row .text-input,
    .dynamic-row .select-input {
        padding: 10px 12px;
        font-size: 12px;
    }

    .step-badge-num {
        width: 24px;
        height: 24px;
        background-color: #72bca5;
        color: #ffffff;
        font-size: 12px;
    }

    .btn-dashed-add {
        border: 1.5px dashed #a3dac9;
        background-color: #f0f9f6;
        color: #52ab8b;
        border-radius: 14px;
        padding: 12px;
        margin-top: 0;
    }

    .tag-input-row .btn-add-tag {
        background-color: #4a2512;
        border-radius: 12px;
    }

    .navigation-buttons-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-top: 8px;
    }

    .btn-secondary {
        width: 100%;
        border-radius: 14px;
        padding: 12px;
        text-align: center;
        border: 1px solid #8C7B73;
        background-color: #ffffff;
        color: #4a2512;
    }

    .btn-primary {
        width: 100%;
        border-radius: 14px;
        padding: 12px;
        text-align: center;
        background-color: #72bca5;
        color: #ffffff;
    }

    .btn-danger-primary {
        width: 100%;
        border-radius: 14px;
        padding: 12px;
        text-align: center;
        background-color: #bc0b27;
        color: #ffffff;
    }

    .btn-primary-ingrediente {
        width: 100%;
        border-radius: 14px;
        padding: 14px;
        background-color: #72bca5;
        color: #ffffff;
    }

    .success-screen-container {
        padding: 40px 16px;
        margin: 0 auto;
    }

    .success-title {
        font-family: "Playfair Display", serif;
        font-size: 24px;
        color: #4a2512;
    }

    .link-feed-btn {
        color: #8c827a;
        text-decoration: underline;
    }

    .etapa-content {
        margin-bottom: 20px;
    }
}
</style>