import { useState } from 'react'
import { WeddingData } from '@/types'
import { shareKakao } from '@/lib/share'
import { TESTO, pen, Deco } from './TestoKit'
import { TESTO_TEXT } from './testoData'

interface Props {
  data: WeddingData
}

export default function TestoShare({ data }: Props) {
  const [copied, setCopied] = useState(false)
  const shareUrl = window.location.href

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Copy failed', error)
    }
  }

  const shareByKakao = async () => {
    try {
      await shareKakao(data)
    } catch (error) {
      console.error('Kakao share failed', error)
      alert('카카오톡 공유에 실패했습니다.')
    }
  }

  const smsHref = `sms:?&body=${encodeURIComponent(`${TESTO_TEXT.groom.name}♥${TESTO_TEXT.bride.name} 결혼합니다\n${shareUrl}`)}`

  const btnStyle = (bg: string) => ({
    width: 48,
    height: 48,
    borderRadius: 16,
    background: bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.12)',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  })

  return (
    <section className="testo-paper share" style={{ color: TESTO.ink, padding: '48px 20px 56px', position: 'relative' }}>
      <Deco tone="paper" items={[]} />
      <h2 style={{ ...pen(52, TESTO.red), marginBottom: 24, textDecoration: 'none' }}>청첩장 전하기</h2>
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
        {/* 1. 카카오톡 (산뜻한 소프트 노랑) */}
        <button
          type="button"
          onClick={shareByKakao}
          style={btnStyle('#EDD645')}
          aria-label="카카오톡 공유"
          className="hover:scale-105 active:scale-95"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="#2C1A1D">
            <path d="M12 3C6.477 3 2 6.477 2 10.77c0 2.766 1.83 5.187 4.58 6.556-.2.748-.73 2.705-.836 3.125-.133.528.193.52.408.378.17-.112 2.698-1.832 3.79-2.576.677.1 1.378.152 2.058.152 5.523 0 10-3.477 10-7.77C22 6.477 17.523 3 12 3z" />
          </svg>
        </button>

        {/* 2. 문자 (산뜻한 그린) */}
        <a
          href={smsHref}
          style={btnStyle('#48B868')}
          aria-label="문자 공유"
          className="hover:scale-105 active:scale-95"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
            <path
              d="M12 3.5C6.48 3.5 2 7.08 2 11.5c0 2.82 1.8 5.3 4.5 6.66-.2.78-.76 2.82-.87 3.26-.14.55.2.54.43.39.18-.12 2.81-1.91 3.95-2.69.66.1 1.35.16 2.02.16 5.52 0 10-3.58 10-8C22 7.08 17.52 3.5 12 3.5z"
              fill="white"
            />
            <circle cx="8" cy="11.5" r="1.3" fill="#48B868" />
            <circle cx="12" cy="11.5" r="1.3" fill="#48B868" />
            <circle cx="16" cy="11.5" r="1.3" fill="#48B868" />
          </svg>
        </a>

        {/* 3. 링크 복사 (세련된 버건디) */}
        <button
          type="button"
          onClick={copyLink}
          style={btnStyle('#7E1E28')}
          aria-label="링크 복사"
          className="hover:scale-105 active:scale-95"
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="white"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </button>
      </div>

      {copied && (
        <div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100001] px-5 py-2.5 rounded-full bg-stone-900/90 text-white text-xs font-medium shadow-xl backdrop-blur flex items-center gap-1.5 animate-bounce-once"
        >
          <span>✨ 청첩장 링크가 복사되었습니다!</span>
        </div>
      )}
    </section>
  )
}
