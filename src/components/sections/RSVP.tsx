import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Theme } from '@/themes'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

interface Props {
  theme: Theme
}

export default function RSVP({ theme }: Props) {
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [attendance, setAttendance] = useState<'attending' | 'not_attending'>('attending')
  const [guestCount, setGuestCount] = useState(1)
  const [meal, setMeal] = useState(true)
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSubmitting(true)

    if (isSupabaseConfigured) {
      const { error } = await supabase.from('rsvps').insert({
        name: name.trim(), phone: phone.trim(), attendance,
        guest_count: guestCount, meal, message: message.trim(),
      })
      if (!error) setSubmitted(true)
    } else {
      const saved = JSON.parse(localStorage.getItem('rsvp') || '[]')
      saved.push({ name, phone, attendance, guestCount, meal, message, createdAt: new Date().toISOString() })
      localStorage.setItem('rsvp', JSON.stringify(saved))
      setSubmitted(true)
    }
    setSubmitting(false)
  }

  const inputStyle = {
    background: '#F9F9F9',
    border: `1px solid ${theme.colors.border}`,
    color: theme.colors.text,
  }
  const btnActive = { background: theme.colors.accent, color: '#fff', border: `1px solid ${theme.colors.accent}` }
  const btnInactive = { background: '#F9F9F9', color: theme.colors.text, border: `1px solid ${theme.colors.border}` }

  return (
    <>
      <section className="theme-bg-alt py-16 px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-md mx-auto text-center"
        >
          <p className="font-heading text-xs tracking-[0.4em] theme-accent mb-2 uppercase">RSVP</p>
          <h2 className="font-heading text-2xl theme-text mb-2">참석 여부</h2>
          <p className="text-xs mb-8" style={{ color: theme.colors.text + '99' }}>
            정성껏 준비하기 위해 참석 여부를 알려주세요
          </p>

          {submitted ? (
            <div className="py-6">
              <div className="text-4xl mb-3">💌</div>
              <p className="font-heading text-lg theme-text mb-1">감사합니다</p>
              <p className="text-sm" style={{ color: theme.colors.text + 'B3' }}>참석 여부가 전달되었습니다</p>
            </div>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="w-full py-3 rounded-xl text-sm font-medium"
              style={{ background: theme.colors.accent, color: '#fff' }}
            >
              📋 참석 여부 알리기
            </button>
          )}
        </motion.div>
      </section>

      {/* RSVP 팝업 */}
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
              className="w-full max-w-[480px] rounded-t-3xl p-6 pb-10 overflow-y-auto"
              style={{ background: '#FFFFFF', maxHeight: '90vh' }}
            >
              {submitted ? (
                <div className="py-10 text-center">
                  <p className="text-4xl mb-3">💌</p>
                  <p className="font-heading text-xl mb-1" style={{ color: theme.colors.accent }}>감사합니다!</p>
                  <p className="text-sm" style={{ color: theme.colors.textMuted }}>참석 여부가 전달되었습니다</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-heading text-lg theme-text">참석 여부</h3>
                    <button onClick={() => setShowModal(false)} className="text-2xl leading-none" style={{ color: theme.colors.textMuted }}>×</button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs mb-2 block" style={{ color: theme.colors.text + '99' }}>참석 여부</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button type="button" onClick={() => setAttendance('attending')}
                          className="py-3 rounded-xl text-sm transition-all" style={attendance === 'attending' ? btnActive : btnInactive}>참석</button>
                        <button type="button" onClick={() => setAttendance('not_attending')}
                          className="py-3 rounded-xl text-sm transition-all" style={attendance === 'not_attending' ? btnActive : btnInactive}>불참</button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs mb-2 block" style={{ color: theme.colors.text + '99' }}>성함</label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} maxLength={10}
                        className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none" style={inputStyle} />
                    </div>

                    <div>
                      <label className="text-xs mb-2 block" style={{ color: theme.colors.text + '99' }}>연락처</label>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000"
                        className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none" style={inputStyle} />
                    </div>

                    {attendance === 'attending' && (
                      <>
                        <div>
                          <label className="text-xs mb-2 block" style={{ color: theme.colors.text + '99' }}>참석 인원</label>
                          <div className="flex items-center gap-3">
                            <button type="button" onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                              className="w-10 h-10 rounded-xl" style={btnInactive}>-</button>
                            <div className="flex-1 text-center py-3 rounded-xl text-sm" style={inputStyle}>{guestCount}명</div>
                            <button type="button" onClick={() => setGuestCount(guestCount + 1)}
                              className="w-10 h-10 rounded-xl" style={btnInactive}>+</button>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs mb-2 block" style={{ color: theme.colors.text + '99' }}>식사 여부</label>
                          <div className="grid grid-cols-2 gap-2">
                            <button type="button" onClick={() => setMeal(true)}
                              className="py-3 rounded-xl text-sm transition-all" style={meal ? btnActive : btnInactive}>예정</button>
                            <button type="button" onClick={() => setMeal(false)}
                              className="py-3 rounded-xl text-sm transition-all" style={!meal ? btnActive : btnInactive}>안 함</button>
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                      <label className="text-xs mb-2 block" style={{ color: theme.colors.text + '99' }}>메시지 (선택)</label>
                      <textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={200} rows={3}
                        className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none resize-none" style={inputStyle} />
                    </div>

                    <button type="submit" disabled={submitting || !name.trim()}
                      className="w-full py-3 rounded-xl text-white text-sm font-medium disabled:opacity-50"
                      style={{ background: theme.colors.accent }}>
                      {submitting ? '제출 중...' : '제출하기'}
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
