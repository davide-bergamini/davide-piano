<script setup>
import { ref, computed, onMounted } from 'vue'
import { loadPieces } from '../../services/pieces'

const pieces = ref([])

const totalPieces = computed(() => pieces.value.length)

const midiCount = computed(() =>
  pieces.value.filter((piece) => piece.midi?.full).length,
)

const mp3Count = computed(() =>
  pieces.value.filter((piece) => piece.mp3).length,
)

const publishedCount = computed(() =>
  pieces.value.filter((piece) => piece.published || piece.status === 'published').length,
)

onMounted(() => {
  pieces.value = loadPieces()
})
</script>

<template>
  <section class="admin-page">
    <h2>Dashboard</h2>

    <p class="dashboard-intro">
      Benvenuto nel CMS di Davide Piano. Da qui puoi controllare lo stato generale del repertorio.
    </p>

    <div class="dashboard-grid">
      <article class="dashboard-card">
        <span class="dashboard-number">{{ totalPieces }}</span>
        <strong>Brani</strong>
        <small>Gestione repertorio</small>
      </article>

      <article class="dashboard-card">
        <span class="dashboard-number">{{ midiCount }}</span>
        <strong>File MIDI</strong>
        <small>Collegati ai brani</small>
      </article>

      <article class="dashboard-card">
        <span class="dashboard-number">{{ mp3Count }}</span>
        <strong>File MP3</strong>
        <small>Registrazioni audio</small>
      </article>

      <article class="dashboard-card">
        <span class="dashboard-number">{{ publishedCount }}</span>
        <strong>Pubblicati</strong>
        <small>Visibili sul sito</small>
      </article>
    </div>

    <div class="dashboard-actions">
      <article>
        <h3>Prossime attività</h3>

        <ul>
          <li>Completare il collegamento tra Brani e Upload.</li>
          <li>Aggiungere Čajkovskij e Schumann al tabellone.</li>
          <li>Passare i dati da localStorage a Supabase.</li>
        </ul>
      </article>

      <article>
        <h3>Stato CMS</h3>

        <p>
          Il CMS legge i brani da <strong>pieces.js</strong> e mostra dati reali del repertorio.
        </p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.admin-page {
  max-width: 1000px;
}

h2 {
  margin: 0 0 14px;
  font-size: 2rem;
  font-weight: 700;
}

.dashboard-intro {
  max-width: 720px;
  margin: 0 0 28px;
  color: #666;
  line-height: 1.5;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}

.dashboard-card {
  border: 1px solid #ddd;
  background: #f7f7f7;
  padding: 18px;
}

.dashboard-number {
  display: block;
  margin-bottom: 12px;
  font-size: 2rem;
  font-weight: 700;
  color: #222;
}

.dashboard-card strong {
  display: block;
  font-weight: 700;
  margin-bottom: 4px;
}

.dashboard-card small {
  color: #666;
}

.dashboard-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.dashboard-actions article {
  border: 1px solid #ddd;
  padding: 18px;
  background: #fff;
}

.dashboard-actions h3 {
  margin: 0 0 12px;
  font-size: 1.1rem;
}

.dashboard-actions p {
  margin: 0;
  color: #666;
  line-height: 1.5;
}

.dashboard-actions ul {
  margin: 0;
  padding-left: 18px;
  color: #666;
  line-height: 1.6;
}

@media (max-width: 900px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-actions {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
