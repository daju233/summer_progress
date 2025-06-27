import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // proxy: {
    //   '/wakapi-stats': {
    //     target: 'https://wakapi.dev',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/wakapi-stats/, '/api/v1/users/Lorange/stats'),
    //     secure: true,
    //     // 如果需要可以添加 headers（如 API 密钥）
    //     // headers: {
    //     //   Authorization: 'Bearer your_api_key_here'
    //     // }
    //   }
    // }
  }
})