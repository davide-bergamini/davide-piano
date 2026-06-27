<script setup>
import { ref } from 'vue'

import PieceTable from '../components/PieceTable.vue'
import { schumannSections as originalSchumannSections } from '../data/schumann'

defineProps({
  currentPiece: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['select-piece', 'select-mp3'])

const schumannSections = ref(
  originalSchumannSections.map((section) => ({
    ...section,
    pieces: section.pieces.map((piece) => ({ ...piece })),
  })),
)
</script>

<template>
  <section>
    <h6 class="text-muted mb-4">Compositori classica</h6>

    <div class="catalog-hero">
      <div class="catalog-cover">
        <img src="/img/composers/Schumann.png" alt="Robert Schumann" class="composer-photo" />
      </div>

      <div class="catalog-info">
        <h2 class="mb-2">Robert Schumann</h2>

        <p class="catalog-description">
          Brani tratti dall’Album per la gioventù Op. 68, una raccolta poetica e didattica che
          accompagna lo studio del pianoforte con piccoli quadri musicali.
        </p>
      </div>
    </div>

    <div v-for="section in schumannSections" :key="section.id" class="card mb-4">
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
