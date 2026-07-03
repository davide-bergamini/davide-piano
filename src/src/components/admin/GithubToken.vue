<script setup>
import { ref } from 'vue'

const githubToken = ref(localStorage.getItem('github_token') || '')
const saved = ref(false)

function saveToken() {
  localStorage.setItem('github_token', githubToken.value)
  saved.value = true

  setTimeout(() => {
    saved.value = false
  }, 2000)
}
</script>

<template>
  <section class="admin-section">
    <h3>GitHub Token</h3>

    <div class="admin-row">
      <input v-model="githubToken" type="password" placeholder="Token GitHub" />

      <button type="button" @click="saveToken">Salva</button>
    </div>

    <p v-if="saved" class="admin-status">Token salvato.</p>
  </section>
</template>

<style scoped>
.admin-section {
  width: 100%;
}

h3 {
  margin: 0 0 0.7rem;
  font-size: 1.1rem;
  font-weight: 500;
}

.admin-row {
  display: flex;
  align-items: stretch;
  gap: 0.7rem;
}

input {
  flex: 1;
  min-width: 0;
  padding: 0.65rem 0.8rem;
  border: 1px solid #111;
  background: #fff;
  color: #111;
  font: inherit;
}

button {
  padding: 0.65rem 1rem;
  border: 1px solid #111;
  background: #111;
  color: #fff;
  font: inherit;
  cursor: pointer;
  white-space: nowrap;
}

button:hover {
  background: #333;
}

.admin-status {
  margin: 0.7rem 0 0;
  font-size: 0.95rem;
}

@media (max-width: 650px) {
  .admin-row {
    flex-direction: column;
  }
}
</style>
