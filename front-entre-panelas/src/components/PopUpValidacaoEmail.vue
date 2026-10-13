<template>
  <div class="popup-card">
    
    <!-- O botão de voltar interno só aparece se a prop for verdadeira -->
    <button v-if="mostrarBotaoVoltar" class="btn-voltar" @click="$emit('voltar')" aria-label="Voltar">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
      Enviamos um código de 6 dígitos para <span class="email-usuario">{{ email }}</span>. Insira-o abaixo para continuar:
    </p>

    <div class="codigo-inputs">
      <input type="text" maxlength="1" class="input-digito" />
      <input type="text" maxlength="1" class="input-digito" />
      <input type="text" maxlength="1" class="input-digito" />
      <input type="text" maxlength="1" class="input-digito" />
      <input type="text" maxlength="1" class="input-digito" />
      <input type="text" maxlength="1" class="input-digito" />
    </div>

    <!-- Botão de Verificar que avança para a próxima etapa -->
    <button class="btn-verificar" @click="$emit('avancar')">
      Verificar código 
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 6px;">
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
import { ref, computed, onMounted, onUnmounted } from 'vue'

defineProps({
  email: {
    type: String,
    default: 'seu@email.com'
  },
  // Nova prop para controlar a visibilidade do botão de voltar (padrão é true)
  mostrarBotaoVoltar: {
    type: Boolean,
    default: true
  }
})

defineEmits(['voltar', 'avancar'])

const tempoRestante = ref(45)
let intervalo = null

const formatarTempo = computed(() => {
  const minutos = Math.floor(tempoRestante.value / 60)
  const segundos = tempoRestante.value % 60
  return `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`
})

const iniciarTimer = () => {
  clearInterval(intervalo)
  intervalo = setInterval(() => {
    if (tempoRestante.value > 0) {
      tempoRestante.value--
    } else {
      clearInterval(intervalo)
    }
  }, 1000)
}

const reenviarCodigo = () => {
  if (tempoRestante.value > 0) return
  tempoRestante.value = 60
  iniciarTimer()
}

onMounted(() => {
  iniciarTimer()
})

onUnmounted(() => {
  clearInterval(intervalo)
})
</script>

<!-- Mantém os estilos do pop-up intactos -->
<style scoped>
/* (mantenha o teu CSS do pop-up aqui exatamente como estava) */
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
</style>