<template>
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
</template>

<script setup></script>

<style scoped>
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
</style>