<template>
    <div class="corpo">
        <BarraNavegacao />

        <div class="coluna">
            <div class="conteudo">
                <header class="header-normal">
                    <div class="header-topo-lista none">
                        <div class="header-titles">
                            <div class="title-with-icon">
                                <img src="/icon_carrinho_lista.png" alt="Carrinho de mercado" class="cart-emoji">
                                <h2>Lista de Compras</h2>
                            </div>
                            <p>{{ totalComprados }} de {{ itensLista.length }} itens comprados</p>
                        </div>
                        <div class="header-actions">
                            <div class="copiar-wrapper">
                                <span v-if="mensagemCopiado" class="feedback-copiado">Copiado com sucesso</span>
                                <button
                                    class="icon-action-btn copie"
                                    title="Copiar lista completa"
                                    :disabled="itensLista.length === 0"
                                    @click="copiarListaCompleta"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                                        <polyline points="16 6 12 2 8 6"></polyline>
                                        <line x1="12" y1="2" x2="12" y2="15"></line>
                                    </svg>
                                </button>
                            </div>
                            <button
                                class="icon-action-btn delete"
                                title="Limpar lista"
                                :disabled="itensLista.length === 0 || limpandoLista"
                                @click="limparListaCompleta"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" :style="{ width: progressoPorcentagem + '%' }"></div>
                    </div>
                </header>

                <div class="lista-container">
                    <div v-if="erroApi" class="api-error-banner">
                        {{ erroApi }}
                    </div>

                    <div class="chips-receitas-row">
                        <button 
                            class="tab-pill exibir-tudo-btn" 
                            :class="{ 'active': receitaSelecionadaId === null }"
                            @click="selecionarExibirTudo"
                        >
                            Exibir tudo
                        </button>

                        <div 
                            v-for="rec in receitasVinculadasAtivas" 
                            :key="rec.id" 
                            class="recipe-chip-item"
                            :class="{ 'active': receitaSelecionadaId === rec.id }"
                            @click="clicarReceitaTopo(rec)"
                            :title="receitaSelecionadaId === rec.id ? 'Clique novamente para abrir a receita' : 'Filtrar itens desta receita'"
                        >
                            <img :src="rec.imagemUrl || '/icon_carrinho_lista.png'" :alt="rec.titulo" class="recipe-chip-img" />
                            <span class="recipe-chip-name">{{ rec.titulo }}</span>
                        </div>
                        <button class="add-recipe-chip-btn" @click="irParaBuscarReceita">
                            + Adicionar receita
                        </button>
                    </div>

                    <div class="tabs-filter-row">
                        <button 
                            class="tab-pill" 
                            :class="{ 'active': abaFiltro === 'todos' }"
                            @click="abaFiltro = 'todos'"
                        >
                            Todos ({{ itensLista.length }})
                        </button>
                        <button 
                            class="tab-pill" 
                            :class="{ 'active': abaFiltro === 'pendentes' }"
                            @click="abaFiltro = 'pendentes'"
                        >
                            Pendentes ({{ itensPendentesCount }})
                        </button>
                        <button 
                            class="tab-pill" 
                            :class="{ 'active': abaFiltro === 'comprados' }"
                            @click="abaFiltro = 'comprados'"
                        >
                            Comprados ({{ totalComprados }})
                        </button>
                    </div>

                    <div class="add-manual-row">
                        <input 
                            type="text" 
                            v-model="novoItemNome" 
                            :class="{ 'input-erro': erroNome }"
                            placeholder="Adicionar item manualmente..." 
                            @input="erroNome = false"
                            @keyup.enter="adicionarItemManual"
                            maxlength="35"
                        />
                        <div class="select-wrapper" :class="{ 'input-erro': erroUnidade }">
                            <select v-model="novaUnidadeMedidaId" class="select-field" @change="erroUnidade = false">
                                <option disabled value="">Unidade medida</option>
                                <option v-for="unidade in unidadesMedida" :key="unidade.id" :value="unidade.id">
                                    {{ unidade.nome }}
                                </option>
                            </select>
                        </div>
                        <input 
                            type="number" 
                            v-model.number="novaQuantidade" 
                            :class="{ 'input-erro': erroQtd }"
                            placeholder="Qtd" 
                            min="1" 
                            max="1000"
                            @input="validarQuantidade"
                            @keyup.enter="adicionarItemManual"
                        />
                        <button class="add-manual-btn" @click="adicionarItemManual">+</button>
                    </div>

                    <div v-if="carregandoLista" class="empty-state-container">
                        <p class="empty-desc">Carregando sua lista de compras...</p>
                    </div>

                    <div v-else-if="itensFiltrados.length > 0" class="categorias-container">
                        <div v-for="grupo in itensAgrupadosPorCategoria" :key="grupo.categoria" class="categoria-section">
                            <div class="categoria-header">
                                <span class="cat-icon">{{ grupo.icone }}</span>
                                <span class="cat-titulo">{{ grupo.categoria.toUpperCase() }}</span>
                                <span class="cat-count">({{ grupo.itens.filter(i => i.comprado).length }}/{{ grupo.itens.length }})</span>
                            </div>

                            <div class="itens-list">
                                <div 
                                    v-for="item in grupo.itens" 
                                    :key="item.id" 
                                    class="item-card"
                                    :class="{ 'comprado': item.comprado }"
                                >
                                    <div class="item-left" @click="toggleComprado(item)">
                                        <div class="checkbox-custom" :class="{ 'checked': item.comprado }">
                                            <svg v-if="item.comprado" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </div>
                                        <div class="item-textos">
                                            <span class="item-nome" :class="{ 'riscado': item.comprado }">
                                                {{ item.nome }}<span v-if="item.unidade" class="item-unidade"> · {{ item.unidade }}</span>
                                            </span>
                                            <span class="item-receita-origem" v-if="item.receitaOrigem">{{ item.receitaOrigem }}</span>
                                        </div>
                                    </div>

                                    <div class="item-right">
                                        <span class="item-quantidade">{{ item.quantidade }}</span>
                                        <button
                                            class="remove-item-btn"
                                            :disabled="removendoIds[item.id]"
                                            @click="removerItem(item)"
                                            aria-label="Remover item"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-else class="empty-state-container">
                        <h3 class="empty-title">{{ mensagemEstadoVazio }}</h3>
                        <p class="empty-desc" v-if="abaFiltro === 'comprados'">Comece a marcar os itens conforme for comprando</p>
                        <button class="btn-acao-vazio" @click="irParaBuscarReceita">
                            Buscar receitas
                        </button>
                    </div>

                    <div class="banner-chefinho" @click="irParaChefinho">
                        <div class="chefinho-avatar">
                            <img src="/icon chefinho.png" alt="Chefinho IA" />
                        </div>
                        <div class="chefinho-text">
                            <h5>Dica do Chefinho</h5>
                            <p>Otimize suas compras e reduza o desperdício com ajuda da IA →</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BarraNavegacao from '@/components/BarraNavegacao.vue';
