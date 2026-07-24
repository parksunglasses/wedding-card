import { useRef, useState } from 'react'
import { WeddingData } from '@/types'
import { uploadGuestMedia } from '@/lib/cloudinary'
import { TESTO, TestoHeading } from './TestoKit'

interface Props {
  data: WeddingData
}

type Status = 'idle' | 'uploading' | 'done' | 'error'

export default function TestoGuestUpload({ data }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [progress, setProgress] = useState(0)
  const [doneCount, setDoneCount] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

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
        // 한 파일의 실패가 나머지 업로드를 막지 않도록 계속 진행한다.
      }
    }

    setDoneCount(done)
    setStatus(done > 0 ? 'done' : 'error')
  }

  return (
    <section className="testo-paper px-10 pb-[52px] pt-5 text-center">
      <TestoHeading squiggleWidth={150} className="mb-5">그날의 사진 나눠주세요</TestoHeading>

      <div
        className="mx-auto max-w-[340px] px-5 py-6"
        style={{ border: `2px solid ${TESTO.red}`, borderRadius: 4, background: TESTO.paperAlt, transform: 'rotate(0.6deg)' }}
      >
        <svg viewBox="0 0 44 44" width={40} height={40} className="mb-0.5" aria-hidden="true">
          <rect x="7" y="13" width="30" height="22" rx="2" fill="none" stroke={TESTO.red} strokeWidth={1.8} />
          <circle cx="22" cy="24" r="6" fill="none" stroke={TESTO.red} strokeWidth={1.8} />
          <path d="M16 13 l3 -4 h6 l3 4" fill="none" stroke={TESTO.red} strokeWidth={1.8} strokeLinejoin="round" />
        </svg>
        <p className="m-0 mb-1" style={{ fontFamily: '"Nanum Brush Script", cursive', fontSize: 26, color: TESTO.red }}>
          여러분의 시선으로 담아주세요
        </p>
        <p className="m-0 text-[14px] leading-[1.7]" style={{ fontFamily: 'Gaegu, sans-serif', color: TESTO.inkSoft }}>
          찍어주신 사진 한 장 한 장이
          <br />
          우리에게 큰 선물이 됩니다.
        </p>
      </div>

      {status === 'done' && (
        <p className="mt-4 text-[13px]" style={{ fontFamily: 'Gaegu, sans-serif', color: TESTO.red }}>
          {doneCount}개의 소중한 순간이 전달되었습니다.
        </p>
      )}
      {status === 'error' && (
        <p className="mt-4 text-[13px] text-red-700" style={{ fontFamily: 'Gaegu, sans-serif' }}>
          업로드에 실패했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      )}

      {isOpen ? (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={(event) => event.target.files && handleFiles(event.target.files)}
          />
          <button
            type="button"
            onClick={() => {
              setStatus('idle')
              inputRef.current?.click()
            }}
            disabled={status === 'uploading'}
            className="testo-pill mt-5"
          >
            {status === 'uploading'
              ? `업로드 중 · ${progress}%`
              : status === 'done'
                ? '+ 더 올리기'
                : '사진 올리기'}
          </button>
        </>
      ) : (
        <button type="button" disabled className="testo-pill mt-5">
          사진 올리기 · {openLabel}
        </button>
      )}
    </section>
  )
}
