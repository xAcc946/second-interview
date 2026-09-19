import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 活动相关接口
export const activityApi = {
  getList() {
    return api.get('/activities/')
  },
  getDetail(id: number) {
    return api.get(`/activities/${id}`)
  },
  search(keyword: string) {
    return api.get('/activities/search', { params: { keyword } })
  },
}

// 发布相关接口
export const publishApi = {
  create(data: {
    title: string
    content: string
    category: string
    deadline?: string
    location?: string
    contact?: string
    max_participants?: number
  }) {
    return api.post('/publish/', data)
  },
  getList() {
    return api.get('/publish/')
  },
}

// 健康检查
export const healthApi = {
  check() {
    return api.get('/health')
  },
}

export default api
