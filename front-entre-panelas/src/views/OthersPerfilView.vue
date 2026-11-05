<template>
    <div class="perfil-layout">
        <BarraNavegacao />

        <main class="conteudo-principal">
            <div 
                class="banner-perfil" 
                :style="usuario.bannerUrl ? { backgroundImage: `url(${usuario.bannerUrl})` } : {}"
            >
                <div class="banner-acoes-topo">
                    <button class="botao-icone" @click="voltarPaginaAnterior" aria-label="Voltar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
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
                </div>

                <div class="detalhes-usuario">
                    <h1 class="nome-usuario">{{ usuario.nome }}</h1>
                    <span class="username">@{{ usuario.username }}</span>
                    <p class="descricao-usuario">{{ usuario.descricao }}</p>

                    <div class="estatisticas-e-acoes">
                        <div class="estatisticas-usuario">
                            <div class="estatistica-item">
                                <span class="estatistica-valor">{{ usuario.quantidadeReceitas }}</span>
                                <span class="estatistica-label">Receitas</span>
                            </div>
                            <div class="estatistica-item">
                                <span class="estatistica-valor">{{ usuario.quantidadeSeguidores }}</span>
                                <span class="estatistica-label">Seguidores</span>
                            </div>
                            <div class="estatistica-item">
                                <span class="estatistica-valor">{{ usuario.quantidadeSeguindo }}</span>
                                <span class="estatistica-label">Seguindo</span>
                            </div>
                        </div>

                        <div class="acoes-perfil-outro">
                            <button 
                                class="botao-acao botao-seguir" 
                                :class="{ 'seguindo': usuario.seguindo }"
                                @click="toggleSeguir"
                            >
                                {{ usuario.seguindo ? 'Seguindo' : 'Seguir' }}
                            </button>
                            
                            <button class="botao-acao botao-denunciar" @click="abrirModalDenuncia">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                                    <line x1="4" y1="22" x2="4" y2="15"></line>
                                </svg>
                                Denunciar
                            </button>
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
                <div v-if="abaAtiva === 'receitas'" class="lista-grid">
                    <RecipeCard 
                        v-for="receita in receitasCriadas" 
                        :key="receita.id" 
                        v-bind="receita"
                        @update:salvo="(val) => receita.salvo = val"
                    />
                </div>

                <div v-if="abaAtiva === 'salvos'" class="lista-grid">
                    <RecipeCard 
                        v-for="receita in receitasSalvas" 
                        :key="receita.id" 
                        v-bind="receita"
                        @update:salvo="(val) => receita.salvo = val"
                    />
                </div>

                <div v-if="abaAtiva === 'comunidades'" class="comunidades-grid">
                    <div 
                        v-for="comunidade in comunidades" 
                        :key="comunidade.id" 
                        class="comunidade-card"
                        @click="irParaComunidade(comunidade.id)"
                    >
                        <div class="comunidade-banner" :style="{ background: comunidade.gradiente }"></div>
                        <div class="comunidade-info">
                            <h3 class="comunidade-nome">{{ comunidade.nome }}</h3>
                            <span class="comunidade-membros">{{ comunidade.membros }} membros</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <ReportModal 
            :is-open="modalDenunciaAberta" 
            tipo="usuario" 
            :target-id="usuarioId" 
            @close="modalDenunciaAberta = false"
            @send="tratarEnvioDenuncia" 
        />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BarraNavegacao from '@/components/BarraNavegacao.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import RecipeCard from '@/components/RecipeCard.vue'
import ReportModal from '@/components/ReportModal.vue'

const route = useRoute()
const router = useRouter()

const usuarioId = computed(() => route.params.id)

const abaAtiva = ref('receitas')
const modalDenunciaAberta = ref(false)

