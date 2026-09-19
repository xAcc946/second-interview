import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ToastItem {
  id: number
  message: string
  type: 'success' | 'info' | 'warn'
}

let seq = 0

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<ToastItem[]>([])

  function show(message: string, type: ToastItem['type'] = 'success') {
    const id = ++seq
    toasts.value.push({ id, message, type })
    setTimeout(() => {
      const idx = toasts.value.findIndex((t) => t.id === id)
      if (idx >= 0) toasts.value.splice(idx, 1)
    }, 2200)
  }

  function remove(id: number) {
    const idx = toasts.value.findIndex((t) => t.id === id)
    if (idx >= 0) toasts.value.splice(idx, 1)
  }

  return { toasts, show, remove }
})
