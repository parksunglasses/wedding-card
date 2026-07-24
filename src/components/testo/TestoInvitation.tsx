// 테스토 테마 전용 레이아웃 — 크리스마스 청첩장
import { lazy, Suspense } from 'react'
import { WeddingData } from '@/types'
import { TESTO, TornDivider } from './TestoKit'
import TestoHero from './TestoHero'

const GREEN = '#234A33'

const TestoCalendar    = lazy(() => import('./TestoCalendar'))
const TestoGallery     = lazy(() => import('./TestoGallery'))
const TestoLocation    = lazy(() => import('./TestoLocation'))
const TestoAccount     = lazy(() => import('./TestoAccount'))
const TestoGuestbook   = lazy(() => import('./TestoGuestbook'))
const TestoShare       = lazy(() => import('./TestoShare'))
const TestoClosing     = lazy(() => import('./TestoClosing'))

interface Props {
  data: WeddingData
}

function SectionFallback() {
  return <div className="py-16" />
}

export default function TestoInvitation({ data }: Props) {
  return (
    <div className="testo-page min-h-screen" style={{ background: TESTO.paper, color: TESTO.ink }}>
      <TestoHero data={data} />
      <TornDivider variant={0} />

      <Suspense fallback={<SectionFallback />}>
        <TestoCalendar />
      </Suspense>
      <TornDivider variant={1} flip />

      <Suspense fallback={<SectionFallback />}>
        <TestoGallery data={data} />
      </Suspense>
      <TornDivider variant={2} color={GREEN} />

      <Suspense fallback={<SectionFallback />}>
        <TestoLocation data={data} />
      </Suspense>
      <TornDivider variant={1} flip color={GREEN} />

      <Suspense fallback={<SectionFallback />}>
        <TestoAccount />
      </Suspense>
      <TornDivider variant={2} />

      <Suspense fallback={<SectionFallback />}>
        <TestoGuestbook />
      </Suspense>
      <TornDivider variant={4} flip />

      <Suspense fallback={<SectionFallback />}>
        <TestoShare data={data} />
      </Suspense>
      <TornDivider variant={0} color={GREEN} />

      <Suspense fallback={<SectionFallback />}>
        <TestoClosing />
      </Suspense>
    </div>
  )
}
