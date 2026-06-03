import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { WeddingData } from '@/types'
import { Theme } from '@/themes'
import { loadKakaoMaps, isKakaoConfigured } from '@/lib/kakao'

interface Props {
  data: WeddingData
  theme: Theme
}

export default function Location({ data, theme }: Props) {
  const kakaoMapUrl = `https://map.kakao.com/link/map/${encodeURIComponent(data.venue)},${data.lat},${data.lng}`
  const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(data.address)}`
  const tmapUrl = `tmap://route?goalname=${encodeURIComponent(data.venue)}&goalx=${data.lng}&goaly=${data.lat}`

  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isKakaoConfigured || !mapRef.current) return
    let cancelled = false

    loadKakaoMaps()
      .then((kakao) => {
        if (cancelled || !mapRef.current) return
        const center = new kakao.maps.LatLng(data.lat, data.lng)
        const map = new kakao.maps.Map(mapRef.current, { center, level: 3 })
        new kakao.maps.Marker({ position: center, map })
        map.setZoomable(false) // 스크롤 중 지도 확대 방지
      })
      .catch(() => {
        /* 키 미설정/로드 실패 시 아래 fallback 표시 */
      })

    return () => {
      cancelled = true
    }
  }, [data.lat, data.lng])

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

      <a
        href={kakaoMapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-video rounded-lg overflow-hidden mb-6"
        style={{ background: theme.colors.bg + '1A' }}
      >
        {/* 실제 카카오맵 (키 설정 시) */}
        <div ref={mapRef} className="w-full h-full" />

        {/* 키 미설정 시 안내 fallback */}
        {!isKakaoConfigured && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/90 theme-text px-4 py-2 rounded-lg text-xs text-center">
              지도 표시를 위해<br />카카오 JavaScript 키가 필요합니다
            </div>
          </div>
        )}
      </a>

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
