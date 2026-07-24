// 테스토 테마 공용 조각 — 크래프트지 질감, 낙서 하트, 찢어진 종이 구분선
import { useId } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { getOptimizedUrl } from '@/lib/cloudinary'

/** 본문 손글씨 폰트(가는 고딕 손글씨) */
export const gaegu = { fontFamily: 'Gaegu, sans-serif' } as const

export const TESTO = {
  paper: '#F4ECD9',
  paperAlt: '#FBF7EC',
  red: '#7A1420',
  redSoft: '#9A2432',
  ink: '#3A2A24',
  inkSoft: '#5A3A32',
  muted: '#9A7A6E',
  tan: '#D8C6A6',
  gold: '#E8B84B',
  pine: '#2F5D45',
  snow: '#9BB0A2',
} as const

const BRUSH = { fontFamily: '"Nanum Brush Script", cursive' } as const

/** 브러시 손글씨 폰트를 쓰는 문구 (제목·버튼 등) */
export function pen(size: number, color?: string): CSSProperties {
  return { ...BRUSH, fontSize: size, lineHeight: 1, ...(color ? { color } : null) }
}

const HEART_PATH =
  'M12 20 C 11 18 3 13 2.4 7.4 C 2 4 6 2.6 9 4.2 C 10.4 5 11.4 6 12 7 C 12.7 6 13.6 5 15 4.2 C 18 2.5 22 4 21.6 7.4 C 21 13 13 18 12 20 Z'

const SCRIBBLE_PATH =
  'M2.3 4.3 L6.0 4.1 L10.4 4.1 L14.1 3.9 L17.8 3.9 L21.4 4.4 L21.2 5.4 L18.0 5.7 L13.9 5.3 L10.4 5.1 L6.6 5.4 L2.5 5.5 L2.8 6.8 L6.4 6.8 L10.4 6.7 L14.3 6.8 L17.9 6.4 L21.1 6.2 L21.1 7.8 L17.9 7.9 L13.8 7.6 L9.8 7.6 L6.3 7.6 L2.1 7.5 L2.2 9.1 L6.5 8.5 L10.5 8.6 L14.4 9.0 L17.9 9.1 L22.0 8.7 L21.6 9.7 L17.7 10.2 L13.7 9.9 L10.4 10.2 L6.5 10.3 L2.8 10.0 L2.2 11.2 L6.4 11.0 L10.3 11.0 L13.7 11.1 L18.2 11.4 L21.3 11.1 L21.2 12.3 L17.4 12.1 L14.0 12.3 L10.4 12.5 L6.7 12.0 L2.5 12.2 L2.9 13.2 L6.4 13.6 L10.5 13.3 L13.9 13.7 L17.4 13.1 L21.9 13.6 L21.0 14.6 L18.1 14.2 L14.4 14.5 L9.9 14.8 L6.7 14.2 L3.0 14.4 L2.6 16.0 L5.9 15.7 L9.8 15.4 L13.4 15.7 L18.1 15.6 L21.7 15.6 L21.3 16.8 L17.7 16.6 L13.7 16.8 L9.8 16.6 L6.8 16.8 L2.2 17.2 L2.2 18.1 L5.9 18.3 L9.9 17.9 L14.0 17.7 L18.0 17.7 L21.4 18.3 L21.4 19.0 L17.4 18.8 L14.1 19.3 L10.4 19.5 L6.4 19.4 L2.5 19.1'

interface HeartProps {
  size?: number
  color?: string
  /** 'outline'은 테두리만, 'scribble'은 안을 낙서로 채운다 */
  variant?: 'outline' | 'scribble'
  rotate?: number
  strokeWidth?: number
  className?: string
  style?: CSSProperties
}

