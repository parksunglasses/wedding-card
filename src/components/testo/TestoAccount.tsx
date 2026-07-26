import { useState } from 'react'
import { WeddingData, Account } from '@/types'
import { TESTO, pen, gaegu, Deco } from './TestoKit'
import { TESTO_TEXT } from './testoData'
import { copyToClipboard } from '@/lib/clipboard'

interface Props {
  data: WeddingData
}

export default function TestoAccount({ data }: Props) {
  const [open, setOpen] = useState<'groom' | 'bride' | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const copy = async (num: string, key: string) => {
    const success = await copyToClipboard(num)
    if (success) {
      setCopied(key)
      setTimeout(() => setCopied(null), 1800)
    }
  }

  const groomAccounts: Account[] =
    data.groomAccounts && data.groomAccounts.length > 0 ? data.groomAccounts : TESTO_TEXT.groom.accounts
  const brideAccounts: Account[] =
    data.brideAccounts && data.brideAccounts.length > 0 ? data.brideAccounts : TESTO_TEXT.bride.accounts

  const sides: Array<{ side: 'groom' | 'bride'; label: string; accounts: Account[]; bg: string }> = [
    { side: 'groom', label: '신랑 측 계좌번호', accounts: groomAccounts, bg: TESTO.red },
    { side: 'bride', label: '신부 측 계좌번호', accounts: brideAccounts, bg: '#234A33' },
  ]

  return (
    <section className="testo-paper account" style={{ color: TESTO.ink }}>
      <Deco tone="paper" items={[]} />
      <h2 style={pen(52, TESTO.red)}>마음 전하실 곳</h2>
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
              </button>
              {isOpen && (
                <div className="acc-body">
                  {accounts.map((a, i) => {
                    const key = `${side}-${i}`
                    return (
                      <div key={key} className="acc-item" style={{ background: TESTO.paperAlt, border: `1px solid ${TESTO.tan}`, borderRadius: 12 }}>
                        <div style={{ ...gaegu, minWidth: 0 }}>
                          <div style={{ fontSize: 13, color: TESTO.muted }}>예금주 · {a.holder}</div>
                          <div style={{ fontSize: 16, fontWeight: 700, marginTop: 2 }}>{a.bank} {a.accountNumber}</div>
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
      {copied && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#7A1420',
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
          <span>✓ 계좌번호가 복사되었습니다!</span>
        </div>
      )}
    </section>
  )
}
