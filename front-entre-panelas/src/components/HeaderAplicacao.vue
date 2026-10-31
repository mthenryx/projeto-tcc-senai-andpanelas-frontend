<template>
    <header class="cabecalho-principal">
        <div class="acoes-direita">
            <RouterLink to="/buscar-receita" class="botao-acao icone-busca" aria-label="Buscar">
                <img src="../../public/iconPaginas/lupa_icon_cinza.png" alt="Lupa">
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
    fotoUrl: 'https://scontent-gru1-2.cdninstagram.com/v/t51.82787-19/698639682_18046658729768224_4267229089232724908_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_cat=100&ccb=7-5&_nc_sid=f7ccc5&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=_Hlqnxw5KgsQ7kNvwHznJZt&_nc_oc=AdpOTgXi9wmBkvRiFsQh0OHRcRoYRwluTQNLMSeRp1kSBujknaPzbM-Gm57SEgGI3YE&_nc_zt=24&_nc_ht=scontent-gru1-2.cdninstagram.com&_nc_gid=uePqbqiCUXwT7NkwjvWReg&_nc_ss=7baaf&oh=00_AQTPAlF-B6g24PTmxlsq1hqLSkljSu28BAG0Y2jix1P9sg&oe=6AEB04FA' 
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
</style>