import { WeddingData } from '@/types'
import { loadWeddingDataFromDB, saveWeddingDataToDB, isSupabaseConfigured } from '@/lib/supabase'

const STORAGE_KEY = 'wedding_data'

export const defaultWeddingData: WeddingData = {
  groom: {
    name: '박성환',
    phone: '010-0000-0000',
    father: '김종표',
    mother: '김인숙',
  },
  bride: {
    name: '이지영',
    phone: '010-0000-0000',
    father: '박영진',
    mother: '조수아',
  },

  date: '2026-12-19',
  time: '11:00',
  venue: '서울웨딩타워',
  address: '서울 강남구 영동대로 517',
  venuePhone: '02-551-0100',
  lat: 37.5087,
  lng: 127.0603,

  greetingTitle: '서로를 향한 믿음으로\n함께하는 모든 날들이\n빛나는 추억이 되도록\n평생을 약속합니다.',
  greetingMessage: '박성환, 이지영\n두 사람이 하나가 되는 자리에\n소중한 분들을 초대합니다.\n따뜻한 마음으로 함께해 주시면\n더없는 기쁨이 되겠습니다.',

  mainPhoto: '',
  galleryPhotos: [],

  subway: '2호선 삼성역 5번출구 (도보 5분)\n9호선 봉은사역 7번출구 (도보 10분)',
  bus: '[간선버스] 146, 341, 360, 740\n[지선버스] 3412, 4312',
  parking: '서울웨딩타워 지하주차장 (무료)',

  groomAccounts: [
    { bank: '국민은행', accountNumber: '000-00-0000-000', holder: '박성환' },
  ],
  brideAccounts: [
    { bank: '신한은행', accountNumber: '000-000-000000', holder: '이지영' },
  ],

  flowerLink: '',
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
    await saveWeddingDataToDB(data as unknown as Record<string, unknown>)
  } catch (e) {
    console.error('Failed to save to Supabase', e)
  }
}
