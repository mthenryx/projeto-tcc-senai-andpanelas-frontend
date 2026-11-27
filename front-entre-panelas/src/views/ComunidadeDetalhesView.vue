<template>
    <div class="corpo">
        <BarraNavegacao />

        <div class="coluna">
            <div v-if="carregando" class="sem-resultados" style="padding: 60px 20px;">
                <p>Carregando comunidade...</p>
            </div>

            <div v-else-if="erroApi" class="sem-resultados" style="padding: 60px 20px;">
                <p>{{ erroApi }}</p>
            </div>

            <template v-else>
                <header class="banner-capa-header" :style="{ backgroundImage: `url(${comunidade.banner_url})` }">
                    <div class="banner-overlay">
                        <button class="back-btn-circle" @click="voltar" aria-label="Voltar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                <polyline points="12 19 5 12 12 5"></polyline>
                            </svg>
                        </button>

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

                <main class="conteudo-principal">
                    <p class="comunidade-descricao">{{ comunidade.descricao }}</p>

                    <div class="membros-avatares-row" v-if="comunidade.participantes.length > 0">
                        <div class="avatares-stack">
                            <div v-for="(membro, idx) in primeirosMembros" :key="membro.id" class="avatar-circle-wrapper" @click="abrirPerfilMembro(membro.id)">
                                <img v-if="membro.foto_url && membro.foto_url.trim() !== ''" :src="membro.foto_url"
                                    :alt="membro.nome" class="avatar-img-stack" />
                                <div v-else class="avatar-circle" :style="{ backgroundColor: obterCorAvatar(idx) }">
                                    {{ obterIniciais(membro.nome) }}
                                </div>
                            </div>
                        </div>
                        <span class="membros-restantes-text" v-if="membrosRestantesCount > 0">
                            +{{ membrosRestantesCount }} outros membros
                        </span>
                    </div>

                    <div class="denunciar-row" v-if="!ehCriador">
                        <button class="btn-denunciar" @click="abrirModalDenuncia">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                                <line x1="4" y1="22" x2="4" y2="15"></line>
                            </svg>
                            Denunciar
                        </button>
                    </div>

                    <div class="acoes-comunidade-row">
                        <template v-if="!ehCriador">
                            <button
                                type="button"
                                class="btn-acao-participacao"
                                :class="{ 'participando': ehParticipante }"
                                :disabled="processandoParticipacao"
                                @click="alternarParticipacao"
                            >
                                {{
                                    processandoParticipacao
                                        ? 'Atualizando...'
                                        : (ehParticipante ? 'Sair da comunidade' : 'Participar da comunidade')
                                }}
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

                    <div v-if="ehCriador" class="btn-editar-wrapper">
                        <button class="btn-editar-comunidade" @click="irParaEdicao">
                            ✏️ㅤEditar comunidade
                        </button>
                        <button
                            class="btn-excluir-comunidade"
                            :disabled="excluindoComunidade"
                            @click="confirmarExclusaoComunidade"
                        >
                            {{ excluindoComunidade ? 'Excluindo...' : '🗑️ㅤExcluir comunidade' }}
                        </button>
                    </div>

                    <div v-if="abaAtiva === 'receitas'" class="lista-receitas-grid">
                        <div v-if="carregandoReceitas" class="sem-resultados">
                            <p>Carregando receitas da comunidade...</p>
                        </div>
                        <div v-else-if="erroReceitas" class="sem-resultados">
                            <p>{{ erroReceitas }}</p>
                        </div>
                        <template v-else>
                            <RecipeCard v-for="rec in receitasVisiveis" :key="rec.id" :id="rec.id" :imagemUrl="rec.imagem_url"
                                :titulo="rec.titulo" :tempo="rec.tempo" :porcoes="rec.porcoes" :custo="rec.custo"
                                :curtidas="rec.curtidas" :comentarios="rec.comentarios" :autorNome="rec.autor_nome"
                                :authorIniciais="obterIniciais(rec.autor_nome)" :dificuldade="rec.dificuldade"
                                v-model:salvo="rec.salvo" />
                            <div v-if="receitasComunidade.length === 0" class="sem-resultados">
                                <p>Nenhuma receita cadastrada nesta comunidade ainda.</p>
                            </div>
                            <button
                                v-if="receitasVisiveis.length < receitasComunidade.length"
                                type="button"
                                class="btn-carregar-mais-receitas"
                                @click="carregarMaisReceitas"
                            >
                                Carregar mais receitas
                            </button>
                        </template>
                    </div>

                    <div v-else-if="abaAtiva === 'membros'" class="lista-membros-vertical">
                        <div v-if="carregandoMembros" class="sem-resultados">
                            <p>Carregando membros da comunidade...</p>
                        </div>
                        <template v-else>
                        <div v-for="membro in comunidade.participantes" :key="membro.id" class="membro-card-item" @click="abrirPerfilMembro(membro.id)">
                            <div class="membro-left">
                                <img v-if="membro.foto_url && membro.foto_url.trim() !== ''" :src="membro.foto_url"
                                    :alt="membro.nome" class="membro-foto" />
                                <div v-else class="membro-avatar-fallback"
                                    :style="{ backgroundColor: obterCorAvatar(membro.id) }">
                                    {{ obterIniciais(membro.nome) }}
                                </div>

                                <div class="membro-info">
                                    <h4 class="membro-nome">{{ membro.nome }}</h4>
                                    <p class="membro-sub">
                                        {{ Number(membro.id) === Number(comunidade.criador_id) ? 'Moderador(a)' : 'Membro' }} • {{
                                            membro.quantidade_receitas }} receitas
                                    </p>
                                </div>
                            </div>

                            <div v-if="Number(membro.id) === Number(comunidade.criador_id)" class="badge-mod">
                                MOD
                            </div>
                        </div>

                        <div v-if="comunidade.participantes.length === 0" class="sem-resultados">
                            <p>Nenhum membro listado nesta comunidade ainda.</p>
                        </div>
                        </template>
                    </div>
                </main>
            </template>
        </div>

        <ReportModal :isOpen="modalDenunciaAberto" tipo="comunidade" :targetId="comunidade.id"
            @close="modalDenunciaAberto = false" @send="tratarEnvioDenuncia" />
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import BarraNavegacao from '@/components/BarraNavegacao.vue';
import ReportModal from '@/components/ReportModal.vue';
import RecipeCard from '@/components/RecipeCard.vue';
import {
    getBuscarComunidade,
    getReceitasDaComunidade,
    getMembrosComunidade,
    postEntrarComunidade,
    deleteSairComunidade,
    deleteComunidade,
    obterIdUsuarioLogado
} from '@/services/comunidades';

