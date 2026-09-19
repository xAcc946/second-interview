<template>
  <div class="home">
    <div class="hero-section">
      <h1>校园活动与机会平台</h1>
      <p>26 条校园信息已整理 · 按「最该先动手」排序，帮你不错过截止时间</p>
    </div>

    <!-- 统计栏 -->
    <div class="stats-bar" v-if="!store.loading && !store.error">
      <div class="stat">
        <span class="num">{{ store.stats.actionable }}</span>
        <span class="label">可报名参与</span>
      </div>
      <div class="stat hot">
        <span class="num">{{ store.stats.closingSoon.length }}</span>
        <span class="label">24小时内截止</span>
      </div>
      <div class="stat">
        <span class="num">{{ store.stats.merged }}</span>
        <span class="label">条已合并补充通知</span>
      </div>
      <div class="stat">
        <span class="num">{{ store.favorites.length }}</span>
        <span class="label">我的收藏</span>
      </div>
    </div>

    <!-- 即将截止提醒 -->
    <div v-if="store.stats.closingSoon.length" class="urgent-banner">
      <span class="urgent-title">⏰ 即将截止，优先处理：</span>
      <router-link
        v-for="a in store.stats.closingSoon.slice(0, 3)"
        :key="a.id"
        :to="`/activity/${a.id}`"
        class="urgent-link"
      >{{ a.title }}（{{ deadlineCountdown(a.deadline) }}）</router-link>
    </div>

    <!-- 搜索与筛选 -->
    <div class="filter-bar">
      <input
        v-model="store.keyword"
        type="text"
        placeholder="搜索活动、比赛、招募、地点…"
        class="search-input"
      />
      <div class="filter-row">
        <div class="category-tabs">
          <button
            v-for="cat in categoryOptions"
            :key="cat.value"
            :class="['tab-btn', { active: store.activeCategory === cat.value }]"
            @click="store.activeCategory = cat.value"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>
      <div class="filter-row second">
        <div class="source-group">
          <span class="filter-label">来源</span>
          <button
            v-for="s in sourceOptions"
            :key="s.value"
            :class="['chip', { active: store.activeSource === s.value }]"
            @click="store.activeSource = s.value"
          >{{ s.label }}</button>
        </div>
        <div class="toggle-group">
          <label class="switch">
            <input type="checkbox" v-model="store.onlyActionable" />
            <span>仅看可报名</span>
          </label>
          <label class="switch">
            <input type="checkbox" v-model="store.onlyFavorites" />
            <span>⭐ 只看收藏（{{ store.favorites.length }}）</span>
          </label>
          <button v-if="hasFilter" class="reset-btn" @click="store.resetFilters()">清除筛选</button>
        </div>
      </div>
    </div>

    <!-- 列表主体 -->
    <div class="list-area">
      <p v-if="store.loading" class="state-text">加载中…</p>
      <div v-else-if="store.error" class="state-text error">
        {{ store.error }}
        <button class="retry-btn" @click="store.fetchActivities()">重试</button>
      </div>
      <template v-else>
        <p class="result-count">共 {{ store.filtered.length }} 条结果</p>
        <div v-if="store.filtered.length === 0" class="state-text empty">
          <p>😕 没有符合条件的活动</p>
          <button class="retry-btn" @click="store.resetFilters()">清除筛选条件</button>
        </div>
        <div v-else class="card-grid">
          <ActivityCard v-for="a in store.filtered" :key="a.id" :activity="a" />
        </div>
      </template>
    </div>

    <!-- 风险提示折叠区 -->
    <div class="risk-zone" v-if="!store.loading && !store.error && store.riskActivities.length">
      <button class="risk-toggle" @click="riskOpen = !riskOpen">
        <span>⚠ 另有 {{ store.riskActivities.length }} 条信息质量存疑（默认收起，未删除）</span>
        <span class="arrow" :class="{ open: riskOpen }">{{ riskOpen ? '收起 ▲' : '展开 ▼' }}</span>
      </button>
      <Transition name="fold">
        <div v-if="riskOpen" class="risk-body">
          <p class="risk-desc">以下信息存在明显缺失或与校园活动关联较弱，平台仅客观标注原因、不代为删除，请自行判断：</p>
          <div v-for="a in store.riskActivities" :key="a.id" class="risk-item">
            <div class="risk-head">
              <router-link :to="`/activity/${a.id}`" class="risk-title">{{ a.title }}</router-link>
              <span class="badge tone-red">需注意</span>
            </div>
            <p class="risk-reason">{{ a.risk_reason }}</p>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useActivityStore } from '../stores/activity'
import ActivityCard from '../components/ActivityCard.vue'
import { deadlineCountdown } from '../utils/time'

const store = useActivityStore()
const riskOpen = ref(false)

onMounted(() => {
  if (!store.activities.length) store.fetchActivities()
})

const categoryOptions = computed(() => {
  const used = new Set(store.normalActivities.map((a) => a.category))
  const base = [{ label: '全部', value: 'all' }]
  const labels: Record<string, string> = store.categoryLabels
  return base.concat([...used].map((c) => ({ label: labels[c] || c, value: c })))
})

