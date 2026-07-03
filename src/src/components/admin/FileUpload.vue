<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: String,
  accept: String,
  folder: String,
})

const owner = 'davide-bergamini'
const repo = 'davide-piano'
const branch = 'main'

const inputFile = ref(null)
const selectedFile = ref(null)
const status = ref('')
const isUploading = ref(false)

function chooseFile() {
  inputFile.value.click()
}

function onFileSelected(e) {
  selectedFile.value = e.target.files[0] || null
  status.value = ''
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject

    reader.readAsDataURL(file)
  })
}

async function getExistingFileSha(path, token) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
      },
    },
  )

  if (response.status === 404) return null

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message)
  }

  const data = await response.json()
  return data.sha
}

async function upload() {
  if (!selectedFile.value) return

  const token = localStorage.getItem('github_token')

  if (!token) {
    status.value = 'Salva prima il token GitHub.'
    return
  }

  isUploading.value = true
  status.value = 'Caricamento in corso...'

  try {
    const file = selectedFile.value
    const path = `public/${props.folder}/${file.name}`
    const content = await fileToBase64(file)
    const sha = await getExistingFileSha(path, token)

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
      },
      body: JSON.stringify({
        message: sha ? `Update ${file.name}` : `Upload ${file.name}`,
        content,
        branch,
        ...(sha ? { sha } : {}),
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message)
    }

    status.value = sha
      ? `File aggiornato correttamente: ${file.name}`
      : `File caricato correttamente: ${file.name}`

    if (props.folder === 'midi') {
      localStorage.setItem('last_uploaded_midi', file.name)
    }

    if (props.folder === 'mp3') {
      localStorage.setItem('last_uploaded_mp3', file.name)
    }

    selectedFile.value = null
    inputFile.value.value = ''
  } catch (err) {
    status.value = `Errore: ${err.message}`
  } finally {
    isUploading.value = false
  }
}
</script>

<template>
  <section class="admin-section">
    <h3>{{ title }}</h3>

    <input ref="inputFile" type="file" :accept="accept" hidden @change="onFileSelected" />

    <div class="admin-row">
      <button type="button" @click="chooseFile">
        {{ selectedFile ? 'Cambia file' : 'Scegli file' }}
      </button>

      <div class="filename">
        {{ selectedFile ? selectedFile.name : 'Nessun file selezionato' }}
      </div>

      <button type="button" :disabled="!selectedFile || isUploading" @click="upload">
        {{ isUploading ? 'Caricamento...' : 'Carica' }}
      </button>
    </div>

    <p v-if="status" class="admin-status">
      {{ status }}
    </p>
  </section>
</template>

<style scoped>
.admin-section {
  width: 100%;
}

h3 {
  margin: 0 0 0.7rem;
  font-size: 1.1rem;
  font-weight: 500;
}

.admin-row {
  display: flex;
  gap: 0.7rem;
  align-items: stretch;
}

button {
  padding: 0.65rem 1rem;
  background: #111;
  color: #fff;
  border: 1px solid #111;
  font: inherit;
  cursor: pointer;
  white-space: nowrap;
}

button:hover {
  background: #333;
}

button:disabled {
  opacity: 0.45;
  cursor: default;
}

.filename {
  flex: 1;
  padding: 0.65rem 0.8rem;
  border: 1px solid #111;
  display: flex;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.admin-status {
  margin-top: 0.7rem;
  font-size: 0.92rem;
  color: #495057;
}

@media (max-width: 700px) {
  .admin-row {
    flex-direction: column;
  }
}
</style>
