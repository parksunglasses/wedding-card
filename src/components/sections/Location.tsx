import { motion } from 'framer-motion'
import { WeddingData } from '@/types'
import { Theme } from '@/themes'

interface Props {
  data: WeddingData
  theme: Theme
}

export default function Location({ data, theme }: Props) {
  const kakaoMapUrl = `https://map.kakao.com/link/map/${encodeURIComponent(data.venue)},${data.lat},${data.lng}`
  const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(data.address)}`
  const tmapUrl = `tmap://route?goalname=${encodeURIComponent(data.venue)}&goalx=${data.lng}&goaly=${data.lat}`

  return (
    <section className="theme-bg-dark py-16 px-8" style={{ color: theme.colors.bg }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-10"
      >
        <p className="font-heading text-xs tracking-[0.4em] mb-3 uppercase" style={{ color: theme.colors.accentLight }}>
          Location
        </p>
        <h2 className="font-heading text-3xl mb-4">오시는 길</h2>

        <div className="space-y-2">
          <p className="text-sm opacity-80">{data.address}</p>
          <p className="text-base font-semibold">{data.venue}</p>
        </div>

        <a
          href={`tel:${data.venuePhone}`}
          className="inline-flex items-center gap-2 mt-6 px-5 py-2 rounded-full text-sm"
          style={{ background: theme.colors.bg + '1A', border: `1px solid ${theme.colors.bg}33` }}
        >
          📞 {data.venuePhone}
        </a>
      </motion.div>

      <div className="relative aspect-video rounded-lg overflow-hidden mb-6" style={{ background: theme.colors.bg + '1A' }}>
        <iframe
          src={`https://map.kakao.com/?map_type=TYPE_MAP&q=${encodeURIComponent(data.address)}`}
          className="w-full h-full"
          title="map"
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white/90 theme-text px-4 py-2 rounded-lg text-xs">
            카카오맵 SDK 연동 필요
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
        <a href={kakaoMapUrl} target="_blank" rel="noopener noreferrer"
          className="flex flex-col items-center gap-2 py-3 rounded-lg text-xs"
          style={{ background: theme.colors.bg + '1A', border: `1px solid ${theme.colors.bg}33` }}>
          <div className="w-8 h-8 rounded bg-yellow-400 flex items-center justify-center text-black">K</div>
          카카오맵
        </a>
        <a href={naverMapUrl} target="_blank" rel="noopener noreferrer"
          className="flex flex-col items-center gap-2 py-3 rounded-lg text-xs"
          style={{ background: theme.colors.bg + '1A', border: `1px solid ${theme.colors.bg}33` }}>
          <div className="w-8 h-8 rounded bg-green-500 flex items-center justify-center text-white">N</div>
          네이버지도
        </a>
        <a href={tmapUrl}
          className="flex flex-col items-center gap-2 py-3 rounded-lg text-xs"
          style={{ background: theme.colors.bg + '1A', border: `1px solid ${theme.colors.bg}33` }}>
          <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center text-white">T</div>
          티맵
        </a>
      </div>
    </section>
  )
}
