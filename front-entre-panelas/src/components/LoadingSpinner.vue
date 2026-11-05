<template>
  <div class="spinner-container">
    <div class="spinner" :style="spinnerStyle"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  tamanho: {
    type: [Number, String],
    default: 36
  },
  espessura: {
    type: [Number, String],
    default: 4
  }
})

const spinnerStyle = computed(() => {
  const t = typeof props.tamanho === 'number' ? `${props.tamanho}px` : props.tamanho
  const e = typeof props.espessura === 'number' ? `${props.espessura}px` : props.espessura
  return {
    width: t,
    height: t,
    borderWidth: e
  }
})
</script>

<style scoped>
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
}

.spinner {
  border: solid rgba(114, 188, 165, 0.2);
  border-top-color: var(--verde);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  box-sizing: border-box;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>