import { lazy, Suspense, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { WeddingData } from '@/types'
import { Theme } from '@/themes'
import { getOptimizedUrl } from '@/lib/cloudinary'
import { DEFAULT_WEDDING_PHOTO } from '@/data/wedding'
import Handwriting from '@/components/Handwriting'

const Lottie = lazy(() => import('lottie-react'))

interface Props {
  data: WeddingData
  theme: Theme
}

export default function DoorIntro({ data, theme }: Props) {
  const [done, setDone] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [anim, setAnim] = useState<object | null>(null)
  const [lottieFailed, setLottieFailed] = useState(false)

  const lottieUrl = data.lottieUrl?.trim()
  const useLottie = Boolean(lottieUrl) && !lottieFailed
  const photo = getOptimizedUrl(data.mainPhoto || DEFAULT_WEDDING_PHOTO, {
    width: 1000,
    quality: 'auto:best',
  })

  useEffect(() => {
    if (!lottieUrl) return
    let cancelled = false
    fetch(lottieUrl)
      .then((response) => response.json())
      .then((json) => !cancelled && setAnim(json))
      .catch(() => !cancelled && setLottieFailed(true))
    return () => {
      cancelled = true
    }
  }, [lottieUrl])

  useEffect(() => {
    const timer = window.setTimeout(() => setLeaving(true), useLottie ? 3000 : 2300)
    return () => window.clearTimeout(timer)
  }, [useLottie])

  if (done) return null

  return (
    <motion.button
      type="button"
      aria-label="인트로 건너뛰기"
      className="fixed inset-y-0 left-0 right-0 z-[60] mx-auto block w-full max-w-[480px] overflow-hidden border-0 p-0 text-left"
      style={{ background: theme.colors.bg, color: theme.colors.text }}
      initial={{ opacity: 1 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
      onClick={() => setLeaving(true)}
      onAnimationComplete={() => leaving && setDone(true)}
    >
      {useLottie && anim ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Suspense fallback={null}>
            <Lottie
              animationData={anim}
              loop={false}
              autoplay
              onComplete={() => setLeaving(true)}
              style={{ width: '100%', height: '100%' }}
              rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
            />
          </Suspense>
        </div>
      ) : (
        <>
          <div className="absolute inset-x-5 inset-y-0 overflow-hidden">
            <img
              src={photo}
              alt=""
              className="h-full w-full object-cover"
              style={{ objectPosition: '20% center' }}
            />
          </div>
          <div
            className="absolute bottom-[23%] left-0 right-0 z-10 mx-auto w-[88%] px-4 py-3"
            style={{ background: `${theme.colors.bg}E8` }}
          >
            <Handwriting color={theme.colors.accent} strokeWidth={12} durationMs={1700} />
          </div>
          <p
            className="absolute bottom-8 left-0 right-0 text-center text-[10px] tracking-[0.24em]"
            style={{ color: theme.colors.textMuted }}
          >
            TAP TO ENTER
          </p>
        </>
      )}
    </motion.button>
  )
}
