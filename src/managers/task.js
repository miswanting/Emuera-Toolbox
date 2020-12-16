import { EventEmitter } from 'events'
import { Worker } from 'worker_threads'
/**
 * # 任务管理器
 */
export default class TaskManager extends EventEmitter {
  constructor() {
    super()
    this.data = {
      projectHierarchy: {}
    }
  }

  exec(data) {
    if (data.type === 'loadProjectFolder') {
      const projectLoader = new Worker('./src/workers/project-loader.js')
      projectLoader.on('message', (pkg) => {
        if (pkg.type === 'projectHierarchy') {
          this.data.projectHierarchy = pkg.data
          this.emit('send', pkg)
        } else if (pkg.type === 'updateFileEncoding') {
          const pathPieces = pkg.data.path.split('/')
          pkg.data.path = pathPieces.slice(1, pathPieces.length)
          this.emit('send', pkg)
          function updateFileEncodingRecursively(data, hierarchy) {
            if (data.path.length === 1) {
              hierarchy.files[data.path[0]].encoding = data.encoding
            } else {
              const p = data.path.shift()
              updateFileEncodingRecursively(data, hierarchy.folders[p])
            }
          }
          updateFileEncodingRecursively(JSON.parse(JSON.stringify(pkg.data)), this.data.projectHierarchy)
        }
      })
      projectLoader.postMessage(data)
    } else if (data.type === 'loadFile') {
      this.emit('send', {
        type: 'updateFileLoadStatus',
        data: {
          path: data.data,
          loadStatus: 'Processing'
        }
      })
      function getFileMetaRecursively(data, hierarchy) {
        if (data.length === 1) {
          return hierarchy.files[data[0]]
        } else {
          const p = data.shift()
          return getFileMetaRecursively(data, hierarchy.folders[p])
        }
      }
      const fileMeta = getFileMetaRecursively(JSON.parse(JSON.stringify(data.data)), this.data.projectHierarchy)
      const fileLoader = new Worker('./src/workers/file-loader.js')
      fileLoader.on('message', (pkg) => {
        if (pkg.type === 'updateFileRaw') {
          fileMeta.encoding = pkg.data.encoding
          fileMeta.raw = pkg.data.raw
          this.emit('send', {
            type: 'updateFileRaw',
            data: {
              path: data.data,
              raw: fileMeta.raw
            }
          })
        } else if (pkg.type === 'updateFileAst') {
          fileMeta.ast = pkg.data.ast
          this.emit('send', {
            type: 'updateFileAst',
            data: {
              path: data.data,
              ast: fileMeta.ast
            }
          })
        }
      })
      function loadFileRaw() {
        fileLoader.postMessage({
          type: 'loadFileRaw',
          data: fileMeta
        })
      }
      function loadFileAst() {
        fileLoader.postMessage({
          type: 'loadFileAst',
          data: fileMeta
        })
      }
      if (Object.prototype.hasOwnProperty.call(fileMeta, 'raw')) {
        this.emit('send', {
          type: 'updateFileRaw',
          data: {
            path: data.data,
            raw: fileMeta.raw
          }
        })
      } else {
        loadFileRaw()
        return
      }
      if (Object.prototype.hasOwnProperty.call(fileMeta, 'ast')) {
        this.emit('send', {
          type: 'updateFileAst',
          data: {
            path: data.data,
            ast: fileMeta.ast
          }
        })
      } else {
        loadFileAst()
      }
    } else if (data.type === 'enterRoute') {
      this.emit('send', {
        type: 'enterRoute',
        data: data.data
      })
    } else {
      console.log(data)
    }
  }
}
