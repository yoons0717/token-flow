import type { ProbabilityEntry, TreeNode } from '@/lib/types'

// ─── 카테고리 분류 ───────────────────────────────────────────────────────────

const ARTICLES = new Set(['a', 'an', 'the'])
const BE_VERBS = new Set(['is', 'are', 'was', 'were', 'be', 'been', 'being', 'am'])
const DO_VERBS = new Set(['do', 'does', 'did', 'done'])
const HAVE_VERBS = new Set(['have', 'has', 'had'])
const MODAL_VERBS = new Set(['can', 'could', 'will', 'would', 'should', 'may', 'might', 'must', 'shall'])
const PREPOSITIONS = new Set(['in', 'on', 'at', 'by', 'for', 'with', 'about', 'from', 'to', 'of', 'into', 'through'])
const CONJUNCTIONS = new Set(['and', 'but', 'or', 'so', 'yet', 'nor', 'although', 'because', 'if', 'when', 'while'])
const PRONOUNS = new Set(['i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their'])
const ADJECTIVES = new Set(['good', 'great', 'new', 'old', 'big', 'small', 'long', 'little', 'own', 'right', 'high', 'large', 'next', 'early', 'young', 'important', 'public', 'private', 'real', 'best', 'free', 'more', 'most', 'last', 'much', 'many'])
const PUNCTUATION = new Set(['.', ',', '!', '?', ';', ':', '-', '(', ')', '"', "'"])

// ─── 후보 테이블 ──────────────────────────────────────────────────────────────

type CandidateTable = Record<string, Array<{ token: string; weight: number }>>

const NEXT_TOKEN_TABLE: CandidateTable = {
  article: [
    { token: 'world', weight: 8 },
    { token: 'new', weight: 7 },
    { token: 'same', weight: 6 },
    { token: 'first', weight: 6 },
    { token: 'most', weight: 5 },
    { token: 'best', weight: 5 },
    { token: 'only', weight: 4 },
    { token: 'great', weight: 4 },
  ],
  be_verb: [
    { token: 'not', weight: 9 },
    { token: 'able', weight: 7 },
    { token: 'used', weight: 6 },
    { token: 'very', weight: 6 },
    { token: 'going', weight: 5 },
    { token: 'a', weight: 5 },
    { token: 'the', weight: 4 },
    { token: 'more', weight: 4 },
  ],
  do_verb: [
    { token: 'not', weight: 10 },
    { token: 'you', weight: 7 },
    { token: 'it', weight: 6 },
    { token: 'this', weight: 5 },
    { token: 'that', weight: 5 },
    { token: 'what', weight: 4 },
    { token: 'so', weight: 3 },
    { token: 'well', weight: 3 },
  ],
  have_verb: [
    { token: 'been', weight: 9 },
    { token: 'a', weight: 7 },
    { token: 'the', weight: 6 },
    { token: 'to', weight: 6 },
    { token: 'not', weight: 5 },
    { token: 'no', weight: 4 },
    { token: 'some', weight: 4 },
    { token: 'more', weight: 3 },
  ],
  modal_verb: [
    { token: 'be', weight: 10 },
    { token: 'not', weight: 8 },
    { token: 'have', weight: 7 },
    { token: 'also', weight: 5 },
    { token: 'still', weight: 4 },
    { token: 'just', weight: 4 },
    { token: 'only', weight: 3 },
    { token: 'help', weight: 3 },
  ],
  preposition: [
    { token: 'the', weight: 10 },
    { token: 'a', weight: 7 },
    { token: 'this', weight: 6 },
    { token: 'his', weight: 5 },
    { token: 'her', weight: 5 },
    { token: 'their', weight: 5 },
    { token: 'its', weight: 4 },
    { token: 'all', weight: 4 },
  ],
  conjunction: [
    { token: 'the', weight: 9 },
    { token: 'i', weight: 7 },
    { token: 'it', weight: 6 },
    { token: 'a', weight: 6 },
    { token: 'he', weight: 5 },
    { token: 'she', weight: 5 },
    { token: 'they', weight: 4 },
    { token: 'we', weight: 4 },
  ],
  pronoun: [
    { token: 'was', weight: 8 },
    { token: 'is', weight: 8 },
    { token: 'have', weight: 7 },
    { token: 'will', weight: 6 },
    { token: 'can', weight: 5 },
    { token: 'had', weight: 5 },
    { token: 'said', weight: 4 },
    { token: 'would', weight: 4 },
  ],
  adjective: [
    { token: 'and', weight: 8 },
    { token: 'enough', weight: 6 },
    { token: 'to', weight: 6 },
    { token: 'for', weight: 5 },
    { token: 'in', weight: 5 },
    { token: 'of', weight: 5 },
    { token: 'as', weight: 4 },
    { token: 'but', weight: 3 },
  ],
  punctuation: [
    { token: 'the', weight: 9 },
    { token: 'i', weight: 8 },
    { token: 'it', weight: 6 },
    { token: 'a', weight: 6 },
    { token: 'he', weight: 5 },
    { token: 'this', weight: 5 },
    { token: 'we', weight: 4 },
    { token: 'they', weight: 4 },
  ],
  default: [
    { token: 'the', weight: 10 },
    { token: 'of', weight: 8 },
    { token: 'and', weight: 8 },
    { token: 'a', weight: 7 },
    { token: 'to', weight: 7 },
    { token: 'in', weight: 6 },
    { token: 'is', weight: 5 },
    { token: 'that', weight: 5 },
  ],
}

// ─── 카테고리 판별 ─────────────────────────────────────────────────────────────

function getCategory(token: string): string {
  const lower = token.toLowerCase()
  if (ARTICLES.has(lower)) return 'article'
  if (BE_VERBS.has(lower)) return 'be_verb'
  if (DO_VERBS.has(lower)) return 'do_verb'
  if (HAVE_VERBS.has(lower)) return 'have_verb'
  if (MODAL_VERBS.has(lower)) return 'modal_verb'
  if (PREPOSITIONS.has(lower)) return 'preposition'
  if (CONJUNCTIONS.has(lower)) return 'conjunction'
  if (PRONOUNS.has(lower)) return 'pronoun'
  if (ADJECTIVES.has(lower)) return 'adjective'
  if (PUNCTUATION.has(lower)) return 'punctuation'
  return 'default'
}

// ─── 확률 계산 ────────────────────────────────────────────────────────────────

function toProbabilities(
  candidates: Array<{ token: string; weight: number }>
): ProbabilityEntry[] {
  const total = candidates.reduce((sum, c) => sum + c.weight, 0)
  return candidates.map((c) => ({
    token: c.token,
    probability: parseFloat((c.weight / total).toFixed(3)),
  }))
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getNextTokens(token: string): ProbabilityEntry[] {
  const category = getCategory(token)
  const candidates = NEXT_TOKEN_TABLE[category] ?? NEXT_TOKEN_TABLE.default
  return toProbabilities(candidates).sort((a, b) => b.probability - a.probability)
}

export function getTreeData(token: string): TreeNode {
  const level1 = getNextTokens(token).slice(0, 4)

  const children: TreeNode[] = level1.map((entry) => {
    const level2 = getNextTokens(entry.token).slice(0, 2)
    return {
      token: entry.token,
      probability: entry.probability,
      children: level2.map((e) => ({ token: e.token, probability: e.probability })),
    }
  })

  return {
    token,
    probability: 1,
    children,
  }
}