/** 손그림 낙서 하트 — 겨울 테스토 테마의 시그니처 장식 */
export function Heart({
  size = 24,
  color = TESTO.red,
  variant = 'outline',
  rotate = 0,
  strokeWidth = 1.6,
  className,
  style,
}: HeartProps) {
  const clipId = useId()
  const height = Math.round((size * 22) / 24)
  const rotateTransform = rotate ? `rotate(${rotate}deg)` : undefined

  return (
    <svg
      viewBox="0 0 24 22"
      width={size}
      height={height}
      className={className}
      style={{ ...style, transform: [rotateTransform, style?.transform].filter(Boolean).join(' ') || undefined }}
      aria-hidden="true"
    >
      {variant === 'scribble' && (
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <path d={HEART_PATH} />
          </clipPath>
        </defs>
      )}
      <path d={HEART_PATH} fill="none" stroke={color} strokeWidth={strokeWidth} />
      {variant === 'scribble' && (
        <g clipPath={`url(#${clipId})`} style={{ color }}>
          <path
            d={SCRIBBLE_PATH}
            className="testo-heart-scribble"
            fill="none"
            stroke="currentColor"
            strokeWidth={0.85}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}
    </svg>
  )
}

const FLAKES = [
  { left: '10%', size: 12, duration: 9, delay: 0 },
  { left: '32%', size: 9, duration: 12, delay: 2 },
  { left: '58%', size: 13, duration: 10, delay: 4 },
  { left: '78%', size: 10, duration: 8.5, delay: 1 },
  { left: '90%', size: 11, duration: 11, delay: 3 },
]

interface SnowfallProps {
  distance?: number
  color?: string
  count?: number
}

export function Snowfall({ distance = 320, color = TESTO.snow, count = 5 }: SnowfallProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {FLAKES.slice(0, count).map((flake, index) => (
        <span
          key={index}
          className="testo-flake"
          style={{
            left: flake.left,
            fontSize: flake.size,
            color,
            animationDuration: `${flake.duration}s`,
            animationDelay: `${flake.delay}s`,
            ['--testo-fall' as string]: `${distance}px`,
          }}
        >
          ❄
        </span>
      ))}
    </div>
  )
}

interface SquiggleProps {
  width?: number
  color?: string
  className?: string
}

/** 제목 아래 그어주는 손그림 밑줄 */
export function Squiggle({ width = 130, color = TESTO.red, className }: SquiggleProps) {
  return (
    <svg
      viewBox="0 0 130 10"
      width={width}
      height={10}
      className={className}
      style={{ display: 'block' }}
      aria-hidden="true"
    >
      <path
        d="M3 6 Q 20 1 38 6 T 74 6 T 110 6 T 127 5"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  )
}

interface HeadingProps {
  children: ReactNode
  color?: string
  size?: number
  squiggleWidth?: number
  className?: string
}

export function TestoHeading({ children, color = TESTO.red, size = 44, squiggleWidth = 130, className }: HeadingProps) {
  return (
    <div className={`flex flex-col items-center ${className ?? ''}`}>
      <h2 className="m-0 font-normal" style={pen(size, color)}>
        {children}
      </h2>
      <Squiggle width={squiggleWidth} color={color} className="mt-1.5" />
    </div>
  )
}

/** 눈 쌓인 크리스마스 트리 낙서 — 12월 결혼식 포인트 장식 */
export function SnowTree({ size = 46, className }: { size?: number; className?: string }) {
  const height = Math.round((size * 52) / 44)
  return (
    <svg viewBox="0 0 44 52" width={size} height={height} className={className} aria-hidden="true">
      <path d="M22 7 C 17 12 15 15 14 18 Q 22 21 30 18 C 29 15 27 12 22 7 Z" fill={TESTO.pine} />
      <path d="M22 17 C 15 23 12 27 10 31 Q 22 35 34 31 C 32 27 29 23 22 17 Z" fill={TESTO.pine} />
      <path d="M22 29 C 13 36 9 40 7 44 Q 22 49 37 44 C 35 40 31 36 22 29 Z" fill={TESTO.pine} />
      <rect x="19.5" y="44" width="5" height="6" rx="1.5" fill="#8A5A32" />
      <path
        d="M22 2 l1.4 3.2 3.4 .3 -2.6 2.3 .8 3.4 -3 -1.9 -3 1.9 .8 -3.4 -2.6 -2.3 3.4 -.3 Z"
        fill={TESTO.gold}
      />
      <circle cx="18" cy="21" r="1.6" fill={TESTO.gold} />
      <circle cx="26" cy="26" r="1.6" fill={TESTO.paper} />
      <circle cx="16" cy="33" r="1.6" fill={TESTO.paper} />
      <circle cx="29" cy="38" r="1.6" fill={TESTO.gold} />
      <circle cx="22" cy="41" r="1.6" fill={TESTO.gold} />
    </svg>
  )
}

