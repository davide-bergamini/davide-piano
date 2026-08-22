<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

import AppHeader from './components/AppHeader.vue'
import Sidebar from './components/Sidebar.vue'
import MidiPlayer from './components/MidiPlayer.vue'

const route = useRoute()

const hideSidebar = computed(() => {
  return (
    route.path.startsWith('/discoteca') ||
    route.path.startsWith('/jazz') ||
    route.path.startsWith('/timeline') ||
    route.path.startsWith('/admin') ||
    route.path.startsWith('/info')
  )
})

const currentMp3 = ref(null)

function setCurrentMp3(piece) {
  currentMp3.value = piece
}

function stopMp3() {
  currentMp3.value = null
}
</script>

<template>
  <AppHeader />

  <div class="page-layout">
    <Sidebar v-if="!hideSidebar" />

    <main :class="hideSidebar ? 'content-admin' : 'content'">
      <RouterView
        @select-mp3="setCurrentMp3"
      />
    </main>
  </div>

  <MidiPlayer
    v-if="currentMp3"
    :current-mp3="currentMp3"
    @stop-mp3="stopMp3"
  />
</template>

<style scoped>
.content-admin {
  flex: 1;
  padding: 0;
  margin: 0;
  background: #fff;
  min-width: 0;
}
</style>
