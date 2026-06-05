import { lazy, Suspense, useEffect, useState } from 'react'
import { WeddingData } from '@/types'
import { loadWeddingData, loadWeddingDataAsync } from '@/data/wedding'
import ThemeProvider from '@/themes/ThemeProvider'
import { getTheme, themes, ThemeId } from '@/themes'

import Intro from '@/components/sections/Intro'
import FloatingControls from '@/components/FloatingControls'
import DoorIntro from '@/components/DoorIntro'

const Greeting    = lazy(() => import('@/components/sections/Greeting'))
const Calendar    = lazy(() => import('@/components/sections/Calendar'))
const Gallery     = lazy(() => import('@/components/sections/Gallery'))
const Location    = lazy(() => import('@/components/sections/Location'))
const Transport   = lazy(() => import('@/components/sections/Transport'))
const Account     = lazy(() => import('@/components/sections/Account'))
const Flower      = lazy(() => import('@/components/sections/Flower'))
const Guestbook   = lazy(() => import('@/components/sections/Guestbook'))
const RSVP        = lazy(() => import('@/components/sections/RSVP'))
const Share       = lazy(() => import('@/components/sections/Share'))
const GuestUpload = lazy(() => import('@/components/sections/GuestUpload'))
const FireworksOverlay = lazy(() => import('@/components/FireworksOverlay'))

function SectionFallback() {
  return <div className="py-16" />
}

export default function Invitation() {
  const [data, setData] = useState<WeddingData>(() => loadWeddingData())
  const [dbLoaded, setDbLoaded] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('to') === 'map') {
      const d = loadWeddingData()
      const url = `https://map.kakao.com/link/map/${encodeURIComponent(d.venue)},${d.lat},${d.lng}`
      window.location.replace(url)
    }
  }, [])

  useEffect(() => {
    loadWeddingDataAsync().then((d) => {
      setData(d)
      setDbLoaded(true)
    })
  }, [])

  const themeOverride = new URLSearchParams(window.location.search).get('theme')
  const effectiveTheme: ThemeId =
    themeOverride && themeOverride in themes ? (themeOverride as ThemeId) : data.theme
  const theme = getTheme(effectiveTheme)

  return (
    <ThemeProvider theme={theme}>
      {/* DB 갱신 중 상단 얇은 로딩 바 */}
      {!dbLoaded && (
        <div className="fixed top-0 left-0 right-0 z-50 h-0.5 overflow-hidden">
          <div
            className="h-full animate-pulse"
            style={{ background: theme.colors.accent, width: '60%', transition: 'width 2s ease' }}
          />
        </div>
      )}

      <div className="min-h-screen theme-bg">
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
        <Suspense fallback={<SectionFallback />}>
          <Guestbook theme={theme} />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <RSVP theme={theme} />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <GuestUpload theme={theme} />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Share data={data} theme={theme} />
        </Suspense>
      </div>
    </ThemeProvider>
  )
}
