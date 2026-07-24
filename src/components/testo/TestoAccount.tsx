import { useState } from 'react'
import { Account } from '@/types'
import { TESTO, pen, gaegu, Deco, Ico } from './TestoKit'
import { TESTO_TEXT } from './testoData'

export default function TestoAccount() {
  const [open, setOpen] = useState<'groom' | 'bride' | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const copy = async (num: string, key: string) => {
    try {
      await navigator.clipboard.writeText(num)
      setCopied(key)
      setTimeout(() => setCopied(null), 1800)
    } catch (e) {
      // clipboard 미지원 무시
    }
  }

  const sides: Array<{ side: 'groom' | 'bride'; label: string; accounts: Account[]; bg: string }> = [
    { side: 'groom', label: '신랑 측 계좌번호', accounts: TESTO_TEXT.groom.accounts, bg: TESTO.red },
    { side: 'bride', label: '신부 측 계좌번호', accounts: TESTO_TEXT.bride.accounts, bg: '#234A33' },
  ]

  return (
    <section className="testo-paper account" style={{ color: TESTO.ink }}>
      <Deco tone="paper" items={[{ t: 'bell', x: '432px', y: '113px', s: 30, r: 8 }, { t: 'mitten', x: 9, y: 90, s: 28, r: 6 }]} />
      <h2 style={pen(46, TESTO.red)}>마음 전하실 곳</h2>
      <div className="acc-list" style={{ marginTop: 34 }}>
        {sides.map(({ side, label, accounts, bg }) => {
          const isOpen = open === side
          return (
            <div key={side}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : side)}
                aria-expanded={isOpen}
                className="acc-toggle"
                style={{ fontFamily: 'Gaegu, sans-serif', fontSize: 22, borderRadius: 12, background: bg, color: TESTO.paper, position: 'relative' }}
              >
                <span>{label}</span>
                <span style={{ fontSize: 15, fontFamily: 'sans-serif' }}>{isOpen ? '▲' : '▼'}</span>
                {side === 'groom' && (
                  <svg viewBox="0 0 24 24" width={40} height={40} style={{ position: 'absolute', left: '1px', top: '-30px', transform: 'translate(-50%,-50%) rotate(-8deg)', opacity: 0.72, pointerEvents: 'none' }} aria-hidden="true">
                    <Ico t="tree" />
                  </svg>
                )}
              </button>
              {isOpen && (
                <div className="acc-body">
                  {accounts.map((a, i) => {
                    const key = `${side}-${i}`
                    return (
                      <div key={key} className="acc-item" style={{ background: TESTO.paperAlt, border: `1px solid ${TESTO.tan}`, borderRadius: 12 }}>
                        <div style={{ ...gaegu, minWidth: 0 }}>
                          <div style={{ fontSize: 12, color: TESTO.muted }}>{a.holder}</div>
                          <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>{a.bank} {a.accountNumber}</div>
                        </div>
                        <button type="button" onClick={() => copy(a.accountNumber, key)} className="acc-copy" style={{ background: TESTO.red, color: TESTO.paper }}>
                          {copied === key ? '복사됨!' : '복사'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
