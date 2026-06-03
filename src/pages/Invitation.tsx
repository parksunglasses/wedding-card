import { useEffect, useState } from 'react'
import { WeddingData } from '@/types'
import { loadWeddingData, loadWeddingDataAsync } from '@/data/wedding'
import ThemeProvider from '@/themes/ThemeProvider'
import { getTheme } from '@/themes'

import Intro from '@/components/sections/Intro'
import Greeting from '@/components/sections/Greeting'
import Calendar from '@/components/sections/Calendar'
import Gallery from '@/components/sections/Gallery'
import Location from '@/components/sections/Location'
import Transport from '@/components/sections/Transport'
import Account from '@/components/sections/Account'
import Flower from '@/components/sections/Flower'
import Guestbook from '@/components/sections/Guestbook'
import RSVP from '@/components/sections/RSVP'
import Share from '@/components/sections/Share'
import FloatingControls from '@/components/FloatingControls'

export default function Invitation() {
  // 캐시(localStorage)/기본값으로 즉시 렌더 → Supabase로 백그라운드 갱신
  const [data, setData] = useState<WeddingData>(() => loadWeddingData())

  // 공유 카드의 "위치 보기"(?to=map) → 카카오맵으로 즉시 연결
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('to') === 'map') {
      const d = loadWeddingData()
      const url = `https://map.kakao.com/link/map/${encodeURIComponent(d.venue)},${d.lat},${d.lng}`
      window.location.replace(url)
    }
  }, [])

  useEffect(() => {
    loadWeddingDataAsync().then(setData)
  }, [])

  const theme = getTheme(data.theme)

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen theme-bg">
        <FloatingControls data={data} theme={theme} />
        <Intro data={data} theme={theme} />
        <Greeting data={data} theme={theme} />
        <Calendar data={data} theme={theme} />
        <Gallery data={data} theme={theme} />
        <Location data={data} theme={theme} />
        <Transport data={data} theme={theme} />
        <Account data={data} theme={theme} />
        <Flower data={data} theme={theme} />
        <Guestbook theme={theme} />
        <RSVP theme={theme} />
        <Share data={data} theme={theme} />
      </div>
    </ThemeProvider>
  )
}
