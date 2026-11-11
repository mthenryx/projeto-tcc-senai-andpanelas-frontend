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
                    <button class="botao-icone" @click="voltarHome" aria-label="Voltar para o início">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                    </button>

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
                    <h1 class="nome-usuario">{{ usuario.nome }}</h1>
                    <span class="username">@{{ usuario.username }}</span>
                    <p class="descricao-usuario">{{ usuario.descricao }}</p>

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
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BarraNavegacao from '@/components/BarraNavegacao.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import RecipeCard from '@/components/RecipeCard.vue'

const router = useRouter()

const abaAtiva = ref('receitas')

const usuario = ref({
    nome: 'Ana Costa',
    username: 'anacosta',
    descricao: 'Chef caseira apaixonada por comida brasileira | Receitas saudáveis e afetivas',
    fotoUrl: '',
    bannerUrl: '',
    quantidadeReceitas: 47,
    quantidadeSeguidores: '1.2k',
    quantidadeSeguindo: 389
})

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

const voltarHome = () => {
    router.push('/home')
}

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