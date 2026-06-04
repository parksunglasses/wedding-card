// 테마 시스템

export type ThemeId = 'elegant' | 'minimal' | 'flower' | 'dark' | 'natural' | 'hyundai'

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

  // 1. 샹파뉴 — 아이보리 + 딥골드, 클래식 스크립트 인트로
  elegant: {
    id: 'elegant',
    name: '샹파뉴',
    description: '아이보리 & 딥골드 · 클래식 스크립트',
    colors: {
      bg: '#FAF7F2',
      bgAlt: '#F0E9DC',
      bgDark: '#1C1610',
      text: '#1C1610',
      textMuted: '#9A8878',
      accent: '#A67C3A',
      accentLight: '#C9A05A',
      border: '#E2D8C8',
    },
    fonts: {
      heading: '"Cormorant Garamond", serif',
      body: '"Pretendard Variable", Pretendard, sans-serif',
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

  // 2. 블러쉬 — 파스텔 핑크 (샹파뉴와 같은 우아한 클래식)
  minimal: {
    id: 'minimal',
    name: '블러쉬',
    description: '파스텔 핑크 & 로즈 · 우아한 클래식',
    colors: {
      bg: '#FDF7F8',
      bgAlt: '#F8EAEE',
      bgDark: '#9A6670',
      text: '#3D2A2E',
      textMuted: '#A98C92',
      accent: '#C67E92',
      accentLight: '#F6DCE3',
      border: '#F1DCE2',
    },
    fonts: {
      heading: '"Cormorant Garamond", serif',
      body: '"Pretendard Variable", Pretendard, sans-serif',
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

  // 3. 로즈 — 더스티로즈 + 버건디, 프렌치 로맨틱
  flower: {
    id: 'flower',
    name: '로즈',
    description: '더스티로즈 & 버건디 · 프렌치 로맨틱',
    colors: {
      bg: '#FBF4F2',
      bgAlt: '#F4E4E0',
      bgDark: '#3D1F22',
      text: '#2C1518',
      textMuted: '#A88084',
      accent: '#9B4A50',
      accentLight: '#C97A80',
      border: '#EDD5D2',
    },
    fonts: {
      heading: '"Bodoni Moda", serif',
      body: '"Pretendard Variable", Pretendard, sans-serif',
      script: '"Pinyon Script", cursive',
    },
    style: {
      rounded: 'lg',
      introOverlay: 'dark',
      introTextStyle: 'script',
      introLayout: 'frame',
      introTitle: 'Save the Date',
      sectionDivider: 'dots',
      accentDecoration: 'floral',
    },
  },

  // 4. 미드나잇 — 딥네이비 + 샴페인골드, 럭셔리 이브닝 매거진
  dark: {
    id: 'dark',
    name: '미드나잇',
    description: '딥네이비 & 샴페인골드 · 럭셔리 이브닝',
    colors: {
      bg: '#0E1520',
      bgAlt: '#162130',
      bgDark: '#060C14',
      text: '#F0EBE0',
      textMuted: '#8A9AAA',
      accent: '#C9A84C',
      accentLight: '#E8CC80',
      border: '#243040',
    },
    fonts: {
      heading: '"Cinzel", serif',
      body: '"Pretendard Variable", Pretendard, sans-serif',
      script: '"Great Vibes", cursive',
    },
    style: {
      rounded: 'none',
      introOverlay: 'dark',
      introTextStyle: 'serif',
      introLayout: 'magazine',
      introTitle: 'THE WEDDING',
      sectionDivider: 'line',
      accentDecoration: 'bold',
    },
  },

  // 5. 세이지 — 세이지그린 + 크림, 보태니컬 미니멀
  natural: {
    id: 'natural',
    name: '세이지',
    description: '세이지그린 & 크림 · 보태니컬 가든',
    colors: {
      bg: '#F2F0E8',
      bgAlt: '#E6E3D6',
      bgDark: '#2A3428',
      text: '#242C22',
      textMuted: '#7A8870',
      accent: '#5C7048',
      accentLight: '#8AA870',
      border: '#D6D2C4',
    },
    fonts: {
      heading: '"Libre Baskerville", serif',
      body: '"Pretendard Variable", Pretendard, sans-serif',
      script: '"Great Vibes", cursive',
    },
    style: {
      rounded: 'sm',
      introOverlay: 'light',
      introTextStyle: 'serif',
      introLayout: 'minimal',
      introTitle: 'Our Wedding',
      sectionDivider: 'dots',
      accentDecoration: 'floral',
    },
  },

  // 6. 그린라벨 — 현대백화점 딥그린, 모던 럭셔리 프레임
  hyundai: {
    id: 'hyundai',
    name: '그린라벨',
    description: '딥그린 & 아이보리 · 모던 럭셔리',
    colors: {
      bg: '#F6F4EE',
      bgAlt: '#E8E6DC',
      bgDark: '#0B3B2E',
      text: '#10302A',
      textMuted: '#5E7A6E',
      accent: '#0B5C42',
      accentLight: '#3E8C6A',
      border: '#D2D8CC',
    },
    fonts: {
      heading: '"Marcellus", serif',
      body: '"Pretendard Variable", Pretendard, sans-serif',
      script: '"Marcellus", serif',
    },
    style: {
      rounded: 'none',
      introOverlay: 'dark',
      introTextStyle: 'sans',
      introLayout: 'frame',
      introTitle: 'WEDDING INVITATION',
      sectionDivider: 'line',
      accentDecoration: 'bold',
    },
  },
}

export function getTheme(id: ThemeId): Theme {
  return themes[id] || themes.elegant
}

export const themeList = Object.values(themes)
