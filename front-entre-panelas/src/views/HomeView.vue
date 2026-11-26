<template>
    <div class="corpo">
        <BarraNavegacao></BarraNavegacao>
        <div class="coluna">
            <HeaderAplicacao class="hearder-aplication none"></HeaderAplicacao>
            <div class="conteudo">

                <UserSearchModal :is-open="isModalOpen" :users="listaDeUsuarios" @close="fecharModal" />

                <div v-if="categoriaSelecionada" class="container">
                    <div class="section-title-wrapper" style="margin-bottom: 25px;">
                        <button class="btn-voltar-cat" @click="fecharCategoria">← Voltar</button>
                        <h3 class="section-title">{{ categoriaSelecionada.titulo }}</h3>
                        <div></div>
                    </div>

                    <LoadingSpinner v-if="carregandoCategoria" />

                    <template v-else>
                        <div class="grid-mini">
                            <RecipeCardMini 
                                v-for="receita in receitasCategoriaExpandida"
                                :key="receita.id"
                                :id="receita.id"
                                :imagemUrl="receita.imagemUrl"
                                :titulo="receita.titulo"
                                :tempo="receita.tempo"
                                :porcoes="receita.porcoes"
                                :dificuldade="receita.dificuldade"
                                @click="abrirDetalhes(receita.id)"
                                style="cursor: pointer;"
                            />
                        </div>
                        <p v-if="receitasCategoriaExpandida.length === 0" class="sem-receitas">
                            Nenhuma receita encontrada para esta categoria.
                        </p>
                    </template>
                </div>

                <template v-else>
                    <div class="tabs-container">
                        <button v-for="tab in tabs" :key="tab.id" class="tab-btn" :class="{ 'active': abaAtiva === tab.id }"
                            @click="abaAtiva = tab.id">
                            {{ tab.label }}
                        </button>
                    </div>

                    <div class="container">
                        <LoadingSpinner v-if="carregandoInicial" />

                        <template v-else>
                            <div v-if="abaAtiva === 'para-voce'" class="tab-pane">
                                <RecipeBannerCard 
                                    v-if="destaqueParaVoce"
                                    :id="destaqueParaVoce.id"
                                    :imagemUrl="destaqueParaVoce.imagemUrl"
                                    :titulo="destaqueParaVoce.titulo"
                                    :tempo="destaqueParaVoce.tempo"
                                    :porcoes="destaqueParaVoce.porcoes"
                                    :custo="destaqueParaVoce.custo"
                                    :autorNome="destaqueParaVoce.autorNome"
                                    :authorIniciais="destaqueParaVoce.authorIniciais"
                                    :autorFotoUrl="destaqueParaVoce.autorFotoUrl"
                                    :dificuldade="destaqueParaVoce.dificuldade"
                                    :badgeTexto="destaqueParaVoce.badgeTexto"
                                    @click="abrirDetalhes(destaqueParaVoce.id)"
                                    style="cursor: pointer;"
                                />

                                <RecipeCard 
                                    v-for="receita in listaDeReceitas" 
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
                                    style="cursor: pointer;"
                                />

                                <p v-if="!destaqueParaVoce && listaDeReceitas.length === 0" class="sem-receitas">
                                    Nenhuma receita encontrada no momento.
                                </p>
                            </div>

                            <div v-else-if="abaAtiva === 'seguindo'" class="tab-pane">
                                <RecipeCard 
                                    v-for="receita in receitasSeguindo" 
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
                                    style="cursor: pointer;"
                                />

                                <p v-if="receitasSeguindo.length === 0" class="sem-receitas">
                                    Nenhuma receita dos usuários que você segue encontrada.
                                </p>
                            </div>

                            <div v-else-if="abaAtiva === 'populares'" class="tab-pane">
                                <LoadingSpinner v-if="carregandoPopulares" />

                                <template v-else>
                                    <div class="category-row" v-for="categoria in categoriasPopulares" :key="categoria.titulo">
                                        <div class="section-title-wrapper">
                                            <h3 class="section-title">{{ categoria.titulo }}</h3>
                                            <span class="see-all" @click="verTodasCategoria(categoria)">Ver todas</span>
                                        </div>
                                        <div v-if="categoria.receitas.length > 0" class="grid-mini">
                                            <RecipeCardMini 
                                                v-for="receita in categoria.receitas"
                                                :key="receita.id"
                                                :id="receita.id"
                                                :imagemUrl="receita.imagemUrl"
                                                :titulo="receita.titulo"
                                                :tempo="receita.tempo"
                                                :porcoes="receita.porcoes"
                                                :dificuldade="receita.dificuldade"
                                                @click="abrirDetalhes(receita.id)"
                                                style="cursor: pointer;"
                                            />
                                        </div>
                                        <p v-else class="sem-receitas">
                                            Nenhuma receita nesta categoria ainda.
                                        </p>
                                    </div>
                                </template>
                            </div>

                            <div v-else-if="abaAtiva === 'receitas'" class="tab-pane">
                                <LoadingSpinner v-if="carregandoSemana" />

                                <RecipePodiumRanking 
                                    v-else-if="receitaOuro || receitaPrata || receitaBronze"
                                    :ouro="receitaOuro"
                                    :prata="receitaPrata"
                                    :bronze="receitaBronze"
                                    @ver-receita="abrirDetalhes" 
                                />

                                <p v-else class="sem-receitas">
                                    O ranking das receitas da semana ainda não está disponível.
                                </p>
                            </div>
                        </template>

                        <ReportModal 
                            :is-open="isReportOpen" 
                            :tipo="tipoDenuncia" 
                            :target-id="targetIdDenuncia"
                            @close="isReportOpen = false"
                            @send="tratarEnvioDenuncia"
                        />
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BarraNavegacao from '@/components/BarraNavegacao.vue';
import HeaderAplicacao from '@/components/HeaderAplicacao.vue';
import UserCarousel from '@/components/UserCarousel.vue';
import UserSearchModal from '@/components/UserSearchModal.vue';
import RecipeCard from '@/components/RecipeCard.vue';
import RecipeCardMini from '@/components/RecipeCardMini.vue';
import RecipeBannerCard from '@/components/RecipeBannerCard.vue';
import RecipePodiumRanking from '@/components/RecipePodiumRanking.vue';
import ReportModal from '@/components/ReportModal.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

