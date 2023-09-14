interface fileCommentType {
  [index: string]: string
}

class fileStructure {
  [index: string]: (string | fileStructure)[]
}

interface configType {
  ignore: string[]
  ignoreExtension: string[]
  ignoreFolder: string[]
  dashLength: number
}
export { fileCommentType, fileStructure, configType }
