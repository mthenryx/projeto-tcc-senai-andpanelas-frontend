<template>
    <div class="corpo">
        <BarraNavegacao />

        <div class="coluna">
            <header class="header-topo">
                <div class="header-titles none">
                    <h2>Comunidades</h2>
                </div>
                <button class="btn-criar-topo" @click="irParaCriarComunidade">
                    Criar
                </button>
            </header>

            <div class="conteudo-comunidades">

                <div class="search-container">
                    <input 
                        type="text" 
                        v-model="termoPesquisa" 
                        class="text-input search-input" 
                        placeholder="Pesquisar comunidade pelo nome..." 
                    />
                </div>

                <div v-if="carregando" class="sem-resultados">
                    <p>Carregando comunidades...</p>
                </div>

                <div v-else-if="erroApi" class="sem-resultados">
                    <p>{{ erroApi }}</p>
                </div>

                <template v-else>
                    <section class="secao-bloco" v-if="comunidadeDestaque">
                        <h3 class="titulo-secao">Destaque da semana</h3>
                        <div class="banner-destaque" :style="{ backgroundImage: `url(${comunidadeDestaque.banner_url})` }" @click="irParaDetalhes(comunidadeDestaque.id)">
                            <div class="banner-overlay">
                                <div class="badge-emalta">
                                    <span>🔥 Em alta</span>
                                </div>
                                <div class="banner-info">
                                    <h2>{{ comunidadeDestaque.nome }}</h2>
                                    <div class="banner-stats">
                                        <span>
                                            <img src="../../public/iconPaginas/comunidade_icon_cinza.png" alt="comunidade" class="community">
                                            {{ comunidadeDestaque.quantidade_pessoas }} 
                                            membros
                                        </span>
                                        <span>
                                            <img src="../../public/icon_fileira.png" alt="fileira de receitas">
                                            {{ comunidadeDestaque.quantidade_receitas }} 
                                            receitas
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    v-if="!comunidadeDestaque.criador"
                                    type="button" 
                                    class="banner-status-participando" 
                                    :class="{ 'participando': comunidadeDestaque.participa }"
                                    :disabled="processandoIds[comunidadeDestaque.id]"
                                    @click.stop="alternarParticipacao(comunidadeDestaque)"
                                >
                                    {{ comunidadeDestaque.participa ? '✓ Participando' : '+ Entrar' }}
                                </button>
                                <span v-else class="banner-status-participando participando">
                                    ★ Moderador
                                </span>
                            </div>
                        </div>
                    </section>

                    <section class="secao-bloco" v-if="minhasComunidades.length > 0">
                        <h3 class="titulo-secao">Minhas comunidades</h3>

                        <div 
                            class="minhas-comunidades-grid" 
                            ref="carrosselRef"
                            @mousedown="iniciarArrasto"
                            @mouseleave="pararArrasto"
                            @mouseup="pararArrasto"
                            @mousemove="arrastar"
                        >
                            <div v-for="com in minhasComunidades" :key="com.id" class="minha-comunidade-card" @click="irParaDetalhes(com.id)">
                                <img :src="com.foto_url" :alt="com.nome" class="minha-comunidade-foto" draggable="false" />
                                <span class="minha-comunidade-nome">{{ com.nome }}</span>
                            </div>
                        </div>
                    </section>

                    <section class="secao-bloco">
                        <h3 class="titulo-secao">Explorar comunidades</h3>
                        <div class="lista-explorar">
                            <div v-for="com in comunidadesFiltradas" :key="com.id" class="comunidade-card-item" @click="irParaDetalhes(com.id)">
                                <div class="comunidade-card-left">
                                    <img :src="com.foto_url" :alt="com.nome" class="comunidade-item-foto" />
                                    <div class="comunidade-item-detalhes">
                                        <h4>{{ com.nome }}</h4>
                                        <p>{{ com.descricao }}</p>
                                        <div class="comunidade-item-stats">
                                            <span>👥 {{ com.quantidade_pessoas }}</span>
                                            <span>🔍 {{ com.quantidade_receitas }}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    v-if="!com.criador"
                                    type="button"
                                    class="btn-participar"
                                    :class="{ 'participando': com.participa }"
                                    :disabled="processandoIds[com.id]"
                                    @click.stop="alternarParticipacao(com)"
                                >
                                    {{ com.participa ? '✓ Participando' : '+ Entrar' }}
                                </button>
                                <span v-else class="btn-participar participando">
                                    ★ Minha
                                </span>
                            </div>
                            <div v-if="comunidadesFiltradas.length === 0" class="sem-resultados">
                                <p>Nenhuma comunidade encontrada com esse nome.</p>
                            </div>
                        </div>
                    </section>
                </template>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BarraNavegacao from '@/components/BarraNavegacao.vue';
