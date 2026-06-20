<script setup>
import { ref } from 'vue'

import AppHeader from './components/AppHeader.vue'
import Sidebar from './components/Sidebar.vue'
import MidiPlayer from './components/MidiPlayer.vue'

const currentPiece = ref(null)
const currentMp3 = ref(null)

function setCurrentPiece(piece) {
  currentPiece.value = piece
  currentMp3.value = null
}

function setCurrentMp3(piece) {
  currentMp3.value = piece
  currentPiece.value = null
}

function stopPiece() {
  currentPiece.value = null
}

function stopMp3() {
  currentMp3.value = null
}
</script>

<template>
  <AppHeader />

  <div class="page-layout">
    <Sidebar />

    <main class="content">
      <RouterView
        :current-piece="currentPiece"
        @select-piece="setCurrentPiece"
        @select-mp3="setCurrentMp3"
      />
    </main>
  </div>

  <MidiPlayer
    :current-piece="currentPiece"
    :current-mp3="currentMp3"
    @stop="stopPiece"
    @stop-mp3="stopMp3"
  />
</template>
