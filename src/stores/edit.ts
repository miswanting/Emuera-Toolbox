export default {
  namespaced: true,
  state: () => ({
    dark: false
  }),
  mutations: {
    toggle(state: any) {
      state.dark = !state.dark
      if (state.dark) {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove('dark')
      }
    }
  }
}