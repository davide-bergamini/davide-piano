<script setup>
defineProps({
  pieces: {
    type: Array,
    required: true,
  },
  currentPiece: {
    type: Object,
    default: null,
  },
  subtitleColumn: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['select-piece', 'select-mp3'])

function hasMidi(piece) {
  return Boolean(piece.midi?.full)
}

function hasMp3(piece) {
  return Boolean(piece.mp3)
}

function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('it-IT')
}
</script>

<template>
  <div class="discogs-list">
    <div class="discogs-list-head">
      <div>Brano</div>
      <div>Pubblicato</div>
      <div>MIDI</div>
      <div>MP3</div>
    </div>

    <div
      v-for="piece in pieces"
      :key="piece.id"
      class="discogs-row"
      :class="{ 'is-playing': currentPiece?.id === piece.id }"
    >
      <div class="piece-main">
        <div class="piece-title-line">
          <span class="piece-title">
            {{ piece.title }}
          </span>

          <span v-if="piece.subtitle" class="piece-subtitle">
            {{ piece.subtitle }}
          </span>

          <span v-if="currentPiece?.id === piece.id" class="playing-label"> Now Playing </span>
        </div>
      </div>

      <div class="published-date">
        <span v-if="piece.publishedAt">
          {{ formatDate(piece.publishedAt) }}
        </span>

        <span v-else class="coming-soon-date"> Coming Soon </span>
      </div>

      <div class="media-actions">
        <template v-if="hasMidi(piece)">
          <button
            class="icon-action midi-play"
            type="button"
            title="Ascolta MIDI"
            @click="emit('select-piece', piece)"
          >
            ▶
          </button>

          <a class="icon-action download" :href="piece.midi.full" download title="Scarica MIDI">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 3v12m0 0l4-4m-4 4l-4-4M5 21h14"
              />
            </svg>
          </a>
        </template>

        <span v-else class="muted">—</span>
      </div>

      <div class="media-actions">
        <template v-if="hasMp3(piece)">
          <button
            class="icon-action mp3-play"
            type="button"
            title="Ascolta MP3"
            @click="emit('select-mp3', piece)"
          >
            ▶
          </button>

          <a class="icon-action download" :href="piece.mp3" download title="Scarica MP3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 3v12m0 0l4-4m-4 4l-4-4M5 21h14"
              />
            </svg>
          </a>
        </template>

        <span v-else class="muted">—</span>
      </div>
    </div>
  </div>
</template>
