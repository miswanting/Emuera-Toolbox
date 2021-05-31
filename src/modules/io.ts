import { screen, app, BrowserWindow, dialog, ipcMain } from 'electron'
import { parse, join, extname } from 'path'
import { readdirSync, statSync, readFileSync } from 'fs'
import { analyse } from 'chardet'
import { decode } from 'iconv-lite'
let win: any = null
export function register(iwin: BrowserWindow) {
  win = iwin
  ipcMain.handle('minWin', minWin)
  ipcMain.handle('maxWin', maxWin)
  ipcMain.handle('closeWin', closeWin)
  ipcMain.handle('toggleDevTools', toggleDevTools)
  ipcMain.handle('locateEmueraExe', locateEmueraExe)
  ipcMain.on('readFile', readFile)
  ipcMain.on('projectInit', projectInit)
}
function minWin() {
  if (win.isMinimizable()) win.minimize()
}
function maxWin() {
  if (win.isMaximized()) win.unmaximize()
  else win.maximize()
}
function closeWin() { win.close() }
function toggleDevTools() { win.webContents.toggleDevTools() }
function readFile() { }
function projectInit() {
  const projectRoot = setProjectRoot();
  const { filePaths, projectFS } = generateProjectFS(projectRoot);
  win.webContents.send('setProjectFS', projectFS)
  scanFileEncoding(filePaths);
}
function setProjectRoot() {
  const filePaths = dialog.showOpenDialogSync(win, {
    title: 'Locate Emuera Executable File',
    filters: [{
      name: 'Emuera Executable File',
      extensions: ['exe']
    }],
    properties: ['openFile']
  })
  if (filePaths) {
    return parse(filePaths[0]).dir
  }
  return ''
}
function generateProjectFS(root: string) {
  let filePaths: string[] = []
  let projectFS = {}
  function scanFolder(folderPath: string, name: null | string = null) {
    const folderMeta = {
      name, // folder name
      type: 'folder',
      path: folderPath,
      folders: {},
      files: {}
    }
    const entryNames = readdirSync(folderPath)
    entryNames.forEach(function (entryName) {
      const entryPath = join(folderPath, entryName) // Current Working Directory
      const entryStat = statSync(entryPath)
      if (entryStat.isFile()) {
        const fileMeta = {
          name: entryName, // file name
          type: 'file',
          ext: extname(entryPath).toLowerCase(),
          path: entryPath,
          loadStatus: 0,
        }
        filePaths.push(entryPath);
        (folderMeta as any).files[entryName] = fileMeta
      }
    })
    entryNames.forEach(function (entryName) {
      const entryPath = join(folderPath, entryName) // Current Working Directory
      const entryStat = statSync(entryPath)
      if (entryStat.isDirectory()) {
        (folderMeta as any).folders[entryName] = scanFolder(entryPath, entryName)
      }
    })
    return folderMeta
  }
  projectFS = scanFolder(root)
  return { filePaths: filePaths, projectFS }
}
function scanFileEncoding(filePaths: string[]) {
  filePaths.forEach(filePath => {
    const file = readFileSync(filePath)
    const predicts = analyse(file)
    for (let i = 0; i < predicts.length; i++) {
      if (['UTF-8', 'Shift_JIS'].indexOf(predicts[i].name) !== -1) {
        win.webContents.send('setFileEncoding', filePath, predicts[i].name)
        break
      }
    }
  });
}
/**
 * # Deprecated
 */
function locateEmueraExe() {
  const filePaths = dialog.showOpenDialogSync(win, {
    title: 'Locate Emuera Executable File',
    filters: [{
      name: 'Emuera Executable File',
      extensions: ['exe']
    }],
    properties: ['openFile']
  })
  if (filePaths && filePaths.length === 1) {
    const projectFS = generateProjectFS(parse(filePaths[0]).dir)
    // setTimeout(detectFileEncoding, 0, projectFS)
    const detectFileEncoding = new Promise((resolve, reject) => {
    });
    return projectFS
  }
}
// function generateProjectFS(rootPath: string) {
//   function generateFolderHierarchyRecursively(folderPath: string, name = '') {
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