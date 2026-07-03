<script setup>
import PieceManager from './PieceManager.vue'
</script>

<template>
  <section class="admin-page">
    <h2>Brani</h2>

    <PieceManager />
  </section>
</template>

<style scoped>
.admin-page {
  max-width: 1000px;
}

h2 {
  margin: 0 0 24px;
  font-size: 2rem;
  font-weight: 700;
}
</style>
