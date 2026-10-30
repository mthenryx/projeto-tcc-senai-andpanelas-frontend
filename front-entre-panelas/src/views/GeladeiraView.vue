<template>
    <div class="corpo">
        <BarraNavegacao />
        <div class="coluna">
            <header class="header-geladeira-fixo">
                <RouterLink to="/home">
                    <button class="botao-voltar" aria-label="Voltar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                            stroke-linejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                    </button>
                </RouterLink>
                <div class="textos-cabecalho">
                    <h1>
                        <img src="/icon_cubo_de_gelo.png" alt="Cubo de gelo" class="icone-cubo-gelo" />
                        Minha Geladeira
                    </h1>
                    <p>Diga o que tem e sugerimos receitas compatíveis</p>
                </div>
            </header>

            <div class="conteudo">
                <div class="geladeira-container">
                    
                    <div class="secao-adicionar-card">
                        <h2>O que tem na sua geladeira?</h2>
                        
                        <div class="formulario-ingrediente">
                            <div class="grupo-input flex-grow">
                                <input 
                                    type="text" 
                                    v-model="nomeInput" 
                                    placeholder="Digite um ingrediente..." 
                                    ref="inputNomeRef"
                                    @keyup.enter="salvarIngrediente"
                                />
                            </div>
                            <button class="botao-adicionar" @click="salvarIngrediente" :aria-label="editandoIndex !== null ? 'Salvar edição' : 'Adicionar ingrediente'">
                                <svg v-if="editandoIndex === null" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </button>
                        </div>

                        <div class="atralhos-rapidos">
                            <span class="rotulo-atalhos">Toque para adicionar rapidamente:</span>
                            <div class="chips-container">
                                <button 
                                    v-for="atalho in atalhosAlimentos" 
                                    :key="atalho.nome" 
                                    class="chip-alimento"
                                    @click="selecionarAtalho(atalho)"
                                >
                                    + {{ atalho.nome }}
                                </button>
                            </div>
                        </div>

                        <div v-if="ingredientesGeladeira.length > 0" class="lista-ativos-container">
                            <div class="cabecalho-ativos">
                                <span class="contador-geladeira">Na geladeira ({{ ingredientesGeladeira.length }})</span>
                                <button class="botao-limpar-tudo" @click="limparTudo">Limpar tudo</button>
                            </div>
                            <div class="chips-ativos-container">
                                <div v-for="(item, index) in ingredientesGeladeira" :key="index" class="chip-ativo" @click="iniciarEdicao(index)" title="Clique para editar">
                                    <span class="texto-chip-ativo">{{ item.nome }}</span>
                                    <button class="remover-chip" @click.stop="removerIngrediente(index)" aria-label="Remover">
                                        &times;
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button 
                            class="botao-acao-principal" 
                            :class="{ 'desativado': ingredientesGeladeira.length === 0 }"
                            :disabled="ingredientesGeladeira.length === 0"
                            @click="buscarReceitasCompativeis"
                        >
                            <img src="/iconPaginas/lupa_icon_cinza.png" alt="Lupa" class="icone-lupa-branco" />
                            <span>O que posso fazer?</span>
                        </button>
                    </div>

                    <div v-if="exibirResultados" class="secao-resultados">
                        <div class="aviso-compatibilidade-banner">
                            <img src="/icon_varinha_magica.png" alt="Varinha mágica" class="icone-varinha"/>
                            <div class="texto-aviso-compat">
                                <strong>Encontrei {{ receitasFiltradas.length }} receitas compatíveis!</strong>
                                <p>Com base nos {{ ingredientesGeladeira.length }} ingredientes informados</p>
                            </div>
                        </div>

                        <div class="filtros-refeicao-container">
                            <button 
                                class="botao-refeicao" 
                                :class="{ 'ativo': refeicaoAtiva === 'cafe' }"
                                @click="refeicaoAtiva = 'cafe'"
                            >
                                <img src="/icon_cafe.png" alt="Café" class="icone-refeicao" :style="{ filter: getIconRefeicaoFilter('cafe', refeicaoAtiva === 'cafe') }" />
                                <span>Café</span>
                            </button>

                            <button 
                                class="botao-refeicao" 
                                :class="{ 'ativo': refeicaoAtiva === 'almoco' }"
                                @click="refeicaoAtiva = 'almoco'"
                            >
                                <img src="/icon_almoco.png" alt="Almoço" class="icone-refeicao" :style="{ filter: getIconRefeicaoFilter('almoco', refeicaoAtiva === 'almoco') }" />
                                <span>Almoço</span>
                            </button>

                            <button 
                                class="botao-refeicao" 
                                :class="{ 'ativo': refeicaoAtiva === 'jantar' }"
                                @click="refeicaoAtiva = 'jantar'"
                            >
                                <img src="/icon_janta.png" alt="Jantar" class="icone-refeicao" :style="{ filter: getIconRefeicaoFilter('jantar', refeicaoAtiva === 'jantar') }" />
                                <span>Jantar</span>
                            </button>
                        </div>

                        <div class="lista-cards-receitas">
                            <div v-for="receita in receitasFiltradas" :key="receita.id" class="card-wrapper-com-compatibilidade">
                                <RecipeCard
                                    v-bind="receita"
                                    v-model:salvo="receita.salvo"
                                />
                                <div class="badge-compatibilidade-flutuante">
                                    {{ receita.compatibilidade }} compatível
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BarraNavegacao from '@/components/BarraNavegacao.vue'
import RecipeCard from '@/components/RecipeCard.vue'

