// 테마 시스템

export type ThemeId = 'elegant' | 'minimal' | 'flower' | 'dark' | 'natural'

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
    sectionDivider: 'line' | 'dots' | 'none'
    accentDecoration: 'minimal' | 'floral' | 'bold'
  }
}

export const themes: Record<ThemeId, Theme> = {

  // 1. 샹파뉴 — 아이보리 + 딥골드, 최고급 호텔 웨딩
  elegant: {
    id: 'elegant',
    name: '샹파뉴',
    description: '아이보리 & 딥골드 — 호텔 웨딩',
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
      body: 'Pretendard, sans-serif',
      script: '"Great Vibes", cursive',
    },
    style: {
      rounded: 'none',
      introOverlay: 'dark',
      introTextStyle: 'script',
      sectionDivider: 'line',
      accentDecoration: 'minimal',
    },
  },

  // 2. 블랑 — 퓨어화이트 + 웜블랙, 하이패션 미니멀
  minimal: {
    id: 'minimal',
    name: '블랑',
    description: '퓨어화이트 & 웜블랙 — 하이패션',
    colors: {
      bg: '#FEFCFA',
      bgAlt: '#F5F2EE',
      bgDark: '#141210',
      text: '#141210',
      textMuted: '#7A7570',
      accent: '#141210',
      accentLight: '#5A5550',
      border: '#E8E4DF',
    },
    fonts: {
      heading: '"Playfair Display", serif',
      body: 'Pretendard, sans-serif',
      script: '"Playfair Display", serif',
    },
    style: {
      rounded: 'none',
      introOverlay: 'light',
      introTextStyle: 'serif',
      sectionDivider: 'line',
      accentDecoration: 'minimal',
    },
  },

  // 3. 로즈 — 더스티로즈 + 버건디, 프렌치 로맨틱
  flower: {
    id: 'flower',
    name: '로즈',
    description: '더스티로즈 & 버건디 — 프렌치 로맨틱',
    colors: {
      bg: '#FBF5F2',
      bgAlt: '#F5E8E4',
      bgDark: '#3D1F22',
      text: '#2C1518',
      textMuted: '#A08080',
      accent: '#8B3D42',
      accentLight: '#C47A7F',
      border: '#EDD8D4',
    },
    fonts: {
      heading: '"Cormorant Garamond", serif',
      body: 'Pretendard, sans-serif',
      script: '"Great Vibes", cursive',
    },
    style: {
      rounded: 'sm',
      introOverlay: 'dark',
      introTextStyle: 'script',
      sectionDivider: 'dots',
      accentDecoration: 'floral',
    },
  },

  // 4. 미드나잇 — 딥네이비 + 샴페인골드, 럭셔리 이브닝
  dark: {
    id: 'dark',
    name: '미드나잇',
    description: '딥네이비 & 샴페인골드 — 럭셔리 이브닝',
    colors: {
      bg: '#0E1520',
      bgAlt: '#162030',
      bgDark: '#060C14',
      text: '#F0EBE0',
      textMuted: '#8A9AAA',
      accent: '#C9A84C',
      accentLight: '#E8CC80',
      border: '#243040',
    },
    fonts: {
      heading: '"Cinzel", serif',
      body: 'Pretendard, sans-serif',
      script: '"Great Vibes", cursive',
    },
    style: {
      rounded: 'none',
      introOverlay: 'dark',
      introTextStyle: 'script',
      sectionDivider: 'line',
      accentDecoration: 'bold',
    },
  },

  // 5. 세이지 — 세이지그린 + 크림, 보태니컬 가든
  natural: {
    id: 'natural',
    name: '세이지',
    description: '세이지그린 & 크림 — 보태니컬 가든',
    colors: {
      bg: '#F2F0E8',
      bgAlt: '#E8E4D8',
      bgDark: '#2A3428',
      text: '#242C22',
      textMuted: '#7A8870',
      accent: '#5C7048',
      accentLight: '#8AA870',
      border: '#D8D4C8',
    },
    fonts: {
      heading: '"Libre Baskerville", serif',
      body: 'Pretendard, sans-serif',
      script: '"Great Vibes", cursive',
    },
    style: {
      rounded: 'sm',
      introOverlay: 'dark',
      introTextStyle: 'serif',
      sectionDivider: 'dots',
      accentDecoration: 'floral',
    },
  },
}

export function getTheme(id: ThemeId): Theme {
  return themes[id] || themes.elegant
}

export const themeList = Object.values(themes)
