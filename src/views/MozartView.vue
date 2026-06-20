<script setup>
import { ref, onMounted } from 'vue'
import { Midi } from '@tonejs/midi'

import PieceTable from '../components/PieceTable.vue'
import { mozartSections as originalMozartSections } from '../data/mozart'

defineProps({
  currentPiece: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['select-piece', 'select-mp3'])

const mozartSections = ref(
  originalMozartSections.map((section) => ({
    ...section,
    pieces: section.pieces.map((piece) => ({ ...piece })),
  })),
)

function availableCount(section) {
  return section.pieces.filter((piece) => piece.midi?.full).length
}

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
  for (const section of mozartSections.value) {
    for (const piece of section.pieces) {
      await loadMidiDuration(piece)
    }
  }
})
</script>

<template>
  <section>
    <h6 class="text-muted mb-4">Compositori classica</h6>

    <h2 class="mb-1">Wolfgang Amadeus Mozart</h2>

    <p class="text-muted mb-4">Sonate per pianoforte</p>

    <div v-for="section in mozartSections" :key="section.id" class="card mb-4">
      <div class="card-header d-flex justify-content-between align-items-center">
        <span>{{ section.title }}</span>

        <span class="badge bg-secondary"> {{ availableCount(section) }} MIDI </span>
      </div>

      <PieceTable
        :pieces="section.pieces"
        :current-piece="currentPiece"
        subtitle-column="Tempo"
        @select-piece="emit('select-piece', $event)"
        @select-mp3="emit('select-mp3', $event)"
      />
    </div>
  </section>
</template>
