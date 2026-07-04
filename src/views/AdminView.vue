<script setup>
import { ref } from 'vue'

import AdminLogin from '../components/admin/AdminLogin.vue'
import AdminPanel from '../components/admin/AdminPanel.vue'

const logged = ref(sessionStorage.getItem('adminLogged') === 'true')

function handleLogin() {
  sessionStorage.setItem('adminLogged', 'true')
  logged.value = true
}

function handleLogout() {
  sessionStorage.removeItem('adminLogged')
  logged.value = false
}
</script>

<template>
  <AdminLogin v-if="!logged" @login="handleLogin" />

  <AdminPanel v-else @logout="handleLogout" />
</template>
