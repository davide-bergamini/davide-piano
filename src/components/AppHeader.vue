
<template>
  <header class="site-header">
    <RouterLink to="/" class="site-title"> Davide Piano </RouterLink>

    <nav class="top-nav">
      <RouterLink to="/mozart"> Musica classica </RouterLink>

      <span class="nav-spacer"></span>

      <RouterLink to="/timeline" class="timeline-pill">
        Timeline
      </RouterLink>

      <RouterLink to="/admin" class="admin-pill"> Admin </RouterLink>
    </nav>
  </header>
</template>
