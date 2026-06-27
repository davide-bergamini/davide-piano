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

    <h2>MIDI Piano</h2>
    <p>Brani classici per pianoforte con player MIDI.</p>
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
  gap: 0;
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
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.55);
}

/* prima ottava */
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

/* seconda ottava */
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

.home-animation h2 {
  margin: 0;
  font-size: 2.2rem;
}

.home-animation p {
  color: #6c757d;
}
</style>
