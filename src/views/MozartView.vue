<script setup>
import PieceTable from '../components/PieceTable.vue'
import { mozartSections } from '../data/mozart'

defineProps({
  currentPiece: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['select-piece'])

function availableCount(section) {
  return section.pieces.filter((piece) => piece.midi?.full).length
}
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
      />
    </div>
  </section>
</template>
