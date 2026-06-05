import { useEffect, useRef, useState } from 'react'
import Lottie from 'lottie-react'

interface Props {
  startDelay?: number
  interval?: number
}

interface Spark {
  id: number
  x: number // % from left
  y: number // % from top
}

const SPARK_SIZE = 90 // px — 마우스 커서보다 살짝 큰 크기

export default function FireworksOverlay({ startDelay = 5000, interval = 12000 }: Props) {
  const [anim, setAnim] = useState<object | null>(null)
  const [sparks, setSparks] = useState<Spark[]>([])
  const counterRef = useRef(0)

  useEffect(() => {
    let cancelled = false
    import('@/assets/fireworks.json').then((m) => {
      if (!cancelled) setAnim((m.default ?? m) as object)
    })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!anim) return
    let timer: ReturnType<typeof setTimeout>

    const fire = () => {
      if (!document.hidden) {
        // 한 번에 3~5개 랜덤 위치에 터뜨림
        const count = 3 + Math.floor(Math.random() * 3)
        const newSparks: Spark[] = Array.from({ length: count }, () => ({
          id: ++counterRef.current,
          x: 5 + Math.random() * 90,
          y: 5 + Math.random() * 85,
        }))
        setSparks((prev) => [...prev, ...newSparks])
      }
      timer = setTimeout(fire, interval)
    }

    const first = setTimeout(fire, startDelay)
    return () => {
      clearTimeout(first)
      clearTimeout(timer)
    }
  }, [anim, startDelay, interval])

  if (!anim || sparks.length === 0) return null

  return (
    <div className="fixed inset-y-0 left-0 right-0 mx-auto w-full max-w-[480px] z-40 pointer-events-none overflow-hidden">
      {sparks.map((spark) => (
        <div
          key={spark.id}
          style={{
            position: 'absolute',
            left: `${spark.x}%`,
            top: `${spark.y}%`,
            width: SPARK_SIZE,
            height: SPARK_SIZE,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Lottie
            animationData={anim}
            loop={false}
            autoplay
            onComplete={() =>
              setSparks((prev) => prev.filter((s) => s.id !== spark.id))
            }
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      ))}
    </div>
  )
}
