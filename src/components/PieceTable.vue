<script setup>
defineProps({
  pieces: Array,
  currentPiece: Object,
  subtitleColumn: {
    type: String,
    default: 'Tempo',
  },
})

const emit = defineEmits(['select-piece'])

function hasMidi(piece) {
  console.log(piece.title, piece.midi)
  return true
}

function hasMp3(piece) {
  return Boolean(piece.mp3)
}
</script>

<template>
  <div class="table-responsive">
    <table class="table align-middle mb-0">
      <thead>
        <tr>
          <th>Brano</th>
          <th>{{ subtitleColumn }}</th>
          <th>Durata</th>
          <th>MIDI</th>
          <th>MP3</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="piece in pieces"
          :key="piece.id"
          :class="{
            'table-primary': currentPiece?.id === piece.id,
          }"
        >
          <td>
            <strong>{{ piece.title }}</strong>
          </td>

          <td>{{ piece.subtitle }}</td>

          <td>{{ piece.duration }}</td>

          <td>
            <button class="btn btn-sm btn-primary" @click="emit('select-piece', piece)">
              Play
            </button>
          </td>

          <td>
            <a
              v-if="hasMp3(piece)"
              class="btn btn-sm btn-outline-secondary"
              :href="piece.mp3"
              download
            >
              ⬇
            </a>

            <span v-else class="small text-muted"> — </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
