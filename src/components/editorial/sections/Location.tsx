import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { WeddingData } from '@/types'
import { Theme } from '@/themes'
import { isKakaoConfigured, loadKakaoMaps } from '@/lib/kakao'
import SectionHeading from '@/components/ui/SectionHeading'
import { MapPinIcon, PhoneIcon } from '@/components/ui/Icons'

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
        map.setZoomable(false)
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [data.lat, data.lng])

  return (
    <section id="location" className="invitation-section theme-bg" style={{ color: theme.colors.text }}>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.75 }}
      >
        <SectionHeading label="Location" title="오시는 길" />

        <div className="mb-7 flex items-start gap-4">
          <MapPinIcon className="mt-1 h-7 w-7 shrink-0" style={{ color: theme.colors.accent }} />
          <div>
            <p className="text-[17px] font-medium">{data.venue}</p>
            <p className="mt-2 text-[13px] leading-relaxed" style={{ color: theme.colors.textMuted }}>
              {data.address}
            </p>
            <a
              href={`tel:${data.venuePhone}`}
              className="mt-3 inline-flex items-center gap-2 text-[13px]"
              style={{ color: theme.colors.textMuted }}
            >
              <PhoneIcon className="h-4 w-4" />
              {data.venuePhone}
            </a>
          </div>
        </div>

        <a
          href={kakaoMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${data.venue} 카카오맵에서 보기`}
          className="relative block aspect-[16/10] overflow-hidden border"
          style={{ borderColor: theme.colors.border, background: theme.colors.bgAlt }}
        >
          <div ref={mapRef} className="h-full w-full" />
          {!isKakaoConfigured && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-3"
              style={{
                backgroundImage: `linear-gradient(${theme.colors.border}55 1px, transparent 1px), linear-gradient(90deg, ${theme.colors.border}55 1px, transparent 1px)`,
                backgroundSize: '28px 28px',
              }}
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{ background: theme.colors.accent, color: theme.colors.bg }}
              >
                <MapPinIcon className="h-6 w-6" />
              </span>
              <span className="bg-white/90 px-3 py-1 text-[12px]">{data.venue}</span>
            </div>
          )}
        </a>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { label: '카카오맵', href: kakaoMapUrl, mark: 'K' },
            { label: '네이버지도', href: naverMapUrl, mark: 'N' },
            { label: '티맵', href: tmapUrl, mark: 'T' },
          ].map(({ label, href, mark }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="editorial-button min-w-0 px-1 text-[12px]"
            >
              <span className="font-heading text-[15px]" aria-hidden="true">{mark}</span>
              {label}
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
