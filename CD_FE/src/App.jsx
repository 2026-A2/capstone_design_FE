import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Main from './pages/Main.jsx'
import Interview from './pages/Interview.jsx'
import Industry from './pages/Industry.jsx'
import IndustryCustom from './pages/IndustryCustom.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/main" element={<Main />} />
      <Route path="/interview" element={<Interview />} />
      <Route path="/industry" element={<Industry />} />
      <Route path="/industry/custom" element={<IndustryCustom />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
