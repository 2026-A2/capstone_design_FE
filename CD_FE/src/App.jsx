import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Main from './pages/Main.jsx'
import Interview from './pages/interview/Interview.jsx'
import Resume from './pages/interview/Resume.jsx'
import Industry from './pages/interview/Industry.jsx'
import IndustryCustom from './pages/interview/IndustryCustom.jsx'
import QuestionCount from './pages/interview/QuestionCount.jsx'
import QuestionsResult from './pages/interview/QuestionsResult.jsx'
import SetupCheck from './pages/interview/SetupCheck.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/main" element={<Main />} />
      <Route path="/interview" element={<Interview />} />
      <Route path="/interview/setup" element={<SetupCheck />} />
      <Route path="/interview/resume" element={<Resume />} />
      <Route path="/industry" element={<Industry />} />
      <Route path="/industry/custom" element={<IndustryCustom />} />
      <Route path="/interview/question-count" element={<QuestionCount />} />
      <Route path="/interview/questions" element={<QuestionsResult />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
