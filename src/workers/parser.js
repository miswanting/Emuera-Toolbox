exports.parse = function (rawFile) {
  console.log(rawFile)
  // const textIterator = generateTextIterator(rawFile)
  // const tokenIterator = generateTokenIterator(textIterator)
  const tokens = tokenize(rawFile)
  console.log(tokens);
}
// function generateTextIterator(text) {
//   let index = 0
//   const textIterator = {
//     next: function () {
//       const res = { index: index, value: '', done: false }
//       if (index < text.length) {
//         res.value = text[index]
//         index++
//         return res
//       }
//       res.done = true
//       return res
//     }
//   }
//   return textIterator
// }
// function generateTokenIterator(text) {
// }

function tokenize(text) {
  let lineIndex = 1
  let offsetIndex = 1
  let token = {
    line: 1,
    offset: 1,
    type: 'spaces',
    value: 2
  }
  const state = {
    i: 0,
    j: 0,
    cache: '',
    blockMode: '',
    lineMode: ''
  }
  const tokens = []
  while (true) {
    if (state.j === text.length) break
    let c = text[state.j]
    state.cache += c
    if (c === '\n') {
      state.cache = ''
      tokens.push({
        line: lineIndex,
        offset: offsetIndex,
        type: '\n'
      })
      state.lineMode = ''
      lineIndex += 1
      offsetIndex = 1
      state.i = state.j + 1
      state.cache = ''
    } else if (c === ';') {
      state.lineMode = 'Comment'
    } else {
      offsetIndex += 1
    }
  }
  return tokens
}
// function tokenize(text) {
//   let lineIndex = 1
//   let offsetIndex = 1
//   let tokenIndex = 0
//   let token = {
//     line: 1,
//     offset: 1,
//     type: 'spaces',
//     value: 2
//   }
//   const state = {
//     stringCache: ''
//   }
//   const tokens = []
//   for (let i = 0; i < text.length; i++) {
//     const c = text[i]
//     if (c === '\n') {
//       state.stringCache = ''
//       tokens.push({
//         line: lineIndex,
//         offset: offsetIndex,
//         type: 'NewLine'
//       })
//       lineIndex += 1
//       offsetIndex = 1
//     } else {
//       state.stringCache += c
//       offsetIndex += 1
//     }
//   }
//   return tokens
// }
function tokenizer() { }
function parser() { }