import { useState } from 'react'
import { WeddingData } from '@/types'
import { TESTO, pen, gaegu, Deco } from './TestoKit'
import { TESTO_TEXT } from './testoData'

interface Props {
  data: WeddingData
}

export default function TestoLocation({ data }: Props) {
  const [copied, setCopied] = useState(false)
  const kakaoMapUrl = `https://map.kakao.com/link/map/${encodeURIComponent(TESTO_TEXT.venue)},${data.lat},${data.lng}`

  const copyAddr = async () => {
    try {
      await navigator.clipboard.writeText(TESTO_TEXT.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch (e) {
      // ignore
    }
  }

  const routes = [
    { label: '지하철', value: TESTO_TEXT.subway },
    { label: '버스', value: TESTO_TEXT.bus },
    { label: '자가용', value: TESTO_TEXT.parking },
  ].filter((r) => r.value)

  return (
    <section className="testo-paper-green location" style={{ color: TESTO.paper }}>
      <Deco
        tone="green"
        items={[]}
      />
      <h2 style={pen(52)}>오시는 길</h2>
      <p className="loc-venue" style={gaegu}>{TESTO_TEXT.venue}</p>
      <p className="loc-addr" style={{ ...gaegu, cursor: 'pointer' }} onClick={copyAddr} title="클릭하여 주소 복사">
        {TESTO_TEXT.address}
      </p>
      <a href={`tel:${TESTO_TEXT.venuePhone}`} className="loc-tel"><span className="loc-tel-ico">☎</span>{TESTO_TEXT.venuePhone}</a>

      <a
        href={kakaoMapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="loc-map-frame tartan-green"
        style={{ display: 'block', transform: 'rotate(-1.5deg)' }}
      >
        <div
          className="loc-map"
          style={{
            backgroundImage: `linear-gradient(${TESTO.tan}55 1px,transparent 1px),linear-gradient(90deg,${TESTO.tan}55 1px,transparent 1px)`,
            backgroundSize: '26px 26px',
          }}
        >
          <span style={{ fontSize: 26 }}>📍</span>
          <span style={pen(24, TESTO.red)}>{TESTO_TEXT.venue}</span>
          <span style={{ ...gaegu, fontSize: 12, color: TESTO.inkSoft }}>눌러서 지도 열기</span>
        </div>
      </a>



      <div className="loc-routes" style={gaegu}>
        {routes.map((r) => (
          <div key={r.label} className="loc-route">
            <span className="loc-badge" style={{ background: TESTO.paper, color: TESTO.red }}>{r.label}</span>
            <span style={{ whiteSpace: 'pre-line' }}>{r.value}</span>
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
