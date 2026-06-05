import confetti from 'canvas-confetti'
import { useEffect } from 'react'

interface Props {
  startDelay?: number
  interval?: number
}

function launchFireworks() {
  const count = 3 + Math.floor(Math.random() * 3)

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      confetti({
        particleCount: 35,
        spread: 40,
        startVelocity: 20,
        decay: 0.92,
        scalar: 0.45,
        ticks: 100,
        origin: {
          x: 0.05 + Math.random() * 0.9,
          y: 0.1 + Math.random() * 0.7,
        },
        colors: ['#ff6b9d', '#ffb3c6', '#ffd700', '#ff4500', '#ff69b4', '#fff'],
        shapes: ['circle', 'square'],
        gravity: 0.8,
      })
    }, i * 180)
  }
}

export default function FireworksOverlay({ startDelay = 5000, interval = 12000 }: Props) {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    const fire = () => {
      if (!document.hidden) launchFireworks()
      timer = setTimeout(fire, interval)
    }

    const first = setTimeout(fire, startDelay)
    return () => {
      clearTimeout(first)
      clearTimeout(timer)
    }
  }, [startDelay, interval])

  return null
}
