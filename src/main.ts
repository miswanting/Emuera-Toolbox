import { app, BrowserWindow, screen } from 'electron'
import { register } from './modules/io'

app.whenReady().then(function () {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const window = new BrowserWindow({
    width: width * 0.8,
    height: height * 0.8,
  })
  window.webContents.openDevTools()
  window.loadFile('./dist/index.html')

  register(window)
})