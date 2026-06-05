import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { GuestbookEntry } from '@/types'
import { Theme } from '@/themes'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { isAuthenticated } from '@/pages/EditLogin'

interface Props {
  theme: Theme
}

export default function Guestbook({ theme }: Props) {
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [direction, setDirection] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const isAdmin = isAuthenticated()

  useEffect(() => { fetchEntries() }, [])

  // 4초마다 다음으로 전환 + 작은 폭죽
  useEffect(() => {
    if (entries.length <= 1) return
    const timer = setInterval(() => {
      setDirection(1)
      setCurrentIdx((i) => (i + 1) % entries.length)
      fireSmallConfetti()
    }, 4000)
    return () => clearInterval(timer)
  }, [entries.length])

  const fireSmallConfetti = () => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (rect.left + rect.width / 2) / window.innerWidth
    const y = (rect.top + rect.height / 2) / window.innerHeight
    confetti({
      particleCount: 20,
      spread: 50,
      startVelocity: 14,
      decay: 0.9,
      scalar: 0.4,
      ticks: 80,
      origin: { x, y },
      colors: [theme.colors.accent, theme.colors.accentLight, '#fff'],
      gravity: 0.6,
    })
  }

  const goTo = (idx: number) => {
    setDirection(idx > currentIdx ? 1 : -1)
    setCurrentIdx(idx)
    fireSmallConfetti()
  }

  const fetchEntries = async () => {
    if (!isSupabaseConfigured) {
      const saved = localStorage.getItem('guestbook')
      if (saved) setEntries(JSON.parse(saved))
      return
    }
    const { data, error } = await supabase
      .from('guestbooks').select('*').order('created_at', { ascending: false })
    if (!error && data) {
      setEntries(data.map(d => ({ id: d.id, name: d.name, message: d.message, createdAt: d.created_at })))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('이 방명록을 삭제할까요?')) return
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('guestbooks').delete().eq('id', id)
      if (!error) setEntries((prev) => prev.filter((e) => e.id !== id))
      else alert('삭제 실패: ' + error.message)
    } else {
      const updated = entries.filter((e) => e.id !== id)
      setEntries(updated)
      localStorage.setItem('guestbook', JSON.stringify(updated))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    setSubmitting(true)

    if (isSupabaseConfigured) {
      const { error } = await supabase.from('guestbooks').insert({ name: name.trim(), message: message.trim() })
      if (!error) await fetchEntries()
    } else {
      const newEntry: GuestbookEntry = { id: Date.now().toString(), name: name.trim(), message: message.trim(), createdAt: new Date().toISOString() }
      const updated = [newEntry, ...entries]
      setEntries(updated)
      localStorage.setItem('guestbook', JSON.stringify(updated))
    }

    setName('')
    setMessage('')
    setSubmitting(false)
    setSubmitted(true)
    setTimeout(() => { setSubmitted(false); setShowModal(false) }, 1800)
  }

  const entry = entries[currentIdx]

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  }

  return (
    <>
      <section className="theme-bg py-16 px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-md mx-auto"
        >
          <div className="text-center mb-8">
            <p className="font-heading text-xs tracking-[0.4em] theme-accent mb-2 uppercase">Guestbook</p>
            <h2 className="font-heading text-2xl theme-text">방명록</h2>
          </div>

          {/* 슬라이드 카드 */}
          <div
            ref={cardRef}
            className="rounded-2xl px-6 py-8 mb-6 text-center min-h-[140px] flex flex-col items-center justify-center overflow-hidden relative"
            style={{ background: '#FFFFFF', border: `1px solid ${theme.colors.border}` }}
          >
            {entries.length === 0 ? (
              <p className="text-sm" style={{ color: theme.colors.text + '60' }}>
                첫 번째 축하 메시지를 남겨주세요 💌
              </p>
            ) : (
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentIdx}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="w-full"
                >
                  <p className="text-sm font-semibold mb-3" style={{ color: theme.colors.accent }}>
                    {entry.name}
                  </p>
                  <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: theme.colors.text + 'CC' }}>
                    {entry.message}
                  </p>
                  {entries.length > 1 && (
                    <div className="flex justify-center gap-1.5 mt-5">
                      {entries.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => goTo(i)}
                          className="w-1.5 h-1.5 rounded-full transition-all"
                          style={{
                            background: i === currentIdx ? theme.colors.accent : theme.colors.border,
                            transform: i === currentIdx ? 'scale(1.4)' : 'scale(1)',
                          }}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
            {isAdmin && entry && (
              <button
                onClick={() => handleDelete(entry.id)}
                className="absolute top-3 right-3 text-xs px-1.5 py-0.5 rounded"
                style={{ color: '#C0392B', background: '#C0392B11' }}
              >삭제</button>
            )}
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="w-full py-3 rounded-xl text-sm font-medium"
            style={{ background: theme.colors.accent, color: '#fff' }}
          >
            ✏️ 축하 메시지 남기기
          </button>
        </motion.div>
      </section>

      {/* 작성 팝업 */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-full max-w-[480px] rounded-t-3xl p-6 pb-10"
              style={{ background: '#FFFFFF' }}
            >
              {submitted ? (
                <div className="py-10 text-center">
                  <p className="text-3xl mb-3">💌</p>
                  <p className="font-heading text-lg" style={{ color: theme.colors.accent }}>감사합니다!</p>
                  <p className="text-sm mt-1" style={{ color: theme.colors.textMuted }}>소중한 메시지가 전달됐어요</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-heading text-lg theme-text">축하 메시지</h3>
                    <button onClick={() => setShowModal(false)} className="text-2xl leading-none" style={{ color: theme.colors.textMuted }}>×</button>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="이름" maxLength={10}
                      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
                      style={{ background: '#F9F9F9', border: `1px solid ${theme.colors.border}`, color: theme.colors.text }} />
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)}
                      placeholder="축하 메시지를 남겨주세요" maxLength={200} rows={4}
                      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none resize-none"
                      style={{ background: '#F9F9F9', border: `1px solid ${theme.colors.border}`, color: theme.colors.text }} />
                    <button type="submit" disabled={submitting || !name.trim() || !message.trim()}
                      className="w-full py-3 rounded-xl text-white text-sm font-medium disabled:opacity-50"
                      style={{ background: theme.colors.accent }}>
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
