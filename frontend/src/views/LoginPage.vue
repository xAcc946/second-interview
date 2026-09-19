<template>
  <div class="login-wrap">
    <div class="login-card">
      <div class="brand">
        <div class="brand-logo">🎓</div>
        <h1 class="brand-title">校园活动平台</h1>
        <p class="brand-sub">珠海科技学院 · 校园活动与机会一站式整理</p>
      </div>

      <form class="login-form" @submit.prevent="onSubmit">
        <div class="field" :class="{ bad: errors.sid }">
          <label for="l-sid">学号</label>
          <input
            id="l-sid"
            v-model.trim="form.sid"
            type="text"
            inputmode="numeric"
            placeholder="请输入学号"
            autocomplete="username"
            @input="errors.sid = ''"
          />
        </div>
        <p v-if="errors.sid" class="err">{{ errors.sid }}</p>

        <div class="field" :class="{ bad: errors.pwd }">
          <label for="l-pwd">密码</label>
          <input
            id="l-pwd"
            v-model="form.pwd"
            type="password"
            placeholder="请输入密码"
            autocomplete="current-password"
            @input="errors.pwd = ''"
          />
        </div>
        <p v-if="errors.pwd" class="err">{{ errors.pwd }}</p>

        <button type="submit" class="login-btn">登 录</button>
        <p class="demo-note">当前为演示登录：任意学号 + 密码均可进入</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const toast = useToastStore()

const form = reactive({ sid: '', pwd: '' })
const errors = reactive({ sid: '', pwd: '' })

function onSubmit() {
  errors.sid = form.sid ? '' : '请输入学号'
  errors.pwd = form.pwd ? '' : '请输入密码'
  if (errors.sid || errors.pwd) return
  auth.login(form.sid, form.pwd)
  toast.show(`欢迎回来，学号 ${form.sid}`, 'success')
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
  router.push(redirect)
}
</script>

<style scoped>
.login-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eff6ff 0%, #f5f3ff 50%, #ecfeff 100%);
  padding: 24px;
  box-sizing: border-box;
}

.login-card {
  width: 100%;
  max-width: 380px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 34px 32px 28px;
  box-shadow: 0 12px 40px rgba(37, 99, 235, 0.12);
}

.brand {
  text-align: center;
  margin-bottom: 24px;
}

.brand-logo {
  font-size: 2.4rem;
  line-height: 1;
}

.brand-title {
  margin: 10px 0 4px;
  font-size: 1.35rem;
  color: #111827;
}

.brand-sub {
  margin: 0;
  font-size: 0.8rem;
  color: #6b7280;
}

.field {
  margin-bottom: 14px;
}

.field label {
  display: block;
  font-size: 0.88rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}

.field input {
  width: 100%;
  box-sizing: border-box;
  padding: 11px 14px;
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
  margin: -8px 0 12px;
  color: #dc2626;
  font-size: 0.8rem;
}

.login-btn {
  width: 100%;
  margin-top: 8px;
  padding: 12px 0;
  border: none;
  border-radius: 10px;
  background: #2563eb;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 4px;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.login-btn:hover {
  background: #1d4ed8;
}

.login-btn:active {
  transform: scale(0.98);
}

.demo-note {
  margin: 14px 0 0;
  text-align: center;
  color: #9ca3af;
  font-size: 0.76rem;
}
</style>
