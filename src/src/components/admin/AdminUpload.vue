<script setup>
import FileUpload from './FileUpload.vue'
</script>

<template>
  <section class="admin-page">
    <h2>Upload</h2>

    <FileUpload title="Upload MIDI" accept=".mid,.midi" folder="midi" />
    <FileUpload title="Upload MP3" accept=".mp3" folder="mp3" />
  </section>
</template>

<style scoped>
.admin-page {
  max-width: 760px;
}

h2 {
  margin: 0 0 24px;
  font-size: 2rem;
  font-weight: 700;
}
</style>
