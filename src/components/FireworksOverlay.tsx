import { useMemo } from 'react'

type ChristmasIcoType =
  | 'bauble'
  | 'bell'
  | 'gift'
  | 'star'
  | 'cane'
  | 'sock'
  | 'hat'
  | 'tree'
  | 'mitten'
  | 'santa'
  | 'rudolph'
  | 'snowman'
  | 'ribbon'

type LoveIcoType =
  | 'heartPink'
  | 'heartRose'
  | 'heartDeep'
  | 'ribbonPink'
  | 'ribbonLilac'
  | 'ribbonRose'
  | 'starSparkle'
  | 'flowerPetal'
  | 'maltese'
  | 'cloudSky'

const CHRISTMAS_ORNAMENTS: ChristmasIcoType[] = [
  'bauble',
  'bell',
  'gift',
  'star',
  'cane',
  'sock',
  'hat',
  'tree',
  'mitten',
  'santa',
  'rudolph',
  'snowman',
]

const LOVE_ORNAMENTS: LoveIcoType[] = [
  'maltese',
  'heartPink',
  'cloudSky',
  'maltese',
  'ribbonPink',
  'heartRose',
  'maltese',
  'starSparkle',
  'flowerPetal',
  'maltese',
]

const CHRISTMAS_COLORS = {
  pine: '#2F5D45',
  gold: '#E8B84B',
  red: '#7A1420',
  paper: '#F4ECD9',
  snow: '#EBF4F6',
}

const LOVE_COLORS = {
  pink: '#E87A90',       // 러블리 핑크
  softPink: '#F4A7B9',   // 베이비 핑크
  rose: '#D97E9F',       // 로즈 핑크
  deepPink: '#D85A7F',   // 라즈베리 핑크
  dustyPink: '#E098AD',  // 인디 핑크
  peachPink: '#FAD4C0',  // 피치 핑크
  lilac: '#C7B3E5',      // 라일락 핑크
  cream: '#FFF9F2',
  sky: '#B4E1F5',        // 연하늘
  sparkle: '#F7D6E0',
}

