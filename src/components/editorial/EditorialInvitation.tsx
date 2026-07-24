import { lazy, Suspense } from 'react'
import { WeddingData } from '@/types'
import { Theme } from '@/themes'
import DoorIntro from '@/components/editorial/DoorIntro'
import FloatingControls from '@/components/editorial/FloatingControls'
import Intro from '@/components/editorial/sections/Intro'

const Greeting = lazy(() => import('@/components/editorial/sections/Greeting'))
const Calendar = lazy(() => import('@/components/editorial/sections/Calendar'))
const Gallery = lazy(() => import('@/components/editorial/sections/Gallery'))
const Location = lazy(() => import('@/components/editorial/sections/Location'))
const Transport = lazy(() => import('@/components/editorial/sections/Transport'))
const Account = lazy(() => import('@/components/editorial/sections/Account'))
const Flower = lazy(() => import('@/components/editorial/sections/Flower'))
const Guestbook = lazy(() => import('@/components/editorial/sections/Guestbook'))
const RSVP = lazy(() => import('@/components/editorial/sections/RSVP'))
const GuestUpload = lazy(() => import('@/components/editorial/sections/GuestUpload'))
const Share = lazy(() => import('@/components/editorial/sections/Share'))
const FireworksOverlay = lazy(() => import('@/components/FireworksOverlay'))

interface Props {
  data: WeddingData
  theme: Theme
}

function SectionFallback() {
  return <div className="py-16" />
}

export default function EditorialInvitation({ data, theme }: Props) {
  return (
    <div className="editorial-invitation min-h-screen theme-bg">
      {data.doorIntro && <DoorIntro data={data} theme={theme} />}
      <Suspense fallback={null}>
        {data.fireworks !== false && <FireworksOverlay />}
      </Suspense>
      <FloatingControls data={data} theme={theme} />
      <Intro data={data} theme={theme} />
      <Suspense fallback={<SectionFallback />}>
        <Greeting data={data} theme={theme} />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Calendar data={data} theme={theme} />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Gallery data={data} theme={theme} />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Location data={data} theme={theme} />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Transport data={data} theme={theme} />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Account data={data} theme={theme} />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Flower data={data} theme={theme} />
      </Suspense>
      <section className="invitation-section theme-bg">
        <div className="grid grid-cols-2 gap-4">
          <Suspense fallback={<SectionFallback />}>
            <Guestbook theme={theme} />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <RSVP theme={theme} />
          </Suspense>
        </div>
      </section>
      <Suspense fallback={<SectionFallback />}>
        <GuestUpload theme={theme} />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Share data={data} theme={theme} />
      </Suspense>
    </div>
  )
}
