import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Invitation from '@/pages/Invitation'

const EditLogin = lazy(() => import('@/pages/EditLogin'))
const Edit = lazy(() => import('@/pages/Edit'))

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-screen theme-bg" />}>
      <Routes>
        <Route path="/" element={<Invitation />} />
        <Route path="/edit/login" element={<EditLogin />} />
        <Route path="/edit" element={<Edit />} />
      </Routes>
    </Suspense>
  )
}
