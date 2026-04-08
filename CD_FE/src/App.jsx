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
import Preparation from './pages/interview/Preparation.jsx'
import RecordingReview from './pages/interview/RecordingReview.jsx'
import InterviewComplete from './pages/interview/InterviewComplete.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/main" element={<Main />} />
      <Route path="/interview" element={<Interview />} />
      <Route path="/interview/setup" element={<SetupCheck />} />
      <Route path="/interview/preparation" element={<Preparation />} />
      <Route path="/interview/resume" element={<Resume />} />
      <Route path="/industry" element={<Industry />} />
      <Route path="/industry/custom" element={<IndustryCustom />} />
      <Route path="/interview/question-count" element={<QuestionCount />} />
      <Route path="/interview/questions" element={<QuestionsResult />} />
      <Route path="/interview/review" element={<RecordingReview />} />
      <Route path="/interview/complete" element={<InterviewComplete />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
