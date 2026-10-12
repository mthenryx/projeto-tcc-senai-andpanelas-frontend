<template>
  <div class="corpo">
    <!-- Banner Esquerdo -->
    <div class="banner">
      <div class="overlay"></div>
      <img src="/left-pane.png" alt="Uma pessoa cozinhando" class="fundo" />

      <section class="banner-content">
        <img src="/Logo_Panelas_em_branco.png" alt="Logo do Entre Panelas" class="logo" />

        <div class="text">
          <h1>Conecte-se pela <span class="amarelo">cozinha.</span></h1>
          <p>
            Descubra, crie e compartilhe receitas com pessoas que também amam cozinhar.<br />
            Uma rede social feita de sabor e afeto.
          </p>

          <hr class="linha-divisoria" />

          <div class="dados">
            <div class="dado-item">
              <h3>10k+</h3>
              <span>RECEITAS</span>
            </div>

            <div class="linha-vertical"></div>

            <div class="dado-item">
              <h3>45k+</h3>
              <span>COZINHEIROS</span>
            </div>

            <div class="linha-vertical"></div>

            <div class="dado-item">
              <h3>300+</h3>
              <span>COMUNIDADES</span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div class="login-container">
      <div class="login-card">
        <h1 class="title">Bem-vindo de volta!</h1>
        <p class="subtitle">Entre na sua conta para continuar</p>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="input-group">
            <label for="email">E-mail</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div class="input-group">
            <label for="password">Senha</label>
            <div class="password-wrapper">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                class="toggle-password"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? 'Ocultar' : 'Mostrar' }}
              </button>
            </div>
          </div>

          <div class="forgot-password">
            <a href="#">Esqueci a senha</a>
          </div>

          <button type="submit" class="btn-submit">
            Entrar
          </button>
        </form>

        <div class="divider">
          <span>OU CONTINUE COM</span>
        </div>

        <div class="signup-footer">
          <span>Não tem conta? </span>
          <a href="#">Cadastre-se</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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

/* BANNER ESQUERDO */
.banner {
  position: relative;
  width: 50%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.fundo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.banner-content {
  position: relative;
  z-index: 3;
  color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3.5rem 4rem;
}

.logo {
  height: 80px;
  width: auto;
  align-self: flex-start;
}

.text h1 {
  font-family: 'Playfair Display', 'Merriweather', serif;
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1rem;
}

.amarelo {
  color: var(--amarelo, #f1ae2b);
  font-family: 'Playfair Display', 'Merriweather', serif;
}

.text p {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #e0e0e0;
  margin-bottom: 2rem;
  max-width: 480px;
}

.linha-divisoria {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 1.8rem;
}

.dados {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.dado-item h3 {
  font-family: 'Playfair Display', 'Merriweather', serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--amarelo, #f1ae2b);
  margin-bottom: 0.2rem;
}

.dado-item span {
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  color: #d0d0d0;
  font-weight: 600;
}

.linha-vertical {
  width: 1px;
  height: 35px;
  background-color: rgba(255, 255, 255, 0.2);
}

/* LADO DIREITO (LOGIN) */
.login-container {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #ffffff;
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
}

.forgot-password a {
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