// 섹션 사이를 잇는 '찢어진 종이' 물결 — 다음 섹션 배경색으로 칠해 이어붙인 것처럼 보이게 한다.
const DIVIDER_PATHS = [
  'M0 32 L0 17 C 160 8 320 8 480 15 L480 32 Z',
  'M0 32 L0 15 L110 14 Q 150 21 200 15 L330 14 Q 380 20 430 15 L480 14 L480 32 Z',
  'M0 32 L0 20 C 140 6 300 12 480 9 L480 32 Z',
  'M0 32 L0 14 C 160 22 320 6 480 14 L480 32 Z',
  'M0 32 L0 16 L150 11 L300 17 L480 12 L480 32 Z',
] as const

interface TornDividerProps {
  variant: 0 | 1 | 2 | 3 | 4
  /** 이전 섹션의 아래쪽 가장자리로 쓸 땐 true (뒤집어서 배치) */
  flip?: boolean
  color?: string
}

export function TornDivider({ variant, flip = false, color = TESTO.red }: TornDividerProps) {
  return (
    <svg
      viewBox="0 0 480 32"
      preserveAspectRatio="none"
      style={{
        display: 'block',
        width: '100%',
        height: 32,
        marginTop: flip ? -1 : undefined,
        marginBottom: flip ? undefined : -1,
        transform: flip ? 'scaleY(-1)' : undefined,
      }}
      aria-hidden="true"
    >
      <path d={DIVIDER_PATHS[variant]} fill={color} />
    </svg>
  )
}

// ── 사진 (실제 이미지 or 크래프트 플레이스홀더) ─────────────────────
const PHOTO_TONES = ['#EBDFC4', '#E5D7B8', '#EFE3CB', '#E7DBBF', '#F0E6D2', '#E3D4B4', '#EAD9BA', '#E1D0AC']

interface PhotoProps {
  src?: string
  w?: number
  h?: number
  i?: number
  fill?: boolean
  radius?: number
  alt?: string
}