const inputNomeRef = ref(null)
const nomeInput = ref('')
const editandoIndex = ref(null)

const ingredientesGeladeira = ref([])

const atalhosAlimentos = [
    { nome: 'frango' },
    { nome: 'ovo' },
    { nome: 'queijo' },
    { nome: 'tomate' },
    { nome: 'cebola' },
    { nome: 'alho' },
    { nome: 'arroz' },
    { nome: 'feijão' },
    { nome: 'batata' },
    { nome: 'cenoura' },
    { nome: 'leite' },
    { nome: 'manteiga' },
    { nome: 'farinha' },
    { nome: 'açúcar' },
    { nome: 'azeite' },
    { nome: 'pimentão' }
]

const exibirResultados = ref(false)
const refeicaoAtiva = ref('almoco')

const receitasSimuladas = ref([
    {
        id: 1,
        titulo: 'Frango ao Limão Siciliano',
        tempo: '40min',
        porcoes: '4 porções',
        custo: 'Econômico',
        curtidas: 342,
        comentarios: 28,
        autorNome: 'Ana Costa',
        authorIniciais: 'AC',
        dificuldade: 'Fácil',
        salvo: false,
        categoria: 'almoco',
        compatibilidade: '83%',
        imagemUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
    },
    {
        id: 2,
        titulo: 'Pão de Queijo Mineiro',
        tempo: '35min',
        porcoes: '3 porções',
        custo: 'Econômico',
        curtidas: 756,
        comentarios: 54,
        autorNome: 'Carlos Ferreira',
        authorIniciais: 'CF',
        dificuldade: 'Fácil',
        salvo: false,
        categoria: 'cafe',
        compatibilidade: '73%',
        imagemUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5'
    },
    {
        id: 3,
        titulo: 'Risoto de Cogumelos Porcini',
        tempo: '45min',
        porcoes: '2 porções',
        custo: 'Econômico',
        curtidas: 567,
        comentarios: 43,
        autorNome: 'Mariana Lima',
        authorIniciais: 'ML',
        dificuldade: 'Médio',
        salvo: false,
        categoria: 'jantar',
        compatibilidade: '73%',
        imagemUrl: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9'
    }
])

const receitasFiltradas = computed(() => {
    return receitasSimuladas.value.filter(r => r.categoria === refeicaoAtiva.value)
})

const salvarIngrediente = () => {
    if (!nomeInput.value.trim()) return
    
    if (editandoIndex.value !== null) {
        ingredientesGeladeira.value[editandoIndex.value].nome = nomeInput.value.trim()
        editandoIndex.value = null
    } else {
        ingredientesGeladeira.value.push({
            nome: nomeInput.value.trim()
        })
    }
    nomeInput.value = ''
}

const iniciarEdicao = (index) => {
    editandoIndex.value = index
    nomeInput.value = ingredientesGeladeira.value[index].nome
    if (inputNomeRef.value) {
        inputNomeRef.value.focus()
    }
}

const removerIngrediente = (index) => {
    if (editandoIndex.value === index) {
        editandoIndex.value = null
        nomeInput.value = ''
    }
    ingredientesGeladeira.value.splice(index, 1)
    if (ingredientesGeladeira.value.length === 0) {
        exibirResultados.value = false
    }
}

const limparTudo = () => {
    ingredientesGeladeira.value = []
    editandoIndex.value = null
    nomeInput.value = ''
    exibirResultados.value = false
}

const selecionarAtalho = (atalho) => {
    nomeInput.value = atalho.nome
    editandoIndex.value = null
    if (inputNomeRef.value) {
        inputNomeRef.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
        inputNomeRef.value.focus()
    }
}

const buscarReceitasCompativeis = () => {
    if (ingredientesGeladeira.value.length > 0) {
        exibirResultados.value = true
    }
}

const getIconRefeicaoFilter = (tipo, ativo) => {
    if (tipo === 'jantar') {
        return 'none'
    }
    if (ativo) {
        return 'brightness(0) saturate(100%) invert(100%)'
    }
    return 'none'
}
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
    background-color: var(--cinza-claro);
}

.header-geladeira-fixo {
    padding-left: 25px;
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: #FFFFFF;
    border-bottom: 1px solid var(--bege);
    height: 60px;
    display: flex;
    align-items: center;
    gap: 16px;
    width: 100%;
    box-sizing: border-box;
}

.conteudo {
    background-color: var(--cinza-claro);
    flex: 1;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    padding: 24px;
}

