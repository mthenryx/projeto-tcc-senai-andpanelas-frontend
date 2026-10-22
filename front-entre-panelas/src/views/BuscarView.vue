<template>
    <div class="corpo">
        <BarraNavegacao />

        <div class="coluna">
            <header class="header-topo">
                <button class="back-btn" @click="voltarParaHome" aria-label="Voltar para a página inicial">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>
                <div class="header-titles">
                    <h2>Buscar Receita</h2>
                    <p>Diga o que tem e sugerimos receitas compatíveis</p>
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
                        <input type="text" v-model="termoBusca" placeholder="Buscar receitas, ingredientes..."
                            @keyup.enter="executarBusca" />
                    </div>

                    <div class="tabs-filter">
                        <button class="tab-pill" :class="{ active: abaAtiva === 'receitas' }"
                            @click="mudarAba('receitas')">
                            Receitas
                        </button>
                        <button class="tab-pill" :class="{ active: abaAtiva === 'ingredientes' }"
                            @click="mudarAba('ingredientes')">
                            Ingredientes
                        </button>
                        <button class="tab-pill" :class="{ active: abaAtiva === 'comunidades' }"
                            @click="mudarAba('comunidades')">
                            Comunidades
                        </button>
                    </div>

                    <div v-if="abaAtiva === 'receitas' && !semResultados" class="tab-content">
                        <section class="section-block">
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
                                    :style="{ backgroundColor: cat.bg }" @click="buscarPorCategoria(cat.id)">
                                    <span class="cat-icon">{{ cat.icon }}</span>
                                    <span class="cat-nome">{{ cat.nome }}</span>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div v-else-if="abaAtiva === 'ingredientes' && !semResultados" class="tab-content">
                        <section class="section-block">
                            <h3 class="section-label-bold">Quais ingredientes você procura na receita?</h3>

                            <div class="ingredient-inputs-row">
                                <input type="text" v-model="novoIngredienteNome" class="input-field flex-2"
                                    placeholder="Digite um ingrediente..." @keyup.enter="adicionarIngredienteInput" />

                                <select v-model="novoIngredienteMedida" class="input-field select-field flex-2">
                                    <option value="" disabled selected>Selecione a medida</option>
                                    <option v-for="medida in unidadesMedidaSimuladas" :key="medida" :value="medida">
                                        {{ medida }}
                                    </option>
                                </select>

                                <input type="number" v-model.number="novoIngredienteQtd" class="input-field flex-1"
                                    placeholder="Qtd." min="0.01" max="9999.99" step="0.01"
                                    @input="validarQuantidade" />

                                <button class="add-ing-btn" @click="adicionarIngredienteInput" aria-label="Adicionar">
                                    {{ editandoIndex !== null ? '✓' : '+' }}
                                </button>
                            </div>

                            <p class="subtext">Toque para adicionar rapidamente:</p>
                            <div class="chips-row wrap">
                                <button v-for="ing in ingredientesRapidos" :key="ing" class="chip-btn light"
                                    @click="adicionarIngredienteRapido(ing)">
                                    + {{ ing }}
                                </button>
                            </div>

                            <div v-if="ingredientesSelecionados.length > 0" class="selected-ingredients-block">
                                <div class="selected-header">
                                    <span>Na geladeira ({{ ingredientesSelecionados.length }}) <small
                                            class="edit-hint">(Clique para editar)</small></span>
                                    <button class="clear-btn" @click="limparIngredientes">Limpar tudo</button>
                                </div>
                                <div class="selected-chips-row">
                                    <div v-for="(item, index) in ingredientesSelecionados" :key="index"
                                        class="selected-chip" @click="carregarParaEdicao(index)">
                                        <span>{{ item.nome }} <template v-if="item.qtd">| {{ item.qtd }} {{ item.medida
                                                }}</template></span>
                                        <button class="remove-chip-btn"
                                            @click.stop="removerIngrediente(index)">×</button>
                                    </div>
                                </div>
                            </div>

                            <button class="action-submit-btn" @click="executarBuscaPorIngredientes">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                                <span>O que posso fazer?</span>
                            </button>
                        </section>
                    </div>

                    <div v-else-if="abaAtiva === 'comunidades' && !semResultados" class="tab-content">
                        <div class="communities-list">
                            <div v-for="com in comunidades" :key="com.id" class="community-card"
                                @click="abrirComunidade(com.id)">
                                <div class="com-icon-box">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                </div>
                                <div class="com-info">
                                    <h4>{{ com.nome }}</h4>
                                    <p>{{ com.membros }} membros · {{ com.receitas }} receitas</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-else class="empty-state-container">
                        <h3 class="empty-title">Nenhum item Encontrado</h3>
                        <p class="empty-desc">
                            De acordo com a sua pesquisa não conseguimos encontrar uma receita compatível!
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BarraNavegacao from '@/components/BarraNavegacao.vue';

