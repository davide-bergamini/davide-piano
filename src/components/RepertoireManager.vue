<script setup>
import { computed, ref } from 'vue'
import {
  loadWorks,
  saveWorks,
  createEmptyWork,
  addPieceToWork,
} from '../services/works'
import { publishRepertoire } from '../services/repertoirePublisher'

const works = ref(loadWorks())

const selectedType = ref('')
const selectedWorkId = ref('')
const selectedPieceId = ref('')

const composers = computed(() => {
  const grouped = {}

  works.value.forEach((work) => {
    const composer = work.composer || 'Senza compositore'

    if (!grouped[composer]) {
      grouped[composer] = []
    }

    grouped[composer].push(work)
  })

  return Object.entries(grouped).map(([composer, composerWorks]) => ({
    composer,
    works: composerWorks.sort((a, b) => Number(a.order || 0) - Number(b.order || 0)),
  }))
})

const selectedWork = computed(() => {
  return works.value.find((work) => work.id === selectedWorkId.value) || null
})

const selectedPiece = computed(() => {
  if (!selectedWork.value) return null

  return selectedWork.value.pieces.find((piece) => piece.id === selectedPieceId.value) || null
})

function persist() {
  saveWorks(works.value)
}

function selectWork(work) {
  selectedType.value = 'work'
  selectedWorkId.value = work.id
  selectedPieceId.value = ''
}

function selectPiece(work, piece) {
  selectedType.value = 'piece'
  selectedWorkId.value = work.id
  selectedPieceId.value = piece.id
}

function addWork(composer) {
  const newWork = createEmptyWork(works.value.length + 1)

  newWork.composer = composer
  newWork.collection = composer
  newWork.title = 'Nuova opera'

  works.value.push(newWork)

  selectedType.value = 'work'
  selectedWorkId.value = newWork.id
  selectedPieceId.value = ''

  persist()
}

function removeWork(workId) {
  if (!window.confirm('Eliminare questa opera e tutti i suoi brani?')) return

  works.value = works.value.filter((work) => work.id !== workId)

  selectedType.value = ''
  selectedWorkId.value = ''
  selectedPieceId.value = ''

  persist()
}

function addPiece(work) {
  const updatedWork = addPieceToWork(work)
  const index = works.value.findIndex((item) => item.id === work.id)

  if (index === -1) return

  works.value[index] = updatedWork

  const newPiece = updatedWork.pieces[updatedWork.pieces.length - 1]

  newPiece.title = 'Nuovo brano'
  newPiece.composer = updatedWork.composer
  newPiece.collection = updatedWork.collection || updatedWork.title
  newPiece.sectionTitle = updatedWork.title

  selectedType.value = 'piece'
  selectedWorkId.value = updatedWork.id
  selectedPieceId.value = newPiece.id

  persist()
}

function removePiece(work, pieceId) {
  if (!window.confirm('Eliminare questo brano?')) return

  work.pieces = work.pieces.filter((piece) => piece.id !== pieceId)

  selectedType.value = 'work'
  selectedWorkId.value = work.id
  selectedPieceId.value = ''

  persist()
}

function saveCurrent() {
  if (selectedType.value === 'work' && selectedWork.value) {
    selectedWork.value.pieces = selectedWork.value.pieces.map((piece) => ({
      ...piece,
      composer: piece.composer || selectedWork.value.composer,
      collection: piece.collection || selectedWork.value.collection || selectedWork.value.title,
      sectionTitle: piece.sectionTitle || selectedWork.value.title,
    }))
  }

  if (selectedType.value === 'piece' && selectedPiece.value && selectedWork.value) {
    selectedPiece.value.composer =
      selectedPiece.value.composer || selectedWork.value.composer

    selectedPiece.value.collection =
      selectedPiece.value.collection ||
      selectedWork.value.collection ||
      selectedWork.value.title

    selectedPiece.value.sectionTitle =
      selectedPiece.value.sectionTitle || selectedWork.value.title
  }

  persist()
  alert('Salvato.')
}

async function publish() {
  try {
    await publishRepertoire()
    alert('Repertorio pubblicato su GitHub.')
  } catch (err) {
    alert(`Errore pubblicazione: ${err.message}`)
  }
}
</script>

