<template>
  <div class="popup-card">
    <button v-if="mostrarBotaoVoltar" type="button" class="btn-voltar" @click="$emit('voltar')" aria-label="Voltar">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
    </button>

    <div class="badge-seguranca">
      <span class="icone-email">✉</span>
      <span>Verificação de Segurança</span>
    </div>

    <h2>Código enviado!</h2>
    <p class="descricao">
      Enviamos um código de 6 dígitos para <span class="email-usuario">{{ email }}</span>. Insira-o abaixo para
      continuar:
    </p>

    <div class="codigo-inputs" @paste.prevent="handlePaste">
      <input
        v-for="(digito, index) in codigo"
        :key="index"
        ref="inputRefs"
        type="text"
        inputmode="numeric"
        maxlength="1"
        class="input-digito"
        v-model="codigo[index]"
        @input="handleInput(index, $event)"
        @keydown.delete="handleDelete(index)"
      />
    </div>

    <p v-if="erro" class="mensagem-erro">{{ erro }}</p>
    <p v-if="sucesso" class="mensagem-sucesso">{{ sucesso }}</p>

    <button
      type="button"
      class="btn-verificar"
      :disabled="carregando || codigoCompleto.length < 6"
      @click="confirmarCodigo"
    >
      {{ carregando ? 'Verificando...' : 'Verificar código' }}
      <svg v-if="!carregando" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
        style="margin-left: 6px;">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    </button>

    <div class="popup-rodape">
      <span class="texto-nao-recebeu">Não recebeu?</span>
      <a href="#" @click.prevent="reenviarCodigo" class="link-reenviar" :class="{ 'desativado': tempoRestante > 0 }">
        Reenviar código
        <span class="tempo" v-if="tempoRestante > 0">({{ formatarTempo }})</span>
      </a>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, onUnmounted } from 'vue'

defineProps({
  email: {
    type: String,
    default: 'seu@email.com'
  },
  mostrarBotaoVoltar: {
    type: Boolean,
    default: true
  },
  carregando: {
    type: Boolean,
    default: false
  },
  erro: {
    type: String,
    default: ''
  },
  sucesso: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['voltar', 'verificar', 'reenviar'])

const codigo = reactive(['', '', '', '', '', ''])
const inputRefs = ref([])
const tempoRestante = ref(45)
let intervalo = null

const codigoCompleto = computed(() => codigo.join(''))

const formatarTempo = computed(() => {
  const minutos = Math.floor(tempoRestante.value / 60)
  const segundos = tempoRestante.value % 60
  return `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`
})

const iniciarTimer = (segundos = 45) => {
  clearInterval(intervalo)
  tempoRestante.value = segundos
  intervalo = setInterval(() => {
    if (tempoRestante.value > 0) {
      tempoRestante.value--
    } else {
      clearInterval(intervalo)
    }
  }, 1000)
}

const handleInput = (index, event) => {
  const apenasNumero = event.target.value.replace(/\D/g, '')
  codigo[index] = apenasNumero.slice(-1)

  if (codigo[index] && index < 5 && inputRefs.value[index + 1]) {
    inputRefs.value[index + 1].focus()
  }
}

const handleDelete = (index) => {
  if (!codigo[index] && index > 0 && inputRefs.value[index - 1]) {
    inputRefs.value[index - 1].focus()
  }
}

const handlePaste = (event) => {
  const textoColado = (event.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, 6)
  if (!textoColado) return

  textoColado.split('').forEach((char, idx) => {
    codigo[idx] = char
  })

  const proximoIndice = Math.min(textoColado.length, 5)
  if (inputRefs.value[proximoIndice]) {
    inputRefs.value[proximoIndice].focus()
  }
}

const confirmarCodigo = () => {
  if (codigoCompleto.value.length === 6) {
    emit('verificar', codigoCompleto.value)
  }
}

const reenviarCodigo = () => {
  if (tempoRestante.value > 0) return
  iniciarTimer(60)
  emit('reenviar')
}

onMounted(() => {
  iniciarTimer(45)
})

onUnmounted(() => {
  clearInterval(intervalo)
})
</script>

<style scoped>
.mensagem-erro {
  background-color: #fdecea;
  color: #b71c1c;
  border: 1px solid #f5c6cb;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 13px;
  margin-bottom: 16px;
  text-align: center;
}

.mensagem-sucesso {
  background-color: #eaf4f0;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 13px;
  margin-bottom: 16px;
  text-align: center;
}

.btn-verificar:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.popup-card {
  background-color: var(--cinza-claro);
  width: 100%;
  max-width: 460px;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(74, 37, 18, 0.08);
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
  border: 1px solid var(--bege);
}

.btn-voltar {
  background: transparent;
  border: 1px solid rgba(140, 123, 115, 0.3);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--marrom);
  cursor: pointer;
  margin-bottom: 24px;
  transition: all 0.2s ease;
}

