<script setup>
import { computed, onMounted, ref } from 'vue'

const works = ref([])

onMounted(async () => {
  const response = await fetch(`${import.meta.env.BASE_URL}data/repertoire.json`)
  works.value = await response.json()
})

const allPieces = computed(() => {
  return works.value.flatMap((work) =>
    (work.pieces || []).map((piece) => ({
      ...piece,
      sectionTitle: piece.sectionTitle || work.title || '',
      composerName: piece.composer || work.composer || '',
      composerImage: piece.image || work.image || '',
    })),
  )
})

const latestPiece = computed(() => {
  return allPieces.value
    .filter((piece) => piece.publishedAt && piece.mp3)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))[0]
})
</script>

<template>
  <section class="home-animation">
    <div class="pianist">
      <div class="notes">
        <span>♪</span>
        <span>♫</span>
        <span>♪</span>
      </div>

      <div class="piano">
        <div class="keys">
          <span v-for="n in 14" :key="`w${n}`"></span>
        </div>

        <div class="black-keys">
          <span class="black-key key-cs"></span>
          <span class="black-key key-ds"></span>
          <span class="black-key key-fs"></span>
          <span class="black-key key-gs"></span>
          <span class="black-key key-as"></span>
          <span class="black-key key-cs-2"></span>
          <span class="black-key key-ds-2"></span>
          <span class="black-key key-fs-2"></span>
          <span class="black-key key-gs-2"></span>
          <span class="black-key key-as-2"></span>
        </div>
      </div>
    </div>

    <h2>Davide Piano</h2>
    <p>Brani per pianoforte.</p>

    <section v-if="latestPiece" class="latest-piece">
      <h3>Ultimo brano caricato</h3>

      <div class="latest-row">
        <div v-if="latestPiece.composerImage" class="composer-portrait">
          <img :src="latestPiece.composerImage" :alt="latestPiece.composerName" />
        </div>

        <div class="latest-info">
          <h4 class="composer-name">
            {{ latestPiece.composerName }}
          </h4>

          <div class="piece-row">
            <p class="piece-title">
              {{ latestPiece.title }}
              <span v-if="latestPiece.subtitle"> — {{ latestPiece.subtitle }} </span>
            </p>

            <audio controls class="mini-audio" :src="latestPiece.mp3">
              Il tuo browser non supporta l'audio.
            </audio>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<style scoped>
.home-animation {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 22px;
  text-align: center;
}

.pianist {
  position: relative;
  width: 320px;
  height: 190px;
}

.notes {
  position: absolute;
  top: 15px;
  left: 55px;
  width: 210px;
  display: flex;
  justify-content: space-around;
}

.notes span {
  font-size: 2rem;
  color: #495057;
  animation: floatNote 2.5s ease-in-out infinite;
}

.notes span:nth-child(2) {
  animation-delay: 0.4s;
}

.notes span:nth-child(3) {
  animation-delay: 0.8s;
}

.piano {
  position: absolute;
  top: 95px;
  left: 35px;
  width: 250px;
  height: 70px;
  background: #111;
  border-radius: 10px;
  padding: 12px;
}

.keys {
  position: relative;
  display: flex;
  height: 100%;
  background: #111;
}

.keys span {
  flex: 1;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0 0 4px 4px;
  animation: key-press 1s infinite;
}

.keys span:nth-child(2n) {
  animation-delay: 0.15s;
}

.keys span:nth-child(3n) {
  animation-delay: 0.3s;
}

.black-keys {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 226px;
  height: 38px;
  pointer-events: none;
}

.black-key {
  position: absolute;
  width: 10px;
  height: 36px;
  background: #050505;
  border-radius: 0 0 3px 3px;
}

.key-cs {
  left: 11px;
}
.key-ds {
  left: 27px;
}
.key-fs {
  left: 59px;
}
.key-gs {
  left: 75px;
}
.key-as {
  left: 91px;
}
.key-cs-2 {
  left: 124px;
}
.key-ds-2 {
  left: 140px;
}
.key-fs-2 {
  left: 172px;
}
.key-gs-2 {
  left: 188px;
}
.key-as-2 {
  left: 204px;
}

.home-animation h2 {
  margin: 0;
  font-size: 2.2rem;
}

.home-animation p {
  margin: 0;
  color: #6c757d;
}

.latest-piece {
  width: min(90%, 760px);
  margin-top: 24px;
  padding: 18px 22px;
  border-top: 2px solid #dee2e6;
  text-align: left;
}

.latest-piece h3 {
  margin: 0 0 18px;
  font-size: 1.45rem;
  font-weight: 600;
  color: #333;
}

.latest-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.composer-portrait {
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #adb5bd;
}

.composer-portrait img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

.latest-info {
  flex: 1;
}

.composer-name {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #212529;
}

.piece-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
}

.piece-title {
  margin: 3px 0 0;
  font-size: 1rem;
  color: #6c757d;
}

.mini-audio {
  width: 170px;
  height: 32px;
  accent-color: #198754;
}

@keyframes floatNote {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.5;
  }

  50% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

@keyframes key-press {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(4px);
  }
}

@media (max-width: 600px) {
  .latest-row {
    align-items: flex-start;
  }

  .composer-portrait {
    width: 44px;
    height: 44px;
    flex-basis: 44px;
  }

  .piece-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .mini-audio {
    width: 100%;
  }
}
</style>
