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
  const locationUrl = `${baseUrl}?to=map`
  const link = { mobileWebUrl: baseUrl, webUrl: baseUrl }

  Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: `${data.groom.name} ❤️ ${data.bride.name} 결혼식에 초대합니다.`,
      description: `${dateKor}\n${data.venue}`,
      imageUrl,
      link,
    },
    buttons: [
      { title: '청첩장 보기', link },
      { title: '위치 보기', link: { mobileWebUrl: locationUrl, webUrl: locationUrl } },
    ],
  })
}