<template>
  <section class="repertoire-manager">
    <header class="repertoire-header">
      <div>
        <h3>Repertorio</h3>
        <p>Compositori, opere e brani.</p>
      </div>

      <button class="text-action" type="button" @click="publish">
        Pubblica su GitHub
      </button>
    </header>

    <div class="repertoire-layout">
      <div class="repertoire-list">
        <section v-for="group in composers" :key="group.composer" class="composer-block">
          <div class="composer-header">
            <h4>{{ group.composer }}</h4>

            <button class="text-action" type="button" @click="addWork(group.composer)">
              ＋ Opera
            </button>
          </div>

          <div v-for="work in group.works" :key="work.id" class="work-block">
            <div
              class="work-row"
              :class="{ selected: selectedType === 'work' && selectedWorkId === work.id }"
            >
              <button type="button" class="row-main work-main" @click="selectWork(work)">
                {{ work.title }}
              </button>

              <div class="row-actions">
                <button class="icon-action" type="button" title="Modifica opera" @click="selectWork(work)">
                  &#9998;
                </button>

                <button class="icon-action" type="button" title="Nuovo brano" @click="addPiece(work)">
                  ＋
                </button>

                <button class="icon-action danger" type="button" title="Elimina opera" @click="removeWork(work.id)">
                  🗑
                </button>
              </div>
            </div>

            <ul class="piece-list">
              <li
                v-for="piece in work.pieces"
                :key="piece.id"
                class="piece-row"
                :class="{ selected: selectedType === 'piece' && selectedPieceId === piece.id }"
              >
                <button type="button" class="row-main piece-main" @click="selectPiece(work, piece)">
                  <span>{{ piece.title }}</span>
                  <small v-if="piece.subtitle">{{ piece.subtitle }}</small>
                </button>

                <div class="row-actions">
                  <button class="icon-action" type="button" title="Modifica brano" @click="selectPiece(work, piece)">
                    &#9998;
                  </button>

                  <button class="icon-action danger" type="button" title="Elimina brano" @click="removePiece(work, piece.id)">
                    🗑
                  </button>
                </div>
              </li>

              <li v-if="!work.pieces.length" class="empty-row">
                Nessun brano inserito.
              </li>
            </ul>
          </div>
        </section>
      </div>

      <aside class="editor-panel">
        <div v-if="!selectedType" class="empty-editor">
          Seleziona un’opera o un brano da modificare.
        </div>

        <div v-if="selectedType === 'work' && selectedWork" class="editor-form">
          <h4>Opera</h4>

          <label>
            Titolo opera
            <input v-model="selectedWork.title" type="text" />
          </label>

          <label>
            Compositore
            <input v-model="selectedWork.composer" type="text" />
          </label>

          <label>
            Raccolta
            <input v-model="selectedWork.collection" type="text" />
          </label>

          <label>
            Immagine
            <input v-model="selectedWork.image" type="text" />
          </label>

          <label>
            Anno
            <input v-model="selectedWork.year" type="text" />
          </label>

          <label>
            Ordine
            <input v-model="selectedWork.order" type="number" />
          </label>

          <label>
            Descrizione
            <textarea v-model="selectedWork.description"></textarea>
          </label>

          <label>
            Note
            <textarea v-model="selectedWork.notes"></textarea>
          </label>

          <button type="button" class="save-button" @click="saveCurrent">
            Salva opera
          </button>
        </div>

        <div v-if="selectedType === 'piece' && selectedPiece" class="editor-form">
          <h4>Brano</h4>

          <label>
            Titolo
            <input v-model="selectedPiece.title" type="text" />
          </label>

          <label>
            Sottotitolo
            <input v-model="selectedPiece.subtitle" type="text" />
          </label>

          <label>
            Numero
            <input v-model="selectedPiece.number" type="text" />
          </label>

          <label>
            Ordine
            <input v-model="selectedPiece.order" type="number" />
          </label>

          <label>
            Tonalità
            <input v-model="selectedPiece.key" type="text" />
          </label>

          <label>
            Difficoltà
            <input v-model="selectedPiece.difficulty" type="text" />
          </label>

          <label>
            Stato
            <select v-model="selectedPiece.status">
              <option value="planned">Da studiare</option>
              <option value="studying">In studio</option>
              <option value="recorded">Registrato</option>
              <option value="published">Pubblicato</option>
            </select>
          </label>

          <label>
            Inizio studio
            <input v-model="selectedPiece.startedAt" type="date" />
          </label>

          <label>
            Data pubblicazione
            <input v-model="selectedPiece.publishedAt" type="date" />
          </label>

          <label>
            Durata
            <input v-model="selectedPiece.duration" type="text" />
          </label>

          <label>
            MIDI completo
            <input v-model="selectedPiece.midi.full" type="text" />
          </label>

          <label>
            MIDI mano destra
            <input v-model="selectedPiece.midi.right" type="text" />
          </label>

          <label>
            MIDI mano sinistra
            <input v-model="selectedPiece.midi.left" type="text" />
          </label>

          <label>
            MP3
            <input v-model="selectedPiece.mp3" type="text" />
          </label>

          <label>
            PDF
            <input v-model="selectedPiece.pdf" type="text" />
          </label>

          <label>
            MusicXML
            <input v-model="selectedPiece.musicxml" type="text" />
          </label>

          <label>
            Immagine
            <input v-model="selectedPiece.image" type="text" />
          </label>

          <label>
            Descrizione
            <textarea v-model="selectedPiece.description"></textarea>
          </label>

          <label>
            Note
            <textarea v-model="selectedPiece.notes"></textarea>
          </label>

          <label class="checkbox-label">
            <input v-model="selectedPiece.published" type="checkbox" />
            Pubblicato
          </label>

          <button type="button" class="save-button" @click="saveCurrent">
            Salva brano
          </button>
        </div>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.repertoire-manager {
  width: 100%;
  color: #222;
}

