routes.push({
  path: '/config',
  component: {
    methods: {
      setConfig(key, value) {
        this.$store.state.configs[key].value = value
        require('electron').ipcRenderer.send('save-config', { value: JSON.parse(JSON.stringify(this.$store.state.configs)) })
      }
    },
    render() {
      const configs = []
      for (const key in this.$store.state.configs) {
        if (this.$store.state.configs.hasOwnProperty(key)) {
          const config = this.$store.state.configs[key];
          const l = [
            Vue.h('div', {}, key),
            Vue.h('div', { class: 'spacer' })
          ]
          if (config.type === 'Bool') {
            l.push(Vue.h('div', { class: { btn: true, active: config.value }, onClick: () => { this.setConfig(key, true) } }, '是'))
            l.push(Vue.h('div', { class: { btn: true, active: !config.value }, onClick: () => { this.setConfig(key, false) } }, '否'))
          }
          configs.push(Vue.h('div', { class: 'config-item' }, l))
        }
      }
      // for (let i = 0; i < this.$store.state.configs.length; i++) {
      //   const config = this.$store.state.configs[i]
      //   const l = [
      //     Vue.h('div', {}, config.name),
      //     Vue.h('div', { class: 'spacer' })
      //   ]
      //   if (config.type === 'Bool') {
      //     l.push(Vue.h('div', { class: { btn: true, active: config.value }, onClick: () => { this.setConfig(i, true) } }, '是'))
      //     l.push(Vue.h('div', { class: { btn: true, active: !config.value }, onClick: () => { this.setConfig(i, false) } }, '否'))
      //   }
      //   configs.push(Vue.h('div', { class: 'config-item' }, l))
      // }
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
        }, configs)
      ])
    }
  }
})
