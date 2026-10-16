<template>
    <header class="cabecalho-principal">
        <div class="acoes-direita">
            <RouterLink to="/" class="botao-acao icone-busca" aria-label="Buscar">
                <img src="../../public/Symbol.png" alt="Lupa">
            </RouterLink>
            
            <RouterLink to="/" class="botao-acao avatar-perfil" aria-label="Meu Perfil"">
                <span>{{ sigla }}</span>
            </RouterLink>
        </div>
    </header>
    
</template>

<script setup>
import { ref } from 'vue'

const sigla = ref("MH") 
</script>

<style scoped>
.cabecalho-principal {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 60px;
    padding: 0 30px;
    background-color: #ffffff;
    border-bottom: 1px solid var(--bege, #eae5df);
    width: 100%;
}

.acoes-direita {
    display: flex;
    gap: 15px;
}

.botao-acao {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    cursor: pointer;
    border: none;
}

.icone-busca {
    background-color: #eaf2ec;
}

.icone-busca img {
    width: 18px;
    height: 18px;
}

.avatar-perfil {
    border: 1.5px solid var(--verde); 
    background-color: #eaf2ec;
    color: var(--verde); 
    font-weight: 600;
    font-size: 16px;
}
</style>