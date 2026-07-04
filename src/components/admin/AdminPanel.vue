<script setup>
import { ref } from 'vue'

import AdminDashboard from './AdminDashboard.vue'
import AdminUpload from './AdminUpload.vue'
import AdminGithub from './AdminGithub.vue'
import AdminDiscogs from './AdminDiscogs.vue'
import RepertoireManager from '../RepertoireManager.vue'

const emit = defineEmits(['logout'])

const activeSection = ref('dashboard')

const menuItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'repertoire', label: 'Repertorio' },
  { id: 'upload', label: 'Upload' },
  { id: 'github', label: 'GitHub' },
  { id: 'discogs', label: 'Discoteca' },
]
</script>

<template>
  <main class="admin-layout">
    <aside class="sidebar">
      <div>
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
      </div>

      <button class="admin-logout" type="button" @click="emit('logout')">
        Esci
      </button>
    </aside>

    <section class="admin-content">
      <AdminDashboard v-if="activeSection === 'dashboard'" />
      <RepertoireManager v-if="activeSection === 'repertoire'" />
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
  background: #fafafa;
  border-right: 1px solid #e0e0e0;
  padding: 26px 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.sidebar h6 {
  margin: 0 0 20px;
  color: #777;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sidebar-nav button {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 34px;
  padding: 6px 10px;
  border: 0;
  border-left: 2px solid transparent;
  background: transparent;
  color: #333;
  font: inherit;
  font-size: 0.95rem;
  line-height: 1.2;
  text-align: left;
  cursor: pointer;
}

.sidebar-nav button:hover {
  background: #f1f1f1;
}

.sidebar-nav button.active {
  border-left-color: #111;
  background: #efefef;
  color: #111;
  font-weight: 600;
}

.sidebar-arrow {
  width: 14px;
  color: #999;
  font-size: 0.82rem;
  flex-shrink: 0;
}

.sidebar-nav button.active .sidebar-arrow {
  color: #111;
}

.admin-logout {
  width: 100%;
  margin-top: 28px;
  padding: 8px 10px;
  border: 1px solid #222;
  background: transparent;
  color: #222;
  font: inherit;
  font-size: 0.92rem;
  cursor: pointer;
}

.admin-logout:hover {
  background: #222;
  color: #fff;
}

.admin-content {
  flex: 1;
  min-width: 0;
  background: #fff;
  padding: 36px 44px 120px;
}

@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
    width: 100%;
    margin-left: 0;
  }

  .sidebar {
    width: 100%;
    border-right: 0;
    border-bottom: 1px solid #e0e0e0;
  }

  .admin-content {
    padding: 28px 20px 90px;
  }
}

:global(.admin-page) {
  margin-top: 0;
  padding-top: 0;
}
</style>
