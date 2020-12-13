// import { app, BrowserWindow, dialog, Menu, ipcMain } from 'electron'
// import { readdirSync, statSync, readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs'
// import { encode, decode } from 'iconv-lite'
// import { dirname, join, extname } from 'path'
// import { analyse } from 'chardet'
// import { generate } from 'pegjs'
// import { execFileSync } from 'child_process'
// import { Worker } from 'worker_threads'
// import isDev from 'electron-is-dev'
// import { safeDump, safeLoad } from 'js-yaml'
import AppManager from './managers/app'
import WindowManager from './managers/window'
import NetManager from './managers/net'
import TaskManager from './managers/task'
export default class MainManager {
  constructor () {
    this.CONFIG_PATH = 'config.yml'
    this.app = new AppManager()
    this.win = new WindowManager({
      width: 800,
      height: 600,
      show: false,
      useContentSize: true,
      webPreferences: {
        enableRemoteModule: true,
        nodeIntegration: true,
        nodeIntegrationInWorker: true
      }
    })
    this.toRenderer = new NetManager('renderer')
    this.task = new TaskManager()
    this.app.once('ready', () => { this.start() })
    this.app.once('window-all-closed', () => { this.app.quit() })
    this.exec = (data) => { this.task.exec(data) }
    this.toRenderer.on('recv', this.exec)
    this.win.on('exec', this.exec)
    this.task.on('send', (pkg) => { this.toRenderer.send(pkg) })
  }

  start () {
    this.win.start()
  }
}
const main = new MainManager()
