// Cloudinary 사진 업로드

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || ''
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || ''

export const isCloudinaryConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET)

export interface UploadResult {
  url: string
  publicId: string
  width: number
  height: number
}

// 사진 업로드
export async function uploadImage(file: File): Promise<UploadResult> {
  if (!isCloudinaryConfigured) {
    throw new Error('Cloudinary가 설정되지 않았습니다. .env를 확인하세요')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!response.ok) {
    throw new Error('업로드 실패')
  }

  const data = await response.json()
  return {
    url: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
  }
}

// 사진/영상 통합 업로드 (하객용) — auto/upload로 타입 자동 감지
export async function uploadGuestMedia(file: File): Promise<string> {
  if (!isCloudinaryConfigured) {
    throw new Error('Cloudinary가 설정되지 않았습니다.')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', 'wedding_guests')

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
    { method: 'POST', body: formData }
  )

  if (!response.ok) throw new Error('업로드 실패')
  const data = await response.json()
  return data.secure_url as string
}

// 오디오(BGM) 업로드 — Cloudinary는 오디오를 video 리소스로 처리
export async function uploadAudio(file: File): Promise<string> {
  if (!isCloudinaryConfigured) {
    throw new Error('Cloudinary가 설정되지 않았습니다. .env를 확인하세요')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
    { method: 'POST', body: formData }
  )

  if (!response.ok) {
    throw new Error('업로드 실패 (업로드 프리셋이 오디오를 허용하지 않을 수 있습니다)')
  }

  const data = await response.json()
  return data.secure_url as string
}

// URL에 크기 옵션 추가
// 예: getOptimizedUrl(url, { width: 800 })
//     → https://res.cloudinary.com/.../w_800,q_auto,f_auto/photo.jpg
export interface ImageOptions {
  width?: number
  height?: number
  quality?: 'auto' | 'auto:best' | 'auto:good' | number
  format?: 'auto' | 'webp' | 'jpg'
  dpr?: boolean
}

export function getOptimizedUrl(url: string, options: ImageOptions = {}): string {
  if (!url || !url.includes('cloudinary.com')) return url

  const {
    width,
    height,
    quality = 'auto:good',
    format = 'auto',
    dpr = true,
  } = options

  const transformations: string[] = []
  if (width) transformations.push(`w_${width}`)
  if (height) transformations.push(`h_${height}`)
  if (dpr) transformations.push('dpr_auto')
  transformations.push(`q_${quality}`)
  transformations.push(`f_${format}`)

  // URL에서 /upload/ 다음에 transformation 삽입
  return url.replace('/upload/', `/upload/${transformations.join(',')}/`)
}
