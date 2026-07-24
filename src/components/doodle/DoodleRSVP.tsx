import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import { DOODLE, DoodleHeading, pen } from './DoodleKit'

export default function DoodleRSVP() {
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
    background: active ? DOODLE.red : DOODLE.paper,
    color: active ? DOODLE.cream : DOODLE.ink,
    border: `2px ${active ? 'solid' : 'dashed'} ${active ? DOODLE.red : DOODLE.tan}`,
    borderRadius: 12,
    minHeight: 46,
    fontSize: 14,
    fontWeight: 600,
  })

  return (
    <>
      <section className="px-10 py-14 text-center">
        <DoodleHeading squiggleWidth={90} className="mb-5">오실 수 있나요?</DoodleHeading>

        <div
          className="mx-auto max-w-[340px] px-5 py-6"
          style={{ border: `2px dashed ${DOODLE.tan}`, borderRadius: 16, background: DOODLE.paper }}
        >
          <p className="m-0" style={pen(26, DOODLE.red)}>참석 여부를 알려주세요</p>
          <p className="mt-1.5 text-[13px] leading-[1.8]" style={{ color: DOODLE.inkSoft }}>
            정성껏 준비해서
            <br />
            더 즐거운 하루로 만들게요.
          </p>
        </div>

        <button type="button" onClick={() => setShowModal(true)} className="doodle-pill mt-5">
          💌 참석 알리기
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
              className="relative max-h-[88vh] w-full max-w-[400px] overflow-y-auto px-6 pb-7 pt-7"
              style={{ background: DOODLE.cream, borderRadius: 20, color: DOODLE.ink }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="doodle-rsvp-title"
            >
              <button
                type="button"
                onClick={() => setShowModal(false)}
                aria-label="참석 여부 닫기"
                className="absolute right-3 top-2 h-9 w-9 text-[28px] leading-none"
                style={{ color: DOODLE.red }}
              >
                ×
              </button>

              {submitted ? (
                <div className="py-8 text-center">
                  <p id="doodle-rsvp-title" className="m-0" style={pen(34, DOODLE.red)}>
                    고마워요! 🎉
                  </p>
                  <p className="mt-2 text-[13px]" style={{ color: DOODLE.muted }}>
                    참석 여부가 전달되었습니다.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="doodle-pill mt-6"
                  >
                    닫기
                  </button>
                </div>
              ) : (
                <>
                  <h3 id="doodle-rsvp-title" className="m-0 mb-4 text-center" style={pen(34, DOODLE.red)}>
                    참석 여부
                  </h3>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
                    <fieldset>
                      <legend className="mb-1.5 text-[12px]" style={{ color: DOODLE.muted }}>
                        참석 여부
                      </legend>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setAttendance('attending')}
                          style={choiceStyle(attendance === 'attending')}
                        >
                          참석할게요
                        </button>
                        <button
                          type="button"
                          onClick={() => setAttendance('not_attending')}
                          style={choiceStyle(attendance === 'not_attending')}
                        >
                          어려워요
                        </button>
                      </div>
                    </fieldset>

                    <label className="block">
                      <span className="mb-1.5 block text-[12px]" style={{ color: DOODLE.muted }}>성함</span>
                      <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        maxLength={10}
                        required
                        className="doodle-field"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-[12px]" style={{ color: DOODLE.muted }}>연락처</span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        placeholder="010-0000-0000"
                        className="doodle-field"
                      />
                    </label>

                    {attendance === 'attending' && (
                      <>
                        <fieldset>
                          <legend className="mb-1.5 text-[12px]" style={{ color: DOODLE.muted }}>
                            참석 인원
                          </legend>
                          <div className="grid grid-cols-[50px_1fr_50px] gap-2">
                            <button
                              type="button"
                              onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                              aria-label="참석 인원 줄이기"
                              style={choiceStyle(false)}
                            >
                              −
                            </button>
                            <output
                              className="doodle-field flex items-center justify-center"
                              style={{ minHeight: 46 }}
                            >
                              {guestCount}명
                            </output>
                            <button
                              type="button"
                              onClick={() => setGuestCount(guestCount + 1)}
                              aria-label="참석 인원 늘리기"
                              style={choiceStyle(false)}
                            >
                              ＋
                            </button>
                          </div>
                        </fieldset>

                        <fieldset>
                          <legend className="mb-1.5 text-[12px]" style={{ color: DOODLE.muted }}>
                            식사 여부
                          </legend>
                          <div className="grid grid-cols-2 gap-2">
                            <button type="button" onClick={() => setMeal(true)} style={choiceStyle(meal)}>
                              식사 예정
                            </button>
                            <button type="button" onClick={() => setMeal(false)} style={choiceStyle(!meal)}>
                              식사 안 함
                            </button>
                          </div>
                        </fieldset>
                      </>
                    )}

                    <label className="block">
                      <span className="mb-1.5 block text-[12px]" style={{ color: DOODLE.muted }}>
                        메시지 (선택)
                      </span>
                      <textarea
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        maxLength={200}
                        rows={3}
                        className="doodle-field resize-none"
                      />
                    </label>

                    <button
                      type="submit"
                      disabled={submitting || !name.trim()}
                      className="doodle-pill w-full"
                      style={{ borderRadius: 12 }}
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
