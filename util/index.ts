import defaultConfig = require('./defaultConfig.json')
import findup from 'findup-sync'
import readline from 'readline'

interface configType {
  ignore: string[]
  export: string
}

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

export { getConfig, question, readLine }
