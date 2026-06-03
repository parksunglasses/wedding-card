import { useState, useRef } from 'react'
import { uploadImage, getOptimizedUrl, isCloudinaryConfigured } from '@/lib/cloudinary'

interface Props {
  value: string[]
  onChange: (urls: string[]) => void
  label?: string
  maxCount?: number
}

export default function MultiImageUploader({
  value,
  onChange,
  label,
  maxCount = 30,
}: Props) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    if (value.length + files.length > maxCount) {
      setError(`최대 ${maxCount}장까지 업로드 가능합니다`)
      return
    }

    if (!isCloudinaryConfigured) {
      setError('Cloudinary 설정이 필요합니다 (.env)')
      return
    }

    setError('')
    setUploading(true)
    setProgress(0)

    const uploadedUrls: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (file.size > 10 * 1024 * 1024) {
          setError(`${file.name}: 10MB 초과로 제외됨`)
          continue
        }

        const result = await uploadImage(file)
        uploadedUrls.push(result.url)
        setProgress(Math.round(((i + 1) / files.length) * 100))
      }

      onChange([...value, ...uploadedUrls])
    } catch (err) {
      setError('업로드 중 오류가 발생했습니다')
      console.error(err)
    } finally {
      setUploading(false)
      setProgress(0)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleRemove = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx))
  }

  const handleMove = (idx: number, direction: 'up' | 'down') => {
    const newPhotos = [...value]
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1
    if (targetIdx < 0 || targetIdx >= newPhotos.length) return

    ;[newPhotos[idx], newPhotos[targetIdx]] = [newPhotos[targetIdx], newPhotos[idx]]
    onChange(newPhotos)
  }

  return (
    <div>
      {label && (
        <label className="text-xs text-dark/60 mb-2 block flex justify-between">
          <span>{label}</span>
          <span>{value.length} / {maxCount}</span>
        </label>
      )}

      <div className="grid grid-cols-3 gap-2">
        {value.map((url, idx) => (
          <div
            key={`${url}-${idx}`}
            className="relative aspect-square rounded-lg overflow-hidden border border-dark/10 bg-white group"
          >
            <img
              src={getOptimizedUrl(url, { width: 300 })}
              alt=""
              className="w-full h-full object-cover"
            />

            {/* 삭제 버튼 */}
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>

            {/* 순서 변경 */}
            <div className="absolute bottom-1 left-1 right-1 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => handleMove(idx, 'up')}
                disabled={idx === 0}
                className="w-6 h-6 rounded-full bg-black/60 text-white text-xs disabled:opacity-30"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => handleMove(idx, 'down')}
                disabled={idx === value.length - 1}
                className="w-6 h-6 rounded-full bg-black/60 text-white text-xs disabled:opacity-30"
              >
                →
              </button>
            </div>

            {/* 번호 */}
            <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-black/60 text-white text-[10px] flex items-center justify-center">
              {idx + 1}
            </div>
          </div>
        ))}

        {/* 추가 버튼 */}
        {value.length < maxCount && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-lg border-2 border-dashed border-dark/20 bg-white flex flex-col items-center justify-center text-dark/40 hover:text-accent hover:border-accent transition-colors"
          >
            {uploading ? (
              <>
                <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin mb-1" />
                <p className="text-[10px]">{progress}%</p>
              </>
            ) : (
              <>
                <div className="text-2xl">+</div>
                <p className="text-[10px]">추가</p>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <p className="text-xs text-red-500 mt-2">{error}</p>
      )}
    </div>
  )
}
