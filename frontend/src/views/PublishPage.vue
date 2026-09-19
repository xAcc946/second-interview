<template>
  <div class="publish-page">
    <h1>发布活动 / 招募信息</h1>
    <p class="desc">填写以下信息，发布你的活动、招募或组队信息。发布后将出现在首页列表，可被搜索和筛选。</p>

    <form class="publish-form" @submit.prevent="trySubmit">
      <div class="form-group">
        <label>标题 <em class="req">*</em></label>
        <input v-model="form.title" type="text" placeholder="例如：周末篮球约球 / 竞赛组队招募" maxlength="50" />
        <p v-if="errors.title" class="err">{{ errors.title }}</p>
      </div>

      <div class="form-group">
        <label>类型 <em class="req">*</em></label>
        <select v-model="form.category">
          <option value="">请选择类型</option>
          <option value="activity">校园活动</option>
          <option value="recruit">团队招募</option>
          <option value="team">组队/搭子</option>
          <option value="sport">运动约球</option>
          <option value="study_group">学习小组</option>
          <option value="resource">资源共享</option>
          <option value="other">其他</option>
        </select>
        <p v-if="errors.category" class="err">{{ errors.category }}</p>
      </div>

      <div class="form-group">
        <label>详细内容 <em class="req">*</em></label>
        <textarea v-model="form.summary" rows="5" placeholder="描述活动安排、投入要求、注意事项等…（写清“谁适合参加、要投入多少时间”能显著提高招募效率）" maxlength="300"></textarea>
        <p v-if="errors.summary" class="err">{{ errors.summary }}</p>
        <p class="counter">{{ form.summary.length }}/300</p>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>活动时间</label>
          <input v-model="form.time_text" type="text" placeholder="例如：9月25日 19:00，每周四晚" />
        </div>
        <div class="form-group">
          <label>报名截止（可选）</label>
          <input v-model="form.deadline" type="datetime-local" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>地点</label>
          <input v-model="form.location" type="text" placeholder="例如：体育馆 / 线上（未定请写“待定”）" />
        </div>
        <div class="form-group">
          <label>联系方式</label>
          <input v-model="form.contact" type="text" placeholder="微信/QQ（建议避免直接公开私人号）" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>适用对象（可选）</label>
          <input v-model="form.audience" type="text" placeholder="例如：零基础可参加 / 限大二" />
        </div>
        <div class="form-group">
          <label>参与条件（可选）</label>
          <input v-model="form.threshold" type="text" placeholder="例如：每周投入4小时" />
        </div>
      </div>

      <!-- 缺失信息校验提示 -->
      <Transition name="warn">
        <div v-if="missingHints.length && !forcePublish" class="warn-box">
          <p><strong>以下关键信息尚未填写：</strong>{{ missingHints.join('、') }}</p>
          <p class="warn-sub">信息不完整会降低他人判断效率，也容易被平台标注为「信息缺失」。建议补全后发布。</p>
          <label class="force-check">
            <input type="checkbox" v-model="forcePublish" />
            信息待确认，仍要先发布（发布后卡片会标注缺失项）
          </label>
        </div>
      </Transition>

      <button type="submit" class="submit-btn" :disabled="submitting">
        {{ submitting ? '发布中…' : '确认发布' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useActivityStore } from '../stores/activity'
import { useToastStore } from '../stores/toast'

const router = useRouter()
const store = useActivityStore()
const toast = useToastStore()

const form = reactive({
  title: '',
  category: '',
  summary: '',
  time_text: '',
  deadline: '',
  location: '',
  contact: '',
  audience: '',
  threshold: '',
})

const errors = reactive<Record<string, string>>({})
const forcePublish = ref(false)
const submitting = ref(false)

const missingHints = computed(() => {
  const list: string[] = []
  if (!form.time_text.trim()) list.push('活动时间')
  if (!form.location.trim()) list.push('活动地点')
  if (!form.contact.trim()) list.push('联系方式')
  return list
})

function validate(): boolean {
  errors.title = form.title.trim() ? '' : '请填写标题'
  errors.category = form.category ? '' : '请选择类型'
  errors.summary = form.summary.trim().length >= 10 ? '' : '详细内容至少 10 个字，请说明活动安排与要求'
  return !errors.title && !errors.category && !errors.summary
}

async function trySubmit() {
  if (!validate()) {
    toast.show('请补全必填项（标题 / 类型 / 详细内容）', 'warn')
    return
  }
  if (missingHints.value.length && !forcePublish.value) {
    toast.show('存在缺失信息，请补全或勾选「仍要先发布」', 'warn')
    return
  }
  submitting.value = true
  try {
    store.addPost({ ...form }) // 写入 localStorage，新内容立即进入列表
    toast.show('发布成功，已出现在活动列表中')
    router.push('/')
  } catch (e: any) {
    toast.show(e.message || '发布失败，请重试', 'warn')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.publish-page {
  max-width: 680px;
  margin: 0 auto;
}

.publish-page h1 {
  font-size: 1.5rem;
  color: #1e293b;
  margin-bottom: 8px;
}

.desc {
  color: #64748b;
  margin-bottom: 24px;
  font-size: 0.94rem;
}

.publish-form {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 28px;
}

.form-group {
  margin-bottom: 18px;
  flex: 1;
  position: relative;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.req { color: #dc2626; font-style: normal; }

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.err {
  color: #dc2626;
  font-size: 0.8rem;
  margin-top: 4px;
}

.counter {
  position: absolute;
  right: 4px;
  bottom: -16px;
  font-size: 0.75rem;
  color: #94a3b8;
}

.form-row {
  display: flex;
  gap: 16px;
}

.warn-box {
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 18px;
  font-size: 0.88rem;
  color: #92400e;
}

.warn-sub {
  margin-top: 6px;
  color: #a16207;
  font-size: 0.82rem;
}

.force-check {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-top: 10px;
  cursor: pointer;
  font-weight: 500;
}

.force-check input { accent-color: #d97706; }

.warn-enter-active,
.warn-leave-active {
  transition: all 0.25s ease;
  max-height: 200px;
}

.warn-enter-from,
.warn-leave-to {
  max-height: 0;
  opacity: 0;
  margin-bottom: 0;
  overflow: hidden;
}

.submit-btn {
  width: 100%;
  padding: 13px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover { background: #1d4ed8; }

.submit-btn:disabled {
  background: #93c5fd;
  cursor: wait;
}
</style>
