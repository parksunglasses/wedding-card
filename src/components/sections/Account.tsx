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
    <div className="space-y-3 mt-3 mb-4">
      {accounts.map((acc, idx) => {
        const key = `${side}-${idx}`
        const isPink = idx % 2 === 0
        return (
          <div
            key={key}
            className="rounded-2xl p-4 text-center transition-colors shadow-xs"
            style={{
              background: isPink ? '#FDF6F8' : '#FBF8F2',
              border: `1px solid ${isPink ? '#F8E8EC' : '#EFE8DE'}`,
            }}
          >
            <p className="text-xs opacity-60 mb-1">{acc.bank}</p>
            <p className="font-mono text-sm font-semibold mb-2 tracking-wide">{acc.accountNumber}</p>
            <div className="flex items-center justify-center gap-3">
              <p className="text-xs opacity-70">예금주 · {acc.holder}</p>
              <button
                onClick={() => handleCopy(acc.accountNumber, key)}
                className="text-xs px-3 py-1 rounded-full font-medium transition-all active:scale-95"
                style={{
                  background: isPink ? theme.colors.accent + '20' : '#EBE0D2',
                  border: `1px solid ${theme.colors.border}`,
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
    <section className="py-12 px-8" style={{ background: '#FCFBF7', color: theme.colors.text }}>
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

        {/* 신랑 측 버튼: 열렸을 때 진한 핑크색으로 변화 */}
        <button
          onClick={() => setOpenSide(openSide === 'groom' ? null : 'groom')}
          className="w-full px-5 py-4 rounded-2xl flex items-center justify-center gap-2 mb-2 transition-all duration-300 shadow-sm"
          style={{
            background: openSide === 'groom' ? theme.colors.accent : theme.colors.accent + '12',
            color: openSide === 'groom' ? '#FFFFFF' : theme.colors.text,
            border: `1px solid ${openSide === 'groom' ? theme.colors.accent : theme.colors.border}`,
          }}
        >
          <span className="text-sm font-semibold">신랑 측 계좌번호</span>
          <span className={`text-xs transition-transform duration-300 ${openSide === 'groom' ? 'rotate-180' : ''}`}>▾</span>
        </button>
        {openSide === 'groom' && renderAccounts(data.groomAccounts, 'groom')}

        {/* 신부 측 버튼: 열렸을 때 진한 핑크색으로 변화 */}
        <button
          onClick={() => setOpenSide(openSide === 'bride' ? null : 'bride')}
          className="w-full px-5 py-4 rounded-2xl flex items-center justify-center gap-2 mt-3 mb-2 transition-all duration-300 shadow-sm"
          style={{
            background: openSide === 'bride' ? theme.colors.accent : theme.colors.accent + '12',
            color: openSide === 'bride' ? '#FFFFFF' : theme.colors.text,
            border: `1px solid ${openSide === 'bride' ? theme.colors.accent : theme.colors.border}`,
          }}
        >
          <span className="text-sm font-semibold">신부 측 계좌번호</span>
          <span className={`text-xs transition-transform duration-300 ${openSide === 'bride' ? 'rotate-180' : ''}`}>▾</span>
        </button>
        {openSide === 'bride' && renderAccounts(data.brideAccounts, 'bride')}
      </motion.div>

      {/* 계좌번호 복사 완료 토스트 알림 */}
      {copiedIdx && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100001] px-5 py-2.5 rounded-full bg-stone-900/90 text-white text-xs font-medium shadow-xl backdrop-blur flex items-center gap-1.5 animate-bounce-once">
          <span>✓ 계좌번호가 복사되었습니다.</span>
        </div>
      )}
    </section>
  )
}
