import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { GuestbookEntry } from '@/types'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import { isAuthenticated } from '@/pages/EditLogin'
import { DOODLE, DoodleHeading, pen } from './DoodleKit'

export default function DoodleGuestbook() {
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
      particleCount: 22,
      spread: 50,
      startVelocity: 14,
      decay: 0.92,
      scalar: 0.5,
      ticks: 80,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      },
      colors: [DOODLE.red, DOODLE.gold, DOODLE.greenLine],
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
      <section className="px-10 py-14 text-center" style={{ background: DOODLE.creamAlt }}>
        <DoodleHeading squiggleWidth={100} className="mb-6">한마디 남겨주세요!</DoodleHeading>

        <div
          ref={cardRef}
          className="mx-auto flex min-h-[110px] max-w-[340px] flex-col items-center justify-center px-5 py-6"
          style={{ background: DOODLE.paper, border: `2px solid ${DOODLE.border}`, borderRadius: 16 }}
        >
          {currentEntry ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentEntry.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
              >
                <p className="m-0 mb-2" style={pen(24, DOODLE.red)}>{currentEntry.name}</p>
                <p
                  className="m-0 whitespace-pre-line text-[13.5px] leading-[1.8]"
                  style={{ color: '#6E5247' }}
                >
                  {currentEntry.message}
                </p>
                <p className="mt-3 text-[11px]" style={{ color: DOODLE.tan }}>
                  {currentIndex + 1} / {entries.length}
                </p>
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
            <p className="m-0 text-[13.5px]" style={{ color: DOODLE.muted }}>
              첫 번째 축하 메시지를 남겨주세요 💌
            </p>
          )}
        </div>

        <button type="button" onClick={() => setShowModal(true)} className="doodle-pill mt-5">
          ✏️ 축하 메시지 남기기
        </button>
      </section>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(event) => event.target === event.currentTarget && setShowModal(false)}
            className="fixed inset-0 z-[80] flex items-center justify-center p-6"
            style={{ background: 'rgba(30,10,8,.82)' }}
            role="presentation"
          >
            <motion.div
              initial={{ scale: 0.94, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 16 }}
              className="relative w-full max-w-[400px] px-6 pb-7 pt-7 text-center"
              style={{ background: DOODLE.cream, borderRadius: 20, color: DOODLE.ink }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="doodle-guestbook-title"
            >
              <button
                type="button"
                onClick={() => setShowModal(false)}
                aria-label="방명록 닫기"
                className="absolute right-3 top-2 h-9 w-9 text-[28px] leading-none"
                style={{ color: DOODLE.red }}
              >
                ×
              </button>

              {submitted ? (
                <div className="py-8">
                  <p id="doodle-guestbook-title" className="m-0" style={pen(34, DOODLE.red)}>
                    고마워요! 💌
                  </p>
                  <p className="mt-2 text-[13px]" style={{ color: DOODLE.muted }}>
                    소중한 메시지가 전달됐어요.
                  </p>
                </div>
              ) : (
                <>
                  <h3 id="doodle-guestbook-title" className="m-0 mb-4" style={pen(34, DOODLE.red)}>
                    축하 메시지
                  </h3>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
                    <label className="block">
                      <span className="sr-only">이름</span>
                      <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="이름"
                        maxLength={10}
                        required
                        className="doodle-field"
                      />
                    </label>
                    <label className="block">
                      <span className="sr-only">축하 메시지</span>
                      <textarea
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        placeholder="따뜻한 한마디를 남겨주세요"
                        maxLength={200}
                        rows={4}
                        required
                        className="doodle-field resize-none"
                      />
                    </label>
                    <button
                      type="submit"
                      disabled={submitting || !name.trim() || !message.trim()}
                      className="doodle-pill w-full"
                      style={{ borderRadius: 12 }}
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
