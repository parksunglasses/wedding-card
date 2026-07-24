import { motion } from 'framer-motion'
import { WeddingData } from '@/types'
import { getOptimizedUrl } from '@/lib/cloudinary'
import { DEFAULT_WEDDING_PHOTO } from '@/data/wedding'
import { Heart, Squiggle, TESTO, pen } from './TestoKit'

interface Props {
  data: WeddingData
}

const SCATTERED_HEARTS: Array<{ size: number; left: number; top: number; rotate: number; scribble: boolean }> = [
  { size: 28, left: 4, top: 26, rotate: -12, scribble: false },
  { size: 42, left: 50, top: 2, rotate: -7, scribble: true },
  { size: 58, left: 118, top: 12, rotate: 7, scribble: true },
  { size: 30, left: 212, top: 0, rotate: 11, scribble: false },
  { size: 40, left: 250, top: 28, rotate: -5, scribble: true },
  { size: 24, left: -8, top: 58, rotate: -3, scribble: true },
]

export default function TestoHero({ data }: Props) {
  const groomPhoto = getOptimizedUrl(data.galleryPhotos[0] || data.mainPhoto || DEFAULT_WEDDING_PHOTO, {
    width: 400,
  })
  const bridePhoto = getOptimizedUrl(
    data.galleryPhotos[1] || data.galleryPhotos[0] || data.mainPhoto || DEFAULT_WEDDING_PHOTO,
    { width: 400 },
  )

  return (
    <section className="testo-paper testo-hero-intro relative overflow-hidden px-8 pb-10 pt-[52px] text-center">
      <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true">
        <span className="testo-flake" style={{ left: '10%', fontSize: 12, color: TESTO.snow, animationDuration: '9s' }}>❄</span>
        <span className="testo-flake" style={{ left: '32%', fontSize: 9, color: TESTO.snow, animationDuration: '12s', animationDelay: '2s' }}>❄</span>
        <span className="testo-flake" style={{ left: '58%', fontSize: 13, color: TESTO.snow, animationDuration: '10s', animationDelay: '4s' }}>❄</span>
        <span className="testo-flake" style={{ left: '78%', fontSize: 10, color: TESTO.snow, animationDuration: '8.5s', animationDelay: '1s' }}>❄</span>
        <span className="testo-flake" style={{ left: '90%', fontSize: 11, color: TESTO.snow, animationDuration: '11s', animationDelay: '3s' }}>❄</span>
      </div>

      {/* 480px 시안 기준 72px — 좁은 화면에서는 뷰포트에 비례해 줄여 이름이 잘리지 않게 한다 */}
      <h1 className="relative z-[2] m-0" style={{ ...pen(72, TESTO.red), fontSize: 'clamp(40px, 14.5vw, 72px)' }}>
        <span className="whitespace-nowrap">{data.groom.name} ♡ {data.bride.name}</span>
        <br />
        결혼합니다!
      </h1>

      <div className="relative mx-auto mt-[30px] w-[300px]" style={{ paddingTop: 78 }}>
        {SCATTERED_HEARTS.map((heart, index) => (
          <Heart
            key={index}
            size={heart.size}
            variant={heart.scribble ? 'scribble' : 'outline'}
            rotate={heart.rotate}
            className="absolute"
            style={{ left: heart.left, top: heart.top }}
          />
        ))}

        <p className="absolute -left-1.5 m-0" style={{ ...pen(26, TESTO.red), top: 88, transform: 'rotate(-6deg)' }}>
          신랑
        </p>
        <p className="absolute -right-1.5 m-0" style={{ ...pen(26, TESTO.red), top: 88, transform: 'rotate(6deg)' }}>
          신부
        </p>

        <div className="flex justify-center gap-2.5 px-10">
          <motion.img
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            src={groomPhoto}
            alt={`신랑 ${data.groom.name}`}
            className="h-[150px] w-[120px] object-cover"
            style={{ borderRadius: 10 }}
          />
          <motion.img
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22 }}
            src={bridePhoto}
            alt={`신부 ${data.bride.name}`}
            className="h-[150px] w-[120px] object-cover"
            style={{ borderRadius: 10 }}
          />
        </div>

        <p
          className="relative -mt-3.5 inline-block px-[30px] pb-2 pt-1"
          style={{
            ...pen(30),
            background: TESTO.red,
            color: TESTO.paper,
            borderRadius: '8px 22px 10px 26px',
            transform: 'rotate(-2deg)',
            boxShadow: '0 6px 14px rgba(0,0,0,.2)',
          }}
        >
          우리 결혼해요!
        </p>
      </div>

      <div className="mt-10">
        <h2 className="m-0" style={pen(40, TESTO.red)}>우리를 소개할게요</h2>
        <Squiggle className="mx-auto mb-[18px] mt-1" />
        <p className="m-0 text-[16px] leading-[1.9]" style={{ fontFamily: 'Gaegu, sans-serif', color: TESTO.inkSoft }}>
          서로를 향한 믿음으로 시작해
          <br />
          이제 평생을 약속하려 합니다.
          <br />
          오래 알고 지낸 두 사람이
          <br />
          드디어 하나가 됩니다!
        </p>
      </div>
    </section>
  )
}
