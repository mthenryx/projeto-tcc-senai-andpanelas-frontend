<template>
    <aside class="menu-lateral">
        <div class="cabecalho-menu">
            <img src="../../public/Logo_Panelas_em_marrom.png" alt="Entre Panelas" class="imagem-logo" />
        </div>

        <nav class="navegacao">
            <RouterLink v-for="item in itensMenu" :key="item.id" :to="item.rota" class="item-menu"
                :class="{ 'clicou': item.rota === rotaAtual }">
                <img v-if="item.iconeUrl" :src="item.iconeUrl" alt="Icone representativo" class="icone-menu" />

                <span class="texto-item">
                    {{ item.nome }}
                </span>
            </RouterLink>
        </nav>

        <div class="rodape-menu">
            <RouterLink to="/criar-receita" class="botao-nova-receita">
                <span class="mais">+</span>
                <span class="texto-btn-receita">Nova Receita</span>
            </RouterLink>
        </div>
    </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const rotaAtual = computed(() => route.path)

const itensMenu = [
    {
        id: 'inicio',
        nome: 'Início',
        rota: '/home',
        iconeUrl: '/iconPaginas/home_icon_cinza.png'
    },
    {
        id: 'buscar-receitas',
        nome: 'Buscar Receitas',
        rota: '/buscar-receita',
        iconeUrl: '/iconPaginas/lupa_icon_cinza.png'
    },
    {
        id: 'comunidades',
        nome: 'Comunidades',
        rota: '/comunidade',
        iconeUrl: '/iconPaginas/comunidade_icon_cinza.png'
    },
    {
        id: 'minha-geladeira',
        nome: 'Minha Geladeira',
        rota: '/geladeira',
        iconeUrl: '/iconPaginas/geladeira_icon_cinza.png'
    },
    {
        id: 'chefinho',
        nome: 'Chefinho IA',
        rota: '/chefinho',
        iconeUrl: '/iconPaginas/chefe_icon_cinza.png'
    },
    {
        id: 'lista-compras',
        nome: 'Lista de Compras',
        rota: '/lista-compra',
        iconeUrl: '/iconPaginas/lista_icon_cinza.png'
    },
    {
        id: 'meu-perfil',
        nome: 'Meu Perfil',
        rota: '/perfil',
        iconeUrl: '/iconPaginas/perfil_icon_cinza.png'
    }
]
</script>

<style scoped>
.menu-lateral {
    position: fixed;
    top: 0;
    left: 0;
    width: 200px;
    min-width: 200px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    border-right: 1px solid var(--bege);
    overflow: hidden;
    box-sizing: border-box;
    z-index: 99;
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
    transition: background-color 0.25s ease, color 0.25s ease, transform 0.18s ease;
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
    filter: brightness(0) saturate(100%) invert(58%) sepia(20%) saturate(700%) hue-rotate(110deg);
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
    transition: background-color 0.25s ease, transform 0.18s ease;
}

.botao-nova-receita:hover {
    background-color: var(--verde-escuro);
}

.mais {
    font-size: 20px;
    line-height: 1;
}

@media (max-width: 768px) {
    .menu-lateral {
        position: relative;
        top: auto;
        left: auto;
        width: 100%;
        min-width: 0;
        height: auto;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        border-right: none;
        border-bottom: 1px solid var(--bege);
        overflow: visible;
    }

    .cabecalho-menu {
        order: 1;
        flex: 1;
        height: 60px;
        padding: 0 16px;
        border-bottom: none;
    }

    .rodape-menu {
        order: 2;
        margin-top: 0;
        padding: 8px 16px;
        border-top: none;
    }

    .botao-nova-receita {
        width: auto;
        padding: 0 16px;
    }

    .navegacao {
        border-top: 1px solid var(--bege);
        order: 3;
        width: 100%;
        flex-direction: row;
        gap: 4px;
        padding: 12px;
        overflow-x: auto;
        scrollbar-width: none;
        box-sizing: border-box;
    }

    .item-menu {
        width: auto;
        flex-shrink: 0;
        padding: 12px 18px;
        font-size: 13px;
        border-radius: 25px;
    }
}

@media (max-width: 480px) {
    .menu-lateral {
        position: fixed;
        top: auto;
        bottom: 0;
        left: 0;
        width: 100vw;
        height: 60px;
        background-color: #fcfaf6;
        border-top: 1px solid #efeae1;
        border-bottom: none;
        display: flex;
        align-items: center;
        padding: 0;
        box-sizing: border-box;
        z-index: 1000;
        overflow: visible;
    }

    .cabecalho-menu {
        display: none;
    }

    .navegacao {
        border-top: none;
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 28px;
        padding: 0 24px;
        margin: 0;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
    }

    .navegacao::-webkit-scrollbar {
        display: none;
    }

    .item-menu {
        width: auto;
        flex-shrink: 0;
        padding: 8px;
        border-radius: 50%;
        background-color: transparent !important;
    }

    .texto-item {
        display: none;
    }

    .icone-menu {
        width: 22px;
        height: 22px;
        filter: grayscale(100%) opacity(0.5);
    }

    .clicou .icone-menu {
        filter: brightness(0) saturate(100%) invert(60%) sepia(21%) saturate(915%) hue-rotate(119deg) brightness(93%) contrast(89%);
    }

    .rodape-menu {
        position: absolute;
        top: -24px;
        left: 50%;
        transform: translateX(-50%);
        padding: 0;
        border: none;
        z-index: 1001;
        pointer-events: auto;
    }

    .botao-nova-receita {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background-color: #72bca5;
        box-shadow: 0 4px 12px rgba(114, 188, 165, 0.4);
        padding: 0;
    }

    .texto-btn-receita {
        display: none;
    }

    .mais {
        font-size: 26px;
    }
}
</style>