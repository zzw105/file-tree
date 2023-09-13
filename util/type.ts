interface fileCommentType {
  [index: string]: string
}

class fileStructure {
  [index: string]: (string | fileStructure)[]
}

interface configType {
  ignore: string[]
  export: string
}
export { fileCommentType, fileStructure, configType }