const router = useRouter();

const termoBusca = ref('');
const abaAtiva = ref('receitas');
const semResultados = ref(false);

const novoIngredienteNome = ref('');
const novoIngredienteMedida = ref('');
const novoIngredienteQtd = ref('');
const editandoIndex = ref(null);

const unidadesMedidaSimuladas = ref([
    'g', 'kg', 'ml', 'L', 'unidade(s)', 'col. de sopa', 'col. de chá', 'xícara(s)', 'pitada', 'dente(s)'
]);

const ingredientesSelecionados = ref([
    { nome: 'queijo', qtd: '150', medida: 'g' }
]);

const emAlta = ref(['frango', 'bolo', 'vegano', 'rápido', 'massa', 'sopa']);

const categorias = ref([
    { id: 'cafe', nome: 'Café da manhã', icon: '☕', bg: '#FCECDA' },
    { id: 'almoco', nome: 'Almoço', icon: '🥗', bg: '#E3F4ED' },
    { id: 'jantar', nome: 'Jantar', icon: '🌙', bg: '#EFEBE8' },
    { id: 'sobremesa', nome: 'Sobremesa', icon: '🍰', bg: '#FDE69E' },
    { id: 'vegano', nome: 'Vegano', icon: '🌱', bg: '#E3F4ED' },
    { id: 'rapido', nome: 'Rápido', icon: '⚡', bg: '#FDE0E0' }
]);

const ingredientesRapidos = ref([
    'frango', 'ovo', 'queijo', 'tomate', 'cebola', 'alho',
    'arroz', 'feijão', 'batata', 'cenoura', 'leite', 'manteiga',
    'farinha', 'açúcar', 'azeite', 'pimentão', 'carne moída',
    'creme de leite', 'milho', 'ervilha', 'manjericão', 'pimenta',
    'limão', 'sal', 'pimenta-do-reino', 'margarina', 'aveia', 'mel'
]);

const comunidades = ref([
    { id: 1, nome: 'Cozinha Brasileira', membros: '12.4k', receitas: '3.2k' },
    { id: 2, nome: 'Veganos Criativos', membros: '12.4k', receitas: '3.2k' },
    { id: 3, nome: 'Bolos & Confeitaria', membros: '12.4k', receitas: '3.2k' },
    { id: 4, nome: 'Fitness & Saúde', membros: '12.4k', receitas: '3.2k' }
]);

const mudarAba = (aba) => {
    abaAtiva.value = aba;
    semResultados.value = false;
};

const voltarParaHome = () => {
    router.push('/home');
};

const irParaGeladeira = () => {
    router.push('/geladeira');
};

const irParaChefinho = () => {
    router.push('/chefinho');
};

const buscarPorTermo = (termo) => {
    termoBusca.value = termo;
    executarBusca();
};

const buscarPorCategoria = (catId) => {
    console.log('Buscar receitas da categoria:', catId);
};

const executarBusca = () => {
    if (!termoBusca.value.trim()) return;
    if (termoBusca.value.toLowerCase() === 'teste') {
        semResultados.value = true;
    } else {
        semResultados.value = false;
    }
};

const resetarBusca = () => {
    termoBusca.value = '';
    semResultados.value = false;
};

const validarQuantidade = () => {
    if (novoIngredienteQtd.value !== '' && novoIngredienteQtd.value !== null) {
        let val = parseFloat(novoIngredienteQtd.value);
        if (val < 0) novoIngredienteQtd.value = 0.01;
        if (val > 9999.99) novoIngredienteQtd.value = 9999.99;

        const partes = novoIngredienteQtd.value.toString().split('.');
        if (partes[1] && partes[1].length > 2) {
            novoIngredienteQtd.value = parseFloat(val.toFixed(2));
        }
    }
};

const adicionarIngredienteRapido = (nome) => {
    if (!ingredientesSelecionados.value.some(i => i.nome === nome)) {
        ingredientesSelecionados.value.push({ nome, qtd: '1', medida: 'unidade(s)' });
    }
};

