const PASTEL_COLORS = [
  '#c4b5fd', // violet-300
  '#a5b4fc', // indigo-300
  '#93c5fd', // blue-300
  '#7dd3fc', // sky-300
  '#6ee7b7', // emerald-300
  '#86efac', // green-300
  '#fde68a', // amber-200
  '#fca5a5', // red-300
  '#f9a8d4', // pink-300
  '#d8b4fe', // purple-300
  '#a7f3d0', // emerald-200
  '#bfdbfe', // blue-200
  '#fbcfe8', // pink-200
  '#e9d5ff', // purple-200
  '#bbf7d0', // green-200
]

const PASTEL_BG_COLORS = PASTEL_COLORS.map((hex) => hex + '33') // 20% opacity

export function getTokenColor(index: number): string {
  return PASTEL_BG_COLORS[index % PASTEL_BG_COLORS.length]
}

export function getTokenTextColor(index: number): string {
  return PASTEL_COLORS[index % PASTEL_COLORS.length]
}