export function Photo({ src, w, h, i = 0, fill, radius = 0, alt = '' }: PhotoProps) {
  const style: CSSProperties = { width: fill ? '100%' : w, height: fill ? '100%' : h, borderRadius: radius }
  if (src) {
    return (
      <div className="photo" style={style}>
        <img src={getOptimizedUrl(src, { width: 800 })} alt={alt} loading="lazy" className="photo-img" />
      </div>
    )
  }
  return (
    <div className="photo" style={{ ...style, background: PHOTO_TONES[i % PHOTO_TONES.length] }}>
      <svg viewBox="0 0 44 44" width={30} height={30} aria-hidden="true" style={{ opacity: 0.3 }}>
        <rect x="7" y="13" width="30" height="22" rx="2" fill="none" stroke={TESTO.ink} strokeWidth="1.6" />
        <circle cx="22" cy="24" r="6" fill="none" stroke={TESTO.ink} strokeWidth="1.6" />
        <path d="M16 13 l3 -4 h6 l3 4" fill="none" stroke={TESTO.ink} strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

// ── 크리스마스 아이콘 (viewBox 0 0 24 24 안에 넣어 사용) ────────────
const ICO = { pine: '#2F5D45', gold: '#E8B84B', red: '#7A1420', brown: '#8A5A32', paper: '#F4ECD9' }

export type IcoType =
  | 'tree' | 'gift' | 'bauble' | 'star' | 'hat' | 'cane' | 'snow' | 'holly'
  | 'santa' | 'bell' | 'sock' | 'flake' | 'mitten'

/** 크리스마스 아이콘 내부 요소. mono가 있으면 단색 실루엣. */
export function Ico({ t, mono = null }: { t: IcoType; mono?: string | null }) {
  const s = mono
  switch (t) {
    case 'tree':
      return mono ? (
        <g fill={s!}><path d="M12 3 L7 10 H17 Z" /><path d="M12 8 L5.5 15 H18.5 Z" /><path d="M12 13 L4 21 H20 Z" /><rect x="10.5" y="20" width="3" height="2.5" /></g>
      ) : (
        <g><path d="M12 3 L7 10 H17 Z" fill={ICO.pine} /><path d="M12 8 L5.5 15 H18.5 Z" fill={ICO.pine} /><path d="M12 13 L4 21 H20 Z" fill={ICO.pine} /><rect x="10.5" y="20" width="3" height="2.5" fill={ICO.brown} /><path d="M12 1.6 l1 2.3 2.5 .2 -1.9 1.6 .6 2.4 -2.2 -1.3 -2.2 1.3 .6 -2.4 -1.9 -1.6 2.5 -.2 Z" fill={ICO.gold} /><circle cx="9.5" cy="12" r="1" fill={ICO.gold} /><circle cx="14" cy="16" r="1" fill={ICO.paper} /><circle cx="10.5" cy="18" r="1" fill={ICO.gold} /></g>
      )
    case 'gift':
      return mono ? (
        <g fill={s!}><rect x="4.5" y="9" width="15" height="11.5" rx="1" /><path d="M12 9 C 9.5 9 8.5 4.5 10.2 4.5 C 12 4.5 12 7 12 9 C 12 7 12 4.5 13.8 4.5 C 15.5 4.5 14.5 9 12 9 Z" /></g>
      ) : (
        <g><rect x="4.5" y="9" width="15" height="11.5" rx="1" fill={ICO.pine} /><rect x="11" y="9" width="2.2" height="11.5" fill={ICO.gold} /><rect x="4.5" y="13" width="15" height="2.2" fill={ICO.gold} /><path d="M12 9 C 9.5 9 8.5 4.5 10.2 4.5 C 12 4.5 12 7 12 9 C 12 7 12 4.5 13.8 4.5 C 15.5 4.5 14.5 9 12 9 Z" fill={ICO.gold} /></g>
      )
    case 'bauble':
      return mono ? (
        <g fill={s!}><circle cx="12" cy="14.5" r="6.3" /><rect x="10.5" y="6" width="3" height="2.6" /></g>
      ) : (
        <g><path d="M12 3.5 V6" stroke={ICO.pine} strokeWidth="1.2" fill="none" /><rect x="10.5" y="6" width="3" height="2.6" rx=".6" fill={ICO.pine} /><circle cx="12" cy="14.5" r="6.3" fill={ICO.gold} /><path d="M12 8.5 a6 6 0 0 1 4.6 9" stroke={ICO.paper} strokeWidth="1.1" fill="none" opacity=".8" /><circle cx="12" cy="14.5" r="6.3" fill="none" stroke={ICO.brown} strokeWidth=".5" opacity=".4" /></g>
      )
    case 'star':
      return <path d="M12 2.4 l2.7 6.2 6.7 .5 -5.1 4.4 1.6 6.6 -5.9 -3.5 -5.9 3.5 1.6 -6.6 -5.1 -4.4 6.7 -.5 Z" fill={mono ? s! : ICO.gold} />
    case 'hat':
      return mono ? (
        <g fill={s!}><path d="M3.5 16.5 C 6 6 17 5 20.5 15.5 Z" /><rect x="2.5" y="16" width="19" height="3" rx="1.5" /><circle cx="20.5" cy="6.5" r="2.3" /></g>
      ) : (
        <g><path d="M3.5 16.5 C 6 6 17 5 20.5 15.5 Z" fill={ICO.gold} /><rect x="2.5" y="16" width="19" height="3" rx="1.5" fill={ICO.paper} /><circle cx="20.5" cy="6.5" r="2.3" fill={ICO.paper} /></g>
      )
    case 'cane':
      return mono ? (
        <path d="M9 21 V11 A3.6 3.6 0 0 1 16.2 11" fill="none" stroke={s!} strokeWidth="3.2" strokeLinecap="round" />
      ) : (
        <g fill="none" strokeLinecap="round"><path d="M9 21 V11 A3.6 3.6 0 0 1 16.2 11" stroke={ICO.gold} strokeWidth="3.4" /><path d="M9 21 V11 A3.6 3.6 0 0 1 16.2 11" stroke={ICO.red} strokeWidth="3.4" strokeDasharray="2.4 4" /></g>
      )
    case 'snow':
      return mono ? (
        <g fill={s!}><circle cx="12" cy="16.5" r="4.8" /><circle cx="12" cy="8.8" r="3.5" /></g>
      ) : (
        <g><circle cx="12" cy="16.5" r="4.8" fill={ICO.paper} stroke={ICO.pine} strokeWidth=".6" /><circle cx="12" cy="8.8" r="3.5" fill={ICO.paper} stroke={ICO.pine} strokeWidth=".6" /><rect x="8.5" y="12" width="7" height="1.8" rx=".9" fill={ICO.red} /><circle cx="10.8" cy="8.2" r=".6" fill={ICO.pine} /><circle cx="13.2" cy="8.2" r=".6" fill={ICO.pine} /><path d="M12 9.4 l2.2 .6 -2.2 .5 Z" fill={ICO.gold} /></g>
      )
    case 'holly':
      return mono ? (
        <g fill={s!}><path d="M12 13 C 8.5 9.5 8.5 5.5 12 7 C 15.5 5.5 15.5 9.5 12 13 Z" /><circle cx="10.4" cy="14.6" r="1.5" /><circle cx="13.6" cy="14.6" r="1.5" /><circle cx="12" cy="16.4" r="1.5" /></g>
      ) : (
        <g><path d="M12 13 C 8.5 9.5 8.5 5.5 12 7 C 15.5 5.5 15.5 9.5 12 13 Z" fill={ICO.pine} /><circle cx="10.4" cy="14.6" r="1.6" fill={ICO.gold} /><circle cx="13.6" cy="14.6" r="1.6" fill={ICO.red} /><circle cx="12" cy="16.4" r="1.6" fill={ICO.gold} /></g>
      )
    case 'santa':
      return (
        <g>
          <path d="M6 12.8 C 6 19.2 18 19.2 18 12.8 C 18 16.8 15.5 19 12 19 C 8.5 19 6 16.8 6 12.8 Z" fill="#F7F3EC" />
          <ellipse cx="12" cy="12.4" rx="6.4" ry="5.9" fill="#F4CBA6" />
          <path d="M5.4 9.8 C 7 4.8 17 4.8 18.6 9.8 Z" fill="#7A1420" />
          <path d="M12 5.2 C 15 3.8 17.6 4.4 18.8 5.8" fill="none" stroke="#7A1420" strokeWidth="2.6" strokeLinecap="round" />
          <rect x="4.6" y="9.2" width="14.8" height="2.8" rx="1.4" fill="#F7F3EC" />
          <circle cx="18.9" cy="5.6" r="1.9" fill="#F7F3EC" />
          <circle cx="10" cy="12" r=".9" fill="#3A2A24" />
          <circle cx="14" cy="12" r=".9" fill="#3A2A24" />
          <circle cx="8.5" cy="13.9" r="1.5" fill="#EC9E93" opacity=".75" />
          <circle cx="15.5" cy="13.9" r="1.5" fill="#EC9E93" opacity=".75" />
          <circle cx="12" cy="13.4" r="1.2" fill="#E8897A" />
          <path d="M12 14.9 C 11 15.9 9.6 15.6 9.2 14.9 C 10 15.7 11.2 15.6 12 15 C 12.8 15.6 14 15.7 14.8 14.9 C 14.4 15.6 13 15.9 12 14.9 Z" fill="#F7F3EC" />
        </g>
      )
    case 'bell':
      return (
        <g>
          <path d="M12 3.6 C 8.2 3.6 7.2 7 7.2 11 C 7.2 15 5.6 16.4 5 17.6 L 19 17.6 C 18.4 16.4 16.8 15 16.8 11 C 16.8 7 15.8 3.6 12 3.6 Z" fill="#E8B84B" />
          <circle cx="12" cy="3" r="1.4" fill="#E8B84B" />
          <circle cx="12" cy="19.4" r="1.9" fill="#7A1420" />
        </g>
      )
    case 'sock':
      return (
        <g>
          <path d="M9 6.5 L9 13 C 9 15 7 15.6 6 17 C 4.9 18.6 6 20.6 8.6 20.6 C 10.6 20.6 12.2 19 14.6 17.6 C 16 16.6 16 15 16 13 L16 6.5 Z" fill="#7A1420" />
          <rect x="8.4" y="4.4" width="8.2" height="3" rx="1.3" fill="#F7F3EC" />
        </g>
      )
    case 'flake':
      return (
        <g stroke="#F7F3EC" strokeWidth="1.4" strokeLinecap="round" fill="none">
          <path d="M12 3 V21 M3 12 H21 M5.6 5.6 L18.4 18.4 M18.4 5.6 L5.6 18.4" />
          <path d="M12 6.5 l-2 -1.8 M12 6.5 l2 -1.8 M12 17.5 l-2 1.8 M12 17.5 l2 1.8 M6.5 12 l-1.8 -2 M6.5 12 l-1.8 2 M17.5 12 l1.8 -2 M17.5 12 l1.8 2" />
        </g>
      )
    case 'mitten':
      return (
        <g>
          <path d="M9 6 L15 6 C 15.6 6 16 6.5 16 8 C 16 8.8 16 9.4 16 10 C 18 9.5 19.5 11 19.5 12.8 C 19.5 14.6 18 15.5 16 15 L16 18 L8 18 L8 7 C 8 6.4 8.4 6 9 6 Z" fill="#7A1420" />
          <rect x="7.4" y="18" width="9.2" height="2.6" rx="1.1" fill="#F7F3EC" />
        </g>
      )
    default:
      return null
  }
}

// ── 크리스마스 장식 스캐터 (모서리/가장자리에 배치, 텍스트는 비워둠) ──
interface DecoItem {
  t: IcoType
  x: number | string
  y: number | string
  s: number
  r: number
}

const LAYOUTS: DecoItem[][] = [
  [{ t: 'tree', x: 9, y: 44, s: 40, r: -8 }, { t: 'bell', x: 91, y: 42, s: 30, r: 8 }, { t: 'cane', x: 9, y: 68, s: 30, r: 12 }, { t: 'holly', x: 90, y: 70, s: 32, r: 0 }, { t: 'mitten', x: 9, y: 90, s: 28, r: 6 }, { t: 'bauble', x: 91, y: 88, s: 30, r: 0 }],
  [{ t: 'holly', x: 9, y: 10, s: 32, r: 8 }, { t: 'bell', x: 91, y: 12, s: 30, r: 0 }, { t: 'star', x: 92, y: 46, s: 26, r: 0 }, { t: 'gift', x: 8, y: 44, s: 34, r: -8 }, { t: 'flake', x: 90, y: 78, s: 30, r: 0 }],
  [{ t: 'bell', x: 8, y: 12, s: 32, r: -8 }, { t: 'bauble', x: 91, y: 12, s: 30, r: 0 }, { t: 'star', x: 92, y: 46, s: 26, r: 0 }, { t: 'cane', x: 8, y: 80, s: 30, r: 12 }, { t: 'gift', x: 91, y: 78, s: 34, r: 8 }],
  [{ t: 'sock', x: 8, y: 12, s: 32, r: 8 }, { t: 'snow', x: 91, y: 20, s: 36, r: 0 }, { t: 'cane', x: 9, y: 58, s: 28, r: 12 }, { t: 'star', x: 92, y: 72, s: 26, r: 0 }, { t: 'bauble', x: 10, y: 84, s: 30, r: 0 }, { t: 'flake', x: 90, y: 46, s: 28, r: 0 }],
]

interface DecoProps {
  seed?: number
  tone?: 'paper' | 'red' | 'green'
  items?: DecoItem[] | null
}

// ── 모달 셸 (크래프트지 질감) ──────────────────────────────────────
export function Modal({ onClose, children, title }: { onClose: () => void; children: ReactNode; title?: ReactNode }) {
  return (
    <div
      className="ss-overlay"
      style={{ background: 'rgba(20,6,8,.82)', padding: 24 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="presentation"
    >
      <div className="testo-modal" role="dialog" aria-modal="true">
        <button type="button" onClick={onClose} aria-label="닫기" className="modal-x" style={{ color: TESTO.red }}>×</button>
        {title && <h3 style={{ ...pen(34, TESTO.red), textAlign: 'center', margin: '0 0 18px' }}>{title}</h3>}
        {children}
      </div>
    </div>
  )
}

export function Deco({ seed = 0, tone = 'paper', items = null }: DecoProps) {
  let its = items ?? undefined
  if (!its) {
    its = LAYOUTS[seed % LAYOUTS.length]
    if (tone === 'paper') its = its.filter((it) => it.t !== 'snow' && it.t !== 'flake')
  }
  const op = tone === 'paper' ? 0.72 : 0.62
  const u = (v: number | string) => (typeof v === 'number' ? `${v}%` : v)
  return (
    <div className="xmas-deco" aria-hidden="true">
      {its.map((it, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          width={it.s}
          height={it.s}
          style={{ position: 'absolute', left: u(it.x), top: u(it.y), transform: `translate(-50%,-50%) rotate(${it.r}deg)`, opacity: op }}
        >
          <Ico t={it.t} mono={null} />
        </svg>
      ))}
    </div>
  )
}
