import { useState, useRef } from 'react'
import { uploadImage, getOptimizedUrl, isCloudinaryConfigured } from '@/lib/cloudinary'

interface Props {
  value: string
  onChange: (url: string) => void
  label?: string
  aspectRatio?: string  // '1' | '3/4' | '16/9'
}

export default function ImageUploader({ value, onChange, label, aspectRatio = '3/4' }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 파일 크기 체크 (10MB 제한)
    if (file.size > 10 * 1024 * 1024) {
      setError('10MB 이하 파일만 업로드 가능합니다')
      return
    }

    if (!isCloudinaryConfigured) {
      setError('Cloudinary 설정이 필요합니다 (.env)')
      return
    }

    setError('')
    setUploading(true)

    try {
      const result = await uploadImage(file)
      onChange(result.url)
    } catch (err) {
      setError('업로드 실패. 다시 시도해주세요')
      console.error(err)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleRemove = () => {
    onChange('')
  }

  return (
    <div>
      {label && <label className="text-xs text-dark/60 mb-2 block">{label}</label>}

      <div
        className="relative rounded-lg overflow-hidden border-2 border-dashed border-dark/20 bg-white"
        style={{ aspectRatio }}
      >
        {value ? (
          <>
            <img
              src={getOptimizedUrl(value, { width: 800 })}
              alt=""
              className="w-full h-full object-cover"
            />
            <button
              onClick={handleRemove}
              type="button"
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white text-sm"
            >
              ×
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-full h-full flex flex-col items-center justify-center gap-2 text-dark/40 hover:text-accent hover:border-accent transition-colors"
          >
            {uploading ? (
              <>
                <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                <p className="text-xs">업로드 중...</p>
              </>
            ) : (
              <>
                <div className="text-2xl">+</div>
                <p className="text-xs">사진 업로드</p>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <p className="text-xs text-red-500 mt-2">{error}</p>
      )}
    </div>
  )
}
