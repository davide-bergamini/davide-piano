<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

import {
  loadPieces,
  savePieces,
  resetPieces,
  normalizePiece,
  createEmptyPiece,
} from '../services/pieces'

const pieces = ref([])
const editingPiece = ref(null)

const sortKey = ref('order')
const sortDirection = ref('asc')

const selectedComposer = ref('')
const selectedSection = ref('')
const selectedStatus = ref('')

const statusOptions = [
  { value: 'planned', label: 'Da studiare' },
  { value: 'studying', label: 'In studio' },
  { value: 'recording', label: 'Da registrare' },
  { value: 'published', label: 'Pubblicato' },
]

const totalPieces = computed(() => pieces.value.length)

const composers = computed(() =>
  [...new Set(pieces.value.map((piece) => piece.composer).filter(Boolean))].sort(),
)

const sections = computed(() =>
  [...new Set(pieces.value.map((piece) => piece.sectionTitle).filter(Boolean))].sort(),
)

const filteredPieces = computed(() => {
  let result = [...pieces.value]

  if (selectedComposer.value) {
    result = result.filter((piece) => piece.composer === selectedComposer.value)
  }

  if (selectedSection.value) {
    result = result.filter((piece) => piece.sectionTitle === selectedSection.value)
  }

  if (selectedStatus.value) {
    result = result.filter((piece) => piece.status === selectedStatus.value)
  }

  result.sort((a, b) => {
    const valueA = a[sortKey.value] ?? ''
    const valueB = b[sortKey.value] ?? ''

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortDirection.value === 'asc' ? valueA - valueB : valueB - valueA
    }

    return sortDirection.value === 'asc'
      ? String(valueA).localeCompare(String(valueB))
      : String(valueB).localeCompare(String(valueA))
  })

  return result
})

function editPiece(piece) {
  const normalized = normalizePiece(piece)

  editingPiece.value = {
    ...normalized,
    midi: {
      full: normalized.midi?.full || '',
      left: normalized.midi?.left || '',
      right: normalized.midi?.right || '',
    },
    tags: Array.isArray(normalized.tags) ? normalized.tags : [],
    tagsText: Array.isArray(normalized.tags) ? normalized.tags.join(', ') : '',
  }

  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth',
  })
}

function newPiece() {
  const piece = createEmptyPiece(pieces.value.length + 1)

  editingPiece.value = {
    ...piece,
    tagsText: '',
  }

  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth',
  })
}

function cancelEdit() {
  editingPiece.value = null
}

function saveEdit() {
  const pieceToSave = normalizePiece({
    ...editingPiece.value,
    tags: editingPiece.value.tagsText
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
    published: editingPiece.value.status === 'published',
  })

  const index = pieces.value.findIndex((piece) => piece.id === pieceToSave.id)

  if (index !== -1) {
    pieces.value[index] = pieceToSave
  } else {
    pieces.value.push(pieceToSave)
  }

  savePieces(pieces.value)
  editingPiece.value = null
}

function handleResetPieces() {
  if (!confirm('Vuoi davvero ripristinare i brani originali del sito?')) return

  pieces.value = resetPieces()
  editingPiece.value = null
}

function sortBy(key) {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }
}

function sortIcon(key) {
  if (sortKey.value !== key) return ''
  return sortDirection.value === 'asc' ? '▲' : '▼'
}

function availabilityIcon(value) {
  return {
    icon: value ? '✔' : '✖',
    class: value ? 'status-ok' : 'status-missing',
  }
}

function statusLabel(status) {
  return statusOptions.find((item) => item.value === status)?.label || status
}

function goToUpload(field, folder) {
  sessionStorage.setItem(
    'adminUploadTarget',
    JSON.stringify({
      pieceId: editingPiece.value.id,
      pieceTitle: editingPiece.value.subtitle || editingPiece.value.title,
      field,
      folder,
    }),
  )

  alert(`Ora vai nella sezione Upload e carica il file nella cartella ${folder}.`)
}

