<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
    default: '',
  },
  files: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: 'Nessun file collegato',
  },
})

const emit = defineEmits(['update:modelValue'])

function updateValue(event) {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <label class="file-select">
    <span class="file-select-label">{{ label }}</span>

    <select :value="modelValue" class="file-select-control" @change="updateValue">
      <option value="">
        {{ placeholder }}
      </option>

      <option v-for="file in files" :key="file.publicPath" :value="file.publicPath">
        {{ file.name }}
      </option>
    </select>
  </label>
</template>

<style scoped>
.file-select {
  display: grid;
  gap: 0.35rem;
}

.file-select-label {
  font-size: 0.8rem;
  color: #666;
}

.file-select-control {
  width: 100%;
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  padding: 0.55rem 0.65rem;
  background: #fff;
  font-size: 0.95rem;
}
</style>
