import { createRouter, createWebHashHistory } from 'vue-router'
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
  // 使用 hash 模式，适配 GitHub Pages 静态托管（刷新/直达深链不会 404）
  history: createWebHashHistory(),
  routes,
})

export default router
