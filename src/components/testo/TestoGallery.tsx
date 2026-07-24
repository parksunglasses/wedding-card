import { useState } from 'react'
import { motion } from 'framer-motion'
import { WeddingData } from '@/types'
import { getOptimizedUrl } from '@/lib/cloudinary'
import { DEFAULT_WEDDING_PHOTO } from '@/data/wedding'
import { Heart, Snowfall, TESTO, pen } from './TestoKit'
import PhotoSlideshow, { SlideshowTheme } from '@/components/PhotoSlideshow'

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
  font: "'Nanum Brush Script', cursive",
  radius: 8,
}

export default function TestoGallery({ data }: Props) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const photos = data.galleryPhotos.length > 0
    ? data.galleryPhotos
    : [data.mainPhoto || DEFAULT_WEDDING_PHOTO]
  const strip = [photos[0], photos[1] ?? photos[0]]

  return (
    <>
      <section className="testo-paper-red relative px-8 pb-14 pt-11 text-center" style={{ color: TESTO.paper }}>
        <div className="flex justify-center gap-5">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="px-[9px] pb-[26px] pt-[9px]"
            style={{ background: TESTO.paper, transform: 'rotate(-4deg)', boxShadow: '0 10px 22px rgba(0,0,0,.3)' }}
          >
            <img
              src={getOptimizedUrl(strip[0], { width: 400 })}
              alt="웨딩 스냅 1"
              loading="lazy"
              className="block h-[170px] w-[140px] object-cover"
            />
          </motion.div>
          <Heart size={34} variant="scribble" color={TESTO.paper} className="mt-[70px]" />
        </div>

        <p className="mt-[26px] m-0 flex items-center justify-center gap-2" style={pen(40)}>
          {data.groom.name} + {data.bride.name} =
          <Heart size={30} variant="outline" color={TESTO.paper} />
        </p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-[18px] flex justify-center"
        >
          <div
            className="px-[9px] pb-[26px] pt-[9px]"
            style={{ background: TESTO.paper, transform: 'rotate(3deg)', boxShadow: '0 10px 22px rgba(0,0,0,.3)' }}
          >
            <img
              src={getOptimizedUrl(strip[1], { width: 400 })}
              alt="웨딩 스냅 2"
              loading="lazy"
              className="block h-[150px] w-[170px] object-cover"
            />
          </div>
        </motion.div>

        <button type="button" onClick={() => { setIndex(0); setOpen(true) }} className="testo-pill mt-[26px]" style={{ background: TESTO.paper, color: TESTO.red, boxShadow: '0 6px 14px rgba(0,0,0,.25)' }}>
          사진 더 보기
        </button>
      </section>

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
    </>
  )
}
