# PLAN.md — 개발 계획

> 체크박스: `- [ ]` 미완료 / `- [x]` 완료

---

## Phase 0. 프로젝트 초기 설정

> Next.js 앱 생성 및 개발 환경 구성

- [x] Next.js 15 프로젝트 생성 (`create-next-app`, App Router, TypeScript)
- [x] Tailwind CSS 설정 확인 (다크 배경 전역 스타일 적용)
- [x] 패키지 설치: `framer-motion`, `zustand`, `lucide-react`
- [x] `tsconfig.json` 경로 별칭 설정 (`@/components`, `@/hooks`, `@/lib`, `@/store`)
- [x] 폴더 구조 생성 (`components/`, `hooks/`, `lib/`, `store/`)
- [x] `app/layout.tsx` — 전역 다크 배경, 기본 폰트 설정

---

## Phase 1. 데이터 레이어 & 비즈니스 로직

> UI 없이 순수 로직만 구현. 이후 컴포넌트가 여기에 의존.

- [x] `lib/types.ts` — 핵심 타입 정의
  - `Token` (id, text, color, index)
  - `ProbabilityEntry` (token, probability)
  - `TreeNode` (token, probability, children)
- [x] `lib/tokenColors.ts` — 토큰 인덱스 기반 파스텔 색상 배열 반환
- [x] `lib/probabilityData.ts` — bigram-like 확률 사전
  - 품사 카테고리별 다음 토큰 후보 테이블 (동사→명사, 관사→명사, 등)
  - `getNextTokens(token: string): ProbabilityEntry[]` 함수
  - `getTreeData(token: string): TreeNode` 함수 (2단계)
- [x] `hooks/useTokenizer.ts` — 입력 문자열 → Token 배열 변환
  - 단어 / 공백 / 문장부호 분리 regex 구현
- [x] `hooks/useStats.ts` — Token 배열 → 통계 객체 계산
  - Total Tokens, Characters, T/C Ratio, Unique Tokens, Avg Token Length
- [x] `store/useAppStore.ts` — Zustand 전역 스토어
  - `selectedToken: Token | null`
  - `isPopupOpen: boolean`
  - `setSelectedToken`, `closePopup` 액션

---

## Phase 2. 핵심 UI — 입력 & 토큰 표시

> 앱의 메인 인터랙션 흐름 구현

- [ ] `app/page.tsx` — 전체 레이아웃 (입력 영역 + 토큰 표시 + 사이드 통계)
- [ ] `components/TokenInput.tsx` — 텍스트 입력 textarea
  - 플레이스홀더, 다크 스타일, 입력 시 실시간 토큰화 트리거
- [ ] `components/TokenChip.tsx` — 개별 토큰 칩
  - 파스텔 배경색 (`style` prop으로 동적 색상)
  - 클릭 시 `setSelectedToken` 호출
  - hover 시 밝기 증가 (Tailwind)
- [ ] `components/TokenDisplay.tsx` — TokenChip 배열 렌더링
  - Framer Motion `variants` + `staggerChildren`으로 토큰 순서대로 fade-in + slide-up

---

## Phase 3. 통계 대시보드

> 입력 텍스트 기반 실시간 지표 카드

- [ ] `components/StatsPanel.tsx` — 통계 카드 5개 렌더링
  - Total Tokens / Characters / T/C Ratio / Unique Tokens / Avg Token Length
  - 각 카드: 아이콘(lucide) + 라벨 + 수치
  - 수치 변경 시 숫자 fade 전환 애니메이션

---

## Phase 4. Probability 팝업

> 토큰 클릭 시 Next Token Prediction 시각화

- [ ] `components/ProbabilityPopup.tsx` — 팝업 컨테이너
  - Framer Motion `AnimatePresence` + `scale` + `fade` 진입/퇴장 애니메이션
  - 탭 UI: **Bar Chart** / **Tree** 전환
  - 외부 클릭(backdrop) 및 ESC 키로 닫기
- [ ] `components/BarChartView.tsx` — 가로 막대 차트
  - 확률 순으로 정렬된 후보 토큰 목록
  - Framer Motion `width` 애니메이션으로 막대 확장
  - 확률 % 수치 표시
- [ ] `components/TreeView.tsx` — 2단계 트리 시각화
  - 클릭 토큰 → 1단계 후보(상위 4개) → 2단계 후보(각 상위 2개)
  - SVG 또는 flexbox로 분기 선 연결
  - 노드 진입 애니메이션 (stagger)

---

## Phase 5. 폴리싱 & 마무리

> 디자인 완성도 및 빌드 검증

- [ ] 퍼플/인디고 glow 효과 적용 (카드 hover, 선택된 토큰 강조)
- [ ] 전체 애니메이션 타이밍 통일 (duration, easing)
- [ ] 빈 상태 처리 (텍스트 미입력 시 안내 메시지)
- [ ] `npm run build` 빌드 오류 없음 확인
- [ ] `npm run lint` 린트 통과 확인