const adicionarIngredienteInput = () => {
    if (!novoIngredienteNome.value.trim()) return;

    const itemData = {
        nome: novoIngredienteNome.value.trim(),
        qtd: novoIngredienteQtd.value ? novoIngredienteQtd.value.toString() : '',
        medida: novoIngredienteMedida.value || ''
    };

    if (editandoIndex.value !== null) {
        ingredientesSelecionados.value[editandoIndex.value] = itemData;
        editandoIndex.value = null;
    } else {
        ingredientesSelecionados.value.push(itemData);
    }

    novoIngredienteNome.value = '';
    novoIngredienteMedida.value = '';
    novoIngredienteQtd.value = '';
};

const carregarParaEdicao = (index) => {
    const item = ingredientesSelecionados.value[index];
    novoIngredienteNome.value = item.nome;
    novoIngredienteQtd.value = item.qtd;
    novoIngredienteMedida.value = item.medida;
    editandoIndex.value = index;
};

const removerIngrediente = (index) => {
    ingredientesSelecionados.value.splice(index, 1);
    if (editandoIndex.value === index) {
        editandoIndex.value = null;
        novoIngredienteNome.value = '';
        novoIngredienteQtd.value = '';
        novoIngredienteMedida.value = '';
    }
};

const limparIngredientes = () => {
    ingredientesSelecionados.value = [];
    editandoIndex.value = null;
};

const executarBuscaPorIngredientes = () => {
    console.log('Buscando receitas com ingredientes:', ingredientesSelecionados.value);
};

const abrirComunidade = (id) => {
    console.log('Navegando para comunidade ID:', id);
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
    border-bottom: 1px solid var(--bege, #eae5df);
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
    max-width: 820px;
    display: flex;
    flex-direction: column;
    gap: 30px;
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
    padding: 14px 16px 14px 46px;
    border: 1px solid #EFEAE1;
    border-radius: 25px;
    background-color: #FFFFFF;
    font-size: 14px;
    color: var(--marrom);
    outline: none;
    box-sizing: border-box;
}

.search-input-wrapper input::placeholder {
    color: #A39B95;
}

.tabs-filter {
    display: flex;
    gap: 12px;
}

.tab-pill {
    background: none;
    border: none;
    font-size: 14px;
    font-weight: 600;
    color: var(--cinza);
    padding: 6px 18px;
    border-radius: 20px;
    cursor: pointer;
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
    gap: 30px;
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
    border: 1px solid #EFEAE1;
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
}

.chip-btn.light {
    background-color: #FAF8F5;
    border-color: #F0ECE6;
    color: #5C524A;
}

.chip-btn:hover {
    background-color: #F7F4EC;
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

.ingredient-inputs-row {
    display: flex;
    gap: 8px;
}

.input-field {
    padding: 12px 16px;
    border: 1px solid #EFEAE1;
    border-radius: 14px;
    background-color: #FFFFFF;
    font-size: 13px;
    outline: none;
    color: var(--marrom);
    box-sizing: border-box;
}

.select-field {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.36%22%20height%3D%22292.36%22%3E%3Cpath%20fill%3D%22%238C827A%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 10px auto;
    padding-right: 30px;
}

.input-field::placeholder {
    color: #A39B95;
}

.flex-2 {
    flex: 2;
}

.flex-1 {
    flex: 1;
    width: 20px;
}

.add-ing-btn {
    background-color: var(--verde);
    color: #FFFFFF;
    border: none;
    border-radius: 14px;
    min-width: 46px;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.subtext {
    font-size: 12px;
    color: var(--cinza);
    margin: 4px 0 0 0;
}

.selected-ingredients-block {
    display: flex;
    flex-direction: column;
    gap: 20px;
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

.selected-chips-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.selected-chip {
    background-color: #E3F4ED;
    color: var(--verde-escuro);
    padding: 6px 14px;
    border-radius: 16px;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.selected-chip:hover {
    background-color: #d1eee3;
}

.remove-chip-btn {
    background: none;
    border: none;
    color: var(--verde-escuro);
    font-size: 14px;
    cursor: pointer;
}

.action-submit-btn {
    background-color: var(--verde);
    color: #FFFFFF;
    border: none;
    border-radius: 14px;
    padding: 14px;
    font-size: 15px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    margin-top: 12px;
}

.communities-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.community-card {
    background-color: #FFFFFF;
    border: 1px solid #EFEAE1;
    border-radius: 16px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 16px;
    cursor: pointer;
}

.com-icon-box {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background-color: #E3F4ED;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--marrom);
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

.empty-state-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 40px 16px;
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
    margin-top: 40px;
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
    background-color: #E3F4ED;
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
</style>