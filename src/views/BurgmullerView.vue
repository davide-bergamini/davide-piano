<script setup>
import { ref, onMounted } from 'vue'
import { Midi } from '@tonejs/midi'

import PieceTable from '../components/PieceTable.vue'
import { burgmullerSections as originalBurgmullerSections } from '../data/burgmuller'

defineProps({
  currentPiece: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['select-piece', 'select-mp3'])

const burgmullerSections = ref(
  originalBurgmullerSections.map((section) => ({
    ...section,
    pieces: section.pieces.map((piece) => ({ ...piece })),
  })),
)

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60)
  const secs = Math.round(seconds % 60)

  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

async function loadMidiDuration(piece) {
  if (!piece.midi?.full) return

  try {
    const response = await fetch(piece.midi.full)

    if (!response.ok) return

    const arrayBuffer = await response.arrayBuffer()
    const midi = new Midi(arrayBuffer)

    piece.duration = formatDuration(midi.duration)
  } catch (error) {
    console.error('Errore lettura durata MIDI:', piece.title, error)
  }
}

onMounted(async () => {
  for (const section of burgmullerSections.value) {
    for (const piece of section.pieces) {
      await loadMidiDuration(piece)
    }
  }
})
</script>

<template>
  <section>
    <h6 class="text-muted mb-4">Compositori classica</h6>

    <div class="catalog-hero">
      <div class="catalog-cover">
        <img
          src="/img/composers/Burgmuller.png"
          alt="Friedrich Burgmüller"
          class="composer-photo"
        />
      </div>

      <div class="catalog-info">
        <h2 class="mb-2">Friedrich Burgmüller</h2>

        <p class="catalog-description">
          I 25 studi facili e progressivi Op. 100 sono una raccolta didattica molto amata dai
          pianisti, pensata per sviluppare tecnica, musicalità ed espressività in modo graduale.
        </p>
      </div>
    </div>

    <div v-for="section in burgmullerSections" :key="section.id" class="card mb-4">
      <div class="card-header">
        {{ section.title }}
      </div>

      <PieceTable
        :pieces="section.pieces"
        :current-piece="currentPiece"
        subtitle-column=""
        @select-piece="emit('select-piece', $event)"
        @select-mp3="emit('select-mp3', $event)"
      />
    </div>
  </section>
</template>
