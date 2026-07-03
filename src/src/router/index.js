import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import MozartView from '../views/MozartView.vue'
import BurgmullerView from '../views/BurgmullerView.vue'
import TchaikovskyView from '../views/TchaikovskyView.vue'
import SchumannView from '../views/SchumannView.vue'
import TimelineView from '../views/TimelineView.vue'
import CdCollectionView from '../views/CdCollectionView.vue'
import CdDetailView from '../views/CdDetailView.vue'
import JazzView from '../views/JazzView.vue'
import ClassicalPiecesView from '../views/ClassicalPiecesView.vue'

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
    {
      path: '/discoteca',
      name: 'discoteca',
      component: CdCollectionView,
    },
    {
      path: '/jazz',
      name: 'jazz',
      component: JazzView,
    },
    {
      path: '/discoteca/:id',
      name: 'cd-detail',
      component: CdDetailView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
    },
    {
      path: '/classica-cms',
      name: 'classical-cms',
      component: ClassicalPiecesView,
    },
    {
      path: '/info',
      name: 'info',
      component: () => import('../views/InfoView.vue'),
    },
  ],
})

export default router
