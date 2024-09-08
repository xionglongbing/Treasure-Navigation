import HomeView from '@/views/home/index.vue'
import NotFound from '@/views/NotFound/index.vue'
export const constantRoute = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AboutView.vue')
  }
]
