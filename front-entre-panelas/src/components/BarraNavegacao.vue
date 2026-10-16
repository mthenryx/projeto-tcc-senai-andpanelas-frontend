<template>
    <aside class="menu-lateral">
        <div class="cabecalho-menu">
            <img src="../../public/Logo_Panelas_em_marrom.png" alt="Entre Panelas" class="imagem-logo" />
        </div>

        <nav class="navegacao">
            <RouterLink v-for="item in itensMenu" :key="item.id" :to="item.rota" class="item-menu"
                :class="{ 'clicou': item.id === itemAtivo }" @click="selecionarItem(item.id)">
                <img v-if="item.iconeUrl" :src="item.iconeUrl" alt="Icone representativo" class="icone-menu" />

                <span class="texto-item">
                    {{ item.nome }}
                </span>
            </RouterLink>
        </nav>

        <div class="rodape-menu">
            <RouterLink to="/nova-receita" class="botao-nova-receita">
                <span class="mais">+</span>
                <span>Nova Receita</span>
            </RouterLink>
        </div>
    </aside>
</template>

<script setup>
import { ref } from 'vue'

const itemAtivo = ref('inicio')

const selecionarItem = (id) => {
    itemAtivo.value = id
}

const itensMenu = [
    {
        id: 'inicio',
        nome: 'Início',
        rota: '/inicio',
        iconeUrl: '../../public/iconPaginas/home_icon_cinza.png'
    },
    {
        id: 'buscar-receitas',
        nome: 'Buscar Receitas',
        rota: '/buscar-receitas',
        iconeUrl: '../../public/iconPaginas/lupa_icon_cinza.png'
    },
    {
        id: 'comunidades',
        nome: 'Comunidades',
        rota: '/comunidades',
        iconeUrl: '../../public/iconPaginas/comunidade_icon_cinza.png'
    },
    {
        id: 'minha-geladeira',
        nome: 'Minha Geladeira',
        rota: '/minha-geladeira',
        iconeUrl: '../../public/iconPaginas/geladeira_icon_cinza.png'
    },
    {
        id: 'chefinho',
        nome: 'Chefinho IA',
        rota: '/chefinho',
        iconeUrl: '../../public/iconPaginas/chefe_icon_cinza.png'
    },
    {
        id: 'lista-compras',
        nome: 'Lista de Compras',
        rota: '/lista-de-compras',
        iconeUrl: '../../public/iconPaginas/lista_icon_cinza.png'
    },
    {
        id: 'meu-perfil',
        nome: 'Meu Perfil',
        rota: '/meu-perfil',
        iconeUrl: '../../public/iconPaginas/perfil_icon_cinza.png'
    }
]
</script>

<style scoped>
.menu-lateral {
    min-width: 200px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    border-right: 1px solid var(--bege);
    overflow: hidden;
}

.cabecalho-menu {
    height: 60px;
    min-height: 40px;
    display: flex;
    align-items: center;
    padding: 0 10%;
    border-bottom: 1px solid var(--bege);
}

.imagem-logo {
    display: block;
    max-width: 130px;
    object-fit: contain;
}

.navegacao {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 10px;
}

.item-menu {
    display: flex;
    align-items: center;
    gap: 15px;
    width: 100%;
    min-height: 22px;
    padding: 10px;
    border-radius: 7px;
    color: var(--marrom);
    background-color: transparent;
    text-decoration: none;
    font-size: 14px;
    font-weight: 400;
    white-space: nowrap;
    transition:
        background-color 0.25s ease,
        color 0.25s ease,
        transform 0.18s ease;
}

.icone-menu {
    width: 15px;
    height: auto;
    min-width: 12px;
    object-fit: contain;
}

.clicou {
    transition: 0.3s;
    background-color: rgba(114, 188, 165, 0.10);
    color: var(--verde-escuro);
    filter: brightness(0) saturate(100%) invert(60%) sepia(21%) saturate(915%) hue-rotate(119deg) brightness(93%) contrast(89%);
}

.item-menu.ativo {
    color: var(--verde-escuro);
    background-color: rgba(114, 188, 165, 0.20);
    font-weight: 500;
}

.item-menu.ativo .icone-menu {
    filter:
        brightness(0) saturate(100%) invert(58%) sepia(20%) saturate(700%) hue-rotate(110deg);
}

.item-menu:active {
    transform: scale(0.97);
}

.item-menu:focus-visible,
.botao-nova-receita:focus-visible {
    outline: 2px solid var(--verde-escuro);
    outline-offset: 2px;
}

.rodape-menu {
    margin-top: auto;
    padding: 8px;
    border-top: 1px solid var(--bege);
}

.botao-nova-receita {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    width: 100%;
    min-height: 40px;
    border-radius: 6px;
    color: #ffffff;
    background-color: var(--verde);
    text-decoration: none;
    font-size: 16px;
    font-weight: 500;
    transition:
        background-color 0.25s ease,
        transform 0.18s ease;
}

.botao-nova-receita:hover {
    background-color: var(--verde-escuro);
}

.botao-nova-receita:active {
    transform: scale(0.97);
}

.mais {
    font-size: 20px;
    line-height: 1;
}
</style>