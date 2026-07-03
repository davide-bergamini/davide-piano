<script setup>
import { ref } from 'vue'

const emit = defineEmits(['login'])

const username = ref('')
const password = ref('')
const error = ref('')

const ADMIN_USERNAME = 'davide'

const ADMIN_PASSWORD_HASH = '1dc2c5ffa3fd93ca977343e71fe7d93401f4e4951d5584cbc0c57a4517e435eb'

async function sha256(text) {
  const data = new TextEncoder().encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))

  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function login() {
  error.value = ''

  const passwordHash = await sha256(password.value)

  if (username.value === ADMIN_USERNAME && passwordHash === ADMIN_PASSWORD_HASH) {
    emit('login')
    return
  }

  error.value = 'Username o password non validi.'
}
</script>

<template>
  <main class="admin-page">
    <h2>Admin</h2>

    <div class="admin-section">
      <label>
        Username
        <input v-model="username" type="text" autocomplete="username" />
      </label>

      <label>
        Password
        <input
          v-model="password"
          type="password"
          autocomplete="current-password"
          @keyup.enter="login"
        />
      </label>

      <button type="button" @click="login">Accedi</button>

      <p v-if="error" class="admin-error">
        {{ error }}
      </p>
    </div>
  </main>
</template>
