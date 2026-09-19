<template>
  <div class="layout">
    <header class="header">
      <div class="header-inner">
        <router-link to="/" class="logo">校园活动平台</router-link>
        <nav class="nav">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/publish" class="nav-link">发布</router-link>
          <router-link to="/about" class="nav-link">关于</router-link>
        </nav>
      </div>
    </header>
    <main class="main-content">
      <router-view />
    </main>
    <footer class="footer">
      <p>珠海科技学院计算机协会 · 2026秋季纳新考核</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
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
</style>
