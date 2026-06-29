<script setup>
import { ref, onMounted, watch } from 'vue'
import { fetchLikes, incrementLike } from '../services/likes'

const props = defineProps({
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

const likes = ref({})
const likedPieces = ref({})

function localLikeKey(pieceId) {
  return `liked_${pieceId}`
}

function hasMidi(piece) {
  return Boolean(piece.midi?.full)
}

function hasMp3(piece) {
  return Boolean(piece.mp3)
}

function hasLiked(piece) {
  return likedPieces.value[piece.id] === true
}

function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('it-IT')
}

function toSuperscript(number) {
  const map = {
    0: '⁰',
    1: '¹',
    2: '²',
    3: '³',
    4: '⁴',
    5: '⁵',
    6: '⁶',
    7: '⁷',
    8: '⁸',
    9: '⁹',
  }

  return String(number)
    .split('')
    .map((char) => map[char] || char)
    .join('')
}

async function loadLikes() {
  const pieceIds = props.pieces.map((piece) => piece.id)

  if (pieceIds.length === 0) return

  const remoteLikes = await fetchLikes(pieceIds)

  const loadedLikedPieces = {}

  pieceIds.forEach((pieceId) => {
    loadedLikedPieces[pieceId] = localStorage.getItem(localLikeKey(pieceId)) === 'true'
  })

  likes.value = remoteLikes
  likedPieces.value = loadedLikedPieces
}

async function handleLike(piece) {
  if (hasLiked(piece)) return

  const newCount = await incrementLike(piece.id)

  if (newCount === null) return

  likes.value[piece.id] = newCount
  likedPieces.value[piece.id] = true

  localStorage.setItem(localLikeKey(piece.id), 'true')
}

onMounted(() => {
  loadLikes()
})

watch(
  () => props.pieces,
  () => {
    loadLikes()
  },
  { deep: true },
)
</script>

<template>
  <div class="piece-list">
    <div class="piece-list-head">
      <div>Brano</div>
      <div>Data</div>
      <div>MIDI</div>
      <div>MP3</div>
    </div>

    <div
      v-for="piece in pieces"
      :key="piece.id"
      class="piece-row"
      :class="{ 'is-playing': currentPiece?.id === piece.id }"
    >
      <div class="piece-top">
        <div class="piece-title-area">
          <span class="like-badge">
            <button
              class="like-button"
              type="button"
              :class="{ liked: hasLiked(piece) }"
              :title="hasLiked(piece) ? 'Hai già messo Mi piace' : 'Mi piace'"
              @click="handleLike(piece)"
            >
              👍︎
            </button>

            <span v-if="(likes[piece.id] || 0) > 0" class="like-count">
              {{ toSuperscript(likes[piece.id]) }}
            </span>
          </span>

          <span class="piece-title">
            {{ piece.title }}
          </span>

          <span v-if="piece.subtitle" class="piece-subtitle desktop-subtitle">
            {{ piece.subtitle }}
          </span>

          <span v-if="currentPiece?.id === piece.id" class="playing-label"> Now Playing </span>
        </div>

        <div class="piece-date">
          <span v-if="piece.publishedAt">
            {{ formatDate(piece.publishedAt) }}
          </span>

          <span v-else class="coming-soon-date"> Coming Soon </span>
        </div>

        <div class="piece-actions">
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
              ↓
            </a>
          </template>

          <span v-else class="muted">—</span>
        </div>

        <div class="piece-actions">
          <template v-if="hasMp3(piece)">
            <button
              class="icon-action mp3-play"
              type="button"
              title="Ascolta MP3"
              @click="emit('select-mp3', piece)"
            >
              ▶
            </button>

            <a class="icon-action download" :href="piece.mp3" download title="Scarica MP3"> ↓ </a>
          </template>

          <span v-else class="muted">—</span>
        </div>
      </div>

      <div v-if="piece.subtitle" class="piece-subtitle mobile-subtitle">
        {{ piece.subtitle }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.piece-list {
  background: #fff;
  border-top: 1px solid #d7d7d7;
}

.piece-list-head {
  display: grid;
  grid-template-columns: 1fr 130px 90px 90px;
  gap: 16px;
  padding: 9px 0;
  border-bottom: 1px solid #d7d7d7;
  color: #666;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.piece-row {
  border-bottom: 1px solid #e5e5e5;
  padding: 13px 0 11px;
}

.piece-row:hover {
  background: #fafafa;
}

.piece-row.is-playing {
  background: #f7faff;
}

.piece-top {
  display: grid;
  grid-template-columns: 1fr 130px 90px 90px;
  gap: 16px;
  align-items: center;
}

.piece-title-area {
  position: relative;
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
  padding-left: 24px;
}

.like-badge {
  position: absolute;
  left: 0;
  top: -9px;
  display: inline-flex;
  align-items: flex-start;
  gap: 1px;
  white-space: nowrap;
}

.like-button {
  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;
  font-size: 0.82rem;
  line-height: 1;
  opacity: 0.45;
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.like-button:hover {
  opacity: 0.85;
  transform: scale(1.18);
}

.like-button.liked {
  opacity: 1;
  cursor: default;
}

.like-button.liked:hover {
  transform: none;
}

.like-count {
  font-size: 0.6rem;
  color: #666;
  line-height: 1;
  font-weight: 700;
  margin-left: 1px;
}

.piece-title {
  font-size: 0.98rem;
  font-weight: 700;
  color: #222;
  white-space: nowrap;
}

.piece-subtitle {
  font-size: 0.92rem;
  color: #666;
}

.desktop-subtitle {
  white-space: nowrap;
}

.mobile-subtitle {
  display: none;
}

.playing-label {
  margin-left: 8px;
  color: #2563eb;
  font-size: 0.75rem;
  font-weight: 700;
}

.piece-date {
  color: #555;
  font-size: 0.9rem;
  white-space: nowrap;
}

.coming-soon-date {
  color: #888;
  font-style: italic;
  font-size: 0.88rem;
}

.piece-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.icon-action {
  width: 22px;
  height: 22px;
  border: 0;
  background: transparent;
  color: #444;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  text-decoration: none;
  appearance: none;
  -webkit-appearance: none;
}

.icon-action:hover {
  color: #000;
}

.midi-play {
  color: #2563eb;
}

.mp3-play {
  color: #198754;
}

.download {
  color: #555;
  font-size: 1rem;
}

.muted {
  color: #aaa;
}

@media (max-width: 768px) {
  .piece-list-head,
  .piece-top {
    grid-template-columns: minmax(0, 1fr) 72px 44px 44px;
    gap: 8px;
  }

  .piece-list-head {
    padding: 8px 0;
    font-size: 0.72rem;
    letter-spacing: 0.03em;
  }

  .piece-row {
    padding: 14px 0 12px;
  }

  .piece-title-area {
    padding-left: 23px;
    gap: 6px;
  }

  .like-badge {
    top: -8px;
  }

  .like-button {
    font-size: 0.78rem;
  }

  .like-count {
    font-size: 0.56rem;
  }

  .piece-title {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.96rem;
  }

  .desktop-subtitle {
    display: none;
  }

  .mobile-subtitle {
    display: block;
    margin-top: 3px;
    font-size: 0.9rem;
    color: #666;
  }

  .piece-date {
    justify-self: start;
    font-size: 0.78rem;
  }

  .coming-soon-date {
    font-size: 0.78rem;
  }

  .piece-actions {
    width: 44px;
    justify-self: start;
    gap: 4px;
  }

  .icon-action {
    width: 20px;
    height: 20px;
    font-size: 0.78rem;
  }

  .playing-label {
    display: none;
  }
}
</style>
