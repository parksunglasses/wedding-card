import { CSSProperties, useState } from 'react'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import { TESTO, pen, gaegu, TestoHeading, Modal } from './TestoKit'

export default function TestoRSVP() {
  const [modal, setModal] = useState(false)
  const [att, setAtt] = useState<'attending' | 'not_attending'>('attending')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [guests, setGuests] = useState(1)
  const [meal, setMeal] = useState(true)
  const [message, setMessage] = useState('')
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSubmitting(true)
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('rsvps').insert({
        name: name.trim(), phone: phone.trim(), attendance: att,
        guest_count: guests, meal, message: message.trim(),
      })
      if (!error) setDone(true)
    } else {
      const saved = JSON.parse(localStorage.getItem('rsvp') || '[]')
      saved.push({ name, phone, attendance: att, guestCount: guests, meal, message, createdAt: new Date().toISOString() })
      localStorage.setItem('rsvp', JSON.stringify(saved))
      setDone(true)
    }
    setSubmitting(false)
  }

  const choice = (active: boolean): CSSProperties => ({
    background: active ? TESTO.red : TESTO.paperAlt,
    color: active ? TESTO.paper : TESTO.ink,
    border: `2px solid ${active ? TESTO.red : TESTO.tan}`,
    borderRadius: 6, minHeight: 46, fontSize: 14, fontWeight: 700, ...gaegu,
  })
  const lbl: CSSProperties = { ...gaegu, fontSize: 12, color: TESTO.muted, display: 'block', marginBottom: 6 }

  return (
    <section className="testo-paper rsvp">
      <TestoHeading squiggleWidth={110} className="mb-20">오실 수 있나요?</TestoHeading>
      <div className="rsvp-card" style={{ border: `2px solid ${TESTO.tan}`, borderRadius: 4, background: TESTO.paperAlt }}>
        <p style={{ ...pen(26, TESTO.red), margin: 0 }}>참석 여부를 알려주세요</p>
        <p style={{ ...gaegu, fontSize: 14, lineHeight: 1.8, color: TESTO.inkSoft, marginTop: 6 }}>정성껏 준비해서<br />더 즐거운 하루로 만들게요.</p>
      </div>
      <button type="button" onClick={() => setModal(true)} className="testo-pill mt-20">참석 알리기</button>

      {modal && (
        <Modal onClose={() => setModal(false)} title={done ? null : '참석 여부'}>
          {done ? (
            <div style={{ padding: '32px 0', textAlign: 'center' }}>
              <p style={{ ...pen(34, TESTO.red), margin: 0 }}>고마워요!</p>
              <p style={{ ...gaegu, fontSize: 13, color: TESTO.muted, marginTop: 8 }}>참석 여부가 전달되었습니다.</p>
              <button type="button" onClick={() => setModal(false)} className="testo-pill mt-24">닫기</button>
            </div>
          ) : (
            <form onSubmit={submit} className="col gap-16" style={{ textAlign: 'left' }}>
              <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                <legend style={lbl}>참석 여부</legend>
                <div className="grid2">
                  <button type="button" onClick={() => setAtt('attending')} style={choice(att === 'attending')}>참석할게요</button>
                  <button type="button" onClick={() => setAtt('not_attending')} style={choice(att === 'not_attending')}>어려워요</button>
                </div>
              </fieldset>
              <label><span style={lbl}>성함</span><input className="testo-field" value={name} onChange={(e) => setName(e.target.value)} maxLength={10} required /></label>
              <label><span style={lbl}>연락처</span><input className="testo-field" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" /></label>
              {att === 'attending' && (
                <>
                  <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                    <legend style={lbl}>참석 인원</legend>
                    <div className="grid-guest">
                      <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))} style={choice(false)} aria-label="줄이기">−</button>
                      <output className="testo-field" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 46 }}>{guests}명</output>
                      <button type="button" onClick={() => setGuests(guests + 1)} style={choice(false)} aria-label="늘리기">＋</button>
                    </div>
                  </fieldset>
                  <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                    <legend style={lbl}>식사 여부</legend>
                    <div className="grid2">
                      <button type="button" onClick={() => setMeal(true)} style={choice(meal)}>식사 예정</button>
                      <button type="button" onClick={() => setMeal(false)} style={choice(!meal)}>식사 안 함</button>
                    </div>
                  </fieldset>
                </>
              )}
              <label><span style={lbl}>메시지 (선택)</span><textarea className="testo-field" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={200} rows={3} style={{ resize: 'none' }} /></label>
              <button type="submit" className="testo-pill" style={{ borderRadius: 6, width: '100%' }} disabled={submitting || !name.trim()}>참석 여부 전달하기</button>
            </form>
          )}
        </Modal>
      )}
    </section>
  )
}
