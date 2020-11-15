routes.push({
  path: '/config-editor',
  component: {
    methods: {},
    mounted() { },
    render() {
      let content = []
      if (!this.$store.state.currentFile.ast) {
        if (this.$store.state.currentFile.content) {
          content = this.$store.state.currentFile.content.split('\n').map(line => {
            return Vue.h('div', {}, line)
          })
        }
      } else {
        this.$store.state.currentFile.ast.forEach(element => {
          if (element.type === 'Config') {
            const item = [
              Vue.h('div', {
                style: {
                  color: 'darkcyan'
                }
              }, element.name),
              Vue.h('div', { class: 'spacer' })
            ]
            console.log(element);
            if (element.value.type === 'Bool') {
              item.push(Vue.h('div', {
                class: { com: true, active: element.value.value }
              }, '是'))
              item.push(Vue.h('div', {
                class: { com: true, active: !element.value.value }
              }, '否'))
            } else if (element.value.type === 'Str') {
              item.push(Vue.h('div', {
                class: { com: true }
              }, element.value.value.toString()))
            } else if (element.value.type === 'Array') {
              for (let i = 0; i < element.value.value.length; i++) {
                item.push(Vue.h('div', {
                  class: { com: true }
                }, element.value.value[i].value))
              }
            } else if (element.value.type === 'Int') {
              item.push(Vue.h('div', {
                class: { com: true }
              }, element.value.value))
            }
            content.push(Vue.h('div', { class: 'config' }, item))
          }
        })
      }
      return Vue.h('main', {
        class: 'config-editor'
      }, [
        Vue.h('div', {
          class: 'title-bar'
        }, [
          Vue.h('div', { class: 'title', onClick: () => { router.back() } }, 'Editor'),
          Vue.h('div', { innerHTML: '&emsp;' }),
          Vue.h('div', { class: 'file-name' }, this.$store.state.currentFile.name),
          Vue.h('div', { innerHTML: '&emsp;' }),
          Vue.h('div', { class: 'encoding' }, this.$store.state.currentFile.encoding),
          Vue.h('div', { class: 'spacer' }),
          Vue.h('abbr', { title: 'New File.' }, Vue.h('i', { class: 'fas fa-floppy-o fa-xs fa-fw' }))
        ]),
        Vue.h('div', {
          class: 'container',
          contenteditable: true
        }, content
        )
      ])
    }
  }
})
