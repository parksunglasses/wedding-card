// 날짜 관련 유틸

export function formatDate(dateStr: string): string {
  // '2026-05-24' → '2026년 5월 24일'
  const [year, month, day] = dateStr.split('-')
  return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`
}

export function getDayOfWeek(dateStr: string): string {
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
  const date = new Date(dateStr)
  return days[date.getDay()]
}

export function formatTime(timeStr: string): string {
  // '17:00' → '오후 5시'
  const [hour, minute] = timeStr.split(':').map(Number)
  const period = hour < 12 ? '오전' : '오후'
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return minute === 0 ? `${period} ${displayHour}시` : `${period} ${displayHour}시 ${minute}분`
}

export function formatDateEnglish(dateStr: string, timeStr: string): string {
  // '2026-05-24', '17:00' → 'Sunday, May 24, 2026, at 5:00 PM'
  const date = new Date(`${dateStr}T${timeStr}`)
  return date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export interface CountdownData {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function getCountdown(dateStr: string, timeStr: string): CountdownData {
  const target = new Date(`${dateStr}T${timeStr}`).getTime()
  const now = Date.now()
  const diff = Math.max(0, target - now)

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

// 달력 데이터 생성
export interface CalendarDay {
  day: number | null
  isWedding: boolean
  isSunday: boolean
  isSaturday: boolean
}

export function getCalendarData(dateStr: string): {
  month: number
  year: number
  weeks: CalendarDay[][]
} {
  const [year, month, weddingDay] = dateStr.split('-').map(Number)
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  const startDay = firstDay.getDay()
  const totalDays = lastDay.getDate()

  const days: CalendarDay[] = []

  // 빈 칸 (월 시작 전)
  for (let i = 0; i < startDay; i++) {
    days.push({ day: null, isWedding: false, isSunday: false, isSaturday: false })
  }

  // 날짜
  for (let day = 1; day <= totalDays; day++) {
    const dayOfWeek = new Date(year, month - 1, day).getDay()
    days.push({
      day,
      isWedding: day === weddingDay,
      isSunday: dayOfWeek === 0,
      isSaturday: dayOfWeek === 6,
    })
  }

  // 주 단위로 묶기
  const weeks: CalendarDay[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  return { month, year, weeks }
}
