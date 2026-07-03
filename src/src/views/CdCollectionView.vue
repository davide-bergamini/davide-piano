<script setup>
import { RouterLink } from 'vue-router'
import { cds } from '../data/cds'

function coverUrl(cd) {
  if (!cd.cover) return ''

  return `${import.meta.env.BASE_URL}${cd.cover.replace(/^\//, '')}`
}
</script>

<template>
  <section class="cd-page">
    <header class="cd-header">
      <h1>I miei CD</h1>
      <p>La mia collezione di CD, con riferimenti a Discogs.</p>
    </header>

    <div class="cd-list">
      <RouterLink v-for="cd in cds" :key="cd.id" class="cd-row" :to="`/discoteca/${cd.id}`">
        <div class="cd-cover">
          <img v-if="cd.cover" :src="coverUrl(cd)" :alt="cd.title" />

          <div v-else class="cd-placeholder">💿</div>
        </div>

        <div class="cd-info">
          <h2>{{ cd.title }}</h2>

          <div class="cd-details">
            {{ cd.type || 'Album' }}
            <span v-if="cd.year"> • {{ cd.year }}</span>
            <span v-if="cd.labelName"> • {{ cd.labelName }}</span>
          </div>
        </div>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.cd-page {
  padding: 0;
}

.cd-header {
  margin-bottom: 28px;
}

.cd-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #222;
  margin: 0 0 8px;
}

.cd-header p {
  color: #666;
  margin: 0;
  font-size: 1rem;
}

.cd-list {
  display: flex;
  flex-direction: column;
  border-top: 1px solid #e0e0e0;
}

.cd-row {
  display: grid;
  grid-template-columns: 70px 1fr;
  gap: 18px;
  align-items: center;
  padding: 12px 0;
  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid #e0e0e0;
}

.cd-row:hover h2 {
  text-decoration: underline;
}

.cd-cover {
  width: 70px;
  height: 70px;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
  background: #f3f3f3;
}

.cd-cover img {
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
  font-size: 1.6rem;
  color: #777;
}

.cd-info {
  min-width: 0;
}

.cd-info h2 {
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.25;
  color: #222;
  margin: 0 0 5px;
}

.cd-details {
  font-size: 0.85rem;
  line-height: 1.35;
  color: #666;
}

@media (max-width: 768px) {
  .cd-row {
    grid-template-columns: 58px 1fr;
    gap: 14px;
    padding: 10px 0;
  }

  .cd-cover {
    width: 58px;
    height: 58px;
  }

  .cd-placeholder {
    font-size: 1.35rem;
  }

  .cd-info h2 {
    font-size: 0.98rem;
  }

  .cd-details {
    font-size: 0.78rem;
  }
}
</style>
