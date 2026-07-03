<template>
  <section class="info-page">
    <h6>Il mio percorso</h6>
    <h2>Info</h2>

    <section class="info-section">
      <h3>Davide Piano</h3>

      <p>
        Davide Piano è il mio progetto personale dedicato allo studio del pianoforte. Ho voluto
        raccogliere in un unico luogo il repertorio che affronto nel tempo, le mie registrazioni, i
        file MIDI e alcune brevi descrizioni dei brani, con l'obiettivo di documentare il mio
        percorso musicale e condividerlo con chi desidera seguirne l'evoluzione.
      </p>
    </section>

    <section class="info-section">
      <h3>Le registrazioni</h3>

      <p>
        Tutte le registrazioni audio presenti sul sito sono eseguite personalmente al pianoforte
        digitale <strong>Kawai MP11 SE</strong>, utilizzando esclusivamente il timbro di pianoforte
        interno dello strumento, senza l'impiego di virtual instrument o librerie sonore esterne.
      </p>
    </section>

    <section class="info-section">
      <h3>I file MIDI</h3>

      <p>
        Quando disponibili, ai brani sono associati anche i relativi file MIDI. Essi rappresentano
        la mia esecuzione e permettono di seguire lo studio del brano, rallentarne la riproduzione o
        analizzarne l'interpretazione.
      </p>
    </section>

    <section class="info-section">
      <h3>Il repertorio</h3>

      <p>
        Il sito è organizzato per compositori e raccolte. Ogni nuovo brano studiato viene aggiunto
        progressivamente insieme alla registrazione, creando nel tempo una biblioteca musicale
        personale in costante evoluzione.
      </p>
    </section>
  </section>
</template>

<style scoped>
.info-page {
  max-width: 760px;
  margin: 0 auto;
  padding-top: 28px;
}

.info-section {
  margin-top: 42px;
}

.info-section:first-of-type {
  margin-top: 26px;
}

.info-section h3 {
  margin-bottom: 12px;
  font-size: 1.25rem;
  font-weight: 700;
  color: #222;
}

.info-section p {
  margin: 0;
  color: #555;
  line-height: 1.75;
}

@media (max-width: 768px) {
  .info-page {
    padding-left: 18px;
    padding-right: 18px;
  }
}
</style>
