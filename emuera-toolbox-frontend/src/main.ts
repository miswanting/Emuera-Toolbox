import 'normalize.css'
import '@fortawesome/fontawesome-free/css/all.css'

import { createApp } from 'vue'
import { createStore } from 'vuex'
import { createRouter, createWebHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'

import App from './App.vue'

const app = createApp(App)

const store = createStore({})
app.use(store)

const router = createRouter({
    history: createWebHistory(),
    routes: []
})
app.use(router)

const i18n = createI18n({})
app.use(i18n)

app.mount('body')
