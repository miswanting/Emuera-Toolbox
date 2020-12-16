import { EventEmitter } from 'events'
import { BrowserWindow, ipcMain, ipcRenderer } from 'electron'
export default class NetManager extends EventEmitter {
  constructor(target) {
    super()
    this.target = target
    switch (this.target) {
      case 'main':
        this.core = new ToMain()
        break
      case 'renderer':
        this.core = new ToRenderer()
        break
      default:
        break
    }
    this.recv = (data) => {
      console.log(`Recv: ${data}`);
      this.emit('recv', data)
    }
    this.core.on('recv', this.recv)
  }

  start() { this.core.start() }
  send(data) {
    console.log(`Send: ${data}`);
    this.core.send(data)
  }
}
class ToMain extends EventEmitter {
  constructor() {
    super()
    ipcRenderer.on('data', (e, data) => { this.recv(data) })
  }

  start() { }
  send(data) { ipcRenderer.send('data', data) }
  recv(data) { this.emit('recv', data) }
}
class ToRenderer extends EventEmitter {
  constructor() {
    super()
    ipcMain.on('data', (e, data) => { this.recv(data) })
  }

  start() { }
  send(data) { BrowserWindow.getAllWindows()[0].webContents.send('data', data) }
  recv(data) { this.emit('recv', data) }
}
