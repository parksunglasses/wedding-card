import { useState } from 'react'
import { motion } from 'framer-motion'
import { WeddingData } from '@/types'
import { getOptimizedUrl } from '@/lib/cloudinary'
import { DEFAULT_WEDDING_PHOTO } from '@/data/wedding'
import { DOODLE, Heart, Snowfall, pen } from './DoodleKit'
import PhotoSlideshow, { SlideshowTheme } from '@/components/PhotoSlideshow'

interface Props {
  data: WeddingData
}

const DOODLE_SLIDE: SlideshowTheme = {
  sheet: DOODLE.cream,
  paper: DOODLE.paper,
  red: DOODLE.red,
  ink: DOODLE.ink,
  border: DOODLE.border,
  overlay: 'rgba(30,10,8,.90)',
  font: "'Nanum Pen Script', cursive",
  radius: 16,
}

export default function DoodleGallery({ data }: Props) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const photos = data.galleryPhotos.length > 0
    ? data.galleryPhotos
    : [data.mainPhoto || DEFAULT_WEDDING_PHOTO]

  const polaroids = [photos[0], photos[1] ?? photos[0]]

  return (
    <>
      <section
        className="relative overflow-hidden px-8 pb-14 pt-12 text-center"
        style={{ background: DOODLE.red, color: DOODLE.cream }}
      >
        <Snowfall distance={520} color={DOODLE.cream} opacity={0.7} count={3} />

        <p className="relative m-0 mb-6" style={pen(32)}>
          우리의 겨울 이야기 ❄
        </p>

        <div className="relative flex items-start justify-center gap-5">
          {polaroids.map((photo, i) => (
            <motion.div
              key={i}
              // 회전값은 애니메이션 transform에 덮이지 않도록 함께 지정한다.
              initial={{ opacity: 0, y: 20, rotate: i === 0 ? -4 : 3 }}
              whileInView={{ opacity: 1, y: 0, rotate: i === 0 ? -4 : 3 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="px-2.5 pb-7 pt-2.5"
              style={{
                background: DOODLE.cream,
                marginTop: i === 1 ? 28 : 0,
                boxShadow: '0 10px 24px rgba(0,0,0,.25)',
              }}
            >
              <img
                src={getOptimizedUrl(photo, { width: 400 })}
                alt={`웨딩 스냅 ${i + 1}`}
                loading="lazy"
                className="block h-[180px] w-[min(150px,34vw)] object-cover"
              />
            </motion.div>
          ))}
        </div>

        <p className="relative mt-7 flex items-center justify-center gap-2" style={pen(34)}>
          <span>
            {data.groom.name} + {data.bride.name} =
          </span>
          <Heart size={26} filled={false} color={DOODLE.cream} />
        </p>

        <button
          type="button"
          onClick={() => { setIndex(0); setOpen(true) }}
          className="doodle-pill relative mt-5"
          style={{ background: DOODLE.cream, color: DOODLE.red, boxShadow: '0 6px 16px rgba(0,0,0,.25)' }}
        >
          📷 더 많은 사진 보기
        </button>
      </section>

      {open && (
        <PhotoSlideshow
          photos={photos}
          index={index}
          setIndex={setIndex}
          onClose={() => setOpen(false)}
          theme={DOODLE_SLIDE}
          snow={<Snowfall distance={640} color={DOODLE.creamAlt} opacity={0.7} count={4} />}
        />
      )}
    </>
  )
}
