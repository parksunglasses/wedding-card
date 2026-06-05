import { motion } from 'framer-motion'
import { WeddingData } from '@/types'
import { Theme } from '@/themes'
import { formatDateEnglish, formatDate, getDayOfWeek, formatTime } from '@/lib/date'
import { getOptimizedUrl } from '@/lib/cloudinary'

interface Props {
  data: WeddingData
  theme: Theme
}

export default function Intro({ data, theme }: Props) {
  const isLightOverlay = theme.style.introOverlay === 'light'
  const textColor = isLightOverlay ? theme.colors.text : '#FFFFFF'
  const layout = theme.style.introLayout

  const overlay = theme.style.introOverlay === 'dark'
    ? 'linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.55))'
    : theme.style.introOverlay === 'light'
    ? 'linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0.7))'
    : 'none'

  const bgImage = data.mainPhoto
    ? `${overlay !== 'none' ? overlay + ',' : ''} url(${getOptimizedUrl(data.mainPhoto, { width: 480 })})`
    : `linear-gradient(135deg, ${theme.colors.accentLight}, ${theme.colors.accent})`

  const title = theme.style.introTitle
  const dateEng = formatDateEnglish(data.date, data.time)
  const dateKor = `${formatDate(data.date)} ${getDayOfWeek(data.date)} ${formatTime(data.time)}`
  const names = `${data.groom.name} · ${data.bride.name}`

  // 인트로 폰트 클래스
  const titleStyle =
    theme.style.introTextStyle === 'script'
      ? { fontFamily: theme.fonts.script, fontSize: '4.5rem', lineHeight: 1 }
      : theme.style.introTextStyle === 'serif'
      ? { fontFamily: theme.fonts.heading, fontSize: '2.5rem', fontStyle: 'italic' as const, letterSpacing: '0.02em' }
      : { fontFamily: theme.fonts.heading, fontSize: '1.6rem', letterSpacing: '0.35em', textTransform: 'uppercase' as const }

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden" style={{ color: textColor }}>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: bgImage }} />

      {/* ===== CLASSIC: 제목 위 · 날짜 아래 ===== */}
      {layout === 'classic' && (
        <>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute top-20 left-0 right-0 text-center px-8 z-10"
          >
            <p style={titleStyle} className="drop-shadow-2xl">{title}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="absolute bottom-24 left-0 right-0 text-center px-6 z-10"
          >
            <p className="text-[clamp(0.85rem,3.5vw,1rem)] mb-2 whitespace-nowrap" style={{ fontFamily: theme.fonts.heading, letterSpacing: '0.15em' }}>{names}</p>
            <p className="text-[clamp(0.65rem,2.5vw,0.75rem)] tracking-[0.2em] opacity-90 font-light whitespace-nowrap">{dateEng}</p>
          </motion.div>
        </>
      )}

      {/* ===== MINIMAL: 중앙 정렬 · 얇은 라인 ===== */}
      {layout === 'minimal' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-10 z-10"
        >
          <div className="w-px h-16 mb-8" style={{ background: textColor, opacity: 0.5 }} />
          <p style={titleStyle} className="mb-6">{title}</p>
          <p className="text-[clamp(0.8rem,3vw,0.875rem)] mb-8 whitespace-nowrap" style={{ fontFamily: theme.fonts.heading, letterSpacing: '0.2em' }}>{names}</p>
          <p className="text-[clamp(0.65rem,2.5vw,0.6875rem)] tracking-[0.25em] opacity-80 font-light whitespace-nowrap">{dateKor}</p>
          <div className="w-px h-16 mt-8" style={{ background: textColor, opacity: 0.5 }} />
        </motion.div>
      )}

      {/* ===== MAGAZINE: 좌하단 큰 제목 ===== */}
      {layout === 'magazine' && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute bottom-20 left-0 right-0 px-10 z-10"
        >
          <p className="text-[11px] tracking-[0.4em] mb-4 opacity-80" style={{ color: theme.colors.accentLight }}>
            {dateEng}
          </p>
          <p style={{ ...titleStyle, textAlign: 'left' }} className="drop-shadow-xl">{title}</p>
          <div className="w-20 h-px my-5" style={{ background: theme.colors.accentLight }} />
          <p className="text-lg" style={{ fontFamily: theme.fonts.heading, letterSpacing: '0.1em' }}>{names}</p>
        </motion.div>
      )}

      {/* ===== FRAME: 테두리 프레임 + 중앙 ===== */}
      {layout === 'frame' && (
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          className="absolute inset-5 z-10 flex flex-col items-center justify-center text-center"
          style={{ border: `1px solid ${textColor}66` }}
        >
          <p className="text-[10px] tracking-[0.3em] mb-5 opacity-80 whitespace-nowrap" style={{ color: theme.colors.accentLight }}>
            {data.groom.name} ♥ {data.bride.name}
          </p>
          <p style={titleStyle} className="px-6 drop-shadow-lg">{title}</p>
          <div className="flex items-center gap-3 mt-6">
            <div className="w-8 h-px" style={{ background: textColor, opacity: 0.6 }} />
            <p className="text-[11px] tracking-[0.2em] opacity-90">{dateKor}</p>
            <div className="w-8 h-px" style={{ background: textColor, opacity: 0.6 }} />
          </div>
        </motion.div>
      )}

      {/* 스크롤 화살표 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ duration: 2, delay: 1.5, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="text-xl opacity-60">↓</div>
      </motion.div>
    </section>
  )
}