import { authService } from '@/services/authService';
import { getListarUsuarios, getSeguindoUsuario } from '@/services/usuarios';
import {
    getListarReceitas,
    getBuscarReceitasPorCategoria,
    getReceitasDaSemana,
    postSalvarReceita,
    deleteSalvarReceita
} from '@/services/receitas';

const router = useRouter();

const MAPA_CUSTO = { 1: 'Econômico', 2: 'Moderado', 3: 'Alto' };
const MAPA_DIFICULDADE = { 1: 'Fácil', 2: 'Médio', 3: 'Difícil' };

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

const gerarIniciais = (nome) => {
    if (!nome) return 'CH';
    const partes = nome.trim().split(/\s+/);
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
};

const extrairListaReceitas = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.response)) return res.response;
    if (Array.isArray(res?.response?.dados)) return res.response.dados;
    if (Array.isArray(res?.response?.receitas)) return res.response.receitas;
    if (Array.isArray(res?.dados)) return res.dados;
    if (Array.isArray(res?.receitas)) return res.receitas;
    return [];
};

const normalizarReceita = (rec) => {
    if (!rec) return null;
    const autorNome = rec.usuario?.nome || rec.autor_nome || 'Chef Entre Panelas';
    const autorId = rec.usuario?.id ?? rec.id_usuario ?? null;

    return {
        id: rec.id,
        imagemUrl: rec.foto || rec.imagemUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
        titulo: rec.titulo || 'Receita sem título',
        descricao: rec.descricao || '',
        tempo: formatarTempo(rec.tempo),
        porcoes: formatarPorcoes(rec.id_porcao ?? rec.porcao ?? rec.porcoes),
        custo: MAPA_CUSTO[rec.id_custo] || rec.custo || 'Econômico',
        dificuldade: MAPA_DIFICULDADE[rec.id_dificuldade] || (typeof rec.dificuldade === 'string' ? rec.dificuldade : 'Fácil'),
        curtidas: Number(rec.qtd_curtidas ?? rec.qtd_curtida ?? 0),
        comentarios: Array.isArray(rec.comentarios) ? rec.comentarios.length : Number(rec.qtd_comentarios ?? 0),
        autorId,
        autorNome,
        authorIniciais: gerarIniciais(autorNome),
        autorFotoUrl: rec.usuario?.foto_perfil || '',
        salvo: Boolean(rec.salvo_pelo_usuario ?? rec.eh_salva_pelo_usuario),
        categorias: Array.isArray(rec.categorias) ? rec.categorias : []
    };
};

