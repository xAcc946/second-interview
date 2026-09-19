<template>
  <div class="home">
    <div class="hero-section">
      <h1>校园活动与机会平台</h1>
      <p>发现、理解、参与适合你的校园活动与机会</p>
    </div>

    <div class="filter-bar">
      <input
        v-model="searchKeyword"
        type="text"
        placeholder="搜索活动、比赛、招募..."
        class="search-input"
      />
      <div class="category-tabs">
        <button
          v-for="cat in categories"
          :key="cat.value"
          :class="['tab-btn', { active: activeCategory === cat.value }]"
          @click="activeCategory = cat.value"
        >
          {{ cat.label }}
        </button>
      </div>
    </div>

    <div class="activity-list">
      <p class="placeholder-text">活动列表将通过 API 加载</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const searchKeyword = ref('')
const activeCategory = ref('all')

const categories = [
  { label: '全部', value: 'all' },
  { label: '比赛', value: 'competition' },
  { label: '讲座', value: 'lecture' },
  { label: '招募', value: 'recruit' },
  { label: '学习小组', value: 'study_group' },
  { label: '志愿', value: 'volunteer' },
  { label: '工作坊', value: 'workshop' },
  { label: '资源', value: 'resource' },
  { label: '学生发布', value: 'student' },
]
</script>

<style scoped>
.hero-section {
  text-align: center;
  padding: 40px 0 30px;
}

.hero-section h1 {
  font-size: 2rem;
  color: #1e293b;
  margin-bottom: 8px;
}

.hero-section p {
  color: #64748b;
  font-size: 1.05rem;
}

.filter-bar {
  margin-bottom: 24px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: #2563eb;
}

.category-tabs {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 6px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  background: #fff;
  color: #475569;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.tab-btn:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.tab-btn.active {
  background: #2563eb;
  color: #fff;
  border-color: #2563eb;
}

.activity-list {
  min-height: 200px;
}

.placeholder-text {
  text-align: center;
  color: #94a3b8;
  padding: 60px 0;
}
</style>
