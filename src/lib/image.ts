// 업로드 전 클라이언트에서 사진을 적당히 줄여 Cloudinary 한도(이미지 10MB) 안으로 맞춘다.
// 폰 원본이 15~20MB여도 리사이즈/압축해서 올릴 수 있게 한다.

interface CompressOptions {
  /** 가장 긴 변 최대 픽셀 (기본 2400px) */
  maxDim?: number
  /** 목표 최대 용량 바이트 (기본 9.5MB) */
  maxBytes?: number
  /** JPEG 품질 (기본 0.85) */
  quality?: number
}

export async function compressImage(file: File, opts: CompressOptions = {}): Promise<File> {
  const maxDim = opts.maxDim ?? 2400
  const maxBytes = opts.maxBytes ?? 9.5 * 1024 * 1024
  const startQuality = opts.quality ?? 0.85

  // 이미지가 아니거나(동영상 등) GIF(애니메이션)면 그대로 둔다.
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file

  let bitmap: ImageBitmap
  try {
    // imageOrientation: 폰 사진의 EXIF 회전을 반영해 눕지 않게 한다.
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    try {
      bitmap = await createImageBitmap(file)
    } catch {
      // HEIC 등 디코딩 실패 시 원본 그대로 (호출부에서 용량 체크로 방어)
      return file
    }
  }

  const { width, height } = bitmap
  const scale = Math.min(1, maxDim / Math.max(width, height))

  // 이미 충분히 작으면(치수·용량 모두) 변환하지 않고 원본 사용
  if (scale >= 1 && file.size <= maxBytes) {
    bitmap.close?.()
    return file
  }

  const w = Math.max(1, Math.round(width * scale))
  const h = Math.max(1, Math.round(height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close?.()
    return file
  }
  ctx.drawImage(bitmap, 0, 0, w, h)
  bitmap.close?.()

  const toBlob = (q: number) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', q))

  let quality = startQuality
  let blob = await toBlob(quality)
  while (blob && blob.size > maxBytes && quality > 0.4) {
    quality -= 0.1
    blob = await toBlob(quality)
  }
  if (!blob) return file

  const name = file.name.replace(/\.[^.]+$/, '') + '.jpg'
  return new File([blob], name, { type: 'image/jpeg', lastModified: Date.now() })
}
