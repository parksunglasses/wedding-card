import { useEffect, useState } from 'react'
import Lottie from 'lottie-react'

interface Props {
  // 첫 발사까지 지연(ms) — 인트로 끝난 뒤 시작
  startDelay?: number
  // 다음 발사까지 간격(ms)
  interval?: number
}

// 청첩장 보는 동안 중간중간 폭죽이 터지는 오버레이
export default function FireworksOverlay({ startDelay = 5000, interval = 14000 }: Props) {
  const [anim, setAnim] = useState<object | null>(null)
  const [burst, setBurst] = useState(0) // 0이면 숨김, 증가할 때마다 재생
  const [playing, setPlaying] = useState(false)

  // JSON 지연 로드 (초기 번들 분리)
  useEffect(() => {
    let cancelled = false
    import('@/assets/fireworks.json').then((m) => {
      if (!cancelled) setAnim((m.default ?? m) as object)
    })
    return () => {
      cancelled = true
    }
  }, [])

  // 주기적으로 발사
  useEffect(() => {
    if (!anim) return
    let timer: ReturnType<typeof setTimeout>

    const fire = () => {
      // 탭이 보일 때만 재생
      if (!document.hidden) {
        setBurst((b) => b + 1)
        setPlaying(true)
      }
      timer = setTimeout(fire, interval)
    }

    const first = setTimeout(fire, startDelay)
    return () => {
      clearTimeout(first)
      clearTimeout(timer)
    }
  }, [anim, startDelay, interval])

  if (!anim || !playing) return null

  return (
    <div className="fixed inset-y-0 left-0 right-0 mx-auto w-full max-w-[480px] z-40 pointer-events-none overflow-hidden">
      <Lottie
        key={burst}
        animationData={anim}
        loop={false}
        autoplay
        onComplete={() => setPlaying(false)}
        style={{ width: '100%', height: '100%' }}
        rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
      />
    </div>
  )
}
