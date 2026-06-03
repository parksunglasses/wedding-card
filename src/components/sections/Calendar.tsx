import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { WeddingData } from '@/types'
import { Theme } from '@/themes'
import { getCalendarData, getCountdown, formatDate, getDayOfWeek, formatTime } from '@/lib/date'

interface Props {
  data: WeddingData
  theme: Theme
}

export default function Calendar({ data, theme }: Props) {
  const [countdown, setCountdown] = useState(getCountdown(data.date, data.time))
  const calendar = getCalendarData(data.date)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdown(data.date, data.time))
    }, 1000)
    return () => clearInterval(timer)
  }, [data.date, data.time])

  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  return (
    <section className="theme-bg py-16 px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center mb-10">
          <div className="inline-block border rounded-full px-6 py-2" style={{ borderColor: theme.colors.accent + '66' }}>
            <p className="font-heading text-xs tracking-[0.4em] theme-accent uppercase">
              Calendar
            </p>
          </div>
        </div>

        <div className="text-center mb-2">
          <h2 className="font-heading text-7xl theme-text leading-none">
            {calendar.month}
          </h2>
          <p className="text-xs theme-text-muted tracking-widest mt-2 uppercase">
            {new Date(data.date).toLocaleString('en-US', { month: 'long' })}, {calendar.year}
          </p>
        </div>

        <div className="mt-10 max-w-xs mx-auto">
          <div className="grid grid-cols-7 gap-1 mb-3 text-center">
            {weekdays.map((day, idx) => (
              <div
                key={idx}
                className={`text-xs font-semibold py-2 ${
                  idx === 0 ? 'text-red-400' : idx === 6 ? 'text-blue-400' : 'theme-text-muted'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {calendar.weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="grid grid-cols-7 gap-1 text-center">
              {week.map((dayInfo, dayIdx) => (
                <div key={dayIdx} className="aspect-square flex items-center justify-center">
                  {dayInfo.day && (
                    <div
                      className={`w-9 h-9 flex items-center justify-center text-sm rounded-full ${
                        dayInfo.isSunday ? 'text-red-400' : dayInfo.isSaturday ? 'text-blue-400' : 'theme-text'
                      }`}
                      style={dayInfo.isWedding ? {
                        background: theme.colors.accent,
                        color: '#FFFFFF',
                        fontWeight: 600,
                      } : undefined}
                    >
                      {dayInfo.day}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="text-center mt-10 space-y-2">
          <p className="text-lg font-medium theme-text">
            {formatDate(data.date)} {getDayOfWeek(data.date)}
          </p>
          <p className="text-base" style={{ color: theme.colors.text + 'CC' }}>
            {formatTime(data.time)}
          </p>
        </div>
      </motion.div>

      <div className="mt-16 -mx-8 px-8 py-12 theme-bg-dark" style={{ color: theme.colors.accentLight }}>
        <div className="grid grid-cols-4 gap-2 max-w-md mx-auto text-center">
          {[
            { label: 'DAY', value: countdown.days },
            { label: 'HOUR', value: countdown.hours },
            { label: 'MIN', value: countdown.minutes },
            { label: 'SEC', value: countdown.seconds },
          ].map((item, idx) => (
            <div key={idx}>
              <p className="font-heading text-xs tracking-widest mb-2" style={{ color: theme.colors.accentLight }}>
                {item.label}
              </p>
              <p className="font-heading text-3xl" style={{ color: theme.colors.bg }}>
                {String(item.value).padStart(2, '0')}
              </p>
            </div>
          ))}
        </div>
        <p className="text-center text-sm mt-8" style={{ color: theme.colors.bg + 'CC' }}>
          결혼까지 남은 시간 · <span style={{ color: theme.colors.accentLight }}>{countdown.days}</span>일
        </p>
      </div>
    </section>
  )
}
