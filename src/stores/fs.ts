import { ipcRenderer } from "electron";

export default {
  namespaced: true,
  state: () => ({
    isLocated: false,
    emueraExePath: '',
    project: {}
  }),
  mutations: {
  },
  actions: {
    openEmueraExec({ state }: any) {
      ipcRenderer.invoke('openEmueraExec').then(value => {
        // if (!value.canceled) {
        //   console.log(value.filePaths);
        //   if (value.filePaths.length === 1) {
        //     state.emueraExePath = value.filePaths[0]
        //     state.isLocated = true
        //   }
        // }
      })
    },
    setProjectFS({ state }, value) {
      state.project = value
      window.router.push('./explorer')
    }
  }
}