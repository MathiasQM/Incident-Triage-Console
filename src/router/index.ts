import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/IncidentList.vue'),
    },
    {
      path: '/incidents/:id',
      name: 'incident-detail',
      component: () => import('../views/IncidentDetail.vue'),
    },
  ],
})

export default router
