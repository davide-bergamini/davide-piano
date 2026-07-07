<script setup>
import { onMounted, ref } from 'vue'

import PieceTable from '../components/PieceTable.vue'

defineProps({
  currentPiece: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['select-piece', 'select-mp3'])

const schumannSections = ref([])

async function loadRepertoire() {
  const response = await fetch(`${import.meta.env.BASE_URL}data/repertoire.json`)
  const repertoire = await response.json()

  schumannSections.value = repertoire
    .filter((work) => work.composer === 'Robert Schumann')
    .map((work) => ({
      ...work,
      pieces: work.pieces.map((piece) => ({ ...piece })),
    }))
}

onMounted(() => {
  loadRepertoire()
})
</script>

<template>
  <section>
    <h6 class="text-muted mb-4">Compositori classica</h6>

    <div class="catalog-hero">
      <div class="catalog-cover">
        <img src="/img/composers/Schumann.webp" alt="Robert Schumann" class="composer-photo" />
      </div>

      <div class="catalog-info">
        <h2 class="mb-2">Robert Schumann</h2>

        <p class="text-muted mb-2">1810–1856 · Romanticismo</p>

        <p class="catalog-description">
          Tra i maggiori compositori del Romanticismo, dedicò una parte fondamentale della sua
          produzione al pianoforte. Le sue opere, caratterizzate da grande intensità espressiva e
          ricchezza poetica, occupano un posto centrale nel repertorio pianistico.
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