const router = useRouter();
const route = useRoute();

const abaAtiva = ref('receitas');
const modalDenunciaAberto = ref(false);
const carregando = ref(false);
const carregandoReceitas = ref(false);
const carregandoMembros = ref(false);
const erroApi = ref('');
const erroReceitas = ref('');
const processandoParticipacao = ref(false);
const excluindoComunidade = ref(false);

const usuarioAtualId = ref(null);
const ehParticipante = ref(false);

const BANNER_FALLBACK = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200';

const comunidade = ref({
    id: Number(route.params.id) || 0,
    nome: '',
    descricao: '',
    banner_url: BANNER_FALLBACK,
    foto_url: '',
    quantidade_pessoas: 0,
    quantidade_receitas: 0,
    criador_id: null,
    sou_criador: false,
    participantes: []
});

const receitasComunidade = ref([]);
const limiteReceitasVisiveis = ref(12);

const receitasVisiveis = computed(() => receitasComunidade.value.slice(0, limiteReceitasVisiveis.value));

const carregarMaisReceitas = () => {
    limiteReceitasVisiveis.value += 12;
};

const ehCriador = computed(() => {
    return Boolean(comunidade.value.sou_criador) ||
        (Boolean(usuarioAtualId.value) &&
            Boolean(comunidade.value.criador_id) &&
            Number(usuarioAtualId.value) === Number(comunidade.value.criador_id));
});

const primeirosMembros = computed(() => {
    return comunidade.value.participantes.slice(0, 5);
});

const membrosRestantesCount = computed(() => {
    const total = comunidade.value.participantes.length;
    return total > 5 ? total - 5 : 0;
});

const extrairLista = (res) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;

    const candidatos = [
        res?.response?.receitas,
        res?.response?.dados?.receitas,
        res?.response?.dados,
        res?.response?.items,
        res?.response?.resultados,
        res?.receitas,
        res?.dados?.receitas,
        res?.dados,
        res?.data?.receitas,
        res?.data?.response?.receitas,
        res?.data
    ];
    const lista = candidatos.find(Array.isArray);
    if (lista) return lista;
    if (res?.response && typeof res.response === 'object') return extrairLista(res.response);
    if (res?.data && typeof res.data === 'object') return extrairLista(res.data);
    return [];
};

