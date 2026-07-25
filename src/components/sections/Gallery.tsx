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
  const [albumOpen, setAlbumOpen] = useState(false)
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState<number | null>(null)
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
    <section className="py-12 px-6" style={{ background: '#FCFBF7', color: theme.colors.text }}>
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
          className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
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
              onClick={() => {
                if (hasPhotos) {
                  setAlbumOpen(true)
                }
              }}
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
                onClick={(e) => {
                  e.stopPropagation()
                  go(index - 1)
                }}
                aria-label="이전 사진"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-lg z-10"
                style={{ background: 'rgba(255,255,255,0.55)', color: theme.colors.text }}
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  go(index + 1)
                }}
                aria-label="다음 사진"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-lg z-10"
                style={{ background: 'rgba(255,255,255,0.55)', color: theme.colors.text }}
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* 카운터 및 사진첩 열기 버튼 */}
        <div className="flex items-center justify-between mt-4 px-1">
          <p className="text-xs tracking-widest" style={{ color: theme.colors.textMuted }}>
            <span style={{ color: theme.colors.accent }}>{index + 1}</span> / {total}
          </p>
          {hasPhotos && (
            <button
              onClick={() => setAlbumOpen(true)}
              className="text-xs px-3 py-1 rounded-full border transition-opacity hover:opacity-80"
              style={{ borderColor: theme.colors.accent, color: theme.colors.accent }}
            >
              사진첩 열기
            </button>
          )}
        </div>

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

      {/* 3x5 사진첩 그리드 모달 */}
      <AnimatePresence>
        {albumOpen && hasPhotos && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setAlbumOpen(false)
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg max-h-[85vh] rounded-2xl p-6 overflow-y-auto shadow-2xl"
              style={{ background: '#FCFBF7', color: theme.colors.text }}
            >
              {/* 모달 헤더 */}
              <div className="flex items-center justify-between mb-5 border-b pb-3" style={{ borderColor: theme.colors.border }}>
                <div>
                  <h3 className="font-heading text-xl font-medium" style={{ color: theme.colors.accent }}>
                    갤러리 사진첩
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">사진을 누르면 크게 볼 수 있습니다</p>
                </div>
                <button
                  onClick={() => setAlbumOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xl transition-colors hover:bg-black/5"
                  style={{ color: theme.colors.text }}
                >
                  ×
                </button>
              </div>

              {/* 3열 (3x5) 그리드 사진첩 */}
              <div className="grid grid-cols-3 gap-2.5">
                {data.galleryPhotos.map((p, idx) => (
                  <button
                    key={`${p}-${idx}`}
                    onClick={() => setSelectedPhotoIdx(idx)}
                    className="relative aspect-square rounded-xl overflow-hidden group border transition-transform active:scale-95"
                    style={{ borderColor: theme.colors.border }}
                  >
                    <img
                      src={getOptimizedUrl(p, { width: 300 })}
                      alt={`웨딩 사진첩 ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3x5 사진첩 안에서 눌렀을 때 특정 사진 크게보기 팝업 모달 */}
      <AnimatePresence>
        {selectedPhotoIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhotoIdx(null)}
            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
          >
            <button
              onClick={() => setSelectedPhotoIdx(null)}
              className="absolute top-6 right-6 text-white text-3xl z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10"
            >
              ×
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={getOptimizedUrl(data.galleryPhotos[selectedPhotoIdx], { width: 1000 })}
              alt={`웨딩 사진 ${selectedPhotoIdx + 1} 원본 확대`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
