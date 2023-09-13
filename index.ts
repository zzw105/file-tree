#!/usr/bin/env node
import { Command } from 'commander'
import pac from './package.json'
import fs from 'fs'
import { getConfig, question, readLine } from './util'
import findup from 'findup-sync'
import path from 'path'

class fileStructure {
  [index: string]: (string | fileStructure)[]
}

interface fileCommentType {
  [index: string]: string
}

const program = new Command()

;(async function () {
  // -v的显示
  program.version(pac.version)

  // 项目的路径
  const directory = process.cwd()

  // 配置项目
  const config = getConfig()

  function sortDir(arr: (string | fileStructure)[]) {
    let i = arr.length - 1
    while (i >= 0) {
      if (typeof arr[i] === 'object') {
        let obj = arr.splice(i, 1)
        arr.unshift(obj[0])
      }
      i--
    }
    return arr
  }

  const dirToJson = (path: string) => {
    let stats = fs.lstatSync(path)

    const structure: fileStructure = {}

    if (stats.isDirectory()) {
      let dir = fs.readdirSync(path)

      // if (ignoreRegex) {
      //   dir = dir.filter((val) => {
      //     return !ignoreRegex.test(val)
      //   })
      // }

      let dirObj = dir.map((child) => {
        let childStats = fs.lstatSync(path + '/' + child)
        return childStats.isDirectory() ? dirToJson(path + '/' + child) : child
      })

      // const popPop = (arr: (string | fileStructure)[]) => {
      //   if (arr.length === 0) return arr
      //   if (typeof arr[arr.length - 1] !== 'string') {
      //     const popObj = arr.pop() as fileStructure
      //     arr.unshift(popObj)
      //     if (typeof arr[arr.length - 1] !== 'string') {
      //       popPop(arr)
      //     }
      //   }
      //   return arr
      // }

      // if (dirObj.length > 0 && typeof dirObj[0] !== typeof dirObj[dirObj.length - 1]) {
      //   dirObj = popPop(dirObj)
      // }
      let dirName = path.replace(/.*\/(?!$)/g, '')
      structure[dirName] = sortDir(dirObj)
    } else {
      let fileName = path.replace(/.*\/(?!$)/g, '')
      return fileName
    }
    return structure
  }

  const structureJson = dirToJson(directory)

  if (typeof structureJson === 'string') {
    console.log('此目标不是目录')
    return
  }

  const fileCommentPath = findup('file-tree/fileComment.json')
  const fileComment: fileCommentType = (fileCommentPath && (require(fileCommentPath) as fileCommentType)) || {}
  let outputString = ''
  const characters = {
    border: '|',
    contain: '├',
    line: '─',
    last: '└',
  }

  const addComment = async (structureJson: fileStructure, path: string) => {
    const key = Object.keys(structureJson)[0]

    if (config.ignore.includes(key)) {
      delete structureJson[key]
      return
    }

    const arr = structureJson[key]
    let fileName = ''
    let fileType = '文件夹'

    for (let index = 0; index < arr.length; index++) {
      const element = arr[index]
      if (typeof element === 'string') {
        fileName = element
        fileType = '文件'
      } else {
        fileName = Object.keys(element)[0]
        await addComment(element, `${path}\\${Object.keys(element)[0]}`)
      }

      if (!config.ignore.includes(fileName)) {
        const filePath = `${path}\\${fileName}`
        if (fileComment[filePath] === undefined) {
          const inputString = await readLine(`\n\n请输入此${fileType}的注释\n${filePath}\n`)

          // const userText = iconv.decode(
          //   readlineSync.question(`\n\n请输入此${fileType}的注释\n${filePath}\n`, { encoding: 'gbk' }),
          //   'gbk'
          // )

          fileComment[filePath] = inputString
        }
      }
    }
  }

  await addComment(structureJson, Object.keys(structureJson)[0])

  fs.writeFileSync(path.join(directory, './file-tree/fileComment.json'), JSON.stringify(fileComment), 'utf8')

  const drawDirTree = (structureJson: fileStructure, placeholder: string, path: string) => {
    let { border, contain, line, last } = characters
    for (let i in structureJson) {
      if (Array.isArray(structureJson[i])) {
        const filePath = `${path}`

        const annotation = fileComment[filePath] ? ' // ' + fileComment[filePath] : ''
        outputString += '\n' + placeholder + i + annotation
        placeholder = placeholder.replace(new RegExp(`${contain}`, 'g'), border)
        placeholder = placeholder.replace(new RegExp(`${line}`, 'g'), ' ')

        placeholder = placeholder + Array(Math.ceil(i.length / 2)).join(' ') + contain + line

        placeholder = placeholder.replace(new RegExp('^ +', 'g'), '')
        structureJson[i].forEach((val, idx, arr) => {
          let pl = placeholder
          //if the idx is the last one, change the character
          if (idx === arr.length - 1) {
            let regex = new RegExp(`${contain}${line}$`, 'g')

            pl = placeholder.replace(regex, last) + line
          }
          const filePath = `${path}\\${typeof val === 'string' ? val : Object.keys(val)[0]}`

          const annotation = fileComment[filePath] ? ' // ' + fileComment[filePath] : ''

          if (typeof val === 'string') {
            outputString += '\n' + pl + val + annotation
          } else {
            let pl = placeholder
            drawDirTree(val, pl, `${path}\\${Object.keys(val)[0]}`)
          }
        })
      }
    }
  }

  drawDirTree(structureJson, '', Object.keys(structureJson)[0])

  console.log(outputString)
  fs.writeFileSync(path.join(directory, './file-tree/fileTree.md'), outputString)
  process.exit()
})()
