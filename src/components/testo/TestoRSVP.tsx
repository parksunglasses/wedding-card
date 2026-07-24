import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import { TESTO, TestoHeading, pen } from './TestoKit'

export default function TestoRSVP() {
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
    background: active ? TESTO.red : TESTO.paperAlt,
    color: active ? TESTO.paper : TESTO.ink,
    border: `2px solid ${active ? TESTO.red : TESTO.tan}`,
    borderRadius: 6,
    minHeight: 46,
    fontSize: 14,
    fontWeight: 700,
    fontFamily: 'Gaegu, sans-serif',
  })

  return (
    <>
      <section className="testo-paper px-10 py-[52px] text-center">
        <TestoHeading squiggleWidth={110} className="mb-5">오실 수 있나요?</TestoHeading>

        <div
          className="mx-auto max-w-[340px] px-5 py-6"
          style={{ border: `2px solid ${TESTO.tan}`, borderRadius: 4, background: TESTO.paperAlt }}
        >
          <p className="m-0" style={pen(26, TESTO.red)}>참석 여부를 알려주세요</p>
          <p className="mt-1.5 text-[14px] leading-[1.8]" style={{ fontFamily: 'Gaegu, sans-serif', color: TESTO.inkSoft }}>
            정성껏 준비해서
            <br />
            더 즐거운 하루로 만들게요.
          </p>
        </div>

        <button type="button" onClick={() => setShowModal(true)} className="testo-pill mt-5">
          참석 알리기
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
            style={{ background: 'rgba(20,6,8,.82)' }}
            role="presentation"
          >
            <motion.div
              initial={{ scale: 0.94, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 16 }}
              className="testo-paper relative max-h-[88vh] w-full max-w-[400px] overflow-y-auto px-6 pb-7 pt-7"
              style={{ borderRadius: 8, color: TESTO.ink }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="testo-rsvp-title"
            >
              <button
                type="button"
                onClick={() => setShowModal(false)}
                aria-label="참석 여부 닫기"
                className="absolute right-3.5 top-3 text-[28px] leading-none"
                style={{ color: TESTO.red }}
              >
                ×
              </button>

              {submitted ? (
                <div className="py-8 text-center">
                  <p id="testo-rsvp-title" className="m-0" style={pen(34, TESTO.red)}>
                    고마워요!
                  </p>
                  <p className="mt-2 text-[13px]" style={{ fontFamily: 'Gaegu, sans-serif', color: TESTO.muted }}>
                    참석 여부가 전달되었습니다.
                  </p>
                  <button type="button" onClick={() => setShowModal(false)} className="testo-pill mt-6">
                    닫기
                  </button>
                </div>
              ) : (
                <>
                  <h3 id="testo-rsvp-title" className="m-0 mb-4 text-center" style={pen(34, TESTO.red)}>
                    참석 여부
                  </h3>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
                    <fieldset>
                      <legend className="mb-1.5 text-[12px]" style={{ fontFamily: 'Gaegu, sans-serif', color: TESTO.muted }}>
                        참석 여부
                      </legend>
                      <div className="grid grid-cols-2 gap-2">
                        <button type="button" onClick={() => setAttendance('attending')} style={choiceStyle(attendance === 'attending')}>
                          참석할게요
                        </button>
                        <button type="button" onClick={() => setAttendance('not_attending')} style={choiceStyle(attendance === 'not_attending')}>
                          어려워요
                        </button>
                      </div>
                    </fieldset>

                    <label className="block">
                      <span className="mb-1.5 block text-[12px]" style={{ fontFamily: 'Gaegu, sans-serif', color: TESTO.muted }}>성함</span>
                      <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        maxLength={10}
                        required
                        className="testo-field"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-[12px]" style={{ fontFamily: 'Gaegu, sans-serif', color: TESTO.muted }}>연락처</span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        placeholder="010-0000-0000"
                        className="testo-field"
                      />
                    </label>

                    {attendance === 'attending' && (
                      <>
                        <fieldset>
                          <legend className="mb-1.5 text-[12px]" style={{ fontFamily: 'Gaegu, sans-serif', color: TESTO.muted }}>
                            참석 인원
                          </legend>
                          <div className="grid grid-cols-[50px_1fr_50px] gap-2">
                            <button type="button" onClick={() => setGuestCount(Math.max(1, guestCount - 1))} aria-label="참석 인원 줄이기" style={choiceStyle(false)}>
                              −
                            </button>
                            <output className="testo-field flex items-center justify-center" style={{ minHeight: 46 }}>
                              {guestCount}명
                            </output>
                            <button type="button" onClick={() => setGuestCount(guestCount + 1)} aria-label="참석 인원 늘리기" style={choiceStyle(false)}>
                              ＋
                            </button>
                          </div>
                        </fieldset>

                        <fieldset>
                          <legend className="mb-1.5 text-[12px]" style={{ fontFamily: 'Gaegu, sans-serif', color: TESTO.muted }}>
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
                      <span className="mb-1.5 block text-[12px]" style={{ fontFamily: 'Gaegu, sans-serif', color: TESTO.muted }}>
                        메시지 (선택)
                      </span>
                      <textarea
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        maxLength={200}
                        rows={3}
                        className="testo-field resize-none"
                      />
                    </label>

                    <button type="submit" disabled={submitting || !name.trim()} className="testo-pill w-full" style={{ borderRadius: 6 }}>
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