.geladeira-container {
    width: 100%;
    max-width: 1100px;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.botao-voltar {
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
    transition: background-color 0.2s;
    flex-shrink: 0;
}

.titulo-com-icone {
    display: flex;
    align-items: center;
    gap: 12px;
}

.caixa-icone-geladeira {
    width: 40px;
    height: 40px;
    background-color: rgba(114, 188, 165, 0.15);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icone-cubo-gelo {
    width: 22px;
    height: 22px;
    object-fit: contain;
    filter: brightness(0) saturate(100%) invert(64%) sepia(26%) saturate(1450%) hue-rotate(185deg) brightness(101%) contrast(93%);
}

.textos-cabecalho h1 {
    font-family: "Inter", sans-serif;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    color: var(--marrom);
    margin: 0;
    font-weight: 700;
}

.textos-cabecalho p {
    font-size: 13px;
    color: var(--cinza);
    margin: 2px 0 0 0;
}

.secao-adicionar-card {
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.secao-adicionar-card h2 {
    font-size: 16px;
    font-weight: 700;
    color: var(--marrom);
    margin: 0;
}

.formulario-ingrediente {
    display: flex;
    gap: 12px;
    align-items: center;
}

.grupo-input {
    background-color: #FFFFFF;
    border: 1px solid #E0D5C1;
    border-radius: 12px;
    padding: 12px 14px;
    display: flex;
    align-items: center;
}

.grupo-input.flex-grow {
    flex: 1;
}

.grupo-input input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-family: "Inter", sans-serif;
    font-size: 14px;
    color: var(--marrom);
}

.grupo-input input::placeholder {
    color: var(--cinza-branco);
}

.botao-adicionar {
    background-color: var(--verde);
    color: #FFFFFF;
    border: none;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.5s;
    flex-shrink: 0;
}

.botao-adicionar:hover {
    background-color: var(--verde-escuro);
}

.atralhos-rapidos {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.rotulo-atalhos {
    font-size: 12px;
    color: var(--cinza);
    margin-bottom: 10px;
}

.chips-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.chip-alimento {
    background-color: var(--cinza-claro);
    border: 1px solid #E0D5C1;
    color: var(--marrom);
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.chip-alimento:hover {
    background-color: rgba(114, 188, 165, 0.15);
    color: var(--verde-escuro);
    border-color: var(--verde);
}

.lista-ativos-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-top: 1px solid var(--bege);
    padding-top: 12px;
}

.cabecalho-ativos {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.contador-geladeira {
    font-size: 13px;
    font-weight: 600;
    color: var(--marrom);
}

.botao-limpar-tudo {
    background: none;
    border: none;
    color: var(--cinza);
    font-size: 12px;
    cursor: pointer;
}

.botao-limpar-tudo:hover {
    color: var(--vermelho);
}

.chips-ativos-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.chip-ativo {
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

.chip-ativo:hover {
    background-color: rgba(114, 188, 165, 0.25);
}

.texto-chip-ativo {
    text-transform: capitalize;
}

.remover-chip {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    color: var(--verde-escuro);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
}

.botao-acao-principal {
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

.botao-acao-principal:hover:not(:disabled) {
    background-color: var(--verde-escuro);
}

.botao-acao-principal.desativado {
    opacity: 0.45;
    cursor: not-allowed;
}

.icone-lupa-branco {
    width: 16px;
    height: 16px;
    object-fit: contain;
    filter: brightness(0) saturate(100%) invert(100%);
}

.secao-resultados {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.aviso-compatibilidade-banner {
    background-color: rgba(114, 188, 165, 0.15);
    border: 1px solid var(--verde);
    border-radius: 16px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 14px;
}

.icone-varinha {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: -15px;
    margin-right: -5px;
}

.icone-varinha img {
    width: 20px;
    height: 20px;
    object-fit: contain;
}

.texto-aviso-compat {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.texto-aviso-compat strong {
    font-size: 14px;
    color: var(--marrom);
}

.texto-aviso-compat p {
    font-size: 12px;
    color: var(--verde-escuro);
    margin: 0;
    font-weight: 600;
}

.filtros-refeicao-container {
    display: flex;
    padding: 4px;
    border-radius: 14px;
    gap: 4px;
}

.botao-refeicao {
    flex: 1;
    background: none;
    border: 1px solid #e0e0e0;
    background-color: white;
    padding: 10px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    color: var(--cinza);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.2s;
}

.botao-refeicao.ativo {
    background-color: var(--marrom);
    color: #FFFFFF;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.icone-refeicao {
    width: 16px;
    height: 16px;
    object-fit: contain;
}

.lista-cards-receitas {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.card-wrapper-com-compatibilidade {
    position: relative;
}

.badge-compatibilidade-flutuante {
    position: absolute;
    top: 26px;
    left: 26px;
    background-color: var(--verde);
    color: #FFFFFF;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    z-index: 2;
    pointer-events: none;
}
</style>