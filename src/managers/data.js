window.store = Vuex.createStore({
  state() {
    return {
      configs: {
        自动加载字典: {
          type: 'Bool', value: true
        },
        字典设置: {
          type: 'DictConfig', author: '佚名', createTime: '', modifyTime: ''
        }
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
