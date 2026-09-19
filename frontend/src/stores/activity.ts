import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getMergedActivities, CATEGORY_LABELS } from '../data/activities'
import { displayStatus, urgencyScore, isActionable, type ActivityLike } from '../utils/time'

export type { ActivityLike }

const LS_FAVORITES = 'campus_favorites_v1'
const LS_JOINED = 'campus_joined_v1'
const LS_POSTS = 'campus_user_posts_v1'

function loadLS(key: string): number[] {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]')
  } catch {
    return []
  }
}

function loadUserPosts(): ActivityLike[] {
  try {
    return JSON.parse(localStorage.getItem(LS_POSTS) || '[]')
  } catch {
    return []
  }
}

function maxUserPostId(posts: ActivityLike[]): number {
  return posts.reduce((m, p) => Math.max(m, p.id), 100)
}

export interface PublishForm {
  title: string
  summary: string
  category: string
  time_text?: string
  deadline?: string
  location?: string
  audience?: string
  threshold?: string
  contact?: string
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
      // 内置数据 + 本地发布内容，无需后端即可运行（适配 GitHub Pages 静态部署）
      const merged = getMergedActivities()
      activities.value = merged.concat(loadUserPosts())
      categoryLabels.value = CATEGORY_LABELS
    } catch (e: any) {
      error.value = e.message || '加载活动数据失败'
    } finally {
      loading.value = false
    }
  }

  /** 学生自主发布：写入 localStorage，刷新/重开后仍在，并立即进入列表 */
  function addPost(form: PublishForm): ActivityLike {
    const posts = loadUserPosts()
    const missing: string[] = []
    if (!form.time_text?.trim()) missing.push('活动时间')
    if (!form.location?.trim()) missing.push('活动地点')
    if (!form.contact?.trim()) missing.push('联系方式')
    if (!form.threshold?.trim()) missing.push('参与条件')
    const id = maxUserPostId(posts) + 1
    const post: ActivityLike = {
      id,
      title: form.title.trim(),
      summary: form.summary.trim(),
      category: form.category,
      source: 'student',
      time_text: form.time_text?.trim() || '时间待确认',
      event_start: null,
      deadline: form.deadline || null,
      deadline_text: form.deadline || '未注明',
      location: form.location?.trim() || null,
      audience: form.audience?.trim() || null,
      threshold: form.threshold?.trim() || null,
      contact: form.contact?.trim() || null,
      status: 'open',
      status_note: null,
      missing_fields: missing,
      risk_flag: false,
      risk_reason: null,
      is_user_post: true,
      timeline: [{ time: '发布于考核当日', text: form.summary.trim(), is_update: false }],
      supplements: [],
      related: [],
    }
    posts.push(post)
    localStorage.setItem(LS_POSTS, JSON.stringify(posts))
    activities.value = getMergedActivities().concat(posts)
    return post
  }

  function removeUserPost(id: number) {
    const posts = loadUserPosts().filter((p) => p.id !== id)
    localStorage.setItem(LS_POSTS, JSON.stringify(posts))
    activities.value = getMergedActivities().concat(posts)
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
    addPost,
    removeUserPost,
    getById,
    normalActivities,
    riskActivities,
    filtered,
    stats,
    resetFilters,
  }
})
