import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  // 开发服务器配置
  server: {
    port: 5173
  },
  // 构建配置
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // 优化配置，减少打包体积
    minify: 'esbuild',
    target: 'es2015',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router'],
          'antd-vendor': ['ant-design-vue', '@ant-design/icons-vue'],
          'utils': ['dayjs', 'xlsx', 'jszip']
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        compact: true
      }
    },
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true
  }
})