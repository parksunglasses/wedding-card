import { useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { GuestbookEntry } from '@/types'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import { isAuthenticated } from '@/pages/EditLogin'
import { TESTO, pen, gaegu, TestoHeading, Modal, Deco } from './TestoKit'

export default function TestoGuestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [idx, setIdx] = useState(0)
  const [modal, setModal] = useState(false)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const isAdmin = isAuthenticated()

  const fetchEntries = async () => {
    if (!isSupabaseConfigured) {
      const saved = localStorage.getItem('guestbook')
      if (saved) setEntries(JSON.parse(saved))
      return
    }
    const { data, error } = await supabase.from('guestbooks').select('*').order('created_at', { ascending: false })
    if (!error && data) {
      setEntries(data.map((e) => ({ id: e.id, name: e.name, message: e.message, createdAt: e.created_at })))
    }
  }

  useEffect(() => { fetchEntries() }, [])

  useEffect(() => {
    if (entries.length <= 1) return
    const t = window.setInterval(() => setIdx((i) => (i + 1) % entries.length), 5000)
    return () => window.clearInterval(t)
  }, [entries.length])

  const celebrate = () => {
    if (!cardRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = cardRef.current.getBoundingClientRect()
    confetti({
      particleCount: 22, spread: 50, startVelocity: 14, decay: 0.92, scalar: 0.5, ticks: 80,
      origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight },
      colors: [TESTO.red, TESTO.gold, TESTO.pine], gravity: 0.65,
    })
  }

  const deleteEntry = async (id: string) => {
    if (!confirm('이 방명록을 삭제할까요?')) return
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('guestbooks').delete().eq('id', id)
      if (error) { alert(`삭제 실패: ${error.message}`); return }
    }
    const updated = entries.filter((e) => e.id !== id)
    setEntries(updated)
    setIdx(0)
    if (!isSupabaseConfigured) localStorage.setItem('guestbook', JSON.stringify(updated))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    setSubmitting(true)
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('guestbooks').insert({ name: name.trim(), message: message.trim() })
      if (!error) await fetchEntries()
    } else {
      const entry: GuestbookEntry = { id: Date.now().toString(), name: name.trim(), message: message.trim(), createdAt: new Date().toISOString() }
      const updated = [entry, ...entries]
      setEntries(updated)
      localStorage.setItem('guestbook', JSON.stringify(updated))
    }
    setName('')
    setMessage('')
    setSubmitting(false)
    setIdx(0)
    setDone(true)
    celebrate()
    window.setTimeout(() => { setDone(false); setModal(false) }, 1500)
  }

  const cur = entries[idx]

  return (
    <section className="testo-paper-red guestbook" style={{ color: TESTO.paper }}>
      <Deco tone="red" items={[]} />
      <h2 className="mb-38" style={pen(52, TESTO.paper)}>축하 메시지 남기기</h2>
      <div ref={cardRef} className="gb-card tartan-red" style={{ transform: 'rotate(-0.6deg)' }}>
        <div className="gb-inner">
          {cur ? (
            <div key={cur.id}>
              <p style={{ ...pen(24, TESTO.red), margin: '0 0 6px' }}>{cur.name}</p>
              <p style={{ ...gaegu, fontSize: 15, lineHeight: 1.7, color: TESTO.inkSoft, margin: 0, whiteSpace: 'pre-line' }}>{cur.message}</p>
              <p style={{ ...gaegu, fontSize: 12, color: '#B89A8E', marginTop: 10 }}>{idx + 1} / {entries.length}</p>
              {isAdmin && (
                <button type="button" onClick={() => deleteEntry(cur.id)} style={{ ...gaegu, fontSize: 11, color: TESTO.red, marginTop: 4 }}>삭제</button>
              )}
            </div>
          ) : (
            <p style={{ ...gaegu, fontSize: 15, color: '#B89A8E', margin: 0 }}>첫 번째 축하 메시지를 남겨주세요</p>
          )}
        </div>
      </div>
      <button type="button" onClick={() => setModal(true)} className="testo-pill mt-18" style={{ background: TESTO.paper, color: TESTO.red }}>작성하기</button>

      {modal && (
        <Modal onClose={() => setModal(false)} title={done ? null : '축하 메시지'}>
          {done ? (
            <div style={{ padding: '32px 0', textAlign: 'center' }}>
              <p style={{ ...pen(34, TESTO.red), margin: 0 }}>고마워요!</p>
              <p style={{ ...gaegu, fontSize: 13, color: TESTO.muted, marginTop: 8 }}>소중한 메시지가 전달됐어요.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="col gap-10">
              <input className="testo-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="이름" maxLength={10} required />
              <textarea className="testo-field" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="따뜻한 한마디를 남겨주세요" maxLength={200} rows={4} style={{ resize: 'none' }} required />
              <button type="submit" className="testo-pill" style={{ borderRadius: 6, width: '100%' }} disabled={submitting || !name.trim() || !message.trim()}>
                {submitting ? '전송 중...' : '메시지 남기기'}
              </button>
            </form>
          )}
        </Modal>
      )}
    </section>
  )
}
