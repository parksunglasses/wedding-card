import { useEffect, useState } from 'react'
import { GuestbookEntry } from '@/types'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

// 편집 페이지 '방명록' 탭 — 전체 목록 조회 + 개별 삭제
export default function GuestbookAdmin() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // confirm()/alert()는 미리보기 패널·일부 인앱 브라우저에서 차단되므로
  // 브라우저 대화상자 대신 화면 안에서 확인받고 오류도 화면에 띄운다.
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [actionError, setActionError] = useState('')

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
    setActionError('')
    if (isSupabaseConfigured) {
      // .select()를 붙여야 '실제로 지워진 행'이 돌아온다.
      // 권한(RLS)에 막히면 에러 없이 0건이 오므로 그 경우를 따로 잡는다.
      const { data, error: err } = await supabase.from('guestbooks').delete().eq('id', id).select()
      if (err) { setActionError('삭제 실패: ' + err.message); return }
      if (!data || data.length === 0) {
        setActionError('삭제되지 않았습니다. DB 삭제 권한(RLS) 설정을 확인해 주세요.')
        return
      }
    } else {
      const updated = entries.filter((e) => e.id !== id)
      localStorage.setItem('guestbook', JSON.stringify(updated))
    }
    setConfirmId(null)
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
          type="button"
          onClick={fetchEntries}
          className="text-xs px-3 py-1.5 rounded-lg border"
          style={{ borderColor: '#D9CFBE', color: '#A68B5B' }}
        >
          새로고침
        </button>
      </div>

      {actionError && (
        <p className="text-xs rounded-lg px-3 py-2 bg-red-50 text-red-600 border border-red-200">{actionError}</p>
      )}

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
              {confirmId === e.id ? (
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => remove(e.id)}
                    className="text-xs px-2 py-1 rounded-md bg-red-500 text-white"
                  >
                    확인
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmId(null)}
                    className="text-xs px-2 py-1 rounded-md border"
                    style={{ borderColor: '#D9CFBE', color: '#8B7E6E' }}
                  >
                    취소
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => { setActionError(''); setConfirmId(e.id) }}
                  className="text-xs text-red-500 shrink-0"
                >
                  삭제
                </button>
              )}
            </div>
            <p className="text-sm mt-2 whitespace-pre-line leading-relaxed" style={{ color: '#4A4238' }}>{e.message}</p>
          </div>
        ))
      )}
    </div>
  )
}
