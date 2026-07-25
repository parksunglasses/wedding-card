// 테마 시스템

export type ThemeId = 'elegant' | 'editorial' | 'doodle' | 'testo'

export interface Theme {
  id: ThemeId
  name: string
  description: string

  colors: {
    bg: string
    bgAlt: string
    bgDark: string
    text: string
    textMuted: string
    accent: string
    accentLight: string
    border: string
  }

  fonts: {
    heading: string
    body: string
    script?: string
  }

  style: {
    rounded: 'none' | 'sm' | 'md' | 'lg' | 'full'
    introOverlay: 'dark' | 'light' | 'none'
    introTextStyle: 'script' | 'serif' | 'sans'
    introLayout: 'classic' | 'minimal' | 'magazine' | 'frame'
    introTitle: string          // 인트로 대표 문구
    sectionDivider: 'line' | 'dots' | 'none'
    accentDecoration: 'minimal' | 'floral' | 'bold'
  }
}

export const themes: Record<ThemeId, Theme> = {

  // 1. 블러쉬 — 베이지 크림 + 파스텔 핑크, 손글씨 진입 드로잉
  elegant: {
    id: 'elegant',
    name: '블러쉬',
    description: '베이지 크림 & 파스텔 핑크 · 손글씨 진입',
    colors: {
      bg: '#FCF8F2',
      bgAlt: '#F7EFE4',
      bgDark: '#B8929C',
      text: '#463731',
      textMuted: '#AD9C8C',
      accent: '#D97E9F',
      accentLight: '#F5DAE1',
      border: '#EEE5D6',
    },
    fonts: {
      heading: '"Cormorant Garamond", serif',
      body: '"SUIT Variable", SUIT, "Pretendard Variable", Pretendard, sans-serif',
      script: '"Great Vibes", cursive',
    },
    style: {
      rounded: 'none',
      introOverlay: 'dark',
      introTextStyle: 'script',
      introLayout: 'classic',
      introTitle: 'Wedding Day',
      sectionDivider: 'line',
      accentDecoration: 'minimal',
    },
  },

  // 2. 에디토리얼 — 개선 시안 전용 레이아웃
  editorial: {
    id: 'editorial',
    name: '에디토리얼',
    description: '아이보리 & 잉크 그린 · 모던 웨딩 에디토리얼',
    colors: {
      bg: '#F7F4EE',
      bgAlt: '#EFEBE4',
      bgDark: '#35443A',
      text: '#1E211E',
      textMuted: '#77766F',
      accent: '#C48291',
      accentLight: '#E3B9C2',
      border: '#D8D1C7',
    },
    fonts: {
      heading: '"Cormorant Garamond", serif',
      body: '"SUIT Variable", SUIT, "Pretendard Variable", Pretendard, sans-serif',
      script: '"Great Vibes", cursive',
    },
    style: {
      rounded: 'sm',
      introOverlay: 'dark',
      introTextStyle: 'script',
      introLayout: 'classic',
      introTitle: 'The Wedding of',
      sectionDivider: 'line',
      accentDecoration: 'minimal',
    },
  },

  // 3. 레드두들 — 크림 + 딥레드, 손그림 겨울 두들
  //    다른 테마와 달리 전용 레이아웃(src/components/doodle)을 사용한다.
  doodle: {
    id: 'doodle',
    name: '레드두들',
    description: '크림 & 딥레드 · 손그림 겨울 두들',
    colors: {
      bg: '#FAF3E4',
      bgAlt: '#F2E7D2',
      bgDark: '#8C2321',
      text: '#3B2422',
      textMuted: '#A8867A',
      accent: '#8C2321',
      accentLight: '#C9A385',
      border: '#E2CBAF',
    },
    fonts: {
      heading: '"Nanum Pen Script", cursive',
      body: '"SUIT Variable", SUIT, "Pretendard Variable", Pretendard, sans-serif',
      script: '"Nanum Pen Script", cursive',
    },
    style: {
      rounded: 'lg',
      introOverlay: 'light',
      introTextStyle: 'script',
      introLayout: 'classic',
      introTitle: '결혼합니다!',
      sectionDivider: 'dots',
      accentDecoration: 'floral',
    },
  },

  // 4. 테스토 — 크래프트지 질감 + 딥레드, 손글씨 브러시 크리스마스
  //    다른 테마와 달리 전용 레이아웃(src/components/testo)을 사용한다.
  testo: {
    id: 'testo',
    name: '테스토',
    description: '크래프트지 & 딥레드 · 손글씨 브러시 크리스마스',
    colors: {
      bg: '#F4ECD9',
      bgAlt: '#FBF7EC',
      bgDark: '#7A1420',
      text: '#3A2A24',
      textMuted: '#9A7A6E',
      accent: '#7A1420',
      accentLight: '#9A2432',
      border: '#D8C6A6',
    },
    fonts: {
      heading: '"Nanum Pen Script", cursive',
      body: '"Gaegu", "Pretendard Variable", Pretendard, sans-serif',
      script: '"Nanum Pen Script", cursive',
    },
    style: {
      rounded: 'sm',
      introOverlay: 'light',
      introTextStyle: 'script',
      introLayout: 'classic',
      introTitle: '결혼합니다!',
      sectionDivider: 'line',
      accentDecoration: 'floral',
    },
  },
}

export function getTheme(id: ThemeId): Theme {
  return themes[id] || themes.elegant
}

export const themeList = Object.values(themes)
