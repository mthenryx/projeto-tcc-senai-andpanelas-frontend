<template>
    <div class="corpo">
        <BarraNavegacao />
        <div class="coluna">
            <header class="header-geladeira-fixo none">
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

                        <div v-if="erroApi" class="aviso-erro-api">
                            {{ erroApi }}
                        </div>
                        
                        <div class="formulario-ingrediente">
                            <div class="grupo-input flex-grow">
                                <input 
                                    type="text" 
                                    v-model="nomeInput" 
                                    maxlength="35"
                                    :disabled="salvandoIngrediente"
                                    placeholder="Digite um ingrediente..." 
                                    ref="inputNomeRef"
                                    @keyup.enter="salvarIngrediente"
                                />
                            </div>
                            <button
                                class="botao-adicionar"
                                :disabled="salvandoIngrediente || !nomeInput.trim()"
                                @click="salvarIngrediente"
                                :aria-label="editandoIndex !== null ? 'Salvar edição' : 'Adicionar ingrediente'"
                            >
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

                        <div v-if="carregandoGeladeira" class="estado-info-texto">
                            Carregando ingredientes salvos...
                        </div>

                        <div v-else-if="ingredientesGeladeira.length === 0" class="estado-info-texto">
                            Não tem itens na sua geladeira
                        </div>

                        <div v-else-if="ingredientesGeladeira.length > 0" class="lista-ativos-container">
                            <div class="cabecalho-ativos">
                                <span class="contador-geladeira">Na geladeira ({{ ingredientesGeladeira.length }})</span>
                                <button class="botao-limpar-tudo" :disabled="limpandoTudo" @click="limparTudo">
                                    {{ limpandoTudo ? 'Limpando...' : 'Limpar tudo' }}
                                </button>
                            </div>
                            <div class="chips-ativos-container">
                                <div v-for="(item, index) in ingredientesGeladeira" :key="item.id || index" class="chip-ativo" @click="iniciarEdicao(index)" title="Clique para editar">
                                    <span class="texto-chip-ativo">{{ item.nome }}</span>
                                    <button
                                        class="remover-chip"
                                        :disabled="removendoIds[item.id]"
                                        @click.stop="removerIngrediente(index)"
                                        aria-label="Remover"
                                    >
                                        &times;
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button 
                            class="botao-acao-principal" 
                            :class="{ 'desativado': ingredientesGeladeira.length === 0 || buscandoReceitas }"
                            :disabled="ingredientesGeladeira.length === 0 || buscandoReceitas"
                            @click="buscarReceitasCompativeis"
                        >
                            <img src="/iconPaginas/lupa_icon_cinza.png" alt="Lupa" class="icone-lupa-branco" />
                            <span>{{ buscandoReceitas ? 'Buscando receitas...' : 'O que posso fazer?' }}</span>
                        </button>
                    </div>

                    <div v-if="exibirResultados" class="secao-resultados">
                        <div class="aviso-compatibilidade-banner">
                            <img src="/icon_varinha_magica.png" alt="Varinha mágica" class="icone-varinha"/>
                            <div class="texto-aviso-compat">
                                <strong>
                                    {{
                                        receitasCompativeis.length > 0
                                            ? `Encontrei ${receitasCompativeis.length} receitas compatíveis!`
                                            : 'Nenhuma receita compatível encontrada'
                                    }}
                                </strong>
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
                                <span>Café ({{ contagemPorRefeicao.cafe }})</span>
                            </button>

                            <button 
                                class="botao-refeicao" 
                                :class="{ 'ativo': refeicaoAtiva === 'almoco' }"
                                @click="refeicaoAtiva = 'almoco'"
                            >
                                <img src="/icon_almoco.png" alt="Almoço" class="icone-refeicao" :style="{ filter: getIconRefeicaoFilter('almoco', refeicaoAtiva === 'almoco') }" />
                                <span>Almoço ({{ contagemPorRefeicao.almoco }})</span>
                            </button>

                            <button 
                                class="botao-refeicao" 
                                :class="{ 'ativo': refeicaoAtiva === 'jantar' }"
                                @click="refeicaoAtiva = 'jantar'"
                            >
                                <img src="/icon_janta.png" alt="Jantar" class="icone-refeicao" :style="{ filter: getIconRefeicaoFilter('jantar', refeicaoAtiva === 'jantar') }" />
                                <span>Jantar ({{ contagemPorRefeicao.jantar }})</span>
                            </button>
                        </div>

                        <div v-if="receitasFiltradas.length > 0" class="lista-cards-receitas">
                            <div
                                v-for="receita in receitasFiltradas"
                                :key="receita.id"
                                class="card-wrapper-com-compatibilidade"
                                @click="irParaReceita(receita.id)"
                            >
                                <RecipeCard
                                    v-bind="receita"
                                    v-model:salvo="receita.salvo"
                                />
                            </div>
                        </div>

                        <div v-else class="estado-vazio-refeicao">
                            Nenhuma receita compatível encontrada para esta refeição com os ingredientes atuais.
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BarraNavegacao from '@/components/BarraNavegacao.vue'
import RecipeCard from '@/components/RecipeCard.vue'
import { authService } from '@/services/authService'
import {
    getListarGeladeira,
    postIngredienteGeladeira,
    deleteIngredienteGeladeira,
    getCompatibilidadeGeladeira
} from '@/services/geladeira'

