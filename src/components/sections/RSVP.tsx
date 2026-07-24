import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Theme } from '@/themes'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import { CalendarIcon, CloseIcon } from '@/components/ui/Icons'

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!name.trim()) return
    setSubmitting(true)

    if (isSupabaseConfigured) {
      const { error } = await supabase.from('rsvps').insert({
        name: name.trim(),
        phone: phone.trim(),
        attendance,
        guest_count: guestCount,
        meal,
        message: message.trim(),
      })
      if (!error) setSubmitted(true)
    } else {
      const saved = JSON.parse(localStorage.getItem('rsvp') || '[]')
      saved.push({
        name,
        phone,
        attendance,
        guestCount,
        meal,
        message,
        createdAt: new Date().toISOString(),
      })
      localStorage.setItem('rsvp', JSON.stringify(saved))
      setSubmitted(true)
    }
    setSubmitting(false)
  }

  const choiceStyle = (active: boolean) => ({
    background: active ? theme.colors.bgDark : theme.colors.bg,
    borderColor: active ? theme.colors.bgDark : theme.colors.border,
    color: active ? theme.colors.bg : theme.colors.text,
  })

  return (
    <>
      <div className="flex min-w-0 flex-col items-center border-l pl-4 text-center" style={{ borderColor: theme.colors.border }}>
        <p className="section-kicker">RSVP</p>
        <h2 className="whitespace-nowrap font-heading text-[1.9rem] font-normal leading-tight">참석 여부</h2>
        <span className="section-rule" aria-hidden="true" />
        <p className="mt-6 min-h-[76px] text-[12px] leading-[1.7]" style={{ color: theme.colors.textMuted }}>
          정성껏 준비하기 위해<br />참석 여부를 알려주세요
        </p>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="editorial-button mt-4 w-full px-2"
        >
          <CalendarIcon />
          참석 알리기
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
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              className="bottom-sheet max-h-[92vh] w-full max-w-[480px] overflow-y-auto px-6 pb-[max(32px,env(safe-area-inset-bottom))] pt-6"
              role="dialog"
              aria-modal="true"
              aria-labelledby="rsvp-title"
            >
              {submitted ? (
                <div className="py-10 text-center">
                  <p id="rsvp-title" className="font-heading text-3xl">감사합니다</p>
                  <p className="mt-3 text-[13px]" style={{ color: theme.colors.textMuted }}>
                    참석 여부가 전달되었습니다.
                  </p>
                  <button type="button" onClick={() => setShowModal(false)} className="editorial-button mt-7 px-10">
                    닫기
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-7 flex items-center justify-between">
                    <div>
                      <p className="section-kicker mb-2">RSVP</p>
                      <h3 id="rsvp-title" className="font-heading text-3xl font-normal">참석 여부</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      aria-label="참석 여부 닫기"
                      className="flex h-11 w-11 items-center justify-center"
                      style={{ color: theme.colors.textMuted }}
                    >
                      <CloseIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <fieldset>
                      <legend className="mb-2 text-[12px]" style={{ color: theme.colors.textMuted }}>참석 여부</legend>
                      <div className="grid grid-cols-2 gap-2">
                        <button type="button" onClick={() => setAttendance('attending')} className="editorial-button" style={choiceStyle(attendance === 'attending')}>참석</button>
                        <button type="button" onClick={() => setAttendance('not_attending')} className="editorial-button" style={choiceStyle(attendance === 'not_attending')}>불참</button>
                      </div>
                    </fieldset>

                    <label className="block">
                      <span className="mb-2 block text-[12px]" style={{ color: theme.colors.textMuted }}>성함</span>
                      <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        maxLength={10}
                        required
                        className="editorial-input px-4 py-3.5"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-[12px]" style={{ color: theme.colors.textMuted }}>연락처</span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        placeholder="010-0000-0000"
                        className="editorial-input px-4 py-3.5"
                      />
                    </label>

                    {attendance === 'attending' && (
                      <>
                        <fieldset>
                          <legend className="mb-2 text-[12px]" style={{ color: theme.colors.textMuted }}>참석 인원</legend>
                          <div className="grid grid-cols-[50px_1fr_50px] gap-2">
                            <button type="button" onClick={() => setGuestCount(Math.max(1, guestCount - 1))} className="editorial-button px-0" aria-label="참석 인원 줄이기">−</button>
                            <output className="editorial-input flex items-center justify-center">{guestCount}명</output>
                            <button type="button" onClick={() => setGuestCount(guestCount + 1)} className="editorial-button px-0" aria-label="참석 인원 늘리기">＋</button>
                          </div>
                        </fieldset>
                        <fieldset>
                          <legend className="mb-2 text-[12px]" style={{ color: theme.colors.textMuted }}>식사 여부</legend>
                          <div className="grid grid-cols-2 gap-2">
                            <button type="button" onClick={() => setMeal(true)} className="editorial-button" style={choiceStyle(meal)}>식사 예정</button>
                            <button type="button" onClick={() => setMeal(false)} className="editorial-button" style={choiceStyle(!meal)}>식사 안 함</button>
                          </div>
                        </fieldset>
                      </>
                    )}

                    <label className="block">
                      <span className="mb-2 block text-[12px]" style={{ color: theme.colors.textMuted }}>메시지 (선택)</span>
                      <textarea
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        maxLength={200}
                        rows={3}
                        className="editorial-input resize-none px-4 py-3.5"
                      />
                    </label>

                    <button
                      type="submit"
                      disabled={submitting || !name.trim()}
                      className="editorial-button w-full"
                      style={{ background: theme.colors.bgDark, color: theme.colors.bg }}
                    >
                      {submitting ? '제출 중...' : '참석 여부 전달하기'}
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
