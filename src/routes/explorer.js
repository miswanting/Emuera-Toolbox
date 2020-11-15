routes.push({
  path: '/explorer',
  component: {
    methods: {
      enterNewPath(pathList) {
        this.$store.state.currentPath = pathList
      },
      entryClick(entry) {
        if (entry.type === 'folder') {
          this.$store.state.currentPath.push(entry.name)
        } else if (entry.type === 'file') {
          this.$store.state.currentFile = entry
          this.$store.state.currentFile.content = ''
          require('electron').ipcRenderer.send('open-file', { path: entry.path, encoding: entry.encoding })
          console.log(entry);
          if (entry.ext === '.config') {
            router.push('/config-editor')
          } else if (entry.ext === '.csv') {
            router.push('/csv-editor')
          } else if (entry.ext === '.erh') {
            router.push('/erh-editor')
          } else if (entry.ext === '.erb') {
            router.push('/erb-editor')
          }
        }
      }
    },
    render() {
      function getFolderEntries(path, structure) {
        if (path.length === 0) {
          return structure
        }
        return getFolderEntries(path.slice(1, path.length), structure.folders[path[0]])
      }
      const entry = getFolderEntries(this.$store.state.currentPath, this.$store.state.folderStructure)
      const display = []
      for (const key in entry.folders) {
        if (entry.folders.hasOwnProperty(key)) {
          display.push(
            Vue.h('div', {
              class: entry.folders[key].type,
              onClick: () => { this.entryClick(entry.folders[key]) }
            }, [
              Vue.h('div', { class: 'name' }, entry.folders[key].name + '/'),
              Vue.h('div', { class: 'spacer' }),
              Vue.h('div', { class: 'loading-status' }, 'Loading: 0/?')
            ])
          )
        }
      }
      for (const key in entry.files) {
        if (entry.files.hasOwnProperty(key)) {
          const ext = require('path').extname(entry.files[key].path).toLowerCase()
          let fileDescription = ''
          if (ext === '.exe') fileDescription = 'EmueraExecutableFile'
          else if (ext === '.config') fileDescription = 'ConfigFile'
          else if (ext === '.csv') fileDescription = 'CSVFile'
          else if (ext === '.erh') fileDescription = 'EraBasicHeaderFile'
          else if (ext === '.erb') fileDescription = 'EraBasicScriptFile'
          display.push(
            Vue.h('div', {
              class: entry.files[key].type,
              onClick: () => { this.entryClick(entry.files[key]) }
            }, [
              Vue.h('div', { class: 'name' }, entry.files[key].name),
              fileDescription === '' ? null : Vue.h('div', { class: 'file-description' }, fileDescription),
              ext === '.exe' ? Vue.h('i', { class: 'fas fa-crosshairs fa-xs', style: { color: 'lime' } }) : entry.files[key].encoding === '' ? loader : Vue.h('div', { class: 'encoding' }, entry.files[key].encoding),
              Vue.h('div', { class: 'spacer' }),
              Vue.h('div', { class: 'loading-status' }, 'Loading: 0%')
            ])
          )
        }
      }
      const pathMenu = []
      pathMenu.push(Vue.h('span', {
        class: 'path-item',
        onClick: () => {
          this.enterNewPath([])
        }
      }, '/'))
      for (let i = 0; i < this.$store.state.currentPath.length; i++) {
        pathMenu.push(Vue.h('span', {
          class: 'path-item',
          onClick: () => {
            this.enterNewPath(this.$store.state.currentPath.slice(0, i + 1))
          }
        }, `${this.$store.state.currentPath[i]}/`))
      }
      return Vue.h('main', {
        class: 'explorer'
      }, [
        Vue.h('div', {
          class: 'title-bar'
        }, [
          Vue.h('div', {
            class: 'title',
            onClick: () => {
              this.enterNewPath(this.$store.state.currentPath.slice(0, Math.max(0, this.$store.state.currentPath.length - 1)))
            }
          }, Vue.h('abbr', { title: 'Return to the parent folder.' }, 'Explorer')),
          Vue.h('div', { innerHTML: '&emsp;' }),
          pathMenu,
          Vue.h('div', { class: 'spacer' }),
          Vue.h('abbr', { title: 'New File.' }, Vue.h('i', { class: 'fas fa-file-medical fa-xs fa-fw' })),
          Vue.h('abbr', { title: 'New Folder.' }, Vue.h('i', { class: 'fas fa-folder-plus fa-xs fa-fw' }))
        ]),
        Vue.h('div', {
          class: 'content'
        }, display)
      ])
    }
  }
})
const loader = Vue.h('svg', {
  width: '30',
  height: '10',
  viewBox: '0 0 30 10'
}, [
  Vue.h('circle', {
    cx: 5,
    cy: 5,
    r: 3,
    fill: 'var(--p)'
  }, Vue.h('animate', {
    attributeName: 'opacity',
    dur: '1s',
    values: '0;1;0',
    repeatCount: 'indefinite',
    begin: '0.1'
  })
  ),
  Vue.h('circle', {
    cx: 15,
    cy: 5,
    r: 3,
    fill: 'var(--p)'
  }, Vue.h('animate', {
    attributeName: 'opacity',
    dur: '1s',
    values: '0;1;0',
    repeatCount: 'indefinite',
    begin: '0.2'
  })
  ),
  Vue.h('circle', {
    cx: 25,
    cy: 5,
    r: 3,
    fill: 'var(--p)'
  }, Vue.h('animate', {
    attributeName: 'opacity',
    dur: '1s',
    values: '0;1;0',
    repeatCount: 'indefinite',
    begin: '0.3'
  })
  )
])
const exeTargetIcon = Vue.h('svg', {
  width: '16',
  height: '16',
  viewBox: '0 0 16 16'
}, [
  Vue.h('circle', {
    cx: 8,
    cy: 8,
    r: 5,
    stroke: 'lime',
    'fill-opacity': 0
  }),
  Vue.h('line', {
    x1: 10,
    y1: 8,
    x2: 16,
    y2: 8,
    stroke: 'lime',
    'stroke-width': 1
  }),
  Vue.h('line', {
    x1: 8,
    y1: 10,
    x2: 8,
    y2: 16,
    stroke: 'lime',
    'stroke-width': 1
  }),
  Vue.h('line', {
    x1: 6,
    y1: 8,
    x2: 0,
    y2: 8,
    stroke: 'lime',
    'stroke-width': 1
  }),
  Vue.h('line', {
    x1: 8,
    y1: 6,
    x2: 8,
    y2: 0,
    stroke: 'lime',
    'stroke-width': 1
  })
])
