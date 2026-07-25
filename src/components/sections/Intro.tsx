import { motion } from 'framer-motion'
import { WeddingData } from '@/types'
import { Theme } from '@/themes'
import { getOptimizedUrl } from '@/lib/cloudinary'
import Handwriting from '@/components/Handwriting'

interface Props {
  data: WeddingData
  theme: Theme
}

// 히어로 — 밝은 메인 사진 위에 핑크 스크립트 (진입 타이핑이 끝난 뒤 그대로 유지되는 위치)
export default function Intro({ data, theme }: Props) {
  const photo = data.mainPhoto ? getOptimizedUrl(data.mainPhoto, { width: 640 }) : ''
  const bgImage = photo
    ? `url(${photo})`
    : `linear-gradient(160deg, ${theme.colors.bgAlt}, ${theme.colors.border})`

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden" style={{ color: theme.colors.text }}>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: bgImage }} />

      {/* 하단 스크립트 가독성용 은은한 밝은 그라데이션 */}
      {photo && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.18) 100%)' }}
        />
      )}

      {/* 메인 사진 위에서 직접 써지는 손글씨 */}
      <div className="absolute left-0 right-0 z-10 flex justify-center px-6" style={{ bottom: '28%' }}>
        <div style={{ width: '106%' }}>
          <Handwriting color="#D97E9F" strokeWidth={13} durationMs={2800} />
        </div>
      </div>

      {/* 스크롤 화살표 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ duration: 2, delay: 1, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="text-xl" style={{ color: theme.colors.accent, opacity: 0.6 }}>↓</div>
      </motion.div>
    </section>
  )
}
