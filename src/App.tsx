import { Routes, Route } from 'react-router-dom'
import Invitation from '@/pages/Invitation'
import EditLogin from '@/pages/EditLogin'
import Edit from '@/pages/Edit'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Invitation />} />
      <Route path="/edit/login" element={<EditLogin />} />
      <Route path="/edit" element={<Edit />} />
    </Routes>
  )
}
