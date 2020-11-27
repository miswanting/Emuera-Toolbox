const { app, BrowserWindow, dialog, Menu, ipcMain } = require('electron')
const { readdirSync, statSync, readFileSync, existsSync, mkdirSync, writeFileSync } = require('fs')
const { encode, decode } = require('iconv-lite')
const { dirname, join, extname } = require('path')
const { analyse } = require('chardet')
const peg = require('pegjs')
const { execFileSync } = require('child_process')
const { Worker } = require('worker_threads')
const isDev = require('electron-is-dev')
const { safeDump, safeLoad } = require('js-yaml')
const CONFIG_PATH = 'config.yml'
let win
function init() {
  createWindow()
}
function loadConfig() {
  if (existsSync(CONFIG_PATH)) {
    const config = safeLoad(readFileSync(CONFIG_PATH))
    win.webContents.send('set-config', { value: config })
  } else {
    win.webContents.send('save-config')
  }
}
function createWindow() {
  win = new BrowserWindow({
    show: false,
    width: 800,
    height: 600,
    backgroundColor: '#333639',
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.once('ready-to-show', () => {
    win.show()
    loadConfig()
  })
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
                initRootFolder(value.filePaths[0])
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
                initRootFolder(value.filePaths[0])
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
              const b = win.getBounds()
              const view = new BrowserWindow({
                show: false,
                x: b.x - 300,
                y: b.y,
                width: 300,
                height: 600,
                parent: win,
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
              win.webContents.send('enter-route', {
                value: '/config'
              })
            }
          },
          { type: 'separator' },
          { role: 'close' }
        ]
      },
      { role: 'editMenu' },
      { role: 'viewMenu' },
      { role: 'windowMenu' },
      {
        role: 'help',
        submenu: [
          {
            label: 'Help',
            accelerator: 'F1',
            click: async () => {
              const b = win.getBounds()
              const view = new BrowserWindow({
                show: false,
                x: b.x + b.width,
                y: b.y,
                width: 300,
                height: 600,
                parent: win,
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
                parent: win,
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
  win.loadFile('src/index.html')
  if (isDev) {
    win.webContents.openDevTools()
  }
}
app.whenReady().then(init)
ipcMain.on('save-config', (e, data) => {
  writeFileSync(CONFIG_PATH, safeDump(data.value))
})
ipcMain.on('auto-load-dict', (e) => {
  if (existsSync('dic')) {

  }
})
function initRootFolder(exePath) {
  const executableFilePath = exePath
  const rootFolderPath = dirname(executableFilePath)
  // check fs
  if (!existsSync(join(rootFolderPath, 'csv'))) mkdirSync(join(rootFolderPath, 'csv'))
  if (!existsSync(join(rootFolderPath, 'erb'))) mkdirSync(join(rootFolderPath, 'erb'))
  if (!existsSync(join(rootFolderPath, 'emuera.config'))) {
    const p = execFileSync(executableFilePath)
    setTimeout(() => {
      p.kill()
    }, 100)
  }
  setTimeout(() => {
    scanRootFolder(executableFilePath)
  }, 200)
}
function scanRootFolder(exePath) {
  const executableFilePath = exePath
  const rootFolderPath = dirname(executableFilePath)
  function getAllFilePaths(path, name = '') {
    const entrys = {
      name: name,
      type: 'folder',
      path: path,
      folders: {},
      files: {}
    }
    readdirSync(path).forEach(function (entryName) {
      const entryPath = join(path, entryName)
      const stat = statSync(entryPath)
      if (stat.isDirectory()) {
        entrys.folders[entryName] = getAllFilePaths(entryPath, entryName)
      } else {
        entrys.files[entryName] = {
          name: entryName,
          type: 'file',
          ext: extname(entryPath).toLowerCase(),
          path: entryPath,
          encoding: ''
        }
      }
    })
    return entrys
  }
  const structure = getAllFilePaths(rootFolderPath)
  win.webContents.send('open-root-folder', {
    structure: structure
  })
  function getFileList(struct, path) {
    const fileLists = []
    for (const key in struct.files) {
      if (struct.files.hasOwnProperty(key)) {
        fileLists.push([[].concat(path, [struct.files[key].name]), struct.files[key].path])
      }
    }
    for (const key in struct.folders) {
      if (struct.folders.hasOwnProperty(key)) {
        fileLists.push(...getFileList(struct.folders[key], [].concat(path, [struct.folders[key].name])))
      }
    }
    return fileLists
  }
  const fileList = getFileList(structure, [])
  let encodingWorker
  if (existsSync('./src/workers/encoding.js')) {
    encodingWorker = new Worker('./src/workers/encoding.js')
  } else {
    encodingWorker = new Worker('./resources/app/src/workers/encoding.js')
  }
  encodingWorker.postMessage({
    type: 'caculate-encoding',
    data: {
      structure: structure,
      fileList: fileList
    }
  })
  encodingWorker.on('message', pkg => {
    function setFileEncoding(path, struct, encoding) {
      if (path.length === 0) {
        struct.encoding = encoding
      } else if (path.length === 1) {
        setFileEncoding(path.slice(1, path.length), struct.files[path[0]], encoding)
      } else {
        setFileEncoding(path.slice(1, path.length), struct.folders[path[0]], encoding)
      }
    }
    setFileEncoding(pkg.data.path, structure, pkg.data.encoding)
    win.webContents.send('update-file-encoding', pkg.data)
  })
  ipcMain.on('open-file', (e, data) => {
    const ext = extname(data.path).toLowerCase()
    if (ext !== '.exe') {
      const f = readFileSync(data.path)
      let encoding = data.encoding
      if (encoding === '') {
        const pList = analyse(f)
        for (let j = 0; j < pList.length; j++) {
          if (['UTF-8', 'Shift_JIS'].indexOf(pList[j].name) !== -1) {
            encoding = pList[j].name
            break
          }
        }
      }
      const content = decode(f, encoding)
      e.reply('open-file', content)
      const pegFilePath = `src/grammars/${ext.slice(1, ext.length)}.pegjs`
      if (existsSync(pegFilePath)) {
        const configParser = peg.generate(decode(readFileSync(pegFilePath), 'UTF-8'))
        e.reply('update-file-ast', configParser.parse(content))
      } else if (existsSync(`./resources/app/src/grammars/${ext.slice(1, ext.length)}.pegjs`)) {
        const configParser = peg.generate(decode(readFileSync(`./resources/app/src/grammars/${ext.slice(1, ext.length)}.pegjs`), 'UTF-8'))
        e.reply('update-file-ast', configParser.parse(content))
      }
    }
  })
}
