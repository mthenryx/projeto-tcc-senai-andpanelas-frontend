<template>
    <div class="corpo">
        <BarraNavegacao />

        <div class="coluna">
            <div class="conteudo">
                <header class="header-normal">
                    <div class="header-topo-lista">
                        <button class="back-btn" @click="voltar" aria-label="Voltar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                <polyline points="12 19 5 12 12 5"></polyline>
                            </svg>
                        </button>
                        <div class="header-titles">
                            <div class="title-with-icon">
                                <img src="../../public/icon_carrinho_lista.png" alt="Carrinho de mercado" class="cart-emoji">
                                <h2>Lista de Compras</h2>
                            </div>
                            <p>{{ totalComprados }} de {{ itensLista.length }} itens comprados</p>
                        </div>
                        <div class="header-actions">
                            <div class="copiar-wrapper">
                                <span v-if="mensagemCopiado" class="feedback-copiado">Copiado com sucesso</span>
                                <button class="icon-action-btn copie" title="Copiar lista completa" @click="copiarListaCompleta">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                                        <polyline points="16 6 12 2 8 6"></polyline>
                                        <line x1="12" y1="2" x2="12" y2="15"></line>
                                    </svg>
                                </button>
                            </div>
                            <button class="icon-action-btn delete" title="Limpar lista" @click="limparListaCompleta">
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
                        >
                            <img :src="rec.imagemUrl" :alt="rec.titulo" class="recipe-chip-img" />
                            <span class="recipe-chip-name">{{ rec.titulo }}...</span>
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
                            <select v-model="novaUnidadeMedida" class="select-field" @change="erroUnidade = false">
                                <option disabled value="">Unidade medida</option>
                                <option v-for="unidade in unidadesMedidaSimuladas" :key="unidade" :value="unidade">
                                    {{ unidade }}
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

                    <div v-if="itensFiltrados.length > 0" class="categorias-container">
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
                                            <span class="item-nome" :class="{ 'riscado': item.comprado }">{{ item.nome }}</span>
                                            <span class="item-receita-origem" v-if="item.receitaOrigem">{{ item.receitaOrigem }}</span>
                                        </div>
                                    </div>

                                    <div class="item-right">
                                        <span class="item-quantidade">{{ item.quantidade }}</span>
                                        <button class="remove-item-btn" @click="removerItem(item.id)">×</button>
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
                            <img src="../../public/icon chefinho.png" alt="Chefinho IA" />
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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import BarraNavegacao from '@/components/BarraNavegacao.vue';

const router = useRouter();

const abaFiltro = ref('todos');
const receitaSelecionadaId = ref(null);
const cliqueContadorReceita = ref({});
const novoItemNome = ref('');
const novaQuantidade = ref('');
const novaUnidadeMedida = ref('');
const mensagemCopiado = ref(false);

const erroNome = ref(false);
const erroQtd = ref(false);
const erroUnidade = ref(false);

const unidadesMedidaSimuladas = ref([
    'g', 'kg', 'ml', 'l', 'unidades', 'col. de sopa', 'col. de chá', 'xícara', 'pitada', 'lata', 'maço'
]);

