import { useState, useEffect, useRef } from 'react'
import { WeddingData } from '@/types'
import { TESTO, pen, gaegu, Deco } from './TestoKit'
import { TESTO_TEXT } from './testoData'
import { loadKakaoMaps, isKakaoConfigured } from '@/lib/kakao'

interface Props {
  data: WeddingData
}

export default function TestoLocation({ data }: Props) {
  const [copied, setCopied] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)

  const venue = data.venue || TESTO_TEXT.venue
  const address = data.address || TESTO_TEXT.address
  const venuePhone = data.venuePhone || TESTO_TEXT.venuePhone
  const lat = data.lat || 37.5665
  const lng = data.lng || 126.9780

  const subway = data.subway || TESTO_TEXT.subway
  const bus = data.bus || TESTO_TEXT.bus
  const parking = data.parking || TESTO_TEXT.parking

  const kakaoMapUrl = `https://map.kakao.com/link/map/${encodeURIComponent(venue)},${lat},${lng}`
  const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(venue)}`
  const tmapUrl = `tmap://route?goalname=${encodeURIComponent(venue)}&goalx=${lng}&goaly=${lat}`

  useEffect(() => {
    if (!isKakaoConfigured || !mapRef.current) return
    let cancelled = false

    loadKakaoMaps()
      .then((kakao) => {
        if (cancelled || !mapRef.current) return
        const center = new kakao.maps.LatLng(lat, lng)
        const map = new kakao.maps.Map(mapRef.current, { center, level: 3 })
        new kakao.maps.Marker({ position: center, map })
        map.setZoomable(false)
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [lat, lng])

  const copyAddr = async () => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch (e) {
      // ignore
    }
  }

  const routes = [
    { label: '지하철', value: subway.replace(/\n/g, ' ') },
    { label: '버스', value: bus },
    { label: '자가용', value: parking },
  ].filter((r) => r.value)

  return (
    <section className="testo-paper-green location" style={{ color: TESTO.paper }}>
      <Deco tone="green" items={[]} />
      <h2 style={pen(52)}>오시는 길</h2>
      <p className="loc-venue" style={gaegu}>{venue}</p>
      <p className="loc-addr" style={{ ...gaegu, cursor: 'pointer' }} onClick={copyAddr} title="클릭하여 주소 복사">
        {address}
      </p>
      {venuePhone && (
        <a href={`tel:${venuePhone}`} className="loc-tel">
          <span className="loc-tel-ico">☎</span>{venuePhone}
        </a>
      )}

      {/* 지도 뷰어 타탄 프레임 */}
      <a
        href={kakaoMapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="loc-map-frame tartan-green"
        style={{ display: 'block', transform: 'rotate(-1deg)', position: 'relative', overflow: 'hidden' }}
      >
        <div
          className="loc-map relative"
          style={{
            minHeight: 180,
            backgroundImage: `linear-gradient(${TESTO.tan}55 1px,transparent 1px),linear-gradient(90deg,${TESTO.tan}55 1px,transparent 1px)`,
            backgroundSize: '26px 26px',
          }}
        >
          {/* 카카오 지도 영역 */}
          <div ref={mapRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-90" />

          {/* 중앙 안내 오버레이 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none whitespace-nowrap text-center">
            <div className="bg-white/95 px-4 py-2 rounded-2xl shadow-md border" style={{ borderColor: TESTO.tan }}>
              <span style={pen(20, TESTO.red)}>{venue}</span>
              <div style={{ ...gaegu, fontSize: 13, color: '#666', marginTop: 1 }}>눌러서 지도 열기</div>
            </div>
          </div>

          {!isKakaoConfigured && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#234A33]/10">
              <div className="bg-[#FAF5ED] px-4 py-2 rounded-xl text-xs text-center shadow-sm text-[#333]">
                카카오 지도 키 연결 준비 중
              </div>
            </div>
          )}
        </div>
      </a>



      <div className="loc-routes" style={gaegu}>
        {routes.map((r) => (
          <div key={r.label} className="loc-route">
            <span className="loc-badge" style={{ background: TESTO.paper, color: TESTO.red, flexShrink: 0 }}>{r.label}</span>
            <span style={{ whiteSpace: r.label === '지하철' ? 'nowrap' : 'pre-line', wordBreak: 'keep-all' }}>{r.value}</span>
          </div>
        ))}
      </div>

      {copied && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#234A33',
          color: '#F4ECD9',
          padding: '10px 22px',
          borderRadius: 999,
          fontFamily: '"Nanum Pen Script", cursive',
          fontSize: 20,
          boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <span>✓ 예식장 주소가 복사되었습니다!</span>
        </div>
      )}
    </section>
  )
}
