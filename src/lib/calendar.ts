import { WeddingData } from '@/types'
import { formatDate, getDayOfWeek, formatTime } from './date'
import { addKakaoCalendar } from './share'

function formatCalendarDates(dateStr: string, timeStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number)
  const [hour, minute] = timeStr.split(':').map(Number)
  const pad = (n: number) => String(n).padStart(2, '0')

  const startDate = `${year}${pad(month)}${pad(day)}T${pad(hour)}${pad(minute)}00`
  const endHour = hour + 2
  const endDate = `${year}${pad(month)}${pad(day)}T${pad(endHour)}${pad(minute)}00`

  return { startDate, endDate }
}

// 1. 구글 캘린더 연동 (안드로이드 / 웹)
export function openGoogleCalendar(data: WeddingData) {
  const { startDate, endDate } = formatCalendarDates(data.date, data.time)
  const title = encodeURIComponent(`${data.groom.name} ♥ ${data.bride.name} 결혼식`)
  const location = encodeURIComponent(`${data.venue} (${data.address})`)
  const details = encodeURIComponent(`${formatDate(data.date)} ${getDayOfWeek(data.date)} ${formatTime(data.time)}\n${data.venue}`)

  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&location=${location}&details=${details}`
  window.open(url, '_blank')
}

// 2. 애플 캘린더 / .ics 파일 다운로드 (아이폰 / iOS / macOS / 기종 공용)
export function downloadIcsCalendar(data: WeddingData) {
  const { startDate, endDate } = formatCalendarDates(data.date, data.time)
  const title = `${data.groom.name} ♥ ${data.bride.name} 결혼식`
  const location = `${data.venue} (${data.address})`
  const description = `${formatDate(data.date)} ${getDayOfWeek(data.date)} ${formatTime(data.time)}`

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wedding Card//KR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `LOCATION:${location}`,
    `DESCRIPTION:${description}`,
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.setAttribute('download', 'wedding-event.ics')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 3. 기종 자동 감지 및 스마트 일정 추가
export function addDeviceCalendar(data: WeddingData) {
  const userAgent = navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera || ''

  if (/iPhone|iPad|iPod|Macintosh/i.test(userAgent)) {
    downloadIcsCalendar(data)
  } else if (/Android/i.test(userAgent)) {
    openGoogleCalendar(data)
  } else {
    // 기타 PC/브라우저는 구글 캘린더 또는 카카오 톡캘린더
    openGoogleCalendar(data)
  }
}

export { addKakaoCalendar }
