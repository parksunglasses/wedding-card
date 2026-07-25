import { WeddingData } from '@/types'
import { DEFAULT_WEDDING_PHOTO } from '@/data/wedding'
import { TESTO, pen, Photo, Heart, Snowfall, Deco, Ico } from './TestoKit'
import { TESTO_TEXT } from './testoData'

interface Props {
  data: WeddingData
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

const SCATTERED = [
  { size: 28, left: 30, top: 42, rotate: -12, scribble: false },
  { size: 42, left: 90, top: 12, rotate: -7, scribble: true },
  { size: 58, left: 151, top: 16, rotate: 7, scribble: true },
  { size: 30, left: 225, top: 10, rotate: 11, scribble: false },
  { size: 40, left: 280, top: 38, rotate: -5, scribble: true },
  { size: 24, left: 10, top: 68, rotate: -3, scribble: true },
]

function Chrys({ size = 18, color = TESTO.muted }: { size?: number; color?: string }) {
  const petals = [0, 45, 90, 135, 180, 225, 270, 315]
  return (
    <svg className="chrys" viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <g fill={color}>
        {petals.map((rot, i) => {
          const a = (rot * Math.PI) / 180
          return <circle key={i} cx={12 + 6.5 * Math.cos(a)} cy={12 + 6.5 * Math.sin(a)} r="3" />
        })}
        <circle cx="12" cy="12" r="3.3" />
      </g>
    </svg>
  )
}

export default function TestoHero({ data }: Props) {
  const photo = data.mainPhoto || data.galleryPhotos[0] || DEFAULT_WEDDING_PHOTO
  const [y, m, d] = TESTO_TEXT.date.split('-').map(Number)
  const dow = WEEKDAYS[new Date(y, m - 1, d).getDay()]
  const [hh, mi] = TESTO_TEXT.time.split(':')
  const ampm = Number(hh) < 12 ? 'am' : 'pm'

  return (
    <section className="testo-paper hero testo-hero-intro">
      <svg className="hero-script" viewBox="0 0 430 168" aria-label="We're Getting Married!">
        <defs>
          <path id="arc1" d="M14 76 Q215 44 416 76" fill="none" />
          <path id="arc2" d="M84 150 Q215 120 346 150" fill="none" />
        </defs>
        <text textAnchor="middle" fill={TESTO.red} fontSize="68" style={{ fontFamily: "'Dancing Script', cursive", fontWeight: 700 }}>
          <textPath href="#arc1" startOffset="50%">We&rsquo;re Getting</textPath>
        </text>
        <text textAnchor="middle" fill={TESTO.red} fontSize="68" style={{ fontFamily: "'Dancing Script', cursive", fontWeight: 700 }}>
          <textPath href="#arc2" startOffset="50%">Married!</textPath>
        </text>
      </svg>

      <div className="hero-photos">
        {SCATTERED.map((h, i) => (
          <Heart key={i} size={h.size} variant={h.scribble ? 'scribble' : 'outline'} rotate={h.rotate} style={{ position: 'absolute', left: h.left, top: h.top }} />
        ))}
        <p className="hero-tag-l" style={{ ...pen(32, TESTO.red), fontFamily: '"Nanum Brush Script", cursive', transform: 'rotate(-6deg)' }}>{TESTO_TEXT.groom.nameEn}</p>
        <p className="hero-tag-r" style={{ ...pen(32, TESTO.red), fontFamily: '"Nanum Brush Script", cursive', transform: 'rotate(6deg)' }}>{TESTO_TEXT.bride.nameEn}</p>
        <div className="hero-pair">
          <Photo src={photo} w={295} h={325} radius={12} alt="메인 웨딩 사진" />
        </div>
      </div>

      <div className="hero-greet">
        <div className="hero-date-wrap">
          <h2 className="hero-date">
            {y}.{String(m).padStart(2, '0')}.{String(d).padStart(2, '0')} ({dow})
            <span className="hero-time">{hh}:{mi}<span className="ampm">{ampm}</span></span>
          </h2>
        </div>
        <div className="hero-parents">
          <p>{TESTO_TEXT.groom.father} · <span className="chrys-wrap"><Chrys />{TESTO_TEXT.groom.mother}</span>의 장남 <span className="pname">{TESTO_TEXT.groom.given}</span></p>
          <p>{TESTO_TEXT.bride.father} · {TESTO_TEXT.bride.mother}의 장녀 <span className="pname">{TESTO_TEXT.bride.given}</span></p>
        </div>
        <div className="hero-mid-tree">
          <svg viewBox="0 0 24 24" width={47} height={47} aria-hidden="true"><Ico t="santa" /></svg>
        </div>
        <div className="hero-intro">
          <span className="hero-intro-line">{data.greetingTitle || TESTO_TEXT.intro[0]}</span>
          <span className="hero-intro-line">{data.greetingMessage || TESTO_TEXT.intro[1]}</span>
        </div>
      </div>
    </section>
  )
}
