window.store = Vuex.createStore({
  state() {
    return {
      currentPath: [],
      folderStructure: {},
      currentFile: {
        content: null,
        ast: null
      }
    }
  }
})