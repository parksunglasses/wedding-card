import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // 큰 벤더 라이브러리를 별도 청크로 분리 — 메인 번들 축소 + 배포 간 캐싱 향상
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'motion-vendor': ['framer-motion'],
          'lottie-vendor': ['lottie-react'],
        },
      },
    },
  },
})