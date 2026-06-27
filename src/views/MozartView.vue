<script setup>
import { ref, onMounted, computed } from 'vue'
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

const allPieces = computed(() => mozartSections.value.flatMap((section) => section.pieces))

const midiCount = computed(() => allPieces.value.filter((piece) => piece.midi?.full).length)

const mp3Count = computed(() => allPieces.value.filter((piece) => piece.mp3).length)

const publishedCount = computed(() => allPieces.value.filter((piece) => piece.publishedAt).length)

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
    <div class="catalog-hero">
      <div class="catalog-cover">
        <img src="/img/composers/Mozart.png" alt="Wolfgang Amadeus Mozart" class="composer-photo" />
      </div>

      <div class="catalog-info">
        <h2 class="mb-2">Wolfgang Amadeus Mozart</h2>
        <p class="text-muted mb-2">1756–1791 · Classicismo</p>

        <p class="catalog-description">
          Tra i più grandi compositori della storia della musica, fu uno dei principali esponenti
          del Classicismo viennese. La sua straordinaria produzione comprende opere, sinfonie,
          concerti e musica da camera, oltre a numerose composizioni per pianoforte che
          rappresentano ancora oggi un punto di riferimento del repertorio pianistico.
        </p>
      </div>
    </div>

    <div v-for="section in mozartSections" :key="section.id" class="card mb-4 catalog-card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <span>{{ section.title }}</span>
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
