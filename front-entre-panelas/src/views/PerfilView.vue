<template>
    <div class="perfil-layout">
        <BarraNavegacao />

        <header class="header-perfil-mobile">
            <h2>Meu Perfil</h2>
            <button class="botao-icone-engrenagem" @click="irParaEditarInformacoes" aria-label="Configurações">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
            </button>
        </header>
        <main class="conteudo-principal">
            <div 
                class="banner-perfil" 
                :style="usuario.bannerUrl ? { backgroundImage: `url(${usuario.bannerUrl})` } : {}"
            >
                <div class="banner-acoes-topo">
                    <button class="botao-icone" @click="irParaEditarInformacoes" aria-label="Configurações e editar informações">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <div class="perfil-info-container">
                <div class="perfil-cabecalho-linha">
                    <div class="avatar-wrapper">
                        <UserAvatar 
                            :fotoUrl="usuario.fotoUrl" 
                            :nome="usuario.nome" 
                            tamanho="90"
                            borda="white"
                            sombra
                            :tamanhoFonte="32"
                        />
                    </div>
                    <button class="botao-editar-perfil" @click="irParaEditarPerfil">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                        </svg>
                        Editar perfil
                    </button>
                </div>

                <div class="detalhes-usuario">
                    <h1 class="nome-usuario">{{ usuario.nome || 'Carregando...' }}</h1>
                    <span v-if="usuario.username" class="username">@{{ usuario.username }}</span>
                    <p v-if="usuario.descricao" class="descricao-usuario">{{ usuario.descricao }}</p>

                    <div class="estatisticas-usuario">
                        <div class="estatistica-item">
                            <span class="estatistica-valor">{{ formatarContador(usuario.quantidadeReceitas) }}</span>
                            <span class="estatistica-label">Receitas</span>
                        </div>
                        <div class="estatistica-item">
                            <span class="estatistica-valor">{{ formatarContador(usuario.quantidadeSeguidores) }}</span>
                            <span class="estatistica-label">Seguidores</span>
                        </div>
                        <div class="estatistica-item">
                            <span class="estatistica-valor">{{ formatarContador(usuario.quantidadeSeguindo) }}</span>
                            <span class="estatistica-label">Seguindo</span>
                        </div>
                    </div>
                </div>

                <div class="abas-navegacao">
                    <button 
                        class="aba-botao" 
                        :class="{ 'ativa': abaAtiva === 'receitas' }" 
                        @click="abaAtiva = 'receitas'"
                    >
                        <img 
                            src="../../public/icon_livro.png" 
                            alt="Receitas" 
                            class="icone-aba icone-livro" 
                        />
                        <span>Receitas</span>
                    </button>
                    <button 
                        class="aba-botao" 
                        :class="{ 'ativa': abaAtiva === 'salvos' }" 
                        @click="abaAtiva = 'salvos'"
                    >
                        <img 
                            src="../../public/icon_salvo.png" 
                            alt="Salvos" 
                            class="icone-aba icone-salvo" 
                        />
                        <span>Salvos</span>
                    </button>
                    <button 
                        class="aba-botao" 
                        :class="{ 'ativa': abaAtiva === 'comunidades' }" 
                        @click="abaAtiva = 'comunidades'"
                    >
                        <img 
                            src="../../public/iconPaginas/comunidade_icon_cinza.png" 
                            alt="Comunidades" 
                            class="icone-aba icone-comunidades" 
                        />
                        <span>Comunidades</span>
                    </button>
                </div>
            </div>

            <div class="aba-conteudo">
                <p v-if="carregando" class="estado-vazio">Carregando perfil...</p>

                <template v-else>
                    <div v-if="abaAtiva === 'receitas'" class="lista-grid">
                        <p v-if="receitasCriadas.length === 0" class="estado-vazio">
                            Você ainda não publicou nenhuma receita.
                        </p>
                        <RecipeCard 
                            v-for="receita in receitasCriadas" 
                            :key="receita.id" 
                            v-bind="receita"
                            @toggle-save="({ id, salvo }) => alternarSalvarReceita(id, salvo)"
                        />
                    </div>

                    <div v-if="abaAtiva === 'salvos'" class="lista-grid">
                        <p v-if="receitasSalvas.length === 0" class="estado-vazio">
                            Você ainda não salvou nenhuma receita.
                        </p>
                        <RecipeCard 
                            v-for="receita in receitasSalvas" 
                            :key="receita.id" 
                            v-bind="receita"
                            @toggle-save="({ id, salvo }) => alternarSalvarReceita(id, salvo, true)"
                        />
                    </div>

                    <div v-if="abaAtiva === 'comunidades'" class="comunidades-grid">
                        <p v-if="comunidades.length === 0" class="estado-vazio">
                            Você ainda não participa de nenhuma comunidade.
                        </p>
                        <div 
                            v-for="comunidade in comunidades" 
                            :key="comunidade.id" 
                            class="comunidade-card"
                            @click="irParaComunidade(comunidade.id)"
                        >
                            <div 
                                class="comunidade-banner" 
                                :style="comunidade.bannerUrl 
                                    ? { backgroundImage: `url(${comunidade.bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } 
                                    : { background: comunidade.gradiente }"
                            ></div>
                            <div class="comunidade-info">
                                <h3 class="comunidade-nome">{{ comunidade.nome }}</h3>
                                <span class="comunidade-membros">{{ formatarContador(comunidade.membros) }} membros</span>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BarraNavegacao from '@/components/BarraNavegacao.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import RecipeCard from '@/components/RecipeCard.vue'
import { authService } from '@/services/authService'
import {
    getBuscarUsuario,
    getReceitasUsuario,
    getReceitasSalvasUsuario,
    getComunidadesUsuario
} from '@/services/usuarios'
import { postSalvarReceita, deleteDesalvarReceita } from '@/services/interacoes'

const router = useRouter()

const abaAtiva = ref('receitas')
const carregando = ref(true)
const meuId = ref(null)

const usuario = ref({
    nome: '',
    username: '',
    descricao: '',
    fotoUrl: '',
    bannerUrl: '',
    quantidadeReceitas: 0,
    quantidadeSeguidores: 0,
    quantidadeSeguindo: 0
})

const receitasCriadas = ref([])
const receitasSalvas = ref([])
const comunidades = ref([])

const gradientesComunidade = [
    'linear-gradient(135deg, #a8caba 0%, #52a388 100%)',
    'linear-gradient(135deg, #f4ddb4 0%, #f1ae2b 100%)',
    'linear-gradient(135deg, #f6d5c4 0%, #d97c54 100%)',
    'linear-gradient(135deg, #d7e3fc 0%, #6c8ebf 100%)'
]

const obterIdUsuarioLogado = () => {
    const user = authService.getUser?.()
    return user?.id ?? user?.id_usuario ?? user?.usuario?.id ?? null
}

const extrairLista = (resposta, chaves = []) => {
    if (Array.isArray(resposta)) return resposta
    if (!resposta || typeof resposta !== 'object') return []
    for (const chave of chaves) {
        if (Array.isArray(resposta[chave])) return resposta[chave]
    }
    if (resposta.data && typeof resposta.data === 'object') {
        if (Array.isArray(resposta.data)) return resposta.data
        for (const chave of chaves) {
            if (Array.isArray(resposta.data[chave])) return resposta.data[chave]
        }
    }
    if (resposta.response && typeof resposta.response === 'object') return extrairLista(resposta.response, chaves)
    return []
}

const gerarIniciais = (nome = '') => {
    const partes = String(nome).trim().split(/\s+/).filter(Boolean)
    if (partes.length === 0) return 'U'
    if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
    return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase()
}

const formatarTempo = (tempo) => {
    if (tempo === null || tempo === undefined || tempo === '') return '0min'
    if (typeof tempo === 'number') return `${tempo}min`
    return String(tempo)
}

const formatarPorcoes = (porcoes) => {
    if (porcoes === null || porcoes === undefined || porcoes === '') return '1 porção'
    if (typeof porcoes === 'number') return `${porcoes} ${porcoes === 1 ? 'porção' : 'porções'}`
    return String(porcoes)
}

const formatarContador = (valor) => {
    if (typeof valor === 'string') return valor
    const numero = Number(valor) || 0
    if (numero >= 1000) {
        return `${(numero / 1000).toFixed(1).replace(/\.0$/, '')}k`
    }
    return numero
}

const normalizarReceita = (item, salvoPadrao = false) => {
    const autorObj = item.autor || item.usuario || {}
    const autorNome = autorObj.nome_completo ?? autorObj.nome ?? item.autor_nome ?? item.autorNome ?? usuario.value.nome ?? 'Chef'

    return {
        id: item.id ?? item.id_receita,
        imagemUrl: item.imagem_url ?? item.imagemUrl ?? item.foto_url ?? item.imagem ?? '',
        titulo: item.titulo ?? item.nome ?? 'Receita',
        tempo: formatarTempo(item.tempo_preparo ?? item.tempo ?? item.tempoPreparo),
        porcoes: formatarPorcoes(item.porcoes ?? item.rendimento),
        custo: item.custo ?? item.nivel_custo ?? 'Econômico',
        curtidas: Number(item.curtidas ?? item.total_curtidas ?? item.quantidade_curtidas ?? 0),
        comentarios: Number(item.comentarios ?? item.total_comentarios ?? item.quantidade_comentarios ?? 0),
        autorNome,
        authorIniciais: gerarIniciais(autorNome),
        autorFotoUrl: autorObj.foto_perfil ?? autorObj.foto_url ?? item.autor_foto_url ?? item.autorFotoUrl ?? '',
        dificuldade: item.dificuldade ?? 'Fácil',
        salvo: Boolean(item.salvo_pelo_usuario ?? item.salvo ?? item.is_salvo ?? salvoPadrao)
    }
}

const normalizarComunidade = (item, index) => {
    const dados = item.comunidade || item
    const id = dados.id ?? dados.id_comunidade ?? index
    return {
        id,
        nome: dados.nome ?? dados.titulo ?? 'Comunidade',
        membros: dados.membros ?? dados.total_membros ?? dados.quantidade_membros ?? 0,
        bannerUrl: dados.foto_capa ?? dados.banner_url ?? dados.imagem_url ?? '',
        gradiente: gradientesComunidade[Number(id) % gradientesComunidade.length]
    }
}

const carregarPerfilCompleto = async () => {
    const id = obterIdUsuarioLogado()
    if (!id) {
        router.push('/')
        return
    }

    meuId.value = id
    carregando.value = true

    try {
        const [resUsuario, resReceitas, resSalvas, resComunidades] = await Promise.allSettled([
            getBuscarUsuario(id),
            getReceitasUsuario(id, { idUserLogado: id }),
            getReceitasSalvasUsuario(id, { idUserLogado: id }),
            getComunidadesUsuario(id)
        ])

        if (resUsuario.status === 'fulfilled' && resUsuario.value) {
            const raw = resUsuario.value.response?.usuario ?? resUsuario.value.usuario ?? resUsuario.value.data ?? resUsuario.value
            usuario.value = {
                nome: raw.nome_completo ?? raw.nome ?? '',
                username: raw.nome_usuario ?? raw.username ?? '',
                descricao: raw.bio ?? raw.descricao ?? '',
                fotoUrl: raw.foto_perfil ?? raw.foto_url ?? raw.fotoUrl ?? '',
                bannerUrl: raw.foto_capa ?? raw.banner_url ?? raw.bannerUrl ?? '',
                quantidadeReceitas: raw.total_receitas ?? raw.quantidade_receitas ?? raw.quantidadeReceitas ?? 0,
                quantidadeSeguidores: raw.total_seguidores ?? raw.quantidade_seguidores ?? raw.quantidadeSeguidores ?? 0,
                quantidadeSeguindo: raw.total_seguindo ?? raw.quantidade_seguindo ?? raw.quantidadeSeguindo ?? 0
            }
        }

        if (resReceitas.status === 'fulfilled') {
            const lista = extrairLista(resReceitas.value, ['receitas', 'items', 'resultados'])
            receitasCriadas.value = lista.map(r => normalizarReceita(r, false))
            if (!usuario.value.quantidadeReceitas && receitasCriadas.value.length > 0) {
                usuario.value.quantidadeReceitas = receitasCriadas.value.length
            }
        }

        if (resSalvas.status === 'fulfilled') {
            const lista = extrairLista(resSalvas.value, ['receitas', 'salvas', 'receitas_salvas', 'items'])
            receitasSalvas.value = lista.map(r => normalizarReceita(r, true))
        }

        if (resComunidades.status === 'fulfilled') {
            const lista = extrairLista(resComunidades.value, ['comunidade', 'comunidades', 'items'])
            comunidades.value = lista.map((c, idx) => normalizarComunidade(c, idx))
        }
    } catch (error) {
        console.error('Erro ao carregar dados do perfil:', error)
    } finally {
        carregando.value = false
    }
}

const alternarSalvarReceita = async (receitaId, novoEstado, removerDosSalvos = false) => {
    const atualizarEstadoLocal = (estado) => {
        const naCriadas = receitasCriadas.value.find(r => Number(r.id) === Number(receitaId))
        if (naCriadas) naCriadas.salvo = estado

        const naSalvas = receitasSalvas.value.find(r => Number(r.id) === Number(receitaId))
        if (naSalvas) naSalvas.salvo = estado
    }

    atualizarEstadoLocal(novoEstado)

    try {
        if (novoEstado) {
            await postSalvarReceita(receitaId)
            const jaExisteEmSalvas = receitasSalvas.value.some(r => Number(r.id) === Number(receitaId))
            if (!jaExisteEmSalvas) {
                const receitaCriada = receitasCriadas.value.find(r => Number(r.id) === Number(receitaId))
                if (receitaCriada) {
                    receitasSalvas.value.unshift({ ...receitaCriada, salvo: true })
                }
            }
        } else {
            await deleteDesalvarReceita(receitaId)
            if (removerDosSalvos || abaAtiva.value === 'salvos') {
                receitasSalvas.value = receitasSalvas.value.filter(r => Number(r.id) !== Number(receitaId))
            }
        }
    } catch (error) {
        console.error('Erro ao atualizar estado de salvamento da receita:', error)
        atualizarEstadoLocal(!novoEstado)
    }
}

onMounted(() => {
    carregarPerfilCompleto()
})

const irParaEditarInformacoes = () => {
    router.push('/editar-informacoes')
}

const irParaEditarPerfil = () => {
    router.push('/editar-perfil')
}

const irParaComunidade = (id) => {
    router.push(`/comunidade/${id}`)
}
</script>

<style scoped>
.perfil-layout {
    display: flex;
    min-height: 100vh;
    background-color: var(--cinza-claro);
}

.conteudo-principal {
    flex: 1;
    margin-left: 200px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding-bottom: 40px;
}

.banner-perfil {
    width: 100%;
    height: 180px;
    background-color: var(--bege);
    background-size: cover;
    background-position: center;
    position: relative;
    padding: 16px 24px;
    box-sizing: border-box;
    z-index: 1;
}

.banner-acoes-topo {
    display: flex;
    justify-content: end;
    align-items: center;
    width: 100%;
}

.botao-icone {
    background-color: #ffffff;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    color: var(--marrom);
    transition: background-color 0.2s, transform 0.2s;
}

.botao-icone:hover {
    background-color: var(--bege);
    transform: scale(1.05);
}

.perfil-info-container {
    padding: 0 40px;
    background-color: var(--cinza-claro);
    position: relative;
    z-index: 2;
}

.perfil-cabecalho-linha {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-top: -45px;
    margin-bottom: 16px;
    position: relative;
    z-index: 3;
}

.avatar-wrapper {
    position: relative;
    border-radius: 50%;
    background-color: #ffffff;
    padding: 3px;
    width: 120px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.botao-editar-perfil {
    margin-top: 55px;
    display: flex;
    align-items: center;
    gap: 6px;
    background-color: #ffffff;
    border: 1px solid var(--bege);
    color: var(--marrom);
    padding: 8px 18px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;
}

.botao-editar-perfil:hover {
    background-color: var(--bege);
}

.detalhes-usuario {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 24px;
}

.nome-usuario {
    font-size: 30px;
    font-weight: 700;
    color: var(--marrom);
    font-family: "Playfair", serif;
}

.username {
    font-size: 14px;
    color: var(--cinza);
}

.descricao-usuario {
    font-size: 15px;
    color: var(--marrom);
    margin-top: 4px;
    max-width: 600px;
    line-height: 1.4;
}

.estatisticas-usuario {
    display: flex;
    gap: 32px;
    margin-top: 12px;
}

.estatistica-item {
    display: flex;
    flex-direction: column;
}

.estatistica-valor {
    font-family: "Playfair Display", serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--marrom);
}

.estatistica-label {
    font-size: 13px;
    color: var(--cinza);
}

.abas-navegacao {
    justify-content: center;
    display: flex;
    gap: 16px;
    border-bottom: 1px solid var(--cinza-branco);
    margin-top: 10px;
}

.aba-botao {
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    padding: 12px 10%;
    font-size: 15px;
    font-weight: 600;
    color: var(--cinza);
    cursor: pointer;
    border-radius: 12px 12px 0 0;
    transition: all 0.2s ease;
}

.aba-botao.ativa {
    background-color: var(--marrom);
    color: #ffffff;
}

.icone-aba {
    width: 18px;
    height: 18px;
    object-fit: contain;
}

.icone-livro {
    filter: brightness(0) saturate(100%) invert(53%) sepia(10%) saturate(497%) hue-rotate(334deg) brightness(91%) contrast(87%);
}

.aba-botao.ativa .icone-livro {
    filter: none;
}

.icone-comunidades {
    filter: brightness(0) saturate(100%) invert(43%) sepia(85%) saturate(1989%) hue-rotate(224deg) brightness(99%) contrast(93%);
}

.aba-conteudo {
    display: flex;
    flex-direction: column;
    padding: 24px 40px;
}

.estado-vazio {
    text-align: center;
    color: var(--cinza);
    font-size: 14px;
    padding: 32px 16px;
    width: 100%;
    grid-column: 1 / -1;
}

.lista-grid {
    width: 100%;
    align-self: center;
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 1200px;
}

.comunidades-grid {
    align-self: center;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
}

.comunidade-card {
    background-color: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid var(--bege);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.comunidade-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.comunidade-banner {
    height: 110px;
    width: 100%;
}

.comunidade-info {
    padding: 16px;
}

.comunidade-nome {
    font-size: 16px;
    font-weight: 700;
    color: var(--marrom);
    margin-bottom: 4px;
}

.comunidade-membros {
    font-size: 13px;
    color: var(--cinza);
}

.header-perfil-mobile {
    display: none;
}

@media (max-width: 768px) {
    .perfil-layout {
        flex-direction: column;
    }

    .conteudo-principal {
        margin-left: 0;
        padding-bottom: 24px;
    }

    .perfil-info-container {
        padding: 0 16px;
    }

    .aba-conteudo {
        padding: 16px;
    }

    .aba-botao {
        padding: 12px 8%;
        font-size: 14px;
    }

    .estatisticas-usuario {
        gap: 20px;
    }
}

@media (max-width: 480px) {
    .perfil-layout,
    .conteudo-principal,
    .perfil-info-container,
    .aba-conteudo {
        background-color: #fcfaf6;
    }

    .conteudo-principal {
        margin-left: 0;
        padding-bottom: 80px;
    }

    .header-perfil-mobile {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 16px;
        background-color: #ffffff;
        border-bottom: 1px solid #efeae1;
    }

    .header-perfil-mobile h2 {
        font-size: 18px;
        font-weight: 700;
        color: #3b2219;
        margin: 0;
    }

    .botao-icone-engrenagem {
        background: none;
        border: none;
        color: #4a2512;
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .banner-perfil {
        height: 110px;
        padding: 0;
    }

    .banner-acoes-topo {
        display: none;
    }

    .perfil-info-container {
        padding: 0 16px;
    }

    .perfil-cabecalho-linha {
        margin-top: -90px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
    }

    .avatar-wrapper {
        width: 80px;
        height: 80px;
        border: 3px solid #72bca5;
        border-radius: 50%;
        box-shadow: none;
    }

    .botao-editar-perfil {
        margin-top: 0;
        background-color: #ffffff;
        border: 1px solid #efeae1;
        color: #4a2512;
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .detalhes-usuario {
        gap: 4px;
        margin-bottom: 16px;
    }

    .nome-usuario {
        font-size: 22px;
        color: #3b2219;
    }

    .username {
        font-size: 13px;
        color: #8c827a;
    }

    .descricao-usuario {
        font-size: 13px;
        color: #5a4a42;
        margin-top: 4px;
        line-height: 1.4;
    }

    .estatisticas-usuario {
        gap: 16px;
        margin-top: 14px;
    }

    .estatistica-item {
        flex-direction: row;
        align-items: baseline;
        gap: 4px;
    }

    .estatistica-valor {
        font-size: 15px;
        font-weight: 700;
        color: #3b2219;
        font-family: "Inter", sans-serif;
    }

    .estatistica-label {
        font-size: 13px;
        color: #8c827a;
    }

    .abas-navegacao {
        display: flex;
        width: 100%;
        justify-content: space-between;
        gap: 4px;
        border-bottom: 1px solid #efeae1;
        padding-bottom: 0px;
        margin-top: 16px;
        overflow: visible;
    }

    .aba-botao {
        flex: 1;
        padding: 8px 4px;
        font-size: 12px;
        font-weight: 600;
        justify-content: center;
        background-color: transparent;
        color: #6e655f;
    }

    .aba-botao.ativa {
        background-color: #3b2219;
        color: #ffffff;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    }

    .aba-conteudo {
        padding: 16px;
    }

    .lista-grid {
        gap: 16px;
    }
}
</style>