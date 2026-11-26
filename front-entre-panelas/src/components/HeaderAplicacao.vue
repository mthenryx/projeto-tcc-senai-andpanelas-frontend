<template>
    <header class="cabecalho-principal">
        <img src="/Logo_Panelas_em_marrom.png" alt="Entre Panelas" class="logo-mobile" />

        <div class="acoes-direita">
            
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
import { ref, onMounted } from 'vue'
import UserAvatar from '@/components/UserAvatar.vue'
import { getUsuarioLogado } from '@/services/usuarios'
import { authService } from '@/services/authService'

const gerarIniciais = (nome) => {
    if (!nome) return 'US'
    const partes = nome.trim().split(/\s+/)
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase()
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
}

const usuario = ref({
    nome: 'Usuário',
    iniciais: 'US',
    fotoUrl: ''
})

const preencherUsuario = (dados) => {
    if (!dados) return
    const nome = dados.nome_completo || dados.nome || 'Usuário'
    usuario.value = {
        nome,
        iniciais: gerarIniciais(nome),
        fotoUrl: dados.foto_perfil || dados.foto_url || dados.fotoUrl || ''
    }
}

onMounted(async () => {
    const userLocal = authService.getUser()
    if (userLocal) {
        preencherUsuario(userLocal)
    }

    try {
        const res = await getUsuarioLogado()
        const dadosApi = res?.response?.usuario || res?.response?.dados || res?.usuario || res?.dados || null
        if (dadosApi) {
            preencherUsuario(dadosApi)
            authService.setUser({ ...userLocal, ...dadosApi })
        }
    } catch {
        // Mantém os dados locais caso a requisição falhe
    }
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

.icone-busca img {
    width: 18px;
    height: 18px;
    filter: brightness(0) saturate(100%) invert(77%) sepia(19%) saturate(550%) hue-rotate(93deg) brightness(91%) contrast(86%);
}

.avatar-perfil-link {
    padding: 0;
    width: 42px;
    height: 42px;
    min-width: 42px;
    flex: 0 0 42px;
    overflow: hidden;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.avatar-perfil-link :deep(.user-avatar-component) {
    width: 100% !important;
    height: 100% !important;
    min-width: 100% !important;
    min-height: 100% !important;
    max-width: 100% !important;
    max-height: 100% !important;
}

.avatar-perfil-link :deep(.avatar-img) {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
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

    .avatar-perfil-link {
        width: 36px;
        height: 36px;
        min-width: 36px;
        flex-basis: 36px;
    }

    .icone-busca {
        background-color: transparent;
    }
}
</style>