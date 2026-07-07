<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  loadWorks,
  saveWorks,
  createEmptyWork,
  addPieceToWork,
} from '../services/works'
import { publishRepertoire } from '../services/repertoirePublisher'
import { fetchAllUploadFiles } from '../services/githubFiles'

const works = ref(loadWorks())

const selectedType = ref('')
const selectedWorkId = ref('')
const selectedPieceId = ref('')

const uploadFiles = ref({
  midi: [],
  mp3: [],
  pdf: [],
  musicxml: [],
})

const loadingUploadFiles = ref(false)

onMounted(() => {
  loadUploadFiles()
})

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
  return (
    works.value.find((work) => String(work.id) === String(selectedWorkId.value)) || null
  )
})

const selectedPiece = computed(() => {
  if (!selectedWork.value) return null

  return (
    selectedWork.value.pieces.find((piece) => String(piece.id) === String(selectedPieceId.value)) ||
    null
  )
})

async function loadUploadFiles() {
  loadingUploadFiles.value = true

  try {
    uploadFiles.value = await fetchAllUploadFiles()
  } catch (err) {
    alert(`Errore caricamento file da GitHub: ${err.message}`)
  } finally {
    loadingUploadFiles.value = false
  }
}

function ensurePieceFields(piece) {
  if (!piece.midi) {
    piece.midi = {
      full: '',
      right: '',
      left: '',
    }
  }

  if (!piece.midi.full) piece.midi.full = ''
  if (!piece.midi.right) piece.midi.right = ''
  if (!piece.midi.left) piece.midi.left = ''
  if (!piece.mp3) piece.mp3 = ''
  if (!piece.pdf) piece.pdf = ''
  if (!piece.musicxml) piece.musicxml = ''
}

function persist() {
  saveWorks(works.value)
}

function selectWork(work) {
  selectedType.value = 'work'
  selectedWorkId.value = String(work.id)
  selectedPieceId.value = ''
}

function selectPiece(work, piece) {
  ensurePieceFields(piece)

  selectedType.value = 'piece'
  selectedWorkId.value = String(work.id)
  selectedPieceId.value = String(piece.id)
}

function addWork(composer) {
  const newWork = createEmptyWork(works.value.length + 1)

  newWork.composer = composer
  newWork.collection = composer
  newWork.title = 'Nuova opera'

  works.value.push(newWork)

  selectedType.value = 'work'
  selectedWorkId.value = String(newWork.id)
  selectedPieceId.value = ''

  persist()
}

function removeWork(workId) {
  if (!window.confirm('Eliminare questa opera e tutti i suoi brani?')) return

  works.value = works.value.filter((work) => String(work.id) !== String(workId))

  selectedType.value = ''
  selectedWorkId.value = ''
  selectedPieceId.value = ''

  persist()
}

function addPiece(work) {
  const updatedWork = addPieceToWork(work)
  const index = works.value.findIndex((item) => String(item.id) === String(work.id))

  if (index === -1) return

  works.value[index] = updatedWork

  const newPiece = updatedWork.pieces[updatedWork.pieces.length - 1]

  newPiece.title = 'Nuovo brano'
  newPiece.composer = updatedWork.composer
  newPiece.collection = updatedWork.collection || updatedWork.title
  newPiece.sectionTitle = updatedWork.title

  ensurePieceFields(newPiece)

  selectedType.value = 'piece'
  selectedWorkId.value = String(updatedWork.id)
  selectedPieceId.value = String(newPiece.id)

  persist()
}

