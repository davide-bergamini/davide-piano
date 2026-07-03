<script setup>
import pieces from '../data/pieces.json'

const visiblePieces = pieces.filter((piece) => piece.visible)
</script>

<template>
  <section>
    <h2>Brani</h2>

    <p v-if="visiblePieces.length === 0">Nessun brano disponibile.</p>

    <table v-else class="piece-table">
      <thead>
        <tr>
          <th>Autore</th>
          <th>Titolo</th>
          <th>MIDI</th>
          <th>MP3</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="piece in visiblePieces" :key="piece.id">
          <td>{{ piece.composer }}</td>

          <td>
            <strong>{{ piece.title }}</strong>
            <small v-if="piece.work">{{ piece.work }}</small>
          </td>

          <td>
            <button v-if="piece.midi" type="button" @click="$emit('select-piece', piece)">
              Play MIDI
            </button>

            <span v-else>—</span>
          </td>

          <td>
            <button v-if="piece.mp3" type="button" @click="$emit('select-mp3', piece)">
              Play MP3
            </button>

            <span v-else>—</span>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
h2 {
  margin: 0 0 24px;
  font-size: 2rem;
  font-weight: 700;
}

.piece-table {
  width: 100%;
  border-collapse: collapse;
}

.piece-table th,
.piece-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #ddd;
  text-align: left;
  vertical-align: top;
}

.piece-table th {
  color: #666;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.piece-table strong {
  display: block;
}

.piece-table small {
  display: block;
  margin-top: 3px;
  color: #666;
}

button {
  padding: 6px 10px;
  border: 0;
  background: #222;
  color: white;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

button:hover {
  background: #000;
}
</style>
