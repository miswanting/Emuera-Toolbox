const { parentPort } = require('worker_threads')
const { readdirSync, statSync, existsSync, mkdirSync, readFileSync } = require('fs')
const { dirname, join, extname } = require('path')
const { execFileSync } = require('child_process')
const { analyse } = require('chardet')
const { decode } = require('iconv-lite')
const { generate } = require('pegjs')
const { parse } = require('./parser.js')
parentPort.on('message', pkg => {
  if (pkg.type === 'loadFileRaw') {
    loadFileRaw(pkg.data)
    loadFileAst(pkg.data)
  } else if (pkg.type === 'loadFileAst') {
    loadFileAst(pkg.data)
  }
})
function loadFileRaw(data) {
  if (data.ext !== '.exe') {
    const file = readFileSync(data.path)
    if (!data.encoding) {
      const predicts = analyse(file)
      for (let i = 0; i < predicts.length; i++) {
        if (['UTF-8', 'Shift_JIS'].indexOf(predicts[i].name) !== -1) {
          data.encoding = predicts[i].name
          break
        }
      }
    }
    data.raw = decode(file, data.encoding)
    parentPort.postMessage({
      type: 'updateFileRaw',
      data: data
    })
  }
}
function loadFileAst(data) {
  if (data.ext !== '.exe') {
    const pegFilePath = `./src/grammars/${data.ext.slice(1, data.ext.length)}.pegjs`
    if (existsSync(pegFilePath)) {
      try {
        // data.ast = generate(readFileSync(pegFilePath, { encoding: 'utf-8' })).parse(data.raw)
        data.ast = parse(data.raw)
      } catch (e) {
        console.log(e)
      }
      parentPort.postMessage({
        type: 'updateFileAst',
        data: data
      })
    }
  }
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
