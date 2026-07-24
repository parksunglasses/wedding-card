import { useState } from 'react'
import { WeddingData } from '@/types'
import { shareKakao } from '@/lib/share'
import { CandyStripe, DOODLE, DoodleHeading, Heart, Snowfall, pen } from './DoodleKit'

interface Props {
  data: WeddingData
}

export default function DoodleShare({ data }: Props) {
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
    background: DOODLE.paper,
    border: `2px solid ${DOODLE.border}`,
    borderRadius: 14,
    color: DOODLE.ink,
  }

  return (
    <>
      <section className="px-10 py-14 text-center" style={{ background: DOODLE.creamAlt }}>
        <DoodleHeading squiggleWidth={90}>청첩장 전하기</DoodleHeading>
        <p className="mb-5 mt-2 text-[13px]" style={{ color: DOODLE.inkSoft }}>
          소중한 분들에게 저희 소식을 전해주세요
        </p>

        <div className="mx-auto grid max-w-[340px] grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={shareByKakao}
            className="flex flex-col items-center gap-2 py-3.5 text-[12px]"
            style={tileStyle}
          >
            <span
              className="flex h-[38px] w-[38px] items-center justify-center rounded-xl text-[18px]"
              style={{ background: '#FEE500' }}
            >
              💬
            </span>
            카카오톡
          </button>

          <a
            href={smsHref}
            className="flex flex-col items-center gap-2 py-3.5 text-[12px] no-underline"
            style={tileStyle}
          >
            <span
              className="flex h-[38px] w-[38px] items-center justify-center rounded-xl text-[18px]"
              style={{ background: DOODLE.red }}
            >
              ✉️
            </span>
            문자
          </a>

          <button
            type="button"
            onClick={copyLink}
            className="flex flex-col items-center gap-2 py-3.5 text-[12px]"
            style={tileStyle}
          >
            <span
              className="flex h-[38px] w-[38px] items-center justify-center rounded-xl text-[18px]"
              style={{ background: '#F1E4CF' }}
            >
              🔗
            </span>
            {copied ? '복사됨!' : '링크복사'}
          </button>
        </div>
      </section>

      <CandyStripe />

      <footer className="relative overflow-hidden px-10 pb-16 pt-14 text-center">
        <Snowfall distance={320} count={3} />

        <svg
          viewBox="0 0 24 28"
          width={30}
          height={34}
          className="mx-auto mb-2 block"
          aria-hidden="true"
        >
          <path
            d="M12 2 L18 11 H15 L21 20 H3 L9 11 H6 Z"
            fill="none"
            stroke={DOODLE.greenLine}
            strokeWidth={2}
            strokeLinejoin="round"
          />
          <path d="M12 20 V26" stroke={DOODLE.greenLine} strokeWidth={2} strokeLinecap="round" />
          <circle cx="12" cy="2" r="1.8" fill={DOODLE.red} />
        </svg>

        <p className="relative m-0" style={pen(42, DOODLE.red)}>기다리고 있을게요!</p>
        <p
          className="relative mt-1.5 flex items-center justify-center gap-1.5 text-[13px]"
          style={{ color: DOODLE.inkSoft }}
        >
          {data.groom.name} &amp; {data.bride.name} 올림
          <Heart size={14} />
        </p>
      </footer>
    </>
  )
}
