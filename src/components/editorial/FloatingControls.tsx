import { useEffect, useRef, useState } from 'react'
import { WeddingData } from '@/types'
import { Theme } from '@/themes'
import { shareKakao } from '@/lib/share'
import { MusicIcon, ShareIcon } from '@/components/ui/Icons'

interface Props {
  data: WeddingData
  theme: Theme
}

export default function FloatingControls({ data, theme }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const src = data.bgmUrl

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !src) return
    audio.volume = 0.45

    const tryPlay = () => audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    tryPlay()

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

  const toggleBgm = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  const [showTopBtn, setShowTopBtn] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 280)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const buttonStyle: React.CSSProperties = {
    background: `${theme.colors.bg}EA`,
    color: theme.colors.bgDark,
    border: `1px solid ${theme.colors.border}`,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  }

  return (
    <>
      {src && <audio ref={audioRef} src={src} loop preload="auto" />}
      <div
        className="fixed top-4 z-50 flex items-center gap-2"
        style={{ right: 'max(1rem, calc(50vw - 240px + 1rem))' }}
      >
        <button
          type="button"
          onClick={() => shareKakao(data)}
          aria-label="공유하기"
          className="flex h-11 w-11 items-center justify-center rounded-full"
          style={buttonStyle}
        >
          <ShareIcon className="h-[18px] w-[18px]" />
        </button>
        {src && (
          <button
            type="button"
            onClick={toggleBgm}
            aria-label={playing ? '음악 끄기' : '음악 켜기'}
            className="flex h-11 w-11 items-center justify-center rounded-full"
            style={buttonStyle}
          >
            <MusicIcon className={`h-[18px] w-[18px] ${playing ? 'animate-pulse' : ''}`} />
          </button>
        )}
      </div>

      {/* 맨 위로 가기 (Top 스크롤 플로팅 버튼) */}
      {showTopBtn && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="맨 위로 이동"
          className="fixed bottom-6 z-40 flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 active:scale-90 opacity-40 hover:opacity-100"
          style={{
            right: 'max(1rem, calc(50vw - 240px + 1rem))',
            background: 'rgba(0, 0, 0, 0.2)',
            color: '#FFFFFF',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <span className="text-sm font-bold leading-none">↑</span>
        </button>
      )}
    </>
  )
}