import { authService } from '@/services/authService';
import { getBuscarReceita } from '@/services/receitas';
import {
    getListaComprasReceitas,
    getListaComprasDaReceita,
    putItemListaCompras,
    deleteItemListaCompras,
    deleteTodosListaCompras
} from '@/services/listaCompras';

const router = useRouter();
const STORAGE_MANUAIS_KEY = 'entrepanelas_lista_compras_manuais';

// Unidades de medida cadastradas no banco (tbl_unidade_medida)
const UNIDADES_MEDIDA = [
    { id: 1, nome: 'g' },
    { id: 2, nome: 'kg' },
    { id: 3, nome: 'ml' },
    { id: 4, nome: 'L' },
    { id: 5, nome: 'un' }
];

const abaFiltro = ref('todos');
const receitaSelecionadaId = ref(null);
const cliqueContadorReceita = ref({});
const novoItemNome = ref('');
const novaQuantidade = ref('');
const novaUnidadeMedidaId = ref('');
const mensagemCopiado = ref(false);

const carregandoLista = ref(false);
const limpandoLista = ref(false);
const erroApi = ref('');
const atualizandoIds = reactive({});
const removendoIds = reactive({});

const erroNome = ref(false);
const erroQtd = ref(false);
const erroUnidade = ref(false);

const unidadesMedida = ref(UNIDADES_MEDIDA);
const receitasVinculadas = ref([]);
const itensLista = ref([]);

const extrairLista = (res) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.response?.dados)) return res.response.dados;
    if (Array.isArray(res?.response?.receitas)) return res.response.receitas;
    if (Array.isArray(res?.response?.ingredientes)) return res.response.ingredientes;
    if (Array.isArray(res?.response)) return res.response;
    if (Array.isArray(res?.dados)) return res.dados;
    return [];
};

const mapearUnidadeMedida = (idUnidade) => {
    const idNum = Number(idUnidade);
    const encontrada = UNIDADES_MEDIDA.find(u => u.id === idNum);
    return encontrada ? encontrada.nome : '';
};

