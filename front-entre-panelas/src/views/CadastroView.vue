<template>
  <div class="corpo">
    <BannerEsquerdo :tipo="2" />

    <div class="container-formulario">
      <div class="formulario-wrapper">
        <div class="cabecalho">
          <h2>Crie sua conta</h2>
          <p>Junte-se à maior comunidade de apaixonados por culinária</p>
        </div>

        <form @submit.prevent="handleSubmit">

          <div class="campo-grupo">
            <label class="label-titulo">Foto de perfil</label>
            <div class="upload-container" @click="dispararInputFoto">
              <div class="avatar-placeholder" :class="{ 'tem-foto': form.fotoPerfilUrl }">
                <img v-if="form.fotoPerfilUrl" :src="form.fotoPerfilUrl" alt="Foto de perfil" class="avatar-preview" />
                <img v-else src="/camera_icon.png" alt="Câmera" class="icone-camera-img" />

                <div class="botao-adicionar">+</div>
              </div>
              <div class="upload-info">
                <span class="texto-instrucao">
                  {{ form.fotoPerfilUrl ? 'Foto carregada com sucesso!' : 'Adicione sua melhor foto de cozinheiro(a)' }}
                </span>
                <span class="link-carregar">{{ form.fotoPerfilUrl ? 'Trocar foto' : 'Carregar foto' }}</span>
              </div>
            </div>

            <input type="file" ref="inputFotoRef" @change="handleFileChange" accept="image/png, image/jpeg, image/jpg"
              style="display: none;" />
          </div>

          <div class="campo-grupo">
            <label>Nome completo</label>
            <input type="text" placeholder="Seu nome e sobrenome" v-model="form.nomeCompleto" maxlength="150"
              required />
          </div>

          <div class="campo-grupo">
            <label>Nome de usuário</label>
            <input type="text" placeholder="@seusuario" v-model="form.nomeUsuario" maxlength="20" required />
          </div>

          <div class="campo-grupo">
            <label>E-mail</label>
            <input type="email" placeholder="seu@email.com" v-model="form.email" maxlength="256" required />
          </div>

          <div class="campo-grupo">
            <label>Data de nascimento</label>
            <div class="input-icone-wrapper" @click="abrirCalendario">
              <input type="date" ref="inputDataRef" placeholder="mm/dd/yyyy" v-model="form.dataNascimento"
                :max="dataMaximaPermitida" required class="input-com-icone" />
              <img src="/calendario_icon.png" alt="Calendário" class="icone-input-direito" />
            </div>
          </div>

          <div class="campo-grupo">
            <label>Senha</label>
            <div class="input-senha-wrapper">
              <input :type="mostrarSenha ? 'text' : 'password'" placeholder="********" v-model="form.senha"
                maxlength="15" required />
              <button type="button" class="btn-mostrar" @click="mostrarSenha = !mostrarSenha">
                {{ mostrarSenha ? 'Ocultar' : 'Mostrar' }}
              </button>
            </div>
          </div>

          <div class="campo-grupo">
            <label>Confirmar senha</label>
            <div class="input-senha-wrapper">
              <input :type="mostrarConfirmarSenha ? 'text' : 'password'" placeholder="********"
                v-model="form.confirmarSenha" maxlength="15" required />
              <button type="button" class="btn-mostrar" @click="mostrarConfirmarSenha = !mostrarConfirmarSenha">
                {{ mostrarConfirmarSenha ? 'Ocultar' : 'Mostrar' }}
              </button>
            </div>
          </div>

          <div class="campo-termos">
            <input type="checkbox" id="termos" v-model="form.aceitaTermos" required />
            <label for="termos">
              Li e concordo com os
              <a href="https://github.com/mthenryx/projeto-tcc-senai-4tech-andpanelas" target="_blank"
                rel="noopener noreferrer">Termos de Uso</a>
              e a
              <a href="https://github.com/mthenryx/projeto-tcc-senai-4tech-andpanelas" target="_blank"
                rel="noopener noreferrer">Política de Privacidade</a>.
            </label>
          </div>

          <button type="submit" class="btn-criar">Criar conta</button>

          <div class="rodape-login">
            <span>Já tem uma conta? </span>
            <router-link to="/" class="link-entrar">Entrar</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import BannerEsquerdo from '@/components/BannerEsquerdo.vue'

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const uploadPreset = import.meta.env.VITE_CLOUDINARY_PRESET

const mostrarSenha = ref(false)
const mostrarConfirmarSenha = ref(false)
const inputFotoRef = ref(null)
const inputDataRef = ref(null)
const carregandoFoto = ref(false)

const fotoPreview = ref('')

const form = reactive({
  nomeCompleto: '',
  nomeUsuario: '',
  email: '',
  dataNascimento: '',
  senha: '',
  confirmarSenha: '',
  aceitaTermos: false,
  fotoPerfilUrl: ''
})

