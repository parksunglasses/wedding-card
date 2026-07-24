import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Account, WeddingData } from '@/types'
import { TESTO, pen } from './TestoKit'

interface Props {
  data: WeddingData
}

export default function TestoAccount({ data }: Props) {
  const [openSide, setOpenSide] = useState<'groom' | 'bride' | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const copyAccount = async (accountNumber: string, key: string) => {
    try {
      await navigator.clipboard.writeText(accountNumber)
      setCopiedKey(key)
      window.setTimeout(() => setCopiedKey(null), 1800)
    } catch (error) {
      console.error('Copy failed', error)
    }
  }

  const sides = [
    { side: 'groom' as const, label: '신랑 측 계좌번호', accounts: data.groomAccounts, filled: true },
    { side: 'bride' as const, label: '신부 측 계좌번호', accounts: data.brideAccounts, filled: false },
  ]

  const renderAccounts = (accounts: Account[], side: 'groom' | 'bride') => (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="overflow-hidden"
    >
      <div className="flex flex-col gap-2 pt-2">
        {accounts.map((account, index) => {
          const key = `${side}-${index}`
          return (
            <div
              key={key}
              className="flex items-center justify-between gap-2.5 px-[15px] py-3.5 text-left"
              style={{ background: 'rgba(244,236,217,.1)', border: '1px solid rgba(244,236,217,.35)', borderRadius: 12 }}
            >
              <div className="min-w-0" style={{ fontFamily: 'Gaegu, sans-serif' }}>
                <div className="text-[12px] opacity-75">{account.holder}</div>
                <div className="mt-0.5 text-[15px] font-bold">
                  {account.bank} {account.accountNumber}
                </div>
              </div>
              <button
                type="button"
                onClick={() => copyAccount(account.accountNumber, key)}
                className="flex-none rounded-full px-3.5 py-1.5 text-[12px] font-bold"
                style={{ background: TESTO.paper, color: TESTO.red }}
              >
                {copiedKey === key ? '복사됨!' : '복사'}
              </button>
            </div>
          )
        })}
      </div>
    </motion.div>
  )

  return (
    <section className="testo-paper-red px-10 pb-[54px] pt-12 text-center" style={{ color: TESTO.paper }}>
      <h2 className="m-0" style={pen(44)}>마음 전하실 곳</h2>
      <p className="mb-6 mt-1 text-[14px] opacity-85" style={{ fontFamily: 'Gaegu, sans-serif' }}>
        참석이 어려우신 분들을 위해
      </p>

      <div className="mx-auto flex max-w-[360px] flex-col gap-2.5">
        {sides.map(({ side, label, accounts, filled }) => {
          const isOpen = openSide === side
          return (
            <div key={side}>
              <button
                type="button"
                onClick={() => setOpenSide(isOpen ? null : side)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between px-5 pb-[11px] pt-[9px]"
                style={{
                  ...pen(26),
                  borderRadius: 12,
                  background: filled ? TESTO.paper : 'transparent',
                  color: filled ? TESTO.red : TESTO.paper,
                  border: filled ? 'none' : `2px solid ${TESTO.paper}`,
                }}
              >
                <span>{label}</span>
                <span className="text-[15px]" style={{ fontFamily: 'var(--theme-font-body)' }}>
                  {isOpen ? '▲' : '▼'}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && renderAccounts(accounts, side)}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {data.flowerLink && (
        <a
          href={data.flowerLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-auto mt-6 flex max-w-[360px] items-center justify-between px-5 py-4 text-left"
          style={{ border: '2px solid rgba(244,236,217,.4)', borderRadius: 12, fontFamily: 'Gaegu, sans-serif' }}
        >
          <span>
            <span className="block text-[14px] font-bold">축하 화환 보내기</span>
            <span className="mt-0.5 block text-[12px] opacity-75">
              축하의 마음을 꽃으로 전해보세요
            </span>
          </span>
          <span>›</span>
        </a>
      )}
    </section>
  )
}
