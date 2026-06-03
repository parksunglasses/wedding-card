import { useEffect, useRef, useState } from 'react'
import { Theme } from '@/themes'

interface Props {
  src: string
  theme: Theme
}

export default function BGMPlayer({ src, theme }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !src) return

    audio.volume = 0.5

    // 자동재생 시도 (대부분 브라우저는 사용자 동작 전 소리 재생을 차단)
    const tryPlay = () =>
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false))

    tryPlay()

    // 차단된 경우: 첫 사용자 동작(터치/클릭/스크롤)에서 재생 시작
    const startOnInteract = () => {
      tryPlay()
      cleanup()
    }
    const cleanup = () => {
      window.removeEventListener('touchstart', startOnInteract)
      window.removeEventListener('click', startOnInteract)
      window.removeEventListener('scroll', startOnInteract)
    }
    window.addEventListener('touchstart', startOnInteract, { once: true })
    window.addEventListener('click', startOnInteract, { once: true })
    window.addEventListener('scroll', startOnInteract, { once: true })

    return cleanup
  }, [src])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  if (!src) return null

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" />

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? '음악 끄기' : '음악 켜기'}
        className="fixed top-4 z-50 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg"
        style={{
          // #root(최대 480px, 중앙정렬) 기준 우측 상단에 고정
          right: 'max(1rem, calc(50vw - 240px + 1rem))',
          background: theme.colors.bgDark + 'CC',
          color: theme.colors.accentLight,
          border: `1px solid ${theme.colors.accentLight}55`,
        }}
      >
        <span
          className="text-base leading-none"
          style={{
            display: 'inline-block',
            animation: playing ? 'bgm-spin 3s linear infinite' : 'none',
          }}
        >
          ♪
        </span>
      </button>

      <style>{`
        @keyframes bgm-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}
