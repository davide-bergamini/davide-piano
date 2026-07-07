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

const tchaikovskySections = ref([])

async function loadRepertoire() {
  const response = await fetch(`${import.meta.env.BASE_URL}data/repertoire.json`)
  const repertoire = await response.json()

  tchaikovskySections.value = repertoire
    .filter((work) => work.composer === 'Pëtr Il’ič Čajkovskij')
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
        <img
          src="/img/composers/Tchaikovski.webp"
          alt="Pyotr Ilyich Tchaikovsky"
          class="composer-photo"
        />
      </div>

      <div class="catalog-info">
        <h2 class="mb-2">Pyotr Ilyich Tchaikovsky</h2>

        <p class="text-muted mb-2">1840–1893 · Romanticismo</p>

        <p class="catalog-description">
          Compositore russo del periodo romantico, è celebre per i suoi balletti, le sinfonie e i
          concerti. La sua produzione pianistica comprende numerose pagine di grande fascino, tra
          cui il celebre Album per la gioventù op. 39, destinato ai giovani pianisti.
        </p>
      </div>
    </div>

    <div v-for="section in tchaikovskySections" :key="section.id" class="card mb-4">
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
