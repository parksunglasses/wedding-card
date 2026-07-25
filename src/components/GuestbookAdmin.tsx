import { useEffect, useState } from 'react'
import { GuestbookEntry } from '@/types'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

// 편집 페이지 '방명록' 탭 — 전체 목록 조회 + 개별 삭제
export default function GuestbookAdmin() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchEntries = async () => {
    setLoading(true)
    setError('')
    if (!isSupabaseConfigured) {
      const saved = localStorage.getItem('guestbook')
      setEntries(saved ? JSON.parse(saved) : [])
      setLoading(false)
      return
    }
    const { data, error: err } = await supabase
      .from('guestbooks')
      .select('*')
      .order('created_at', { ascending: false })
    if (err) setError(err.message)
    else setEntries((data || []).map((e) => ({ id: e.id, name: e.name, message: e.message, createdAt: e.created_at })))
    setLoading(false)
  }

  useEffect(() => { fetchEntries() }, [])

  const remove = async (id: string) => {
    if (!confirm('이 방명록을 삭제할까요?')) return
    if (isSupabaseConfigured) {
      const { error: err } = await supabase.from('guestbooks').delete().eq('id', id)
      if (err) { alert('삭제 실패: ' + err.message); return }
    } else {
      const updated = entries.filter((e) => e.id !== id)
      localStorage.setItem('guestbook', JSON.stringify(updated))
    }
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  const fmt = (iso?: string) => {
    if (!iso) return ''
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ''
    const p = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: '#8B7E6E' }}>총 {entries.length}개</p>
        <button
          onClick={fetchEntries}
          className="text-xs px-3 py-1.5 rounded-lg border"
          style={{ borderColor: '#D9CFBE', color: '#A68B5B' }}
        >
          새로고침
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-center py-12" style={{ color: '#8B7E6E' }}>불러오는 중...</p>
      ) : error ? (
        <p className="text-sm text-center py-12 text-red-500">불러오기 실패: {error}</p>
      ) : entries.length === 0 ? (
        <p className="text-sm text-center py-12" style={{ color: '#8B7E6E' }}>아직 등록된 방명록이 없어요.</p>
      ) : (
        entries.map((e) => (
          <div key={e.id} className="p-3 bg-white rounded-lg border" style={{ borderColor: '#D9CFBE' }}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium" style={{ color: '#2A2520' }}>{e.name}</p>
                {e.createdAt && <p className="text-[11px] mt-0.5" style={{ color: '#B0A491' }}>{fmt(e.createdAt)}</p>}
              </div>
              <button onClick={() => remove(e.id)} className="text-xs text-red-500 shrink-0">삭제</button>
            </div>
            <p className="text-sm mt-2 whitespace-pre-line leading-relaxed" style={{ color: '#4A4238' }}>{e.message}</p>
          </div>
        ))
      )}
    </div>
  )
}
