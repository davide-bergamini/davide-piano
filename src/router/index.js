import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import MozartView from '../views/MozartView.vue'
import BurgmullerView from '../views/BurgmullerView.vue'
import TchaikovskyView from '../views/TchaikovskyView.vue'
import SchumannView from '../views/SchumannView.vue'
import TimelineView from '../views/TimelineView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/timeline',
      name: 'timeline',
      component: TimelineView,
    },
    {
      path: '/mozart',
      name: 'mozart',
      component: MozartView,
    },
    {
      path: '/burgmuller',
      name: 'burgmuller',
      component: BurgmullerView,
    },
    {
      path: '/tchaikovsky',
      name: 'tchaikovsky',
      component: TchaikovskyView,
    },
    {
      path: '/schumann',
      name: 'schumann',
      component: SchumannView,
    },
  ],
})

export default router
