
<script setup>
import { computed, ref, watch } from 'vue'

const selectedPeriod = ref('30days')

const periods = [
  { value: '7days', label: 'Ultimi 7 giorni' },
  { value: '30days', label: 'Ultimi 30 giorni' },
  { value: 'year', label: 'Anno corrente' },
  { value: 'all', label: 'Totale dal 2026' },
]

const statistics = ref({
  summary: {
    pageViews: 0,
    users: 0,
  },
  daily: [],
  pages: [],
  countries: [],
  cities: [],
})

const loading = ref(false)
const error = ref('')

const endpoint =
  'https://ijiallyxrxewbmjmqaud.supabase.co/functions/v1/ga4-stats'

async function loadStatistics() {
  loading.value = true
  error.value = ''

  try {
    const response = await fetch(
      `${endpoint}?period=${selectedPeriod.value}`
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data.error || 'Errore nel caricamento delle statistiche'
      )
    }

    statistics.value = data
  } catch (err) {
    error.value =
      err.message || 'Impossibile caricare le statistiche'
  } finally {
    loading.value = false
  }
}

watch(selectedPeriod, loadStatistics, { immediate: true })

const currentStatistics = computed(() => statistics.value)

const maxDailyViews = computed(() => {
  return Math.max(
    1,
    ...statistics.value.daily.map(day => day.pageViews)
  )
})

function formatDate(value) {
  if (!value || value.length !== 8) return value

  const year = Number(value.slice(0, 4))
  const month = Number(value.slice(4, 6)) - 1
  const day = Number(value.slice(6, 8))

  return new Date(year, month, day).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
  })
}
</script>

<template>
  <section class="admin-page stats-page">
    <div class="stats-header">
      <div>
        <h2>Statistiche</h2>

        <p>
          Visualizza il numero di visitatori, le pagine viste
          e la loro provenienza geografica.
        </p>
      </div>

      <label class="period-selector">
        <span>Periodo</span>

        <select v-model="selectedPeriod">
          <option
            v-for="period in periods"
            :key="period.value"
            :value="period.value"
          >
            {{ period.label }}
          </option>
        </select>
      </label>
    </div>

    <p v-if="loading" class="stats-message">
      Caricamento statistiche...
    </p>

    <p v-if="error" class="stats-error">
      {{ error }}
    </p>

    <template v-if="!loading && !error">
      <!-- Riepilogo -->
      <div class="stats-summary">
        <article class="stats-card">
          <span class="stats-label">Visitatori unici</span>

          <strong class="stats-number">
            {{ currentStatistics.summary.users }}
          </strong>

          <small>Utenti nel periodo selezionato</small>
        </article>

        <article class="stats-card">
          <span class="stats-label">Visualizzazioni</span>

          <strong class="stats-number">
            {{ currentStatistics.summary.pageViews }}
          </strong>

          <small>Pagine visualizzate nel periodo</small>
        </article>
      </div>

      <!-- Andamento giornaliero -->
      <article class="stats-panel daily-panel">
        <div class="panel-header">
          <h3>Visualizzazioni giornaliere</h3>
        </div>

        <div class="daily-chart">
          <div
            v-for="day in currentStatistics.daily"
            :key="day.date"
            class="daily-column"
          >
            <span class="daily-value">
              {{ day.pageViews }}
            </span>

            <div class="daily-bar-container">
              <div
                class="daily-bar"
                :style="{
                  height: `${Math.max(
                    3,
                    (day.pageViews / maxDailyViews) * 100
                  )}%`,
                }"
              ></div>
            </div>

            <span class="daily-date">
              {{ formatDate(day.date) }}
            </span>
          </div>
        </div>
      </article>

      <!-- Provenienza geografica -->
      <div class="stats-grid">
        <article class="stats-panel">
          <div class="panel-header">
            <h3>Visitatori per nazione</h3>
          </div>

          <div class="stats-table-wrapper">
            <table class="stats-table">
              <thead>
                <tr>
                  <th>Nazione</th>
                  <th>Visitatori</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="country in currentStatistics.countries"
                  :key="country.country"
                >
                  <td>{{ country.country }}</td>
                  <td>{{ country.users }}</td>
                </tr>

                <tr v-if="!currentStatistics.countries.length">
                  <td colspan="2">Nessun dato disponibile</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <article class="stats-panel">
          <div class="panel-header">
            <h3>Visitatori per città</h3>
          </div>

          <div class="stats-table-wrapper">
            <table class="stats-table">
              <thead>
                <tr>
                  <th>Città</th>
                  <th>Nazione</th>
                  <th>Visitatori</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="city in currentStatistics.cities"
                  :key="`${city.city}-${city.country}`"
                >
                  <td>{{ city.city }}</td>
                  <td>{{ city.country }}</td>
                  <td>{{ city.users }}</td>
                </tr>

                <tr v-if="!currentStatistics.cities.length">
                  <td colspan="3">Nessun dato disponibile</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </div>

      <!-- Pagine più viste -->
      <article class="stats-panel pages-panel">
        <div class="panel-header">
          <h3>Pagine più viste</h3>
        </div>

        <div class="stats-table-wrapper">
          <table class="stats-table">
            <thead>
              <tr>
                <th>Pagina</th>
                <th>Visualizzazioni</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="page in currentStatistics.pages"
                :key="page.path"
              >
                <td>{{ page.path }}</td>
                <td>{{ page.pageViews }}</td>
              </tr>

              <tr v-if="!currentStatistics.pages.length">
                <td colspan="2">Nessun dato disponibile</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </template>
  </section>
