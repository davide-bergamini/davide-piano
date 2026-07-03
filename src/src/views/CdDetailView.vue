<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { cds } from '../data/cds'

const route = useRoute()

const cd = computed(() => {
  return cds.find((item) => item.id === route.params.id)
})

function coverUrl(cd) {
  if (!cd?.cover) return ''
  return `${import.meta.env.BASE_URL}${cd.cover.replace(/^\//, '')}`
}

function musixmatchUrl(track) {
  const query = `${cd.value.artist} ${track.title} site:musixmatch.com`
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`
}
</script>

<template>
  <section v-if="cd" class="cd-detail-page">
    <RouterLink class="back-link" to="/discoteca"> ← Torna a I miei CD </RouterLink>

    <div class="cd-detail-header">
      <div class="cd-cover-large">
        <img v-if="cd.cover" :src="coverUrl(cd)" :alt="cd.title" />
        <div v-else class="cd-placeholder">💿</div>
      </div>

      <div class="cd-main-info">
        <h1>{{ cd.title }}</h1>

        <div class="cd-meta">
          <div v-if="cd.artist"><strong>Artista:</strong> {{ cd.artist }}</div>
          <div v-if="cd.labelName"><strong>Etichetta:</strong> {{ cd.labelName }}</div>
          <div v-if="cd.year"><strong>Anno:</strong> {{ cd.year }}</div>
          <div v-if="cd.genre"><strong>Genere:</strong> {{ cd.genre }}</div>
          <div v-if="cd.style"><strong>Stile:</strong> {{ cd.style }}</div>
        </div>

        <a
          v-if="cd.discogsUrl"
          class="discogs-link"
          :href="cd.discogsUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          Vedi su Discogs
        </a>
      </div>
    </div>

    <section class="track-section">
      <h2>Elenco tracce</h2>

      <table v-if="cd.tracks && cd.tracks.length" class="track-table">
        <tbody>
          <tr v-for="track in cd.tracks" :key="track.number + track.title">
            <td class="track-number">{{ track.number }}</td>

            <td class="track-title">
              <a
                :href="musixmatchUrl(track)"
                target="_blank"
                rel="noopener noreferrer"
                title="Cerca il testo su Musixmatch"
              >
                {{ track.title }}
              </a>
            </td>

            <td class="track-duration">{{ track.duration }}</td>
          </tr>
        </tbody>
      </table>

      <p v-else class="no-tracks">Nessuna tracklist disponibile.</p>
    </section>
  </section>

  <section v-else class="cd-detail-page">
    <p>CD non trovato.</p>
  </section>
</template>

<style scoped>
.cd-detail-page {
  padding: 0;
}

.back-link {
  display: inline-block;
  margin-bottom: 22px;
  color: #333;
  text-decoration: none;
  font-size: 0.9rem;
}

.back-link:hover {
  text-decoration: underline;
}

.cd-detail-header {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 28px;
  align-items: start;
  margin-bottom: 34px;
}

.cd-cover-large {
  width: 180px;
  height: 180px;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
  background: #f3f3f3;
}

.cd-cover-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cd-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #777;
}

.cd-main-info h1 {
  font-size: 2rem;
  color: #222;
  margin: 0 0 14px;
}

.cd-meta {
  font-size: 0.95rem;
  line-height: 1.7;
  color: #555;
  margin-bottom: 14px;
}

.cd-meta strong {
  color: #222;
}

.discogs-link {
  color: #0d6efd;
  text-decoration: none;
  font-size: 0.9rem;
}

.discogs-link:hover {
  text-decoration: underline;
}

.track-section h2 {
  font-size: 1.45rem;
  margin-bottom: 10px;
  color: #222;
}

.track-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.track-table tr {
  border-top: 1px solid #e0e0e0;
}

.track-table tr:last-child {
  border-bottom: 1px solid #e0e0e0;
}

.track-table td {
  padding: 7px 4px;
}

.track-number {
  width: 55px;
  color: #666;
}

.track-title a {
  color: #222;
  text-decoration: none;
}

.track-title a:hover {
  text-decoration: underline;
}

.track-duration {
  width: 80px;
  text-align: right;
  color: #666;
}

.no-tracks {
  color: #666;
}

@media (max-width: 768px) {
  .cd-detail-header {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .cd-cover-large {
    width: 150px;
    height: 150px;
  }

  .cd-main-info h1 {
    font-size: 1.5rem;
  }

  .track-table {
    font-size: 0.88rem;
  }
}
</style>
