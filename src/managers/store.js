import { EventEmitter } from 'events'
import { createStore } from 'vuex'

import isDev from 'electron-is-dev'
import { safeDump, safeLoad } from 'js-yaml'
let toMain
export default class StoreManager extends EventEmitter {
  constructor(net) {
    super()
    toMain = net
    window.store = createStore({
      state() {
        return {
          configs: {
            Language: 'en',
            DictAutoLoad: true
          },
          dictConfigs: {
            activeDicts: [],
            currentDict: null
          },
          currentPath: [],
          projectHierarchy: {},
          currentFile: {
            content: null,
            ast: null
          },
          editorMode: 'edit'
        }
      },
      mutations: {
        parsePackage(state, pkg) {
          if (pkg.type === 'projectHierarchy') {
            state.projectHierarchy = pkg.data
            window.router.push('/explorer')
          } else if (pkg.type === 'updateFileEncoding') {
            function updateFileEncodingRecursively(data, hierarchy) {
              if (data.path.length === 1) {
                hierarchy.files[data.path[0]].encoding = data.encoding
              } else {
                const p = data.path.shift()
                updateFileEncodingRecursively(data, hierarchy.folders[p])
              }
            }
            updateFileEncodingRecursively(pkg.data, state.projectHierarchy)
          } else if (pkg.type === 'loadFile') {
            toMain.send(pkg)
          } else if (pkg.type === 'updateFileRaw') {
            function updateFileRawRecursively(data, hierarchy) {
              if (data.path.length === 1) {
                hierarchy.files[data.path[0]].raw = data.raw
              } else {
                const p = data.path.shift()
                updateFileRawRecursively(data, hierarchy.folders[p])
              }
            }
            updateFileRawRecursively(pkg.data, state.projectHierarchy)
          } else if (pkg.type === 'updateFileAst') {
            function updateFileRawRecursively(data, hierarchy) {
              if (data.path.length === 1) {
                hierarchy.files[data.path[0]].ast = data.ast
                hierarchy.files[data.path[0]].loadStatus = 'Done'
              } else {
                const p = data.path.shift()
                updateFileRawRecursively(data, hierarchy.folders[p])
              }
            }
            updateFileRawRecursively(pkg.data, state.projectHierarchy)
          } else if (pkg.type === 'enterRoute') {
            window.router.push(pkg.data)
          }
        }
      }
    })
  }

  getVueStore() { return window.store }
  parsePackage(pkg) { window.store.commit('parsePackage', pkg) }
}
