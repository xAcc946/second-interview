import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginPage.vue'),
  },
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
        path: 'signup/:id',
        name: 'Signup',
        component: () => import('../views/SignupPage.vue'),
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

// 登录守卫：未登录一律先去登录页，登录后回到原目标页
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.name !== 'Login' && !auth.isAuthed) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }
  if (to.name === 'Login' && auth.isAuthed) {
    return { path: '/' }
  }
})

export default router
