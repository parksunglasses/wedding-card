import { useState } from 'react'
import { WeddingData } from '@/types'
import { shareKakao } from '@/lib/share'
import { TESTO, pen } from './TestoKit'

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

  const smsHref = `sms:?&body=${encodeURIComponent(
    `${data.groom.name}♥${data.bride.name} 결혼합니다\n${shareUrl}`,
  )}`

  const tileStyle = {
    ...pen(20),
    background: TESTO.paper,
    color: TESTO.red,
    borderRadius: 12,
    padding: '14px 0 12px',
  }

  return (
    <section className="testo-paper-red px-10 pb-[60px] pt-[50px] text-center" style={{ color: TESTO.paper }}>
      <h2 className="m-0" style={pen(40)}>청첩장 전하기</h2>
      <svg viewBox="0 0 130 10" width={120} height={10} className="mx-auto mb-[22px] mt-1.5 block" aria-hidden="true">
        <path d="M3 6 Q 20 1 38 6 T 74 6 T 110 6 T 127 5" fill="none" stroke={TESTO.paper} strokeWidth={2} strokeLinecap="round" />
      </svg>

      <div className="mx-auto grid max-w-[320px] grid-cols-3 gap-2.5">
        <button type="button" onClick={shareByKakao} style={tileStyle}>카톡</button>
        <a href={smsHref} style={{ ...tileStyle, textDecoration: 'none', display: 'block' }}>문자</a>
        <button type="button" onClick={copyLink} style={tileStyle}>{copied ? '복사됨' : '링크'}</button>
      </div>

      <svg viewBox="0 0 32 40" width={40} height={44} className="mx-auto mb-1.5 mt-11 block" aria-hidden="true">
        <path d="M16 4 L24 16 H20 L27 27 H5 L12 16 H8 Z" fill="none" stroke={TESTO.paper} strokeWidth={2} strokeLinejoin="round" />
        <path d="M16 27 V33" stroke={TESTO.paper} strokeWidth={2} strokeLinecap="round" />
        <circle cx="16" cy="4" r="2" fill={TESTO.paper} />
      </svg>
      <p className="m-0" style={pen(36)}>기다리고 있을게요!</p>
      <p className="mt-1.5 text-[14px] opacity-80" style={{ fontFamily: 'Gaegu, sans-serif' }}>
        {data.groom.name} &amp; {data.bride.name} 올림
      </p>
    </section>
  )
}
