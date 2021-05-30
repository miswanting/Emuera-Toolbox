import { screen, app, BrowserWindow, dialog, ipcMain } from 'electron'
import { parse, join, extname } from 'path'
import { readdirSync, statSync } from 'fs'
app.whenReady().then(() => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const win = new BrowserWindow({
    width: width * 0.8,
    height: height * 0.8,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  win.webContents.openDevTools()
  win.loadURL('http://localhost:3000/')
  // win.loadFile('dist/index.html')

  ipcMain.handle('openEmueraExec', async () => {
    const result = await dialog.showOpenDialog(win, {
      title: 'Locate Emuera Executable File',
      filters: [{
        name: 'Emuera Executable File',
        extensions: ['exe']
      }],
      properties: ['openFile']
    }).then(value => {
      if (!value.canceled) {
        if (value.filePaths.length === 1) {
          const path = parse(value.filePaths[0])
          const node = {
            root: path.dir,
            exe: path.base
          }
          const projectFS = generateProjectFS(node.root)
          console.log(projectFS);
          win.webContents.send('setProjectFS', projectFS)
        }
      }
    })
    return result
  })
  ipcMain.handle('minWin', () => {
    if (win.isMinimizable()) { win.minimize() }
  })
  ipcMain.handle('maxWin', () => {
    if (win.isMaximized()) { win.unmaximize() }
    else { win.maximize() }
  })
  ipcMain.handle('closeWin', () => {
    win.close()
  })
  ipcMain.handle('toggleDevTools', () => {
    win.webContents.toggleDevTools()
  })
})
function generateProjectFS(rootPath) {
  function generateFolderHierarchyRecursively(folderPath, name = '') {
    const folderMeta = {
      name: name, // folder name
      type: 'folder',
      path: folderPath,
      folders: {},
      files: {}
    }
    readdirSync(folderPath).forEach(function (entryName) {
      const entryPath = join(folderPath, entryName) // Current Working Directory
      const entryStat = statSync(entryPath)
      if (entryStat.isDirectory()) {
        folderMeta.folders[entryName] = generateFolderHierarchyRecursively(entryPath, entryName)
      } else {
        const fileMeta = {
          name: entryName, // file name
          type: 'file',
          ext: extname(entryPath).toLowerCase(),
          path: entryPath,
          loadStatus: 'Pending'
        }
        folderMeta.files[entryName] = fileMeta
      }
    })
    return folderMeta
  }
  return generateFolderHierarchyRecursively(rootPath)
}