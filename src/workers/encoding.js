const { parentPort } = require('worker_threads')
const { readFileSync } = require('fs')
const { analyse } = require('chardet')
const { extname } = require('path')

parentPort.on('message', e => {
  if (e.type === 'caculate-encoding') {
    for (let i = 0; i < e.data.fileList.length; i++) {
      if (extname(e.data.fileList[i][1]).toLowerCase() !== '.exe') {
        const pList = analyse(readFileSync(e.data.fileList[i][1]))
        for (let j = 0; j < pList.length; j++) {
          if (['UTF-8', 'Shift_JIS'].indexOf(pList[j].name) !== -1) {
            parentPort.postMessage({
              type: 'update-file-encoding',
              data: {
                path: e.data.fileList[i][0],
                encoding: pList[j].name
              }
            })
            break
          }
        }
      }
    }
  }
})
