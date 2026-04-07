import { useMemo } from 'react'
import type { Token } from '@/lib/types'
import { getTokenColor, getTokenTextColor } from '@/lib/tokenColors'

const TOKEN_REGEX = /\w+|[^\w\s]|\s+/g

export function useTokenizer(input: string): Token[] {
  return useMemo(() => {
    if (!input) return []

    const matches = input.match(TOKEN_REGEX)
    if (!matches) return []

    return matches.map((text, index) => ({
      id: `token-${index}-${text}`,
      text,
      color: getTokenColor(index),
      textColor: getTokenTextColor(index),
      index,
    }))
  }, [input])
}