.repertoire-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.6rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #111;
}

h3,
h4,
p {
  margin: 0;
}

.repertoire-header h3 {
  font-size: 1.35rem;
  font-weight: 500;
}

.repertoire-header p {
  margin-top: 0.35rem;
  color: #666;
  font-size: 0.95rem;
}

.repertoire-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  gap: 2rem;
  align-items: start;
}

.repertoire-list {
  min-width: 0;
}

.composer-block {
  padding: 1.2rem 0 1.4rem;
  border-bottom: 1px solid #ddd;
}

.composer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.9rem;
}

.composer-header h4 {
  font-size: 1.08rem;
  font-weight: 600;
}

.work-block {
  padding: 0.25rem 0 0.4rem;
}

.work-row,
.piece-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 36px;
  border-left: 3px solid transparent;
}

.work-row.selected,
.piece-row.selected {
  border-left-color: #111;
}

.piece-list {
  list-style: none;
  margin: 0.15rem 0 0.45rem;
  padding: 0;
}

.piece-row {
  padding-left: 1.6rem;
  min-height: 32px;
}

.empty-row {
  padding: 0.35rem 0 0.35rem 1.6rem;
  color: #777;
  font-size: 0.92rem;
  font-style: italic;
}

.row-main {
  flex: 1;
  min-width: 0;
  padding: 0.25rem 0.4rem;
  border: 0;
  background: transparent;
  color: #222;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.row-main:hover {
  color: #000;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.work-main {
  font-weight: 500;
}

.piece-main {
  display: flex;
  align-items: baseline;
  gap: 0.45rem;
  color: #333;
  font-size: 0.95rem;
}

.piece-main small {
  color: #777;
  font-size: 0.88rem;
}

.row-actions {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  opacity: 0.75;
}

.work-row:hover .row-actions,
.piece-row:hover .row-actions {
  opacity: 1;
}

.icon-action,
.text-action {
  border: 0;
  background: transparent;
  color: #666;
  font: inherit;
  cursor: pointer;
}

.icon-action {
  width: 28px;
  height: 28px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  line-height: 1;
}

.text-action {
  padding: 0;
  font-size: 0.92rem;
}

.icon-action:hover,
.text-action:hover {
  color: #000;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.editor-panel {
  position: sticky;
  top: 1rem;
  padding-top: 0.2rem;
  border-top: 1px solid #111;
}

.empty-editor {
  padding-top: 1rem;
  color: #666;
  font-size: 0.95rem;
}

.editor-form {
  display: grid;
  gap: 1rem;
  padding-top: 1rem;
}

.editor-form h4 {
  margin: 0 0 0.2rem;
  font-size: 1.1rem;
  font-weight: 600;
}

label {
  display: grid;
  gap: 0.25rem;
  color: #555;
  font-size: 0.82rem;
}

input,
textarea,
select {
  width: 100%;
  padding: 0.45rem 0 0.4rem;
  border: 0;
  border-bottom: 1px solid #bbb;
  background: transparent;
  color: #111;
  font: inherit;
  font-size: 0.95rem;
  border-radius: 0;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-bottom-color: #111;
}

textarea {
  min-height: 90px;
  resize: vertical;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  color: #333;
  font-size: 0.92rem;
}

.checkbox-label input {
  width: auto;
}

.save-button {
  justify-self: start;
  margin-top: 0.4rem;
  padding: 0.55rem 0;
  border: 0;
  border-bottom: 1px solid #111;
  background: transparent;
  color: #111;
  font: inherit;
  cursor: pointer;
}

.save-button:hover {
  border-bottom-width: 2px;
}

@media (max-width: 1050px) {
  .repertoire-layout {
    grid-template-columns: 1fr;
  }

  .editor-panel {
    position: static;
    margin-top: 1.5rem;
  }
}

@media (max-width: 700px) {
  .repertoire-header {
    flex-direction: column;
  }

  .composer-header {
    align-items: flex-start;
  }

  .work-row,
  .piece-row {
    gap: 0.35rem;
  }

  .piece-row {
    padding-left: 0.9rem;
  }

  .row-actions {
    gap: 0.05rem;
  }

  .icon-action {
    width: 26px;
    height: 26px;
  }
}
</style>
