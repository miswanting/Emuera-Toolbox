routes.push({
  path: '/config-editor',
  component: {
    methods: {},
    mounted() {
      // this.$nextTick(() => {
      //   monacoRequire.config({ paths: { vs: '../node_modules/monaco-editor/dev/vs' } })
      //   monacoRequire(['vs/editor/editor.main'], function () {
      //     const editor = monaco.editor.create(document.querySelector('.container'), {
      //       value: this.$store.state.currentFile.content
      //     })
      //   })
      // })
    },
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
            content.push(Vue.h('div', {}, [
              Vue.h('span', {
                style: {
                  color: 'darkcyan'
                }
              }, element.token),
              Vue.h('span', {}, ' → '),
              Vue.h('span', {
                style: {
                  color: 'orange'
                }
              }, JSON.stringify(element.value))
            ]))
          }
        })
      }
      return Vue.h('main', {
        class: 'editor'
      }, [
        Vue.h('div', {
          class: 'title-bar'
        }, [
          Vue.h('div', { class: 'title', onClick: () => { router.back() } }, 'Editor'),
          Vue.h('div', { innerHTML: '&emsp;' }),
          Vue.h('div', { class: 'file-name' }, this.$store.state.currentFile.name),
          Vue.h('div', { innerHTML: '&emsp;' }),
          Vue.h('div', { class: 'encoding' }, this.$store.state.currentFile.encoding),
          Vue.h('div', { class: 'spacer' })
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
