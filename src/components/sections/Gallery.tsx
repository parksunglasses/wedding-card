import { useState, useEffect } from 'react'
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

  // 갤러리 사진첩 모달이 열렸을 때, 클릭 시 크게 볼 720px 사진들을 미리 백그라운드 캐시(Preload)
  useEffect(() => {
    if (albumOpen && hasPhotos) {
      data.galleryPhotos.forEach((p) => {
        if (p) {
          const img = new Image()
          img.src = getOptimizedUrl(p, { width: 720 })
        }
      })
    }
  }, [albumOpen, hasPhotos, data.galleryPhotos])

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

      {/* 아이폰 사진첩 스타일 3x5 그리드 모달 */}
      <AnimatePresence>
        {albumOpen && hasPhotos && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setAlbumOpen(false)
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative w-full max-w-md h-[86vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
              style={{ background: '#FCFBF7', color: theme.colors.text }}
            >
              {/* 붕 뜨지 않는 상단 우측 내장 닫기 버튼 */}
              <div className="pt-3 px-4 pb-1 flex justify-end items-center">
                <button
                  onClick={() => setAlbumOpen(false)}
                  aria-label="사진첩 닫기"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-2xl font-light transition-transform active:scale-90 hover:bg-black/5"
                  style={{ color: theme.colors.accent }}
                >
                  ×
                </button>
              </div>

              {/* 3열 촘촘한 아이폰 사진첩 앨범 그리드 */}
              <div className="flex-1 overflow-y-auto p-2 grid grid-cols-3 gap-1.5">
                {data.galleryPhotos.map((p, idx) => (
                  <button
                    key={`${p}-${idx}`}
                    onClick={() => setSelectedPhotoIdx(idx)}
                    className="relative aspect-square rounded-lg overflow-hidden group transition-transform active:scale-95 bg-gray-100"
                  >
                    <img
                      src={getOptimizedUrl(p, { width: 300 })}
                      alt={`웨딩 사진첩 ${idx + 1}`}
                      loading="eager"
                      decoding="async"
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
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          >
            <button
              onClick={() => setSelectedPhotoIdx(null)}
              aria-label="큰 사진 닫기"
              className="absolute top-5 right-5 text-white/90 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-lg border border-white/20 transition-all hover:bg-white/30"
            >
              ✕
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={getOptimizedUrl(data.galleryPhotos[selectedPhotoIdx], { width: 720 })}
              alt={`웨딩 사진 ${selectedPhotoIdx + 1} 원본 확대`}
              decoding="async"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
