import { useState } from 'react'
import { WeddingData } from '@/types'
import { shareKakao } from '@/lib/share'
import { TESTO, pen, gaegu, Deco } from './TestoKit'
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
      window.setTimeout(() => setCopied(false), 1800)
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

  const tile = { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 4, ...gaegu, fontSize: 13, color: TESTO.ink }
  const iconBox = (bg: string) => ({ width: '100%', aspectRatio: '1/1', borderRadius: 16, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, boxShadow: '0 4px 10px rgba(0,0,0,.18)' })

  return (
    <section className="testo-paper share" style={{ color: TESTO.ink }}>
      <Deco tone="paper" items={[]} />
      <h2 style={pen(40, TESTO.red)}>청첩장 전하기</h2>
      <div className="share-grid">
        <button type="button" onClick={shareByKakao} style={tile}>
          <span style={iconBox('#FEE500')}>💬</span>카카오톡
        </button>
        <a href={smsHref} style={{ ...tile, textDecoration: 'none' }}>
          <span style={iconBox('#34C759')}>✉️</span>문자
        </a>
        <button type="button" onClick={copyLink} style={tile}>
          <span style={iconBox(TESTO.tan)}>🔗</span>{copied ? '복사됨' : '링크복사'}
        </button>
      </div>
    </section>
  )
}
