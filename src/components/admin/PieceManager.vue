<script setup>
import { computed, onMounted, ref } from 'vue'
import composers from '../../data/composers'
import { readGithubJson, writeGithubJson } from '../../services/githubFile'

const filePath = 'public/data/repertoire.json'

const repertoire = ref([])
const fileSha = ref(null)

const showForm = ref(false)
const editingPieceId = ref(null)

const status = ref('')
const loading = ref(false)
const saving = ref(false)

const form = ref({
  composerSlug: '',
  sectionId: '',
  title: '',
  subtitle: '',
  collection: '',
  opus: '',
  difficulty: 'Intermedio',
  duration: '',
  description: '',
  tagsText: '',
  midi: '',
  mp3: '',
  publishedAt: '',
  visible: true,
})

const flatPieces = computed(() => {
  return repertoire.value.flatMap((composer) =>
    composer.sections.flatMap((section) =>
      section.pieces.map((piece) => ({
        ...piece,
        composerId: composer.id,
        composerName: composer.name,
        sectionId: section.id,
        sectionTitle: section.title,
      })),
    ),
  )
})

const selectedComposer = computed(() => {
  return repertoire.value.find((composer) => composer.id === form.value.composerSlug)
})

const selectedSections = computed(() => {
  return selectedComposer.value?.sections || []
})

onMounted(() => {
  loadPieces()
})

function resetForm() {
  editingPieceId.value = null

  form.value = {
    composerSlug: '',
    sectionId: '',
    title: '',
    subtitle: '',
    collection: '',
    opus: '',
    difficulty: 'Intermedio',
    duration: '',
    description: '',
    tagsText: '',
    midi: '',
    mp3: '',
    publishedAt: '',
    visible: true,
  }
}

function openNewForm() {
  resetForm()
  showForm.value = true
}

function cancelForm() {
  resetForm()
  showForm.value = false
}

function selectComposer(event) {
  form.value.composerSlug = event.target.value
  form.value.sectionId = ''
}

function useLastUploadedMidi() {
  const lastMidi = localStorage.getItem('last_uploaded_midi')

  if (!lastMidi) {
    status.value = 'Nessun MIDI caricato di recente.'
    return
  }

  form.value.midi = lastMidi
  status.value = `MIDI inserito: ${lastMidi}`
}

function useLastUploadedMp3() {
  const lastMp3 = localStorage.getItem('last_uploaded_mp3')

  if (!lastMp3) {
    status.value = 'Nessun MP3 caricato di recente.'
    return
  }

  form.value.mp3 = lastMp3
  status.value = `MP3 inserito: ${lastMp3}`
}

async function loadPieces() {
  loading.value = true
  status.value = 'Caricamento repertorio da GitHub...'

  try {
    const result = await readGithubJson(filePath)

    repertoire.value = result.data
    fileSha.value = result.sha

    status.value = 'Repertorio caricato da GitHub.'
  } catch (error) {
    status.value = `Errore: ${error.message}`
  } finally {
    loading.value = false
  }
}

function createPieceFromForm() {
  return {
    id: editingPieceId.value || Date.now(),

    title: form.value.title,
    subtitle: form.value.subtitle,
    collection: form.value.collection,
    opus: form.value.opus,

    difficulty: form.value.difficulty,
    duration: form.value.duration,

    description: form.value.description,

    tags: form.value.tagsText
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0),

    midi: {
      full: form.value.midi,
    },

    mp3: form.value.mp3,
    publishedAt: form.value.publishedAt,
    visible: form.value.visible,
  }
}

function addPiece() {
  if (!form.value.composerSlug || !form.value.sectionId || !form.value.title) {
    status.value = 'Inserisci almeno compositore, sezione e titolo.'
    return
  }

  const composer = repertoire.value.find((item) => item.id === form.value.composerSlug)
  const section = composer?.sections.find((item) => item.id === form.value.sectionId)

  if (!composer || !section) {
    status.value = 'Compositore o sezione non trovati.'
    return
  }

  section.pieces.push(createPieceFromForm())

  resetForm()
  showForm.value = false
  status.value = 'Brano aggiunto. Ricordati di salvare su GitHub.'
}

