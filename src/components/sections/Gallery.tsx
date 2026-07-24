import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WeddingData } from '@/types'
import { Theme } from '@/themes'
import { getOptimizedUrl } from '@/lib/cloudinary'

interface Props {
  data: WeddingData
  theme: Theme
}

export default function Gallery({ data, theme }: Props) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(0)

  const photos = data.galleryPhotos.length > 0 ? data.galleryPhotos : Array(5).fill('')
  const total = photos.length
  const hasPhotos = data.galleryPhotos.length > 0

  const go = (next: number) => {
    setDir(next > index ? 1 : -1)
    setIndex((next + total) % total)
  }

  return (
    <section className="theme-bg py-20 px-6" style={{ color: theme.colors.text }}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-10"
      >
        <p className="font-heading text-xs tracking-[0.4em] mb-2 uppercase" style={{ color: theme.colors.accent }}>
          Gallery
        </p>
        <h2 className="font-heading text-2xl">우리의 순간</h2>
      </motion.div>

      <div className="max-w-md mx-auto">
        {/* 슬라이더 */}
        <div
          className="relative aspect-[3/4] rounded-2xl overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${theme.colors.bgAlt}, ${theme.colors.border})` }}
        >
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.div
              key={index}
              custom={dir}
              initial={{ opacity: 0, x: dir >= 0 ? 60 : -60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir >= 0 ? -60 : 60 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="absolute inset-0"
              drag={total > 1 ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) go(index + 1)
                else if (info.offset.x > 60) go(index - 1)
              }}
              onClick={() => hasPhotos && setSelectedIdx(index)}
            >
              {photos[index] && (
                <img
                  src={getOptimizedUrl(photos[index], { width: 640 })}
                  alt={`웨딩 사진 ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="w-full h-full object-cover"
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* 좌우 화살표 */}
          {total > 1 && (
            <>
              <button
                onClick={() => go(index - 1)}
                aria-label="이전 사진"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-lg z-10"
                style={{ background: 'rgba(255,255,255,0.55)', color: theme.colors.text }}
              >
                ‹
              </button>
              <button
                onClick={() => go(index + 1)}
                aria-label="다음 사진"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-lg z-10"
                style={{ background: 'rgba(255,255,255,0.55)', color: theme.colors.text }}
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* 카운터 */}
        <p className="text-center text-xs tracking-widest mt-4" style={{ color: theme.colors.textMuted }}>
          <span style={{ color: theme.colors.accent }}>{index + 1}</span> / {total}
        </p>

        {/* 도트 */}
        {total > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`${i + 1}번째 사진`}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === index ? 16 : 6,
                  background: i === index ? theme.colors.accent : theme.colors.border,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIdx(null)}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          >
            <button
              onClick={() => setSelectedIdx(null)}
              className="absolute top-6 right-6 text-white text-3xl z-10"
            >
              ×
            </button>
            <img
              src={getOptimizedUrl(photos[selectedIdx], { width: 800 })}
              alt={`웨딩 사진 ${selectedIdx + 1} 확대`}
              className="max-w-full max-h-full object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
