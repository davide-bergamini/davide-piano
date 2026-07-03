<script setup>
import pieces from '../data/pieces.json'

const classicalPieces = pieces.filter((piece) => {
  return piece.visible && piece.category === 'Classica'
})

const groupedByComposer = classicalPieces.reduce((groups, piece) => {
  const composer = piece.composer || 'Altro'

  if (!groups[composer]) {
    groups[composer] = []
  }

  groups[composer].push(piece)

  return groups
}, {})
</script>

<template>
  <section>
    <h6>Musica classica</h6>
    <h2>Catalogo brani</h2>

    <p v-if="classicalPieces.length === 0" class="empty">Nessun brano classico disponibile.</p>

    <div
      v-for="(composerPieces, composer) in groupedByComposer"
      :key="composer"
      class="composer-section"
    >
      <h3>{{ composer }}</h3>

      <table class="piece-table">
        <thead>
          <tr>
            <th>Brano</th>
            <th>MIDI</th>
            <th>MP3</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="piece in composerPieces" :key="piece.id">
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
    </div>
  </section>
</template>

<style scoped>
h6 {
  font-size: 0.85rem;
  font-weight: 700;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 24px;
}

.composer-section {
  margin-bottom: 34px;
}

.composer-section h3 {
  margin: 0 0 12px;
  font-size: 1.3rem;
  font-weight: 700;
}

.piece-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
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
  font-weight: 600;
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

.empty {
  color: #666;
}
</style>
