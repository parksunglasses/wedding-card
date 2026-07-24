import { useRef, useState } from 'react'
import { WeddingData } from '@/types'
import { uploadGuestMedia } from '@/lib/cloudinary'
import { DOODLE, DoodleHeading, pen } from './DoodleKit'

interface Props {
  data: WeddingData
}

type Status = 'idle' | 'uploading' | 'done' | 'error'

export default function DoodleGuestUpload({ data }: Props) {
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
    <section className="px-10 py-14 text-center">
      <DoodleHeading squiggleWidth={100} className="mb-5">그날의 사진, 나눠주세요!</DoodleHeading>

      <div
        className="mx-auto max-w-[340px] px-5 py-6"
        style={{ border: `2px dashed ${DOODLE.tan}`, borderRadius: 16, background: DOODLE.cream }}
      >
        <p className="m-0 mb-1.5 text-[26px]">📸</p>
        <p className="m-0 mb-1.5" style={pen(26, DOODLE.red)}>빛나는 순간들을 담아주세요!</p>
        <p className="m-0 text-[13px] leading-[1.8]" style={{ color: DOODLE.inkSoft }}>
          여러분이 찍어주신 사진 한 장 한 장이
          <br />
          우리 결혼식의 특별한 기억이 돼요.
        </p>
      </div>

      {status === 'done' && (
        <p className="mt-4 text-[13px]" style={{ color: DOODLE.red }}>
          {doneCount}개의 소중한 순간이 전달되었습니다.
        </p>
      )}
      {status === 'error' && (
        <p className="mt-4 text-[13px] text-red-700">
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
            className="doodle-pill mt-5"
          >
            {status === 'uploading'
              ? `업로드 중 · ${progress}%`
              : status === 'done'
                ? '+ 더 올리기'
                : '사진 올리기'}
          </button>
        </>
      ) : (
        <button type="button" disabled className="doodle-pill mt-5">
          사진 올리기 · {openLabel}
        </button>
      )}
    </section>
  )
}
