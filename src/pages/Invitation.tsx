import { useEffect, useState } from 'react'
import { WeddingData } from '@/types'
import { loadWeddingDataAsync } from '@/data/wedding'
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

export default function Invitation() {
  const [data, setData] = useState<WeddingData | null>(null)

  useEffect(() => {
    loadWeddingDataAsync().then(setData)
  }, [])

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center theme-bg">
        <p className="font-heading text-2xl theme-accent italic">Loading...</p>
      </div>
    )
  }

  const theme = getTheme(data.theme)

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen theme-bg">
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
