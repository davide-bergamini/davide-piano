<script setup>
import GithubToken from './GithubToken.vue'
</script>

<template>
  <section class="admin-page">
    <h2>GitHub</h2>

    <GithubToken />
  </section>
</template>

<style scoped>
.admin-page {
  max-width: 760px;
}

h2 {
  margin: 0 0 24px;
  font-size: 2rem;
  font-weight: 700;
}
</style>
