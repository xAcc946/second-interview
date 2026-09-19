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
        <li>26 条校园信息聚合，按「最该先动手」的紧急度排序</li>
        <li>状态自动计算：报名中 / 即将截止 / 已截止可候补 / 长期开放</li>
        <li>分类、来源筛选与关键词搜索</li>
        <li>收藏与「我要参加」，本地保存刷新不丢</li>
        <li>学生自主发布，发布后直接进入列表可被筛选</li>
        <li>同一活动的补充通知自动合并，展示变更时间线</li>
        <li>存疑信息默认折叠提示，只标注、不删除</li>
      </ul>
      <h3>技术栈</h3>
      <p>前端：Vue 3 + Vite + Vue Router + Pinia（数据内置，可脱离后端独立运行）</p>
      <p>后端：FastAPI (Python)，作为可选全栈演示</p>
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
