import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { WeddingData } from '@/types'
import { Theme } from '@/themes'
import { getOptimizedUrl } from '@/lib/cloudinary'
import { DEFAULT_WEDDING_PHOTO } from '@/data/wedding'
import SectionHeading from '@/components/ui/SectionHeading'
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from '@/components/ui/Icons'

interface Props {
  data: WeddingData
  theme: Theme
}

export default function Gallery({ data, theme }: Props) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const photos = data.galleryPhotos.length > 0
    ? data.galleryPhotos
    : [data.mainPhoto || DEFAULT_WEDDING_PHOTO]
  const total = photos.length

  useEffect(() => {
    if (selectedIdx !== null) {
      const orig = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = orig
      }
    }
  }, [selectedIdx])

  const go = (next: number) => {
    setDirection(next > index ? 1 : -1)
    setIndex((next + total) % total)
  }

  return (
    <section className="invitation-section theme-bg-alt overflow-hidden" style={{ color: theme.colors.text }}>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.75 }}
      >
        <SectionHeading label="Our Moments" title="우리의 순간" />

        <div className="relative mx-auto max-w-[390px]">
          <div
            className="relative aspect-[3/4] overflow-hidden bg-white"
            style={{ borderRadius: '3px' }}
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.button
                type="button"
                key={index}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 40 : direction < 0 ? -40 : 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -40 : direction < 0 ? 40 : 0 }}
                transition={{ duration: 0.42, ease: 'easeOut' }}
                className="absolute inset-0 block h-full w-full"
                onClick={() => setSelectedIdx(index)}
                aria-label={`${index + 1}번째 사진 크게 보기`}
              >
                <img
                  src={getOptimizedUrl(photos[index], { width: 840, quality: 'auto:best' })}
                  alt={`웨딩 사진 ${index + 1}`}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable={false}
                  className="h-full w-full object-cover"
                />
              </motion.button>
            </AnimatePresence>

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(index - 1)}
                  aria-label="이전 사진"
                  className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/88"
                  style={{ color: theme.colors.accent }}
                >
                  <ChevronLeftIcon className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={() => go(index + 1)}
                  aria-label="다음 사진"
                  className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/88"
                  style={{ color: theme.colors.accent }}
                >
                  <ChevronRightIcon className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          {total > 1 && (
            <div className="mt-5 flex gap-2 overflow-x-auto pb-2" aria-label="갤러리 사진 목록">
              {photos.map((photo, photoIndex) => (
                <button
                  type="button"
                  key={`${photo}-${photoIndex}`}
                  onClick={() => go(photoIndex)}
                  aria-label={`${photoIndex + 1}번째 사진`}
                  aria-current={photoIndex === index}
                  className="h-[68px] w-[54px] shrink-0 overflow-hidden border-2"
                  style={{ borderColor: photoIndex === index ? theme.colors.accent : 'transparent' }}
                >
                  <img
                    src={getOptimizedUrl(photo, { width: 160 })}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <p className="mt-5 text-center font-heading text-[15px] tracking-[0.18em]">
            <span style={{ color: theme.colors.accent }}>{String(index + 1).padStart(2, '0')}</span>
            <span className="mx-2" style={{ color: theme.colors.border }}>/</span>
            {String(total).padStart(2, '0')}
          </p>
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIdx(null)}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-[#111511]/95 p-5"
            role="dialog"
            aria-modal="true"
            aria-label="사진 크게 보기"
          >
            <button
              type="button"
              onClick={() => setSelectedIdx(null)}
              aria-label="사진 닫기"
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center text-white"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
            <img
              src={getOptimizedUrl(photos[selectedIdx], { width: 1200, quality: 'auto:best' })}
              alt={`웨딩 사진 ${selectedIdx + 1} 확대`}
              className="max-h-full max-w-full object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