const extrairUnidadeTexto = (valor) => {
    if (valor === null || valor === undefined) return '';
    if (typeof valor === 'object') {
        return String(valor.unidade ?? valor.sigla ?? valor.nome ?? valor.medida ?? '').trim();
    }
    return String(valor).trim();
};

const extrairDadosReceita = (resposta) => {
    const dados = resposta?.response;
    if (Array.isArray(dados)) return dados[0] || {};
    if (Array.isArray(dados?.receita)) return dados.receita[0] || {};
    if (Array.isArray(dados?.dados)) return dados.dados[0] || {};
    return dados?.receita ?? dados?.dados ?? resposta?.receita ?? resposta?.dados ?? dados ?? {};
};

const classificarCategoria = (nomeIngrediente) => {
    const nome = (nomeIngrediente || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

    const carnes = ['frango', 'carne', 'file', 'bife', 'porco', 'peixe', 'camarao', 'linguica', 'presunto', 'bacon', 'costela', 'alcatra', 'patinho'];
    const hortifruti = ['limao', 'cenoura', 'alho', 'tomilho', 'cebola', 'batata', 'tomate', 'alface', 'banana', 'maca', 'ervas', 'salsinha', 'cebolinha', 'pimentao', 'abobrinha', 'brocolis', 'laranja', 'morango'];
    const temperos = ['azeite', 'sal', 'pimenta', 'oregano', 'cominho', 'colorau', 'tempero', 'vinagre', 'paprica', 'canela', 'manjericao'];
    const laticinios = ['manteiga', 'leite', 'queijo', 'requeijao', 'creme de leite', 'iogurte', 'mussarela', 'parmesao', 'cheddar'];

    if (carnes.some(c => nome.includes(c))) return { categoria: 'Carnes', icone: '🥩' };
    if (hortifruti.some(h => nome.includes(h))) return { categoria: 'Frutas & Verduras', icone: '🥦' };
    if (temperos.some(t => nome.includes(t))) return { categoria: 'Temperos & Ervas', icone: '🌿' };
    if (laticinios.some(l => nome.includes(l))) return { categoria: 'Laticínios', icone: '🧀' };
    return { categoria: 'Mercearia', icone: '🛒' };
};

const lerItensManuaisLocais = () => {
    try {
        const salvo = localStorage.getItem(STORAGE_MANUAIS_KEY);
        const parsed = salvo ? JSON.parse(salvo) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const salvarItensManuaisLocais = () => {
    try {
        const manuais = itensLista.value.filter(i => i.ehManual);
        localStorage.setItem(STORAGE_MANUAIS_KEY, JSON.stringify(manuais));
    } catch {
        // ignora erro de storage
    }
};

const carregarListaCompras = async () => {
    const token = authService.getToken?.();
    if (!token) {
        router.replace('/login');
        return;
    }

    carregandoLista.value = true;
    erroApi.value = '';

    const manuaisLocais = lerItensManuaisLocais();

    try {
        let receitasApi = [];
        try {
            const resReceitas = await getListaComprasReceitas();
            receitasApi = extrairLista(resReceitas);
        } catch (erroReceitas) {
            if (erroReceitas?.status === 401) {
                router.replace('/login');
                return;
            }
            if (erroReceitas?.status === 404) {
                receitasApi = [];
            } else {
                throw erroReceitas;
            }
        }

        const receitasNormalizadas = receitasApi
            .map(rec => ({
                id: Number(rec.id),
                titulo: String(rec.titulo || 'Receita').trim(),
                imagemUrl: rec.foto || rec.imagem_url || ''
            }))
            .filter(rec => Boolean(rec.id));

        receitasVinculadas.value = receitasNormalizadas;

        const gruposDeItens = await Promise.all(
            receitasNormalizadas.map(async (rec) => {
                try {
                    const [resItens, resReceita] = await Promise.all([
                        getListaComprasDaReceita(rec.id, { status: 'Todos' }),
                        getBuscarReceita(rec.id).catch(() => null)
                    ]);
                    const listaItens = extrairLista(resItens);
                    const dadosReceita = extrairDadosReceita(resReceita);
                    const ingredientesReceita = Array.isArray(dadosReceita?.ingredientes)
                        ? dadosReceita.ingredientes
                        : (Array.isArray(dadosReceita?.ingrediente) ? dadosReceita.ingrediente : []);
                    const unidadesPorIngrediente = new Map();
                    ingredientesReceita.forEach((ingrediente) => {
                        const idIngrediente = Number(ingrediente.id_ingrediente ?? ingrediente.id);
                        const unidadeIngrediente = extrairUnidadeTexto(ingrediente.unidade_medida)
                            || extrairUnidadeTexto(ingrediente.unidade);
                        if (Number.isInteger(idIngrediente) && idIngrediente > 0 && unidadeIngrediente) {
                            unidadesPorIngrediente.set(idIngrediente, unidadeIngrediente);
                        }
                    });

                    return listaItens.map((item) => {
                        const nomeItem = String(item.nome || item.nome_ingrediente || '').trim();
                        const classif = classificarCategoria(nomeItem);
                        const comprado =
                            Number(item.id_status) === 1 ||
                            String(item.status || '').toLowerCase() === 'comprado';
                        const idIngrediente = Number(item.id_ingrediente ?? item.ingrediente_id ?? item.id);
                        const unidade = extrairUnidadeTexto(item.unidade_medida)
                            || extrairUnidadeTexto(item.unidade)
                            || unidadesPorIngrediente.get(idIngrediente)
                            || mapearUnidadeMedida(item.id_unidade_medida);
                        const quantidadeBase = String(item.quantidade ?? '').trim();
                        const quantidadeFormatada = quantidadeBase && unidade && !quantidadeBase.toLowerCase().endsWith(unidade.toLowerCase())
                            ? `${quantidadeBase} ${unidade}`
                            : (quantidadeBase || (unidade ? `1 ${unidade}` : '1'));

                        return {
                            id: Number(item.id),
                            receitaId: rec.id,
                            nome: nomeItem,
                            quantidade: quantidadeFormatada,
                            unidade,
                            id_unidade_medida: item.id_unidade_medida ? Number(item.id_unidade_medida) : null,
                            categoria: classif.categoria,
                            icone: classif.icone,
                            comprado,
                            receitaOrigem: rec.titulo,
                            ehManual: false
                        };
                    });
                } catch (erroItens) {
                    if (erroItens?.status === 404) return [];
                    throw erroItens;
                }
            })
        );

        itensLista.value = [...gruposDeItens.flat(), ...manuaisLocais];
    } catch (erro) {
        if (erro?.status === 401) {
            router.replace('/login');
            return;
        }
        erroApi.value = erro.message || 'Erro ao carregar sua lista de compras.';
        itensLista.value = [...manuaisLocais];
    } finally {
        carregandoLista.value = false;
    }
};

onMounted(carregarListaCompras);

const validarQuantidade = () => {
    if (novaQuantidade.value > 1000) novaQuantidade.value = 1000;
    if (novaQuantidade.value < 1) novaQuantidade.value = 1;
    erroQtd.value = false;
};

const receitasVinculadasAtivas = computed(() => {
    const idsComIngredientes = new Set(itensLista.value.map(i => i.receitaId).filter(id => id !== null));
    return receitasVinculadas.value.filter(rec => idsComIngredientes.has(rec.id));
});

const totalComprados = computed(() => itensLista.value.filter(i => i.comprado).length);
const itensPendentesCount = computed(() => itensLista.value.filter(i => !i.comprado).length);

const progressoPorcentagem = computed(() => {
    if (itensLista.value.length === 0) return 0;
    return (totalComprados.value / itensLista.value.length) * 100;
});

const mensagemEstadoVazio = computed(() => {
    if (abaFiltro.value === 'comprados') return 'Nenhum item comprado ainda';
    if (abaFiltro.value === 'pendentes') return 'Nenhum item pendente';
    return 'Nenhum item na sua lista de compra';
});

const itensFiltrados = computed(() => {
    let resultado = itensLista.value;

    if (abaFiltro.value === 'pendentes') {
        resultado = resultado.filter(i => !i.comprado);
    } else if (abaFiltro.value === 'comprados') {
        resultado = resultado.filter(i => i.comprado);
    }

    if (receitaSelecionadaId.value !== null) {
        resultado = resultado.filter(i => i.receitaId === receitaSelecionadaId.value);
    }

    return resultado;
});

const itensAgrupadosPorCategoria = computed(() => {
    const grupos = {};
    itensFiltrados.value.forEach(item => {
        if (!grupos[item.categoria]) {
            grupos[item.categoria] = {
                categoria: item.categoria,
                icone: item.icone,
                itens: []
            };
        }
        grupos[item.categoria].itens.push(item);
    });
    return Object.values(grupos);
});

const selecionarExibirTudo = () => {
    receitaSelecionadaId.value = null;
    cliqueContadorReceita.value = {};
};

const clicarReceitaTopo = (rec) => {
    const id = rec.id;
    
    if (receitaSelecionadaId.value === id) {
        cliqueContadorReceita.value[id] = (cliqueContadorReceita.value[id] || 1) + 1;
        if (cliqueContadorReceita.value[id] >= 2) {
            router.push({ name: 'receita', params: { id } });
            return;
        }
    } else {
        for (const key in cliqueContadorReceita.value) {
            cliqueContadorReceita.value[key] = 0;
        }
        receitaSelecionadaId.value = id;
        cliqueContadorReceita.value[id] = 1;
    }
};

const toggleComprado = async (item) => {
    if (atualizandoIds[item.id]) return;

    const estadoAnterior = item.comprado;
    const novoEstado = !estadoAnterior;
    item.comprado = novoEstado;

    if (item.ehManual) {
        salvarItensManuaisLocais();
        return;
    }

    erroApi.value = '';
    atualizandoIds[item.id] = true;

    try {
        await putItemListaCompras(item.id, {
            id_status: novoEstado ? 1 : 2
        });
    } catch (erro) {
        item.comprado = estadoAnterior;
        erroApi.value = erro.message || 'Erro ao atualizar o status do item.';
    } finally {
        delete atualizandoIds[item.id];
    }
};

const adicionarItemManual = () => {
    erroNome.value = !novoItemNome.value.trim();
    erroUnidade.value = !novaUnidadeMedidaId.value;
    erroQtd.value = !novaQuantidade.value;

    if (erroNome.value || erroUnidade.value || erroQtd.value) return;

    const unidadeSelecionada = UNIDADES_MEDIDA.find(
        u => u.id === Number(novaUnidadeMedidaId.value)
    );
    const nomeUnidade = unidadeSelecionada ? unidadeSelecionada.nome : '';
    const qtdStr = `${novaQuantidade.value} ${nomeUnidade}`.trim();
    const classif = classificarCategoria(novoItemNome.value);

    itensLista.value.push({
        id: `manual-${Date.now()}`,
        receitaId: null,
        nome: novoItemNome.value.trim(),
        quantidade: qtdStr,
        id_unidade_medida: unidadeSelecionada ? unidadeSelecionada.id : null,
        categoria: classif.categoria,
        icone: classif.icone,
        comprado: false,
        receitaOrigem: 'Adicionado manualmente',
        ehManual: true
    });

    salvarItensManuaisLocais();

    novoItemNome.value = '';
    novaQuantidade.value = '';
    novaUnidadeMedidaId.value = '';
};

const removerItem = async (item) => {
    if (!item || removendoIds[item.id]) return;

    erroApi.value = '';
    removendoIds[item.id] = true;

    try {
        if (!item.ehManual) {
            await deleteItemListaCompras(item.id);
        }

        itensLista.value = itensLista.value.filter(i => i.id !== item.id);

        if (item.ehManual) {
            salvarItensManuaisLocais();
        }

        if (item.receitaId) {
            const aindaTem = itensLista.value.some(i => i.receitaId === item.receitaId);
            if (!aindaTem && receitaSelecionadaId.value === item.receitaId) {
                receitaSelecionadaId.value = null;
            }
        }
    } catch (erro) {
        erroApi.value = erro.message || 'Erro ao remover o item da lista de compras.';
    } finally {
        delete removendoIds[item.id];
    }
};

const limparListaCompleta = async () => {
    if (itensLista.value.length === 0 || limpandoLista.value) return;

    erroApi.value = '';
    limpandoLista.value = true;

    try {
        await deleteTodosListaCompras();

        itensLista.value = [];
        receitasVinculadas.value = [];
        receitaSelecionadaId.value = null;
        cliqueContadorReceita.value = {};
        localStorage.removeItem(STORAGE_MANUAIS_KEY);
    } catch (erro) {
        erroApi.value = erro.message || 'Erro ao limpar a lista de compras.';
        await carregarListaCompras();
    } finally {
        limpandoLista.value = false;
    }
};

const copiarListaCompleta = () => {
    if (itensLista.value.length === 0) return;

    let textoFormatado = '🛒 *Minha Lista de Compras - Entre Panelas*\n\n';
    
    const grupos = {};
    itensLista.value.forEach(item => {
        if (!grupos[item.categoria]) grupos[item.categoria] = [];
        grupos[item.categoria].push(item);
    });

    for (const [cat, itens] of Object.entries(grupos)) {
        textoFormatado += `📁 *${cat.toUpperCase()}*\n`;
        itens.forEach(i => {
            const status = i.comprado ? '✅' : '⭕';
            textoFormatado += `${status} ${i.nome} - ${i.quantidade}\n`;
        });
        textoFormatado += '\n';
    }

    navigator.clipboard.writeText(textoFormatado).then(() => {
        mensagemCopiado.value = true;
        setTimeout(() => {
            mensagemCopiado.value = false;
        }, 2500);
    }).catch(err => {
        console.error('Erro ao copiar', err);
    });
};

const irParaBuscarReceita = () => { router.push('/buscar-receita'); };
const irParaChefinho = () => { router.push('/chefinho'); };
</script>

<style scoped>
.corpo {
    display: flex;
    width: 100%;
    min-height: 100vh;
    background-color: var(--cinza-claro);
}

.coluna {
    width: calc(100% - 200px);
    margin-left: 200px;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.conteudo {
    flex-direction: column;
    flex: 1;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    box-sizing: border-box;
}

.lista-container {
    width: 100%;
    max-width: 1100px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-self: center;
    padding: 24px 20px 60px 20px;
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

header.header-normal {
    position: relative;
    background-color: white;
    border-bottom: 1px solid var(--bege);
    padding: 15px 20px;
    width: 100%;
    box-sizing: border-box;
}

.header-topo-lista {
    display: flex;
    align-items: center;
    gap: 16px;
}

.back-btn {
    background-color: transparent;
    border: none;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--marrom);
}

.header-titles {
    flex: 1;
}

.title-with-icon {
    display: flex;
    align-items: center;
    gap: 3px;
}

.cart-emoji {
    width: 35px;
}

.header-titles h2 {
    font-family: "Inter", sans-serif;
    font-size: 24px;
    color: var(--marrom);
    margin: 0;
    font-weight: 600;
}

.header-titles p {
    font-size: 12px;
    color: var(--cinza);
    margin: 2px 0 0 0;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
}

.copiar-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
}

.feedback-copiado {
    font-size: 12px;
    font-weight: 600;
    color: var(--verde-escuro);
    white-space: nowrap;
}

.icon-action-btn {
    background: #FFFFFF;
    border: 1px solid var(--bege);
    border-radius: 50%;
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--marrom);
    transition: 0.3s;
}

.icon-action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.icon-action-btn.delete:hover:not(:disabled) {
    background-color: var(--vermelho);
    color: white;
    border-color: var(--vermelho);
}

.icon-action-btn.copie:hover:not(:disabled) {
    background-color: var(--verde);
    color: white;
    border-color: var(--verde-escuro);
}

.progress-bar-container {
    margin-top: 20px;
    width: 100%;
    height: 6px;
    background-color: var(--bege);
    border-radius: 3px;
    overflow: hidden;
}

.progress-bar-fill {
    height: 100%;
    background-color: var(--verde);
    transition: width 0.3s ease;
}

.chips-receitas-row {
    display: flex;
    align-items: center;
    gap: 10px;
    overflow-x: auto;
    padding-bottom: 4px;
    scrollbar-width: none;
}

.exibir-tudo-btn {
    background: #FFFFFF;
    border: 1px solid var(--bege);
    color: var(--cinza);
    white-space: nowrap;
}

.exibir-tudo-btn.active {
    background-color: var(--marrom);
    color: #FFFFFF;
    border-color: var(--marrom);
}

.recipe-chip-item {
    background-color: #FFFFFF;
    border: 1px solid var(--bege);
    border-radius: 20px;
    padding: 6px 14px 6px 6px;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s;
}

.recipe-chip-item.active {
    border-color: var(--verde);
    background-color: rgba(114, 188, 165, 0.1);
}

.recipe-chip-img {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    object-fit: cover;
}

.recipe-chip-name {
    font-size: 12px;
    font-weight: 600;
    color: var(--marrom);
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
}

.add-recipe-chip-btn {
    background: none;
    border: 1px dashed var(--verde);
    color: var(--verde-escuro);
    padding: 10px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
}

.tabs-filter-row {
    display: flex;
    gap: 10px;
}

.tab-pill {
    background: #FFFFFF;
    border: 1px solid var(--bege);
    border-radius: 20px;
    padding: 8px 18px;
    font-size: 13px;
    font-weight: 600;
    color: var(--cinza);
    cursor: pointer;
    transition: all 0.2s;
}

.tab-pill.active {
    background-color: var(--marrom);
    color: #FFFFFF;
    border-color: var(--marrom);
}

.add-manual-row {
    display: flex;
    gap: 10px;
}

.add-manual-row input[type="text"] {
    flex: 2;
    padding: 12px 16px;
    border: 1px solid var(--bege);
    border-radius: 12px;
    background-color: #FFFFFF;
    font-size: 14px;
    color: var(--marrom);
    outline: none;
}

.select-wrapper {
    flex: 1;
    position: relative;
    border: 1px solid var(--bege);
    border-radius: 12px;
    background-color: #FFFFFF;
    display: flex;
    align-items: center;
}

.select-field {
    width: 100%;
    padding: 12px 36px 12px 16px;
    border: none;
    background: transparent;
    font-size: 14px;
    color: var(--marrom);
    outline: none;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
}

.select-wrapper::after {
    content: "▼";
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--marrom);
    font-size: 10px;
    pointer-events: none;
}

.add-manual-row input[type="number"] {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid var(--bege);
    border-radius: 12px;
    background-color: #FFFFFF;
    font-size: 14px;
    color: var(--marrom);
    outline: none;
}

.input-erro {
    border-color: var(--vermelho) !important;
}

.add-manual-btn {
    background-color: var(--verde);
    color: #FFFFFF;
    border: none;
    border-radius: 12px;
    width: 44px;
    height: 44px;
    font-size: 22px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.categorias-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.categoria-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.categoria-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 700;
    color: var(--cinza);
}

.cat-count {
    font-weight: 400;
}

.itens-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.item-card {
    background-color: #FFFFFF;
    border: 1px solid var(--bege);
    border-radius: 14px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: background-color 0.2s;
}

.item-card.comprado {
    background-color: #FCFBF9;
    opacity: 0.75;
}

.item-left {
    display: flex;
    align-items: center;
    gap: 14px;
    cursor: pointer;
    flex: 1;
}

.checkbox-custom {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 2px solid var(--bege);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.checkbox-custom.checked {
    background-color: var(--verde);
    border-color: var(--verde);
    color: #FFFFFF;
}

.item-textos {
    display: flex;
    flex-direction: column;
}

.item-nome {
    font-size: 14px;
    font-weight: 600;
    color: var(--marrom);
}

.item-unidade {
    font-size: 12px;
    font-weight: 500;
    color: var(--cinza);
}

.item-nome.riscado {
    text-decoration: line-through;
    color: var(--cinza);
}

.item-receita-origem {
    font-size: 11px;
    color: var(--cinza);
}

.item-right {
    display: flex;
    align-items: center;
    gap: 12px;
}

.item-quantidade {
    font-size: 12px;
    font-weight: 700;
    color: var(--verde-escuro);
    background-color: rgba(114, 188, 165, 0.15);
    padding: 4px 10px;
    border-radius: 8px;
}

.remove-item-btn {
    background: none;
    border: none;
    color: var(--cinza);
    font-size: 18px;
    cursor: pointer;
}

.remove-item-btn:hover:not(:disabled) {
    color: var(--vermelho);
}

.remove-item-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}

.empty-state-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 50px 20px;
    gap: 12px;
}

