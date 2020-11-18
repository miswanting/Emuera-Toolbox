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
require('electron').ipcRenderer.on('enter-route', (e, data) => {
  router.push(data.value)
})
require('electron').ipcRenderer.on('set-config', (e, data) => {
  store.state.configs = data.value
  handleConfig()
})
require('electron').ipcRenderer.on('save-config', (e) => {
  console.log(123);
  require('electron').ipcRenderer.send('save-config', { value: JSON.parse(JSON.stringify(store.state.configs)) })
  handleConfig()
})
function handleConfig() {
  if (store.state.configs['自动加载字典'].value) {
    autoLoadDict()
  }
}
