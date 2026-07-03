<script setup>
import { ref } from 'vue'

const percorsoOpen = ref(false)

function togglePercorso() {
  percorsoOpen.value = !percorsoOpen.value
}

function closePercorso() {
  percorsoOpen.value = false
}
</script>

<template>
  <header class="site-header">
    <RouterLink to="/" class="site-title"> Davide Piano </RouterLink>

    <nav class="top-nav">
      <RouterLink to="/mozart"> Musica classica </RouterLink>

      <span class="nav-spacer"></span>

      <div class="nav-dropdown">
        <button type="button" class="nav-dropdown-button" @click="togglePercorso">
          Il mio percorso ▾
        </button>

        <div v-if="percorsoOpen" class="nav-dropdown-menu">
          <RouterLink to="/timeline" @click="closePercorso"> Timeline </RouterLink>

          <RouterLink to="/info" @click="closePercorso"> Info </RouterLink>
        </div>
      </div>

      <RouterLink to="/admin" class="admin-pill"> Admin </RouterLink>
    </nav>
  </header>
</template>
