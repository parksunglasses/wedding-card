import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { WeddingData } from '@/types'
import { getOptimizedUrl } from '@/lib/cloudinary'
import { DEFAULT_WEDDING_PHOTO } from '@/data/wedding'
import { Heart, TESTO, TestoHeading, pen } from './TestoKit'

interface Props {
  data: WeddingData
}

const TILT = [0, -1.5, 1.5, 1, -1]

export default function TestoGallery({ data }: Props) {
  const [showGallery, setShowGallery] = useState(false)

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

        <button type="button" onClick={() => setShowGallery(true)} className="testo-pill mt-[26px]" style={{ background: TESTO.paper, color: TESTO.red, boxShadow: '0 6px 14px rgba(0,0,0,.25)' }}>
          사진 더 보기
        </button>
      </section>

      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(event) => event.target === event.currentTarget && setShowGallery(false)}
            className="fixed inset-0 z-[70] flex items-center justify-center p-6"
            style={{ background: 'rgba(20,6,8,.85)' }}
            role="dialog"
            aria-modal="true"
            aria-label="사진 모아보기"
          >
            <motion.div
              initial={{ scale: 0.94, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 16 }}
              className="testo-paper relative max-h-[88vh] w-full max-w-[440px] overflow-y-auto px-[22px] pb-8 pt-7 text-center"
              style={{ borderRadius: 10, color: TESTO.ink }}
            >
              <button
                type="button"
                onClick={() => setShowGallery(false)}
                aria-label="닫기"
                className="absolute right-3.5 top-3 text-[28px] leading-none"
                style={{ color: TESTO.red }}
              >
                ×
              </button>

              <TestoHeading size={36} squiggleWidth={110} className="mb-[18px]">우리의 순간들</TestoHeading>

              <div className="grid grid-cols-2 gap-3">
                {photos.map((photo, index) => {
                  const wide = index % 5 === 0
                  return (
                    <div
                      key={`${photo}-${index}`}
                      className="min-w-0 overflow-hidden px-2 pb-[22px] pt-2"
                      style={{
                        gridColumn: wide ? '1 / -1' : undefined,
                        background: TESTO.paperAlt,
                        boxShadow: '0 4px 10px rgba(0,0,0,.12)',
                        transform: wide ? undefined : `rotate(${TILT[index % TILT.length]}deg)`,
                      }}
                    >
                      <img
                        src={getOptimizedUrl(photo, { width: 600 })}
                        alt={`웨딩 사진 ${index + 1}`}
                        loading="lazy"
                        className="block w-full object-cover"
                        style={{ height: wide ? 220 : 180 }}
                      />
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
