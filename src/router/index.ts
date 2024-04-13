import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'message-list',
      component: () => import('../views/MessageList.vue')
    },
    {
      path: '/message-details',
      name: 'message-details',
      component: () => import('../views/MessageDetails.vue')
    }
  ]
})

export default router
