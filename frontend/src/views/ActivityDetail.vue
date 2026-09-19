<template>
  <div class="detail-page" v-if="activity">
    <router-link to="/" class="back-link">← 返回活动列表</router-link>

    <div class="detail-main">
      <div class="badges">
        <span class="badge" :class="`tone-${status.tone}`">{{ status.label }}</span>
        <span class="badge badge-source">{{ sourceLabel }}</span>
        <span class="badge badge-cat">{{ catLabel }}</span>
        <span v-if="activity.risk_flag" class="badge tone-red">信息需注意</span>
        <span v-if="activity.is_user_post" class="badge badge-mine">我发布的</span>
      </div>

      <h1>{{ activity.title }}</h1>
      <p class="summary">{{ activity.summary }}</p>

      <p v-if="activity.status_note" class="note">⚠ {{ activity.status_note }}</p>

      <p v-if="activity.risk_flag" class="risk-box">
        <strong>为什么这条信息被标注：</strong>{{ activity.risk_reason }}
        <br /><span class="risk-tip">平台只提示、不删除，是否参与请自行判断。注意保护个人信息与财产安全。</span>
      </p>

      <!-- 信息字段区 -->
      <div class="fields">
        <div class="field">
          <span class="f-label">🕐 活动时间</span>
          <span class="f-value">{{ activity.time_text || '未提供' }}</span>
        </div>
        <div class="field">
          <span class="f-label">⏳ 报名截止</span>
          <span class="f-value">
            {{ activity.deadline_text || '未注明' }}
            <em v-if="countdown" :class="['cd', { hot: status.key === 'closing' }]">{{ countdown }}</em>
          </span>
        </div>
        <div class="field">
          <span class="f-label">📍 地点</span>
          <span class="f-value">
            <template v-if="activity.location">{{ activity.location }}</template>
            <span v-else class="missing">{{ activity.is_user_post ? '发布时未填写' : '题目未提供' }}</span>
          </span>
        </div>
        <div class="field" v-if="activity.audience">
          <span class="f-label">👥 适用对象</span>
          <span class="f-value">{{ activity.audience }}</span>
        </div>
        <div class="field" v-if="activity.threshold">
          <span class="f-label">🎯 参与条件</span>
          <span class="f-value">{{ activity.threshold }}</span>
        </div>
        <div class="field" v-if="activity.contact">
          <span class="f-label">📮 联系方式</span>
          <span class="f-value">{{ activity.contact }}</span>
        </div>
      </div>

      <!-- 缺失信息标注 -->
      <div v-if="activity.missing_fields?.length" class="missing-zone">
        <h3>ℹ 以下关键信息未提供（不做编造，请向主办方确认）</h3>
        <ul>
          <li v-for="m in activity.missing_fields" :key="m">{{ m }}</li>
        </ul>
      </div>

      <!-- 变更时间线（合并的补充通知） -->
      <div v-if="activity.timeline?.length > 1" class="timeline">
        <h3>🔄 信息变更时间线</h3>
        <div v-for="(t, i) in activity.timeline" :key="i" class="tl-item" :class="{ update: t.is_update }">
          <div class="tl-dot"></div>
          <div class="tl-body">
            <span class="tl-time">{{ t.time }}</span>
            <p class="tl-text">{{ t.text }}</p>
            <ul v-if="t.changes" class="tl-changes">
              <li v-for="c in t.changes" :key="c">{{ c }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 操作区 -->
      <div class="actions">
        <button class="act-btn" :class="{ starred: isFav }" @click="onFavorite">
          {{ isFav ? '★ 已收藏' : '☆ 收藏' }}
        </button>
        <button
          v-if="joinable"
          class="act-btn join"
          :class="{ done: isJoined }"
          @click="onJoin"
        >
          {{ isJoined ? '✓ 已标记参加（点击取消）' : '我要参加' }}
        </button>
      </div>
    </div>
  </div>

  <div v-else class="detail-page">
    <router-link to="/" class="back-link">← 返回活动列表</router-link>
    <p class="loading-text">{{ store.loading ? '加载中…' : '未找到该活动，可能已被合并或不存在。' }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useActivityStore } from '../stores/activity'
import { useToastStore } from '../stores/toast'
import { displayStatus, deadlineCountdown, SOURCE_LABELS } from '../utils/time'

const route = useRoute()
const store = useActivityStore()
const toast = useToastStore()

onMounted(async () => {
  if (!store.activities.length) await store.fetchActivities()
})

const activity = computed(() => store.getById(Number(route.params.id)))

const status = computed(() => (activity.value ? displayStatus(activity.value) : { key: '', label: '', tone: 'gray' }))
const countdown = computed(() => (activity.value ? deadlineCountdown(activity.value.deadline) : null))
const catLabel = computed(() =>
  activity.value ? store.categoryLabels[activity.value.category] || activity.value.category : ''
)
const sourceLabel = computed(() =>
  activity.value
    ? (SOURCE_LABELS[activity.value.source] || '来源未注明') +
      (activity.value.source_name ? `（${activity.value.source_name}）` : '')
    : ''
)
const isFav = computed(() => activity.value && store.favorites.includes(activity.value.id))
const isJoined = computed(() => activity.value && store.joined.includes(activity.value.id))
const joinable = computed(() =>
  ['open', 'soon', 'closing', 'longterm', 'waitlist'].includes(status.value.key)
)

function onFavorite() {
  const added = store.toggleFavorite(activity.value!.id)
  toast.show(added ? '已加入收藏' : '已取消收藏', added ? 'success' : 'info')
}

function onJoin() {
  const added = store.toggleJoin(activity.value!.id)
  toast.show(added ? '已标记「我要参加」' : '已取消报名标记', added ? 'success' : 'info')
}
</script>

<style scoped>
.detail-page {
  max-width: 760px;
  margin: 0 auto;
}

.back-link {
  display: inline-block;
  color: #2563eb;
  text-decoration: none;
  margin-bottom: 16px;
  font-size: 0.92rem;
}

.back-link:hover { text-decoration: underline; }

.detail-main {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 32px;
}

.badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.badge {
  font-size: 0.76rem;
  padding: 3px 10px;
  border-radius: 999px;
  font-weight: 500;
}

.tone-green { background: #dcfce7; color: #15803d; }
.tone-red { background: #fee2e2; color: #b91c1c; }
.tone-orange { background: #ffedd5; color: #c2410c; }
.tone-gray { background: #f1f5f9; color: #64748b; }
.tone-blue { background: #dbeafe; color: #1d4ed8; }
.badge-source { background: #f5f3ff; color: #6d28d9; }
.badge-cat { background: #f1f5f9; color: #475569; }
.badge-mine { background: #dcfce7; color: #15803d; }

h1 {
  font-size: 1.45rem;
  color: #1e293b;
  margin-bottom: 10px;
  line-height: 1.4;
}

.summary {
  color: #475569;
  line-height: 1.7;
  margin-bottom: 16px;
}

.note {
  font-size: 0.88rem;
  color: #b45309;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 10px;
  padding: 10px 14px;
  margin-bottom: 16px;
}

.risk-box {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 0.88rem;
  color: #7f1d1d;
  line-height: 1.7;
  margin-bottom: 16px;
}

.risk-tip { color: #991b1b; font-size: 0.82rem; }

.fields {
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 18px;
}

.field {
  display: flex;
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.92rem;
}

.field:last-child { border-bottom: none; }

.f-label {
  width: 110px;
  flex-shrink: 0;
  color: #64748b;
}

.f-value {
  color: #1e293b;
  line-height: 1.6;
}

.cd {
  font-style: normal;
  margin-left: 8px;
  color: #2563eb;
  font-size: 0.82rem;
}

.cd.hot { color: #dc2626; font-weight: 600; }

.missing {
  display: inline-block;
  margin-left: 8px;
  font-size: 0.75rem;
  background: #f1f5f9;
  color: #94a3b8;
  padding: 1px 8px;
  border-radius: 999px;
}

.missing-zone {
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 10px;
  padding: 14px 18px;
  margin-bottom: 18px;
}

.missing-zone h3 {
  font-size: 0.9rem;
  color: #475569;
  margin-bottom: 8px;
}

.missing-zone ul {
  padding-left: 20px;
  color: #64748b;
  font-size: 0.88rem;
  line-height: 1.8;
}

/* 时间线 */
.timeline {
  margin-bottom: 22px;
}

.timeline h3 {
  font-size: 1rem;
  color: #1e293b;
  margin-bottom: 14px;
}

.tl-item {
  display: flex;
  gap: 12px;
  position: relative;
  padding-bottom: 18px;
}

.tl-item::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 16px;
  bottom: 0;
  width: 2px;
  background: #e2e8f0;
}

.tl-item:last-child::before { display: none; }

.tl-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #94a3b8;
  margin-top: 4px;
  flex-shrink: 0;
}

.tl-item.update .tl-dot { background: #f59e0b; }

.tl-time {
  font-size: 0.78rem;
  color: #64748b;
  display: block;
  margin-bottom: 2px;
}

.tl-text {
  font-size: 0.9rem;
  color: #334155;
  line-height: 1.6;
}

.tl-changes {
  margin-top: 6px;
  padding-left: 18px;
  font-size: 0.85rem;
  color: #92400e;
  line-height: 1.8;
}

.actions {
  display: flex;
  gap: 12px;
  border-top: 1px solid #f1f5f9;
  padding-top: 20px;
}

.act-btn {
  padding: 10px 24px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #475569;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.18s;
}

.act-btn:hover { border-color: #2563eb; color: #2563eb; }

.act-btn.starred {
  background: #fffbeb;
  border-color: #f59e0b;
  color: #b45309;
}

.act-btn.join {
  background: #2563eb;
  border-color: #2563eb;
  color: #fff;
}

.act-btn.join:hover { background: #1d4ed8; }

.act-btn.join.done {
  background: #dcfce7;
  border-color: #86efac;
  color: #15803d;
}

.loading-text {
  text-align: center;
  color: #94a3b8;
  padding: 60px 0;
}
</style>
