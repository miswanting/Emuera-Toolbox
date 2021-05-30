import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import electron from './src/vite-plugin/vitejs-plugin-electron'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    vueI18n(),
    electron(),
    WindiCSS(),
  ],
  build: {
    rollupOptions: {
      external: ['electron'],
    }
  },
  optimizeDeps: {
    exclude: ['electron'],
  },

})
