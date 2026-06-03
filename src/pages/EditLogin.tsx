import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SESSION_KEY = 'edit_authenticated'

export default function EditLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const correctPassword = import.meta.env.VITE_EDIT_PASSWORD || 'mywedding2026'

    if (password === correctPassword) {
      sessionStorage.setItem(SESSION_KEY, 'true')
      navigate('/edit')
    } else {
      setError('비밀번호가 일치하지 않습니다')
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-darker px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="font-script text-5xl text-accent-light mb-2">Editor</p>
          <p className="text-sm text-cream/60">청첩장 편집을 위해 인증해주세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-cream/60 mb-2 block">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              autoFocus
              className="w-full px-4 py-3 rounded-lg bg-cream/10 border border-cream/10 text-cream text-sm focus:outline-none focus:border-accent"
            />
            {error && (
              <p className="text-xs text-red-400 mt-2">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-accent text-white text-sm font-medium"
          >
            확인
          </button>
        </form>
      </div>
    </div>
  )
}

// 다른 페이지에서 인증 여부 확인용
export function isAuthenticated(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === 'true'
}
