// 테스토 테마 공용 조각 — 크래프트지 질감, 낙서 하트, 찢어진 종이 구분선
import { useId } from 'react'
import type { CSSProperties, ReactNode } from 'react'

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
