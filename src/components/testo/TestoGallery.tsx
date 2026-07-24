import { useState } from 'react'
import { WeddingData } from '@/types'
import { DEFAULT_WEDDING_PHOTO } from '@/data/wedding'
import { TESTO, pen, Photo, Deco } from './TestoKit'
import PhotoSlideshow, { SlideshowTheme } from '@/components/PhotoSlideshow'
import { Snowfall } from './TestoKit'

interface Props {
  data: WeddingData
}

const TESTO_SLIDE: SlideshowTheme = {
  sheet: TESTO.paper,
  paper: TESTO.paperAlt,
  red: TESTO.red,
  ink: TESTO.ink,
  border: TESTO.tan,
  overlay: 'rgba(20,6,8,.90)',
  font: "'Nanum Pen Script', cursive",
  radius: 8,
}

export default function TestoGallery({ data }: Props) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const photos = data.galleryPhotos.length > 0
    ? data.galleryPhotos
    : [data.mainPhoto || DEFAULT_WEDDING_PHOTO]
  const grid = photos.slice(0, 6)

  return (
    <section className="testo-paper gallery" style={{ color: TESTO.ink }}>
      <Deco tone="paper" items={[]} />
      <h2 className="gallery-title" style={pen(52, TESTO.red)}>갤러리</h2>
      <div className="gallery-grid">
        {grid.map((p, i) => (
          <button
            key={`${p}-${i}`}
            type="button"
            className="gallery-cell"
            onClick={() => { setIndex(i); setOpen(true) }}
            aria-label={`${i + 1}번째 사진 크게 보기`}
          >
            <Photo src={p} fill alt={`웨딩 사진 ${i + 1}`} />
          </button>
        ))}
      </div>
      <button type="button" onClick={() => { setIndex(0); setOpen(true) }} className="testo-pill mt-26">사진 더 보기</button>

      {open && (
        <PhotoSlideshow
          photos={photos}
          index={index}
          setIndex={setIndex}
          onClose={() => setOpen(false)}
          theme={TESTO_SLIDE}
          snow={<Snowfall distance={640} color={TESTO.snow} count={4} />}
        />
      )}
    </section>
  )
}
