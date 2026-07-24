import { TESTO, pen, gaegu, Deco, Ico } from './TestoKit'
import { TESTO_TEXT } from './testoData'

export default function TestoClosing() {
  const [y, m, d] = TESTO_TEXT.date.split('-').map(Number)
  const dot = <span style={{ fontSize: '0.5em', verticalAlign: 'middle', margin: '0 .1em' }}>.</span>
  return (
    <section className="testo-paper-green closing" style={{ color: TESTO.paper }}>
      <Deco
        tone="green"
        items={[]}
      />
      <svg viewBox="0 0 24 24" width={60} height={60} className="mx-auto share-tree" aria-hidden="true"><Ico t="santa" /></svg>
      <p style={{ ...pen(44, TESTO.paper), margin: 0 }}>{y}{dot}{m}{dot}{d}에 만나요 !</p>
      <p style={{ ...gaegu, fontSize: 19, color: TESTO.paper, opacity: 0.85, marginTop: 8 }}>{TESTO_TEXT.groom.name} &amp; {TESTO_TEXT.bride.name} 올림</p>
    </section>
  )
}
