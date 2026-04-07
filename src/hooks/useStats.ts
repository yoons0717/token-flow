import { useMemo } from 'react'
import type { Token, Stats } from '@/lib/types'

export function useStats(tokens: Token[]): Stats {
  return useMemo(() => {
    if (tokens.length === 0) {
      return { totalTokens: 0, characters: 0, tcRatio: 0, uniqueTokens: 0, avgTokenLength: 0 }
    }

    const totalTokens = tokens.length
    const characters = tokens.reduce((sum, t) => sum + t.text.length, 0)
    const uniqueTokens = new Set(tokens.map((t) => t.text.toLowerCase())).size
    const tcRatio = parseFloat((totalTokens / characters).toFixed(2))
    const avgTokenLength = parseFloat((characters / totalTokens).toFixed(2))

    return { totalTokens, characters, tcRatio, uniqueTokens, avgTokenLength }
  }, [tokens])
}
