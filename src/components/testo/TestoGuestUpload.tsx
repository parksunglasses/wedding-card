import { useRef, useState } from 'react'
import { WeddingData } from '@/types'
import { uploadGuestMedia } from '@/lib/cloudinary'
import { TESTO, pen, gaegu, TestoHeading } from './TestoKit'

interface Props {
  data: WeddingData
}

type Status = 'idle' | 'uploading' | 'done' | 'error'

export default function TestoGuestUpload({ data }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [progress, setProgress] = useState(0)
  const [count, setCount] = useState(0)

  const openDate = new Date(`${data.date}T00:00:00`)
  const isOpen = new Date() >= openDate
  const openLabel = `${openDate.getMonth() + 1}/${openDate.getDate()} OPEN`

  const handleFiles = async (files: FileList) => {
    if (!files.length) return
    setStatus('uploading')
    setProgress(0)
    let done = 0
    for (const file of Array.from(files)) {
      try {
        await uploadGuestMedia(file)
        done += 1
        setProgress(Math.round((done / files.length) * 100))
      } catch {
        // 개별 실패는 무시하고 계속
      }
    }
    setCount((c) => c + done)
    setStatus(done > 0 ? 'done' : 'error')
  }

  return (
    <section className="testo-paper upload">
      <TestoHeading squiggleWidth={150} className="mb-20">그날의 사진 나눠주세요</TestoHeading>
      <div className="up-card" style={{ border: `2px solid ${TESTO.red}`, borderRadius: 4, background: TESTO.paperAlt, transform: 'rotate(0.6deg)' }}>
        <svg viewBox="0 0 44 44" width={40} height={40} aria-hidden="true">
          <rect x="7" y="13" width="30" height="22" rx="2" fill="none" stroke={TESTO.red} strokeWidth="1.8" />
          <circle cx="22" cy="24" r="6" fill="none" stroke={TESTO.red} strokeWidth="1.8" />
          <path d="M16 13 l3 -4 h6 l3 4" fill="none" stroke={TESTO.red} strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
        <p style={{ ...pen(26, TESTO.red), margin: '4px 0 4px' }}>여러분의 시선으로 담아주세요</p>
        <p style={{ ...gaegu, fontSize: 14, lineHeight: 1.7, color: TESTO.inkSoft, margin: 0 }}>찍어주신 사진 한 장 한 장이<br />우리에게 큰 선물이 됩니다.</p>
      </div>
      {status === 'error' && <p style={{ ...gaegu, fontSize: 13, color: TESTO.red, marginTop: 16 }}>업로드에 실패했어요. 다시 시도해 주세요.</p>}
      {count > 0 && status !== 'error' && <p style={{ ...gaegu, fontSize: 13, color: TESTO.red, marginTop: 16 }}>{count}개의 소중한 순간이 전달되었습니다.</p>}
      <input ref={inputRef} type="file" accept="image/*,video/*" multiple hidden onChange={(e) => e.target.files && handleFiles(e.target.files)} />
      <button
        type="button"
        onClick={() => { if (isOpen) inputRef.current?.click() }}
        disabled={!isOpen || status === 'uploading'}
        className="testo-pill mt-20"
        style={!isOpen ? { opacity: 0.55 } : undefined}
      >
        {!isOpen ? `사진 올리기 (${openLabel})` : status === 'uploading' ? `업로드 중... ${progress}%` : count > 0 ? '+ 더 올리기' : '사진 올리기'}
      </button>
    </section>
  )
}
