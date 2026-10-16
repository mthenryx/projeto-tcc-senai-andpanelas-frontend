<template>
  <div class="corpo">
    <BannerEsquerdo :tipo="1" />

    <div class="login-container">
      <div class="login-card">
        <h1 class="title">Bem-vindo de volta!</h1>
        <p class="subtitle">Entre na sua conta para continuar</p>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="input-group">
            <label for="email">E-mail</label>
            <input id="email" v-model="email" type="email" placeholder="seu@email.com" maxlength="256" required />
          </div>

          <div class="input-group">
            <label for="password">Senha</label>
            <div class="password-wrapper">
              <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••"
                maxlength="15" required />
              <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                {{ showPassword ? 'Ocultar' : 'Mostrar' }}
              </button>
            </div>
          </div>

          <router-link to="/recuperar-senha" class="forgot-password">Esqueci a senha</router-link>

          <button type="submit" class="btn-submit">
            Entrar
          </button>
        </form>

        <div class="divider">
          <span>OU CONTINUE COM</span>
        </div>

        <div class="signup-footer">
          <span>Não tem conta? </span>
          <router-link to="/cadastro" class="link-cadastre">Cadastre-se</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BannerEsquerdo from '@/components/BannerEsquerdo.vue'

const email = ref('')
const password = ref('')
const showPassword = ref(false)

function handleLogin() {
  alert(`Tentando logar com e-mail: ${email.value}`)
}
</script>

<style scoped>
.corpo {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* LADO DIREITO (LOGIN) */
.login-container {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--cinza-claro, #ffffff);
  padding: 2rem;
}

.login-card {
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
}

.title {
  font-family: 'Playfair Display', 'Merriweather', serif;
  font-size: 1.85rem;
  font-weight: 700;
  color: var(--marrom, #4a2512);
  margin-bottom: 0.25rem;
}

.subtitle {
  font-size: 0.9rem;
  color: #8c8c8c;
  margin-bottom: 1.75rem;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.input-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--marrom, #4a2512);
  margin-bottom: 0.4rem;
}

.input-group input {
  width: 100%;
  padding: 0.75rem 0.9rem;
  border: 1px solid #e2ded8;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  background-color: #ffffff;
  color: #333;
}

.input-group input::placeholder {
  color: #b5b5b5;
}

.input-group input:focus {
  border-color: var(--verde, #72bca5);
}

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.toggle-password {
  position: absolute;
  right: 0.8rem;
  background: none;
  border: none;
  color: var(--verde, #72bca5);
  font-size: 0.85rem;
  cursor: pointer;
  font-weight: 500;
}

.forgot-password {
  margin-bottom: 1.25rem;
  text-align: left;
  color: var(--verde, #72bca5);
  font-size: 0.8rem;
  text-decoration: none;
  font-weight: 500;
}

.btn-submit {
  width: 100%;
  background-color: var(--verde, #72bca5);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 0.8rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-submit:hover {
  opacity: 0.9;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.75rem 0 1.25rem 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e8e4df;
}

.divider span {
  padding: 0 0.75rem;
  font-size: 0.75rem;
  color: #a0a0a0;
  font-weight: 500;
  letter-spacing: 0.03em;
}

.signup-footer {
  text-align: center;
  font-size: 0.85rem;
  color: #777777;
}

.signup-footer a {
  color: var(--verde, #72bca5);
  text-decoration: none;
  font-weight: 500;
}
</style>