const router = useRouter()
const BASE_URL = import.meta.env.VITE_API_URL

const inputNomeRef = ref(null)
const nomeInput = ref('')
const editandoIndex = ref(null)

const carregandoGeladeira = ref(false)
const salvandoIngrediente = ref(false)
const limpandoTudo = ref(false)
const buscandoReceitas = ref(false)
const removendoIds = reactive({})
const erroApi = ref('')

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
const receitasCompativeis = ref([])

const normalizarTexto = (texto) => {
    return String(texto || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
}

const extrairLista = (res) => {
    if (!res) return []
    if (Array.isArray(res)) return res
    if (Array.isArray(res?.response?.dados)) return res.response.dados
    if (Array.isArray(res?.response?.receitas)) return res.response.receitas
    if (Array.isArray(res?.response)) return res.response
    if (Array.isArray(res?.dados)) return res.dados
    return []
}

const normalizarIngredienteGeladeira = (item) => ({
    id: Number(item.id),
    nome: String(item.nome_ingrediente || item.nome || '').trim(),
    quantidade: item.quantidade ?? 1,
    id_unidade_medida: Number(item.id_unidade_medida || 5),
    unidade_medida: item.unidade_medida || 'un'
})

const carregarGeladeira = async () => {
    const token = authService.getToken?.()
    if (!token) {
        router.replace('/login')
        return
    }

    carregandoGeladeira.value = true
    erroApi.value = ''

    try {
        const res = await getListarGeladeira({ limite: 50 })
        ingredientesGeladeira.value = extrairLista(res)
            .map(normalizarIngredienteGeladeira)
            .filter(i => i.nome.length > 0)
    } catch (erro) {
        const msg = String(erro.message || '').toLowerCase()
        if (msg.includes('não autorizado') || msg.includes('autenticado')) {
            router.replace('/login')
            return
        }
        if (msg.includes('não encontrado') || msg.includes('não foram encontrados') || msg.includes('nenhum')) {
            ingredientesGeladeira.value = []
        } else {
            erroApi.value = erro.message || 'Erro ao carregar os ingredientes da geladeira.'
        }
    } finally {
        carregandoGeladeira.value = false
    }
}

onMounted(carregarGeladeira)

const mapearCusto = (idCusto) => {
    const mapa = { 1: 'Econômico', 2: 'Moderado', 3: 'Alto' }
    return mapa[Number(idCusto)] || 'Econômico'
}

const mapearDificuldade = (idDificuldade) => {
    const mapa = { 1: 'Fácil', 2: 'Médio', 3: 'Difícil' }
    return mapa[Number(idDificuldade)] || 'Fácil'
}

const formatarTempo = (tempo) => {
    if (!tempo) return '30min'
    if (typeof tempo === 'number') return `${tempo}min`
    const str = String(tempo)
    if (str.includes('min') || str.includes('h')) return str
    const partes = str.split(':').map(Number)
    if (partes.length >= 2 && !isNaN(partes[0]) && !isNaN(partes[1])) {
        const totalMin = (partes[0] * 60) + partes[1]
        return `${totalMin}min`
    }
    return str
}

const obterIniciais = (nome) => {
    if (!nome) return 'CH'
    const partes = nome.trim().split(' ')
    if (partes.length >= 2) {
        return (partes[0][0] + partes[1][0]).toUpperCase()
    }
    return partes[0].substring(0, 2).toUpperCase()
}

const buscarDetalhesReceitaPorId = async (id) => {
    try {
        const token = authService.getToken?.()
        const response = await fetch(`${BASE_URL}/receitas/${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        const data = await response.json().catch(() => null)
        const dados = data?.response?.dados || data?.response || data?.dados || null
        return Array.isArray(dados) ? dados[0] || null : dados
    } catch {
        return null
    }
}

const MAPA_CATEGORIA_REFEICAO = {
    'cafe da manha': ['cafe'],
    'almoco': ['almoco'],
    'janta': ['jantar'],
    'salada': ['almoco', 'jantar'],
    'sopa': ['almoco', 'jantar'],
    'sobremesa': ['almoco', 'jantar'],
    'lanche': ['cafe', 'jantar'],
    'bebida': ['cafe', 'almoco', 'jantar']
}

const classificarTiposRefeicao = (categoriasRaw) => {
    const lista = Array.isArray(categoriasRaw)
        ? categoriasRaw.map(c => typeof c === 'string' ? c : (c?.categoria || c?.nome || ''))
        : (typeof categoriasRaw === 'string' ? [categoriasRaw] : [])

    const tipos = new Set()

    lista.forEach((cat) => {
        const norm = normalizarTexto(cat)
        const chave = Object.keys(MAPA_CATEGORIA_REFEICAO).find(k => norm.includes(k))
        if (chave) MAPA_CATEGORIA_REFEICAO[chave].forEach(t => tipos.add(t))
    })

    return Array.from(tipos)
}

const normalizarReceitaCompativel = async (item) => {
    const recBase = item?.receita || item
    const id = Number(recBase?.id)

    let recCompleta = recBase
    const jaTemCategorias = Array.isArray(recBase?.categorias) && recBase.categorias.length > 0

    if (!jaTemCategorias && id) {
        const detalhes = await buscarDetalhesReceitaPorId(id)
        if (detalhes) {
            recCompleta = { ...recBase, ...detalhes }
        }
    }

    const autorNome = recCompleta?.usuario?.nome || recCompleta?.autor_nome || 'Chef'
    const porcaoNum = Number(recCompleta?.id_porcao || recCompleta?.porcoes || 1)
    const tiposRefeicao = classificarTiposRefeicao(recCompleta?.categorias || recCompleta?.categoria)
    const percentual = Math.round(Number(item?.compatibilidade_percentual ?? item?.compatibilidade ?? recCompleta?.compatibilidade_percentual ?? recCompleta?.compatibilidade ?? 0))

    return {
        id,
        titulo: recCompleta?.titulo || 'Receita',
        tempo: formatarTempo(recCompleta?.tempo),
        porcoes: `${porcaoNum} ${porcaoNum === 1 ? 'porção' : 'porções'}`,
        custo: mapearCusto(recCompleta?.id_custo),
        curtidas: Number(recCompleta?.qtd_curtidas ?? recCompleta?.qtd_curtida ?? 0),
        comentarios: Array.isArray(recCompleta?.comentarios)
            ? recCompleta.comentarios.length
            : Number(recCompleta?.qtd_comentarios ?? 0),
        autorNome,
        authorIniciais: obterIniciais(autorNome),
        dificuldade: mapearDificuldade(recCompleta?.id_dificuldade),
        salvo: Boolean(recCompleta?.salvo_pelo_usuario ?? recCompleta?.eh_salva_pelo_usuario ?? recCompleta?.salvo),
        tiposRefeicao,
        compatibilidade: `${percentual}%`,
        compatibilidadeValor: percentual,
        imagemUrl: recCompleta?.foto || recCompleta?.imagem_url || ''
    }
}

const contagemPorRefeicao = computed(() => ({
    cafe: receitasCompativeis.value.filter(r => r.tiposRefeicao.includes('cafe')).length,
    almoco: receitasCompativeis.value.filter(r => r.tiposRefeicao.includes('almoco')).length,
    jantar: receitasCompativeis.value.filter(r => r.tiposRefeicao.includes('jantar')).length
}))

const receitasFiltradas = computed(() => {
    return receitasCompativeis.value.filter(r => r.tiposRefeicao.includes(refeicaoAtiva.value))
})

const salvarIngrediente = async () => {
    const nomeLimpo = nomeInput.value.trim()
    if (!nomeLimpo || salvandoIngrediente.value) return

    erroApi.value = ''
    salvandoIngrediente.value = true

    try {
        if (editandoIndex.value !== null) {
            const itemAtual = ingredientesGeladeira.value[editandoIndex.value]
            if (itemAtual && normalizarTexto(itemAtual.nome) !== normalizarTexto(nomeLimpo)) {
                if (itemAtual.id) {
                    await deleteIngredienteGeladeira(itemAtual.id)
                }
                await postIngredienteGeladeira({ nome_ingrediente: nomeLimpo })
                await carregarGeladeira()
            }
            editandoIndex.value = null
            nomeInput.value = ''
            return
        }

        const jaExiste = ingredientesGeladeira.value.some(
            item => normalizarTexto(item.nome) === normalizarTexto(nomeLimpo)
        )
        if (jaExiste) {
            nomeInput.value = ''
            return
        }

        await postIngredienteGeladeira({ nome_ingrediente: nomeLimpo })
        nomeInput.value = ''
        await carregarGeladeira()
    } catch (erro) {
        erroApi.value = erro.message || 'Erro ao salvar ingrediente na geladeira.'
    } finally {
        salvandoIngrediente.value = false
    }
}

const iniciarEdicao = (index) => {
    editandoIndex.value = index
    nomeInput.value = ingredientesGeladeira.value[index].nome
    if (inputNomeRef.value) {
        inputNomeRef.value.focus()
    }
}

const removerIngrediente = async (index) => {
    const item = ingredientesGeladeira.value[index]
    if (!item || removendoIds[item.id]) return

    erroApi.value = ''
    removendoIds[item.id] = true

    try {
        if (item.id) {
            await deleteIngredienteGeladeira(item.id)
        }

        if (editandoIndex.value === index) {
            editandoIndex.value = null
            nomeInput.value = ''
        }

        ingredientesGeladeira.value.splice(index, 1)

        if (ingredientesGeladeira.value.length === 0) {
            exibirResultados.value = false
            receitasCompativeis.value = []
        }
    } catch (erro) {
        erroApi.value = erro.message || 'Erro ao remover ingrediente da geladeira.'
    } finally {
        delete removendoIds[item.id]
    }
}

const limparTudo = async () => {
    if (ingredientesGeladeira.value.length === 0 || limpandoTudo.value) return

    erroApi.value = ''
    limpandoTudo.value = true

    try {
        const itensComId = ingredientesGeladeira.value.filter(item => Boolean(item.id))
        await Promise.all(itensComId.map(item => deleteIngredienteGeladeira(item.id)))

        ingredientesGeladeira.value = []
        editandoIndex.value = null
        nomeInput.value = ''
        exibirResultados.value = false
        receitasCompativeis.value = []
    } catch (erro) {
        erroApi.value = erro.message || 'Erro ao limpar os ingredientes da geladeira.'
        await carregarGeladeira()
    } finally {
        limpandoTudo.value = false
    }
}

const selecionarAtalho = (atalho) => {
    nomeInput.value = atalho.nome
    editandoIndex.value = null
    if (inputNomeRef.value) {
        inputNomeRef.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
        inputNomeRef.value.focus()
    }
}

const buscarReceitasCompativeis = async () => {
    if (ingredientesGeladeira.value.length === 0 || buscandoReceitas.value) return

    erroApi.value = ''
    buscandoReceitas.value = true

    try {
        const res = await getCompatibilidadeGeladeira()
        const listaBruta = extrairLista(res)

        const normalizadas = await Promise.all(listaBruta.map(normalizarReceitaCompativel))
        normalizadas.sort((a, b) => b.compatibilidadeValor - a.compatibilidadeValor)

        receitasCompativeis.value = normalizadas
        exibirResultados.value = true

        // Seleciona automaticamente a primeira aba que possuir receitas se a atual estiver vazia
        const ordemAbas = ['almoco', 'cafe', 'jantar']
        if (!ordemAbas.some(aba => aba === refeicaoAtiva.value && normalizadas.some(r => r.tiposRefeicao.includes(aba)))) {
            const primeiraComReceita = ordemAbas.find(aba => normalizadas.some(r => r.tiposRefeicao.includes(aba)))
            if (primeiraComReceita) {
                refeicaoAtiva.value = primeiraComReceita
            }
        }
    } catch (erro) {
        erroApi.value = erro.message || 'Não foi possível buscar receitas compatíveis.'
    } finally {
        buscandoReceitas.value = false
    }
}

const irParaReceita = (id) => {
    if (id) {
        router.push({ name: 'receita', params: { id } })
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

.aviso-erro-api {
    background-color: #FDECEA;
    border: 1px solid #F5C2C7;
    color: #842029;
    padding: 10px 14px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 500;
}

.estado-info-texto {
    font-size: 13px;
    color: var(--cinza);
}

.estado-vazio-refeicao {
    background-color: #FFFFFF;
    border: 1px solid #EFEAE1;
    border-radius: 16px;
    padding: 28px 16px;
    text-align: center;
    font-size: 13px;
    color: var(--cinza);
    margin-bottom: 50px;
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
    padding: 0px 24px;
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

.botao-adicionar:hover:not(:disabled) {
    background-color: var(--verde-escuro);
}

.botao-adicionar:disabled {
    opacity: 0.55;
    cursor: not-allowed;
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

.botao-limpar-tudo:hover:not(:disabled) {
    color: var(--vermelho);
}

.botao-limpar-tudo:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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

.remover-chip:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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
    margin-bottom: 50px;
}

.card-wrapper-com-compatibilidade {
    position: relative;
    cursor: pointer;
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

    .header-geladeira-fixo {
        padding-left: 16px;
        padding-right: 16px;
    }

    .conteudo {
        padding: 16px 12px;
    }

    .geladeira-container {
        gap: 16px;
    }

    .secao-adicionar-card {
        padding: 16px;
    }

    .formulario-ingrediente {
        gap: 8px;
    }

    .grupo-input {
        padding: 10px 12px;
    }

    .botao-refeicao {
        font-size: 13px;
        padding: 8px;
    }

    .botao-acao-principal {
        padding: 12px;
    }

    .aviso-compatibilidade-banner {
        padding: 12px;
    }

    .textos-cabecalho h1 {
        font-size: 16px;
    }

    .none {
        display: none;
    }
}

@media (max-width: 480px) {
    .header-geladeira-fixo {
        display: flex;
    }

    .icone-cubo-gelo {
        display: none;
    }

    .secao-adicionar-card {
        display: flex;
        flex-direction: column;
    }

    .lista-ativos-container {
        order: -1;
        border-top: none;
        padding-top: 0;
        margin-bottom: 8px;
    }
}
</style>