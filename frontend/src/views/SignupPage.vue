<template>
  <div v-if="activity" class="signup-page">
    <router-link :to="`/activity/${activity.id}`" class="back-link">← 返回活动详情</router-link>

    <!-- 活动摘要 -->
    <div class="act-summary">
      <span class="cat-chip">{{ catLabel }}</span>
      <h2 class="act-title">{{ activity.title }}</h2>
      <p class="act-meta">
        <span v-if="activity.deadline_text">报名截止：{{ activity.deadline_text }}</span>
        <span v-if="countdown" class="cd">（{{ countdown }}）</span>
      </p>
      <p v-if="closedWarn" class="closed-warn">⚠ 该活动已截止，报名仅作本地演示记录，请留意实际安排。</p>
    </div>

    <!-- 已报名：成功页 -->
    <div v-if="signupInfo" class="success-card">
      <div class="success-icon">🎉</div>
      <h3 class="success-title">报名成功</h3>
      <p class="success-sub">你已成功报名「{{ activity.title }}」</p>
      <div class="info-box">
        <div class="info-row"><span class="label">班别</span><span class="value">{{ signupInfo.class_name }}</span></div>
        <div class="info-row"><span class="label">姓名</span><span class="value">{{ signupInfo.name }}</span></div>
        <div class="info-row"><span class="label">学号</span><span class="value">{{ signupInfo.student_id }}</span></div>
        <div class="info-row"><span class="label">报名时间</span><span class="value">{{ signupInfo.signed_at }}</span></div>
      </div>
      <p class="save-note">报名信息已保存在本机，可随时查看或取消。</p>
      <div class="success-actions">
        <router-link :to="`/activity/${activity.id}`" class="btn primary">查看活动详情</router-link>
        <router-link to="/" class="btn ghost">返回首页</router-link>
      </div>
      <button class="cancel-link" @click="onCancel">取消报名</button>
    </div>

    <!-- 未报名：填写信息表单 -->
    <form v-else class="form-card" @submit.prevent="onSubmit">
      <h3 class="form-title">填写报名信息</h3>
      <p class="form-sub">请填写你的个人信息用于活动报名（仅保存在本机浏览器，不会上传）。</p>

      <div class="field" :class="{ bad: errors.name }">
        <label for="f-name">姓名 <i class="req">*</i></label>
        <input id="f-name" v-model.trim="form.name" type="text" placeholder="请输入真实姓名" @input="errors.name = ''" />
        <p v-if="errors.name" class="err">{{ errors.name }}</p>
      </div>

      <div class="field" :class="{ bad: errors.class_name }">
        <label for="f-class">班别 <i class="req">*</i></label>
        <input id="f-class" v-model.trim="form.class_name" type="text" placeholder="如：计算机科学与技术241班" @input="errors.class_name = ''" />
        <p v-if="errors.class_name" class="err">{{ errors.class_name }}</p>
      </div>

      <div class="field" :class="{ bad: errors.student_id }">
        <label for="f-sid">学号 <i class="req">*</i></label>
        <input id="f-sid" v-model.trim="form.student_id" type="text" inputmode="numeric" placeholder="如：202412345678" @input="errors.student_id = ''" />
        <p v-if="errors.student_id" class="err">{{ errors.student_id }}</p>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn primary">确认报名</button>
        <router-link :to="`/activity/${activity.id}`" class="btn ghost">再想想</router-link>
      </div>
    </form>
  </div>

  <div v-else class="state-wrap">
    <p class="loading-text">{{ store.loading ? '加载中…' : '未找到该活动，可能已被合并或不存在。' }}</p>
    <router-link to="/" class="btn ghost">返回首页</router-link>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useActivityStore } from '../stores/activity'
import { useToastStore } from '../stores/toast'
import { displayStatus, deadlineCountdown } from '../utils/time'

const route = useRoute()
const router = useRouter()
const store = useActivityStore()
const toast = useToastStore()

onMounted(async () => {
  if (!store.activities.length) await store.fetchActivities()
})

const activityId = computed(() => Number(route.params.id))
const activity = computed(() => store.getById(activityId.value))
const signupInfo = computed(() => store.getSignup(activityId.value))
const catLabel = computed(() =>
  activity.value ? store.categoryLabels[activity.value.category] || activity.value.category : ''
)
const countdown = computed(() => (activity.value ? deadlineCountdown(activity.value.deadline) : null))
const closedWarn = computed(() => {
  if (!activity.value) return false
  const key = displayStatus(activity.value).key
  return key === 'ended' || key === 'closed'
})