.empty-title {
    font-family: "Playfair Display", serif;
    font-size: 20px;
    color: var(--marrom);
    margin: 0;
    font-weight: 700;
}

.empty-desc {
    font-size: 13px;
    color: var(--cinza);
    margin: 0;
}

.btn-acao-vazio {
    background-color: var(--verde);
    color: #FFFFFF;
    border: none;
    border-radius: 20px;
    padding: 10px 24px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 10px;
}

.banner-chefinho {
    background-color: #fcecdb;
    border-radius: 16px;
    padding: 14px 18px;
    display: flex;
    align-items: center;
    gap: 14px;
    cursor: pointer;
    margin-top: 20px;
}

.chefinho-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
}

.chefinho-avatar img {
    width: 35px;
}

.chefinho-text h5 {
    font-size: 13px;
    font-weight: 700;
    color: var(--marrom);
    margin: 0;
}

.chefinho-text p {
    font-size: 11px;
    color: var(--cinza);
    margin: 2px 0 0 0;
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

    header.header-normal {
        padding: 12px 16px;
        background-color: transparent;
        border: none;
    }

    .progress-bar-container {
        margin-top: 14px;
        height: 6px;
    }

    .lista-container {
        padding: 16px 12px 40px 12px;
        gap: 16px;
    }

    .add-manual-row {
        gap: 8px;
    }

    .add-manual-row input[type="text"],
    .add-manual-row input[type="number"] {
        min-width: 0;
        padding: 10px 12px;
        font-size: 13px;
    }

    .select-wrapper {
        min-width: 0;
    }

    .select-field {
        font-size: 13px;
        padding: 10px 28px 10px 12px;
    }

    .add-manual-btn {
        width: 40px;
        height: 40px;
        flex-shrink: 0;
    }

    .item-card {
        padding: 10px 12px;
    }

    .none {
        display: none;
    }
}

