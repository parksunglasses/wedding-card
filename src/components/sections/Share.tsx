import { useState } from 'react'
import { motion } from 'framer-motion'
import { WeddingData } from '@/types'
import { Theme } from '@/themes'
import { shareKakao } from '@/lib/share'

interface Props {
  data: WeddingData
  theme: Theme
}

export default function Share({ data, theme }: Props) {
  const [copied, setCopied] = useState(false)
  const shareUrl = window.location.href

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error('Copy failed', e)
    }
  }

  const handleKakaoShare = async () => {
    try {
      await shareKakao(data)
    } catch (e) {
      console.error('Kakao share failed', e)
      alert('카카오톡 공유에 실패했습니다')
    }
  }

  const handleSMS = () => {
    const text = `${data.groom.name}♥${data.bride.name} 결혼합니다\n${shareUrl}`
    window.location.href = `sms:?&body=${encodeURIComponent(text)}`
  }

  const buttonStyle = {
    background: theme.colors.accent + '0D',
    border: `1px solid ${theme.colors.border}`,
  }

  return (
    <section className="theme-bg-alt py-20 px-8" style={{ color: theme.colors.text }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-md mx-auto text-center"
      >
        <p className="font-heading text-xs tracking-[0.4em] mb-2 uppercase" style={{ color: theme.colors.accent }}>
          Share
        </p>
        <h2 className="font-heading text-2xl mb-2">청첩장 전하기</h2>
        <p className="text-xs opacity-70 mb-8">
          소중한 분들에게 청첩장을 전해주세요
        </p>

        <div className="grid grid-cols-3 gap-3">
          <button onClick={handleKakaoShare} className="flex flex-col items-center gap-2 py-4 rounded-2xl text-xs" style={buttonStyle}>
            <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center text-black text-lg">💬</div>
            카카오톡
          </button>
          <button onClick={handleSMS} className="flex flex-col items-center gap-2 py-4 rounded-2xl text-xs" style={buttonStyle}>
            <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center text-white text-lg">✉️</div>
            문자
          </button>
          <button onClick={handleCopyLink} className="flex flex-col items-center gap-2 py-4 rounded-2xl text-xs" style={buttonStyle}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: theme.colors.accent + '1A' }}>🔗</div>
            {copied ? '복사됨' : '링크복사'}
          </button>
        </div>

        <div className="mt-16 pt-12 border-t" style={{ borderColor: theme.colors.border }}>
          <p className="font-script text-3xl mb-2" style={{ color: theme.colors.accent }}>Thank you</p>
          <p className="text-xs opacity-60">
            {data.groom.name} · {data.bride.name}
          </p>
        </div>
      </motion.div>
    </section>
  )
}
