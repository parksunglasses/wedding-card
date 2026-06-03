import { useState } from 'react'
import { motion } from 'framer-motion'
import { WeddingData, Account } from '@/types'
import { Theme } from '@/themes'

interface Props {
  data: WeddingData
  theme: Theme
}

export default function AccountSection({ data, theme }: Props) {
  const [openSide, setOpenSide] = useState<'groom' | 'bride' | null>(null)
  const [copiedIdx, setCopiedIdx] = useState<string | null>(null)

  const handleCopy = async (accountNumber: string, key: string) => {
    try {
      await navigator.clipboard.writeText(accountNumber)
      setCopiedIdx(key)
      setTimeout(() => setCopiedIdx(null), 2000)
    } catch (e) {
      console.error('Copy failed', e)
    }
  }

  const renderAccounts = (accounts: Account[], side: 'groom' | 'bride') => (
    <div className="space-y-3 mt-4">
      {accounts.map((acc, idx) => {
        const key = `${side}-${idx}`
        return (
          <div
            key={key}
            className="rounded-lg p-4 text-left"
            style={{
              background: theme.colors.bg + '1A',
              border: `1px solid ${theme.colors.bg}1A`,
            }}
          >
            <p className="text-xs opacity-60 mb-1">{acc.bank}</p>
            <p className="font-mono text-sm mb-2">{acc.accountNumber}</p>
            <div className="flex items-center justify-between">
              <p className="text-xs opacity-60">예금주 · {acc.holder}</p>
              <button
                onClick={() => handleCopy(acc.accountNumber, key)}
                className="text-xs px-3 py-1 rounded-full"
                style={{
                  background: theme.colors.bg + '1A',
                  border: `1px solid ${theme.colors.bg}33`,
                }}
              >
                {copiedIdx === key ? '복사됨' : '복사'}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )

  return (
    <section className="theme-bg-dark py-16 px-8" style={{ color: theme.colors.bg }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-md mx-auto"
      >
        <div className="text-center mb-10">
          <h2 className="font-heading text-2xl">마음 전하실 곳</h2>
        </div>

        <button
          onClick={() => setOpenSide(openSide === 'groom' ? null : 'groom')}
          className="w-full px-5 py-4 rounded-lg flex items-center justify-between mb-3"
          style={{
            background: theme.colors.bg + '1A',
            border: `1px solid ${theme.colors.bg}1A`,
          }}
        >
          <span className="text-sm">신랑 측 계좌번호</span>
          <span className={`transition-transform ${openSide === 'groom' ? 'rotate-180' : ''}`}>▾</span>
        </button>
        {openSide === 'groom' && renderAccounts(data.groomAccounts, 'groom')}

        <button
          onClick={() => setOpenSide(openSide === 'bride' ? null : 'bride')}
          className="w-full px-5 py-4 rounded-lg flex items-center justify-between mt-3"
          style={{
            background: theme.colors.bg + '1A',
            border: `1px solid ${theme.colors.bg}1A`,
          }}
        >
          <span className="text-sm">신부 측 계좌번호</span>
          <span className={`transition-transform ${openSide === 'bride' ? 'rotate-180' : ''}`}>▾</span>
        </button>
        {openSide === 'bride' && renderAccounts(data.brideAccounts, 'bride')}
      </motion.div>
    </section>
  )
}
