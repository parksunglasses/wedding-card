import { motion } from 'framer-motion'
import { WeddingData } from '@/types'
import { getOptimizedUrl } from '@/lib/cloudinary'
import { DEFAULT_WEDDING_PHOTO } from '@/data/wedding'
import { formatDate, formatTime, getDayOfWeek } from '@/lib/date'
import { DOODLE, Garland, Heart, Snowfall, Squiggle, pen } from './DoodleKit'

interface Props {
  data: WeddingData
}

export default function DoodleHero({ data }: Props) {
  const photo = getOptimizedUrl(data.mainPhoto || DEFAULT_WEDDING_PHOTO, {
    width: 900,
    quality: 'auto:best',
  })
  const when = `${formatDate(data.date)} ${getDayOfWeek(data.date)} ${formatTime(data.time)}`

  return (
    <section className="relative overflow-hidden px-8 pb-12 pt-6 text-center">
      <Snowfall distance={700} />

      <Garland className="mx-auto block h-[74px] w-full max-w-[416px]" />

      <p
        className="mb-2.5 mt-5 text-[12px] font-semibold tracking-[0.42em]"
        style={{ color: DOODLE.muted }}
      >
        OUR WEDDING DAY
      </p>

      <h1 className="m-0" style={pen(52, DOODLE.red)}>
        <span className="whitespace-nowrap">
          {data.groom.name} <Heart size={30} className="inline-block align-[-4px]" /> {data.bride.name}
        </span>
        <br />
        결혼합니다!
      </h1>
      <Squiggle width={120} className="mx-auto mt-1.5" />

      <div className="relative mx-auto mt-8 w-[min(300px,100%)]">
        <Heart size={26} className="doodle-bob absolute -left-6 -top-4" />
        <Heart
          size={18}
          filled={false}
          className="doodle-bob absolute -right-7 top-6"
          style={{ animationDuration: '3.6s' }}
        />
        <Heart size={15} filled={false} className="absolute -left-8 bottom-10" />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="overflow-hidden"
          style={{
            border: `4px solid ${DOODLE.red}`,
            borderRadius: '150px 150px 18px 18px',
            background: '#F1E4CF',
          }}
        >
          <img
            src={photo}
            alt={`${data.groom.name}과 ${data.bride.name} 웨딩 사진`}
            className="block h-[340px] w-full object-cover"
          />
        </motion.div>

        {/* 반지 두 개 낙서 */}
        <svg
          viewBox="0 0 34 30"
          width={46}
          height={40}
          className="absolute -right-4 -top-3.5 z-[3]"
          aria-hidden="true"
        >
          <circle cx="11" cy="20" r="6" fill={DOODLE.red} />
          <circle cx="23" cy="20" r="6" fill={DOODLE.red} />
          <path
            d="M17 4 C 10 8, 10 16, 14 18 M17 4 C 24 8, 24 16, 20 18"
            fill="none"
            stroke={DOODLE.greenLine}
            strokeWidth={3}
            strokeLinecap="round"
          />
        </svg>

        <p
          className="relative -mt-5 inline-block px-5 pb-2 pt-1.5"
          style={{
            ...pen(23),
            background: DOODLE.red,
            color: DOODLE.cream,
            borderRadius: '6px 18px 6px 18px',
            transform: 'rotate(-2deg)',
          }}
        >
          {when}
        </p>
        <p className="mt-2.5" style={pen(22, DOODLE.inkSoft)}>
          겨울의 한가운데, 가장 따뜻한 날
        </p>
        <p className="mt-1 text-[13px]" style={{ color: DOODLE.muted }}>
          {data.venue}
        </p>
      </div>
    </section>
  )
}
