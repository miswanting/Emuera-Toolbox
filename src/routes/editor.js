routes.push({
  path: '/editor',
  component: {
    methods: {
      back() { router.back() }
    },
    mounted() { },
    render() {
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
        Vue.h(VueRouter.RouterView)
      ])
    }
  },
  children: [
    {
      path: 'config',
      component: {
        methods: {},
        mounted() { console.log(123) },
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
                console.log(element)
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
          return Vue.h('div', {
            class: 'container',
            contenteditable: true
          }, content)
        }
      }
    },
    {
      path: 'csv',
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
              if (element.type === 'Array') {
                content.push(Vue.h('div', {}, [
                  Vue.h('span', {
                    style: {
                      color: 'orange'
                    }
                  }, JSON.stringify(element))
                ]))
              } else if (element.type === 'Comment') {
                content.push(Vue.h('div', {}, [
                  Vue.h('span', {
                    style: {
                      color: '#060'
                    }
                  }, ';' + element.value)
                ]))
              } else if (element.type === 'BlankLines') {
                for (let i = 0; i < element.type.value; i++) {
                  content.push(Vue.h('div', {}, Vue.h('br')))
                }
              } else {
                content.push(Vue.h('div', {}, [
                  Vue.h('span', {
                    style: {
                      color: '#fff'
                    }
                  }, JSON.stringify(element))
                ]))
              }
            })
          }
          return Vue.h('div', {
            class: 'container',
            contenteditable: true
          }, content)
        }
      }
    },
    {
      path: 'erh',
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
              if (element.type === 'Dim') {
                content.push(Vue.h('div', {}, [
                  Vue.h('span', {
                    style: {
                      color: 'orange'
                    }
                  }, JSON.stringify(element))
                ]))
              } else if (element.type === 'Dims') {
                content.push(Vue.h('div', {}, [
                  Vue.h('span', {
                    style: {
                      color: 'orange'
                    }
                  }, JSON.stringify(element))
                ]))
              } else if (element.type === 'Define') {
                content.push(Vue.h('div', {}, [
                  Vue.h('span', {
                    style: {
                      color: 'orange'
                    }
                  }, JSON.stringify(element))
                ]))
              } else if (element.type === 'Comment') {
                content.push(Vue.h('div', {}, [
                  Vue.h('span', {
                    style: {
                      color: '#060'
                    }
                  }, ';' + element.value)
                ]))
              } else if (element.type === 'BlankLines') {
                for (let i = 0; i < element.type.value; i++) {
                  content.push(Vue.h('div', {}, Vue.h('br')))
                }
              } else {
                content.push(Vue.h('div', {}, [
                  Vue.h('span', {
                    style: {
                      color: '#fff'
                    }
                  }, JSON.stringify(element))
                ]))
              }
            })
          }
          return Vue.h('div', {
            class: 'container',
            contenteditable: true
          }, content)
        }
      }
    },
    {
      path: 'erb',
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
              if (element.type === 'Comment') {
                content.push(Vue.h('div', {}, [
                  Vue.h('span', {
                    style: {
                      color: '#060'
                    }
                  }, ';' + element.value)
                ]))
              } else if (element.type === 'BlankLines') {
                for (let i = 0; i < element.type.value; i++) {
                  content.push(Vue.h('div', {}, Vue.h('br')))
                }
              } else {
                content.push(Vue.h('div', {}, [
                  Vue.h('span', {
                    style: {
                      color: '#fff'
                    }
                  }, JSON.stringify(element))
                ]))
              }
            })
          }
          return Vue.h('div', {
            class: 'container',
            contenteditable: true
          }, content)
        }
      }
    }
  ]
})
