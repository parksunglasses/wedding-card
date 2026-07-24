// 레드두들 테마 공용 조각 — 손그림 느낌의 SVG 낙서와 눈 내림 효과
import type { CSSProperties, ReactNode } from 'react'

export const DOODLE = {
  cream: '#FAF3E4',
  creamAlt: '#F2E7D2',
  paper: '#FFFDF8',
  red: '#8C2321',
  redSoft: '#C0392B',
  green: '#1E4034',
  greenLine: '#2F5D45',
  greenSoft: '#3E6B52',
  gold: '#E8B84B',
  ink: '#3B2422',
  inkSoft: '#7A5C51',
  muted: '#A8867A',
  tan: '#C9A385',
  border: '#E2CBAF',
  snow: '#B8CBBE',
} as const

const PEN = { fontFamily: '"Nanum Pen Script", cursive' } as const

/** 손글씨 폰트를 쓰는 문구 (제목·버튼 등) */
export function pen(size: number, color?: string): CSSProperties {
  return { ...PEN, fontSize: size, lineHeight: 1.15, ...(color ? { color } : null) }
}

const FLAKES = [
  { left: '8%', size: 13, duration: 8, delay: 0 },
  { left: '26%', size: 10, duration: 11, delay: 2 },
  { left: '47%', size: 15, duration: 9, delay: 4 },
  { left: '66%', size: 11, duration: 10, delay: 1 },
  { left: '85%', size: 13, duration: 8.5, delay: 3 },
]

interface SnowfallProps {
  /** 눈이 떨어지는 거리(px) — 섹션 높이에 맞춘다 */
  distance?: number
  color?: string
  opacity?: number
  count?: number
}

export function Snowfall({ distance = 620, color = DOODLE.snow, opacity = 1, count = 5 }: SnowfallProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {FLAKES.slice(0, count).map((flake, index) => (
        <span
          key={index}
          className="doodle-flake"
          style={{
            left: flake.left,
            fontSize: flake.size,
            color,
            opacity,
            animationDuration: `${flake.duration}s`,
            animationDelay: `${flake.delay}s`,
            ['--doodle-fall' as string]: `${distance}px`,
          }}
        >
          ❄
        </span>
      ))}
    </div>
  )
}

interface GarlandProps {
  lineColor?: string
  bulbColors?: string[]
  className?: string
}

/** 전구가 매달린 가랜드 줄 */
export function Garland({
  lineColor = DOODLE.greenLine,
  bulbColors = [DOODLE.gold, DOODLE.red, DOODLE.gold, DOODLE.gold, DOODLE.red, DOODLE.gold],
  className,
}: GarlandProps) {
  const bulbs = [
    { cx: 52, cy: 37, delay: 0 },
    { cx: 118, cy: 47, delay: 0.4 },
    { cx: 184, cy: 36, delay: 0.9 },
    { cx: 250, cy: 15, delay: 0.2 },
    { cx: 316, cy: 13, delay: 1.2 },
    { cx: 378, cy: 31, delay: 0.7 },
  ]

  return (
    <svg viewBox="0 0 416 74" className={className} aria-hidden="true">
      <path
        d="M0 8 C 70 56, 140 56, 208 28 C 276 0, 346 0, 416 48"
        fill="none"
        stroke={lineColor}
        strokeWidth={2}
      />
      {bulbs.map((bulb, index) => (
        <circle
          key={index}
          cx={bulb.cx}
          cy={bulb.cy}
          r={5}
          fill={bulbColors[index % bulbColors.length]}
          className="doodle-twinkle"
          style={{ animationDelay: `${bulb.delay}s` }}
        />
      ))}
    </svg>
  )
}

interface SquiggleProps {
  width?: number
  color?: string
  className?: string
}

/** 제목 밑에 그어주는 물결선 */
export function Squiggle({ width = 90, color = DOODLE.red, className }: SquiggleProps) {
  return (
    <svg
      viewBox="0 0 90 12"
      width={width}
      height={12}
      className={className}
      style={{ display: 'block' }}
      aria-hidden="true"
    >
      <path
        d="M4 7 Q 15 2 26 7 T 48 7 T 70 7 T 86 7"
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </svg>
  )
}

interface HeartProps {
  size?: number
  color?: string
  filled?: boolean
  className?: string
  style?: CSSProperties
}

export function Heart({ size = 24, color = DOODLE.red, filled = true, className, style }: HeartProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M12 21s-8-5.3-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 5.7-8 11-8 11z"
        fill={filled ? color : 'none'}
        stroke={filled ? undefined : color}
        strokeWidth={filled ? undefined : 2.4}
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

/** 손글씨 제목 + 물결선 */
export function DoodleHeading({
  children,
  color = DOODLE.red,
  size = 38,
  squiggleWidth = 90,
  className,
}: HeadingProps) {
  return (
    <div className={`flex flex-col items-center ${className ?? ''}`}>
      <h2 className="m-0 font-normal" style={pen(size, color)}>
        {children}
      </h2>
      <Squiggle width={squiggleWidth} color={color} className="mt-1" />
    </div>
  )
}

/** 사탕 지팡이 줄무늬 구분선 */
export function CandyStripe() {
  return <div className="doodle-stripe" aria-hidden="true" />
}
