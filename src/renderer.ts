import { createApp } from 'vue'
import { createStore } from 'vuex'
import { createRouter, createWebHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'windi.css'
import Root from './Root.vue'
import en from './locales/en.yml'
import zh_CN from './locales/zh_CN.yml'
addEventListener('load', function () {
  const app = createApp(Root)
  window.store = createStore({})
  window.router = createRouter({
    history: createWebHistory(),
    routes: []
  })
  window.i18n = createI18n({
    locale: 'zh_CN',
    fallbackLocale: 'en',
    messages: {
      en,
      zh_CN
    },
  })
  app.mount('body')
})