const form = reactive({ name: '', class_name: '', student_id: '' })
const errors = reactive({ name: '', class_name: '', student_id: '' })

function validate(): boolean {
  errors.name = form.name ? (form.name.length >= 2 && form.name.length <= 20 ? '' : '姓名应为 2-20 个字') : '请填写姓名'
  errors.class_name = form.class_name ? '' : '请填写班别'
  if (!form.student_id) {
    errors.student_id = '请填写学号'
  } else if (!/^\d{6,14}$/.test(form.student_id)) {
    errors.student_id = '学号应为 6-14 位数字'
  } else {
    errors.student_id = ''
  }
  return !errors.name && !errors.class_name && !errors.student_id
}

function onSubmit() {
  if (!validate()) return
  store.signup(activityId.value, { ...form })
  toast.show('报名成功，信息已保存', 'success')
  // 切换到成功页（signupInfo 变为真值后模板自动渲染）
}

function onCancel() {
  store.cancelSignup(activityId.value)
  toast.show('已取消报名', 'info')
  router.push('/')
}
</script>

<style scoped>
.signup-page {
  max-width: 560px;
  margin: 0 auto;
}

.back-link {
  display: inline-block;
  color: #2563eb;
  text-decoration: none;
  font-size: 0.9rem;
  margin-bottom: 16px;
}

.act-summary {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 18px 22px;
  margin-bottom: 18px;
}

.cat-chip {
  display: inline-block;
  background: #eff6ff;
  color: #2563eb;
  font-size: 0.75rem;
  padding: 2px 10px;
  border-radius: 999px;
  margin-bottom: 8px;
}

.act-title {
  margin: 0 0 6px;
  font-size: 1.15rem;
  color: #111827;
}

.act-meta {
  margin: 0;
  color: #6b7280;
  font-size: 0.86rem;
}

.cd {
  color: #dc2626;
}

.closed-warn {
  margin: 10px 0 0;
  color: #b45309;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.84rem;
}

/* 成功页 */
.success-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 32px 28px;
  text-align: center;
}

.success-icon {
  font-size: 2.6rem;
  line-height: 1;
}

.success-title {
  margin: 12px 0 4px;
  font-size: 1.3rem;
  color: #059669;
}

.success-sub {
  margin: 0 0 18px;
  color: #6b7280;
  font-size: 0.9rem;
}

.info-box {
  text-align: left;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px 18px;
  margin-bottom: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 0.92rem;
}

.info-row + .info-row {
  border-top: 1px dashed #e5e7eb;
}

.info-row .label {
  color: #6b7280;
}

.info-row .value {
  color: #111827;
  font-weight: 600;
}

.save-note {
  color: #9ca3af;
  font-size: 0.78rem;
  margin: 0 0 18px;
}

.success-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.cancel-link {
  display: block;
  margin: 16px auto 0;
  border: none;
  background: none;
  color: #9ca3af;
  font-size: 0.82rem;
  cursor: pointer;
  text-decoration: underline;
}

.cancel-link:hover {
  color: #dc2626;
}

/* 表单 */
.form-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 26px 28px;
}

.form-title {
  margin: 0 0 4px;
  font-size: 1.15rem;
  color: #111827;
}

.form-sub {
  margin: 0 0 20px;
  color: #6b7280;
  font-size: 0.85rem;
}

.field {
  margin-bottom: 16px;
}

.field label {
  display: block;
  font-size: 0.88rem;
  color: #374151;
  margin-bottom: 6px;
  font-weight: 600;
}

.req {
  color: #dc2626;
  font-style: normal;
}

.field input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.field input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.field.bad input {
  border-color: #dc2626;
}

.err {
  margin: 6px 0 0;
  color: #dc2626;
  font-size: 0.8rem;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 22px;
}

.btn {
  border: none;
  border-radius: 10px;
  padding: 10px 26px;
  font-size: 0.95rem;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: background 0.2s, transform 0.1s;
}

.btn:active {
  transform: scale(0.97);
}

.btn.primary {
  background: #2563eb;
  color: #fff;
}

.btn.primary:hover {
  background: #1d4ed8;
}

.btn.ghost {
  background: #fff;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.btn.ghost:hover {
  border-color: #9ca3af;
}

.state-wrap {
  text-align: center;
  padding: 60px 0;
}

.loading-text {
  color: #9ca3af;
  margin-bottom: 16px;
}
</style>
