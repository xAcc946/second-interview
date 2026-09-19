<template>
  <div class="card" :class="{ 'card-joined': joinedSet, 'card-new': activity.is_user_post }">
    <!-- 顶部徽章区 -->
    <div class="badges">
      <span class="badge" :class="`tone-${status.tone}`">{{ status.label }}</span>
      <span class="badge badge-source" :class="`src-${activity.source}`">{{ sourceLabel }}</span>
      <span class="badge badge-cat">{{ catLabel }}</span>
      <span v-if="hasUpdate" class="badge badge-update">已合并补充通知</span>
      <span v-if="activity.is_user_post" class="badge badge-mine">我发布的</span>
    </div>

    <router-link :to="`/activity/${activity.id}`" class="card-title">
      {{ activity.title }}
    </router-link>

    <p class="card-summary">{{ activity.summary }}</p>

    <div class="meta">
      <div class="meta-row" v-if="activity.time_text">
        <span class="meta-icon">🕐</span><span>{{ activity.time_text }}</span>
      </div>
      <div class="meta-row" v-if="countdown">
        <span class="meta-icon">⏳</span>
        <span :class="['countdown', { hot: status.key === 'closing' }]">
          {{ activity.deadline_text || '截止' }} · {{ countdown }}
        </span>
      </div>
      <div class="meta-row">
        <span class="meta-icon">📍</span>
        <span>{{ activity.location || '地点未提供' }}</span>
      </div>
      <div class="meta-row" v-if="activity.threshold">
        <span class="meta-icon">🎯</span>
        <span>{{ activity.threshold }}</span>
      </div>
    </div>

    <p v-if="activity.status_note" class="note">⚠ {{ activity.status_note }}</p>
    <p v-if="firstChange" class="update-line">🔄 {{ firstChange }}</p>

    <div class="card-actions">
      <button
        class="act-btn"
        :class="{ starred: isFav }"
        @click="onFavorite"
      >
        {{ isFav ? '★ 已收藏' : '☆ 收藏' }}
      </button>
      <button
        v-if="joinable"
        class="act-btn join"
        :class="{ done: joinedSet }"
        @click="onJoin"
      >
        {{ joinedSet ? '✓ 已报名' : '我要参加' }}
      </button>
      <button v-else class="act-btn disabled" @click="onNotJoinable">
        暂不可报名
      </button>
      <router-link :to="`/activity/${activity.id}`" class="act-link">详情 →</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useActivityStore } from '../stores/activity'
import { useToastStore } from '../stores/toast'
import { displayStatus, deadlineCountdown, SOURCE_LABELS, type ActivityLike } from '../utils/time'

const props = defineProps<{ activity: ActivityLike }>()

const store = useActivityStore()
const toast = useToastStore()

const status = computed(() => displayStatus(props.activity))
const countdown = computed(() => deadlineCountdown(props.activity.deadline))
const catLabel = computed(() => store.categoryLabels[props.activity.category] || props.activity.category)
const sourceLabel = computed(() => SOURCE_LABELS[props.activity.source] || '来源未注明')
const isFav = computed(() => store.favorites.includes(props.activity.id))
const joinedSet = computed(() => store.joined.includes(props.activity.id))
const hasUpdate = computed(() => (props.activity.supplements || []).length > 0)
const firstChange = computed(() => props.activity.supplements?.[0]?.changes?.[0] || null)
const joinable = computed(() => ['open', 'soon', 'closing', 'longterm', 'waitlist'].includes(status.value.key))

function onFavorite() {
  const added = store.toggleFavorite(props.activity.id)
  toast.show(added ? '已加入收藏' : '已取消收藏', added ? 'success' : 'info')
}

function onJoin() {
  const added = store.toggleJoin(props.activity.id)
  toast.show(
    added ? '已标记「我要参加」，可在收藏页快速找到' : '已取消报名标记',
    added ? 'success' : 'info'
  )
}

function onNotJoinable() {
  toast.show('该活动当前不可报名（已结束或已截止）', 'warn')
}
</script>

<style scoped>
.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 20px 22px;
  transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
  position: relative;
}

.card:hover {
  box-shadow: 0 6px 24px rgba(30, 64, 175, 0.09);
  transform: translateY(-2px);
  border-color: #c7d2fe;
}

.card-joined {
  border-left: 4px solid #2563eb;
}

.card-new {
  border-color: #86efac;
}

.badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.badge {
  font-size: 0.75rem;
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
.src-student { background: #fdf4ff; color: #a21caf; }
.src-college { background: #eff6ff; color: #1e40af; }

.badge-update { background: #fef9c3; color: #a16207; }
.badge-mine { background: #dcfce7; color: #15803d; }
.badge-cat { background: #f1f5f9; color: #475569; }

.card-title {
  display: block;
  font-size: 1.08rem;
  font-weight: 600;
  color: #1e293b;
  text-decoration: none;
  margin-bottom: 6px;
  line-height: 1.45;
}

.card-title:hover {
  color: #2563eb;
}

.card-summary {
  color: #64748b;
  font-size: 0.88rem;
  line-height: 1.6;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 10px;
}

.meta-row {
  display: flex;
  gap: 8px;
  font-size: 0.85rem;
  color: #475569;
  align-items: baseline;
}

.meta-icon {
  flex-shrink: 0;
  font-size: 0.8rem;
}

.countdown.hot {
  color: #dc2626;
  font-weight: 600;
}

.note {
  font-size: 0.82rem;
  color: #b45309;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 6px 10px;
  margin-bottom: 10px;
}

.update-line {
  font-size: 0.82rem;
  color: #92400e;
  margin-bottom: 10px;
}

.card-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  border-top: 1px dashed #e5e7eb;
  padding-top: 12px;
}

.act-btn {
  padding: 7px 14px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #475569;
  font-size: 0.85rem;
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

.act-btn.disabled {
  color: #9ca3af;
  background: #f8fafc;
  cursor: not-allowed;
}

.act-link {
  margin-left: auto;
  color: #2563eb;
  font-size: 0.85rem;
  text-decoration: none;
}

.act-link:hover { text-decoration: underline; }
</style>
