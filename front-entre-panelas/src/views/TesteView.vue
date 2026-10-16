<template>
  <div class="corpo">
    <BarraNavegacao></BarraNavegacao>
    <HeaderAplicacao></HeaderAplicacao>
  </div>
</template>

<script setup>
import BarraNavegacao from '@/components/BarraNavegacao.vue'
import HeaderAplicacao from '@/components/HeaderAplicacao.vue'
</script>

<style scoped>
.corpo {
  display: flex;
}
</style>