import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { activityApi } from '../api'
import { displayStatus, urgencyScore, isActionable, type ActivityLike } from '../utils/time'

export type { ActivityLike }

const LS_FAVORITES = 'campus_favorites_v1'
const LS_JOINED = 'campus_joined_v1'

function loadLS(key: string): number[] {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]')
  } catch {
    return []
  }
}

export const useActivityStore = defineStore('activity', () => {
  const activities = ref<ActivityLike[]>([])
  const categoryLabels = ref<Record<string, string>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 筛选条件
  const keyword = ref('')
  const activeCategory = ref('all')
  const activeSource = ref('all')
  const onlyActionable = ref(false)
  const onlyFavorites = ref(false)

  // 收藏 / 报名（localStorage 持久化，刷新重开仍在）
  const favorites = ref<number[]>(loadLS(LS_FAVORITES))
  const joined = ref<number[]>(loadLS(LS_JOINED))

  function toggleFavorite(id: number): boolean {
    const idx = favorites.value.indexOf(id)
    idx >= 0 ? favorites.value.splice(idx, 1) : favorites.value.push(id)
    localStorage.setItem(LS_FAVORITES, JSON.stringify(favorites.value))
    return idx < 0
  }

  function toggleJoin(id: number): boolean {
    const idx = joined.value.indexOf(id)
    idx >= 0 ? joined.value.splice(idx, 1) : joined.value.push(id)
    localStorage.setItem(LS_JOINED, JSON.stringify(joined.value))
    return idx < 0
  }

  async function fetchActivities() {
    loading.value = true
    error.value = null
    try {
      const res = await activityApi.getList()
      activities.value = res.data.data
      categoryLabels.value = res.data.category_labels || {}
    } catch (e: any) {
      error.value = e.message || '获取活动列表失败，请确认后端服务已启动'
    } finally {
      loading.value = false
    }
  }

  function getById(id: number): ActivityLike | undefined {
    return activities.value.find((a) => a.id === id)
  }

  /** 普通活动（不含风险提示条目） */
  const normalActivities = computed(() => activities.value.filter((a) => !a.risk_flag))

  /** 存在风险/低质量条目：默认折叠展示，不删除 */
  const riskActivities = computed(() => activities.value.filter((a) => a.risk_flag))

  /** 应用筛选 + 紧急度排序 */
  const filtered = computed(() => {
    let list = normalActivities.value
    const kw = keyword.value.trim().toLowerCase()
    if (kw) {
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(kw) ||
          (a.summary || '').toLowerCase().includes(kw) ||
          (a.location || '').toLowerCase().includes(kw)
      )
    }
    if (activeCategory.value !== 'all') {
      list = list.filter((a) => a.category === activeCategory.value)
    }
    if (activeSource.value !== 'all') {
      list = list.filter((a) => a.source === activeSource.value)
    }
    if (onlyActionable.value) {
      list = list.filter(isActionable)
    }
    if (onlyFavorites.value) {
      list = list.filter((a) => favorites.value.includes(a.id))
    }
    return [...list].sort((x, y) => urgencyScore(x) - urgencyScore(y))
  })

  /** 顶部统计 */
  const stats = computed(() => {
    const all = activities.value
    const actionable = all.filter(isActionable).length
    const closingSoon = all
      .filter((a) => displayStatus(a).key === 'closing')
      .sort((x, y) => urgencyScore(x) - urgencyScore(y))
    const merged = all.filter((a) => (a.supplements || []).length > 0).length
    return { total: all.length, actionable, closingSoon, merged }
  })

  function resetFilters() {
    keyword.value = ''
    activeCategory.value = 'all'
    activeSource.value = 'all'
    onlyActionable.value = false
    onlyFavorites.value = false
  }

  return {
    activities,
    categoryLabels,
    loading,
    error,
    keyword,
    activeCategory,
    activeSource,
    onlyActionable,
    onlyFavorites,
    favorites,
    joined,
    toggleFavorite,
    toggleJoin,
    fetchActivities,
    getById,
    normalActivities,
    riskActivities,
    filtered,
    stats,
    resetFilters,
  }
})
