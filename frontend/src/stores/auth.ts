import { defineStore } from 'pinia'
import { ref } from 'vue'

const LS_AUTH = 'campus_auth_v1'

function loadAuth(): { student_id: string } | null {
  try {
    const raw = JSON.parse(localStorage.getItem(LS_AUTH) || 'null')
    return raw && raw.student_id ? raw : null
  } catch {
    return null
  }
}

/**
 * 登录状态（当前为演示阶段：任意非空学号 + 密码即可登入）
 * 登录信息持久化在 localStorage，刷新/重开浏览器仍保持登录。
 */
export const useAuthStore = defineStore('auth', () => {
  const saved = loadAuth()
  const studentId = ref<string>(saved?.student_id || '')
  const isAuthed = ref<boolean>(Boolean(saved?.student_id))

  function login(sid: string, pwd: string): boolean {
    if (!sid.trim() || !pwd.trim()) return false
    studentId.value = sid.trim()
    isAuthed.value = true
    localStorage.setItem(LS_AUTH, JSON.stringify({ student_id: studentId.value }))
    return true
  }

  function logout() {
    studentId.value = ''
    isAuthed.value = false
    localStorage.removeItem(LS_AUTH)
  }

  return { studentId, isAuthed, login, logout }
})
