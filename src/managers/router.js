import { EventEmitter } from 'events'
import { createRouter, createWebHashHistory } from 'vue-router'
// import AppIndex from '../components/AppIndex.vue'
import AppIdle from '../components/AppIdle.vue'
import AppExplorer from '../components/AppExplorer.vue'
import AppEditor from '../components/AppEditor.vue'
import EditorConfig from '../components/EditorConfig.vue'
// import AppConsole from '../components/AppConsole.vue'
export default class RouterManager extends EventEmitter {
  constructor () {
    super()
    window.router = createRouter({
      history: createWebHashHistory(),
      routes: [
        // { path: '/', component: AppIndex },
        { path: '/idle', component: AppIdle },
        { path: '/explorer/:path*', alias: '/explorer', component: AppExplorer },
        { path: '/editor/:path+', component: AppEditor }
        // { path: '/console', component: AppConsole }
      ]
    })
  }

  getVueRouter () { return window.router }
}
