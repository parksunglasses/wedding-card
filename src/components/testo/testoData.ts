// 테스토 청첩장 텍스트 — 디자인 시안(테스토-kit.jsx DATA)과 100% 동일하게 고정한다.
// (사진·지도 좌표만 실제 WeddingData를 사용하고, 텍스트는 전부 여기서 가져온다.)
import { Account } from '@/types'

export const TESTO_TEXT = {
  groom: {
    name: '박성환',
    nameEn: 'Sung Hwan',
    given: '성환',
    father: '박철규',
    mother: '우성남',
    accounts: [
      { bank: '국민은행', accountNumber: '000-00-0000-000', holder: '박성환' },
      { bank: '농협', accountNumber: '000-0000-0000-00', holder: '박철규' },
    ] as Account[],
  },
  bride: {
    name: '이지영',
    nameEn: 'Ji Young',
    given: '지영',
    father: '이인한',
    mother: '윤미경',
    accounts: [
      { bank: '신한은행', accountNumber: '000-000-000000', holder: '이지영' },
      { bank: '우리은행', accountNumber: '0000-000-000000', holder: '이인한' },
      { bank: '하나은행', accountNumber: '000-000000-000', holder: '윤미경' },
    ] as Account[],
  },
  date: '2026-12-19',
  time: '11:00',
  venue: '서울웨딩타워',
  address: '서울 송파구 양재대로 932 2층',
  venuePhone: '02-463-5000',
  subway: '3·8호선 가락시장역 2번 출구 도보 3분',
  bus: '가락시장 · 가락시장역 · 가락몰 하차',
  parking: '가락몰 동문 지하주차장, 지하3층',
  tape: '우리 결혼해요!',
  intro: ['서로를 향한 믿음으로 시작해 이제 평생을 약속하려 합니다.', '저희들의 첫 시작을 함께해 주세요.'],
} as const