const formatarTempoReceita = (tempo) => {
    if (!tempo) return '30min';
    if (typeof tempo === 'number') return `${tempo}min`;
    const str = String(tempo);
    if (str.includes('min') || str.includes('h')) return str;
    const partes = str.split(':').map(Number);
    if (partes.length >= 2 && !isNaN(partes[0]) && !isNaN(partes[1])) {
        const totalMin = (partes[0] * 60) + partes[1];
        return `${totalMin}min`;
    }
    return str;
};

const normalizarReceita = (rec) => ({
    id: Number(rec.id),
    titulo: rec.titulo || 'Receita',
    dificuldade: rec.dificuldade || rec.nivel_dificuldade || 'Fácil',
    autor_nome: (() => {
        const usuario = Array.isArray(rec.usuario) ? rec.usuario[0] : rec.usuario;
        const autor = typeof rec.autor === 'string' ? rec.autor : rec.autor?.nome;
        return rec.autor_nome || rec.nome_usuario || usuario?.nome || autor || 'Chef';
    })(),
    tempo: formatarTempoReceita(rec.tempo),
    porcoes: rec.porcao ?? rec.porcoes ?? rec.quantidade_porcoes ?? rec.id_porcao ?? 1,
    custo: rec.custo || 'Econômico',
    curtidas: Number(rec.qtd_curtidas ?? rec.curtidas ?? rec.total_curtidas ?? 0),
    comentarios: Array.isArray(rec.comentarios) ? rec.comentarios.length : Number(rec.qtd_comentarios ?? rec.total_comentarios ?? 0),
    salvo: Boolean(rec.salvo_pelo_usuario ?? rec.salvo),
    imagem_url: rec.imagem_url || rec.foto || ''
});

let sequenciaCarregamento = 0;

const carregarReceitasComunidade = async (id, sequencia) => {
    carregandoReceitas.value = true;
    erroReceitas.value = '';

    try {
        const resposta = await getReceitasDaComunidade(id);
        if (sequencia !== sequenciaCarregamento) return;
        receitasComunidade.value = extrairLista(resposta).map(normalizarReceita);
    } catch (erro) {
        if (sequencia !== sequenciaCarregamento) return;
        receitasComunidade.value = [];
        if (erro?.status !== 404) {
            erroReceitas.value = erro.message || 'Não foi possível carregar as receitas desta comunidade.';
        }
    } finally {
        if (sequencia === sequenciaCarregamento) {
            carregandoReceitas.value = false;
        }
    }
};

const carregarMembrosComunidade = async (id, sequencia) => {
    carregandoMembros.value = true;

    try {
        const resposta = await getMembrosComunidade(id);
        if (sequencia !== sequenciaCarregamento) return;

        const lista = Array.isArray(resposta?.response) ? resposta.response : extrairLista(resposta);
        const participantes = lista.map(m => ({
            id: Number(m.id || m.id_usuario),
            nome: m.nome || 'Membro',
            foto_url: m.foto_perfil || m.foto_url || m.foto || '',
            quantidade_receitas: Number(m.quantidade_receitas ?? m.total_receitas ?? 0)
        }));

        comunidade.value.participantes = participantes;

        const estaNaLista = usuarioAtualId.value
            ? participantes.some(p => Number(p.id) === Number(usuarioAtualId.value))
            : false;
        ehParticipante.value = ehParticipante.value || estaNaLista;
    } catch {
        if (sequencia === sequenciaCarregamento) {
            comunidade.value.participantes = [];
        }
    } finally {
        if (sequencia === sequenciaCarregamento) {
            carregandoMembros.value = false;
        }
    }
};

