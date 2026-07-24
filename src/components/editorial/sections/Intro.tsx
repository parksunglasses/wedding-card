import { motion } from 'framer-motion'
import { WeddingData } from '@/types'
import { Theme } from '@/themes'
import { getOptimizedUrl } from '@/lib/cloudinary'
import { DEFAULT_WEDDING_PHOTO } from '@/data/wedding'
import { formatTime } from '@/lib/date'
import { ChevronDownIcon } from '@/components/ui/Icons'

interface Props {
  data: WeddingData
  theme: Theme
}

function formatHeroDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`)
  const weekday = parsed.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
  return `${parsed.getFullYear()}. ${String(parsed.getMonth() + 1).padStart(2, '0')}. ${String(parsed.getDate()).padStart(2, '0')}. ${weekday}`
}

function formatDateRail(date: string) {
  const parsed = new Date(`${date}T00:00:00`)
  const weekday = parsed.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
  return `${date.replace(/-/g, ' · ')} · ${weekday}`
}

export default function Intro({ data, theme }: Props) {
  const photo = getOptimizedUrl(data.mainPhoto || DEFAULT_WEDDING_PHOTO, {
    width: 1000,
    quality: 'auto:best',
  })

  return (
    <section
      className="relative min-h-[760px] h-[100svh] overflow-hidden"
      style={{ background: theme.colors.bg, color: theme.colors.text }}
    >
      <div className="absolute inset-x-5 top-0 bottom-[12%] overflow-hidden bg-white">
        <img
          src={photo}
          alt={`${data.groom.name}과 ${data.bride.name} 웨딩 사진`}
          className="h-full w-full object-cover"
          style={{ objectPosition: '20% center' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, x: -14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.25 }}
        className="absolute left-0 top-[8%] z-10 w-[42%] py-8 pl-7 pr-4"
        style={{ background: `${theme.colors.bg}F2` }}
      >
        <p className="font-heading mb-8 text-[15px] italic tracking-[0.12em]">The Wedding of</p>
        <h1 className="whitespace-nowrap font-heading text-[2.4rem] font-normal leading-[1.55] tracking-[-0.04em]">
          <span className="block">{data.groom.name}</span>
          <span className="my-1 block h-px w-10" style={{ background: theme.colors.accent }} />
          <span className="block">{data.bride.name}</span>
        </h1>

        <dl className="mt-10 space-y-5 text-[13px] leading-relaxed">
          <div>
            <dt className="sr-only">날짜</dt>
            <dd className="font-heading text-[15px] tracking-[0.04em]">{formatHeroDate(data.date)}</dd>
          </div>
          <div className="h-px w-6" style={{ background: theme.colors.accent }} />
          <div>
            <dt className="sr-only">시간</dt>
            <dd>{formatTime(data.time)}</dd>
          </div>
          <div className="h-px w-6" style={{ background: theme.colors.accent }} />
          <div>
            <dt className="sr-only">장소</dt>
            <dd className="font-medium">{data.venue}</dd>
          </div>
        </dl>
      </motion.div>

      <div
        className="absolute right-0 top-[4%] z-10 flex w-[38px] flex-col items-center gap-2 py-5"
        style={{ background: theme.colors.bg }}
        aria-hidden="true"
      >
        <span className="h-7 w-px" style={{ background: theme.colors.accent }} />
        <span
          className="font-heading text-[11px] tracking-[0.3em]"
          style={{ writingMode: 'vertical-rl' }}
        >
          {formatDateRail(data.date)}
        </span>
        <span className="h-7 w-px" style={{ background: theme.colors.accent }} />
      </div>

      <motion.a
        href="#invitation"
        aria-label="초대 글로 이동"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 7, 0] }}
        transition={{ opacity: { delay: 0.9 }, y: { duration: 2, repeat: Infinity } }}
        className="absolute bottom-[8%] left-1/2 z-20 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full"
        style={{ background: theme.colors.bg, color: theme.colors.accent }}
      >
        <ChevronDownIcon className="h-6 w-6" />
      </motion.a>
    </section>
  )
}
