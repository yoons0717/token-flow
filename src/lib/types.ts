export interface Token {
  id: string
  text: string
  color: string
  textColor: string
  index: number
}

export interface ProbabilityEntry {
  token: string
  probability: number
}

export interface TreeNode {
  token: string
  probability: number
  children?: TreeNode[]
}

export interface Stats {
  totalTokens: number
  characters: number
  tcRatio: number
  uniqueTokens: number
  avgTokenLength: number
}