const carregarDetalhesComunidade = async (idParam) => {
    const id = Number(idParam);
    if (!id) return;

    const sequencia = ++sequenciaCarregamento;
    carregando.value = true;
    carregandoReceitas.value = false;
    carregandoMembros.value = false;
    erroApi.value = '';
    erroReceitas.value = '';
    receitasComunidade.value = [];
    limiteReceitasVisiveis.value = 12;
    comunidade.value = {
        id,
        nome: '',
        descricao: '',
        banner_url: BANNER_FALLBACK,
        foto_url: '',
        quantidade_pessoas: 0,
        quantidade_receitas: 0,
        criador_id: null,
        sou_criador: false,
        participantes: []
    };

    try {
        const respostaComunidade = await getBuscarComunidade(id);

        if (sequencia !== sequenciaCarregamento) return;

        const dados = respostaComunidade?.response?.comunidade?.[0]
            || respostaComunidade?.response?.dados
            || respostaComunidade?.response
            || respostaComunidade?.dados
            || respostaComunidade;

        if (!dados || !dados.nome) {
            throw new Error('Comunidade não encontrada.');
        }

        const criadorId = Number(
            dados.criador_id ||
            dados.id_usuario ||
            dados.id_criador ||
            dados.criador?.id ||
            0
        );

        comunidade.value = {
            id: Number(dados.id || id),
            nome: dados.nome,
            descricao: dados.descricao || '',
            banner_url: dados.banner_url || dados.banner || dados.foto_capa || dados.foto_url || BANNER_FALLBACK,
            foto_url: dados.foto_url || dados.foto || dados.icone || '',
            quantidade_pessoas: Number(dados.qtd_membros ?? dados.quantidade_pessoas ?? dados.total_membros ?? 0),
            quantidade_receitas: Number(dados.qtd_receitas ?? dados.quantidade_receitas ?? dados.total_receitas ?? 0),
            criador_id: criadorId,
            sou_criador: Boolean(dados.sou_criador),
            participantes: []
        };

        ehParticipante.value = Boolean(
            dados.participa || dados.eh_membro || dados.participando
        );

        carregando.value = false;
        void obterIdUsuarioLogado().then((idUsuario) => {
            if (sequencia === sequenciaCarregamento && idUsuario) {
                usuarioAtualId.value = idUsuario;
            }
        }).catch(() => {});
        void carregarReceitasComunidade(id, sequencia);
        void carregarMembrosComunidade(id, sequencia);
    } catch (erro) {
        if (sequencia === sequenciaCarregamento) {
            console.error('Erro ao carregar detalhes da comunidade:', erro);
            erroApi.value = erro.message || 'Erro ao carregar os detalhes da comunidade.';
        }
    } finally {
        if (sequencia === sequenciaCarregamento) {
            carregando.value = false;
        }
    }
};

watch(
    () => route.params.id,
    (novoId) => {
        if (novoId) carregarDetalhesComunidade(novoId);
    },
    { immediate: true }
);

const abrirPerfilMembro = (membroId) => {
    router.push({ path: '/others-perfil', query: { id: membroId } });
};

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
    return coresAvatar[Number(index) % coresAvatar.length];
};

const alternarParticipacao = async () => {
    if (ehCriador.value || processandoParticipacao.value) return;

    if (!usuarioAtualId.value) {
        router.push('/login');
        return;
    }

    processandoParticipacao.value = true;

    try {
        if (ehParticipante.value) {
            await deleteSairComunidade(comunidade.value.id);
            ehParticipante.value = false;
            comunidade.value.participantes = comunidade.value.participantes.filter(
                p => Number(p.id) !== Number(usuarioAtualId.value)
            );
            if (typeof comunidade.value.quantidade_pessoas === 'number') {
                comunidade.value.quantidade_pessoas = Math.max(0, comunidade.value.quantidade_pessoas - 1);
            }
        } else {
            await postEntrarComunidade(comunidade.value.id);
            ehParticipante.value = true;
            if (typeof comunidade.value.quantidade_pessoas === 'number') {
                comunidade.value.quantidade_pessoas += 1;
            }
            // Recarrega para trazer os dados atualizados do usuário na lista de membros
            await carregarDetalhesComunidade(comunidade.value.id);
        }
    } catch (erro) {
        console.error('Erro ao alterar participação na comunidade:', erro);
        alert(erro.message || 'Não foi possível atualizar sua participação.');
    } finally {
        processandoParticipacao.value = false;
    }
};

const irParaEdicao = () => {
    router.push({
        path: '/criar-comunidade',
        query: { id: comunidade.value.id }
    });
};

const confirmarExclusaoComunidade = async () => {
    if (!ehCriador.value || excluindoComunidade.value) return;

    const confirmou = window.confirm(
        `Tem certeza que deseja excluir a comunidade "${comunidade.value.nome}"? Essa ação não pode ser desfeita.`
    );
    if (!confirmou) return;

    excluindoComunidade.value = true;
    try {
        await deleteComunidade(comunidade.value.id);
        router.push('/comunidade');
    } catch (erro) {
        console.error('Erro ao excluir comunidade:', erro);
        alert(erro.message || 'Não foi possível excluir a comunidade.');
    } finally {
        excluindoComunidade.value = false;
    }
};

const abrirModalDenuncia = () => {
    modalDenunciaAberto.value = true;
};

