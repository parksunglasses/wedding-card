import { WeddingData } from '@/types'
import { loadKakaoShare, isKakaoConfigured } from './kakao'
import { getOptimizedUrl } from './cloudinary'
import { formatDate, getDayOfWeek, formatTime } from './date'

// 카카오톡 공유 (피드 카드) — 공유 섹션/플로팅 버튼 공통 사용
export async function shareKakao(data: WeddingData): Promise<void> {
  if (!isKakaoConfigured) {
    alert('카카오 JavaScript 키 설정이 필요합니다 (.env)')
    return
  }
  const Kakao = await loadKakaoShare()

  const baseUrl = window.location.href.split('#')[0].split('?')[0]
  const dateKor = `${formatDate(data.date)} ${getDayOfWeek(data.date)} ${formatTime(data.time)}`
  const photo = data.mainPhoto || data.galleryPhotos[0] || ''
  const imageUrl = photo ? getOptimizedUrl(photo, { width: 800, dpr: false }) : ''
  const link = { mobileWebUrl: baseUrl, webUrl: baseUrl }
  const calendarUrl = `${baseUrl}?to=calendar`

  Kakao.Share.sendDefault({
    objectType: 'location',
    address: data.address,
    addressTitle: data.venue,
    content: {
      title: `${data.groom.name} ❤️ ${data.bride.name} 결혼식에 초대합니다.`,
      description: `${dateKor}\n${data.venue}`,
      imageUrl,
      link,
    },
    buttons: [
      { title: '일정 등록', link: { mobileWebUrl: calendarUrl, webUrl: calendarUrl } },
    ],
  })
}

// 카카오 톡캘린더 일정 등록
export async function addKakaoCalendar(data: WeddingData): Promise<void> {
  if (!isKakaoConfigured) return
  const Kakao = await loadKakaoShare()

  const [year, month, day] = data.date.split('-').map(Number)
  const [hour, minute] = data.time.split(':').map(Number)
  const pad = (n: number) => String(n).padStart(2, '0')

  const start = `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00+09:00`
  const endHour = hour + 2
  const end   = `${year}-${pad(month)}-${pad(day)}T${pad(endHour)}:${pad(minute)}:00+09:00`

  Kakao.Calendar.createEvents({
    title: `${data.groom.name} ♥ ${data.bride.name} 결혼식`,
    time: { start, end, allDay: false, lunar: false },
    location: { name: data.venue, address: data.address, latitude: data.lat, longitude: data.lng },
    reminders: [1440], // 하루 전 알림
  })
}
