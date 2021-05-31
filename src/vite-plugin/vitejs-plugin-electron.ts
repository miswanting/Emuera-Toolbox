import * as acorn from 'acorn'
import { parse } from 'path'
import { Plugin as VitePlugin } from 'vite'

const extensions = ['.js', '.jsx', '.ts', '.tsx', '.vue'] // 需要处理的文件后缀

export interface Esm2cjsOptions {
  excludes?: string[] // 需要被转换的模块
}

export default function esm2cjs(options?: Esm2cjsOptions): VitePlugin {
  const opts: Esm2cjsOptions = {
    // 默认我们转换 electron、electron-store 两个模块
    excludes: [
      'electron',
      'electron-store',
    ],
    ...options
  }

  return {
    name: 'vitejs-plugin-electron', // 这个 name 就是插件名字
    transform(code, id) {
      const parsed = parse(id) // 解析引入模块的路径，id 即引入文件完整路径
      if (!extensions.includes(parsed.ext)) return // 只处理需要处理的文件后缀

      const node: any = acorn.parse(code, { // 使用 acorn 解析 ESTree
        ecmaVersion: 2020, // 指定按照最新的 es 模块标准解析
        sourceType: 'module', // 指定按照模块进行解析
      })

      let codeRet = code
      node.body.reverse().forEach((item: any) => {
        if (item.type !== 'ImportDeclaration') return // 跳过非 import 语句
        if (opts.excludes && !opts.excludes.includes(item.source.value)) return // 跳过不要转换的模块

        /**
         * 下面这些 const 声明用来确定 import 的写法
         */
        const statr = codeRet.substring(0, item.start)
        const end = codeRet.substring(item.end)
        const deft = item.specifiers.find(({ type }: any) => type === 'ImportDefaultSpecifier')
        const deftModule = deft ? deft.local.name : ''
        const nameAs = item.specifiers.find(({ type }: any) => type === 'ImportNamespaceSpecifier')
        const nameAsModule = nameAs ? nameAs.local.name : ''
        const modules = item.
          specifiers
          .filter((({ type }: any) => type === 'ImportSpecifier'))
          .reduce((acc: any, cur: any) => acc.concat(cur.imported.name), [])

        /**
         * 这里开始根据各种 import 语法做转换
         */
        if (nameAsModule) {
          // import * as name from
          codeRet = `${statr}const ${nameAsModule} = require(.${item.source.raw})${end}`
        } else if (deftModule && !modules.length) {
          // import name from 'mod'
          codeRet = `${statr}const ${deftModule} = require(.${item.source.raw})${end}`
        } else if (deftModule && modules.length) {
          // import name, { name2, name3 } from 'mod'
          codeRet = `${statr}const ${deftModule} = require(.${item.source.raw})
            const { ${modules.join(', ')} } = ${deftModule}${end}`
        } else {
          // import { name1, name2 } from 'mod'
          codeRet = `${statr}const { ${modules.join(', ')} } = require(.${item.source.raw})${end}`
        }
      })

      return codeRet
    },
  }
}