</template>

<style scoped>
.stats-page {
  width: 100%;
}

.stats-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 32px;
}

.stats-header h2 {
  margin: 0 0 8px;
  font-size: 1.8rem;
  font-weight: 600;
}

.stats-header p {
  margin: 0;
  color: #666;
  line-height: 1.5;
}

.period-selector {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 180px;
}

.period-selector span {
  color: #666;
  font-size: 0.82rem;
  font-weight: 600;
}

.period-selector select {
  width: 100%;
  padding: 9px 10px;
  border: 1px solid #ccc;
  border-radius: 0;
  background: #fff;
  color: #222;
  font: inherit;
  cursor: pointer;
}

.stats-summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(220px, 320px));
  gap: 20px;
  margin-bottom: 32px;
}

.stats-card {
  padding: 24px;
  border: 1px solid #dedede;
  background: #fafafa;
}

.stats-label {
  display: block;
  margin-bottom: 12px;
  color: #666;
  font-size: 0.88rem;
  font-weight: 600;
}

.stats-number {
  display: block;
  margin-bottom: 8px;
  font-size: 2.4rem;
  line-height: 1;
}

.stats-card small {
  color: #777;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px;
  margin-bottom: 28px;
}

.stats-panel {
  min-width: 0;
  border: 1px solid #dedede;
  background: #fff;
  margin-bottom: 28px;
}

.panel-header {
  padding: 18px 20px;
  border-bottom: 1px solid #dedede;
  background: #fafafa;
}

.panel-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.stats-table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.stats-table {
  width: 100%;
  border-collapse: collapse;
}

.stats-table th,
.stats-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e6e6e6;
  text-align: left;
  white-space: nowrap;
}

.stats-table th {
  color: #666;
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.stats-table td {
  font-size: 0.92rem;
}

.stats-table th:last-child,
.stats-table td:last-child {
  text-align: right;
}

.stats-table tbody tr:last-child td {
  border-bottom: 0;
}

.daily-panel {
  margin-bottom: 28px;
}

.daily-chart {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  min-height: 220px;
  padding: 24px 20px 16px;
  overflow-x: auto;
}

.daily-column {
  display: flex;
  flex: 1 0 32px;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  height: 180px;
  min-width: 32px;
}

.daily-value {
  color: #555;
  font-size: 0.78rem;
  font-weight: 600;
}

.daily-bar-container {
  display: flex;
  align-items: flex-end;
  width: 100%;
  height: 125px;
  background: #f1f1f1;
}

.daily-bar {
  width: 100%;
  min-height: 3px;
  background: #777;
  transition: height 0.2s ease;
}

.daily-date {
  color: #666;
  font-size: 0.72rem;
  white-space: nowrap;
}

.stats-message {
  padding: 20px 0;
  color: #666;
}

.stats-error {
  padding: 14px;
  border-left: 3px solid #b44;
  background: #fff5f5;
  color: #a22;
}

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 0;
  }
}

@media (max-width: 600px) {
  .stats-header {
    align-items: stretch;
    flex-direction: column;
  }

  .period-selector {
    width: 100%;
  }

  .stats-summary {
    grid-template-columns: 1fr;
  }

  .stats-card {
    padding: 20px;
  }

  .daily-chart {
    gap: 8px;
  }
}
</style>
