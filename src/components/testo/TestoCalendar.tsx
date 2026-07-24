import { memo, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { WeddingData } from '@/types'
import { formatTime, getCalendarData, getCountdown, getDayOfWeek } from '@/lib/date'
import { SnowTree, TESTO, pen } from './TestoKit'

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
      className="mt-4 inline-flex gap-4 px-[26px] py-3.5"
      style={{ border: `2px solid ${TESTO.red}`, borderRadius: '70px/46px', transform: 'rotate(-1deg)' }}
      aria-label={`결혼까지 ${countdown.days}일 ${countdown.hours}시간 ${countdown.minutes}분 남음`}
    >
      {units.map((unit, index) => (
        <div key={unit.label} className="flex items-center gap-4">
          {index > 0 && <span style={pen(24, TESTO.red)}>:</span>}
          <div>
            <div style={pen(30, TESTO.red)}>{unit.value}</div>
            <div className="text-[11px]" style={{ fontFamily: 'Gaegu, sans-serif', color: TESTO.muted }}>
              {unit.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
})

export default function TestoCalendar({ data }: Props) {
  const calendar = getCalendarData(data.date)
  const [year, month] = data.date.split('-').map(Number)

  return (
    <section className="testo-paper px-10 py-[52px] text-center">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7 }}
      >
        <div className="flex items-end justify-between">
          <span style={pen(44, TESTO.red)}>{month}월</span>
          {/* 히어로에서 옮겨온 트리 — 흐름 안에 두어 어떤 화면 폭에서도 글자를 가리지 않는다 */}
          <SnowTree size={38} className="mb-0.5" />
          <span style={pen(44, TESTO.red)}>{year}</span>
        </div>
        <div style={{ borderTop: `2px solid ${TESTO.red}`, marginTop: 6 }} />

        <div className="mt-3 grid grid-cols-7 gap-0.5 text-[14px]" style={{ fontFamily: 'Gaegu, sans-serif' }}>
          {WEEKDAYS.map((day, index) => (
            <div
              key={day}
              className="py-1 font-bold"
              style={{ color: index === 0 ? TESTO.redSoft : index === 6 ? TESTO.red : TESTO.ink }}
            >
              {day}
            </div>
          ))}

          {calendar.weeks.flat().map((dayInfo, index) => (
            <div key={index} className="relative py-1.5">
              {dayInfo.day && (
                <span
                  className={dayInfo.isWedding ? 'font-extrabold' : undefined}
                  style={{
                    color: dayInfo.isWedding
                      ? TESTO.red
                      : dayInfo.isSunday
                        ? TESTO.redSoft
                        : dayInfo.isSaturday
                          ? TESTO.red
                          : TESTO.ink,
                  }}
                >
                  {dayInfo.day}
                </span>
              )}
              {dayInfo.isWedding && (
                <svg
                  viewBox="0 0 46 42"
                  width={46}
                  height={42}
                  className="pointer-events-none absolute left-1/2 top-[-8px] -ml-[23px]"
                  aria-hidden="true"
                >
                  <path
                    d="M23 38 C 23 38 5 26 5 14 C 5 6 13 4 18 9 C 20 11 22 13 23 15 C 24 13 26 11 28 9 C 33 4 41 6 41 14 C 41 26 23 38 23 38 Z"
                    fill="none"
                    stroke={TESTO.red}
                    strokeWidth={1.8}
                  />
                </svg>
              )}
            </div>
          ))}
        </div>

        <p className="mt-4 text-[15px]" style={{ fontFamily: 'Gaegu, sans-serif', color: TESTO.inkSoft }}>
          {year}년 {month}월 {calendar.weeks.flat().find((d) => d.isWedding)?.day}일 {getDayOfWeek(data.date)}{' '}
          {formatTime(data.time)}
        </p>

        <Countdown date={data.date} time={data.time} />
      </motion.div>
    </section>
  )
}