const dataMaximaPermitida = computed(() => {
  const hoje = new Date()
  const ano = hoje.getFullYear() - 10
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  const dia = String(hoje.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
})

const dispararInputFoto = () => {
  inputFotoRef.value.click()
}

const handleFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png']
  if (!tiposPermitidos.includes(file.type)) {
    alert('Por favor, selecione apenas arquivos de imagem válidos (PNG ou JPG).')
    return
  }

  fotoPreview.value = URL.createObjectURL(file)

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)

  carregandoFoto.value = true

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    })

    const data = await response.json()

    if (data.secure_url) {
      form.fotoPerfilUrl = data.secure_url
      fotoPreview.value = data.secure_url
      console.log('Foto enviada com sucesso! URL:', form.fotoPerfilUrl)
    } else {
      throw new Error('Falha ao gerar URL no Cloudinary.')
    }
  } catch (error) {
    console.error('Erro no upload:', error)
    alert('Ocorreu um erro ao carregar a foto. Tente novamente.')
  } finally {
    carregandoFoto.value = false
  }
}

const abrirCalendario = () => {
  if (inputDataRef.value && typeof inputDataRef.value.showPicker === 'function') {
    inputDataRef.value.showPicker()
  }
}

const handleSubmit = () => {
  if (form.senha !== form.confirmarSenha) {
    alert('As senhas não coincidem!')
    return
  }
  console.log('Dados finais enviados para o backend:', form)
}
</script>

<style scoped>
.corpo {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

.container-formulario {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: var(--cinza-claro);
  overflow-y: auto;
  padding: 50px 20px;
  box-sizing: border-box;
}

.formulario-wrapper {
  width: 100%;
  max-width: 420px;
  color: var(--marrom);
}

.cabecalho {
  margin-bottom: 24px;
}

.cabecalho h2 {
  font-size: 28px;
  font-weight: 700;
  color: var(--marrom);
  margin-bottom: 6px;
  font-family: 'Playfair Display', serif;
}

.cabecalho p {
  font-size: 14px;
  color: var(--cinza);
  font-family: 'Nunito', sans-serif;
}

.campo-grupo {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}

.campo-grupo label {
  font-size: 13px;
  font-weight: 600;
  color: var(--marrom);
  margin-bottom: 6px;
}

.campo-grupo input[type="text"],
.campo-grupo input[type="email"],
.campo-grupo input[type="date"],
.campo-grupo input[type="password"] {
  padding: 12px 14px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  background-color: #fff;
  width: 100%;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
}

.campo-grupo input:focus {
  border-color: var(--verde-escuro);
}

.upload-container {
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  width: fit-content;
  padding: 4px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.upload-container:hover {
  background-color: rgba(114, 188, 165, 0.08);
}

.avatar-wrapper {
  position: relative;
  width: 56px;
  height: 56px;
  flex-shrink: 0;
}

.avatar-placeholder {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #f0f2f5;
  border: 1px dashed var(--cinza);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-shrink: 0;
  overflow: visible;
}

.avatar-placeholder.tem-foto {
  border: 2px solid var(--verde-escuro);
}

.icone-camera-img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.avatar-preview,
.icone-camera-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.icone-camera-img {
  width: 24px;
  height: 24px;
  object-fit: contain;
  border-radius: 0;
}

.botao-adicionar {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background-color: var(--verde-escuro);
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid white;
  z-index: 10;
}

.upload-info {
  display: flex;
  flex-direction: column;
}

.texto-instrucao {
  font-size: 12px;
  color: var(--cinza);
  margin-bottom: 2px;
  font-family: 'Nunito', sans-serif;
}

.link-carregar {
  font-size: 13px;
  color: var(--verde-escuro);
  font-weight: 600;
}

.input-icone-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.input-com-icone {
  padding-right: 40px !important;
}

.input-com-icone::-webkit-calendar-picker-indicator {
  background: transparent;
  bottom: 0;
  color: transparent;
  cursor: pointer;
  height: auto;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: auto;
}

.icone-input-direito {
  position: absolute;
  right: 12px;
  width: 18px;
  height: 18px;
  pointer-events: none;
  opacity: 0.7;
}

.input-senha-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-senha-wrapper input {
  padding-right: 65px;
}

.btn-mostrar {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: var(--verde-escuro);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.campo-termos {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12px;
  color: var(--cinza);
  margin: 20px 0;
  font-family: 'Nunito', sans-serif;
}

.campo-termos input {
  margin-top: 2px;
}

.campo-termos a {
  color: var(--verde-escuro);
  text-decoration: none;
}

.campo-termos a:hover {
  text-decoration: underline;
}

.btn-criar {
  width: 100%;
  padding: 12px;
  background-color: var(--verde-escuro);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  font-family: 'Inter', sans-serif;
}

.btn-criar:hover {
  background-color: var(--verde);
}

.rodape-login {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 13px;
  color: var(--cinza);
  font-family: 'Nunito', sans-serif;
}

.link-entrar {
  color: var(--verde-escuro);
  font-weight: 600;
  text-decoration: none;
}

.link-entrar:hover {
  text-decoration: underline;
}
</style>