const carregandoInicial = ref(true);
const carregandoPopulares = ref(false);
const carregandoSemana = ref(false);
const carregandoCategoria = ref(false);

const abaAtiva = ref('para-voce');
const tabs = [
    { id: 'para-voce', label: 'Para você' },
    { id: 'seguindo', label: 'Seguindo' },
    { id: 'populares', label: 'Populares' },
    { id: 'receitas', label: 'Receitas da semana' }
];

const listaDeUsuarios = ref([]);
const isModalOpen = ref(false);
const idsUsuariosSeguidos = ref(new Set());

const usuariosSeguidos = computed(() => {
    return listaDeUsuarios.value.filter(user => user.seguindo === true);
});

const fecharModal = () => { isModalOpen.value = false; };

const carregarUsuariosESeguidos = async () => {
    const userId = authService.getUserId();

    try {
        const [usuariosRes, seguindoRes] = await Promise.all([
            getListarUsuarios({ limite: 50 }).catch(() => null),
            userId ? getSeguindoUsuario(userId, { limite: 100 }).catch(() => null) : Promise.resolve(null)
        ]);

        const listaSeguindoApi = seguindoRes?.response?.seguindo || seguindoRes?.response?.dados || [];
        const idsSet = new Set(listaSeguindoApi.map(u => Number(u.id)));
        idsUsuariosSeguidos.value = idsSet;

        const todosUsuariosApi = usuariosRes?.response?.usuarios || usuariosRes?.response?.dados || [];
        const mapaUsuarios = new Map();

        todosUsuariosApi.forEach(u => {
            if (Number(u.id) === Number(userId) || Number(u.id) === 1) return;
            mapaUsuarios.set(Number(u.id), {
                id: u.id,
                nome: u.nome,
                username: u.username,
                fotoUrl: u.foto_perfil || '',
                iniciais: gerarIniciais(u.nome),
                seguindo: idsSet.has(Number(u.id))
            });
        });

        listaSeguindoApi.forEach(u => {
            if (!mapaUsuarios.has(Number(u.id)) && Number(u.id) !== Number(userId) && Number(u.id) !== 1) {
                mapaUsuarios.set(Number(u.id), {
                    id: u.id,
                    nome: u.nome,
                    username: u.username,
                    fotoUrl: u.foto_perfil || '',
                    iniciais: gerarIniciais(u.nome),
                    seguindo: true
                });
            }
        });

        listaDeUsuarios.value = Array.from(mapaUsuarios.values());
    } catch (erro) {
        console.error('Erro ao carregar usuários:', erro);
    }
};

// --- Receitas: "Para você" e "Seguindo" ---
const todasReceitasFeed = ref([]);

const destaqueParaVoce = computed(() => {
    if (todasReceitasFeed.value.length === 0) return null;
    return {
        ...todasReceitasFeed.value[0],
        badgeTexto: 'Receita do Dia'
    };
});

const listaDeReceitas = computed(() => {
    if (todasReceitasFeed.value.length <= 1) return [];
    return todasReceitasFeed.value.slice(1);
});

const receitasSeguindo = computed(() => {
    if (idsUsuariosSeguidos.value.size === 0) return [];
    return todasReceitasFeed.value.filter(rec => idsUsuariosSeguidos.value.has(Number(rec.autorId)));
});

const carregarFeedReceitas = async () => {
    try {
        const res = await getListarReceitas({ limite: 12, ordenar_por: 'recente' });
        const dados = extrairListaReceitas(res);
        todasReceitasFeed.value = dados.map(normalizarReceita).filter(Boolean);
    } catch (erro) {
        console.error('Erro ao carregar feed de receitas:', erro);
    }
};

const GRUPOS_CATEGORIAS = [
    { titulo: 'Almoço e Jantar', ids: [2, 3] },
    { titulo: 'Café da manhã e Lanche', ids: [1, 5] },
    { titulo: 'Sobremesa', ids: [4] },
    { titulo: 'Sopa', ids: [6] },
    { titulo: 'Salada', ids: [7] },
    { titulo: 'Bebida', ids: [8] }
];

