<template>
    <div class="corpo">
        <BarraNavegacao></BarraNavegacao>
        <div class="coluna">
            <HeaderAplicacao></HeaderAplicacao>
            <div class="conteudo">
                <nav>
                    <RouterLink to="/geladeira" class="fast-navegation">
                        <img src="../../public/floco_neve_icon.jpg" alt="Icon de um floco de neve">
                        <span>Geladeira</span>
                    </RouterLink>

                    <RouterLink to="/chefinho" class="fast-navegation">
                        <img src="../../public/iconPaginas/chefe_icon_cinza.png" alt="Icon do chefinho">
                        <span>Chefinho</span>
                    </RouterLink>
                        
                    <RouterLink to="/lista-compra" class="fast-navegation">
                        <img src="../../public/iconPaginas/lista_icon_cinza.png" alt="Icon de uma lista" class="lista">
                        <span>Lista</span>
                    </RouterLink>

                    <RouterLink to="/comunidade" class="fast-navegation">
                        <img src="../../public/iconPaginas/comunidade_icon_cinza.png" alt="Icon que representa uma comunidade" id="comunidade">
                        <span>Comunidade</span>
                    </RouterLink>
                </nav>
            </div>
        </div>
    </div>
</template>

<script setup>
import BarraNavegacao from '@/components/BarraNavegacao.vue';
import HeaderAplicacao from '@/components/HeaderAplicacao.vue';
</script>

<style scoped>
.corpo {
    display: flex;
    width: 100%;
    min-height: 100vh;
}

.coluna {
    width: calc(100% - 200px);
    min-width: 0;
    margin-left: 200px;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.conteudo {
    background-color: #fdfbf7;
    flex: 1;
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
}

nav {
    padding: 10px 15px;
    width: 300px;
    display: flex;
    gap: 8px;
}

.fast-navegation {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 14px;
    border: 1px solid var(--bege);
    border-radius: 25px;
    background-color: white;
    gap: 10px;
    color: var(--marrom);
    font-family: "Inter", sans-serif;
    text-decoration: none;
    font-size: 12px;
}

.fast-navegation:hover {
    background-color: #eceae5;
    border: 1px solid #e6dcca;
    transition: 0.5s;
}

.fast-navegation img {
    width: 12px;
    height: auto;
}

.lista {
    filter: grayscale(100%) brightness(35%) contrast(120%);
}

#comunidade {
    height: 15px;
    width: auto;
    filter: brightness(0) saturate(100%) invert(42%) sepia(71%) saturate(2572%) hue-rotate(221deg) brightness(99%) contrast(93%);
}
</style>