function editPiece(piece) {
  editingPieceId.value = piece.id

  form.value = {
    composerSlug: piece.composerId,
    sectionId: piece.sectionId,
    title: piece.title || '',
    subtitle: piece.subtitle || '',
    collection: piece.collection || '',
    opus: piece.opus || '',
    difficulty: piece.difficulty || 'Intermedio',
    duration: piece.duration || '',
    description: piece.description || '',
    tagsText: Array.isArray(piece.tags) ? piece.tags.join(', ') : '',
    midi: piece.midi?.full || '',
    mp3: piece.mp3 || '',
    publishedAt: piece.publishedAt || '',
    visible: piece.visible !== false,
  }

  showForm.value = true
  status.value = `Modifica brano: ${piece.title}`
}

function updatePiece() {
  if (!editingPieceId.value) return

  if (!form.value.composerSlug || !form.value.sectionId || !form.value.title) {
    status.value = 'Inserisci almeno compositore, sezione e titolo.'
    return
  }

  removePiece(editingPieceId.value, false)

  const composer = repertoire.value.find((item) => item.id === form.value.composerSlug)
  const section = composer?.sections.find((item) => item.id === form.value.sectionId)

  if (!composer || !section) {
    status.value = 'Compositore o sezione non trovati.'
    return
  }

  section.pieces.push(createPieceFromForm())

  resetForm()
  showForm.value = false
  status.value = 'Brano modificato. Ricordati di salvare su GitHub.'
}

function removePiece(id, showMessage = true) {
  repertoire.value.forEach((composer) => {
    composer.sections.forEach((section) => {
      section.pieces = section.pieces.filter((piece) => piece.id !== id)
    })
  })

  if (showMessage) {
    status.value = 'Brano eliminato. Ricordati di salvare su GitHub.'
  }
}

