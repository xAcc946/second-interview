<template>
  <div class="publish-page">
    <h1>发布活动 / 招募信息</h1>
    <p class="desc">填写以下信息，发布你的活动、招募或组队信息</p>

    <form class="publish-form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>标题</label>
        <input v-model="form.title" type="text" placeholder="例如：周末篮球约球" required />
      </div>

      <div class="form-group">
        <label>类型</label>
        <select v-model="form.category" required>
          <option value="">请选择类型</option>
          <option value="activity">校园活动</option>
          <option value="recruit">团队招募</option>
          <option value="team">组队/搭子</option>
          <option value="sport">约球/运动</option>
          <option value="resource">资源共享</option>
          <option value="other">其他</option>
        </select>
      </div>

      <div class="form-group">
        <label>详细内容</label>
        <textarea v-model="form.content" rows="5" placeholder="描述你的活动详情、要求、注意事项等..." required></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>截止时间（可选）</label>
          <input v-model="form.deadline" type="datetime-local" />
        </div>
        <div class="form-group">
          <label>地点（可选）</label>
          <input v-model="form.location" type="text" placeholder="活动地点" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>联系方式（可选）</label>
          <input v-model="form.contact" type="text" placeholder="微信/QQ/手机号" />
        </div>
        <div class="form-group">
          <label>人数限制（可选）</label>
          <input v-model.number="form.max_participants" type="number" placeholder="不限" />
        </div>
      </div>

      <button type="submit" class="submit-btn">提交发布</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const form = reactive({
  title: '',
  category: '',
  content: '',
  deadline: '',
  location: '',
  contact: '',
  max_participants: null as number | null,
})

function handleSubmit() {
  // TODO: 调用 API 提交
  console.log('提交数据:', { ...form })
  alert('发布功能待接入 API')
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
  margin-bottom: 28px;
}

.publish-form {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 28px;
}

.form-group {
  margin-bottom: 20px;
  flex: 1;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #2563eb;
}

.form-row {
  display: flex;
  gap: 16px;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover {
  background: #1d4ed8;
}
</style>
