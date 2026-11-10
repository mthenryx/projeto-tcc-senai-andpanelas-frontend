<template>
    <header class="cabecalho-principal">
        <img src="/Logo_Panelas_em_marrom.png" alt="Entre Panelas" class="logo-mobile" />

        <div class="acoes-direita">
            <RouterLink to="/buscar-receita" class="botao-acao icone-busca" aria-label="Buscar">
                <img src="/iconPaginas/lupa_icon_cinza.png" alt="Lupa">
            </RouterLink>
            
            <RouterLink to="/perfil" class="botao-acao avatar-perfil-link" aria-label="Meu Perfil">
                <UserAvatar 
                    :fotoUrl="usuario.fotoUrl" 
                    :nome="usuario.nome" 
                    :iniciais="usuario.iniciais" 
                    tamanho="42"
                    borda="verde"
                    corFundo="#eaf2ec"
                    corTexto="var(--verde)"
                    :tamanhoFonte="16"
                    :pesoFonte="600"
                />
            </RouterLink>
        </div>
    </header>
</template>

<script setup>
import { ref } from 'vue'
import UserAvatar from '@/components/UserAvatar.vue'

const usuario = ref({
    nome: 'Matheus',
    iniciais: 'MH',
    fotoUrl: 'https://media.licdn.com/dms/image/v2/D4D03AQGHaj4AP0MWpg/profile-displayphoto-crop_800_800/B4DaCifMl5GYAI-/0/1789432483109?e=1795651200&v=beta&t=Hf8gvB1VlsWK9iIfMUD_VrpaszCn9MSjhrNDcpahsB4' 
})
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

.logo-mobile {
    display: none;
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
    filter: brightness(0) saturate(100%) invert(77%) sepia(19%) saturate(550%) hue-rotate(93deg) brightness(91%) contrast(86%);
}

.avatar-perfil-link {
    padding: 0;
    overflow: visible;
}

@media (max-width: 480px) {
    .cabecalho-principal {
        justify-content: space-between;
        padding: 0 20px;
        height: 56px;
        background-color: white;
        border-bottom: 1px solid #efeae1;
    }

    .logo-mobile {
        display: block;
        height: 28px;
        width: auto;
    }

    .botao-acao {
        width: 36px;
        height: 36px;
    }

    .icone-busca {
        background-color: transparent;
    }
}
</style>