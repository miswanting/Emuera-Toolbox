routes.push({
  path: '/config',
  component: {
    methods: {
      setConfig(key, value) {
        this.$store.state.configs[key] = value
        require('electron').ipcRenderer.send('save-config', { value: JSON.parse(JSON.stringify(this.$store.state.configs)) })
      },
      setDictConfig() {
        this.$store.state.configs[key] = value
        require('electron').ipcRenderer.send('save-config', { value: JSON.parse(JSON.stringify(this.$store.state.configs)) })
      }
    },
    render() {
      const configs = []
      for (const key in this.$store.state.configs) {
        if (this.$store.state.configs.hasOwnProperty(key)) {
          const value = this.$store.state.configs[key];
          const l = [
            Vue.h('div', {}, key),
            Vue.h('div', { class: 'spacer' })
          ]
          if (typeof value === 'boolean') {
            l.push(Vue.h('div', { class: { btn: true, active: value }, onClick: () => { this.setConfig(key, true) } }, '是'))
            l.push(Vue.h('div', { class: { btn: true, active: !value }, onClick: () => { this.setConfig(key, false) } }, '否'))
          } else if (key === 'Language') {
            l.push(Vue.h('div', { class: { btn: true }, onClick: () => { this.setDictConfig() } }, ISO6391.getNativeName(value)))
          }
          configs.push(Vue.h('div', { class: 'config-item' }, l))
        }
      }
      return Vue.h('main', {
        class: 'config'
      }, [
        Vue.h(VueRouter.RouterView),
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
        }, configs)
      ])
    }
  },
  children: [{
    path: 'language',
    component: {
      render() {
        return Vue.h('div', {
          class: ''
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
          }, configs)
        ])
      }
    }
  }]
})
components.push([
  'language'
])