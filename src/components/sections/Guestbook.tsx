import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GuestbookEntry } from '@/types'
import { Theme } from '@/themes'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

interface Props {
  theme: Theme
}

export default function Guestbook({ theme }: Props) {
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    if (!isSupabaseConfigured) {
      const saved = localStorage.getItem('guestbook')
      if (saved) setEntries(JSON.parse(saved))
      return
    }

    const { data, error } = await supabase
      .from('guestbooks')
      .select('*')
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setEntries(data.map(d => ({
        id: d.id,
        name: d.name,
        message: d.message,
        createdAt: d.created_at,
      })))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return

    setSubmitting(true)

    const newEntry: GuestbookEntry = {
      id: Date.now().toString(),
      name: name.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    }

    if (isSupabaseConfigured) {
      const { error } = await supabase.from('guestbooks').insert({
        name: newEntry.name,
        message: newEntry.message,
      })
      if (!error) await fetchEntries()
    } else {
      const updated = [newEntry, ...entries]
      setEntries(updated)
      localStorage.setItem('guestbook', JSON.stringify(updated))
    }

    setName('')
    setMessage('')
    setSubmitting(false)
  }

  return (
    <section className="theme-bg py-16 px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-md mx-auto"
      >
        <div className="text-center mb-8">
          <p className="font-heading text-xs tracking-[0.4em] theme-accent mb-2 uppercase">
            Guestbook
          </p>
          <h2 className="font-heading text-2xl theme-text">방명록</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 mb-8">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름"
            maxLength={10}
            className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none"
            style={{
              background: '#FFFFFF',
              border: `1px solid ${theme.colors.border}`,
              color: theme.colors.text,
            }}
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="축하 메시지를 남겨주세요"
            maxLength={200}
            rows={3}
            className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none resize-none"
            style={{
              background: '#FFFFFF',
              border: `1px solid ${theme.colors.border}`,
              color: theme.colors.text,
            }}
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-lg text-white text-sm font-medium disabled:opacity-50"
            style={{ background: theme.colors.accent }}
          >
            {submitting ? '작성 중...' : '메시지 남기기'}
          </button>
        </form>

        <div className="space-y-3">
          {entries.length === 0 ? (
            <p className="text-center text-sm py-8" style={{ color: theme.colors.text + '80' }}>
              아직 작성된 메시지가 없어요
            </p>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="rounded-lg p-4"
                style={{
                  background: '#FFFFFF',
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-sm theme-text">{entry.name}</p>
                  <p className="text-xs" style={{ color: theme.colors.text + '66' }}>
                    {new Date(entry.createdAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: theme.colors.text + 'CC' }}>
                  {entry.message}
                </p>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </section>
  )
}
