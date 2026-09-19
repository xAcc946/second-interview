<template>
  <div class="layout">
    <header class="header">
      <div class="header-inner">
        <router-link to="/" class="logo">校园活动平台</router-link>
        <nav class="nav">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/about" class="nav-link">关于</router-link>
        </nav>
        <div class="user-box">
          <span class="user-tag">学号 {{ auth.studentId }}</span>
          <button class="logout-btn" @click="onLogout">退出</button>
        </div>
      </div>
    </header>
    <main class="main-content">
      <router-view />
    </main>
    <footer class="footer">
      <p>珠海科技学院计算机协会 · 2026秋季纳新考核</p>
    </footer>

    <!-- 圆形悬浮发布按钮 -->
    <router-link v-if="route.path !== '/publish'" to="/publish" class="fab" title="发布活动">
      <span class="fab-icon">＋</span>
      <span class="fab-text">发布</span>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

function onLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2563eb;
  text-decoration: none;
}

.nav {
  display: flex;
  gap: 24px;
}

.user-box {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-tag {
  font-size: 0.82rem;
  color: #2563eb;
  background: #eff6ff;
  padding: 4px 10px;
  border-radius: 999px;
}

.logout-btn {
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #6b7280;
  font-size: 0.82rem;
  padding: 4px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  color: #dc2626;
  border-color: #fecaca;
}

.nav-link {
  color: #4b5563;
  text-decoration: none;
  font-size: 0.95rem;
  padding: 4px 0;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #2563eb;
  border-bottom-color: #2563eb;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px;
  width: 100%;
  box-sizing: border-box;
}

.footer {
  text-align: center;
  padding: 20px;
  color: #9ca3af;
  font-size: 0.85rem;
  border-top: 1px solid #e5e7eb;
}

.fab {
  position: fixed;
  right: 28px;
  bottom: 28px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #2563eb;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  text-decoration: none;
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
  transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
  z-index: 200;
}

.fab:hover {
  background: #1d4ed8;
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 10px 26px rgba(37, 99, 235, 0.5);
}

.fab:active {
  transform: scale(0.95);
}

.fab-icon {
  font-size: 1.3rem;
  line-height: 1;
}

.fab-text {
  font-size: 0.68rem;
  line-height: 1;
}
</style>
