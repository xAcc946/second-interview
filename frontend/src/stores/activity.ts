import { defineStore } from 'pinia'
import { ref } from 'vue'
import { activityApi } from '../api'

export interface Activity {
  id: number
  title: string
  content: string
  category: string
  source: string
  deadline: string | null
  location: string | null
  target_audience: string | null
  status: string
  is_supplement: boolean
  original_id: number | null
  risk_flag: boolean
  risk_reason: string | null
}

export const useActivityStore = defineStore('activity', () => {
  const activities = ref<Activity[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchActivities() {
    loading.value = true
    error.value = null
    try {
      const res = await activityApi.getList()
      activities.value = res.data.data
    } catch (e: any) {
      error.value = e.message || '获取活动列表失败'
    } finally {
      loading.value = false
    }
  }

  return {
    activities,
    loading,
    error,
    fetchActivities,
  }
})
