import { screen, app, BrowserWindow, dialog, ipcMain } from 'electron'
import { parse, join, extname } from 'path'
import { readdirSync, statSync, readFileSync } from 'fs'
import { analyse } from 'chardet'
import { decode } from 'iconv-lite'
import { register } from './modules/io'
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
  // win.loadURL('http://localhost:3000/')
  win.loadFile('dist/index.html')

  register(win)
  // ipcMain.handle('minWin', () => {
  //   if (win.isMinimizable()) { win.minimize() }
  // })
  // ipcMain.handle('maxWin', () => {
  //   if (win.isMaximized()) { win.unmaximize() }
  //   else { win.maximize() }
  // })
  // ipcMain.handle('closeWin', () => {
  //   win.close()
  // })
  // ipcMain.handle('toggleDevTools', () => {
  //   win.webContents.toggleDevTools()
  // })
  // ipcMain.handle('locateEmueraExe', () => {
  //   const filePaths = dialog.showOpenDialogSync(win, {
  //     title: 'Locate Emuera Executable File',
  //     filters: [{
  //       name: 'Emuera Executable File',
  //       extensions: ['exe']
  //     }],
  //     properties: ['openFile']
  //   })
  //   if (filePaths && filePaths.length === 1) {
  //     const projectFS = generateProjectFS(parse(filePaths[0]).dir)
  //     // setTimeout(detectFileEncoding, 0, projectFS)
  //     const detectFileEncoding = new Promise((resolve, reject) => {
  //     });
  //     return projectFS
  //   }
  // })
  // ipcMain.on('readFile', (e, pathPiece) => {
  //   console.log(pathPiece);
  // })
})

// function generateProjectFS(rootPath) {
//   function generateFolderHierarchyRecursively(folderPath, name = '') {
//     const folderMeta = {
//       name: name, // folder name
//       type: 'folder',
//       path: folderPath,
//       folders: {},
//       files: {}
//     }
//     readdirSync(folderPath).forEach(function (entryName) {
//       const entryPath = join(folderPath, entryName) // Current Working Directory
//       const entryStat = statSync(entryPath)
//       if (entryStat.isDirectory()) {
//         folderMeta.folders[entryName] = generateFolderHierarchyRecursively(entryPath, entryName)
//       } else {
//         const fileMeta = {
//           name: entryName, // file name
//           type: 'file',
//           ext: extname(entryPath).toLowerCase(),
//           path: entryPath,
//           loadStatus: 'Pending'
//         }
//         folderMeta.files[entryName] = fileMeta
//       }
//     })
//     return folderMeta
//   }
//   return generateFolderHierarchyRecursively(rootPath)
// }
// function detectFileEncoding(fs) {
//   let currentNode = fs
//   for (const key in currentNode.files) {
//     if (Object.prototype.hasOwnProperty.call(currentNode.files, key)) {
//       const element = currentNode.files[key];
//       if (element.ext !== 'exe') {
//         const file = readFileSync(element.path)
//         if (!element.encoding) {
//           const predicts = analyse(file)
//           for (let i = 0; i < predicts.length; i++) {
//             if (['UTF-8', 'Shift_JIS'].indexOf(predicts[i].name) !== -1) {
//               element.encoding = predicts[i].name
//               break
//             }
//           }
//         }
//         element.raw = decode(file, element.encoding)
//       }
//     }
//   }
//   for (let i = 0; i < currentNode.length; i++) {
//     const element = array[i];
//   }
// }