import {
    getListarComunidades,
    postEntrarComunidade,
    deleteSairComunidade,
    obterIdUsuarioLogado
} from '@/services/comunidades';

const router = useRouter();

const termoPesquisa = ref('');
const carregando = ref(false);
const erroApi = ref('');
const usuarioAtualId = ref(null);
const processandoIds = reactive({});

const comunidadesGeral = ref([]);
const comunidadeDestaque = ref(null);

const BANNER_FALLBACK = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200';
const FOTO_FALLBACK = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=150';

const extrairLista = (res) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.response?.dados)) return res.response.dados;
    if (Array.isArray(res?.response)) return res.response;
    if (Array.isArray(res?.dados)) return res.dados;
    return [];
};

const normalizarComunidade = (item) => {
    const criadorId = Number(item.criador_id || item.id_usuario || item.id_criador || item.criador?.id || 0);
    const ehCriador = Boolean(item.criador === true) || (usuarioAtualId.value && criadorId === Number(usuarioAtualId.value));
    const participantes = Array.isArray(item.participantes) ? item.participantes : [];
    const participaLista = usuarioAtualId.value
        ? participantes.some(p => Number(p.id || p.id_usuario) === Number(usuarioAtualId.value))
        : false;

    const qtdMembros = item.quantidade_pessoas ?? item.total_membros ?? item.membros_count ?? participantes.length ?? 0;
    const qtdReceitas = item.quantidade_receitas ?? item.total_receitas ?? item.receitas_count ?? 0;

    return {
        id: Number(item.id),
        nome: item.nome || 'Comunidade',
        descricao: item.descricao || '',
        banner_url: item.banner_url || item.banner || item.foto_capa || item.foto_url || BANNER_FALLBACK,
        foto_url: item.foto_url || item.foto || item.icone || item.banner_url || FOTO_FALLBACK,
        quantidade_pessoas: qtdMembros,
        quantidade_receitas: qtdReceitas,
        criador_id: criadorId,
        criador: ehCriador,
        participa: Boolean(item.participa || item.eh_membro || item.participando || participaLista || ehCriador)
    };
};

const carregarComunidades = async () => {
    carregando.value = true;
    erroApi.value = '';
    try {
        usuarioAtualId.value = await obterIdUsuarioLogado();
        const res = await getListarComunidades({ limite: 100 });
        const listaNormalizada = extrairLista(res).map(normalizarComunidade);

        comunidadesGeral.value = listaNormalizada;

        if (listaNormalizada.length > 0) {
            const ordenadaPorMembros = [...listaNormalizada].sort((a, b) => {
                const numA = Number(String(a.quantidade_pessoas).replace(/\D/g, '')) || 0;
                const numB = Number(String(b.quantidade_pessoas).replace(/\D/g, '')) || 0;
                return numB - numA;
            });
            comunidadeDestaque.value = { ...ordenadaPorMembros[0] };
        } else {
            comunidadeDestaque.value = null;
        }
    } catch (erro) {
        console.error('Erro ao carregar comunidades:', erro);
        erroApi.value = erro.message || 'Não foi possível carregar as comunidades.';
    } finally {
        carregando.value = false;
    }
};

onMounted(carregarComunidades);

const sincronizarEstadoParticipacao = (id, novoEstadoParticipa, deltaMembros) => {
    const atualizarItem = (item) => {
        if (!item || Number(item.id) !== Number(id)) return;
        item.participa = novoEstadoParticipa;
        if (typeof item.quantidade_pessoas === 'number') {
            item.quantidade_pessoas = Math.max(0, item.quantidade_pessoas + deltaMembros);
        }
    };

    atualizarItem(comunidadeDestaque.value);
    const alvoLista = comunidadesGeral.value.find(c => Number(c.id) === Number(id));
    atualizarItem(alvoLista);
};