function applyLastUploadedFile() {
  const saved = localStorage.getItem('last_uploaded_for_piece')

  if (!saved || !editingPiece.value) return

  const uploaded = JSON.parse(saved)

  if (uploaded.pieceId !== editingPiece.value.id) return

  if (uploaded.field === 'midi.full') editingPiece.value.midi.full = uploaded.publicPath
  if (uploaded.field === 'midi.left') editingPiece.value.midi.left = uploaded.publicPath
  if (uploaded.field === 'midi.right') editingPiece.value.midi.right = uploaded.publicPath
  if (uploaded.field === 'mp3') editingPiece.value.mp3 = uploaded.publicPath
  if (uploaded.field === 'pdf') editingPiece.value.pdf = uploaded.publicPath
  if (uploaded.field === 'musicxml') editingPiece.value.musicxml = uploaded.publicPath
  if (uploaded.field === 'image') editingPiece.value.image = uploaded.publicPath

  localStorage.removeItem('last_uploaded_for_piece')
}

onMounted(() => {
  pieces.value = loadPieces()

  window.addEventListener('focus', applyLastUploadedFile)

  applyLastUploadedFile()
})

onUnmounted(() => {
  window.removeEventListener('focus', applyLastUploadedFile)
})
</script>

<template>
  <section class="admin-pieces">
    <header class="admin-section-header">
      <div>
        <h1>Brani</h1>
        <p>Gestione dei brani presenti nel sito.</p>
      </div>

      <div class="header-actions">
        <button type="button" @click="newPiece">+ Nuovo brano</button>

        <button class="secondary-button" type="button" @click="handleResetPieces">
          Ripristina originali
        </button>
      </div>
    </header>

    <div class="admin-toolbar">
      <div class="admin-summary">
        <strong>{{ totalPieces }}</strong>
        <span>brani presenti</span>
      </div>

      <label>
        Compositore
        <select v-model="selectedComposer">
          <option value="">Tutti</option>
          <option v-for="composer in composers" :key="composer" :value="composer">
            {{ composer }}
          </option>
        </select>
      </label>

      <label>
        Raccolta
        <select v-model="selectedSection">
          <option value="">Tutte</option>
          <option v-for="section in sections" :key="section" :value="section">
            {{ section }}
          </option>
        </select>
      </label>

      <label>
        Stato
        <select v-model="selectedStatus">
          <option value="">Tutti</option>
          <option v-for="status in statusOptions" :key="status.value" :value="status.value">
            {{ status.label }}
          </option>
        </select>
      </label>
    </div>

    <div class="admin-table-wrapper">
      <table class="admin-table">
        <thead>
          <tr>
            <th>
              <button type="button" class="sort-button" @click="sortBy('title')">
                Titolo {{ sortIcon('title') }}
              </button>
            </th>
            <th>Sottotitolo</th>
            <th>
              <button type="button" class="sort-button" @click="sortBy('composer')">
                Compositore {{ sortIcon('composer') }}
              </button>
            </th>
            <th>
              <button type="button" class="sort-button" @click="sortBy('collection')">
                Raccolta {{ sortIcon('collection') }}
              </button>
            </th>
            <th>Stato</th>
            <th>MIDI</th>
            <th>MP3</th>
            <th>PDF</th>
            <th>MusicXML</th>
            <th>Pubblicato</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="piece in filteredPieces" :key="piece.id">
            <td>{{ piece.title }}</td>
            <td>{{ piece.subtitle }}</td>
            <td>{{ piece.composer }}</td>
            <td>{{ piece.collection || piece.sectionTitle }}</td>
            <td>{{ statusLabel(piece.status) }}</td>

            <td class="status-cell">
              <span :class="availabilityIcon(piece.midi.full).class">
                {{ availabilityIcon(piece.midi.full).icon }}
              </span>
            </td>

            <td class="status-cell">
              <span :class="availabilityIcon(piece.mp3).class">
                {{ availabilityIcon(piece.mp3).icon }}
              </span>
            </td>

            <td class="status-cell">
              <span :class="availabilityIcon(piece.pdf).class">
                {{ availabilityIcon(piece.pdf).icon }}
              </span>
            </td>

            <td class="status-cell">
              <span :class="availabilityIcon(piece.musicxml).class">
                {{ availabilityIcon(piece.musicxml).icon }}
              </span>
            </td>

            <td class="status-cell">
              <span :class="availabilityIcon(piece.published).class">
                {{ availabilityIcon(piece.published).icon }}
              </span>
            </td>

            <td class="actions-cell">
              <button type="button" @click="editPiece(piece)">Modifica</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <form v-if="editingPiece" class="edit-panel" @submit.prevent="saveEdit">
      <h2>
        {{ pieces.some((piece) => piece.id === editingPiece.id) ? 'Modifica brano' : 'Nuovo brano' }}
      </h2>

      <label>
        Titolo
        <input v-model="editingPiece.title" type="text" />
      </label>

      <label>
        Sottotitolo
        <input v-model="editingPiece.subtitle" type="text" />
      </label>

      <label>
        Compositore
        <input v-model="editingPiece.composer" type="text" />
      </label>

      <label>
        Raccolta
        <input v-model="editingPiece.collection" type="text" />
      </label>

      <label>
        Sezione
        <input v-model="editingPiece.sectionTitle" type="text" />
      </label>

      <label>
        Numero
        <input v-model="editingPiece.number" type="text" />
      </label>

      <label>
        Tonalità
        <input v-model="editingPiece.key" type="text" />
      </label>

      <label>
        Difficoltà
        <input v-model="editingPiece.difficulty" type="text" />
      </label>

      <label>
        Durata
        <input v-model="editingPiece.duration" type="text" />
      </label>

      <label>
        Ordine
        <input v-model.number="editingPiece.order" type="number" />
      </label>

      <label>
        Iniziato il
        <input v-model="editingPiece.startedAt" type="date" />
      </label>

      <label>
        Data pubblicazione
        <input v-model="editingPiece.publishedAt" type="date" />
      </label>

      <label>
        Stato
        <select v-model="editingPiece.status">
          <option v-for="status in statusOptions" :key="status.value" :value="status.value">
            {{ status.label }}
          </option>
        </select>
      </label>

      <label>
        MIDI completo
        <div class="field-with-button">
          <input v-model="editingPiece.midi.full" type="text" />
          <button type="button" @click="goToUpload('midi.full', 'midi')">Upload</button>
        </div>
      </label>

      <label>
        MIDI mano sinistra
        <div class="field-with-button">
          <input v-model="editingPiece.midi.left" type="text" />
          <button type="button" @click="goToUpload('midi.left', 'midi')">Upload</button>
        </div>
      </label>

      <label>
        MIDI mano destra
        <div class="field-with-button">
          <input v-model="editingPiece.midi.right" type="text" />
          <button type="button" @click="goToUpload('midi.right', 'midi')">Upload</button>
        </div>
      </label>

      <label>
        MP3
        <div class="field-with-button">
          <input v-model="editingPiece.mp3" type="text" />
          <button type="button" @click="goToUpload('mp3', 'mp3')">Upload</button>
        </div>
      </label>

      <label>
        PDF
        <div class="field-with-button">
          <input v-model="editingPiece.pdf" type="text" />
          <button type="button" @click="goToUpload('pdf', 'pdf')">Upload</button>
        </div>
      </label>

      <label>
        MusicXML
        <div class="field-with-button">
          <input v-model="editingPiece.musicxml" type="text" />
          <button type="button" @click="goToUpload('musicxml', 'musicxml')">Upload</button>
        </div>
      </label>

      <label>
        Immagine
        <div class="field-with-button">
          <input v-model="editingPiece.image" type="text" />
          <button type="button" @click="goToUpload('image', 'img')">Upload</button>
        </div>
      </label>

      <label>
        Tags
        <input v-model="editingPiece.tagsText" type="text" placeholder="studio, romantico, op100" />
      </label>

      <label>
        Descrizione
        <textarea v-model="editingPiece.description" rows="5"></textarea>
      </label>

      <label>
        Note private
        <textarea v-model="editingPiece.notes" rows="4"></textarea>
      </label>

      <div class="edit-actions">
        <button type="submit">Salva</button>

        <button type="button" class="secondary-button" @click="cancelEdit">
          Annulla
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.admin-pieces {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.admin-section-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.admin-section-header h1 {
  margin: 0 0 0.25rem;
  font-size: 1.8rem;
}

.admin-section-header p {
  margin: 0;
  color: #666;
}

.header-actions,
.edit-actions {
  display: flex;
  gap: 0.75rem;
}

.admin-toolbar {
  display: flex;
  align-items: end;
  flex-wrap: wrap;
  gap: 1rem;
}

.admin-summary {
  display: inline-flex;
  align-items: baseline;
  gap: 0.4rem;
  width: fit-content;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.admin-summary strong {
  font-size: 1.5rem;
}

.admin-toolbar label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-weight: 600;
}

.admin-toolbar select {
  min-width: 180px;
  padding: 0.55rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font: inherit;
  background: #fff;
}

.admin-table-wrapper {
  overflow-x: auto;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
}

.admin-table th,
.admin-table td {
  padding: 0.55rem 0.6rem;
  text-align: left;
  border-bottom: 1px solid #eee;
  white-space: nowrap;
}

.admin-table th {
  font-weight: 600;
  color: #333;
}

.status-cell {
  text-align: center;
  font-weight: 700;
}

.status-ok {
  color: #198754;
  font-size: 1rem;
  font-weight: 700;
}

.status-missing {
  color: #dc3545;
  font-size: 1rem;
  font-weight: 700;
}

.actions-cell {
  text-align: right;
}

.actions-cell button {
  padding: 0.3rem 0.55rem;
  font-size: 0.78rem;
}

button {
  padding: 0.45rem 0.75rem;
  border: 1px solid #222;
  border-radius: 4px;
  background: #222;
  color: #fff;
  font: inherit;
  cursor: pointer;
}

.secondary-button {
  background: #fff;
  color: #222;
}

.sort-button {
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font-weight: 600;
}

.sort-button:hover {
  text-decoration: underline;
}

.edit-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem 1.5rem;
  max-width: 70%;
  padding: 1.25rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.82rem;
}

