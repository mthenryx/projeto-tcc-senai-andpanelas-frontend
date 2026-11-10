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
              <div class="avatar-placeholder" :class="{ 'tem-foto': form.fotoPerfilUrl, 'input-erro': erroFoto }">
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
            <span v-if="erroFoto" class="texto-erro">A foto de perfil é obrigatória.</span>

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
                maxlength="15" required :class="{ 'input-erro': erroSenha }" @input="limparErroSenha" />
              <button type="button" class="btn-mostrar" @click="mostrarSenha = !mostrarSenha">
                {{ mostrarSenha ? 'Ocultar' : 'Mostrar' }}
              </button>
            </div>
          </div>

          <div class="campo-grupo">
            <label>Confirmar senha</label>
            <div class="input-senha-wrapper">
              <input :type="mostrarConfirmarSenha ? 'text' : 'password'" placeholder="********"
                v-model="form.confirmarSenha" maxlength="15" required :class="{ 'input-erro': erroSenha }" @input="limparErroSenha" />
              <button type="button" class="btn-mostrar" @click="mostrarConfirmarSenha = !mostrarConfirmarSenha">
                {{ mostrarConfirmarSenha ? 'Ocultar' : 'Mostrar' }}
              </button>
            </div>
            <span v-if="erroSenha" class="texto-erro">As senhas não coincidem.</span>
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

    <div v-if="exibirModal" class="modal-overlay">
      <div class="modal-card">
        <button type="button" class="btn-voltar-modal" @click="fecharModal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>

        <div class="badge-seguranca">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          <span>Verificação de Segurança</span>
        </div>

        <h2 class="titulo-modal">Código enviado!</h2>
        <p class="descricao-modal">
          Enviamos um código de 6 dígitos para <strong>{{ form.email }}</strong>. Insira-o abaixo para continuar:
        </p>

        <div class="codigo-inputs">
          <input
            v-for="(digito, index) in codigo"
            :key="index"
            ref="codigoInputRefs"
            type="text"
            maxlength="1"
            v-model="codigo[index]"
            @input="handleInputCodigo(index, $event)"
            @keydown.delete="handleDeleteCodigo(index, $event)"
          />
        </div>

        <button type="button" class="btn-verificar" @click="verificarCodigo">
          Verificar código
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>

        <div class="rodape-modal">
          <span>Não recebeu?</span>
          <button 
            type="button" 
            class="btn-reenviar" 
            :disabled="tempoRestante > 0"
            @click="reenviarCodigo"
          >
            Reenviar código
            <span v-if="tempoRestante > 0" class="timer-texto">(em {{ tempoFormatado }})</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onUnmounted } from 'vue'
import BannerEsquerdo from '@/components/BannerEsquerdo.vue'

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const uploadPreset = import.meta.env.VITE_CLOUDINARY_PRESET

const mostrarSenha = ref(false)
const mostrarConfirmarSenha = ref(false)
const inputFotoRef = ref(null)
const inputDataRef = ref(null)
const carregandoFoto = ref(false)

const fotoPreview = ref('')
const erroSenha = ref(false)
const erroFoto = ref(false)

const exibirModal = ref(false)
const codigo = reactive(['', '', '', '', '', ''])
const codigoInputRefs = ref([])
const tempoRestante = ref(45)
let timerInterval = null

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

const tempoFormatado = computed(() => {
  const minutos = String(Math.floor(tempoRestante.value / 60)).padStart(2, '0')
  const segundos = String(tempoRestante.value % 60).padStart(2, '0')
  return `${minutos}:${segundos}`
})

const dispararInputFoto = () => {
  inputFotoRef.value.click()
}

const handleFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png']
  if (!tiposPermitidos.includes(file.type)) {
    return
  }

  erroFoto.value = false
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
    } else {
      throw new Error('Falha ao gerar URL no Cloudinary.')
    }
  } catch (error) {
    console.error('Erro no upload:', error)
  } finally {
    carregandoFoto.value = false
  }
}

const abrirCalendario = () => {
  if (inputDataRef.value && typeof inputDataRef.value.showPicker === 'function') {
    inputDataRef.value.showPicker()
  }
}

const limparErroSenha = () => {
  erroSenha.value = false
}

const iniciarTimer = () => {
  tempoRestante.value = 45
  if (timerInterval) clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    if (tempoRestante.value > 0) {
      tempoRestante.value--
    } else {
      clearInterval(timerInterval)
    }
  }, 1000)
}

const handleSubmit = () => {
  let valido = true

  if (!form.fotoPerfilUrl) {
    erroFoto.value = true
    valido = false
  } else {
    erroFoto.value = false
  }

  if (form.senha !== form.confirmarSenha) {
    erroSenha.value = true
    valido = false
  } else {
    erroSenha.value = false
  }

  if (!valido) return

  exibirModal.value = true
  iniciarTimer()
}

const fecharModal = () => {
  exibirModal.value = false
  if (timerInterval) clearInterval(timerInterval)
}

const handleInputCodigo = (index, event) => {
  const val = event.target.value
  if (val && index < 5 && codigoInputRefs.value[index + 1]) {
    codigoInputRefs.value[index + 1].focus()
  }
}

const handleDeleteCodigo = (index, event) => {
  if (!codigo[index] && index > 0 && codigoInputRefs.value[index - 1]) {
    codigoInputRefs.value[index - 1].focus()
  }
}

const verificarCodigo = () => {
  const codigoCompleto = codigo.join('')
  console.log('Código para verificação:', codigoCompleto)
}