async function savePieces() {
  saving.value = true
  status.value = 'Salvataggio su GitHub...'

  try {
    const result = await writeGithubJson(filePath, repertoire.value, fileSha.value)

    fileSha.value = result.content.sha
    status.value = 'Repertorio salvato su GitHub.'
  } catch (error) {
    status.value = `Errore: ${error.message}`
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section class="piece-manager">
    <div class="toolbar">
      <button type="button" @click="openNewForm">+ Nuovo brano</button>

      <button v-if="showForm" type="button" @click="cancelForm">Chiudi</button>

      <button type="button" :disabled="loading" @click="loadPieces">
        {{ loading ? 'Caricamento...' : 'Carica da GitHub' }}
      </button>

      <button type="button" :disabled="saving" @click="savePieces">
        {{ saving ? 'Salvataggio...' : 'Salva su GitHub' }}
      </button>
    </div>

    <div v-if="showForm" class="piece-form">
      <h3>
        {{ editingPieceId ? 'Modifica brano' : 'Nuovo brano' }}
      </h3>

      <select :value="form.composerSlug" @change="selectComposer">
        <option value="">Scegli compositore</option>

        <option v-for="composer in composers" :key="composer.slug" :value="composer.slug">
          {{ composer.name }}
        </option>
      </select>

      <select v-model="form.sectionId">
        <option value="">Scegli sezione</option>

        <option v-for="section in selectedSections" :key="section.id" :value="section.id">
          {{ section.title }}
        </option>
      </select>

      <input v-model="form.title" placeholder="Titolo" />
      <input v-model="form.subtitle" placeholder="Sottotitolo" />
      <input v-model="form.collection" placeholder="Raccolta" />
      <input v-model="form.opus" placeholder="Opus" />

      <select v-model="form.difficulty">
        <option>Principiante</option>
        <option>Elementare</option>
        <option>Intermedio</option>
        <option>Avanzato</option>
        <option>Concertistico</option>
      </select>

      <input v-model="form.duration" placeholder="Durata es. 05:12" />

      <textarea v-model="form.description" placeholder="Descrizione del brano" rows="4"></textarea>

      <input
        v-model="form.tagsText"
        placeholder="Tag separati da virgola, es. Sonata, Studio, Mozart"
      />

      <div class="file-field">
        <input v-model="form.midi" placeholder="File MIDI" />

        <button type="button" @click="useLastUploadedMidi">Usa ultimo MIDI</button>
      </div>

      <div class="file-field">
        <input v-model="form.mp3" placeholder="File MP3" />

        <button type="button" @click="useLastUploadedMp3">Usa ultimo MP3</button>
      </div>

      <input v-model="form.publishedAt" placeholder="Data pubblicazione es. 2026-07-07" />

      <label class="check-row">
        <input v-model="form.visible" type="checkbox" />
        Visibile sul sito
      </label>

      <button v-if="editingPieceId" type="button" @click="updatePiece">Salva modifica</button>

      <button v-else type="button" @click="addPiece">Aggiungi brano</button>
    </div>

    <table class="piece-table">
      <thead>
        <tr>
          <th>Compositore</th>
          <th>Sezione</th>
          <th>Brano</th>
          <th>Difficoltà</th>
          <th>Durata</th>
          <th>MIDI</th>
          <th>MP3</th>
          <th>Visibile</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="flatPieces.length === 0">
          <td colspan="9" class="empty">Nessun brano inserito.</td>
        </tr>

        <tr v-for="piece in flatPieces" :key="piece.id">
          <td>{{ piece.composerName }}</td>
          <td>{{ piece.sectionTitle }}</td>

          <td>
            <strong>{{ piece.title }}</strong>

            <small v-if="piece.subtitle">
              {{ piece.subtitle }}
            </small>

            <small v-if="piece.collection || piece.opus">
              {{ piece.collection }} {{ piece.opus }}
            </small>
          </td>

          <td>{{ piece.difficulty || '—' }}</td>
          <td>{{ piece.duration || '—' }}</td>

          <td>{{ piece.midi?.full ? '✔' : '—' }}</td>
          <td>{{ piece.mp3 ? '✔' : '—' }}</td>
          <td>{{ piece.visible !== false ? '✔' : '—' }}</td>

          <td class="actions">
            <button type="button" title="Modifica" @click="editPiece(piece)">✏️</button>
            <button type="button" title="Elimina" @click="removePiece(piece.id)">Elimina</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="status" class="admin-status">
      {{ status }}
    </p>
  </section>
</template>

<style scoped>
.piece-manager {
  width: 100%;
}

.toolbar {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}

button {
  padding: 8px 14px;
  border: 0;
  background: #222;
  color: #fff;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

button:hover {
  background: #000;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.piece-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 24px;
  padding: 18px;
  border: 1px solid #ddd;
  background: #f7f7f7;
}

.piece-form h3 {
  grid-column: 1 / -1;
  margin: 0 0 6px;
  font-size: 1.1rem;
}

.piece-form input,
.piece-form select,
.piece-form textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 9px 10px;
  border: 1px solid #ccc;
  font: inherit;
  background: #fff;
}

.piece-form textarea {
  grid-column: 1 / -1;
  resize: vertical;
}

.file-field {
  display: flex;
  gap: 8px;
}

.file-field input {
  flex: 1;
}

.file-field button {
  white-space: nowrap;
}

.check-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.check-row input {
  width: auto;
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

.empty {
  color: #666;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.actions button {
  padding: 6px 10px;
  font-size: 0.9rem;
}

.admin-status {
  margin-top: 12px;
  color: #495057;
  font-size: 0.92rem;
}

@media (max-width: 768px) {
  .piece-form {
    grid-template-columns: 1fr;
  }

  .file-field {
    flex-direction: column;
  }

  .piece-table {
    font-size: 0.9rem;
  }

  .actions {
    flex-direction: column;
  }
}
</style>
