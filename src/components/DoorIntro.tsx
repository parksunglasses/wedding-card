import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import { WeddingData } from '@/types'
import { Theme } from '@/themes'
import { getOptimizedUrl } from '@/lib/cloudinary'
import Handwriting from '@/components/Handwriting'

interface Props {
  data: WeddingData
  theme: Theme
}

// 진입 인트로 — 밝은 메인 사진 위에 핑크 스크립트가 얹히는 커버 (레퍼런스 톤)
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
    const t = setTimeout(startLeaving, useLottie ? 4500 : 4200)
    return () => clearTimeout(t)
  }, [useLottie])

  if (done) return null

  return (
    <motion.div
      className="fixed inset-y-0 left-0 right-0 mx-auto w-full max-w-[480px] z-[60] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: theme.colors.bg, color: theme.colors.text }}
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

      {/* ===== 사진 풀스크린 커버 (Lottie 아닐 때) ===== */}
      {!useLottie && (
        <>
          {photo ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${photo})` }}
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(160deg, ${theme.colors.bgAlt}, ${theme.colors.border})` }}
            />
          )}
          {/* 하단 스크립트 가독성용 은은한 밝은 그라데이션 */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.18) 100%)' }}
          />
        </>
      )}

      {/* ===== 손글씨 SVG — 획이 글자를 따라 그려짐 (Intro와 동일 위치) ===== */}
      {!useLottie && (
        <div className="absolute left-0 right-0 z-10 flex justify-center px-6" style={{ bottom: '28%' }}>
          <div style={{ width: '96%' }}>
            <Handwriting color="#D97E9F" strokeWidth={13} durationMs={2800} />
          </div>
        </div>
      )}
    </motion.div>
  )
}
