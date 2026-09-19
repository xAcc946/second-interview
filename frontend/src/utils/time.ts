/** 时间、状态、紧急度相关的计算工具 */

/** 考核时间背景：2026-09-19。若真实时间超出则使用真实时间。 */
const BASE_TIME = new Date('2026-09-19T14:30:00')
export function now(): Date {
  const real = new Date()
  return real > BASE_TIME && real.getFullYear() === BASE_TIME.getFullYear() ? real : BASE_TIME
}

const HOUR = 60 * 60 * 1000

export function parseTime(s: string | null | undefined): Date | null {
  if (!s) return null
  const d = new Date(s)
  return isNaN(d.getTime()) ? null : d
}

/** 距离目标时间的剩余小时数（负数表示已过去） */
export function hoursUntil(s: string | null | undefined): number | null {
  const d = parseTime(s)
  if (!d) return null
  return (d.getTime() - now().getTime()) / HOUR
}

/**
 * 计算展示用状态（在数据原始状态基础上结合截止时间动态计算）
 * returning:
 *  closing_soon 即将截止 | open 报名中 | longterm 长期开放
 *  waitlist 可候补 | closed 已截止 | ended 已结束
 */
export function displayStatus(a: ActivityLike): { key: string; label: string; tone: string } {
  const dl = hoursUntil(a.deadline)
  if (a.status === 'ended') return { key: 'ended', label: '已结束', tone: 'gray' }
  if (a.status === 'closed') {
    return a.status_note && a.status_note.includes('候补')
      ? { key: 'waitlist', label: '已截止 · 可候补', tone: 'orange' }
      : { key: 'closed', label: '已截止', tone: 'gray' }
  }
  if (a.status === 'longterm') return { key: 'longterm', label: '长期开放', tone: 'blue' }
  // open
  if (dl !== null && dl <= 0) return { key: 'closed', label: '已截止', tone: 'gray' }
  if (dl !== null && dl <= 24) return { key: 'closing', label: '24小时内截止', tone: 'red' }
  if (dl !== null && dl <= 72) return { key: 'soon', label: '即将截止', tone: 'orange' }
  return { key: 'open', label: '报名中', tone: 'green' }
}

/**
 * 紧急度排序分值（越小越靠前）——「最该先动手」优先
 */
export function urgencyScore(a: ActivityLike): number {
  const st = displayStatus(a)
  const dl = hoursUntil(a.deadline)
  const ev = hoursUntil(a.event_start)
  if (st.key === 'closing' || st.key === 'soon') return dl !== null ? dl : 0
  if (st.key === 'open' && ev !== null && ev > 0 && ev <= 24) return 0.5 + ev / 100 // 今日/明日开始
  if (st.key === 'open' && dl === null) return 40 // 无截止时间的报名中
  if (st.key === 'longterm') return 50
  if (st.key === 'waitlist') return 60
  if (st.key === 'closed') return 70
  if (st.key === 'ended') return 80
  return 45
}

/** 状态是否"还能行动"（用于"仅看可报名"筛选） */
export function isActionable(a: ActivityLike): boolean {
  const k = displayStatus(a).key
  return ['open', 'soon', 'closing'].includes(k) || (k === 'waitlist')
}

/** 把 ISO 时间格式化成 "9月21日 19:30" */
export function formatDateTime(s: string | null | undefined): string | null {
  const d = parseTime(s)
  if (!d) return null
  const m = d.getMonth() + 1
  const day = d.getDate()
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${m}月${day}日 ${hh}:${mm}`
}

/** 截止时间倒计时文字 */
export function deadlineCountdown(s: string | null | undefined): string | null {
  const h = hoursUntil(s)
  if (h === null) return null
  if (h <= 0) return '已过期'
  if (h < 24) return `剩 ${Math.max(1, Math.floor(h))} 小时`
  return `剩 ${Math.floor(h / 24)} 天`
}

export const SOURCE_LABELS: Record<string, string> = {
  school: '校级',
  college: '院级',
  student: '学生自发',
}

export interface ActivityLike {
  id: number
  title: string
  summary: string
  category: string
  source: string
  status: string
  status_note?: string | null
  deadline?: string | null
  event_start?: string | null
  [k: string]: any
}
