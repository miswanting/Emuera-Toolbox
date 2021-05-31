import '@fortawesome/fontawesome-free/css/all.min.css'
import 'virtual:windi.css'
import './style/index.styl'

import { createApp } from 'vue'
import { createStore } from 'vuex'
import { createI18n } from 'vue-i18n'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import AppIndex from './routes/AppIndex.vue'
import Explorer from './routes/Explorer.vue'
import Editor from './routes/Editor.vue'

import MenuStoreModule from './stores/menu'
import ThemeStoreModule from './stores/theme'
import FileSystemStoreModule from './stores/fs'

import locale_en from './locales/en.yml'
import locale_zh_CN from './locales/zh_CN.yml'
import { ipcRenderer } from 'electron'


export { };
declare global {
  interface Window {
    store?: any;
    router?: any;
    i18n?: any;
  }
}

addEventListener('load', function () {
  window.store = createStore({
    state() { return { debug: true } },
    modules: {
      menu: MenuStoreModule,
      theme: ThemeStoreModule,
      fs: FileSystemStoreModule,
    },
  })

  window.router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: AppIndex },
      { path: '/explorer/:pieces*', component: Explorer },
      { path: '/editor/:pieces*', component: Editor },
    ]
  })

  window.i18n = createI18n({
    locale: 'zh_CN',
    fallbackLocale: 'en',
    globalInjection: true,
    messages: {
      en: locale_en,
      zh_CN: locale_zh_CN
    }
  })

  const app = createApp(App)

  app.use(window.store)
  app.use(window.router)
  app.use(window.i18n)

  app.mount('body')

  window.router.push('/')

  ipcRenderer.on('setProjectFS', (e, value) => {
    window.store.dispatch('fs/setProjectFS', value)
  })
})