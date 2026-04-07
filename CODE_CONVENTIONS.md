# Code Conventions

## 컴포넌트 작성 원칙

### 함수형 컴포넌트 + 커스텀 훅 분리

- UI 렌더링만 담당하는 컴포넌트와 비즈니스 로직을 담당하는 훅을 분리한다
- 컴포넌트 파일에는 JSX와 이벤트 핸들러 연결만, 로직은 훅으로 추출
- 훅 이름은 반드시 `use` 접두사 사용

```tsx
// 좋은 예 — 컴포넌트는 UI만
function TokenDisplay({ tokens, onTokenClick }: TokenDisplayProps) {
  return (
    <div>
      {tokens.map((token) => (
        <TokenChip key={token.id} token={token} onClick={onTokenClick} />
      ))}
    </div>
  )
}

// 좋은 예 — 로직은 훅으로
function useTokenizer(input: string) {
  const tokens = useMemo(() => tokenize(input), [input])
  return { tokens }
}
```

---

## 파일 네이밍

| 종류 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `TokenChip.tsx`, `StatsPanel.tsx` |
| 훅 | camelCase, `use` 접두사 | `useTokenizer.ts`, `usePopup.ts` |
| 유틸/상수 | camelCase | `tokenColors.ts`, `probabilityData.ts` |
| 타입 정의 | PascalCase interface/type | `Token`, `ProbabilityEntry` |

---

## TypeScript

- 모든 파일 `.ts` / `.tsx`
- `interface`는 컴포넌트 props에, `type`은 유니온·유틸리티 타입에 사용
- `any` 금지 — 불명확한 경우 `unknown` 사용 후 타입 가드 작성
- Props 타입은 컴포넌트 파일 상단에 인라인으로 선언

```tsx
interface TokenChipProps {
  token: Token
  onClick: (token: Token) => void
}

function TokenChip({ token, onClick }: TokenChipProps) { ... }
```

---

## 상태 관리

- 전역 공유 상태(선택된 토큰, 팝업 열림/닫힘 등)는 **Zustand**로 관리
- 컴포넌트 로컬 상태(input value, 탭 전환 등)는 `useState`
- Redux 같은 heavy 라이브러리는 불필요

---

## Tailwind CSS

- 인라인 스타일(`style={{}}`) 사용 금지 — 애니메이션 동적 값 제외
- 동적 클래스는 `cn()` 헬퍼 없이 템플릿 리터럴 또는 조건부 배열로 처리
- 토큰 파스텔 배경색 등 동적으로 결정되는 색상은 `style` prop 허용 (Tailwind purge 이슈)
- 컴포넌트 최상위 wrapper className 순서: layout → spacing → color → typography → animation

```tsx
// 허용: 동적 색상은 style prop
<span style={{ backgroundColor: token.color }} className="rounded px-1.5 py-0.5 text-sm font-mono">

// 금지: 동적 Tailwind 클래스 문자열 조합 (purge에서 제거될 수 있음)
<span className={`bg-${token.colorName}-200`}>
```

---

## 애니메이션

- **Framer Motion** 사용 (토큰 등장, 팝업 열림, 차트 막대 애니메이션)
- stagger 효과는 Framer Motion의 `variants` + `staggerChildren` 활용
- 단순한 hover/transition 효과는 Tailwind 클래스로 처리

---

## 임포트 순서

1. React, Next.js core
2. 외부 라이브러리 (framer-motion, zustand, lucide-react 등)
3. 내부 컴포넌트 (`@/components/...`)
4. 내부 훅 (`@/hooks/...`)
5. 유틸/상수 (`@/lib/...`)
6. 타입

```tsx
import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, BarChart2 } from 'lucide-react'
import TokenChip from '@/components/TokenChip'
import { useTokenizer } from '@/hooks/useTokenizer'
import { getTokenColor } from '@/lib/tokenColors'
import type { Token } from '@/lib/types'
```

---

## 컴포넌트 구조 (파일 내 순서)

```tsx
// 1. 타입/인터페이스
interface Props { ... }

// 2. 상수 (컴포넌트 외부)
const ANIMATION_DURATION = 300

// 3. 컴포넌트 본체
export default function MyComponent({ ... }: Props) {
  // 3a. 훅
  // 3b. 파생 변수 (useMemo)
  // 3c. 핸들러 (useCallback)
  // 3d. return JSX
}
```

---

## 금지 사항

- `console.log` 커밋 금지 (개발 중 임시 사용은 허용, 커밋 전 제거)
- 클래스형 컴포넌트 사용 금지
- `default export` + `named export` 혼용 금지 — 컴포넌트는 `default export`, 훅/유틸은 `named export`