function ChristmasIcon({ type }: { type: ChristmasIcoType }) {
  switch (type) {
    case 'santa':
      return (
        <svg viewBox="0 0 24 24" width="100%" height="100%">
          <circle cx="12" cy="15" r="7" fill={CHRISTMAS_COLORS.paper} />
          <path d="M12 2 C8 2 6 9 6 12 H18 C18 9 16 2 12 2 Z" fill={CHRISTMAS_COLORS.red} />
          <circle cx="12" cy="2.5" r="1.8" fill={CHRISTMAS_COLORS.paper} />
          <rect x="5.5" y="11" width="13" height="2.5" rx="1.2" fill={CHRISTMAS_COLORS.paper} />
        </svg>
      )
    case 'rudolph':
      return (
        <svg viewBox="0 0 24 24" width="100%" height="100%">
          <circle cx="12" cy="14" r="7" fill="#B87333" />
          <circle cx="12" cy="17" r="2.2" fill="#E74C3C" />
          <circle cx="9" cy="12" r="1" fill="#333" />
          <circle cx="15" cy="12" r="1" fill="#333" />
          <path d="M8 8 L6 3 M8 6 L5 5 M16 8 L18 3 M16 6 L19 5" stroke="#8B4513" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    case 'snowman':
      return (
        <svg viewBox="0 0 24 24" width="100%" height="100%">
          <circle cx="12" cy="9" r="4.5" fill={CHRISTMAS_COLORS.snow} />
          <circle cx="12" cy="17" r="6" fill={CHRISTMAS_COLORS.snow} />
          <circle cx="10.5" cy="8.5" r="0.7" fill="#333" />
          <circle cx="13.5" cy="8.5" r="0.7" fill="#333" />
          <polygon points="12,9.5 15,10.5 12,11" fill="#E67E22" />
          <rect x="8.5" y="3.5" width="7" height="2" fill={CHRISTMAS_COLORS.red} />
          <rect x="9.5" y="1" width="5" height="3" fill={CHRISTMAS_COLORS.red} />
        </svg>
      )
    case 'ribbon':
      return (
        <svg viewBox="0 0 24 24" width="100%" height="100%">
          <path d="M12 12 C 7 6 3 9 6 13.5 C 9 18 12 13 12 12 Z" fill="#E84393" />
          <path d="M12 12 C 17 6 20 10 17 14 C 14 18 12 13 12 12 Z" fill="#E84393" />
          <circle cx="12" cy="12" r="2" fill={CHRISTMAS_COLORS.gold} />
          <path d="M11 13 L8 21 M13 13 L16 21" stroke="#E84393" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    case 'bauble':
      return (
        <svg viewBox="0 0 24 24" width="100%" height="100%">
          <rect x="10.5" y="4" width="3" height="3" rx="0.6" fill={CHRISTMAS_COLORS.pine} />
          <circle cx="12" cy="14" r="7" fill={CHRISTMAS_COLORS.red} />
          <path d="M12 7 a6 6 0 0 1 5 9" stroke={CHRISTMAS_COLORS.gold} strokeWidth="1.2" fill="none" opacity="0.85" />
        </svg>
      )
    case 'bell':
      return (
        <svg viewBox="0 0 24 24" width="100%" height="100%">
          <path d="M12 3 C 8 3 7 7 7 11 C 7 15 5.5 16.5 5 17.5 H 19 C 18.5 16.5 17 15 17 11 C 17 7 16 3 12 3 Z" fill={CHRISTMAS_COLORS.gold} />
          <circle cx="12" cy="19.5" r="2" fill={CHRISTMAS_COLORS.red} />
        </svg>
      )
    case 'gift':
      return (
        <svg viewBox="0 0 24 24" width="100%" height="100%">
          <rect x="4" y="9" width="16" height="12" rx="1.5" fill={CHRISTMAS_COLORS.pine} />
          <rect x="11" y="9" width="2.5" height="12" fill={CHRISTMAS_COLORS.gold} />
          <rect x="4" y="13.5" width="16" height="2.5" fill={CHRISTMAS_COLORS.gold} />
          <path d="M12 9 C 9 9 8 4 10 4 C 12 4 12 7 12 9 C 12 7 12 4 14 4 C 16 4 15 9 12 9 Z" fill={CHRISTMAS_COLORS.gold} />
        </svg>
      )
    case 'star':
      return (
        <svg viewBox="0 0 24 24" width="100%" height="100%">
          <path d="M12 2.4 l2.7 6.2 6.7 .5 -5.1 4.4 1.6 6.6 -5.9 -3.5 -5.9 3.5 1.6 -6.6 -5.1 -4.4 6.7 -.5 Z" fill={CHRISTMAS_COLORS.gold} />
        </svg>
      )
    case 'cane':
      return (
        <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none">
          <path d="M9 21 V11 A3.6 3.6 0 0 1 16.2 11" stroke={CHRISTMAS_COLORS.gold} strokeWidth="3.6" strokeLinecap="round" />
          <path d="M9 21 V11 A3.6 3.6 0 0 1 16.2 11" stroke={CHRISTMAS_COLORS.red} strokeWidth="3.6" strokeLinecap="round" strokeDasharray="3 4" />
        </svg>
      )
    case 'sock':
      return (
        <svg viewBox="0 0 24 24" width="100%" height="100%">
          <path d="M9 6.5 L9 13 C 9 15 7 15.6 6 17 C 4.9 18.6 6 20.6 8.6 20.6 C 10.6 20.6 12.2 19 14.6 17.6 C 16 16.6 16 15 16 13 L16 6.5 Z" fill={CHRISTMAS_COLORS.red} />
          <rect x="8.4" y="4.4" width="8.2" height="3" rx="1.3" fill={CHRISTMAS_COLORS.paper} />
        </svg>
      )
    case 'hat':
      return (
        <svg viewBox="0 0 24 24" width="100%" height="100%">
          <path d="M3.5 16.5 C 6 6 17 5 20.5 15.5 Z" fill={CHRISTMAS_COLORS.red} />
          <rect x="2.5" y="16" width="19" height="3" rx="1.5" fill={CHRISTMAS_COLORS.paper} />
          <circle cx="20.5" cy="6.5" r="2.3" fill={CHRISTMAS_COLORS.paper} />
        </svg>
      )
    case 'tree':
      return (
        <svg viewBox="0 0 24 24" width="100%" height="100%">
          <path d="M12 3 L7 10 H17 Z" fill={CHRISTMAS_COLORS.pine} />
          <path d="M12 8 L5.5 15 H18.5 Z" fill={CHRISTMAS_COLORS.pine} />
          <path d="M12 13 L4 21 H20 Z" fill={CHRISTMAS_COLORS.pine} />
          <rect x="10.5" y="20" width="3" height="2.5" fill="#8A5A32" />
        </svg>
      )
    case 'mitten':
      return (
        <svg viewBox="0 0 24 24" width="100%" height="100%">
          <path d="M8 19 C6 19 5 17 5 13 L5 9 C5 6.5 7 5 9.5 5 C 12 5 13.5 6.5 13.5 9 L13.5 13 Z" fill={CHRISTMAS_COLORS.pine} />
          <path d="M13.5 11 C15 11 17 12 17 14 C17 16 15 17 13.5 17 Z" fill={CHRISTMAS_COLORS.pine} />
          <rect x="4.5" y="18" width="10" height="3" rx="1" fill={CHRISTMAS_COLORS.paper} />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" width="100%" height="100%">
          <circle cx="12" cy="15" r="7" fill={CHRISTMAS_COLORS.paper} />
          <path d="M12 2 C8 2 6 9 6 12 H18 C18 9 16 2 12 2 Z" fill={CHRISTMAS_COLORS.red} />
          <circle cx="12" cy="2.5" r="1.8" fill={CHRISTMAS_COLORS.paper} />
          <rect x="5.5" y="11" width="13" height="2.5" rx="1.2" fill={CHRISTMAS_COLORS.paper} />
        </svg>
      )
  }
}

function LoveIcon({ type }: { type: LoveIcoType }) {
  switch (type) {
    case 'heartPink':
      return (
        <svg viewBox="0 0 24 24" width="100%" height="100%">
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill={LOVE_COLORS.pink}
          />
        </svg>
      )
    case 'heartRose':
      return (
        <svg viewBox="0 0 24 24" width="100%" height="100%">
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill={LOVE_COLORS.rose}
          />
        </svg>
      )
    case 'heartDeep':
      return (
        <svg viewBox="0 0 24 24" width="100%" height="100%">
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill={LOVE_COLORS.deepPink}
          />
        </svg>
      )
    case 'maltese':
      return (
        <svg viewBox="0 0 24 24" width="100%" height="100%">
          {/* 옆으로 살짝 튀어나오되 크기를 아담하게 줄인 말티즈 귀 */}
          <ellipse cx="5.6" cy="12.2" rx="2.0" ry="3.0" fill="#FFFFFF" />
          <ellipse cx="18.4" cy="12.2" rx="2.0" ry="3.0" fill="#FFFFFF" />
          {/* 동글동글 몽실하게 예쁜 두상 */}
          <circle cx="12" cy="12.3" r="6.6" fill="#FFFFFF" />
          {/* 머리 상단 앙증맞은 핑크 리본 */}
          <path d="M12 5.5 C10.4 4 8.8 5.3 10.4 6.5 Z" fill={LOVE_COLORS.deepPink} />
          <path d="M12 5.5 C13.6 4 15.2 5.3 13.6 6.5 Z" fill={LOVE_COLORS.deepPink} />
          <circle cx="12" cy="5.5" r="0.8" fill={LOVE_COLORS.peachPink} />
          {/* 까만 눈과 반짝이 하이라이트 */}
          <circle cx="9.4" cy="11.8" r="1.1" fill="#1C1C1C" />
          <circle cx="14.6" cy="11.8" r="1.1" fill="#1C1C1C" />
          <circle cx="9.7" cy="11.5" r="0.38" fill="#FFFFFF" />
          <circle cx="14.9" cy="11.5" r="0.38" fill="#FFFFFF" />
          {/* 둥근 코 */}
          <ellipse cx="12" cy="13.5" rx="1.0" ry="0.75" fill="#1A1A1A" />
        </svg>
      )
    case 'cloudSky':
      return (
        <svg viewBox="0 0 24 24" width="100%" height="100%">
          {/* 아담하고 귀여운 뭉게구름 */}
          <g transform="translate(1.2, 1.8) scale(0.9)">
            <path
              d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04Z"
              fill={LOVE_COLORS.sky}
            />
          </g>
        </svg>
      )
    case 'ribbonPink':
      return (
        <svg viewBox="0 0 24 24" width="100%" height="100%">
          <path d="M12 10 C7.5 4.5 1.5 7.5 4 12 C6.5 15 11 11.5 12 10 Z" fill={LOVE_COLORS.pink} />
          <path d="M12 10 C16.5 4.5 22.5 7.5 20 12 C17.5 15 13 11.5 12 10 Z" fill={LOVE_COLORS.pink} />
          <circle cx="12" cy="10.5" r="1.8" fill={LOVE_COLORS.deepPink} />
          <path d="M11.2 11.2 C9 15 6.5 18.5 5 21.5 C7.2 20 9.2 17 11.6 12 Z" fill={LOVE_COLORS.pink} />
          <path d="M12.8 11.2 C15 15 17.5 18.5 19 21.5 C16.8 20 14.8 17 12.4 12 Z" fill={LOVE_COLORS.pink} />
        </svg>
      )
    case 'ribbonRose':
      return (
        <svg viewBox="0 0 24 24" width="100%" height="100%">
          <path d="M12 10 C7.5 4.5 1.5 7.5 4 12 C6.5 15 11 11.5 12 10 Z" fill={LOVE_COLORS.rose} />
          <path d="M12 10 C16.5 4.5 22.5 7.5 20 12 C17.5 15 13 11.5 12 10 Z" fill={LOVE_COLORS.rose} />
          <circle cx="12" cy="10.5" r="1.8" fill={LOVE_COLORS.dustyPink} />
          <path d="M11.2 11.2 C9 15 6.5 18.5 5 21.5 C7.2 20 9.2 17 11.6 12 Z" fill={LOVE_COLORS.rose} />
          <path d="M12.8 11.2 C15 15 17.5 18.5 19 21.5 C16.8 20 14.8 17 12.4 12 Z" fill={LOVE_COLORS.rose} />
        </svg>
      )
    case 'ribbonLilac':
      return (
        <svg viewBox="0 0 24 24" width="100%" height="100%">
          <path d="M12 10 C7.5 4.5 1.5 7.5 4 12 C6.5 15 11 11.5 12 10 Z" fill={LOVE_COLORS.lilac} />
          <path d="M12 10 C16.5 4.5 22.5 7.5 20 12 C17.5 15 13 11.5 12 10 Z" fill={LOVE_COLORS.lilac} />
          <circle cx="12" cy="10.5" r="1.8" fill={LOVE_COLORS.rose} />
          <path d="M11.2 11.2 C9 15 6.5 18.5 5 21.5 C7.2 20 9.2 17 11.6 12 Z" fill={LOVE_COLORS.lilac} />
          <path d="M12.8 11.2 C15 15 17.5 18.5 19 21.5 C16.8 20 14.8 17 12.4 12 Z" fill={LOVE_COLORS.lilac} />
        </svg>
      )
    case 'starSparkle':
      return (
        <svg viewBox="0 0 24 24" width="100%" height="100%">
          <path
            d="M12 2 C12 7.5 16.5 12 22 12 C16.5 12 12 16.5 12 22 C12 16.5 7.5 12 2 12 C7.5 12 12 7.5 12 2 Z"
            fill={LOVE_COLORS.sparkle}
          />
        </svg>
      )
    case 'flowerPetal':
      return (
        <svg viewBox="0 0 24 24" width="100%" height="100%">
          <path
            d="M12 2 C16 6 20 10 18 16 C16 20 10 22 6 18 C3 14 5 8 12 2 Z"
            fill={LOVE_COLORS.softPink}
            opacity="0.85"
          />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" width="100%" height="100%">
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill={LOVE_COLORS.pink}
          />
        </svg>
      )
  }
}

export default function FireworksOverlay({ themeName }: { themeName?: string }) {
  const isTestoTheme =
    themeName === 'testo' ||
    (typeof window !== 'undefined' && window.location.search.includes('theme=testo'))

  const items = useMemo(() => {
    if (isTestoTheme) {
      return Array.from({ length: 9 }, (_, i) => {
        const type = CHRISTMAS_ORNAMENTS[i % CHRISTMAS_ORNAMENTS.length]
        const left = Math.floor((i * 10.5) + (Math.random() * 4)) % 92 + 3
        const size = Math.floor(Math.random() * 4) + 14
        const duration = (Math.random() * 5 + 13).toFixed(1)
        const negativeDelay = (i * 2.1 + Math.random() * 1.5).toFixed(1)
        return { id: i, type, left, size, duration, negativeDelay }
      })
    } else {
      return Array.from({ length: 9 }, (_, i) => {
        const type = LOVE_ORNAMENTS[i % LOVE_ORNAMENTS.length]
        const left = Math.floor((i * 10.5) + (Math.random() * 4)) % 92 + 3
        const size = Math.floor(Math.random() * 4) + 14
        const duration = (Math.random() * 5 + 13).toFixed(1)
        const negativeDelay = (i * 2.1 + Math.random() * 1.5).toFixed(1)
        return { id: i, type, left, size, duration, negativeDelay }
      })
    }
  }, [isTestoTheme])

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      <style>{`
        @keyframes ornamentShower {
          0% {
            transform: translateY(-50px) rotate(0deg) translateX(0);
            opacity: 0;
          }
          12% {
            opacity: 0.75;
          }
          50% {
            transform: translateY(50vh) rotate(180deg) translateX(15px);
            opacity: 0.85;
          }
          88% {
            opacity: 0.75;
          }
          100% {
            transform: translateY(105vh) rotate(360deg) translateX(-12px);
            opacity: 0;
          }
        }
        .ornament-item {
          position: absolute;
          top: 0;
          animation: ornamentShower linear infinite;
          filter: drop-shadow(0 2px 5px rgba(0,0,0,0.11));
        }
      `}</style>
      {items.map((item) => (
        <div
          key={item.id}
          className="ornament-item"
          style={{
            left: `${item.left}%`,
            width: item.size,
            height: item.size,
            animationDuration: `${item.duration}s`,
            animationDelay: `-${item.negativeDelay}s`,
          }}
        >
          {isTestoTheme ? (
            <ChristmasIcon type={item.type as ChristmasIcoType} />
          ) : (
            <LoveIcon type={item.type as LoveIcoType} />
          )}
        </div>
      ))}
    </div>
  )
}
