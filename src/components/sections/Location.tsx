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
  const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(data.venue)}`
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
    <section id="location" className="py-9 px-6" style={{ background: '#FAF5ED', color: theme.colors.text }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-5"
      >
        <p className="font-heading text-xs tracking-[0.4em] mb-2 uppercase" style={{ color: theme.colors.accent }}>
          Location
        </p>
        <h2 className="font-heading text-2xl mb-5">오시는 길</h2>

        <div className="space-y-1.5">
          <p className="text-sm font-medium opacity-85">{data.address}</p>
          <p className="text-base font-bold tracking-wide">{data.venue}</p>
        </div>

        <a
          href={`tel:${data.venuePhone}`}
          className="inline-flex items-center gap-1.5 mt-3 px-4 py-1.5 rounded-full text-xs"
          style={{ background: theme.colors.accent + '0D', border: `1px solid ${theme.colors.border}` }}
        >
          📞 {data.venuePhone}
        </a>
      </motion.div>

      <a
        href={kakaoMapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block h-44 sm:h-52 rounded-xl overflow-hidden mb-4 group"
        style={{ background: theme.colors.accent + '0D' }}
      >
        {/* 실제 카카오맵 (키 설정 시) */}
        <div ref={mapRef} className="w-full h-full pointer-events-none" />

        {/* 지도 정중앙 오버레이 핀 뱃지 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none whitespace-nowrap">
          <div
            className="px-4 py-2 rounded-2xl text-xs font-semibold shadow-md flex flex-col items-center justify-center gap-0.5 border transition-transform group-hover:scale-105"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              color: theme.colors.text,
              borderColor: theme.colors.accent + '40',
              backdropFilter: 'blur(4px)',
            }}
          >
            <span className="font-semibold text-xs" style={{ color: theme.colors.accent }}>{data.venue}</span>
            <span className="text-[10px] opacity-65 font-normal">눌러서 지도 열기</span>
          </div>
        </div>

        {/* 키 미설정 시 안내 fallback */}
        {!isKakaoConfigured && (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-100/70">
            <div className="bg-white/95 px-4 py-2.5 rounded-xl text-xs text-center shadow-sm">
              지도 표시를 위해<br />카카오 JavaScript 키가 필요합니다
            </div>
          </div>
        )}
      </a>

      {/* 카카오맵 / 네이버지도 / 티맵 세로 컴팩트 버튼 */}
      <div className="grid grid-cols-3 gap-2.5 max-w-md mx-auto mb-4">
        <a href={kakaoMapUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-[11px] font-medium"
          style={{ background: theme.colors.accent + '0D', border: `1px solid ${theme.colors.border}` }}>
          <div className="w-5 h-5 rounded bg-yellow-400 flex items-center justify-center text-black font-bold text-[10px]">K</div>
          카카오맵
        </a>
        <a href={naverMapUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-[11px] font-medium"
          style={{ background: theme.colors.accent + '0D', border: `1px solid ${theme.colors.border}` }}>
          <div className="w-5 h-5 rounded bg-green-500 flex items-center justify-center text-white font-bold text-[10px]">N</div>
          네이버지도
        </a>
        <a href={tmapUrl}
          className="flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-[11px] font-medium"
          style={{ background: theme.colors.accent + '0D', border: `1px solid ${theme.colors.border}` }}>
          <div className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center text-white font-bold text-[10px]">T</div>
          티맵
        </a>
      </div>

      <div className="max-w-md mx-auto space-y-2.5 text-left text-xs" style={{ color: theme.colors.text }}>
        {data.subway && (
          <div className="p-3.5 rounded-xl" style={{ background: theme.colors.bgAlt, border: `1px solid ${theme.colors.border}` }}>
            <span className="font-semibold block mb-0.5 text-[13px]" style={{ color: theme.colors.accent }}>지하철</span>
            <p className="opacity-90 leading-relaxed text-[12px]">{data.subway}</p>
          </div>
        )}
        {data.bus && (
          <div className="p-3.5 rounded-xl" style={{ background: theme.colors.bgAlt, border: `1px solid ${theme.colors.border}` }}>
            <span className="font-semibold block mb-0.5 text-[13px]" style={{ color: theme.colors.accent }}>버스</span>
            <p className="opacity-90 leading-relaxed whitespace-pre-line text-[12px]">{data.bus}</p>
          </div>
        )}
        {data.parking && (
          <div className="p-3.5 rounded-xl" style={{ background: theme.colors.bgAlt, border: `1px solid ${theme.colors.border}` }}>
            <span className="font-semibold block mb-0.5 text-[13px]" style={{ color: theme.colors.accent }}>자가용</span>
            <p className="opacity-90 leading-relaxed text-[12px]">{data.parking}</p>
          </div>
        )}
      </div>
    </section>
  )
}
