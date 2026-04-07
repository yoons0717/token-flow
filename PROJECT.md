# LLM Tokenizer & Probability Visualizer — 프로젝트 명세

## 개요

LLM이 텍스트를 처리하는 방식을 시각적으로 보여주는 교육용 대시보드.  
실제 모델 연결 없이 **프론트엔드만으로** LLM 토큰화 & Next Token Prediction을 시뮬레이션한다.

---

## 기술 스택

| 항목 | 선택 |
|------|------|
| 프레임워크 | Next.js 15 (App Router) |
| UI 라이브러리 | React 19 |
| 스타일링 | Tailwind CSS |
| 애니메이션 | Framer Motion |
| 전역 상태 | Zustand |
| 아이콘 | lucide-react |
| 언어 | TypeScript |
| 지원 텍스트 언어 | 영어 |

---

## 핵심 기능

### 1. 실시간 토큰 분해

- 사용자가 textarea에 영어 텍스트를 입력하면 즉시 토큰 단위로 분해
- **토큰화 규칙**: 단어 / 공백 / 문장부호를 각각 별도 토큰으로 분리
  - 예: `"Hello, world!"` → `["Hello", ",", " ", "world", "!"]`
- 각 토큰은 랜덤 파스텔톤 배경색 적용 (토큰마다 고정 색상, 재렌더링 시 변경 없음)
- 토큰 생성 시 fade-in + slide-up 애니메이션

### 2. Next Token Prediction 팝업

- 임의의 토큰을 클릭하면 팝업(모달) 표시
- 해당 토큰 다음에 올 확률이 높은 토큰 후보 5~8개를 시뮬레이션
- **확률 데이터 생성 방식**: 하드코딩된 영어 단어 빈도 사전(bigram-like 테이블) 기반
  - 클릭된 토큰의 품사/카테고리에 따라 다른 후보군 반환
  - 예: 동사 뒤 → 명사/대명사/부사 위주, 관사 뒤 → 명사 위주
- **시각화**: 팝업 내에서 탭으로 두 뷰 전환
  - **Bar Chart 탭**: 후보 토큰을 확률(%) 순으로 가로 막대 차트
  - **Tree 탭**: 클릭 토큰 → 1단계 후보 → 2단계 후보(상위 3개의 하위 2개)로 분기 시각화
- 팝업 외부 클릭 또는 ESC로 닫기

### 3. 통계 대시보드

실시간으로 다음 지표를 계산하여 상단 또는 사이드에 표시:

| 지표 | 설명 |
|------|------|
| Total Tokens | 총 토큰 수 |
| Characters | 전체 문자 수 |
| T/C Ratio | 토큰 / 문자 비율 (소수점 2자리) |
| Unique Tokens | 중복 제거한 고유 토큰 수 |
| Avg Token Length | 토큰당 평균 문자 수 |

---

## 디자인 방향

- **다크 모드 전용** (라이트 모드 불필요)
- 배경: `#0a0a0f` ~ `#111118` 계열 딥 다크
- 강조색: 퍼플/인디고 계열 (`#7c3aed`, `#6366f1`)
- 대시보드 느낌: 카드 기반 레이아웃, 얇은 테두리(border), subtle glow 효과
- 폰트: monospace 계열 (토큰 표시), sans-serif (UI 텍스트)
- 애니메이션:
  - 토큰 등장: `fade-in` + `slide-up` (stagger 효과로 순서대로)
  - 팝업 열림: `scale` + `fade-in`
  - 막대 차트: width 애니메이션

---

## 페이지 구조 (App Router)

```
app/
  layout.tsx      # 전역 레이아웃, 다크 배경
  page.tsx        # 메인 페이지 (전체 앱)

components/
  TokenInput.tsx       # 텍스트 입력 영역
  TokenDisplay.tsx     # 토큰 배열 시각화
  TokenChip.tsx        # 개별 토큰 칩
  StatsPanel.tsx       # 통계 대시보드
  ProbabilityPopup.tsx # 팝업 컨테이너 (탭 전환)
  BarChartView.tsx     # 막대 차트 뷰
  TreeView.tsx         # 트리 뷰

hooks/
  useTokenizer.ts      # 토큰화 로직
  useProbability.ts    # Next token 확률 데이터 생성
  useStats.ts          # 통계 계산
  usePopup.ts          # 팝업 열기/닫기 상태

lib/
  tokenColors.ts       # 토큰 색상 결정 로직
  probabilityData.ts   # 하드코딩된 bigram-like 확률 사전
```

---

## 범위 외 (Out of Scope)

- 실제 LLM API 연동
- 한국어 지원
- 라이트 모드
- 사용자 계정/저장 기능
- 서버사이드 로직 (순수 클라이언트 앱)
