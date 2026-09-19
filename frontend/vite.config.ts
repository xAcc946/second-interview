import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // 相对路径 base，保证部署到 GitHub Pages 的 /仓库名/ 子路径下资源也能正确加载
  base: './',
  plugins: [vue()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173,
    proxy: {
      // 可选：本地同时启动 FastAPI 后端时可走真实接口（作品默认已内置数据、无需后端）
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
