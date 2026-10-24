<template>
    <div class="corpo">
        <BarraNavegacao />

        <div class="coluna">
            <header class="header-topo">
                <div class="header-titles">
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

                <section class="secao-bloco">
                    <h3 class="titulo-secao">Destaque da semana</h3>
                    <div class="banner-destaque" :style="{ backgroundImage: `url(${comunidadeDestaque.banner_url})` }">
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
                                type="button" 
                                class="banner-status-participando" 
                                :class="{ 'participando': comunidadeDestaque.participa }"
                                @click="alternarParticipacao(comunidadeDestaque)"
                            >
                                {{ comunidadeDestaque.participa ? '✓ Participando' : '+ Entrar' }}
                            </button>
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
                        <div v-for="com in minhasComunidades" :key="com.id" class="minha-comunidade-card">
                            <img :src="com.foto_url" :alt="com.nome" class="minha-comunidade-foto" draggable="false" />
                            <span class="minha-comunidade-nome">{{ com.nome }}</span>
                        </div>
                    </div>
                </section>

                <section class="secao-bloco">
                    <h3 class="titulo-secao">Explorar comunidades</h3>
                    <div class="lista-explorar">
                        <div v-for="com in comunidadesFiltradas" :key="com.id" class="comunidade-card-item">
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
                            <button type="button" class="btn-participar" :class="{ 'participando': com.participa }"
                                @click="alternarParticipacao(com)">
                                {{ com.participa ? '✓ Participando' : '+ Entrar' }}
                            </button>
                        </div>
                        <div v-if="comunidadesFiltradas.length === 0" class="sem-resultados">
                            <p>Nenhuma comunidade encontrada com esse nome.</p>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import BarraNavegacao from '@/components/BarraNavegacao.vue';

const router = useRouter();

const termoPesquisa = ref('');

const comunidadesGeral = ref([
    {
        id: 1,
        nome: 'Veganos Criativos',
        descricao: 'Receitas plant-based deliciosas para mostrar que vegano não come só salada! 🌱',
        quantidade_pessoas: '12.4k',
        quantidade_receitas: '3.2k',
        foto_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=150',
        participa: false,
        criador: false
    },
    {
        id: 2,
        nome: 'Bolos & Confeitaria',
        descricao: 'Para quem ama bolos artísticos, confeitar e criar sobremesas que encantam! 🍰',
        quantidade_pessoas: '28.7k',
        quantidade_receitas: '7.9k',
        foto_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150',
        participa: true,
        criador: false
    },
    {
        id: 4,
        nome: 'Fitness & Saúde',
        descricao: 'Receitas nutritivas e fitness para quem quer comer bem sem abrir mão do sabor! 💪',
        quantidade_pessoas: '19.8k',
        quantidade_receitas: '4.6k',
        foto_url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=150',
        participa: false,
        criador: false
    },
    {
        id: 5,
        nome: 'Massas & Risotos',
        descricao: 'O melhor da culinária italiana feita em casa. Receitas autênticas e adaptações! 🍝',
        quantidade_pessoas: '8.9k',
        quantidade_receitas: '2.3k',
        foto_url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=150',
        participa: false,
        criador: false
    }
]);

const comunidadeDestaque = ref({
    id: 3,
    nome: 'Cozinha Brasileira',
    quantidade_pessoas: '45.6k',
    quantidade_receitas: '15.2k',
    banner_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200',
    foto_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150',
    participa: false, 
    criador: false
});

const alternarParticipacao = (com) => {
    com.participa = !com.participa;
};

const alternarParticipacaoDestaque = () => {
    comunidadeDestaque.value.participa = !comunidadeDestaque.value.participa;
};

const minhasComunidades = computed(() => {

    const listGeral = comunidadesGeral.value
        .filter(com => com.participa || com.criador)
        .map(com => ({
            id: com.id,
            foto_url: com.foto_url,
            nome: com.nome
        }));

    if (comunidadeDestaque.value.participa || comunidadeDestaque.value.criador) {
        listGeral.unshift({
            id: comunidadeDestaque.value.id,
            foto_url: comunidadeDestaque.value.foto_url,
            nome: comunidadeDestaque.value.nome
        });
    }

    return listGeral;
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

.sem-resultados {
    text-align: center;
    padding: 20px;
    color: var(--cinza);
    font-size: 13px;
}
</style>