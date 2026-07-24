import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { WeddingData } from '@/types'
import { getOptimizedUrl } from '@/lib/cloudinary'
import { DEFAULT_WEDDING_PHOTO } from '@/data/wedding'
import { DOODLE, Heart, Snowfall, Squiggle, pen } from './DoodleKit'

interface Props {
  data: WeddingData
}

const TILT = ['-1deg', '1.5deg', '1deg', '-1.5deg']

export default function DoodleGallery({ data }: Props) {
  const [showGrid, setShowGrid] = useState(false)
  const [zoomIndex, setZoomIndex] = useState<number | null>(null)

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
          {polaroids.map((photo, index) => (
            <motion.div
              key={index}
              // 회전값은 애니메이션 transform에 덮이지 않도록 함께 지정한다.
              initial={{ opacity: 0, y: 20, rotate: index === 0 ? -4 : 3 }}
              whileInView={{ opacity: 1, y: 0, rotate: index === 0 ? -4 : 3 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              className="px-2.5 pb-7 pt-2.5"
              style={{
                background: DOODLE.cream,
                marginTop: index === 1 ? 28 : 0,
                boxShadow: '0 10px 24px rgba(0,0,0,.25)',
              }}
            >
              <img
                src={getOptimizedUrl(photo, { width: 400 })}
                alt={`웨딩 스냅 ${index + 1}`}
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
          onClick={() => setShowGrid(true)}
          className="doodle-pill relative mt-5"
          style={{ background: DOODLE.cream, color: DOODLE.red, boxShadow: '0 6px 16px rgba(0,0,0,.25)' }}
        >
          📷 더 많은 사진 보기
        </button>
      </section>

      <AnimatePresence>
        {showGrid && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(event) => event.target === event.currentTarget && setShowGrid(false)}
            className="fixed inset-0 z-[70] flex items-center justify-center p-6"
            style={{ background: 'rgba(30,10,8,.82)' }}
            role="dialog"
            aria-modal="true"
            aria-label="사진 모아보기"
          >
            <motion.div
              initial={{ scale: 0.94, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 16 }}
              className="relative max-h-[88vh] w-full max-w-[440px] overflow-y-auto px-5 pb-8 pt-7 text-center"
              style={{ background: DOODLE.cream, borderRadius: 20, color: DOODLE.ink }}
            >
              <button
                type="button"
                onClick={() => setShowGrid(false)}
                aria-label="닫기"
                className="absolute right-3 top-2 h-9 w-9 text-[28px] leading-none"
                style={{ color: DOODLE.red }}
              >
                ×
              </button>

              <h3 className="m-0" style={pen(36, DOODLE.red)}>우리의 순간들</h3>
              <Squiggle width={90} className="mx-auto mb-4 mt-1" />

              <div className="grid grid-cols-2 gap-3">
                {photos.map((photo, index) => {
                  const wide = index % 5 === 0
                  return (
                    <button
                      type="button"
                      key={`${photo}-${index}`}
                      onClick={() => setZoomIndex(index)}
                      aria-label={`${index + 1}번째 사진 크게 보기`}
                      className="min-w-0 overflow-hidden"
                      style={{
                        gridColumn: wide ? '1 / -1' : undefined,
                        border: `3px solid ${DOODLE.red}`,
                        borderRadius: 12,
                        transform: wide ? undefined : `rotate(${TILT[index % TILT.length]})`,
                      }}
                    >
                      <img
                        src={getOptimizedUrl(photo, { width: 600 })}
                        alt={`웨딩 사진 ${index + 1}`}
                        loading="lazy"
                        className="block w-full object-cover"
                        style={{ height: wide ? 240 : 200 }}
                      />
                    </button>
                  )
                })}
              </div>

              <p className="mt-4" style={pen(22, DOODLE.red)}>봐주셔서 고마워요 ♥</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {zoomIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomIndex(null)}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-[#1E0A08]/95 p-5"
            role="dialog"
            aria-modal="true"
            aria-label="사진 확대"
          >
            <button
              type="button"
              onClick={() => setZoomIndex(null)}
              aria-label="확대 닫기"
              className="absolute right-5 top-5 h-11 w-11 text-[30px] leading-none"
              style={{ color: DOODLE.cream }}
            >
              ×
            </button>
            <img
              src={getOptimizedUrl(photos[zoomIndex], { width: 1200, quality: 'auto:best' })}
              alt={`웨딩 사진 ${zoomIndex + 1} 확대`}
              className="max-h-full max-w-full object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
