<script setup>
import { computed } from 'vue'

import { mozartSections } from '../data/mozart'
import { burgmullerSections } from '../data/burgmuller'

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

const CHART_WIDTH = 1200
const LEFT_PAD = 70
const RIGHT_PAD = 80
const TOP_PAD = 90
const ROW_HEIGHT = 58
const BAR_HEIGHT = 22

function getAutoStartDate(publishedAt) {
  const date = new Date(publishedAt)
  date.setDate(date.getDate() - 14)

  return date.toISOString().slice(0, 10)
}

function flattenPieces(sections, composer) {
  return sections.flatMap((section) =>
    section.pieces
      .filter((piece) => piece.publishedAt)
      .map((piece) => ({
        ...piece,
        composer,
        collection: section.title,
        startedAt: piece.startedAt || getAutoStartDate(piece.publishedAt),
      })),
  )
}

const pieces = computed(() => {
  return [
    ...flattenPieces(mozartSections, 'Mozart'),
    ...flattenPieces(burgmullerSections, 'Burgmüller'),
  ].sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt))
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
</script>

<template>
  <section>
    <h6 class="text-muted mb-4">Pubblicazioni</h6>

    <h2 class="mb-4">Timeline</h2>

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
            :x1="xFromDate(piece.startedAt)"
            :x2="xFromDate(piece.startedAt)"
            :y1="rowY(index) + 8"
            :y2="chartHeight - 45"
            class="gantt-guide"
          />

          <rect
            :x="xFromDate(piece.startedAt)"
            :y="rowY(index)"
            :width="Math.max(38, xFromDate(piece.publishedAt) - xFromDate(piece.startedAt))"
            :height="BAR_HEIGHT"
            rx="11"
            class="gantt-bar"
          />

          <circle
            :cx="xFromDate(piece.startedAt) + 10"
            :cy="rowY(index) + BAR_HEIGHT / 2"
            r="5"
            class="gantt-dot"
          />

          <text :x="xFromDate(piece.publishedAt) + 18" :y="rowY(index) + 16" class="gantt-composer">
            {{ piece.composer }}
          </text>

          <text
            :x="xFromDate(piece.publishedAt) + 18"
            :y="rowY(index) + 34"
            class="gantt-title-small"
          >
            {{ shortTitle(piece) }}
          </text>
        </g>
      </svg>
    </div>

    <div class="mobile-gantt">
      <div
        v-for="piece in pieces"
        :key="`mobile-${piece.composer}-${piece.id}`"
        class="mobile-gantt-item"
      >
        <div class="mobile-gantt-marker">
          <span class="mobile-gantt-dot"></span>
        </div>

        <div class="mobile-gantt-content">
          <div class="mobile-gantt-date">
            {{ formatDate(piece.publishedAt) }}
          </div>

          <div class="mobile-gantt-bar"></div>

          <div class="mobile-gantt-composer">
            {{ piece.composer }}
          </div>

          <div class="mobile-gantt-title">
            {{ shortTitle(piece) }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
