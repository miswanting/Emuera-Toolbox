addEventListener('load', function () {
  window.app = Vue.createApp({
    template: '<router-view></router-view>'
  })
  app.use(store)
  app.use(router)
  components.forEach(element => app.component(element[0], element[1]))
  app.mount('body')
})
require('electron').ipcRenderer.on('open-root-folder', (e, msg) => {
  store.state.currentPath = []
  store.state.folderStructure = msg.structure
  router.push('/explorer')
})
require('electron').ipcRenderer.on('update-file-encoding', (e, data) => {
  function setFileEncoding(path, struct, encoding) {
    if (path.length === 0) {
      struct.encoding = encoding
    } else if (path.length === 1) {
      setFileEncoding(path.slice(1, path.length), struct.files[path[0]], encoding)
    } else {
      setFileEncoding(path.slice(1, path.length), struct.folders[path[0]], encoding)
    }
  }
  setFileEncoding(data.path, store.state.folderStructure, data.encoding)
})
require('electron').ipcRenderer.on('open-file', (e, data) => {
  store.state.currentFile.content = data
})
require('electron').ipcRenderer.on('update-file-ast', (e, data) => {
  store.state.currentFile.ast = data
})
