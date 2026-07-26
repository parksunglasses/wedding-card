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
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const src = data.bgmUrl

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg((prev) => (prev === msg ? null : prev)), 2200)
  }

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
    window.addEventListener('touchstart', startOnInteract, { once: true, passive: true })
    window.addEventListener('click', startOnInteract, { once: true })
    window.addEventListener('scroll', startOnInteract, { once: true, passive: true })
    return cleanup
  }, [src])

  const toggleBgm = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play().then(() => {
        setPlaying(true)
        showToast('배경음악이 켜졌습니다 ♪')
      }).catch(() => {})
    } else {
      audio.pause()
      setPlaying(false)
      showToast('배경음악이 꺼졌습니다')
    }
  }

  // 희미하게 + 테마색에 묻는 스타일 (배경 살짝, 아이콘 반투명)
  const btnStyle: React.CSSProperties = {
    background: theme.colors.bgDark + '26', // ~15% 불투명
    color: theme.colors.bg,
    border: `1px solid ${theme.colors.bg}33`,
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    opacity: 0.85,
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
          className="w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-90"
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
            className="w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-90"
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

      {/* 플로팅 컨트롤 종합 토스트 알림 오버레이 */}
      {toastMsg && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100001] px-5 py-2.5 rounded-full bg-stone-900/90 text-white text-xs font-medium shadow-xl backdrop-blur flex items-center gap-1.5 animate-bounce-once">
          <span>{toastMsg}</span>
        </div>
      )}

      <style>{`
        @keyframes bgm-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}
