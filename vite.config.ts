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
    target: 'es2020',
    cssCodeSplit: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // 주요 라이브러리를 별도 청크로 분리하여 메인 JS 번들 크기 최소화 및 브라우저 캐싱 향상
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'motion-vendor': ['framer-motion'],
          'lottie-vendor': ['lottie-react'],
          'supabase-vendor': ['@supabase/supabase-js'],
        },
      },
    },
  },
})