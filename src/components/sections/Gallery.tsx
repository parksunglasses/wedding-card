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

  const photos = data.galleryPhotos.length > 0
    ? data.galleryPhotos
    : Array(6).fill('')

  return (
    <section className="theme-bg-dark py-16 px-6" style={{ color: theme.colors.bg }}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-10"
      >
        <p className="font-heading text-xs tracking-[0.4em] mb-2 uppercase" style={{ color: theme.colors.accentLight }}>
          Gallery
        </p>
        <h2 className="font-heading text-2xl">우리의 순간</h2>
      </motion.div>

      <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
        {photos.map((photo, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            onClick={() => photo && setSelectedIdx(idx)}
            className="aspect-[3/4] rounded-lg overflow-hidden cursor-pointer bg-cover bg-center"
            style={{
              backgroundImage: photo
                ? `url(${getOptimizedUrl(photo, { width: 600 })})`
                : `linear-gradient(135deg, ${theme.colors.accentLight}, ${theme.colors.accent})`,
            }}
          />
        ))}
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
              src={getOptimizedUrl(photos[selectedIdx], { width: 1200 })}
              alt=""
              className="max-w-full max-h-full object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
