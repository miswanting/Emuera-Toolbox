routes.push({
  path: '/',
  component: {
    render () {
      return Vue.h('main', {
        class: 'idle'
      }, [
        Vue.h('div', {}, [
          Vue.h('h1', { class: 'title' }, 'Emuera Toolbox'),
          Vue.h('div', { class: 'msg' }, 'New or Open a Game Folder to continue...')
        ])
      ])
    }
  }
})
