<template>
  <div class="pagina-recuperacao">

    <header class="topo-cabecalho">
      <div class="nav-esquerda">

        <button class="btn-voltar" @click="voltarEtapa" aria-label="Voltar">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <img src="../../public/Logo_Panelas_em_marrom.png" alt="Logo Entre Panelas" class="logo-topo" />
      </div>

      <div class="passos-container">
        <div class="passo" :class="{ ativo: etapaAtual >= 1, concluido: etapaAtual > 1 }">
          <span class="numero-passo">
            1. IDENTIFICAÇÃO <span v-if="etapaAtual > 1">✓</span>
          </span>
          <div class="barra-passo"></div>
        </div>

        <div class="passo" :class="{ ativo: etapaAtual >= 2, concluido: etapaAtual > 2 }">
          <span class="numero-passo">
            2. CÓDIGO ENVIADO <span v-if="etapaAtual > 2">✓</span>
          </span>
          <div class="barra-passo"></div>
        </div>

        <div class="passo" :class="{ ativo: etapaAtual >= 3 }">
          <span class="numero-passo">3. NOVA SENHA</span>
          <div class="barra-passo"></div>
        </div>
      </div>
    </header>

    <main class="conteudo-principal" id="conteudo-principal">

      <div class="card-recuperacao" v-if="etapaAtual === 1">
        <div class="badge-recuperacao">
          <span>Recuperação de Acesso</span>
        </div>

        <h1>Esqueceu a senha?</h1>
        <p class="descricao">
          Sem problema! Informe seu e-mail cadastrado e enviaremos um código de verificação para redefinir sua senha.
        </p>

        <div class="alerta-aviso">
          <span class="icone-alerta">📬</span>
          <span>Verifique sua caixa de entrada após o envio — o código chega em segundos!</span>
        </div>

        <form @submit.prevent="enviarCodigo" class="form-email">
          <div class="campo-grupo">
            <label>E-mail cadastrado</label>
            <div class="input-wrapper-email">
              <span class="icone-input">✉</span>
              <input type="email" v-model="email" placeholder="seu@email.com" required />
            </div>
          </div>

          <button type="submit" class="btn-enviar">
            Enviar código
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
              style="margin-left: 6px;">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </form>

        <div class="rodape-card">
          <span>Lembrou a senha?</span>
          <router-link to="/" class="link-entrar">Entrar</router-link>
        </div>
      </div>

      <PopUpValidacaoEmail v-else-if="etapaAtual === 2" :email="email" :mostrarBotaoVoltar="false"
        @voltar="etapaAtual = 1" @avancar="etapaAtual = 3" />

      <div class="card-recuperacao" v-else-if="etapaAtual === 3">
        <h1>Crie uma nova senha!</h1>

        <form @submit.prevent="salvarNovaSenha" class="form-nova-senha">
          <div class="campo-grupo">
            <label>Nova Senha</label>
            <div class="input-wrapper">
              <input type="password" v-model="novaSenha" placeholder="Digite sua nova senha" required />
            </div>
          </div>

          <div class="campo-grupo">
            <label>Repita Nova Senha</label>
            <div class="input-wrapper">
              <input type="password" v-model="confirmaSenha" placeholder="Confirme sua nova senha" required />
            </div>
          </div>

          <button type="submit" class="btn-enviar">
            Salvar Nova Senha
          </button>
        </form>
      </div>

    </main>

    <footer class="rodape-pagina">
      <span class="copyright">© 2026 Panelas. Todos os direitos reservados.</span>
      <div class="links-rodape">
        <a href="https://github.com/mthenryx/projeto-tcc-senai-4tech-andpanelas" target="_blank"
          rel="noopener noreferrer">Termos de Uso</a>
        <span class="separador">•</span>
        <a href="https://github.com/mthenryx/projeto-tcc-senai-4tech-andpanelas" target="_blank"
          rel="noopener noreferrer">Privacidade</a>
        <span class="separador">•</span>
        <a href="https://github.com/mthenryx/projeto-tcc-senai-4tech-andpanelas" target="_blank"
          rel="noopener noreferrer">Central de Ajuda</a>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PopUpValidacaoEmail from '../components/PopUpValidacaoEmail.vue'

const router = useRouter()
const email = ref('')
const novaSenha = ref('')
const confirmaSenha = ref('')
const etapaAtual = ref(1)

const enviarCodigo = () => {
  if (!email.value) return
  etapaAtual.value = 2
}

const voltarEtapa = () => {
  if (etapaAtual.value > 1) {
    etapaAtual.value--
  } else {
    router.push('/')
  }
}

