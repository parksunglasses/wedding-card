import { useRef, useState } from 'react'
import { Theme } from '@/themes'
import { uploadGuestMedia } from '@/lib/cloudinary'

interface Props {
  theme: Theme
}

const OPEN_DATE = new Date('2026-12-19T00:00:00')

type Status = 'idle' | 'uploading' | 'done' | 'error'

export default function GuestUpload({ theme }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [progress, setProgress] = useState(0)
  const [doneCount, setDoneCount] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const isOpen = new Date() >= OPEN_DATE
  const openLabel = `${OPEN_DATE.getMonth() + 1}/${OPEN_DATE.getDate()} OPEN`

  const handleFiles = async (files: FileList) => {
    if (!files.length) return
    setStatus('uploading')
    setProgress(0)

    const total = files.length
    let done = 0

    for (const file of Array.from(files)) {
      try {
        await uploadGuestMedia(file)
        done++
        setProgress(Math.round((done / total) * 100))
      } catch {
        // 한 파일 실패해도 나머지 계속
      }
    }

    setDoneCount(done)
    setStatus(done > 0 ? 'done' : 'error')
  }

  return (
    <section className="theme-bg py-16 px-8">
      <div className="max-w-md mx-auto text-center">
        {/* 헤더 */}
        <div className="inline-block border rounded-full px-6 py-2 mb-8" style={{ borderColor: theme.colors.accent + '66' }}>
          <p className="font-heading text-xs tracking-[0.4em] theme-accent uppercase">Guest Photo</p>
        </div>

        <div
          className="rounded-2xl p-8 mb-6"
          style={{ background: theme.colors.bgAlt ?? theme.colors.bg, border: `1px dashed ${theme.colors.accent}55` }}
        >
          <p className="text-2xl mb-4">📸</p>
          <p className="font-heading text-lg theme-text mb-2">빛나는 순간들을 담아주세요!</p>
          <p className="text-sm theme-text-muted leading-relaxed mb-1">사진 한 장 한 장이</p>
          <p className="text-sm theme-text-muted leading-relaxed mb-1">결혼식의 특별한 기억이 될 거에요.</p>
          <p className="text-sm theme-text-muted leading-relaxed">즐기면서, 자연스럽게! 많이 찍어주시면 감사하겠습니다. 📷✨</p>
        </div>

        {/* 업로드 완료 */}
        {status === 'done' && (
          <div className="rounded-xl px-6 py-4 mb-4 text-sm" style={{ background: theme.colors.accent + '22', color: theme.colors.accent }}>
            {doneCount}개 업로드 완료! 소중한 순간 감사해요 💕
          </div>
        )}

        {/* 업로드 실패 */}
        {status === 'error' && (
          <div className="rounded-xl px-6 py-4 mb-4 text-sm text-red-400 bg-red-50">
            업로드에 실패했어요. 다시 시도해 주세요.
          </div>
        )}

        {/* 버튼 */}
        {isOpen ? (
          <>
            <input
              ref={inputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
            <button
              onClick={() => {
                setStatus('idle')
                inputRef.current?.click()
              }}
              disabled={status === 'uploading'}
              className="w-full py-4 rounded-xl text-sm font-medium transition-opacity disabled:opacity-60"
              style={{ background: theme.colors.accent, color: '#fff' }}
            >
              {status === 'uploading'
                ? `업로드 중... ${progress}%`
                : status === 'done'
                ? '+ 더 업로드하기'
                : '사진 및 영상 업로드'}
            </button>
          </>
        ) : (
          <button
            disabled
            className="w-full py-4 rounded-xl text-sm font-medium opacity-50 cursor-not-allowed"
            style={{ background: theme.colors.accent, color: '#fff' }}
          >
            사진 및 영상 업로드 ({openLabel})
          </button>
        )}
      </div>
    </section>
  )
}
