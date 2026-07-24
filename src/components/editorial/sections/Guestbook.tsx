import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { GuestbookEntry } from '@/types'
import { Theme } from '@/themes'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import { isAuthenticated } from '@/pages/EditLogin'
import { CloseIcon, PenIcon } from '@/components/ui/Icons'

interface Props {
  theme: Theme
}

export default function Guestbook({ theme }: Props) {
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const isAdmin = isAuthenticated()

  const fetchEntries = async () => {
    if (!isSupabaseConfigured) {
      const saved = localStorage.getItem('guestbook')
      if (saved) setEntries(JSON.parse(saved))
      return
    }
    const { data, error } = await supabase
      .from('guestbooks')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) {
      setEntries(data.map((entry) => ({
        id: entry.id,
        name: entry.name,
        message: entry.message,
        createdAt: entry.created_at,
      })))
    }
  }

  useEffect(() => {
    fetchEntries()
  }, [])

  useEffect(() => {
    if (entries.length <= 1) return
    const timer = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % entries.length)
    }, 5000)
    return () => window.clearInterval(timer)
  }, [entries.length])

  const celebrate = () => {
    if (!cardRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = cardRef.current.getBoundingClientRect()
    confetti({
      particleCount: 18,
      spread: 45,
      startVelocity: 13,
      decay: 0.92,
      scalar: 0.45,
      ticks: 70,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      },
      colors: [theme.colors.accent, theme.colors.accentLight, theme.colors.bg],
      gravity: 0.65,
    })
  }

  const deleteEntry = async (id: string) => {
    if (!confirm('이 방명록을 삭제할까요?')) return
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('guestbooks').delete().eq('id', id)
      if (error) {
        alert(`삭제 실패: ${error.message}`)
        return
      }
    }
    const updated = entries.filter((entry) => entry.id !== id)
    setEntries(updated)
    setCurrentIndex(0)
    if (!isSupabaseConfigured) localStorage.setItem('guestbook', JSON.stringify(updated))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!name.trim() || !message.trim()) return
    setSubmitting(true)

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('guestbooks')
        .insert({ name: name.trim(), message: message.trim() })
      if (!error) await fetchEntries()
    } else {
      const newEntry: GuestbookEntry = {
        id: Date.now().toString(),
        name: name.trim(),
        message: message.trim(),
        createdAt: new Date().toISOString(),
      }
      const updated = [newEntry, ...entries]
      setEntries(updated)
      localStorage.setItem('guestbook', JSON.stringify(updated))
    }

    setName('')
    setMessage('')
    setSubmitting(false)
    setSubmitted(true)
    celebrate()
    window.setTimeout(() => {
      setSubmitted(false)
      setShowModal(false)
    }, 1500)
  }

  const currentEntry = entries[currentIndex]

  return (
    <>
      <div ref={cardRef} className="flex min-w-0 flex-col items-center text-center">
        <p className="section-kicker">Guestbook</p>
        <h2 className="whitespace-nowrap font-heading text-[1.9rem] font-normal leading-tight">방명록</h2>
        <span className="section-rule" aria-hidden="true" />
        <div className="mt-6 min-h-[76px] text-[12px] leading-[1.7]" style={{ color: theme.colors.textMuted }}>
          {currentEntry ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentEntry.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                <p className="mb-1 font-medium" style={{ color: theme.colors.accent }}>{currentEntry.name}</p>
                <p className="line-clamp-2">{currentEntry.message}</p>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => deleteEntry(currentEntry.id)}
                    className="mt-1 text-[11px] text-red-700"
                  >
                    삭제
                  </button>
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <p>축하의 마음을<br />글로 남겨주세요</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="editorial-button mt-4 w-full px-2"
        >
          <PenIcon />
          메시지 남기기
        </button>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45"
            onClick={(event) => event.target === event.currentTarget && setShowModal(false)}
            role="presentation"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              className="bottom-sheet w-full max-w-[480px] px-6 pb-[max(32px,env(safe-area-inset-bottom))] pt-6"
              role="dialog"
              aria-modal="true"
              aria-labelledby="guestbook-title"
            >
              {submitted ? (
                <div className="py-10 text-center">
                  <p id="guestbook-title" className="font-heading text-3xl">감사합니다</p>
                  <p className="mt-3 text-[13px]" style={{ color: theme.colors.textMuted }}>
                    소중한 메시지가 전달됐어요.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-7 flex items-center justify-between">
                    <div>
                      <p className="section-kicker mb-2">Guestbook</p>
                      <h3 id="guestbook-title" className="font-heading text-3xl font-normal">축하 메시지</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      aria-label="방명록 닫기"
                      className="flex h-11 w-11 items-center justify-center"
                      style={{ color: theme.colors.textMuted }}
                    >
                      <CloseIcon className="h-6 w-6" />
                    </button>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <label className="block">
                      <span className="sr-only">이름</span>
                      <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="이름"
                        maxLength={10}
                        required
                        className="editorial-input px-4 py-3.5"
                      />
                    </label>
                    <label className="block">
                      <span className="sr-only">축하 메시지</span>
                      <textarea
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        placeholder="축하 메시지를 남겨주세요"
                        maxLength={200}
                        rows={4}
                        required
                        className="editorial-input resize-none px-4 py-3.5"
                      />
                    </label>
                    <button
                      type="submit"
                      disabled={submitting || !name.trim() || !message.trim()}
                      className="editorial-button w-full"
                      style={{ background: theme.colors.bgDark, color: theme.colors.bg }}
                    >
                      {submitting ? '전송 중...' : '메시지 남기기'}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