const categoriasPopulares = ref([]);
const popularesJaCarregado = ref(false);

const carregarCategoriasPopulares = async () => {
    if (popularesJaCarregado.value) return;
    carregandoPopulares.value = true;

    try {
        const resultados = await Promise.all(
            GRUPOS_CATEGORIAS.map(async (grupo) => {
                const respostas = await Promise.all(
                    grupo.ids.map(idCat =>
                        getBuscarReceitasPorCategoria({ id_categoria: idCat, limite: 4 }).catch(() => null)
                    )
                );

                const mapaUnico = new Map();
                respostas.forEach(res => {
                    const lista = extrairListaReceitas(res);
                    lista.forEach(item => {
                        if (!mapaUnico.has(item.id)) {
                            mapaUnico.set(item.id, normalizarReceita(item));
                        }
                    });
                });

                return {
                    titulo: grupo.titulo,
                    ids: grupo.ids,
                    receitas: Array.from(mapaUnico.values()).slice(0, 4)
                };
            })
        );

        categoriasPopulares.value = resultados;
        popularesJaCarregado.value = true;
    } catch (erro) {
        console.error('Erro ao carregar categorias populares:', erro);
    } finally {
        carregandoPopulares.value = false;
    }
};

const categoriaSelecionada = ref(null);
const receitasCategoriaExpandida = ref([]);

const verTodasCategoria = async (grupoCategoria) => {
    categoriaSelecionada.value = grupoCategoria;
    receitasCategoriaExpandida.value = [];
    carregandoCategoria.value = true;

    try {
        const respostas = await Promise.all(
            grupoCategoria.ids.map(idCat =>
                getBuscarReceitasPorCategoria({ id_categoria: idCat, limite: 50 }).catch(() => null)
            )
        );

        const mapaUnico = new Map();
        respostas.forEach(res => {
            const lista = extrairListaReceitas(res);
            lista.forEach(item => {
                if (!mapaUnico.has(item.id)) {
                    mapaUnico.set(item.id, normalizarReceita(item));
                }
            });
        });

        receitasCategoriaExpandida.value = Array.from(mapaUnico.values());
    } catch (erro) {
        console.error('Erro ao buscar receitas da categoria:', erro);
    } finally {
        carregandoCategoria.value = false;
    }
};

const fecharCategoria = () => {
    categoriaSelecionada.value = null;
    receitasCategoriaExpandida.value = [];
};

const receitaOuro = ref(null);
const receitaPrata = ref(null);
const receitaBronze = ref(null);
const semanaJaCarregado = ref(false);

const carregarReceitasSemana = async () => {
    if (semanaJaCarregado.value) return;
    carregandoSemana.value = true;

    try {
        const res = await getReceitasDaSemana();
        const dados = Array.isArray(res?.response?.receitas)
            ? res.response.receitas
            : (Array.isArray(res?.response) ? res.response : []);

        receitaOuro.value = normalizarReceita(dados[0]);
        receitaPrata.value = normalizarReceita(dados[1]);
        receitaBronze.value = normalizarReceita(dados[2]);
        semanaJaCarregado.value = true;
    } catch (erro) {
        console.error('Erro ao carregar receitas da semana:', erro);
    } finally {
        carregandoSemana.value = false;
    }
};

const abrirDetalhes = (idReceita) => {
    if (!idReceita) return;
    router.push({
        name: 'receita',
        params: { id: idReceita }
    });
};

const tratarSalvarReceita = async ({ id, salvo }) => {
    try {
        if (salvo) {
            await postSalvarReceita(id);
        } else {
            await deleteSalvarReceita(id);
        }
    } catch (erro) {
        console.error('Erro ao alterar status de receita salva:', erro);
        const alvo = todasReceitasFeed.value.find(r => r.id === id);
        if (alvo) alvo.salvo = !salvo;
    }
};

const isReportOpen = ref(false);
const tipoDenuncia = ref('usuario');
const targetIdDenuncia = ref(null);

const tratarEnvioDenuncia = (dados) => {
    console.log('Dados da denúncia enviados:', dados);
};

watch(abaAtiva, (novaAba) => {
    if (novaAba === 'populares') {
        carregarCategoriasPopulares();
    } else if (novaAba === 'receitas') {
        carregarReceitasSemana();
    }
});

