import { WeddingData } from '@/types'
import { TESTO, pen, gaegu, Deco } from './TestoKit'
import { TESTO_TEXT } from './testoData'

interface Props {
  data: WeddingData
}

export default function TestoLocation({ data }: Props) {
  const kakaoMapUrl = `https://map.kakao.com/link/map/${encodeURIComponent(TESTO_TEXT.venue)},${data.lat},${data.lng}`
  const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(TESTO_TEXT.venue)}`

  const routes = [
    { label: '지하철', value: TESTO_TEXT.subway },
    { label: '버스', value: TESTO_TEXT.bus },
    { label: '자가용', value: TESTO_TEXT.parking },
  ].filter((r) => r.value)

  return (
    <section className="testo-paper-green location" style={{ color: TESTO.paper }}>
      <Deco
        tone="green"
        items={[
          { t: 'sock', x: 8, y: 12, s: 32, r: 8 },
          { t: 'snow', x: 91, y: 20, s: 36, r: 0 },
          { t: 'star', x: 92, y: 72, s: 26, r: 0 },
          { t: 'flake', x: '41px', y: '419px', s: 28, r: 0 },
        ]}
      />
      <h2 style={pen(52)}>오시는 길</h2>
      <p className="loc-venue" style={gaegu}>{TESTO_TEXT.venue}</p>
      <p className="loc-addr" style={gaegu}>{TESTO_TEXT.address}</p>
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

      <div className="loc-btns">
        <a href={kakaoMapUrl} target="_blank" rel="noopener noreferrer" className="loc-mapbtn" style={{ ...pen(22), background: TESTO.paper, color: TESTO.red, borderRadius: 999 }}>카카오맵</a>
        <a href={naverMapUrl} target="_blank" rel="noopener noreferrer" className="loc-mapbtn" style={{ ...pen(22), background: TESTO.paper, color: TESTO.red, borderRadius: 999 }}>네이버지도</a>
      </div>

      <div className="loc-routes" style={gaegu}>
        {routes.map((r) => (
          <div key={r.label} className="loc-route">
            <span className="loc-badge" style={{ background: TESTO.paper, color: TESTO.red }}>{r.label}</span>
            <span style={{ whiteSpace: 'pre-line' }}>{r.value}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
