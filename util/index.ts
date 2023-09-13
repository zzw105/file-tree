import defaultConfig = require('./defaultConfig.json')
import findup from 'findup-sync'
import readline from 'readline'
import { configType, fileStructure } from './type'

const getConfig = () => {
  const filePath = findup('file-tree/config.json')
  const userConfig = filePath && (require(filePath) as configType)
  const config = {
    ...defaultConfig,
    ...userConfig,
  }
  return config
}

const question = (question: string) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise<string>((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      return resolve(answer)
    })
  })
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

async function readLine(question: string) {
  return new Promise<string>((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer)
    })
  })
}

// 文件排序
function sortDir(arr: (string | fileStructure)[]) {
  const folderList: fileStructure[] = []
  const fileList: string[] = []

  arr.forEach((item) => {
    if (typeof item === 'string') fileList.push(item)
    else folderList.push(item)
  })

  folderList.sort((x, y) => {
    const a = Object.keys(x)[0]
    const b = Object.keys(y)[0]
    return a.charCodeAt(0) - b.charCodeAt(0)
  })

  fileList.sort((x, y) => {
    return x.charCodeAt(0) - y.charCodeAt(0)
  })

  return [...folderList, ...fileList]
}

const newDash = (length: number) => {
  return new Array(length).join('-')
}

export { getConfig, question, readLine, sortDir, newDash }
