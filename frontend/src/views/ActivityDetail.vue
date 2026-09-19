<template>
  <div class="activity-detail">
    <router-link to="/" class="back-link">← 返回列表</router-link>
    <div class="detail-content">
      <h1>活动详情</h1>
      <p class="placeholder-text">活动详情将通过 API 加载（路由参数: {{ $route.params.id }}）</p>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.back-link {
  display: inline-block;
  color: #2563eb;
  text-decoration: none;
  margin-bottom: 20px;
  font-size: 0.95rem;
}

.back-link:hover {
  text-decoration: underline;
}

.detail-content {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  border: 1px solid #e5e7eb;
}

.detail-content h1 {
  font-size: 1.5rem;
  color: #1e293b;
  margin-bottom: 16px;
}

.placeholder-text {
  color: #94a3b8;
}
</style>
