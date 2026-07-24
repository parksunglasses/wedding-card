import { WeddingData } from '@/types'

const STORAGE_KEY = 'wedding_data'
const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY,
)

export const DEFAULT_WEDDING_PHOTO =
  'https://res.cloudinary.com/dgpszvzrb/image/upload/v1780475781/qzzxh6ujx3p7tgzfzqc9.jpg'

export const defaultWeddingData: WeddingData = {
  groom: {
    name: '박성환',
    phone: '010-0000-0000',
    father: '박철규',
    mother: '우성남',
  },
  bride: {
    name: '이지영',
    phone: '010-0000-0000',
    father: '이인한',
    mother: '윤미경',
  },

  date: '2026-12-19',
  time: '11:00',
  venue: '서울웨딩타워',
  address: '서울 송파구 양재대로 932 2층',
  venuePhone: '02-463-5000',
  lat: 37.495096,
  lng: 127.115506,

  greetingTitle: '서로를 향한 믿음으로 시작해\n이제 평생을 약속하려 합니다.',
  greetingMessage: '박성환 & 이지영\n두 사람의 첫 시작을 소중한 분들과 함께하고 싶습니다.\n따뜻한 마음으로 축하해 주시면 더없는 기쁨이 되겠습니다.',

  mainPhoto: '',
  galleryPhotos: [],

  subway: '3·8호선 가락시장역 2번 출구 도보 3분',
  bus: '가락시장 · 가락시장역 · 가락몰 하차',
  parking: '가락몰 동문 지하주차장, 지하3층',

  groomAccounts: [
    { bank: '국민은행', accountNumber: '000-00-0000-000', holder: '박성환' },
    { bank: '농협', accountNumber: '000-0000-0000-00', holder: '박철규' },
  ],
  brideAccounts: [
    { bank: '신한은행', accountNumber: '000-000-000000', holder: '이지영' },
    { bank: '우리은행', accountNumber: '0000-000-000000', holder: '이인한' },
    { bank: '하나은행', accountNumber: '000-000000-000', holder: '윤미경' },
  ],

  flowerLink: '',
  bgmUrl: '/audio/bgm.mp3',
  doorIntro: true,
  lottieUrl: '',
  fireworks: true,
  theme: 'elegant',
}

// localStorage에서 불러오기 (동기, 초기 렌더용)
export function loadWeddingData(): WeddingData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return { ...defaultWeddingData, ...JSON.parse(saved) }
    }
  } catch (e) {
    console.error('Failed to load wedding data from localStorage', e)
  }
  return defaultWeddingData
}

// Supabase에서 불러오기 (비동기) → localStorage도 동기화
export async function loadWeddingDataAsync(): Promise<WeddingData> {
  if (isSupabaseConfigured) {
    try {
      const { loadWeddingDataFromDB } = await import('@/lib/supabase')
      const remote = await loadWeddingDataFromDB()
      if (remote) {
        const merged = { ...defaultWeddingData, ...remote } as WeddingData
        // 로컬에도 캐시
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
        return merged
      }
    } catch (e) {
      console.error('Failed to load wedding data from Supabase', e)
    }
  }
  return loadWeddingData()
}

// 저장: Supabase + localStorage 동시에
export async function saveWeddingData(data: WeddingData): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save to localStorage', e)
  }
  try {
    if (!isSupabaseConfigured) return
    const { saveWeddingDataToDB } = await import('@/lib/supabase')
    await saveWeddingDataToDB(data as unknown as Record<string, unknown>)
  } catch (e) {
    console.error('Failed to save to Supabase', e)
  }
}
