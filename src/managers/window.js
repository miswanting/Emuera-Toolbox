import { EventEmitter } from 'events'
import { BrowserWindow, Menu, dialog } from 'electron'
import isDev from 'electron-is-dev'
export default class WindowManager extends EventEmitter {
  constructor(config = null) {
    super()
    if (config) {
      this.config = config
    } else {
      this.config = {
        width: 800,
        height: 600,
        show: false,
        useContentSize: true,
        webPreferences: {
          enableRemoteModule: true,
          nodeIntegration: true,
          nodeIntegrationInWorker: true
        }
      }
    }
  }

  start() {
    this.createMainWindow()
    if (isDev) {
      this.prepareDevelopEnviroment()
    }
  }

  createMainWindow() {
    this.win = new BrowserWindow(this.config)
    this.win.once('ready-to-show', () => {
      this.win.show()
    })
    this.generateMenu()
    this.win.loadFile('dist/index.html')
    this.win.webContents.session.clearCache()
  }

  prepareDevelopEnviroment() {
    const { default: installExtension, VUEJS_DEVTOOLS } = require('electron-devtools-installer')
    installExtension(VUEJS_DEVTOOLS)
      .then((name) => console.log(`Extension Added!: ${name}`))
      .catch((err) => {
        console.log('An Error Occurred: ', err)
        console.log('But PLEASE DO NOT WORRY!')
        console.log('It`s FINE! It`s NOT IMPORTANT at all!')
      })
    this.win.webContents.openDevTools()
  }

  generateMenu() {
    Menu.setApplicationMenu(
      Menu.buildFromTemplate([
        {
          label: 'File',
          submenu: [
            {
              label: 'New',
              accelerator: 'CmdOrCtrl+N',
              click: async () => {
                const value = await dialog.showOpenDialog({
                  title: 'Locate Emuera Executable File',
                  filters: [{
                    name: 'Emuera Executable File',
                    extensions: ['exe']
                  }],
                  properties: ['openFile']
                })
                if (!value.canceled) {
                  this.emit('exec', { type: 'loadProjectFolder', data: value.filePaths[0] })
                }
              }
            },
            {
              label: 'Open',
              accelerator: 'CmdOrCtrl+O',
              click: async () => {
                const value = await dialog.showOpenDialog({
                  title: 'Locate Emuera Executable File',
                  filters: [{
                    name: 'Emuera Executable File',
                    extensions: ['exe']
                  }],
                  properties: ['openFile']
                })
                if (!value.canceled) {
                  this.emit('exec', { type: 'loadProjectFolder', data: value.filePaths[0] })
                }
              }
            },
            { type: 'separator' },
            {
              label: 'Save',
              accelerator: 'CmdOrCtrl+S'
            },
            {
              label: 'Save As',
              accelerator: 'CmdOrCtrl+Shift+S'
            },
            { type: 'separator' },
            {
              label: 'Import',
              click: async () => {
                const b = this.win.getBounds()
                const view = new BrowserWindow({
                  show: false,
                  x: b.x - 300,
                  y: b.y,
                  width: 300,
                  height: 600,
                  parent: this.win,
                  webPreferences: {
                    nodeIntegration: true
                  }
                })
                view.loadFile('src/help/index.html')
                view.once('ready-to-show', view.show)
              }
            },
            { label: 'Export' },
            { type: 'separator' },
            {
              label: 'Config',
              click: async () => {
                this.win.webContents.send('enter-route', {
                  value: '/config'
                })
              }
            },
            { type: 'separator' },
            { role: 'close' }
          ]
        },
        { role: 'editMenu' },
        {
          label: 'View',
          submenu: [
            {
              label: 'Dictionary Manager',
              click: async () => {
                this.emit('exec', { type: 'enterRoute', data: '/dm' })
              }
            },
            { type: 'separator' },
            { role: 'reload' },
            { role: 'forceReload' },
            { role: 'toggleDevTools' },
            { type: 'separator' },
            { role: 'resetZoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
          ]
        },
        { role: 'windowMenu' },
        {
          role: 'help',
          submenu: [
            {
              label: 'Help',
              accelerator: 'F1',
              click: async () => {
                const b = this.win.getBounds()
                const view = new BrowserWindow({
                  show: false,
                  x: b.x + b.width,
                  y: b.y,
                  width: 300,
                  height: 600,
                  parent: this.win,
                  webPreferences: {
                    nodeIntegration: true
                  }
                })
                view.loadFile('src/help/index.html')
                view.once('ready-to-show', view.show)
              }
            },
            { type: 'separator' },
            { label: 'Tutorials' },
            { label: 'Documentation' },
            { type: 'separator' },
            { label: 'Check Updates' },
            {
              label: 'About',
              click: async () => {
                const view = new BrowserWindow({
                  show: false,
                  width: 400,
                  height: 300,
                  parent: this.win,
                  webPreferences: {
                    nodeIntegration: true
                  }
                })
                view.loadFile('src/help/index.html')
                view.once('ready-to-show', view.show)
              }
            }
          ]
        }
      ])
    )
  }
}