.edit-panel h2 {
  grid-column: 1 / -1;
  margin: 0;
  font-size: 1.2rem;
}

.edit-panel label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-weight: 600;
  font-size: 0.82rem;
}

.edit-panel input,
.edit-panel textarea,
.edit-panel select {
  padding: 0.45rem 0.55rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.82rem;
  font-family: inherit;
}

.edit-panel label:has(textarea) {
  grid-column: 1 / -1;
}

.edit-actions {
  grid-column: 1 / -1;
  display: flex;
  gap: 0.75rem;
}

.field-with-button {
  display: flex;
  gap: 0.5rem;
}

.field-with-button input {
  flex: 1;
}

.field-with-button button {
  flex-shrink: 0;
  padding: 0.45rem 0.65rem;
  font-size: 0.78rem;
}

@media (max-width: 700px) {
  .admin-section-header,
  .header-actions,
  .edit-actions {
    flex-direction: column;
  }

  .admin-toolbar {
    align-items: stretch;
  }

  .admin-toolbar select {
    width: 100%;
  }

  .edit-panel {
    grid-template-columns: 1fr;
    max-width: 100%;
  }

  .edit-panel h2,
  .edit-actions,
  .edit-panel label:has(textarea) {
    grid-column: auto;
  }

  .field-with-button {
    flex-direction: column;
  }
}
</style>