const tratarEnvioDenuncia = () => {
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

.icone-estendido-marrom {
    width: 14px;
    height: 14px;
    object-fit: contain;
    filter: brightness(0) saturate(100%) invert(44%) sepia(13%) saturate(1062%) hue-rotate(345deg) brightness(93%) contrast(87%);
}

.conteudo-principal {
    align-self: center;
    padding: 24px 32px 60px 32px;
    max-width: 1200px;
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

.avatar-circle-wrapper {
    margin-left: -8px;
    cursor: pointer;
}

.avatar-circle-wrapper:first-child {
    margin-left: 0;
}

.avatar-img-stack {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid #FFFFFF;
    object-fit: cover;
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

.btn-acao-participacao:disabled {
    opacity: 0.65;
    cursor: not-allowed;
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
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
}

.icone-aba {
    width: 16px;
    height: 16px;
    object-fit: contain;
    filter: brightness(0) saturate(100%) invert(44%) sepia(13%) saturate(1062%) hue-rotate(345deg) brightness(93%) contrast(87%);
    transition: filter 0.2s;
}

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
}

.btn-editar-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
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

.btn-excluir-comunidade {
    background-color: #FFF5F5;
    border: 1px solid #F5C2C7;
    color: #BC0B27;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
}

.btn-excluir-comunidade:disabled {
    opacity: 0.65;
    cursor: not-allowed;
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
    cursor: pointer;
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

.btn-carregar-mais-receitas {
    align-self: center;
    min-width: 220px;
    padding: 12px 20px;
    border: 1px solid var(--verde);
    border-radius: 14px;
    background-color: #ffffff;
    color: var(--marrom);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
}

.sem-resultados {
    text-align: center;
    padding: 30px;
    color: var(--cinza);
    font-size: 14px;
}

.criador-badge-info {
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #7a998f;
    height: 40px;
    width: 100%;
    border-radius: 15px;
}

@media (max-width: 480px) {
    .corpo {
        background-color: #fcfaf6;
    }

    .coluna {
        width: 100%;
        margin-left: 0;
        background-color: #fcfaf6;
    }

    .banner-capa-header {
        height: 190px;
    }

    .banner-overlay {
        padding: 14px 16px;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.75) 100%);
    }

    .back-btn-circle {
        width: 34px;
        height: 34px;
    }

    .criador-badge-info {
        font-size: 12px;
    }

    .comunidade-titulo {
        font-family: "Playfair Display", serif;
        font-size: 24px;
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 4px;
    }

    .comunidade-stats {
        font-size: 12px;
        gap: 12px;
        color: #efeae1;
    }

    .conteudo-principal {
        padding: 16px 16px 80px 16px;
    }

    .comunidade-descricao {
        font-size: 13px;
        color: #6e655f;
        line-height: 1.45;
        margin-bottom: 16px;
    }

    .membros-avatares-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        margin-bottom: 16px;
    }

    .avatares-stack {
        display: flex;
        align-items: center;
    }

    .avatar-circle-wrapper {
        margin-left: -6px;
    }

    .avatar-circle-wrapper:first-child {
        margin-left: 0;
    }

    .avatar-circle,
    .avatar-img-stack {
        width: 28px;
        height: 28px;
        font-size: 10px;
        border-width: 1.5px;
    }

    .membros-restantes-text {
        font-size: 12px;
        color: #8c827a;
    }

    .denunciar-row {
        display: none;
    }

    .acoes-comunidade-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 12px;
    }

    .btn-acao-participacao {
        flex: 1;
        background-color: #72bca5;
        color: #ffffff;
        border-radius: 14px;
        padding: 12px;
        font-size: 14px;
        font-weight: 600;
        text-align: center;
    }

    .btn-share-icon {
        width: 44px;
        height: 44px;
        border-radius: 14px;
        border: 1px solid #efeae1;
        background-color: #ffffff;
        color: #4a2512;
    }

    .btn-editar-wrapper {
        margin-bottom: 20px;
    }

    .btn-editar-comunidade {
        background-color: #ffffff;
        border: 1px solid #dcd4c8;
        color: #4a2512;
        border-radius: 20px;
        padding: 8px 18px;
        font-size: 13px;
        font-weight: 600;
    }

    .abas-container {
        display: flex;
        gap: 32px;
        border-bottom: 1.5px solid #efeae1;
        padding-bottom: 0;
        background: transparent;
        margin-bottom: 16px;
        justify-content: center;
    }

    .aba-btn {
        background: transparent !important;
        border: none !important;
        border-bottom: 3px solid transparent !important;
        border-radius: 0 !important;
        color: #8c827a !important;
        padding: 5px 30px 8px 30px !important;
        font-size: 15px !important;
        font-weight: 500 !important;
        flex: none !important;
    }

    .aba-btn.active {
        color: #4a2512 !important;
        font-weight: 700 !important;
        border-bottom-color: #4a2512 !important;
    }

    .icone-aba {
        display: none;
    }

    .lista-receitas-grid {
        gap: 14px;
    }
}
</style>