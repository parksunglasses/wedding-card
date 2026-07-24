// 레드두들 테마 전용 레이아웃 — 다른 테마의 섹션 컴포넌트는 사용하지 않는다.
import { lazy, Suspense } from 'react'
import { WeddingData } from '@/types'
import { CandyStripe, DOODLE } from './DoodleKit'
import DoodleHero from './DoodleHero'
import DoodleGreeting from './DoodleGreeting'

const DoodleGallery     = lazy(() => import('./DoodleGallery'))
const DoodleCalendar    = lazy(() => import('./DoodleCalendar'))
const DoodleLocation    = lazy(() => import('./DoodleLocation'))
const DoodleAccount     = lazy(() => import('./DoodleAccount'))
const DoodleGuestbook   = lazy(() => import('./DoodleGuestbook'))
const DoodleRSVP        = lazy(() => import('./DoodleRSVP'))
const DoodleGuestUpload = lazy(() => import('./DoodleGuestUpload'))
const DoodleShare       = lazy(() => import('./DoodleShare'))

interface Props {
  data: WeddingData
}

function SectionFallback() {
  return <div className="py-16" />
}

export default function DoodleInvitation({ data }: Props) {
  return (
    <div className="min-h-screen" style={{ background: DOODLE.cream, color: DOODLE.ink }}>
      <DoodleHero data={data} />
      <CandyStripe />
      <DoodleGreeting data={data} />

      <Suspense fallback={<SectionFallback />}>
        <DoodleGallery data={data} />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <DoodleCalendar data={data} />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <DoodleLocation data={data} />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <DoodleAccount data={data} />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <DoodleGuestbook />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <DoodleRSVP />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <DoodleGuestUpload data={data} />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <DoodleShare data={data} />
      </Suspense>
    </div>
  )
}
