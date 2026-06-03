// 카카오 SDK 로더 (지도 + 공유)
// 지도 SDK와 JavaScript(공유) SDK 모두 같은 JavaScript 키를 사용합니다.

const KAKAO_KEY = import.meta.env.VITE_KAKAO_JS_KEY || ''

export const isKakaoConfigured = Boolean(KAKAO_KEY && KAKAO_KEY !== 'your-kakao-key')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyWindow = any

// 지도 SDK
let mapsPromise: Promise<AnyWindow> | null = null
export function loadKakaoMaps(): Promise<AnyWindow> {
  if (!isKakaoConfigured) return Promise.reject(new Error('Kakao 키 없음'))
  if (mapsPromise) return mapsPromise

  mapsPromise = new Promise((resolve, reject) => {
    const w = window as AnyWindow
    if (w.kakao?.maps) {
      resolve(w.kakao)
      return
    }
    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&autoload=false&libraries=services`
    script.async = true
    script.onload = () => w.kakao.maps.load(() => resolve(w.kakao))
    script.onerror = reject
    document.head.appendChild(script)
  })
  return mapsPromise
}

// 공유(JavaScript) SDK
let sharePromise: Promise<AnyWindow> | null = null
export function loadKakaoShare(): Promise<AnyWindow> {
  if (!isKakaoConfigured) return Promise.reject(new Error('Kakao 키 없음'))
  if (sharePromise) return sharePromise

  sharePromise = new Promise((resolve, reject) => {
    const w = window as AnyWindow
    const finish = () => {
      if (!w.Kakao.isInitialized()) w.Kakao.init(KAKAO_KEY)
      resolve(w.Kakao)
    }
    if (w.Kakao) {
      finish()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js'
    script.crossOrigin = 'anonymous'
    script.onload = finish
    script.onerror = reject
    document.head.appendChild(script)
  })
  return sharePromise
}
