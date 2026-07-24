import { useState } from 'react'
import { motion } from 'framer-motion'
import { WeddingData } from '@/types'
import { Theme } from '@/themes'
import { shareKakao } from '@/lib/share'
import SectionHeading from '@/components/ui/SectionHeading'
import { BotanicalLineIcon, LinkIcon, MailIcon, MessageIcon } from '@/components/ui/Icons'

interface Props {
  data: WeddingData
  theme: Theme
}

export default function Share({ data, theme }: Props) {
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

  const shareBySms = () => {
    const text = `${data.groom.name}♥${data.bride.name} 결혼합니다\n${shareUrl}`
    window.location.href = `sms:?&body=${encodeURIComponent(text)}`
  }

  return (
    <section className="theme-bg">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.75 }}
        className="invitation-section"
      >
        <SectionHeading label="Share" title="청첩장 전하기" />
        <div className="grid grid-cols-3 gap-2">
          <button type="button" onClick={shareByKakao} className="editorial-button min-w-0 flex-col gap-2 px-1 py-3">
            <MessageIcon />
            <span className="text-[12px]">카카오톡</span>
          </button>
          <button type="button" onClick={shareBySms} className="editorial-button min-w-0 flex-col gap-2 px-1 py-3">
            <MailIcon />
            <span className="text-[12px]">문자</span>
          </button>
          <button type="button" onClick={copyLink} className="editorial-button min-w-0 flex-col gap-2 px-1 py-3">
            <LinkIcon />
            <span className="text-[12px]">{copied ? '복사됨' : '링크 복사'}</span>
          </button>
        </div>
      </motion.div>

      <footer
        className="relative overflow-hidden px-[var(--page-gutter)] py-20 text-center"
        style={{ background: theme.colors.bgDark, color: theme.colors.bg }}
      >
        <BotanicalLineIcon
          className="pointer-events-none absolute bottom-[-28px] left-[-12px] h-40 w-20 opacity-55"
          style={{ color: theme.colors.accentLight }}
        />
        <BotanicalLineIcon
          className="pointer-events-none absolute bottom-[-30px] right-[-10px] h-44 w-[88px] -scale-x-100 opacity-55"
          style={{ color: theme.colors.accentLight }}
        />
        <p className="section-kicker" style={{ color: theme.colors.accentLight }}>Thank You</p>
        <p className="mt-5 font-heading text-[2.3rem] tracking-[0.08em]">
          {data.groom.name}
          <span className="mx-3" style={{ color: theme.colors.accentLight }}>·</span>
          {data.bride.name}
        </p>
        <span className="mx-auto mt-5 block h-px w-10" style={{ background: theme.colors.accent }} />
        <p className="mt-5 font-heading text-[15px] tracking-[0.14em]">{data.date.replace(/-/g, '. ')}</p>
      </footer>
    </section>
  )
}
