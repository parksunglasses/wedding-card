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
              <svg viewBox="0 0 52 48" width={52} height={48} className="cal-heart" aria-hidden="true">
                <path
                  d="M26 44 C 26 44 4 30 4 17 C 4 9.5 10.5 5 17.5 5 C 21.5 5 24.5 7.2 26 9.8 C 27.5 7.2 30.5 5 34.5 5 C 41.5 5 48 9.5 48 17 C 48 30 26 44 26 44 Z"
                  fill="none"
                  stroke={TESTO.paper}
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
