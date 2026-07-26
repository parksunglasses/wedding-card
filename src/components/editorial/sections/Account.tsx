import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Account, WeddingData } from '@/types'
import { Theme } from '@/themes'
import SectionHeading from '@/components/ui/SectionHeading'
import { BankIcon, ChevronDownIcon } from '@/components/ui/Icons'
import { copyToClipboard } from '@/lib/clipboard'

interface Props {
  data: WeddingData
  theme: Theme
}

export default function AccountSection({ data, theme }: Props) {
  const [openSide, setOpenSide] = useState<'groom' | 'bride' | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const copyAccount = async (accountNumber: string, key: string) => {
    const success = await copyToClipboard(accountNumber)
    if (success) {
      setCopiedKey(key)
      window.setTimeout(() => setCopiedKey(null), 1800)
    }
  }

  const renderAccounts = (accounts: Account[], side: 'groom' | 'bride') => (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="overflow-hidden"
    >
      <div className="space-y-3 px-4 py-5" style={{ background: theme.colors.bg }}>
        {accounts.map((account, index) => {
          const key = `${side}-${index}`
          return (
            <div key={key} className="border-b pb-4 last:border-b-0 last:pb-0" style={{ borderColor: theme.colors.border }}>
              <div className="flex items-end justify-between gap-3">
                <div className="text-left">
                  <p className="text-[11px] tracking-[0.08em]" style={{ color: theme.colors.textMuted }}>
                    {account.bank} · 예금주 {account.holder}
                  </p>
                  <p className="mt-2 font-mono text-[14px] tracking-[0.04em]">{account.accountNumber}</p>
                </div>
                <button
                  type="button"
                  onClick={() => copyAccount(account.accountNumber, key)}
                  className="min-h-10 shrink-0 px-3 text-[12px]"
                  style={{ color: theme.colors.accent }}
                >
                  {copiedKey === key ? '복사됨' : '복사'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )

  const rows = [
    { side: 'groom' as const, label: '신랑 측 계좌번호', accounts: data.groomAccounts },
    { side: 'bride' as const, label: '신부 측 계좌번호', accounts: data.brideAccounts },
  ]

  return (
    <section className="invitation-section theme-bg-alt" style={{ color: theme.colors.text }}>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.75 }}
      >
        <SectionHeading label="For Your Heart" title="마음 전하실 곳" />

        <div className="border-y" style={{ borderColor: theme.colors.border }}>
          {rows.map(({ side, label, accounts }, index) => {
            const isOpen = openSide === side
            return (
              <div key={side} className={index === 0 ? 'border-b' : ''} style={{ borderColor: theme.colors.border }}>
                <button
                  type="button"
                  onClick={() => setOpenSide(isOpen ? null : side)}
                  className="flex min-h-[76px] w-full items-center gap-4 text-left"
                  aria-expanded={isOpen}
                >
                  <BankIcon className="h-6 w-6 shrink-0" style={{ color: theme.colors.accent }} />
                  <span className="flex-1 text-[15px]">{label}</span>
                  <ChevronDownIcon
                    className={`h-6 w-6 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    style={{ color: theme.colors.accent }}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && renderAccounts(accounts, side)}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
