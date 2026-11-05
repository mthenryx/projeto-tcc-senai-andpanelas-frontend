<template>
    <div class="perfil-layout">
        <BarraNavegacao />

        <main class="conteudo-principal">
            <div class="topo-pagina">
                <button class="botao-icone-1" @click="voltarPerfil" aria-label="Voltar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>
            </div>

            <div class="conteudo-container">
                <div class="cabecalho-sair">
                    <div class="cabecalho-titulo">
                        <h1>Editar perfil</h1>
                        <p>Atualize as informações que aparecem no seu perfil.</p>
                    </div>
                    <button class="botao-sair" @click="sairDaConta" aria-label="Sair da conta">
                        <img src="../../public/icon_sair.png" alt="Sair" class="icone-sair" />
                    </button>
                </div>

                <div class="card-formulario">
                    <div class="secao-capa-grupo">
                        <span class="label-secao">Imagem de capa</span>
                        <div 
                            class="banner-edicao" 
                            :style="form.bannerUrl ? { backgroundImage: `url(${form.bannerUrl})` } : {}"
                        >
                            <div class="avatar-edicao-wrapper" @click="dispararInputFoto">
                                <UserAvatar 
                                    :fotoUrl="form.fotoPerfilUrl" 
                                    :nome="form.nomeCompleto" 
                                    tamanho="80"
                                    borda="white"
                                    sombra
                                    :tamanhoFonte="28"
                                />
                                <div class="icone-camera-overlay">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                        <circle cx="12" cy="13" r="4"></circle>
                                    </svg>
                                </div>
                            </div>

                            <button type="button" class="botao-alterar-capa" @click="dispararInputBanner">
                                <img src="../../public/icon_paisagem.png" alt="Ícone Imagem" class="icone-img-capa" />
                                <span>Alterar capa</span>
                            </button>
                        </div>
                    </div>

                    <input 
                        type="file" 
                        ref="inputFotoRef" 
                        @change="handleFotoChange" 
                        accept="image/png, image/jpeg, image/jpg"
                        style="display: none;" 
                    />

                    <input 
                        type="file" 
                        ref="inputBannerRef" 
                        @change="handleBannerChange" 
                        accept="image/png, image/jpeg, image/jpg"
                        style="display: none;" 
                    />

                    <div class="campos-grid">
                        <div class="campo-grupo">
                            <label>Nome de exibição</label>
                            <input type="text" v-model="form.nomeCompleto" maxlength="150" required/>
                        </div>

                        <div class="campo-grupo">
                            <label>Nome de usuário</label>
                            <input type="text" v-model="form.nomeUsuario" maxlength="20" required />
                        </div>
                    </div>

                    <div class="campo-grupo bio-grupo">
                        <label>Bio</label>
                        <textarea v-model="form.descricao" rows="3" maxlength="200"></textarea>
                        <span class="bio-helper">Sua bio aparecerá abaixo do nome no perfil.</span>
                    </div>

                    <div class="acoes-formulario">
                        <button type="button" class="btn-cancelar" @click="voltarPerfil">Cancelar</button>
                        <button type="button" class="btn-salvar" @click="salvarPerfil">Salvar</button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import BarraNavegacao from '@/components/BarraNavegacao.vue'
import UserAvatar from '@/components/UserAvatar.vue'

const router = useRouter()

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const uploadPreset = import.meta.env.VITE_CLOUDINARY_PRESET

const inputFotoRef = ref(null)
const inputBannerRef = ref(null)

const form = reactive({
    nomeCompleto: 'Ana Costa',
    nomeUsuario: 'anacosta',
    descricao: 'Chef caseira apaixonada por comida brasileira.',
    fotoPerfilUrl: '',
    bannerUrl: ''
})

const dispararInputFoto = () => {
    inputFotoRef.value.click()
}

const dispararInputBanner = () => {
    inputBannerRef.value.click()
}

const uploadParaCloudinary = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
    })

    const data = await response.json()
    if (data.secure_url) {
        return data.secure_url
    }
    throw new Error('Falha no upload para o Cloudinary')
}

const handleFotoChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
        const url = await uploadParaCloudinary(file)
        form.fotoPerfilUrl = url
    } catch (error) {
        console.error('Erro ao enviar foto de perfil:', error)
        alert('Erro ao carregar a foto. Tente novamente.')
    }
}

const handleBannerChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
        const url = await uploadParaCloudinary(file)
        form.bannerUrl = url
    } catch (error) {
        console.error('Erro ao enviar banner:', error)
        alert('Erro ao carregar o banner. Tente novamente.')
    }
}

const voltarPerfil = () => {
    router.push('/perfil')
}

const sairDaConta = () => {
    router.push('/')
}

const salvarPerfil = () => {
    console.log('Dados salvos:', form)
    router.push('/perfil')
}
</script>

<style scoped>
.perfil-layout {
    display: flex;
    min-height: 100vh;
    background-color: var(--cinza-claro);
}

.cabecalho-sair {
    display: flex;
    justify-content: space-between;
}

.conteudo-principal {
    flex: 1;
    margin-left: 200px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding-bottom: 40px;
}

.topo-pagina {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 40px;
    background-color: var(--verde);
}

.botao-icone-1 {
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

.botao-sair {
    background-color: transparent;
    border: none;
    transition: background-color 0.2s, transform 0.2s;
    cursor: pointer;
}

.botao-icone:hover {
    background-color: var(--bege);
    transform: scale(1.05);
}

.icone-sair {
    width: 35px;
    height: auto;
    object-fit: contain;
}

.conteudo-container {
    padding: 40px;
    max-width: 1000px;
    width: 100%;
    box-sizing: border-box;
    align-self: center;
}

.cabecalho-titulo {
    margin-bottom: 24px;
}

.cabecalho-titulo h1 {
    font-family: "Inter", sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: var(--marrom);
    margin-bottom: 4px;
}

.cabecalho-titulo p {
    font-size: 14px;
    color: var(--cinza);
}

.card-formulario {
    background-color: #FFFFFF;
    border-radius: 20px;
    border: 1px solid var(--bege);
    padding: 32px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-top: 20px;
}

.secao-capa-grupo {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.label-secao {
    font-size: 14px;
    font-weight: 600;
    color: var(--marrom);
}

.banner-edicao {
    width: 100%;
    height: 180px;
    background-color: var(--bege);
    background-size: cover;
    background-position: center;
    border-radius: 12px;
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 16px;
    box-sizing: border-box;
}

.avatar-edicao-wrapper {
    position: relative;
    cursor: pointer;
    margin-bottom: -35px;
    width: 100px;
    z-index: 2;
    border-radius: 50%;
    background-color: #ffffff;
    padding: 2px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.icone-camera-overlay {
    position: absolute;
    bottom: 2px;
    right: 2px;
    background-color: var(--marrom);
    width: 35px;
    height: 35px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #ffffff;
}

.botao-alterar-capa {
    background-color: #ffffff;
    border: none;
    border-radius: 8px;
    padding: 8px 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    color: var(--marrom);
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    transition: background-color 0.2s;
}

.botao-alterar-capa:hover {
    background-color: var(--cinza-claro);
}

.icone-img-capa {
    width: 16px;
    height: 16px;
    object-fit: contain;
}

.campos-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 20px;
}

.campo-grupo {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.campo-grupo label {
    font-size: 13px;
    font-weight: 600;
    color: var(--marrom);
}

.campo-grupo input,
.campo-grupo textarea {
    padding: 12px 14px;
    border: 1px solid var(--cinza-branco);
    border-radius: 8px;
    font-size: 14px;
    font-family: "Inter", sans-serif;
    outline: none;
    background-color: #FFFFFF;
    color: var(--marrom);
    transition: border-color 0.2s;
}

.campo-grupo input:focus,
.campo-grupo textarea:focus {
    border-color: var(--verde-escuro);
}

.bio-grupo {
    width: 100%;
}

.bio-helper {
    font-size: 12px;
    color: var(--cinza);
}

.acoes-formulario {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    border-top: 1px solid var(--cinza-branco);
    padding-top: 20px;
}

.btn-cancelar {
    background: none;
    border: 1px solid var(--cinza-branco);
    color: var(--marrom);
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-cancelar:hover {
    background-color: var(--cinza-claro);
}

.btn-salvar {
    background-color: var(--verde);
    border: none;
    color: #FFFFFF;
    padding: 10px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-salvar:hover {
    background-color: var(--verde-escuro);
}
</style>