const alternarParticipacao = async (com) => {
    if (com.criador || processandoIds[com.id]) return;

    if (!usuarioAtualId.value) {
        router.push('/login');
        return;
    }

    const estavaParticipando = com.participa;
    processandoIds[com.id] = true;

    try {
        if (estavaParticipando) {
            await deleteSairComunidade(com.id);
            sincronizarEstadoParticipacao(com.id, false, -1);
        } else {
            await postEntrarComunidade(com.id);
            sincronizarEstadoParticipacao(com.id, true, 1);
        }
    } catch (erro) {
        console.error('Erro ao alterar participação:', erro);
        alert(erro.message || 'Não foi possível atualizar sua participação na comunidade.');
    } finally {
        processandoIds[com.id] = false;
    }
};

const irParaDetalhes = (id) => {
    router.push({ name: 'comunidade-detalhes', params: { id } });
};

const minhasComunidades = computed(() => {
    const mapa = new Map();

    comunidadesGeral.value.forEach((com) => {
        if (com.participa || com.criador) {
            mapa.set(com.id, {
                id: com.id,
                foto_url: com.foto_url,
                nome: com.nome
            });
        }
    });

    if (comunidadeDestaque.value && (comunidadeDestaque.value.participa || comunidadeDestaque.value.criador)) {
        mapa.set(comunidadeDestaque.value.id, {
            id: comunidadeDestaque.value.id,
            foto_url: comunidadeDestaque.value.foto_url,
            nome: comunidadeDestaque.value.nome
        });
    }

    return Array.from(mapa.values());
});

const comunidadesFiltradas = computed(() => {
    if (!termoPesquisa.value.trim()) {
        return comunidadesGeral.value;
    }
    const termo = termoPesquisa.value.toLowerCase();
    return comunidadesGeral.value.filter(com =>
        com.nome.toLowerCase().includes(termo)
    );
});

const irParaCriarComunidade = () => {
    router.push('/criar-comunidade');
};

const carrosselRef = ref(null);
let isDown = false;
let startX = 0;
let scrollLeft = 0;

const iniciarArrasto = (e) => {
    isDown = true;
    startX = e.pageX - carrosselRef.value.offsetLeft;
    scrollLeft = carrosselRef.value.scrollLeft;
};

const pararArrasto = () => {
    isDown = false;
};

const arrastar = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carrosselRef.value.offsetLeft;
    const walk = (x - startX) * 1.5;
    carrosselRef.value.scrollLeft = scrollLeft - walk;
};
</script>

<style scoped>
.minhas-comunidades-grid {
    display: flex;
    gap: 16px;
    overflow-x: auto;
    padding: 4px 4px 12px 4px;
    scroll-behavior: smooth;
    cursor: grab; 
    user-select: none;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.minhas-comunidades-grid:active {
    cursor: grabbing;
}

.minhas-comunidades-grid::-webkit-scrollbar {
    display: none;
}

.community {
    filter: brightness(0) invert(1);
    width: 20px;
    height: auto;
}

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
    justify-content: space-between;
    padding: 0 32px;
    box-sizing: border-box;
}

.header-titles h2 {
    font-family: "Inter", sans-serif;
    font-size: 20px;
    color: var(--marrom);
    margin: 0;
    font-weight: 700;
}

.btn-criar-topo {
    background-color: var(--verde);
    color: #FFFFFF;
    border: none;
    border-radius: 20px;
    padding: 8px 24px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-criar-topo:hover {
    background-color: var(--verde-escuro);
}

.conteudo-comunidades {
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    max-width: 1100px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
}

.search-input {
    width: 100%;
    padding: 14px 18px;
    border: 1px solid #EFEAE1;
    border-radius: 14px;
    background-color: #FFFFFF;
    font-size: 14px;
    color: var(--marrom);
    outline: none;
    box-sizing: border-box;
}

.search-input:focus {
    border-color: var(--verde);
}

.titulo-secao {
    font-family: "Playfair Display", serif;
    font-size: 18px;
    font-weight: 700;
    color: var(--marrom);
    margin-bottom: 25px;
}

.banner-destaque {
    width: 100%;
    height: 240px;
    border-radius: 16px;
    background-size: cover;
    background-position: center;
    position: relative;
    overflow: hidden;
    cursor: pointer;
}

.banner-overlay {
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.3) 100%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 24px;
    box-sizing: border-box;
    position: relative;
}

.badge-emalta {
    background-color: var(--amarelo);
    color: white;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 500;
    width: fit-content;
}

