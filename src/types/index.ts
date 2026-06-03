// 청첩장 데이터 타입

export interface Person {
  name: string
  phone: string
  father: string
  mother: string
}

export interface Account {
  bank: string
  accountNumber: string
  holder: string
}

export interface WeddingData {
  // 신랑신부
  groom: Person
  bride: Person

  // 예식
  date: string          // '2026-05-24'
  time: string          // '17:00'
  venue: string
  address: string
  venuePhone: string
  lat: number
  lng: number

  // 인사말
  greetingTitle: string  // '우빈 빈자리 수많은 경건한...'
  greetingMessage: string

  // 사진
  mainPhoto: string
  galleryPhotos: string[]

  // 교통편
  subway: string
  bus: string
  parking: string

  // 계좌
  groomAccounts: Account[]
  brideAccounts: Account[]

  // 화환
  flowerLink: string

  // 배경음악 (BGM)
  bgmUrl: string

  // 입장(문 열림) 애니메이션 on/off
  doorIntro: boolean

  // 테마
  theme: 'elegant' | 'minimal' | 'flower' | 'dark' | 'natural' | 'hyundai'
}

export interface GuestbookEntry {
  id: string
  name: string
  message: string
  createdAt: string
}

export interface RSVPEntry {
  id: string
  name: string
  phone: string
  attendance: 'attending' | 'not_attending'
  guestCount: number
  meal: boolean
  message: string
  createdAt: string
}
