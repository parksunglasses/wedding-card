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
const DoodleInvitation = lazy(() => import('@/components/doodle/DoodleInvitation'))
const EditorialInvitation = lazy(() => import('@/components/editorial/EditorialInvitation'))
const TestoInvitation = lazy(() => import('@/components/testo/TestoInvitation'))

function SectionFallback() {
  return <div className="py-16" />
}

export default function Invitation() {
  const [data, setData] = useState<WeddingData>(() => loadWeddingData())
  const [dbLoaded, setDbLoaded] = useState(false)
  const [previewTheme, setPreviewTheme] = useState<ThemeId | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('to') === 'map') {
      const d = loadWeddingData()
      const url = `https://map.kakao.com/link/map/${encodeURIComponent(d.venue)},${d.lat},${d.lng}`
      window.location.replace(url)
    }
    if (params.get('to') === 'calendar') {
      import('@/lib/share').then(({ addKakaoCalendar }) => {
        loadWeddingDataAsync().then((d) => addKakaoCalendar(d))
      })
    }
  }, [])

  useEffect(() => {
    loadWeddingDataAsync().then((d) => {
      setData(d)
      setDbLoaded(true)
    })
    // 카카오 공유 SDK 미리 로드 (버튼 클릭 시 지연 방지)
    import('@/lib/kakao').then(({ loadKakaoShare }) => loadKakaoShare().catch(() => {}))
  }, [])

  const themeOverride = new URLSearchParams(window.location.search).get('theme')
  const configuredTheme: ThemeId =
    themeOverride && themeOverride in themes ? (themeOverride as ThemeId) : data.theme
  const effectiveTheme = previewTheme ?? configuredTheme
  const theme = getTheme(effectiveTheme)

  return (
    <ThemeProvider theme={theme}>
      <div className="fixed top-3 left-1/2 z-[1000000] flex -translate-x-1/2 rounded-full border border-black/10 bg-white/90 p-1 shadow-lg backdrop-blur">
        <button
          type="button"
          onClick={() => setPreviewTheme('elegant')}
          aria-pressed={effectiveTheme === 'elegant'}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            effectiveTheme === 'elegant' ? 'bg-stone-800 text-white' : 'text-stone-600'
          }`}
        >
          기본 테마
        </button>
        <button
          type="button"
          onClick={() => setPreviewTheme('testo')}
          aria-pressed={effectiveTheme === 'testo'}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            effectiveTheme === 'testo' ? 'bg-red-900 text-white' : 'text-stone-600'
          }`}
        >
          testo 테마
        </button>
      </div>

      {/* DB 갱신 중 상단 얇은 로딩 바 */}
      {!dbLoaded && (
        <div className="fixed top-0 left-0 right-0 z-50 h-0.5 overflow-hidden">
          <div
            className="h-full animate-pulse"
            style={{ background: theme.colors.accent, width: '60%', transition: 'width 2s ease' }}
          />
        </div>
      )}

      {/* 에디토리얼, 레드두들, 테스토는 각각 전용 레이아웃을 쓴다. */}
      {theme.id === 'editorial' ? (
        <Suspense fallback={<SectionFallback />}>
          <EditorialInvitation data={data} theme={theme} />
        </Suspense>
      ) : theme.id === 'doodle' ? (
        <div className="min-h-screen theme-bg">
          {data.doorIntro && <DoorIntro data={data} theme={theme} />}
          <Suspense fallback={null}>
            {data.fireworks !== false && <FireworksOverlay themeName={theme.id} />}
          </Suspense>
          <FloatingControls data={data} theme={theme} />
          <Suspense fallback={<SectionFallback />}>
            <DoodleInvitation data={data} />
          </Suspense>
        </div>
      ) : theme.id === 'testo' ? (
        // 테스토는 히어로 자체의 인라인 진입 애니메이션(riseIn + 스크리블 draw)을 쓰므로
        // 전체 화면 커버(DoorIntro)는 띄우지 않는다.
        <div className="min-h-screen theme-bg">
          <Suspense fallback={null}>
            {data.fireworks !== false && <FireworksOverlay themeName={theme.id} />}
          </Suspense>
          <FloatingControls data={data} theme={theme} />
          <Suspense fallback={<SectionFallback />}>
            <TestoInvitation data={data} />
          </Suspense>
        </div>
      ) : (
      <div className="min-h-screen theme-bg">
        <Suspense fallback={null}>
          {data.fireworks !== false && <FireworksOverlay themeName={theme.id} />}
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
          <Account data={data} theme={theme} />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Flower data={data} theme={theme} />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Guestbook theme={theme} />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Share data={data} theme={theme} />
        </Suspense>
      </div>
      )}
    </ThemeProvider>
  )
}