.banner-info h2 {
    color: #FFFFFF;
    font-family: "Playfair Display", serif;
    font-size: 26px;
    margin: 0 0 8px 0;
}

.banner-stats {
    align-items: center;
    display: flex;
    gap: 16px;
    color: #EFEAE1;
    font-size: 13px;
}

.banner-stats span {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
}

.banner-status-participando {
    position: absolute;
    bottom: 24px;
    right: 24px;
    background-color: rgba(114, 188, 165, 0.9);
    color: #FFFFFF;
    border: none;
    padding: 8px 18px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
}

.banner-status-participando.participando {
    background-color: #E3F4ED;
    color: var(--verde-escuro);
}

.minha-comunidade-card {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    border-radius: 16px;
    min-width: 110px;
    text-align: center;
    justify-content: center;
}

.minha-comunidade-foto {
    width: 60px;
    height: 40px;
    border-radius: 15px;
    object-fit: cover;
    border: 2px solid var(--verde);
}

.minha-comunidade-nome {
    font-size: 12px;
    font-weight: 600;
    color: var(--marrom);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 90px;
}

.lista-explorar {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.comunidade-card-item {
    background: #FFFFFF;
    border: 1px solid #EFEAE1;
    border-radius: 16px;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.01);
    cursor: pointer;
}

.comunidade-card-left {
    display: flex;
    gap: 16px;
    align-items: center;
}

.comunidade-item-foto {
    width: 60px;
    height: 60px;
    border-radius: 14px;
    object-fit: cover;
}

.comunidade-item-detalhes h4 {
    font-family: "Inter", sans-serif;
    font-size: 16px;
    color: var(--marrom);
    margin: 0 0 4px 0;
}

.comunidade-item-detalhes p {
    font-size: 13px;
    color: var(--cinza);
    margin: 0 0 8px 0;
}

.comunidade-item-stats {
    display: flex;
    gap: 16px;
    font-size: 12px;
    color: var(--cinza);
    font-weight: 500;
}

.btn-participar {
    background-color: var(--verde);
    color: #FFFFFF;
    border: none;
    border-radius: 20px;
    padding: 8px 20px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: background-color 0.2s;
}

.btn-participar.participando {
    background-color: #E3F4ED;
    color: var(--verde-escuro);
}

.btn-participar:disabled,
.banner-status-participando:disabled {
    opacity: 0.65;
    cursor: not-allowed;
}

.sem-resultados {
    text-align: center;
    padding: 20px;
    color: var(--cinza);
    font-size: 13px;
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
        padding: 0px 12px;
        border: none;
        background-color: transparent;
    }

    .conteudo-comunidades {
        padding: 16px 12px;
        gap: 20px;
    }

    .banner-destaque {
        height: 200px;
    }

    .banner-overlay {
        padding: 16px;
    }

    .titulo-secao {
        font-size: 16px;
        margin-bottom: 16px;
    }

    .comunidade-card-item {
        padding: 14px;
    }

    .search-input {
        margin-top: -10px;
    }
}

@media (max-width: 480px) {
    .header-topo {
        display: flex;
        background-color: #ffffff;
        border-bottom: 1px solid var(--bege);
        margin-bottom: 10px;
    }

    .conteudo-comunidades {
        padding: 16px 16px 80px 16px;
        gap: 16px;
    }

    .banner-destaque {
        height: 180px;
        border-radius: 16px;
    }

    .banner-overlay {
        padding: 16px;
    }

    .banner-info h2 {
        font-size: 20px;
    }

    .banner-status-participando {
        bottom: 16px;
        right: 16px;
        padding: 6px 14px;
        font-size: 11px;
    }

    .comunidade-card-item {
        padding: 12px;
        gap: 10px;
        align-items: center;
    }

    .comunidade-card-left {
        gap: 10px;
        flex: 1;
        min-width: 0;
    }

    .comunidade-item-foto {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        flex-shrink: 0;
    }

    .comunidade-item-detalhes {
        min-width: 0;
        flex: 1;
    }

    .comunidade-item-detalhes h4 {
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .comunidade-item-detalhes p {
        font-size: 11px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .comunidade-item-stats {
        font-size: 11px;
        gap: 10px;
    }

    .btn-participar {
        padding: 6px 14px;
        font-size: 12px;
        border-radius: 16px;
        flex-shrink: 0;
    }
}
</style>