const receitasVinculadas = ref([
    { id: 101, titulo: 'Frango ao Limão', imagemUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200' },
    { id: 102, titulo: 'Bolo de Cenoura', imagemUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200' },
    { id: 103, titulo: 'Risoto de Cogumelos', imagemUrl: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=200' }
]);

const itensLista = ref([
    { id: 1, receitaId: 101, nome: 'Filé de frango', quantidade: '600g', categoria: 'Carnes', icone: '🥩', comprado: false, receitaOrigem: 'Frango ao Limão Siciliano' },
    { id: 2, receitaId: 101, nome: 'Limão siciliano', quantidade: '3 unidades', categoria: 'Frutas & Verduras', icone: '🥦', comprado: false, receitaOrigem: 'Frango ao Limão Siciliano' },
    { id: 3, receitaId: 102, nome: 'Cenoura', quantidade: '3 médias', categoria: 'Frutas & Verduras', icone: '🥦', comprado: false, receitaOrigem: 'Bolo de Cenoura com Brigadeiro' },
    { id: 4, receitaId: null, nome: 'Alho', quantidade: '1 cabeça', categoria: 'Frutas & Verduras', icone: '🥦', comprado: true, receitaOrigem: '' },
    { id: 5, receitaId: 101, nome: 'Tomilho fresco', quantidade: '2 ramos', categoria: 'Temperos & Ervas', icone: '🌿', comprado: false, receitaOrigem: 'Frango ao Limão Siciliano' },
    { id: 6, receitaId: null, nome: 'Azeite extra virgem', quantidade: '1 garrafa', categoria: 'Temperos & Ervas', icone: '🌿', comprado: false, receitaOrigem: '' },
    { id: 7, receitaId: 101, nome: 'Manteiga', quantidade: '2 col. de sopa', categoria: 'Laticínios', icone: '🧀', comprado: true, receitaOrigem: 'Frango ao Limão Siciliano' },
    { id: 8, receitaId: 102, nome: 'Leite condensado', quantidade: '2 latas', categoria: 'Mercearia', icone: '🛒', comprado: false, receitaOrigem: 'Bolo de Cenoura com Brigadeiro' }
]);

const classificarCategoria = (nomeIngrediente) => {
    const nome = (nomeIngrediente || '').toLowerCase();
    const carnes = ['frango', 'carne', 'filé', 'bife', 'porco', 'peixe', 'camarão', 'linguiça', 'presunto', ' bacon'];
    const hortifruti = ['limão', 'cenoura', 'alho', 'tomilho', 'cebola', 'batata', 'tomate', 'alface', 'banana', 'maçã', 'ervas', 'salsinha', 'cebolinha'];
    const temperos = ['azeite', 'sal', 'pimenta', 'orégano', 'cominho', 'colorau', 'tempero'];
    const laticinios = ['manteiga', 'leite', 'queijo', 'requeijão', 'creme de leite', 'iogurte'];

    if (carnes.some(c => nome.includes(c))) return { categoria: 'Carnes', icone: '🥩' };
    if (hortifruti.some(h => nome.includes(h))) return { categoria: 'Frutas & Verduras', icone: '🥦' };
    if (temperos.some(t => nome.includes(t))) return { categoria: 'Temperos & Ervas', icone: '🌿' };
    if (laticinios.some(l => nome.includes(l))) return { categoria: 'Laticínios', icone: '🧀' };
    return { categoria: 'Mercearia', icone: '🛒' };
};

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
            router.push({ name: 'ReceitaDetalhes', params: { id } });
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

const toggleComprado = (item) => {
    item.comprado = !item.comprado;
};

const adicionarItemManual = () => {
    erroNome.value = !novoItemNome.value.trim();
    erroUnidade.value = !novaUnidadeMedida.value;
    erroQtd.value = !novaQuantidade.value;

    if (erroNome.value || erroUnidade.value || erroQtd.value) return;

    const qtdStr = `${novaQuantidade.value} ${novaUnidadeMedida.value}`;
    const classif = classificarCategoria(novoItemNome.value);

    itensLista.value.push({
        id: Date.now(),
        receitaId: null,
        nome: novoItemNome.value.trim(),
        quantidade: qtdStr,
        categoria: classif.categoria,
        icone: classif.icone,
        comprado: false,
        receitaOrigem: 'Adicionado manualmente'
    });

    novoItemNome.value = '';
    novaQuantidade.value = '';
    novaUnidadeMedida.value = '';
};

const removerItem = (id) => {
    const itemRemovido = itensLista.value.find(i => i.id === id);
    itensLista.value = itensLista.value.filter(i => i.id !== id);

    if (itemRemovido && itemRemovido.receitaId) {
        const aindaTem = itensLista.value.some(i => i.receitaId === itemRemovido.receitaId);
        if (!aindaTem && receitaSelecionadaId.value === itemRemovido.receitaId) {
            receitaSelecionadaId.value = null;
        }
    }
};

const limparListaCompleta = () => {
    itensLista.value = [];
    receitaSelecionadaId.value = null;
    cliqueContadorReceita.value = {};
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

const voltar = () => { router.back(); };
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

.icon-action-btn.delete:hover {
    background-color: var(--vermelho);
    color: white;
    border-color: var(--vermelho);
}

.icon-action-btn.copie:hover {
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

.remove-item-btn:hover {
    color: var(--vermelho);
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
</style>