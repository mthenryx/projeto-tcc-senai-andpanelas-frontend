<template>
  <div class="recipe-banner-card" :style="{ backgroundImage: `url(${imagemUrl})` }">
    <div class="banner-overlay">
      <div v-if="badgeTexto" class="top-badge">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <polygon
            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
          </polygon>
        </svg>
        <span>{{ badgeTexto }}</span>
      </div>

      <div class="banner-content">
        <h2 class="banner-title">{{ titulo }}</h2>

        <div class="banner-metadata">
          <div class="author-info">
            <UserAvatar :fotoUrl="autorFotoUrl" :nome="autorNome" :iniciais="authorIniciais" tamanho="32" borda="white"
              sombra :tamanhoFonte="12" :pesoFonte="600" />
            <span class="author-name">{{ autorNome }}</span>
          </div>

          <div class="meta-divider">•</div>

          <div class="meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>{{ tempo }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import UserAvatar from '@/components/UserAvatar.vue';

defineProps({
  id: { type: [Number, String], required: true },
  imagemUrl: { type: String, required: true },
  titulo: { type: String, required: true },
  tempo: { type: String, required: true },
  porcoes: { type: String, required: true },
  custo: { type: String, required: true },
  autorNome: { type: String, required: true },
  authorIniciais: { type: String, required: true },
  autorFotoUrl: { type: String, default: '' },
  dificuldade: { type: String, required: true },
  badgeTexto: { type: String, default: 'Receita do Dia' }
});
</script>

<style scoped>
.recipe-banner-card {
  width: 100%;
  max-width: 1200px;
  height: 380px;
  border-radius: 20px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  position: relative;
  font-family: "Inter", sans-serif;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin: 16px auto;
  cursor: pointer;
}

.banner-overlay {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.75) 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px;
  box-sizing: border-box;
}

.top-badge {
  align-self: flex-start;
  background-color: var(--amarelo);
  color: var(--marrom);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.banner-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.banner-title {
  font-family: "Playfair Display", serif;
  font-size: 32px;
  font-weight: 700;
  color: #FFFFFF;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  margin: 0;
  line-height: 1.2;
}

.banner-metadata {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-name {
  color: #FFFFFF;
}

.meta-divider {
  color: rgba(255, 255, 255, 0.7);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>