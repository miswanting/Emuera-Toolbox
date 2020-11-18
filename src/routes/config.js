routes.push({
  path: '/config',
  component: {
    render() {
      return Vue.h('main', {
        class: 'config'
      }, [
        Vue.h('div', {
          class: 'title-bar'
        }, [
          Vue.h('div', {
            class: 'title',
            onClick: () => { router.back() }
          }, Vue.h('abbr', { title: 'Return' }, 'Config')),
        ]),
        Vue.h('div', {
          class: 'container'
        }, [])
      ])
    }
  }
})