const sourceOptions = [
  { label: '全部', value: 'all' },
  { label: '校级', value: 'school' },
  { label: '院级', value: 'college' },
  { label: '学生自发', value: 'student' },
]

const hasFilter = computed(
  () =>
    store.keyword !== '' ||
    store.activeCategory !== 'all' ||
    store.activeSource !== 'all' ||
    store.onlyActionable ||
    store.onlyFavorites
)
</script>

<style scoped>
.hero-section {
  text-align: center;
  padding: 28px 0 20px;
}

.hero-section h1 {
  font-size: 1.9rem;
  color: #1e293b;
  margin-bottom: 6px;
}

.hero-section p {
  color: #64748b;
  font-size: 1rem;
}

/* 统计栏 */
.stats-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.stat {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px;
  text-align: center;
}

.stat .num {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2563eb;
}

.stat.hot .num { color: #dc2626; }

.stat .label {
  font-size: 0.82rem;
  color: #64748b;
}

/* 紧急提醒 */
.urgent-banner {
  background: linear-gradient(90deg, #fef2f2, #fff7ed);
  border: 1px solid #fecaca;
  border-radius: 10px;
  padding: 10px 16px;
  margin-bottom: 18px;
  font-size: 0.88rem;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.urgent-title { color: #b91c1c; font-weight: 600; }

.urgent-link {
  color: #1d4ed8;
  text-decoration: none;
  background: #fff;
  border: 1px solid #bfdbfe;
  padding: 2px 10px;
  border-radius: 999px;
}

.urgent-link:hover { background: #eff6ff; }

/* 筛选 */
.filter-bar { margin-bottom: 20px; }

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
  background: #fff;
}

.search-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.filter-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-row.second {
  margin-top: 12px;
}

.category-tabs {
  display: flex;
  gap: 8px;
  margin-top: 14px;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 6px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  background: #fff;
  color: #475569;
  cursor: pointer;
  font-size: 0.88rem;
  transition: all 0.2s;
}

.tab-btn:hover { border-color: #2563eb; color: #2563eb; }

.tab-btn.active {
  background: #2563eb;
  color: #fff;
  border-color: #2563eb;
}

.source-group,
.toggle-group {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-label {
  font-size: 0.85rem;
  color: #64748b;
}

.chip {
  padding: 4px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  background: #fff;
  font-size: 0.84rem;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.chip:hover { border-color: #6d28d9; color: #6d28d9; }
.chip.active { background: #6d28d9; border-color: #6d28d9; color: #fff; }

.switch {
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 0.86rem;
  color: #374151;
  cursor: pointer;
  user-select: none;
}

.switch input { accent-color: #2563eb; }

.reset-btn {
  padding: 4px 12px;
  border: none;
  background: none;
  color: #dc2626;
  font-size: 0.84rem;
  cursor: pointer;
  text-decoration: underline;
}

.result-count {
  color: #94a3b8;
  font-size: 0.85rem;
  margin-bottom: 12px;
}

/* 卡片网格 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px;
}

.state-text {
  text-align: center;
  color: #94a3b8;
  padding: 50px 0;
}

.state-text.error { color: #dc2626; }

.state-text.empty p { margin-bottom: 12px; font-size: 1.05rem; }

.retry-btn {
  padding: 6px 18px;
  border: 1px solid #2563eb;
  border-radius: 8px;
  background: #fff;
  color: #2563eb;
  cursor: pointer;
  margin-left: 10px;
}

.retry-btn:hover { background: #eff6ff; }

/* 风险区 */
.risk-zone {
  margin-top: 32px;
  border: 1px solid #fde68a;
  border-radius: 12px;
  background: #fffbeb;
  overflow: hidden;
}

.risk-toggle {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background: none;
  border: none;
  font-size: 0.92rem;
  color: #92400e;
  cursor: pointer;
}

.risk-toggle .arrow { font-size: 0.82rem; color: #b45309; }

.risk-body { padding: 0 18px 16px; }

.risk-desc {
  font-size: 0.84rem;
  color: #a16207;
  margin-bottom: 12px;
}

.risk-item {
  background: #fff;
  border: 1px solid #fde68a;
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 10px;
}

.risk-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.risk-title {
  font-weight: 600;
  color: #44403c;
  font-size: 0.95rem;
}

.badge {
  font-size: 0.75rem;
  padding: 3px 10px;
  border-radius: 999px;
}

.tone-red { background: #fee2e2; color: #b91c1c; }

.risk-reason {
  font-size: 0.84rem;
  color: #78716c;
  line-height: 1.6;
}

.fold-enter-active,
.fold-leave-active {
  transition: all 0.25s ease;
  max-height: 400px;
  overflow: hidden;
}

.fold-enter-from,
.fold-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}

@media (max-width: 720px) {
  .stats-bar { grid-template-columns: repeat(2, 1fr); }
  .card-grid { grid-template-columns: 1fr; }
}
</style>
