<template>
  <div class="ranking-section">
   
    <div class="podium-gold">

      <div class="gold-image-side" :style="{ backgroundImage: `url(${ouro.imagemUrl})` }">
        <div class="gold-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
            </polygon>
          </svg>
          <span>#1 LUGAR • CAMPEÃ DA SEMANA</span>
        </div>
      </div>

      <div class="gold-content-side">
        <div class="gold-header">
          <div class="author-info">
            <div class="author-avatar" :style="{ backgroundColor: getAuthorColor(ouro.autorNome) }">
              {{ ouro.authorIniciais }}
            </div>
            <div class="author-details">
              <span class="author-label">Chef / Autor</span>
              <span class="author-name">{{ ouro.autorNome }}</span>
            </div>
          </div>
          <span class="gold-tag">Destaque Ouro</span>
        </div>

        <h2 class="gold-title">{{ ouro.titulo }}</h2>
        <p class="gold-desc">{{ ouro.descricao }}</p>

        <div class="gold-metrics">
          <div class="metric-box">
            <span class="metric-label">PREPARO</span>
            <span class="metric-value">{{ ouro.tempo }}</span>
          </div>
          <div class="metric-divider"></div>
          <div class="metric-box">
            <span class="metric-label">NÍVEL</span>
            <span class="metric-value">{{ ouro.dificuldade }}</span>
          </div>
        </div>

        <button class="action-btn gold-btn" @click="$emit('ver-receita', ouro.id)">
          Ver Receita Completa
        </button>
      </div>
    </div>

    <div class="podium-row">
      <div class="recipe-card-ranked">
        <div class="card-img-wrapper" :style="{ backgroundImage: `url(${prata.imagemUrl})` }">
          <span class="rank-badge badge-prata">#2 LUGAR • PRATA</span>
          <span class="time-floating">{{ prata.tempo }}</span>
        </div>

        <div class="card-body">
          <div class="author-small">
            <div class="author-avatar-small" :style="{ backgroundColor: getAuthorColor(prata.autorNome) }">
              {{ prata.authorIniciais }}
            </div>
            <span>Por {{ prata.autorNome }}</span>
          </div>

          <h3 class="card-title">{{ prata.titulo }}</h3>
          <p class="card-desc">{{ prata.descricao }}</p>

          <div class="card-info-bottom">
            <span>{{ prata.dificuldade }} • {{ prata.porcoes }}</span>
          </div>

          <button class="action-btn light-btn" @click="$emit('ver-receita', prata.id)">
            Ver Receita
          </button>
        </div>
      </div>

      <div class="recipe-card-ranked">
        <div class="card-img-wrapper" :style="{ backgroundImage: `url(${bronze.imagemUrl})` }">
          <span class="rank-badge badge-bronze">#3 LUGAR • BRONZE</span>
          <span class="time-floating">{{ bronze.tempo }}</span>
        </div>

        <div class="card-body">
          <div class="author-small">
            <div class="author-avatar-small" :style="{ backgroundColor: getAuthorColor(bronze.autorNome) }">
              {{ bronze.authorIniciais }}
            </div>
            <span>Por {{ bronze.autorNome }}</span>
          </div>

          <h3 class="card-title">{{ bronze.titulo }}</h3>
          <p class="card-desc">{{ bronze.descricao }}</p>

          <div class="card-info-bottom">
            <span>{{ bronze.dificuldade }} • {{ bronze.porcoes }}</span>
          </div>

          <button class="action-btn light-btn" @click="$emit('ver-receita', bronze.id)">
            Ver Receita
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  ouro: { type: Object, required: true },
  prata: { type: Object, required: true },
  bronze: { type: Object, required: true }
});

defineEmits(['ver-receita']);

const getAuthorColor = (name) => {
  const palette = ['#72bca5', '#f1ae2b', '#bc0b27', '#4a2512', '#6B1E2E', '#6aaafa', '#6366f1'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
};
</script>

<style scoped>
.ranking-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  font-family: "Inter", sans-serif;
}

.podium-gold {
  width: 100%;
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  border-radius: 20px;
  overflow: hidden;
  border: 1.5px solid #F3E3B6;
  background-color: #FFFFFF;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05);
}

.gold-image-side {
  width: 100%;
  min-height: 400px;
  background-size: cover;
  background-position: center;
  position: relative;
  padding: 20px;
  box-sizing: border-box;
}

.gold-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: #F7C948;
  color: #4A2512;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  letter-spacing: 0.3px;
}

.gold-content-side {
  background-color: #FFFFFF;
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
}

.gold-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.author-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 13px;
}

.author-details {
  display: flex;
  flex-direction: column;
}

.author-label {
  font-size: 11px;
  color: #8C827A;
  font-weight: 500;
}

.author-name {
  font-size: 14px;
  color: #2D241E;
  font-weight: 700;
}

.gold-tag {
  color: #B27B12;
  border: 1px solid #F3E3B6;
  padding: 5px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  background-color: #FFFDF8;
}

.gold-title {
  font-family: "Playfair Display", serif;
  font-size: 26px;
  color: #2D241E;
  margin-bottom: 8px;
  line-height: 1.25;
  font-weight: 700;
}

.gold-desc {
  font-size: 13px;
  color: #6E655F;
  margin-bottom: 16px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.gold-metrics {
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-top: 1px solid #EFEAE1;
  border-bottom: 1px solid #EFEAE1;
  padding: 12px 0;
  margin-bottom: 16px;
  text-align: center;
}

.metric-box {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.metric-divider {
  width: 1px;
  height: 28px;
  background-color: #EFEAE1;
}

.metric-label {
  font-size: 10px;
  color: #9C938C;
  font-weight: 700;
  letter-spacing: 0.6px;
}

.metric-value {
  font-size: 15px;
  color: #2D241E;
  font-weight: 700;
}

.action-btn {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s;
}

.action-btn:hover {
  opacity: 0.92;
}

.gold-btn {
  background-color: #52AB8B;
  color: #FFFFFF;
}

.podium-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.recipe-card-ranked {
  background-color: #FFFFFF;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid var(--bege);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.card-img-wrapper {
  height: 220px;
  background-size: cover;
  background-position: center;
  position: relative;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  box-sizing: border-box;
}

.rank-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  color: #FFFFFF;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.badge-prata {
  background-color: #718096;
}

.badge-bronze {
  background-color: #C05621;
}

.time-floating {
  background-color: rgba(0, 0, 0, 0.65);
  color: #FFFFFF;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

.card-body {
  padding: 20px;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.author-small {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 13px;
  color: #6E655F;
  font-weight: 500;
}

.author-avatar-small {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 11px;
}

.card-title {
  font-family: "Playfair Display", serif;
  font-size: 20px;
  color: #2D241E;
  margin-bottom: 8px;
  line-height: 1.25;
}

.card-desc {
  font-size: 13px;
  color: #6E655F;
  margin-bottom: 16px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-info-bottom {
  font-size: 13px;
  color: #8C827A;
  margin-bottom: 16px;
  margin-top: auto;
}

.light-btn {
  background-color: #F7F4EC;
  color: #2D241E;
}
</style>