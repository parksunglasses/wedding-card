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
    </>
  )
}
