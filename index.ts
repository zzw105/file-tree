#!/usr/bin/env node
import { Command } from 'commander'
import pac from './package.json'
import fs from 'fs'
import { getConfig, newDash, readLine, sortDir } from './util'
import findup from 'findup-sync'
import path from 'path'
import { fileCommentType, fileStructure } from './util/type'
import defaultConfig = require('./util/defaultConfig.json')

const program = new Command()

;(async function () {
  // 项目的路径
  const directory = process.cwd() // F:\project\tree

  // -v的显示
  program.version(pac.version).option('-i,--init', '初始化').option('-s,--skip', '跳过标注操作').parse(process.argv)

  // 终端参数
  const options = program.opts()

  // file-tree目录
  const folderPath = path.join(directory, './file-tree')
  try {
    fs.statSync(folderPath)
  } catch (err: any) {
    if (err && err.code === 'ENOENT') fs.mkdirSync(folderPath)
  }

  // init工作
  if (options.init) {
    // 复制默认信息
    fs.writeFileSync(path.join(directory, './file-tree/config.json'), JSON.stringify(defaultConfig))
    fs.writeFileSync(path.join(directory, './file-tree/fileComment.json'), JSON.stringify({}))
    process.exit()
  }

  // 配置项目
  const config = getConfig()

  // 文件层级转换为对象
  const dirToJson = (path: string) => {
    let stats = fs.lstatSync(path)

    const structure: fileStructure = {}

    if (stats.isDirectory()) {
      let dir = fs.readdirSync(path)

      // 过滤忽略文件
      const filterDir = dir.filter((item) => !config.ignore.includes(item))

      let dirObj = filterDir.map((child) => {
        let childStats = fs.lstatSync(path + '/' + child)
        return childStats.isDirectory() ? dirToJson(path + '/' + child) : child
      })

      let dirName = path.replace(/.*\/(?!$)/g, '')
      // 排序
      structure[dirName] = sortDir(dirObj)
    } else {
      let fileName = path.replace(/.*\/(?!$)/g, '')
      return fileName
    }
    return structure
  }

  const structureJson = dirToJson(directory)

  // 仅一层的不做处理直接弹出
  if (typeof structureJson === 'string') {
    console.log('此目标不是目录')
    process.exit()
  }

  // 读取文件注释的缓存文件
  const fileCommentPath = findup('file-tree/fileComment.json')

  // 现有的注释数据
  const fileComment: fileCommentType = (fileCommentPath && (require(fileCommentPath) as fileCommentType)) || {}

  // 最终输出的文件
  let outputString = ''

  // 不同的制表符
  const characters = {
    border: '|',
    contain: '├',
    line: '─',
    last: '└',
  }

  // 绑定文件的注释
  const addComment = async (structureJson: fileStructure, path: string) => {
    const key = Object.keys(structureJson)[0]

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

      // 对未处理的文件加注释
      const filePath = `${path}\\${fileName}`
      if (fileComment[filePath] === undefined) {
        let inputString = ''
        if (!options.skip) inputString = await readLine(`\n\n请输入此${fileType}的注释\n${filePath}\n`)
        fileComment[filePath] = inputString
      }
    }
  }

  await addComment(structureJson, Object.keys(structureJson)[0])

  // 写入文件作为缓存
  fs.writeFileSync(path.join(directory, './file-tree/fileComment.json'), JSON.stringify(fileComment), 'utf8')

  // 增加输出文本
  const addOutputString = (outStringHeader: string, annotation: string) => {
    const stringLength = outStringHeader.length

    // 处理长度过短问题
    if (config.dashLength <= stringLength) {
      console.log('配置文件中的dashLength过短，请手动调整后重新运行')
      process.exit()
    }

    // 输出文档
    if (annotation) outputString += `${outStringHeader} ${newDash(config.dashLength - stringLength)} ${annotation}`
    else outputString += outStringHeader
  }

  // 输出树形结构
  const drawDirTree = (structureJson: fileStructure, placeholder: string, path: string) => {
    let { border, contain, line, last } = characters
    for (let i in structureJson) {
      if (Array.isArray(structureJson[i])) {
        // 文件夹添加注释
        const filePath = `${path}`
        const annotation = fileComment[filePath]

        addOutputString(`\n${placeholder}${i}`, annotation)

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

          // 获取注释
          const filePath = `${path}\\${typeof val === 'string' ? val : Object.keys(val)[0]}`
          const annotation = fileComment[filePath]

          if (typeof val === 'string') {
            // 文件添加注释
            addOutputString(`\n${pl}${val}`, annotation)
          } else {
            let pl = placeholder
            drawDirTree(val, pl, `${path}\\${Object.keys(val)[0]}`)
          }
        })
      }
    }
  }

  drawDirTree(structureJson, '', Object.keys(structureJson)[0])

  // log输出
  console.log(outputString)

  // 文件输出
  fs.writeFileSync(path.join(directory, './file-tree/fileTree.md'), outputString)

  // 结束
  process.exit()
})()