const reenviarCodigo = () => {
  if (tempoRestante.value === 0) {
    console.log('Reenviando código para:', form.email)
    iniciarTimer()
  }
}

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
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
  background-color: var(--cinza-claro);
  overflow-y: auto;
  padding: 50px 20px;
  box-sizing: border-box;
}

.formulario-wrapper {
  width: 100%;
  max-width: 420px;
  color: var(--marrom);
  align-self: center;
  margin-top: 100px;
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

.input-erro {
  border-color: #e53935 !important;
}

.texto-erro {
  font-size: 11px;
  color: #e53935;
  margin-top: 4px;
  font-family: 'Nunito', sans-serif;
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

.avatar-preview {
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-card {
  background-color: #fff;
  border-radius: 28px;
  padding: 36px 40px;
  width: 100%;
  max-width: 460px;
  box-sizing: border-box;
  position: relative;
  border: 1px solid #efeae1;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.btn-voltar-modal {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #efeae1;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #3b2314;
  margin-bottom: 24px;
}

.badge-seguranca {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: #eaf4f0;
  color: #5b9a8b;
  padding: 6px 12px;
  border-radius: 14px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 16px;
}

.titulo-modal {
  font-family: 'Playfair Display', serif;
  font-size: 32px;
  font-weight: 700;
  color: #3b2314;
  margin-bottom: 12px;
}

.descricao-modal {
  font-size: 14px;
  color: #7a7267;
  line-height: 1.5;
  margin-bottom: 28px;
}

.descricao-modal strong {
  color: #3b2314;
}

.codigo-inputs {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 28px;
}

.codigo-inputs input {
  width: 54px;
  height: 58px;
  border-radius: 12px;
  border: 1px solid #e2ded5;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: #3b2314;
  outline: none;
  background-color: #fff;
}

.codigo-inputs input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.btn-verificar {
  width: 100%;
  height: 52px;
  background-color: #7ebd9b;
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-bottom: 24px;
}

.rodape-modal {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #7a7267;
}

.btn-reenviar {
  background: none;
  border: none;
  color: #5b9a8b;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  font-size: 13px;
}

.btn-reenviar:disabled {
  cursor: not-allowed;
  opacity: 0.8;
}

.timer-texto {
  color: #9a948a;
  font-weight: normal;
}

@media (max-width: 768px) {
  .corpo {
    position: relative;
    flex-direction: column;
    height: auto;
    min-height: 100vh;
    overflow-x: hidden;
  }

  :deep(.banner) {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: auto;
  }

  :deep(.overlay) {
    background-color: rgba(0, 0, 0, 0.45);
  }

  :deep(.banner-content) {
    display: none;
  }

  .container-formulario {
    position: relative;
    z-index: 4;
    flex: 1;
    background-color: transparent;
    overflow-y: visible;
    padding: 50px 20px;
  }

  .cabecalho h2 {
    color: var(--amarelo, #f1ae2b);
  }

  .cabecalho p,
  .campo-grupo label,
  .texto-instrucao,
  .campo-termos,
  .rodape-login {
    color: #ffffff;
  }

  .link-entrar {
    color: var(--verde, #72bca5);
  }
}

@media (max-width: 480px) {
  .corpo > :first-child {
    display: none;
  }

  .corpo {
    height: auto;
    min-height: 100vh;
    overflow-y: auto;
    background-color: #fcfaf6;
  }

  .container-formulario {
    padding: 24px 20px 40px 20px;
    background-color: #fcfaf6;
  }

  .formulario-wrapper {
    margin-top: 0;
    max-width: 100%;
  }

  .cabecalho h2 {
    font-size: 1.5rem;
    color: #2b1c19;
    margin-bottom: 4px;
  }

  .cabecalho p {
    font-size: 0.85rem;
    color: #8c857b;
  }

  .campo-grupo label {
    color: #2b1c19;
    font-size: 0.85rem;
  }

  .campo-grupo input[type="text"],
  .campo-grupo input[type="email"],
  .campo-grupo input[type="date"],
  .campo-grupo input[type="password"] {
    background-color: #fcfaf6;
    border: 1px solid #efeae1;
    border-radius: 12px;
    min-height: 48px;
    font-size: 0.9rem;
    color: #2b1c19;
  }

  .avatar-placeholder {
    width: 64px;
    height: 64px;
    background-color: #fcfaf6;
    border: 1px solid #d4cebe;
  }

  .texto-instrucao {
    color: #8c857b;
  }

  .link-carregar {
    color: #72bca5;
  }

  .btn-criar {
    min-height: 52px;
    border-radius: 12px;
    background-color: #72bca5;
    font-size: 1rem;
    font-weight: 600;
  }

  .campo-termos {
    color: #8c857b;
  }

  .campo-termos a {
    color: #72bca5;
  }

  .rodape-login {
    color: #8c857b;
  }

  .link-entrar {
    color: #72bca5;
  }

  .modal-card {
    padding: 24px 20px;
    border-radius: 20px;
    max-width: 100%;
    margin: 0 16px;
  }

  .btn-voltar-modal {
    margin-bottom: 16px;
  }

  .titulo-modal {
    font-size: 1.5rem;
    margin-bottom: 8px;
  }

  .descricao-modal {
    font-size: 0.85rem;
    margin-bottom: 20px;
  }

  .codigo-inputs {
    gap: 6px;
    margin-bottom: 20px;
  }

  .codigo-inputs input {
    width: 42px;
    height: 48px;
    font-size: 18px;
    border-radius: 8px;
  }

  .btn-verificar {
    height: 48px;
    font-size: 0.95rem;
    margin-bottom: 16px;
  }

  .rodape-modal {
    font-size: 0.8rem;
  }
}
</style>