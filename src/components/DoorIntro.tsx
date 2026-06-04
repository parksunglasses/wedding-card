import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import { WeddingData } from '@/types'
import { Theme } from '@/themes'
import { formatDate, getDayOfWeek } from '@/lib/date'
import { getOptimizedUrl } from '@/lib/cloudinary'

interface Props {
  data: WeddingData
  theme: Theme
}

// 진입 인트로 — 어둠에서 빛이 들어오며 메인 사진이 드러나는 시네마틱 리빌
// (Lottie URL이 있으면 Lottie 인트로로 대체)
export default function DoorIntro({ data, theme }: Props) {
  const [done, setDone] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [anim, setAnim] = useState<object | null>(null)
  const [lottieFailed, setLottieFailed] = useState(false)

  const lottieUrl = data.lottieUrl?.trim()
  const useLottie = Boolean(lottieUrl) && !lottieFailed
  const photo = data.mainPhoto ? getOptimizedUrl(data.mainPhoto, { width: 1200 }) : ''

  useEffect(() => {
    if (!lottieUrl) return
    let cancelled = false
    fetch(lottieUrl)
      .then((r) => r.json())
      .then((j) => !cancelled && setAnim(j))
      .catch(() => !cancelled && setLottieFailed(true))
    return () => {
      cancelled = true
    }
  }, [lottieUrl])

  const startLeaving = () => setLeaving(true)

  useEffect(() => {
    const t = setTimeout(startLeaving, useLottie ? 4500 : 3200)
    return () => clearTimeout(t)
  }, [useLottie])

  if (done) return null

  const dateLine = `${formatDate(data.date)} · ${getDayOfWeek(data.date)}`

  return (
    <motion.div
      className="fixed inset-y-0 left-0 right-0 mx-auto w-full max-w-[480px] z-[60] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#000', color: '#FFFFFF' }}
      initial={{ opacity: 1 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: 0.9, ease: 'easeInOut' }}
      onAnimationComplete={() => leaving && setDone(true)}
    >
      {/* ===== Lottie 모드 ===== */}
      {useLottie && anim && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Lottie
            animationData={anim}
            loop={false}
            autoplay
            onComplete={startLeaving}
            style={{ width: '100%', height: '100%' }}
            rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
          />
        </div>
      )}

      {/* ===== 사진 리빌 모드 ===== */}
      {!useLottie && (
        <>
          {/* 메인 사진 (고정 — 어둠이 걷히며 그대로 드러남) */}
          {photo ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${photo})` }}
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.bgDark})` }}
            />
          )}

          {/* 어둠이 걷히는 레이어 (빛이 들어옴) */}
          <motion.div
            className="absolute inset-0"
            style={{ background: '#000' }}
            initial={{ opacity: 0.95 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 2.6, ease: 'easeOut' }}
          />

          {/* 중앙에서 번지는 빛 */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.55), rgba(255,255,255,0) 55%)' }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.6, 0], scale: 1.5 }}
            transition={{ duration: 2.8, ease: 'easeOut' }}
          />

          {/* 하단 가독성 그라데이션 */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.45) 100%)' }}
          />
        </>
      )}

      {/* ===== 이름 + 날짜 (공통) ===== */}
      <div className="relative z-10 flex flex-col items-center text-center px-8">
        <motion.p
          className="text-[10px] tracking-[0.45em] uppercase mb-5"
          style={{ color: '#FFFFFF', opacity: 0.85 }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 0.85, y: 0 }}
          transition={{ duration: 1.2, delay: 1 }}
        >
          We're getting married
        </motion.p>

        <motion.p
          style={{
            fontFamily: theme.fonts.script || theme.fonts.heading,
            fontSize: '3.4rem',
            lineHeight: 1.1,
            textShadow: '0 2px 20px rgba(0,0,0,0.4)',
          }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 1.2, ease: 'easeOut' }}
        >
          {data.groom.name} &amp; {data.bride.name}
        </motion.p>

        <motion.div
          className="flex items-center gap-3 mt-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.7 }}
        >
          <span className="h-px w-8" style={{ background: '#FFFFFF', opacity: 0.5 }} />
          <span className="text-[11px] tracking-[0.25em]">{dateLine}</span>
          <span className="h-px w-8" style={{ background: '#FFFFFF', opacity: 0.5 }} />
        </motion.div>
      </div>
    </motion.div>
  )
}
