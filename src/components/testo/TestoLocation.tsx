import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { WeddingData } from '@/types'
import { isKakaoConfigured, loadKakaoMaps } from '@/lib/kakao'
import { TESTO, pen } from './TestoKit'

interface Props {
  data: WeddingData
}

export default function TestoLocation({ data }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapReady, setMapReady] = useState(false)

  const kakaoMapUrl = `https://map.kakao.com/link/map/${encodeURIComponent(data.venue)},${data.lat},${data.lng}`
  const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(data.venue)}`

  useEffect(() => {
    if (!isKakaoConfigured || !mapRef.current) return
    let cancelled = false

    loadKakaoMaps()
      .then((kakao) => {
        if (cancelled || !mapRef.current) return
        const center = new kakao.maps.LatLng(data.lat, data.lng)
        const map = new kakao.maps.Map(mapRef.current, { center, level: 3 })
        new kakao.maps.Marker({ position: center, map })
        map.setZoomable(false)
        setMapReady(true)
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [data.lat, data.lng])

  const routes = [
    { label: '지하철', value: data.subway },
    { label: '버스', value: data.bus.replace(/[[\]]/g, '') },
    { label: '주차', value: data.parking },
  ]

  return (
    <section id="location" className="testo-paper-red px-9 pb-[54px] pt-[46px] text-center" style={{ color: TESTO.paper }}>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="m-0" style={pen(44)}>어디서 하냐면</h2>
        <svg viewBox="0 0 130 10" width={130} height={10} className="mx-auto mb-5 mt-1.5 block" aria-hidden="true">
          <path d="M3 6 Q 20 1 38 6 T 74 6 T 110 6 T 127 5" fill="none" stroke={TESTO.paper} strokeWidth={2} strokeLinecap="round" />
        </svg>

        <p className="m-0 text-[19px] font-bold" style={{ fontFamily: 'Gaegu, sans-serif' }}>{data.venue}</p>
        <p className="mt-1.5 text-[14px] opacity-85" style={{ fontFamily: 'Gaegu, sans-serif' }}>
          {data.address}
        </p>
        <a href={`tel:${data.venuePhone}`} className="mt-1 inline-block text-[13px]" style={{ color: '#E9D9C2' }}>
          {data.venuePhone}
        </a>

        <div
          className="mx-auto mt-[22px] w-[300px] px-2.5 pb-[26px] pt-2.5"
          style={{ background: TESTO.paper, transform: 'rotate(-1.5deg)', boxShadow: '0 12px 26px rgba(0,0,0,.3)' }}
        >
          <div className="relative h-[200px] w-full" style={{ background: '#E9E2D4' }}>
            <div ref={mapRef} className="h-full w-full" />
            {!mapReady && (
              <a
                href={kakaoMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${data.venue} 카카오맵에서 보기`}
                className="absolute inset-0 flex flex-col items-center justify-center gap-1"
                style={{
                  color: TESTO.red,
                  backgroundImage: `linear-gradient(${TESTO.tan}55 1px, transparent 1px), linear-gradient(90deg, ${TESTO.tan}55 1px, transparent 1px)`,
                  backgroundSize: '26px 26px',
                }}
              >
                <span className="text-[26px]">📍</span>
                <span style={pen(24)}>{data.venue}</span>
                <span className="text-[12px]" style={{ fontFamily: 'Gaegu, sans-serif', color: TESTO.inkSoft }}>
                  눌러서 지도 열기
                </span>
              </a>
            )}
          </div>
        </div>

        <div className="mt-[22px] flex justify-center gap-2">
          <a href={kakaoMapUrl} target="_blank" rel="noopener noreferrer" className="px-5 py-1.5" style={{ ...pen(22), background: TESTO.paper, color: TESTO.red, textDecoration: 'none' }}>
            카카오맵
          </a>
          <a href={naverMapUrl} target="_blank" rel="noopener noreferrer" className="px-5 py-1.5" style={{ ...pen(22), background: TESTO.paper, color: TESTO.red, textDecoration: 'none' }}>
            네이버지도
          </a>
        </div>

        <div className="mx-auto mt-7 flex max-w-[360px] flex-col gap-3.5 text-left text-[14px] leading-[1.7]" style={{ fontFamily: 'Gaegu, sans-serif' }}>
          {routes.map(({ label, value }) => (
            <div key={label} className="flex gap-2.5">
              <span
                className="h-fit flex-none rounded-md px-2.5 py-0.5 text-[12px] font-bold"
                style={{ background: TESTO.paper, color: TESTO.red }}
              >
                {label}
              </span>
              <span className="whitespace-pre-line">{value}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
