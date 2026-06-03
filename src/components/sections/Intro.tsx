import { motion } from 'framer-motion'
import { WeddingData } from '@/types'
import { Theme } from '@/themes'
import { formatDateEnglish } from '@/lib/date'
import { getOptimizedUrl } from '@/lib/cloudinary'

interface Props {
  data: WeddingData
  theme: Theme
}

export default function Intro({ data, theme }: Props) {
  const isLightOverlay = theme.style.introOverlay === 'light'
  const textColor = isLightOverlay ? theme.colors.text : '#FFFFFF'

  const overlay = theme.style.introOverlay === 'dark'
    ? 'linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.5))'
    : theme.style.introOverlay === 'light'
    ? 'linear-gradient(180deg, rgba(255,255,255,0.3), rgba(255,255,255,0.7))'
    : 'none'

  const bgImage = data.mainPhoto
    ? `${overlay !== 'none' ? overlay + ',' : ''} url(${getOptimizedUrl(data.mainPhoto, { width: 1200 })})`
    : `linear-gradient(135deg, ${theme.colors.accentLight}, ${theme.colors.accent})`

  // 테마별 인트로 타이틀 스타일
  const titleClass =
    theme.style.introTextStyle === 'script' ? 'font-script text-7xl'
    : theme.style.introTextStyle === 'serif' ? 'font-heading text-5xl italic'
    : 'font-heading text-4xl uppercase tracking-widest'

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden" style={{ color: textColor }}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: bgImage }}
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="absolute top-20 left-0 right-0 text-center px-8 z-10"
      >
        <h1 className={`${titleClass} drop-shadow-2xl`}>
          Wedding Day
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        className="absolute bottom-24 left-0 right-0 text-center px-8 z-10"
      >
        <p className="text-sm tracking-[0.2em] opacity-90 font-light">
          {formatDateEnglish(data.date, data.time)}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ duration: 2, delay: 1.5, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="text-2xl opacity-60">↓</div>
      </motion.div>
    </section>
  )
}
