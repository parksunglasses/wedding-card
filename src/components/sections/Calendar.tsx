import { memo, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { WeddingData } from '@/types'
import { Theme } from '@/themes'
import { formatDate, formatTime, getCalendarData, getCountdown, getDayOfWeek } from '@/lib/date'
import SectionHeading from '@/components/ui/SectionHeading'

interface Props {
  data: WeddingData
  theme: Theme
}

const Countdown = memo(function Countdown({
  date,
  time,
  theme,
}: {
  date: string
  time: string
  theme: Theme
}) {
  const [countdown, setCountdown] = useState(() => getCountdown(date, time))

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(getCountdown(date, time)), 1000)
    return () => window.clearInterval(timer)
  }, [date, time])

  return (
    <div
      className="mt-14 grid grid-cols-[auto_1fr] items-center gap-6 border-y px-1 py-7 text-left"
      style={{ borderColor: theme.colors.border }}
      aria-label={`결혼까지 ${countdown.days}일 ${countdown.hours}시간 ${countdown.minutes}분 남음`}
    >
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full border font-heading text-2xl"
        style={{ borderColor: theme.colors.accent, color: theme.colors.accent }}
      >
        {countdown.days}
      </div>
      <div>
        <p className="mb-2 text-[11px] tracking-[0.16em]" style={{ color: theme.colors.textMuted }}>
          UNTIL OUR WEDDING
        </p>
        <p className="text-[13px]">
          <strong className="font-medium" style={{ color: theme.colors.accent }}>{countdown.days}일</strong>
          <span className="mx-2" style={{ color: theme.colors.border }}>|</span>
          {String(countdown.hours).padStart(2, '0')}시간
          <span className="mx-2" style={{ color: theme.colors.border }}>|</span>
          {String(countdown.minutes).padStart(2, '0')}분
        </p>
      </div>
    </div>
  )
})

export default function Calendar({ data, theme }: Props) {
  const calendar = getCalendarData(data.date)
  const weekdays = ['일', '월', '화', '수', '목', '금', '토']

  return (
    <section className="invitation-section theme-bg">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.75 }}
      >
        <SectionHeading
          label={`${new Date(data.date).toLocaleString('en-US', { month: 'long' })} ${calendar.year}`}
          title={`${calendar.month}월의 약속`}
          description={`${formatDate(data.date)} ${getDayOfWeek(data.date)} · ${formatTime(data.time)}`}
        />

        <div className="mx-auto max-w-[330px] border-t pt-5" style={{ borderColor: theme.colors.border }}>
          <div className="mb-3 grid grid-cols-7 text-center text-[11px]">
            {weekdays.map((day, index) => (
              <div
                key={day}
                className="py-2 font-medium"
                style={{ color: index === 0 ? theme.colors.accent : index === 6 ? theme.colors.bgDark : theme.colors.textMuted }}
              >
                {day}
              </div>
            ))}
          </div>

          {calendar.weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 text-center">
              {week.map((dayInfo, dayIndex) => (
                <div key={dayIndex} className="flex aspect-square items-center justify-center">
                  {dayInfo.day && (
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full text-[13px]"
                      style={dayInfo.isWedding
                        ? { background: theme.colors.accent, color: theme.colors.bg, fontWeight: 600 }
                        : {
                            color: dayInfo.isSunday
                              ? theme.colors.accent
                              : dayInfo.isSaturday
                                ? theme.colors.bgDark
                                : theme.colors.text,
                          }}
                    >
                      {dayInfo.day}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <Countdown date={data.date} time={data.time} theme={theme} />
      </motion.div>
    </section>
  )
}