onMounted(async () => {
    carregandoInicial.value = true;
    await Promise.all([
        carregarUsuariosESeguidos(),
        carregarFeedReceitas()
    ]);
    carregandoInicial.value = false;
});
</script>

<style scoped>
.corpo {
    display: flex;
    width: 100%;
    min-height: 100vh;
}

.coluna {
    width: calc(100% - 200px);
    min-width: 0;
    margin-left: 200px;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #fdfbf7;
}

.conteudo {
    background-color: #fdfbf7;
    flex: 1;
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
    position: relative;
    display: flex;
    flex-direction: column;
}

nav {
    padding: 10px 15px;
    width: 300px;
    display: flex;
    gap: 8px;
}

.fast-navegation {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 14px;
    border: 1px solid var(--bege);
    border-radius: 25px;
    background-color: white;
    gap: 10px;
    color: var(--marrom);
    font-family: "Inter", sans-serif;
    text-decoration: none;
    font-size: 12px;
    font-weight: 500;
}

.fast-navegation:hover {
    background-color: #eceae5;
    border: 1px solid #e6dcca;
    transition: 0.5s;
}

.fast-navegation img {
    width: 12px;
    height: auto;
}

.lista {
    filter: grayscale(100%) brightness(35%) contrast(120%);
}

#comunidade {
    height: 15px;
    width: auto;
    filter: brightness(0) saturate(100%) invert(42%) sepia(71%) saturate(2572%) hue-rotate(221deg) brightness(99%) contrast(93%);
}

.tabs-container {
    display: flex;
    gap: 12px;
    padding: 12px 16px;
    overflow-x: auto;
    white-space: nowrap;
    scrollbar-width: none;
}

.tabs-container::-webkit-scrollbar {
    display: none;
}

.tab-btn {
    background-color: #FFFFFF;
    border: 1.5px solid var(--bege);
    color: var(--marrom);
    padding: 10px 24px;
    border-radius: 30px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s, border-color 0.2s;
    outline: none;
    user-select: none;
}

.tab-btn:hover {
    background-color: #e4ded2;
    border-color: var(--bege);
}

.tab-btn.active {
    background-color: var(--verde);
    border-color: var(--verde);
    color: #FFFFFF;
    font-weight: 600;
}

.container {
    padding: 15px;
    padding-bottom: 40px;
    width: 100%;
    max-width: 1200px;
    align-self: center;
    box-sizing: border-box;
}

.tab-pane {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.category-row {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.section-title-wrapper {
    display: flex;
    align-items: center;
    margin-top: 10px;
    justify-content: space-between;
}

.section-title {
    font-family: "Playfair Display", serif;
    font-size: 20px;
    color: var(--marrom);
    font-weight: 700;
    margin: 0;
}

.see-all {
    font-size: 13px;
    color: var(--verde-escuro);
    font-weight: 600;
    cursor: pointer;
}

.grid-mini {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
}

.btn-voltar-cat {
    background: none;
    border: none;
    color: var(--marrom);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    padding: 4px 8px;
}

.btn-voltar-cat:hover {
    text-decoration: underline;
}

.sem-receitas {
    font-size: 14px;
    color: var(--cinza);
    text-align: center;
    margin-top: 20px;
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

    nav {
        width: 100%;
        box-sizing: border-box;
        overflow-x: auto;
        scrollbar-width: none;
    }

    .fast-navegation {
        margin-top: 10px;
    }

    .none {
        display: none;
    }
}

@media (max-width: 480px) {
    .hearder-aplication {
        display: flex;
    }

    .corpo {
        background-color: #fcfaf6;
    }

    .coluna {
        width: 100%;
        margin-left: 0;
        background-color: #fcfaf6;
    }

    .conteudo {
        background-color: #fcfaf6;
        padding-bottom: 80px;
    }

    nav {
        display: none;
    }

    .tabs-container {
        padding: 8px 16px;
        gap: 8px;
    }

    .tab-btn {
        padding: 8px 16px;
        font-size: 13px;
        border-radius: 20px;
        background-color: #ffffff;
        border: 1px solid #efeae1;
    }

    .tab-btn.active {
        background-color: #72bca5;
        border-color: #72bca5;
    }

    .container {
        padding: 12px 16px 80px 16px;
    }

    .grid-mini {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
    }
}
</style>