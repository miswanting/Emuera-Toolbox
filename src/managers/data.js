window.store = Vuex.createStore({
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
      folderStructure: {},
      currentFile: {
        content: null,
        ast: null
      }
    }
  }
})