const usuario = ref({
    id: usuarioId.value || 1,
    nome: 'Ana Costa',
    username: 'anacosta',
    descricao: 'Chef caseira apaixonada com comida brasileira 🍲 | Receitas saudáveis e afetivas',
    fotoUrl: '',
    bannerUrl: '',
    quantidadeReceitas: 47,
    quantidadeSeguidores: '1.2k',
    quantidadeSeguindo: 389,
    seguindo: false
})

const toggleSeguir = () => {
    usuario.value.seguindo = !usuario.value.seguindo
}

const abrirModalDenuncia = () => {
    modalDenunciaAberta.value = true
}

const tratarEnvioDenuncia = (dadosDenuncia) => {
    console.log('Denúncia enviada:', dadosDenuncia)
}

const receitasCriadas = ref([
    {
        id: 1,
        imagemUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80',
        titulo: 'Frango ao Limão Siciliano',
        tempo: '40min',
        porcoes: '4 porções',
        custo: 'Econômico',
        curtidas: 342,
        comentarios: 28,
        autorNome: 'Ana Costa',
        authorIniciais: 'AC',
        autorFotoUrl: '',
        dificuldade: 'Fácil',
        salvo: false
    },
    {
        id: 2,
        imagemUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
        titulo: 'Macarrão ao Pesto Caseiro',
        tempo: '25min',
        porcoes: '2 porções',
        custo: 'Econômico',
        curtidas: 185,
        comentarios: 12,
        autorNome: 'Ana Costa',
        authorIniciais: 'AC',
        autorFotoUrl: '',
        dificuldade: 'Fácil',
        salvo: true
    }
])

const receitasSalvas = ref([
    {
        id: 3,
        imagemUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
        titulo: 'Bolo de Cenoura com Brigadeiro',
        tempo: '60min',
        porcoes: '12 porções',
        custo: 'Econômico',
        curtidas: 891,
        comentarios: 67,
        autorNome: 'Pedro Souza',
        authorIniciais: 'PS',
        autorFotoUrl: '',
        dificuldade: 'Fácil',
        salvo: true
    },
    {
        id: 4,
        imagemUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
        titulo: 'Sopa de camarão',
        tempo: '90min',
        porcoes: '2 porções',
        custo: 'Econômico',
        curtidas: 891,
        comentarios: 67,
        autorNome: 'Beatriz Alves',
        authorIniciais: 'BA',
        autorFotoUrl: '',
        dificuldade: 'Fácil',
        salvo: true
    }
])

const comunidades = ref([
    {
        id: 1,
        nome: 'Bolos & Confeitaria',
        membros: '28.7k',
        gradiente: 'linear-gradient(135deg, #a8caba 0%, #52a388 100%)'
    },
    {
        id: 2,
        nome: 'Cozinha Brasileira',
        membros: '45.6k',
        gradiente: 'linear-gradient(135deg, #f4ddb4 0%, #f1ae2b 100%)'
    }
])

const voltarPaginaAnterior = () => {
    router.back()
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
    justify-content: space-between;
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

.estatisticas-e-acoes {
    display: flex;
    align-items: center;
    gap: 40px;
    margin-top: 12px;
    max-width: 800px;
}

.estatisticas-usuario {
    display: flex;
    gap: 32px;
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

.acoes-perfil-outro {
    display: flex;
    align-items: center;
    gap: 40px;
}

.botao-acao {
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.botao-seguir {
    background-color: transparent;
    border: 1.5px solid var(--verde);
    color: var(--verde-escuro);
    padding: 8px 24px;
    border-radius: 20px;
}

.botao-seguir:hover {
    background-color: rgba(114, 188, 165, 0.1);
}

.botao-seguir.seguindo {
    background-color: rgba(114, 188, 165, 0.15);
    color: var(--verde-escuro);
    border-color: var(--verde);
}

.botao-denunciar {
    color: var(--cinza);
    padding: 8px 0;
}

.botao-denunciar svg {
    color: var(--cinza);
}

.botao-denunciar:hover {
    color: var(--vermelho);
}

.botao-denunciar:hover svg {
    color: var(--vermelho);
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
</style>