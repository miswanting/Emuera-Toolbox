const { parentPort } = require('worker_threads')
const { readdirSync, statSync, existsSync, mkdirSync, readFileSync } = require('fs')
const { dirname, join, extname } = require('path')
const { execFileSync } = require('child_process')
const { analyse } = require('chardet')
parentPort.on('message', pkg => {
  if (pkg.type === 'loadProjectFolder') {
    const exePath = pkg.data
    initProject(exePath).then(rootPath => {
      const projectHierarchy = generateProjectHierarchy(rootPath)
      parentPort.postMessage({ type: 'projectHierarchy', data: projectHierarchy })
      detectFileEncodings(projectHierarchy)
    })
  }
})
async function initProject (exePath) {
  const rootPath = dirname(exePath)
  // check fs
  if (!existsSync(join(rootPath, 'csv'))) mkdirSync(join(rootPath, 'csv'))
  if (!existsSync(join(rootPath, 'erb'))) mkdirSync(join(rootPath, 'erb'))
  if (!existsSync(join(rootPath, 'emuera.config'))) {
    const p = execFileSync(exePath)
    function killExe (p) {
      return new Promise(resolve => {
        setTimeout(() => {
          p.kill()
          resolve()
        }, 100)
      })
    }
    await killExe(p)
  }
  return rootPath
}
function generateProjectHierarchy (rootPath) {
  function generateFolderHierarchyRecursively (folderPath, name = '') {
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
function generateFileTags (fileSystemHierarchy) {
}
function detectFileEncodings (fileSystemHierarchy) {
  function detectFileEncodingRecursively (path, hierarchy) {
    for (const key in hierarchy.files) {
      if (hierarchy.files.hasOwnProperty(key)) {
        if (hierarchy.files[key].ext !== '.exe') {
          const predicts = analyse(readFileSync(hierarchy.files[key].path))
          for (let i = 0; i < predicts.length; i++) {
            if (['UTF-8', 'Shift_JIS'].indexOf(predicts[i].name) !== -1) {
              parentPort.postMessage({
                type: 'updateFileEncoding',
                data: {
                  path: path + hierarchy.files[key].name,
                  encoding: predicts[i].name
                }
              })
              break
            }
          }
        }
      }
    }
    for (const key in hierarchy.folders) {
      if (hierarchy.folders.hasOwnProperty(key)) {
        detectFileEncodingRecursively(path + hierarchy.folders[key].name + '/', hierarchy.folders[key])
      }
    }
  }
  detectFileEncodingRecursively('/', fileSystemHierarchy)
}

// const structure =
// parentPort.postMessage({
//   type: 'open-root-folder',
//   data: { structure: structure }
// })
// function getFileList(struct, path) {
//   const fileLists = []
//   for (const key in struct.files) {
//     if (struct.files.hasOwnProperty(key)) {
//       fileLists.push([[].concat(path, [struct.files[key].name]), struct.files[key].path])
//     }
//   }
//   for (const key in struct.folders) {
//     if (struct.folders.hasOwnProperty(key)) {
//       fileLists.push(...getFileList(struct.folders[key], [].concat(path, [struct.folders[key].name])))
//     }
//   }
//   return fileLists
// }
// const fileList = getFileList(structure, [])
// let encodingWorker
// if (existsSync('./src/workers/encoding.js')) {
//   encodingWorker = new Worker('./src/workers/encoding.js')
// } else {
//   encodingWorker = new Worker('./resources/app/src/workers/encoding.js')
// }
// encodingWorker.postMessage({
//   type: 'caculate-encoding',
//   data: {
//     structure: structure,
//     fileList: fileList
//   }
// })
// encodingWorker.on('message', pkg => {
//   function setFileEncoding(path, struct, encoding) {
//     if (path.length === 0) {
//       struct.encoding = encoding
//     } else if (path.length === 1) {
//       setFileEncoding(path.slice(1, path.length), struct.files[path[0]], encoding)
//     } else {
//       setFileEncoding(path.slice(1, path.length), struct.folders[path[0]], encoding)
//     }
//   }
//   setFileEncoding(pkg.data.path, structure, pkg.data.encoding)
//   win.webContents.send('update-file-encoding', pkg.data)
// })
// ipcMain.on('open-file', (e, data) => {
//   const ext = extname(data.path).toLowerCase()
//   if (ext !== '.exe') {
//     const f = readFileSync(data.path)
//     let encoding = data.encoding
//     if (encoding === '') {
//       const pList = analyse(f)
//       for (let j = 0; j < pList.length; j++) {
//         if (['UTF-8', 'Shift_JIS'].indexOf(pList[j].name) !== -1) {
//           encoding = pList[j].name
//           break
//         }
//       }
//     }
//     const content = decode(f, encoding)
//     e.reply('open-file', content)
//     const pegFilePath = `src/grammars/${ext.slice(1, ext.length)}.pegjs`
//     if (existsSync(pegFilePath)) {
//       const configParser = peg.generate(decode(readFileSync(pegFilePath), 'UTF-8'))
//       e.reply('update-file-ast', configParser.parse(content))
//     } else if (existsSync(`./resources/app/src/grammars/${ext.slice(1, ext.length)}.pegjs`)) {
//       const configParser = peg.generate(decode(readFileSync(`./resources/app/src/grammars/${ext.slice(1, ext.length)}.pegjs`), 'UTF-8'))
//       e.reply('update-file-ast', configParser.parse(content))
//     }
//   }
// })