@media (max-width: 480px) {
    .corpo,
    .coluna,
    .conteudo {
        background-color: #fcfaf6;
    }

    header.header-normal {
        padding: 14px 16px 8px 16px;
        background-color: #ffffff;
        border-bottom: 1px solid #efeae1;
    }

    .header-topo-lista.none {
        display: flex !important;
        align-items: center;
        gap: 12px;
    }

    .cart-emoji {
        display: none;
    }

    .header-titles h2 {
        font-size: 18px;
        font-weight: 700;
        color: #4a2512;
    }

    .header-titles p {
        font-size: 11px;
        color: #8c827a;
    }

    .header-actions {
        gap: 8px;
    }

    .icon-action-btn.copie {
        background-color: #ffffff;
        border: 1px solid #efeae1;
        color: #4a2512;
        width: 36px;
        height: 36px;
    }

    .icon-action-btn.delete {
        background-color: #dc2626;
        border: none;
        color: #ffffff;
        width: 36px;
        height: 36px;
    }

    .progress-bar-container {
        margin-top: 12px;
        height: 6px;
        background-color: #fce8c7;
        border-radius: 4px;
    }

    .progress-bar-fill {
        background-color: #72bca5;
        border-radius: 4px;
    }

    .lista-container {
        padding: 14px 16px 80px 16px;
        gap: 14px;
        background-color: #fcfaf6;
    }

    .chips-receitas-row {
        gap: 8px;
    }

    .exibir-tudo-btn {
        display: none;
    }

    .recipe-chip-item {
        background-color: #ffffff;
        border: 1px solid #f5cda7;
        border-radius: 20px;
        padding: 4px 12px 4px 4px;
    }

    .add-recipe-chip-btn {
        border: 1.5px dashed #a3dac9;
        background-color: #f0f9f6;
        color: #52ab8b;
        border-radius: 20px;
        padding: 6px 14px;
    }

    .tabs-filter-row {
        gap: 8px;
    }

    .tab-pill {
        background-color: #ffffff;
        border: 1px solid #efeae1;
        color: #6e655f;
        padding: 6px 14px;
        font-size: 12px;
        border-radius: 20px;
    }

    .tab-pill.active {
        background-color: #4a2512;
        color: #ffffff;
        border-color: #4a2512;
    }

    .add-manual-row {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 8px;
    }

    .add-manual-row input[type="text"] {
        grid-column: 1 / -1;
        background-color: #ffffff;
        border: 1px solid #efeae1;
        border-radius: 12px;
        padding: 12px 14px;
        font-size: 13px;
    }

    .select-wrapper {
        grid-column: 1 / -1;
        background-color: #ffffff;
        border: 1px solid #efeae1;
        border-radius: 12px;
    }

    .select-field {
        padding: 12px 36px 12px 14px;
        font-size: 13px;
        color: #4a2512;
    }

    .add-manual-row input[type="number"] {
        grid-column: 1;
        background-color: #ffffff;
        border: 1px solid #efeae1;
        border-radius: 12px;
        padding: 12px 14px;
        font-size: 13px;
    }

    .add-manual-btn {
        grid-column: 2;
        width: 44px;
        height: 44px;
        border-radius: 12px;
        background-color: #72bca5;
    }

    .categorias-container {
        gap: 16px;
    }

    .categoria-header {
        font-size: 11px;
        color: #8c827a;
    }

    .cat-titulo {
        font-weight: 700;
        color: #6e655f;
    }

    .cat-count {
        color: #a89f91;
    }

    .item-card {
        background-color: #ffffff;
        border: 1px solid #efeae1;
        border-radius: 14px;
        padding: 10px 14px;
    }

    .item-card.comprado {
        background-color: #ffffff;
        opacity: 0.6;
    }

    .checkbox-custom {
        width: 20px;
        height: 20px;
        border: 1.5px solid #dcd4c8;
    }

    .checkbox-custom.checked {
        background-color: #72bca5;
        border-color: #72bca5;
    }

    .item-nome {
        font-size: 13px;
        color: #4a2512;
    }

    .item-quantidade {
        font-size: 11px;
        background-color: #e3f4ed;
        color: #2e6f59;
        padding: 4px 8px;
        border-radius: 8px;
    }

    .remove-item-btn {
        color: #a89f91;
    }

    .banner-chefinho {
        background-color: #fcecdb;
        border-radius: 16px;
        padding: 12px 16px;
        margin-top: 10px;
    }

    .chefinho-text h5 {
        font-size: 12px;
        color: #4a2512;
    }

    .chefinho-text p {
        font-size: 10px;
        color: #6e655f;
    }
}
</style>