import { setTransitionHooks } from "@vue/runtime-core";
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
    locateEmueraExe({ state }: any) {
      ipcRenderer.send('projectInit')
      ipcRenderer.on('setProjectFS', (e, value) => {
        state.project = value
        state.isLocated = true
        window.router.push('./explorer')
      })
      ipcRenderer.on('setFileEncoding', (e, path, encoding) => {
        console.log(path, encoding);
        function search(node: any) {
          for (const key in node.files) {
            if (Object.prototype.hasOwnProperty.call(node.files, key)) {
              if (node.files[key].path === path) {
                if (node.files[key].loadStatus === 0) {
                  node.files[key].loadStatus = 1
                }
                node.files[key].encoding = encoding
                console.log(node.files[key]);
                return
              }
            }
          }
          for (const key in node.folders) {
            search(node.folders[key])
          }
        }
        search(state.project)
      })
    },
  }
}