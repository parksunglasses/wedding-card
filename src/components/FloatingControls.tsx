import { useEffect, useRef, useState } from 'react'
import { WeddingData } from '@/types'
import { Theme } from '@/themes'
import { shareKakao } from '@/lib/share'

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
    audio.volume = 0.5

    const tryPlay = () =>
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
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

  // 희미하게 + 테마색에 묻는 스타일 (배경 살짝, 아이콘 반투명)
  const btnStyle: React.CSSProperties = {
    background: theme.colors.bgDark + '26', // ~15% 불투명
    color: theme.colors.bg,
    border: `1px solid ${theme.colors.bg}33`,
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    opacity: 0.7,
  }

  return (
    <>
      {src && <audio ref={audioRef} src={src} loop preload="auto" />}

      <div
        className="fixed top-4 z-50 flex items-center gap-2"
        style={{ right: 'max(1rem, calc(50vw - 240px + 1rem))' }}
      >
        {/* 공유하기 */}
        <button
          type="button"
          onClick={() => shareKakao(data)}
          aria-label="공유하기"
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={btnStyle}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
            <line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
          </svg>
        </button>

        {/* BGM 토글 (음악 있을 때만) */}
        {src && (
          <button
            type="button"
            onClick={toggleBgm}
            aria-label={playing ? '음악 끄기' : '음악 켜기'}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={btnStyle}
          >
            <span
              className="text-sm leading-none"
              style={{ display: 'inline-block', animation: playing ? 'bgm-spin 3.5s linear infinite' : 'none' }}
            >
              ♪
            </span>
          </button>
        )}
      </div>

      <style>{`
        @keyframes bgm-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}