const salvarNovaSenha = () => {
  if (novaSenha.value !== confirmaSenha.value) {
    alert('As senhas não coincidem!')
    return
  }

}
</script>

<style scoped>
.pagina-recuperacao {
  background-color: var(--cinza-claro);
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-x: hidden;
  box-sizing: border-box;
}

.topo-cabecalho {
  padding: 20px 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-bottom: 1px solid rgba(140, 123, 115, 0.15);
}

.nav-esquerda {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn-voltar {
  background: transparent;
  border: 1px solid rgba(140, 123, 115, 0.3);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--marrom);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-voltar:hover {
  background-color: rgba(114, 188, 165, 0.1);
  border-color: var(--verde-escuro);
}

.logo-topo {
  height: 32px;
  width: auto;
}

.passos-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 100%;
}

.passo {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.numero-passo {
  font-size: 11px;
  font-weight: 700;
  color: var(--cinza);
  letter-spacing: 0.05em;
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.passo.ativo .numero-passo,
.passo.concluido .numero-passo {
  color: var(--verde-escuro);
}

.barra-passo {
  height: 3px;
  width: 100%;
  background-color: var(--bege);
  border-radius: 2px;
  transition: background-color 0.3s ease;
}

.passo.ativo .barra-passo,
.passo.concluido .barra-passo {
  background-color: var(--verde-escuro);
}

.conteudo-principal {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.card-recuperacao {
  background-color: #ffffff;
  width: 100%;
  max-width: 480px;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(74, 37, 18, 0.04);
  border: 1px solid rgba(140, 123, 115, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.form-nova-senha {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.badge-recuperacao {
  background-color: rgba(140, 123, 115, 0.1);
  color: var(--cinza);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 16px;
  font-family: 'Nunito', sans-serif;
  border: 1px solid var(--marrom);
}

.card-recuperacao h1 {
  font-family: 'Playfair Display', serif;
  font-size: 32px;
  font-weight: 700;
  color: var(--marrom);
  margin-bottom: 24px;
  margin-left: -80px;
}

.descricao {
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  color: var(--cinza);
  line-height: 1.5;
  margin-bottom: 24px;
  max-width: 380px;
}

.alerta-aviso {
  background-color: rgba(114, 188, 165, 0.12);
  border: 1px solid rgba(114, 188, 165, 0.3);
  color: var(--verde-escuro);
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 13px;
  font-family: 'Nunito', sans-serif;
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
  margin-bottom: 24px;
  width: 100%;
  box-sizing: border-box;
}

.icone-alerta {
  font-size: 16px;
  flex-shrink: 0;
}

.form-email {
  width: 100%;
}

.campo-grupo {
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-bottom: 24px;
}

.campo-grupo label {
  font-size: 13px;
  font-weight: 600;
  color: var(--marrom);
  margin-bottom: 6px;
  font-family: 'Inter', sans-serif;
}

.input-wrapper,
.input-wrapper-email {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.icone-input {
  position: absolute;
  left: 14px;
  color: var(--cinza);
  font-size: 14px;
  pointer-events: none;
}

.seu-email {
  padding: 12px 14px 12px 40px;
}

.input-wrapper-email input {
  width: 100%;
  padding: 12px 14px 12px 40px;
  border: 1px solid rgba(140, 123, 115, 0.3);
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  background-color: #fff;
  color: var(--marrom);
  transition: all 0.2s ease;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
}

.input-wrapper input {
  width: 100%;
  padding: 12px 14px 12px 14px;
  border: 1px solid rgba(140, 123, 115, 0.3);
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  background-color: #fff;
  color: var(--marrom);
  transition: all 0.2s ease;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
}

.btn-enviar {
  width: 100%;
  background-color: var(--verde-escuro);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 14px;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-family: 'Inter', sans-serif;
}

.btn-enviar:hover {
  background-color: var(--verde);
}

.rodape-card {
  margin-top: 20px;
  font-size: 13px;
  font-family: 'Nunito', sans-serif;
  color: var(--cinza);
  display: flex;
  gap: 6px;
  justify-content: center;
}

.link-entrar {
  color: var(--verde-escuro);
  font-weight: 600;
  text-decoration: none;
}

.link-entrar:hover {
  text-decoration: underline;
}

.rodape-pagina {
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(140, 123, 115, 0.15);
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  color: var(--cinza);
}

.links-rodape {
  display: fLex;
  align-items: center;
  gap: 12px;
}

.links-rodape a {
  color: var(--cinza);
  text-decoration: none;
}

.links-rodape a:hover {
  color: var(--marrom);
  text-decoration: underline;
}

.separador {
  color: var(--bege);
}
</style>