function removePiece(work, pieceId) {
  if (!window.confirm('Eliminare questo brano?')) return

  work.pieces = work.pieces.filter((piece) => String(piece.id) !== String(pieceId))

  selectedType.value = 'work'
  selectedWorkId.value = String(work.id)
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
    ensurePieceFields(selectedPiece.value)

    const workIndex = works.value.findIndex(
      (work) => String(work.id) === String(selectedWork.value.id),
    )

    if (workIndex === -1) return

    const pieceIndex = works.value[workIndex].pieces.findIndex(
      (piece) => String(piece.id) === String(selectedPiece.value.id),
    )

    if (pieceIndex === -1) return

    const updatedPiece = {
      ...selectedPiece.value,

      composer: selectedPiece.value.composer || selectedWork.value.composer,

      collection:
        selectedPiece.value.collection ||
        selectedWork.value.collection ||
        selectedWork.value.title,

      sectionTitle: selectedPiece.value.sectionTitle || selectedWork.value.title,

      publishedAt: selectedPiece.value.publishedAt || '',

      midi: {
        full: selectedPiece.value.midi?.full || '',
        right: selectedPiece.value.midi?.right || '',
        left: selectedPiece.value.midi?.left || '',
      },

      mp3: selectedPiece.value.mp3 || '',
      pdf: selectedPiece.value.pdf || '',
      musicxml: selectedPiece.value.musicxml || '',
    }

    works.value[workIndex].pieces[pieceIndex] = updatedPiece
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

      <div class="header-actions">
        <button class="text-action" type="button" @click="loadUploadFiles">
          {{ loadingUploadFiles ? 'Caricamento file...' : 'Aggiorna file' }}
        </button>

        <button class="text-action" type="button" @click="publish">
          Pubblica su GitHub
        </button>
      </div>
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
              :class="{ selected: selectedType === 'work' && selectedWorkId === String(work.id) }"
            >
              <button type="button" class="row-main work-main" @click="selectWork(work)">
                {{ work.title }}
              </button>

              <div class="row-actions">
                <button
                  class="icon-action"
                  type="button"
                  title="Modifica opera"
                  @click="selectWork(work)"
                >
                  &#9998;
                </button>

                <button
                  class="icon-action"
                  type="button"
                  title="Nuovo brano"
                  @click="addPiece(work)"
                >
                  ＋
                </button>

                <button
                  class="icon-action danger"
                  type="button"
                  title="Elimina opera"
                  @click="removeWork(work.id)"
                >
                  🗑
                </button>
              </div>
            </div>

            <ul class="piece-list">
              <li
                v-for="piece in work.pieces"
                :key="piece.id"
                class="piece-row"
                :class="{
                  selected:
                    selectedType === 'piece' &&
                    selectedWorkId === String(work.id) &&
                    selectedPieceId === String(piece.id),
                }"
              >
                <button type="button" class="row-main piece-main" @click="selectPiece(work, piece)">
                  <span>{{ piece.title }}</span>
                  <small v-if="piece.subtitle">{{ piece.subtitle }}</small>
                </button>

                <div class="row-actions">
                  <button
                    class="icon-action"
                    type="button"
                    title="Modifica brano"
                    @click="selectPiece(work, piece)"
                  >
                    &#9998;
                  </button>

                  <button
                    class="icon-action danger"
                    type="button"
                    title="Elimina brano"
                    @click="removePiece(work, piece.id)"
                  >
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
            <select v-model="selectedPiece.midi.full">
              <option value="">Nessun MIDI completo</option>

              <option
                v-if="
                  selectedPiece.midi.full &&
                  !uploadFiles.midi.some((file) => file.publicPath === selectedPiece.midi.full)
                "
                :value="selectedPiece.midi.full"
              >
                {{ selectedPiece.midi.full }}
              </option>

              <option v-for="file in uploadFiles.midi" :key="file.publicPath" :value="file.publicPath">
                {{ file.name }}
              </option>
            </select>
          </label>

          <label>
            MIDI mano destra
            <select v-model="selectedPiece.midi.right">
              <option value="">Nessun MIDI mano destra</option>

              <option
                v-if="
                  selectedPiece.midi.right &&
                  !uploadFiles.midi.some((file) => file.publicPath === selectedPiece.midi.right)
                "
                :value="selectedPiece.midi.right"
              >
                {{ selectedPiece.midi.right }}
              </option>

              <option v-for="file in uploadFiles.midi" :key="file.publicPath" :value="file.publicPath">
                {{ file.name }}
              </option>
            </select>
          </label>

          <label>
            MIDI mano sinistra
            <select v-model="selectedPiece.midi.left">
              <option value="">Nessun MIDI mano sinistra</option>

              <option
                v-if="
                  selectedPiece.midi.left &&
                  !uploadFiles.midi.some((file) => file.publicPath === selectedPiece.midi.left)
                "
                :value="selectedPiece.midi.left"
              >
                {{ selectedPiece.midi.left }}
              </option>

              <option v-for="file in uploadFiles.midi" :key="file.publicPath" :value="file.publicPath">
                {{ file.name }}
              </option>
            </select>
          </label>

          <label>
            MP3
            <select v-model="selectedPiece.mp3">
              <option value="">Nessun MP3</option>

              <option
                v-if="
                  selectedPiece.mp3 &&
                  !uploadFiles.mp3.some((file) => file.publicPath === selectedPiece.mp3)
                "
                :value="selectedPiece.mp3"
              >
                {{ selectedPiece.mp3 }}
              </option>

              <option v-for="file in uploadFiles.mp3" :key="file.publicPath" :value="file.publicPath">
                {{ file.name }}
              </option>
            </select>
          </label>

          <label>
            PDF
            <select v-model="selectedPiece.pdf">
              <option value="">Nessun PDF</option>

              <option
                v-if="
                  selectedPiece.pdf &&
                  !uploadFiles.pdf.some((file) => file.publicPath === selectedPiece.pdf)
                "
                :value="selectedPiece.pdf"
              >
                {{ selectedPiece.pdf }}
              </option>

              <option v-for="file in uploadFiles.pdf" :key="file.publicPath" :value="file.publicPath">
                {{ file.name }}
              </option>
            </select>
          </label>

          <label>
            MusicXML
            <select v-model="selectedPiece.musicxml">
              <option value="">Nessun MusicXML</option>

              <option
                v-if="
                  selectedPiece.musicxml &&
                  !uploadFiles.musicxml.some((file) => file.publicPath === selectedPiece.musicxml)
                "
                :value="selectedPiece.musicxml"
              >
                {{ selectedPiece.musicxml }}
              </option>

              <option
                v-for="file in uploadFiles.musicxml"
                :key="file.publicPath"
                :value="file.publicPath"
              >
                {{ file.name }}
              </option>
            </select>
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

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
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

  .header-actions {
    justify-content: flex-start;
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