.btn-voltar:hover {
  background-color: rgba(114, 188, 165, 0.1);
  border-color: var(--verde-escuro);
}

.badge-seguranca {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: rgba(114, 188, 165, 0.15);
  color: var(--verde-escuro);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  width: fit-content;
  margin-bottom: 16px;
  font-family: 'Nunito', sans-serif;
}

.icone-email {
  font-size: 13px;
}

.popup-card h2 {
  font-family: 'Playfair Display', serif;
  font-size: 32px;
  font-weight: 700;
  color: var(--marrom);
  margin-bottom: 12px;
  line-height: 1.1;
}

.descricao {
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  color: var(--cinza);
  line-height: 1.5;
  margin-bottom: 32px;
}

.email-usuario {
  color: var(--marrom);
  font-weight: 600;
}

.codigo-inputs {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 32px;
}

.input-digito {
  width: 54px;
  height: 60px;
  border: 1px solid rgba(140, 123, 115, 0.3);
  border-radius: 12px;
  background-color: #ffffff;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  color: var(--marrom);
  outline: none;
  transition: all 0.2s ease;
}

.input-digito:focus {
  border-color: var(--azul);
  box-shadow: 0 0 0 3px rgba(106, 170, 250, 0.15);
}

.btn-verificar {
  width: 100%;
  background-color: var(--verde-escuro);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-bottom: 24px;
  font-family: 'Inter', sans-serif;
}

.btn-verificar:hover {
  background-color: var(--verde);
}

.popup-rodape {
  text-align: center;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.texto-nao-recebeu {
  color: var(--cinza);
}

.link-reenviar {
  color: var(--verde-escuro);
  font-weight: 600;
  text-decoration: none;
}

.link-reenviar:hover:not(.desativado) {
  text-decoration: underline;
}

.link-reenviar.desativado {
  color: var(--cinza);
  cursor: not-allowed;
}

.tempo {
  color: var(--cinza);
  font-weight: 400;
}

@media (max-width: 480px) {
  .popup-card {
    background-color: transparent;
    border: none;
    box-shadow: none;
    padding: 0;
    max-width: 100%;
  }

  .badge-seguranca {
    display: none;
  }

  .popup-card h2 {
    font-size: 1.6rem;
    color: #2b1c19;
    margin-bottom: 8px;
  }

  .codigo-inputs {
    gap: 6px;
    margin-bottom: 24px;
  }

  .input-digito {
    width: 44px;
    height: 52px;
    border-radius: 12px;
    border: 1px solid #efeae1;
    background-color: #fcfaf6;
    font-size: 20px;
  }

  .input-digito:focus {
    border-color: #72bca5;
    box-shadow: 0 0 0 2px rgba(114, 188, 165, 0.2);
  }

  .btn-verificar {
    min-height: 52px;
    border-radius: 12px;
    background-color: #72bca5;
    font-size: 1rem;
    margin-bottom: 20px;
  }

  .popup-rodape {
    color: #8c857b;
    font-size: 0.85rem;
  }

  .link-reenviar {
    color: #72bca5;
  }
}
</style>