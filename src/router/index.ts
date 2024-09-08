import { createRouter, createWebHistory } from 'vue-router'
import { constantRoute } from './routers'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoute
})

export default router
