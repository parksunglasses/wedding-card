import { ReactNode, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { getOptimizedUrl } from '@/lib/cloudinary'

export interface SlideshowTheme {
  sheet: string
  paper: string
  red: string
  ink: string
  border: string
  overlay: string
  font: string
  radius: number
}

interface Props {
  photos: string[]
  index: number
  setIndex: (updater: number | ((prev: number) => number)) => void
  onClose: () => void
  theme: SlideshowTheme
  title?: ReactNode
  snow?: ReactNode
  tilts?: number[]
}

const DEFAULT_TILTS = [-4, 3, -2.5, 2, -3, 3.5]

// 사진 더보기 슬라이드쇼 오버레이 — 큰 폴라로이드 + 화살표/스와이프 + 썸네일 스트립
export default function PhotoSlideshow({ photos, index, setIndex, onClose, theme, title, snow, tilts = DEFAULT_TILTS }: Props) {
  const total = photos.length
  const startX = useRef<number | null>(null)
  const stripRef = useRef<HTMLDivElement>(null)

  const nav = (d: number) => setIndex((prev) => (prev + d + total) % total)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') setIndex((prev) => (prev - 1 + total) % total)
      else if (e.key === 'ArrowRight') setIndex((prev) => (prev + 1) % total)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, setIndex, total])

  useEffect(() => {
    const el = stripRef.current?.querySelector('[data-active="true"]') as HTMLElement | null
    if (el) el.scrollIntoView({ inline: 'center', block: 'nearest' })
  }, [index])

  return createPortal(
    <div
      className="ss-overlay"
      style={{ background: theme.overlay, zIndex: 999999 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="사진 더보기"
    >
      <div className="ss-sheet" style={{ background: theme.sheet, borderRadius: theme.radius, color: theme.ink }}>
        {snow}

        <button className="ss-close" onClick={onClose} aria-label="닫기" style={{ color: theme.red, fontFamily: theme.font }}>
          ×
        </button>

        {title && <div className="ss-title">{title}</div>}

        <div
          className="ss-stage"
          onTouchStart={(e) => {
            startX.current = e.touches[0].clientX
          }}
          onTouchEnd={(e) => {
            if (startX.current == null) return
            const dx = e.changedTouches[0].clientX - startX.current
            if (dx < -50) nav(1)
            else if (dx > 50) nav(-1)
            startX.current = null
          }}
        >
          <button className="ss-arrow ss-arrow--prev" onClick={() => nav(-1)} aria-label="이전 사진" style={{ background: theme.red, color: theme.sheet }}>
            ‹
          </button>

          <div className="ss-polaroid" key={index} style={{ background: theme.paper, transform: `rotate(${tilts[index % tilts.length] * 0.5}deg)` }}>
            <img className="ss-photo" src={getOptimizedUrl(photos[index], { width: 900, quality: 'auto:best' })} alt={`웨딩 사진 ${index + 1}`} />
          </div>

          <button className="ss-arrow ss-arrow--next" onClick={() => nav(1)} aria-label="다음 사진" style={{ background: theme.red, color: theme.sheet }}>
            ›
          </button>
        </div>

        <p className="ss-count" style={{ fontFamily: theme.font, color: theme.red, fontSize: 24 }}>
          {index + 1} <span style={{ color: theme.border, margin: '0 6px' }}>/</span> {total}
        </p>

        <div className="ss-strip" ref={stripRef} aria-label="사진 목록">
          {photos.map((p, i) => (
            <button
              key={`${p}-${i}`}
              data-active={i === index}
              onClick={() => setIndex(i)}
              className={'ss-thumb' + (i === index ? ' is-active' : '')}
              aria-label={`${i + 1}번째 사진`}
              style={{ borderColor: i === index ? theme.red : 'transparent', transform: `rotate(${tilts[i % tilts.length] * 0.6}deg)` }}
            >
              <img src={getOptimizedUrl(p, { width: 160 })} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  )
}
