import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { WeddingData } from '@/types'
import { isKakaoConfigured, loadKakaoMaps } from '@/lib/kakao'
import { DOODLE, Garland, Squiggle, pen } from './DoodleKit'

interface Props {
  data: WeddingData
}

export default function DoodleLocation({ data }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  // 지도 SDK가 뜨지 않는 도메인에서도 빈 칸 대신 안내가 보이도록 한다.
  const [mapReady, setMapReady] = useState(false)

  const kakaoMapUrl = `https://map.kakao.com/link/map/${encodeURIComponent(data.venue)},${data.lat},${data.lng}`
  const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(data.venue)}`
  const tmapUrl = `tmap://route?goalname=${encodeURIComponent(data.venue)}&goalx=${data.lng}&goaly=${data.lat}`

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

  const mapLinks = [
    { label: '카카오맵', href: kakaoMapUrl },
    { label: '네이버지도', href: naverMapUrl },
    { label: '티맵', href: tmapUrl },
  ]

  return (
    <section
      id="location"
      className="px-9 pb-14 pt-10 text-center"
      style={{ background: DOODLE.green, color: DOODLE.cream }}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7 }}
      >
        <Garland
          className="mx-auto mb-2 block h-[56px] w-full max-w-[380px]"
          lineColor={DOODLE.greenSoft}
          bulbColors={[DOODLE.gold, DOODLE.cream, DOODLE.gold, DOODLE.gold, DOODLE.cream, DOODLE.gold]}
        />

        <h2 className="m-0" style={pen(38)}>어디서 하냐면요</h2>
        <Squiggle width={90} color={DOODLE.cream} className="mx-auto mb-4 mt-1" />

        <p className="m-0 text-[18px] font-bold">{data.venue}</p>
        <p className="mt-1.5 text-[13px] leading-[1.7] opacity-85">
          {data.address}
          <br />
          <a href={`tel:${data.venuePhone}`} style={{ color: '#A8D5B8' }}>
            {data.venuePhone}
          </a>
        </p>

        <a
          href={kakaoMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${data.venue} 카카오맵에서 보기`}
          className="mx-auto mt-5 block w-[min(330px,100%)] px-2.5 pb-3 pt-2.5"
          style={{
            background: DOODLE.cream,
            transform: 'rotate(-1.5deg)',
            boxShadow: '0 12px 28px rgba(0,0,0,.3)',
          }}
        >
          <div className="relative h-[200px] w-full" style={{ background: '#E9E2D4' }}>
            <div ref={mapRef} className="h-full w-full" />
            {!mapReady && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-1"
                style={{
                  color: DOODLE.red,
                  backgroundImage: `linear-gradient(${DOODLE.tan}55 1px, transparent 1px), linear-gradient(90deg, ${DOODLE.tan}55 1px, transparent 1px)`,
                  backgroundSize: '26px 26px',
                }}
              >
                <span className="text-[26px]">📍</span>
                <span style={pen(24)}>{data.venue}</span>
                <span className="text-[12px]" style={{ color: DOODLE.inkSoft }}>
                  눌러서 지도 열기
                </span>
              </div>
            )}
          </div>
        </a>

        <div className="mt-6 flex justify-center gap-2.5">
          {mapLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="rounded-[10px] px-4 py-2.5 text-[13px] font-bold"
              style={{ background: DOODLE.cream, color: DOODLE.green }}
            >
              {label}
            </a>
          ))}
        </div>

        <div className="mx-auto mt-8 flex max-w-[340px] flex-col gap-3.5 text-left text-[13px] leading-[1.7]">
          {routes.map(({ label, value }) => (
            <div key={label} className="flex gap-2.5">
              <span
                className="h-fit flex-none rounded-md px-2 py-0.5 text-[11px] font-bold"
                style={{ background: DOODLE.cream, color: DOODLE.green }}
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
