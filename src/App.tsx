import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Invitation from '@/pages/Invitation'

const EditLogin = lazy(() => import('@/pages/EditLogin'))
const Edit = lazy(() => import('@/pages/Edit'))

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-screen theme-bg" />}>
      <Routes>
        <Route path="/" element={<Invitation />} />
        {/* 테마별 전용 주소 — 공유할 때 이 주소를 그대로 쓰면 해당 테마로 열린다 */}
        <Route path="/elegant" element={<Invitation forcedTheme="elegant" />} />
        <Route path="/testo" element={<Invitation forcedTheme="testo" />} />
        <Route path="/edit/login" element={<EditLogin />} />
        <Route path="/edit" element={<Edit />} />
        {/* 오타·잘린 링크로 들어와도 빈 화면 대신 청첩장을 보여준다 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
