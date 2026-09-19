import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/HomePage.vue'),
      },
      {
        path: 'activity/:id',
        name: 'ActivityDetail',
        component: () => import('../views/ActivityDetail.vue'),
      },
      {
        path: 'publish',
        name: 'Publish',
        component: () => import('../views/PublishPage.vue'),
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('../views/AboutPage.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
