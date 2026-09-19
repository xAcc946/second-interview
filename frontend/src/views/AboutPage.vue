<template>
  <div class="about-page">
    <h1>关于本平台</h1>
    <div class="card">
      <h2>校园活动与机会平台</h2>
      <p>
        本平台面向珠海科技学院在校学生，帮助同学们更高效地发现、理解和参与各类校园活动与机会。
        涵盖比赛通知、讲座分享、团队招募、学习小组、志愿服务、学生自发活动等多种信息来源。
      </p>
      <h3>核心功能</h3>
      <ul>
        <li>活动信息聚合与分类浏览</li>
        <li>关键词搜索与筛选</li>
        <li>学生自主发布活动/招募信息</li>
        <li>信息来源标识与风险提示</li>
      </ul>
      <h3>技术栈</h3>
      <p>前端：Vue 3 + Vite + Vue Router + Pinia</p>
      <p>后端：FastAPI (Python)</p>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.about-page {
  max-width: 680px;
  margin: 0 auto;
}

.about-page h1 {
  font-size: 1.5rem;
  color: #1e293b;
  margin-bottom: 20px;
}

.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 28px;
}

.card h2 {
  font-size: 1.2rem;
  color: #1e293b;
  margin-bottom: 12px;
}

.card h3 {
  font-size: 1rem;
  color: #374151;
  margin-top: 20px;
  margin-bottom: 8px;
}

.card p {
  color: #4b5563;
  line-height: 1.7;
}

.card ul {
  padding-left: 20px;
  color: #4b5563;
  line-height: 1.8;
}
</style>
