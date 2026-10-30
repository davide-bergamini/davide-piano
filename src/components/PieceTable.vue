
<script setup>
import { ref, watch } from 'vue'
import { fetchLikes, incrementLike } from '../services/likes'
import { fetchComments, addComment } from '../services/comments'

const props = defineProps({
  pieces: {
    type: Array,
    required: true,
  },
  workId: {
    type: String,
    required: true,
  },
  subtitleColumn: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['select-mp3'])

const openedDescriptionId = ref(null)
const likes = ref({})
const likedIds = ref(new Set())
const pendingIds = ref(new Set())

const comments = ref([])
const commentDraft = ref('')
const submittingComment = ref(false)
const commentsError = ref('')

const LIKED_KEY = 'davide-piano-liked-pieces'

function loadLocalLikes() {
  try {
    const saved = JSON.parse(localStorage.getItem(LIKED_KEY) || '[]')
    likedIds.value = new Set(saved)
  } catch {
    likedIds.value = new Set()
  }
}

function saveLocalLikes() {
  localStorage.setItem(
    LIKED_KEY,
    JSON.stringify([...likedIds.value])
  )
}

async function loadLikes() {
  const ids = props.pieces.map(piece => piece.id)

  if (!ids.length) return

  loadLocalLikes()
  likes.value = await fetchLikes(ids)
}

async function likePiece(piece) {
  if (
    likedIds.value.has(piece.id) ||
    pendingIds.value.has(piece.id)
  ) {
    return
  }

  pendingIds.value.add(piece.id)

  try {
    const total = await incrementLike(piece.id)

    if (total === null) return

    likes.value = {
      ...likes.value,
      [piece.id]: total,
    }

    likedIds.value = new Set([
      ...likedIds.value,
      piece.id,
    ])

    saveLocalLikes()
  } finally {
    pendingIds.value.delete(piece.id)
  }
}

async function loadComments() {
  commentsError.value = ''
  comments.value = await fetchComments(props.workId)
}

async function publishComment() {
  const text = commentDraft.value.trim()

  if (text.length < 2 || text.length > 1000) return
  if (submittingComment.value) return

  submittingComment.value = true
  commentsError.value = ''

  try {
    const newComment = await addComment(props.workId, text)

    if (!newComment) {
      commentsError.value = 'Non è stato possibile pubblicare il commento. Riprova.'
      return
    }

    comments.value = [...comments.value, newComment]
    commentDraft.value = ''
  } catch (error) {
    console.error('Errore pubblicazione commento:', error)
    commentsError.value = 'Errore durante la pubblicazione. Riprova.'
  } finally {
    submittingComment.value = false
  }
}

function formatCommentDate(dateString) {
  return new Date(dateString).toLocaleString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

watch(
  () => props.pieces.map(piece => piece.id),
  loadLikes,
  { immediate: true }
)

watch(
  () => props.workId,
  loadComments,
  { immediate: true }
)

function hasMp3(piece) {
  return Boolean(piece.mp3)
}

function hasDescription(piece) {
  return Boolean(piece.description)
}

function toggleDescription(piece) {
  if (!hasDescription(piece)) return

  openedDescriptionId.value =
    openedDescriptionId.value === piece.id ? null : piece.id
}

function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('it-IT')
}
</script>

<template>
  <div class="piece-list">
    <div class="piece-list-head">
      <div>Brano</div>
      <div>Data</div>
      <div>Azioni</div>
    </div>

    <div
      v-for="piece in pieces"
      :key="piece.id"
      class="piece-row"
    >
      <div class="piece-top">
        <div class="piece-title-area">
          <button
            type="button"
            class="piece-title"
            :class="{ clickable: hasDescription(piece) }"
            @click="toggleDescription(piece)"
          >
            {{ piece.title }}
          </button>

          <span
            v-if="piece.subtitle"
            class="piece-subtitle desktop-subtitle"
          >
            {{ piece.subtitle }}
          </span>
        </div>

        <div class="piece-date">
          <span v-if="piece.publishedAt">
            {{ formatDate(piece.publishedAt) }}
          </span>

          <span v-else-if="hasMp3(piece)" class="published-no-date">
            Disponibile
          </span>

          <span v-else class="coming-soon-date">
            Coming Soon
          </span>
        </div>

        <div class="piece-actions">
          <button
            v-if="hasMp3(piece)"
            class="icon-action mp3-play"
            type="button"
            title="Ascolta MP3"
            aria-label="Ascolta MP3"
            @click="emit('select-mp3', piece)"
          >
            ▶
          </button>

          <button
            class="like-button"
            :class="{ liked: likedIds.has(piece.id) }"
            type="button"
            :disabled="likedIds.has(piece.id) || pendingIds.has(piece.id)"
            :title="likedIds.has(piece.id) ? 'Hai già messo Mi piace' : 'Mi piace'"
            :aria-label="`Mi piace: ${likes[piece.id] ?? 0}`"
            @click="likePiece(piece)"
          >
            <span>👍</span>
            <span class="like-count">
              {{ likes[piece.id] ?? 0 }}
            </span>
          </button>
        </div>
      </div>

      <div
        v-if="piece.subtitle"
        class="piece-subtitle mobile-subtitle"
      >
        {{ piece.subtitle }}
      </div>

      <div
        v-if="openedDescriptionId === piece.id"
        class="piece-description-panel"
      >
        {{ piece.description }}
      </div>
    </div>

    <!-- Commenti dell'intera opera -->
    <div class="work-comments">

      <div v-if="comments.length" class="comments-list">
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="comment-item"
        >
          <div class="comment-header">
            <strong>{{ comment.author_name }}</strong>
            <span>{{ formatCommentDate(comment.created_at) }}</span>
          </div>

          <p class="comment-text">{{ comment.comment }}</p>
        </div>
      </div>

      <form class="comment-form" @submit.prevent="publishComment">
        <label for="work-comment">Lascia un commento</label>

        <textarea
          id="work-comment"
          v-model="commentDraft"
          placeholder="Scrivi le tue impressioni dopo aver ascoltato l'opera..."
          maxlength="1000"
          rows="3"
          required
        ></textarea>

        <div class="comment-form-footer">
          <span class="comment-anonymous">Pubblicherai come Anonimo</span>

          <span class="comment-counter">
            {{ commentDraft.length }}/1000
          </span>
        </div>

        <button
          type="submit"
          class="comment-submit"
          :disabled="commentDraft.trim().length < 2 || submittingComment"
        >
          {{ submittingComment ? 'Pubblicazione...' : 'Pubblica commento' }}
        </button>

        <p v-if="commentsError" class="comment-error">
          {{ commentsError }}
        </p>
      </form>
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
  grid-template-columns: 1fr 130px 110px;
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

.piece-top {
  display: grid;
  grid-template-columns: 1fr 130px 110px;
  gap: 16px;
  align-items: center;
}

.piece-title-area {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.piece-title {
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  font-size: 0.98rem;
  font-weight: 700;
  color: #222;
  white-space: nowrap;
  text-align: left;
}

.piece-title.clickable {
  color: #1d4ed8;
  cursor: pointer;
  transition: color 0.2s ease;
}

.piece-title.clickable:hover {
  color: #2563eb;
  text-decoration: underline;
}

.piece-title.clickable:focus-visible {
  outline: none;
  color: #2563eb;
  text-decoration: underline;
}

.published-no-date {
  color: #555;
  font-size: 0.88rem;
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
  gap: 10px;
  white-space: nowrap;
}

.icon-action {
  width: 22px;
  height: 22px;
  border: 0;
  border-radius: var(--radius);
  background: transparent;
  color: #444;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
}

.icon-action:hover {
  background: #f1f1f1;
  color: #000;
}

.mp3-play {
  color: #198754;
}

.like-button {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 5px;
  border: 0;
  border-radius: var(--radius);
  background: transparent;
  color: #555;
  font: inherit;
  font-size: 0.85rem;
  cursor: pointer;
}

.like-button:hover:not(:disabled) {
  background: #f1f1f1;
}

.like-button.liked {
  color: #1d4ed8;
  font-weight: 700;
}

.like-button:disabled {
  cursor: default;
  opacity: 0.85;
}

.like-count {
  font-size: 0.82rem;
}

.piece-description-panel {
  margin-top: 10px;
  padding: 12px 14px;
  background: #f8f9fa;
  border-left: 3px solid #1d4ed8;
  border-radius: var(--radius);
  color: #495057;
  font-size: 0.92rem;
  line-height: 1.5;
  max-width: 720px;
  animation: description-slide 0.22s ease-out;
}

@keyframes description-slide {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Commenti dell'opera */

.work-comments {
  margin-top: 24px;
  padding: 20px 0 8px;
}

.comments-title {
  margin: 0 0 18px;
  font-size: 1.05rem;
  font-weight: 700;
  color: #333;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 22px;
}

.comment-item {
  padding: 12px 14px;
  background: #f8f9fa;
  border-radius: var(--radius);
}

.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 7px;
  font-size: 0.85rem;
}

.comment-header strong {
  color: #333;
}

.comment-header span {
  color: #888;
  font-size: 0.78rem;
}

.comment-text {
  margin: 0;
  color: #444;
  font-size: 0.92rem;
  line-height: 1.5;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.no-comments {
  margin: 0 0 20px;
  color: #888;
  font-size: 0.9rem;
}

.comment-form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 9px;
  max-width: 720px;
}

.comment-form label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #444;
}

.comment-form textarea {
  width: 100%;
  padding: 11px 12px;
  border: 1px solid #d7d7d7;
  border-radius: var(--radius);
  font: inherit;
  font-size: 0.9rem;
  line-height: 1.5;
  resize: vertical;
  box-sizing: border-box;
}

.comment-form textarea:focus {
  outline: none;
  border-color: #1d4ed8;
}

.comment-form-footer {
  display: flex;
  justify-content: space-between;
  width: 100%;
  color: #888;
  font-size: 0.78rem;
}

.comment-submit {
  padding: 8px 15px;
  border: 0;
  border-radius: var(--radius);
  background: #000;
  color: #fff;
  font-size: 0.88rem;
  cursor: pointer;
}

.comment-submit:hover:not(:disabled) {
  background: #333;
}

.comment-submit:disabled {
  opacity: 0.5;
  cursor: default;
}

.comment-error {
  margin: 3px 0 0;
  color: #b42318;
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .piece-list-head,
  .piece-top {
    grid-template-columns: minmax(0, 1fr) 72px 76px;
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
    gap: 6px;
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
    width: 76px;
    justify-self: start;
    gap: 5px;
  }

  .icon-action {
    width: 20px;
    height: 20px;
    font-size: 0.78rem;
  }

  .like-button {
    gap: 2px;
    padding: 2px;
    font-size: 0.76rem;
  }

  .like-count {
    font-size: 0.75rem;
  }

  .piece-description-panel {
    margin-top: 10px;
    padding: 11px 12px;
    font-size: 0.9rem;
    max-width: none;
  }

  .work-comments {
    margin-top: 20px;
    padding-top: 17px;
  }

  .comment-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 3px;
  }

  .comment-form {
    max-width: none;
  }

  .comment-submit {
    width: 100%;
  }
}
</style>
