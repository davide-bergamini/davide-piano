<script setup>
import { ref } from 'vue'

import AdminDashboard from './AdminDashboard.vue'
import AdminPieces from '../../views/AdminPiecesView.vue'
import AdminUpload from './AdminUpload.vue'
import AdminGithub from './AdminGithub.vue'
import AdminDiscogs from './AdminDiscogs.vue'

const emit = defineEmits(['logout'])

const activeSection = ref('dashboard')

const menuItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'pieces', label: 'Brani' },
  { id: 'upload', label: 'Upload' },
  { id: 'github', label: 'GitHub' },
  { id: 'discogs', label: 'Discoteca' },
]
</script>

<template>
  <main class="admin-layout">
    <aside class="sidebar">
      <h6>CMS</h6>

      <nav class="sidebar-nav">
        <button
          v-for="item in menuItems"
          :key="item.id"
          type="button"
          :class="{ active: activeSection === item.id }"
          @click="activeSection = item.id"
        >
          <span class="sidebar-arrow">▸</span>
          <span>{{ item.label }}</span>
        </button>
      </nav>

      <button class="admin-logout" type="button" @click="emit('logout')">Esci</button>
    </aside>

    <section class="admin-content">
      <AdminDashboard v-if="activeSection === 'dashboard'" />
      <AdminPieces v-if="activeSection === 'pieces'" />
      <AdminUpload v-if="activeSection === 'upload'" />
      <AdminGithub v-if="activeSection === 'github'" />
      <AdminDiscogs v-if="activeSection === 'discogs'" />
    </section>
  </main>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: calc(100vh - 52px);
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-top: 0;
  padding-top: 0;
  background: #fff;
  color: #222;
}

.sidebar {
  width: 240px;
  flex-shrink: 0;
  background: #f7f7f7;
  border-right: 1px solid #ddd;
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
}

.sidebar h6 {
  color: #666;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 18px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar-nav button {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
  background: transparent;
  border: 0;
  text-align: left;
  text-decoration: none;
  padding: 5px 12px;
  line-height: 1.2;
  border-radius: 6px;
  font: inherit;
  cursor: pointer;
}

.sidebar-nav button:hover {
  background: #efefef;
}

.sidebar-nav button.active {
  background: #e7e7e7;
  font-weight: 600;
}

.sidebar-arrow {
  width: 14px;
  color: #777;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.sidebar-nav button.active .sidebar-arrow {
  color: #0d6efd;
}

.admin-logout {
  margin-top: auto;
  padding: 8px 14px;
  border: 0;
  background: #222;
  color: #fff;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.admin-logout:hover {
  background: #000;
}

.admin-content {
  flex: 1;
  background: #fff;
  padding: 34px 42px 120px;
  min-width: 0;
}

@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
  }

  .admin-logout {
    margin-top: 18px;
  }
}

:global(.admin-page) {
  margin-top: 0;
  padding-top: 0;
}
</style>
