import { useRef, useState } from 'react'
import { Theme } from '@/themes'
import { uploadGuestMedia } from '@/lib/cloudinary'
import SectionHeading from '@/components/ui/SectionHeading'
import { UploadIcon } from '@/components/ui/Icons'

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
    <section className="invitation-section" style={{ background: theme.colors.bgDark, color: theme.colors.bg }}>
      <SectionHeading
        label="Guest Photo"
        title="우리의 시선"
        description="빛나는 순간들을 사진과 영상으로 남겨주세요."
        inverse
      />

      {status === 'done' && (
        <p className="mb-4 text-center text-[13px]" style={{ color: theme.colors.accentLight }}>
          {doneCount}개의 소중한 순간이 전달되었습니다.
        </p>
      )}
      {status === 'error' && (
        <p className="mb-4 text-center text-[13px] text-red-200">
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
            className="editorial-button editorial-button--light w-full"
          >
            <UploadIcon />
            {status === 'uploading'
              ? `업로드 중 · ${progress}%`
              : status === 'done'
                ? '사진 및 영상 더 올리기'
                : '사진 및 영상 업로드'}
          </button>
        </>
      ) : (
        <button type="button" disabled className="editorial-button editorial-button--light w-full">
          <UploadIcon />
          사진 및 영상 업로드 · {openLabel}
        </button>
      )}
    </section>
  )
}
