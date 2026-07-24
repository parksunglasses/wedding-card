import { memo, useEffect, useState } from 'react'
import { formatTime, getCalendarData, getCountdown, getDayOfWeek } from '@/lib/date'
import { TESTO, pen, gaegu, SnowTree, Deco } from './TestoKit'
import { TESTO_TEXT } from './testoData'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

const Countdown = memo(function Countdown({ cc, lc }: { cc: string; lc: string }) {
  const [c, setC] = useState(() => getCountdown(TESTO_TEXT.date, TESTO_TEXT.time))
  useEffect(() => {
    const id = setInterval(() => setC(getCountdown(TESTO_TEXT.date, TESTO_TEXT.time)), 1000)
    return () => clearInterval(id)
  }, [])
  const pad = (v: number) => String(v).padStart(2, '0')
  const units = [
    { v: String(c.days), l: '일' },
    { v: pad(c.hours), l: '시간' },
    { v: pad(c.minutes), l: '분' },
    { v: pad(c.seconds), l: '초' },
  ]
  return (
    <div className="countdown" style={{ border: `2px solid ${cc}`, borderRadius: '70px/46px', transform: 'rotate(-1deg)' }}>
      {units.map((u, i) => (
        <div key={u.l} className="flex-center gap-12">
          {i > 0 && <span style={pen(18, cc)}>:</span>}
          <div>
            <div style={pen(24, cc)}>{u.v}</div>
            <div style={{ ...gaegu, fontSize: 10, color: lc }}>{u.l}</div>
          </div>
        </div>
      ))}
    </div>
  )
})

export default function TestoCalendar() {
  const { month, year, weeks } = getCalendarData(TESTO_TEXT.date)
  const weddingDay = weeks.flat().find((d) => d.isWedding)
  return (
    <section className="testo-paper-red calendar" style={{ color: TESTO.paper }}>
      <Deco tone="red" items={[]} />
      <div className="cal-head">
        <span style={pen(44, TESTO.paper)}>{month}월</span>
        <SnowTree size={38} />
        <span style={pen(44, TESTO.paper)}>{year}</span>
      </div>
      <div style={{ borderTop: `2px solid ${TESTO.paper}`, marginTop: 6 }} />
      <div className="cal-grid" style={gaegu}>
        {WEEKDAYS.map((d, i) => (
          <div key={d} className="cal-wd" style={{ color: i === 0 || i === 6 ? TESTO.gold : TESTO.paper }}>{d}</div>
        ))}
        {weeks.flat().map((d, i) => (
          <div key={i} className="cal-cell">
            {d.day && (
              <span className={d.isWedding ? 'cal-wed' : ''} style={{ color: d.isWedding || d.isSunday || d.isSaturday ? TESTO.gold : TESTO.paper }}>
                {d.day}
              </span>
            )}
            {d.isWedding && (
              <svg viewBox="0 0 46 42" width={46} height={42} className="cal-heart" aria-hidden="true">
                <path
                  d="M23 39 C 23 39 4 27.5 4 15.5 C 4 9 11 6.6 16.5 10.4 C 19.6 12.6 21.6 14.6 23 17.4 C 24.4 14.6 26.4 12.6 29.5 10.4 C 35 6.6 42 9 42 15.5 C 42 27.5 23 39 23 39 Z"
                  fill={TESTO.paper}
                  fillOpacity="0.42"
                  stroke={TESTO.paper}
                  strokeWidth="2.2"
                />
              </svg>
            )}
          </div>
        ))}
      </div>
      <p style={{ ...gaegu, fontSize: 22, fontWeight: 700, color: TESTO.paper, marginTop: 28 }}>
        {year}년 {month}월 {weddingDay && weddingDay.day}일 {getDayOfWeek(TESTO_TEXT.date)} {formatTime(TESTO_TEXT.time)}
      </p>
      <Countdown cc={TESTO.paper} lc="rgba(244,236,217,.7)" />
    </section>
  )
}
