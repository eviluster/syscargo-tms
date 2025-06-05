import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Services from '../views/Services.vue'
import ServiceDetail from '../views/ServiceDetail.vue'
import Contactenos from '@/components/Contactenos.vue'
import Planes from '@/views/Planes.vue'
import Rastrear from '@/components/Rastrear.vue'
import Reservar from '@/views/Reservar.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/services',
      name: 'services',
      component: Services,
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contactenos,
    },
    {
      path: '/plans',
      name: 'plans',
      component: Planes,
    },
    {
      path: '/services/:serviceId',
      name: 'ServiceDetail',
      component: ServiceDetail,
    },
    {
      path: '/rastrear',
      name: 'Rastrear',
      component: Rastrear,
    },
    {
      path: '/reservar',
      name: 'Reservar',
      component: Reservar,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
