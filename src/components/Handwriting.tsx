import { memo, useEffect, useRef } from 'react'
import raw from '@/assets/handwriting-married.svg?raw'

interface Props {
  color?: string
  strokeWidth?: number
  animate?: boolean
  durationMs?: number
}

// 레퍼런스 손글씨 SVG(가이드 획 clip-path 방식)를 stroke-dashoffset으로 그려냄
function Handwriting({ color = '#D97E9F', strokeWidth = 14, animate = true, durationMs = 2600 }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = ref.current
    if (!host) return
    const svg = host.querySelector('svg') as SVGSVGElement | null
    const path = host.querySelector('.svg-main path') as SVGPathElement | null
    if (!svg || !path) return

    svg.style.width = '100%'
    svg.style.height = 'auto'
    svg.style.display = 'block'
    svg.style.overflow = 'visible'

    path.setAttribute('fill', 'none')
    path.setAttribute('stroke', color)
    path.setAttribute('stroke-width', String(strokeWidth))
    path.setAttribute('stroke-linecap', 'round')
    path.setAttribute('stroke-linejoin', 'round')

    if (!animate) {
      path.style.strokeDasharray = 'none'
      path.style.strokeDashoffset = '0'
      return
    }

    const len = path.getTotalLength()
    path.style.transition = 'none'
    path.style.strokeDasharray = String(len)
    path.style.strokeDashoffset = String(len)
    void path.getBoundingClientRect() // reflow

    const id = requestAnimationFrame(() => {
      path.style.transition = `stroke-dashoffset ${durationMs}ms cubic-bezier(0.7, 0, 0.3, 1)`
      path.style.strokeDashoffset = '0'
    })
    return () => cancelAnimationFrame(id)
  }, [color, strokeWidth, animate, durationMs])

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: raw }} />
}

export default memo(Handwriting)
