// 테스토 테마 전용 레이아웃 — 다른 테마의 섹션 컴포넌트는 사용하지 않는다.
import { lazy, Suspense } from 'react'
import { WeddingData } from '@/types'
import { TESTO, TornDivider } from './TestoKit'
import TestoHero from './TestoHero'

const TestoGallery     = lazy(() => import('./TestoGallery'))
const TestoCalendar    = lazy(() => import('./TestoCalendar'))
const TestoLocation    = lazy(() => import('./TestoLocation'))
const TestoAccount     = lazy(() => import('./TestoAccount'))
const TestoGuestbook   = lazy(() => import('./TestoGuestbook'))
const TestoRSVP        = lazy(() => import('./TestoRSVP'))
const TestoGuestUpload = lazy(() => import('./TestoGuestUpload'))
const TestoShare       = lazy(() => import('./TestoShare'))

interface Props {
  data: WeddingData
}

function SectionFallback() {
  return <div className="py-16" />
}

export default function TestoInvitation({ data }: Props) {
  return (
    <div className="min-h-screen" style={{ background: TESTO.paper, color: TESTO.ink }}>
      <TestoHero data={data} />
      <TornDivider variant={0} />

      <Suspense fallback={<SectionFallback />}>
        <TestoGallery data={data} />
      </Suspense>
      <TornDivider variant={1} flip />

      <Suspense fallback={<SectionFallback />}>
        <TestoCalendar data={data} />
      </Suspense>
      <TornDivider variant={2} />

      <Suspense fallback={<SectionFallback />}>
        <TestoLocation data={data} />
      </Suspense>
      {/* Location과 Account는 같은 붉은 배경으로 이어지므로 사이에 구분선을 넣지 않는다 */}
      <Suspense fallback={<SectionFallback />}>
        <TestoAccount data={data} />
      </Suspense>
      <TornDivider variant={3} flip />

      <Suspense fallback={<SectionFallback />}>
        <TestoGuestbook />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <TestoRSVP />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <TestoGuestUpload data={data} />
      </Suspense>
      <TornDivider variant={4} />

      <Suspense fallback={<SectionFallback />}>
        <TestoShare data={data} />
      </Suspense>
    </div>
  )
}
