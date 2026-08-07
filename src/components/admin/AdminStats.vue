<script setup>
import { computed, ref } from 'vue'

const selectedPeriod = ref('all')

const periods = [
  { value: '7days', label: 'Ultimi 7 giorni' },
  { value: '30days', label: 'Ultimi 30 giorni' },
  { value: 'year', label: 'Anno corrente' },
  { value: 'all', label: 'Totale' },
]

const statistics = {
  '7days': {
    totalVisitors: 18,
    countries: [
      { name: 'Italia', visitors: 15 },
      { name: 'Germania', visitors: 2 },
      { name: 'Francia', visitors: 1 },
    ],
    cities: [
      { name: 'Modena', country: 'Italia', visitors: 7 },
      { name: 'Milano', country: 'Italia', visitors: 4 },
      { name: 'Bologna', country: 'Italia', visitors: 3 },
      { name: 'Berlino', country: 'Germania', visitors: 2 },
    ],
  },

  '30days': {
    totalVisitors: 64,
    countries: [
      { name: 'Italia', visitors: 51 },
      { name: 'Germania', visitors: 6 },
      { name: 'Stati Uniti', visitors: 4 },
      { name: 'Francia', visitors: 3 },
    ],
    cities: [
      { name: 'Modena', country: 'Italia', visitors: 22 },
      { name: 'Milano', country: 'Italia', visitors: 11 },
      { name: 'Bologna', country: 'Italia', visitors: 8 },
      { name: 'Roma', country: 'Italia', visitors: 6 },
      { name: 'Berlino', country: 'Germania', visitors: 4 },
    ],
  },

  year: {
    totalVisitors: 126,
    countries: [
      { name: 'Italia', visitors: 103 },
      { name: 'Germania', visitors: 9 },
      { name: 'Stati Uniti', visitors: 8 },
      { name: 'Francia', visitors: 6 },
    ],
    cities: [
      { name: 'Modena', country: 'Italia', visitors: 42 },
      { name: 'Milano', country: 'Italia', visitors: 18 },
      { name: 'Bologna', country: 'Italia', visitors: 12 },
      { name: 'Roma', country: 'Italia', visitors: 9 },
      { name: 'Berlino', country: 'Germania', visitors: 6 },
    ],
  },

  all: {
    totalVisitors: 184,
    countries: [
      { name: 'Italia', visitors: 149 },
      { name: 'Germania', visitors: 14 },
      { name: 'Stati Uniti', visitors: 12 },
      { name: 'Francia', visitors: 9 },
    ],
    cities: [
      { name: 'Modena', country: 'Italia', visitors: 61 },
      { name: 'Milano', country: 'Italia', visitors: 25 },
      { name: 'Bologna', country: 'Italia', visitors: 17 },
      { name: 'Roma', country: 'Italia', visitors: 13 },
      { name: 'Berlino', country: 'Germania', visitors: 9 },
    ],
  },
}

const currentStatistics = computed(() => statistics[selectedPeriod.value])
</script>

<template>
  <section class="admin-page stats-page">
    <div class="stats-header">
      <div>
        <h2>Statistiche</h2>

        <p>
          Visualizza il numero di visitatori e la loro provenienza geografica.
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

    <div class="stats-summary">
      <article class="stats-card">
        <span class="stats-label">Visitatori totali</span>

        <strong class="stats-number">
          {{ currentStatistics.totalVisitors }}
        </strong>

        <small>Utenti nel periodo selezionato</small>
      </article>
    </div>

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
                :key="country.name"
              >
                <td>{{ country.name }}</td>
                <td>{{ country.visitors }}</td>
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
                :key="`${city.name}-${city.country}`"
              >
                <td>{{ city.name }}</td>
                <td>{{ city.country }}</td>
                <td>{{ city.visitors }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </div>

    <p class="stats-demo-notice">
      I dati visualizzati in questa fase sono dimostrativi. Successivamente
      verranno sostituiti con quelli reali di Google Analytics.
    </p>
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
  grid-template-columns: minmax(220px, 320px);
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
}

.stats-panel {
  min-width: 0;
  border: 1px solid #dedede;
  background: #fff;
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

.stats-demo-notice {
  margin: 24px 0 0;
  padding: 12px 14px;
  border-left: 3px solid #999;
  background: #f7f7f7;
  color: #666;
  font-size: 0.88rem;
  line-height: 1.5;
}

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: 1fr;
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
}
</style>
