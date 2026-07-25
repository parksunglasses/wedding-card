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
    <>
      {/* 1. 청첩장 전하기 (#FCFBF7 미색) */}
      <section className="py-12 px-8" style={{ background: '#FCFBF7', color: theme.colors.text }}>
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

          <div className="flex justify-center items-center gap-4 my-6">
            {/* 1. 카카오톡 */}
            <button
              type="button"
              onClick={handleKakaoShare}
              style={{
                width: 48,
                height: 48,
                borderRadius: 16,
                background: '#EDD645',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.12)',
              }}
              aria-label="카카오톡 공유"
              className="hover:scale-105 active:scale-95 transition-transform"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="#2C1A1D">
                <path d="M12 3C6.477 3 2 6.477 2 10.77c0 2.766 1.83 5.187 4.58 6.556-.2.748-.73 2.705-.836 3.125-.133.528.193.52.408.378.17-.112 2.698-1.832 3.79-2.576.677.1 1.378.152 2.058.152 5.523 0 10-3.477 10-7.77C22 6.477 17.523 3 12 3z" />
              </svg>
            </button>

            {/* 2. 문자 */}
            <a
              href={`sms:?&body=${encodeURIComponent(`${data.groom.name}♥${data.bride.name} 결혼합니다\n${shareUrl}`)}`}
              style={{
                width: 48,
                height: 48,
                borderRadius: 16,
                background: '#48B868',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.12)',
              }}
              aria-label="문자 공유"
              className="hover:scale-105 active:scale-95 transition-transform"
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

            {/* 3. 링크 복사 */}
            <button
              type="button"
              onClick={handleCopyLink}
              style={{
                width: 48,
                height: 48,
                borderRadius: 16,
                background: '#7E1E28',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.12)',
              }}
              aria-label="링크 복사"
              className="hover:scale-105 active:scale-95 transition-transform"
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
        </motion.div>
      </section>

      {/* 2. 마지막 Thank You (#FAF5ED 연한 베이지) */}
      <section className="py-14 px-8 border-t text-center" style={{ background: '#FAF5ED', borderColor: theme.colors.border, color: theme.colors.text }}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-md mx-auto"
        >
          <div className="relative inline-block mb-4 px-6">
            <p
              className="font-heading text-3xl sm:text-4xl font-normal relative z-10 tracking-wider"
              style={{
                color: theme.colors.accent,
                filter: 'drop-shadow(0px 1px 2px rgba(217, 126, 159, 0.25))',
              }}
            >
              Thank you!
            </p>
          </div>

          {/* 은은한 핑크 라인 & 미니 하트 데코 */}
          <div className="flex items-center justify-center gap-3 mb-4 opacity-60">
            <span className="h-[1px] w-10" style={{ background: theme.colors.accent }} />
            <span className="text-xs" style={{ color: theme.colors.accent }}>♥</span>
            <span className="h-[1px] w-10" style={{ background: theme.colors.accent }} />
          </div>
          <p className="font-heading text-sm opacity-80 font-medium tracking-widest">
            박성환 &nbsp;·&nbsp; 이지영 올림
          </p>
        </motion.div>
      </section>
    </>
  )
}
