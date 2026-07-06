<script setup>
import { computed, onMounted, ref } from 'vue'

const YEAR = 2026

const MONTHS = [
  'Gennaio',
  'Febbraio',
  'Marzo',
  'Aprile',
  'Maggio',
  'Giugno',
  'Luglio',
  'Agosto',
  'Settembre',
  'Ottobre',
  'Novembre',
  'Dicembre',
]

const MONTHS_SHORT = [
  'Gen',
  'Feb',
  'Mar',
  'Apr',
  'Mag',
  'Giu',
  'Lug',
  'Ago',
  'Set',
  'Ott',
  'Nov',
  'Dic',
]

const CHART_WIDTH = 1200
const LEFT_PAD = 70
const RIGHT_PAD = 80
const TOP_PAD = 90
const ROW_HEIGHT = 58

const works = ref([])

onMounted(async () => {
  const response = await fetch(`${import.meta.env.BASE_URL}data/repertoire.json`)
  works.value = await response.json()
})

function composerRoute(composer) {
  const value = String(composer || '').toLowerCase()

  if (value.includes('mozart')) return '/mozart'
  if (value.includes('burgmüller') || value.includes('burgmuller')) return '/burgmuller'
  if (value.includes('schumann')) return '/schumann'
  if (value.includes('čajkovskij') || value.includes('tchaikovsky')) return '/tchaikovsky'

  return '/'
}

const pieces = computed(() => {
  return works.value
    .flatMap((work) =>
      (work.pieces || [])
        .filter((piece) => piece.publishedAt)
        .map((piece) => ({
          ...piece,
          composer: piece.composer || work.composer || '',
          routePath: composerRoute(piece.composer || work.composer),
          collection: piece.collection || work.collection || work.title || '',
        })),
    )
    .sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt))
})

const mobileMonths = computed(() => {
  return MONTHS_SHORT.map((month, index) => ({
    month,
    pieces: pieces.value
      .filter((piece) => new Date(piece.publishedAt).getMonth() === index)
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)),
  }))
})

const chartHeight = computed(() => TOP_PAD + pieces.value.length * ROW_HEIGHT + 80)

function dayOfYear(dateString) {
  const date = new Date(dateString)
  const start = new Date(`${YEAR}-01-01`)

  return Math.max(0, Math.round((date - start) / 86400000))
}

function xFromDate(dateString) {
  const totalDays = 365
  const usableWidth = CHART_WIDTH - LEFT_PAD - RIGHT_PAD

  return LEFT_PAD + (dayOfYear(dateString) / totalDays) * usableWidth
}

function monthX(index) {
  const date = new Date(YEAR, index, 1)

  return xFromDate(date.toISOString().slice(0, 10))
}

function rowY(index) {
  return TOP_PAD + index * ROW_HEIGHT
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('it-IT')
}

function shortTitle(piece) {
  if (piece.subtitle) {
    return `${piece.title} — ${piece.subtitle}`
  }

  return piece.title
}

function pieceLink(piece) {
  return {
    path: piece.routePath,
    query: {
      play: piece.id,
      type: piece.mp3 ? 'mp3' : 'midi',
    },
    hash: `#${piece.id}`,
  }
}
</script>

<template>
  <section>
    <div class="gantt-svg-wrapper">
      <svg
        class="gantt-svg"
        :viewBox="`0 0 ${CHART_WIDTH} ${chartHeight}`"
        role="img"
        aria-label="Timeline delle pubblicazioni"
      >
        <text x="60" y="42" class="gantt-year">
          {{ YEAR }}
        </text>

        <line
          :x1="LEFT_PAD"
          :x2="CHART_WIDTH - RIGHT_PAD"
          :y1="chartHeight - 45"
          :y2="chartHeight - 45"
          class="gantt-axis"
        />

        <g v-for="(month, index) in MONTHS" :key="month">
          <line
            :x1="monthX(index)"
            :x2="monthX(index)"
            :y1="chartHeight - 45"
            :y2="chartHeight - 34"
            class="gantt-tick"
          />

          <text :x="monthX(index)" :y="chartHeight - 18" class="gantt-month" text-anchor="middle">
            {{ month }}
          </text>
        </g>

        <g v-for="(piece, index) in pieces" :key="`${piece.composer}-${piece.id}`">
          <line
            :x1="xFromDate(piece.publishedAt)"
            :x2="xFromDate(piece.publishedAt)"
            :y1="rowY(index) + 6"
            :y2="chartHeight - 45"
            class="gantt-guide"
          />

          <RouterLink :to="pieceLink(piece)">
            <circle
              :cx="xFromDate(piece.publishedAt)"
              :cy="rowY(index) + 12"
              r="8"
              class="gantt-dot gantt-dot-link"
            />
          </RouterLink>

          <RouterLink :to="pieceLink(piece)">
            <text
              :x="xFromDate(piece.publishedAt) + 18"
              :y="rowY(index) + 10"
              class="gantt-composer gantt-text-link"
            >
              {{ piece.composer }}
            </text>
          </RouterLink>

          <RouterLink :to="pieceLink(piece)">
            <text
              :x="xFromDate(piece.publishedAt) + 18"
              :y="rowY(index) + 28"
              class="gantt-title-small gantt-text-link"
            >
              {{ shortTitle(piece) }}
            </text>
          </RouterLink>
        </g>
      </svg>
    </div>

    <div class="mobile-month-timeline">
      <div class="mobile-month-year">
        {{ YEAR }}
      </div>

      <div v-for="month in mobileMonths" :key="month.month" class="mobile-month-row">
        <div class="mobile-month-label">
          {{ month.month }}
        </div>

        <div class="mobile-month-content">
          <div v-if="month.pieces.length === 0" class="mobile-month-empty">—</div>

          <div
            v-for="piece in month.pieces"
            :key="`mobile-${piece.composer}-${piece.id}`"
            class="mobile-month-piece"
          >
            <RouterLink :to="pieceLink(piece)" class="mobile-month-dot-link">
              <span class="mobile-month-dot"></span>
            </RouterLink>

            <RouterLink :to="pieceLink(piece)" class="mobile-month-text mobile-month-link">
              <div class="mobile-month-date">
                {{ formatDate(piece.publishedAt) }}
              </div>

              <div class="mobile-month-composer">
                {{ piece.composer }}
              </div>

              <div class="mobile-month-title">
                {{ shortTitle(piece) }}
              </div>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
