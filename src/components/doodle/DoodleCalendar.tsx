import { memo, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { WeddingData } from '@/types'
import { getCalendarData, getCountdown } from '@/lib/date'
import { DOODLE, DoodleHeading, Heart, pen } from './DoodleKit'

interface Props {
  data: WeddingData
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

const Countdown = memo(function Countdown({ date, time }: { date: string; time: string }) {
  const [countdown, setCountdown] = useState(() => getCountdown(date, time))

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(getCountdown(date, time)), 1000)
    return () => window.clearInterval(timer)
  }, [date, time])

  const pad = (value: number) => String(value).padStart(2, '0')
  const units = [
    { value: String(countdown.days), label: '일' },
    { value: pad(countdown.hours), label: '시간' },
    { value: pad(countdown.minutes), label: '분' },
    { value: pad(countdown.seconds), label: '초' },
  ]

  return (
    <div
      className="mt-2.5 inline-flex gap-4 px-7 py-4"
      style={{
        border: `2.5px solid ${DOODLE.red}`,
        borderRadius: '60px/40px',
        transform: 'rotate(-1deg)',
      }}
      aria-label={`결혼까지 ${countdown.days}일 ${countdown.hours}시간 ${countdown.minutes}분 남음`}
    >
      {units.map((unit, index) => (
        <div key={unit.label} className="flex items-center gap-4">
          {index > 0 && <span className="text-[22px]" style={{ color: DOODLE.red }}>:</span>}
          <div>
            <div className="text-[26px] font-extrabold" style={{ color: DOODLE.red }}>
              {unit.value}
            </div>
            <div className="text-[11px]" style={{ color: DOODLE.muted }}>{unit.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
})

export default function DoodleCalendar({ data }: Props) {
  const calendar = getCalendarData(data.date)

  return (
    <section className="px-10 py-14 text-center">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7 }}
      >
        <DoodleHeading squiggleWidth={80} className="mb-6">언제냐면요!</DoodleHeading>

        <div className="mx-auto max-w-[330px]">
          <div className="grid grid-cols-7 gap-1 text-[13.5px]">
            {WEEKDAYS.map((day, index) => (
              <div
                key={day}
                className="py-1.5 font-semibold"
                style={{
                  color: index === 0 ? DOODLE.redSoft : index === 6 ? '#4A6FA5' : DOODLE.ink,
                }}
              >
                {day}
              </div>
            ))}

            {calendar.weeks.flat().map((dayInfo, index) => (
              <div key={index} className="relative py-2">
                {dayInfo.day && (
                  <span
                    className={dayInfo.isWedding ? 'font-extrabold' : undefined}
                    style={{
                      color: dayInfo.isWedding
                        ? DOODLE.red
                        : dayInfo.isSunday
                          ? DOODLE.redSoft
                          : dayInfo.isSaturday
                            ? '#4A6FA5'
                            : DOODLE.ink,
                    }}
                  >
                    {dayInfo.day}
                  </span>
                )}
                {dayInfo.isWedding && (
                  <Heart
                    size={40}
                    filled={false}
                    className="pointer-events-none absolute left-1/2 top-0 -ml-5"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6" style={pen(26, DOODLE.red)}>우리가 만나기까지</p>
        <Countdown date={data.date} time={data.time} />
      </motion.div>
    </section>
  )
}
