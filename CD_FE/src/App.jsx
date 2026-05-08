import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Main from './pages/Main.jsx';
import SettingsPage from './pages/settings/SettingsPage.jsx';
import UserInfoPage from './pages/settings/UserInfoPage.jsx';
import DeleteAccountPage from './pages/settings/DeleteAccountPage.jsx';
import ResumeManagePage from './pages/settings/ResumeManagePage.jsx';
import AnalysisGuidePage from './pages/settings/AnalysisGuidePage.jsx';

import Interview from './pages/interview/Interview.jsx';
import Resume from './pages/interview/Resume.jsx';
import Industry from './pages/interview/Industry.jsx';
import IndustryCustom from './pages/interview/IndustryCustom.jsx';
import QuestionCount from './pages/interview/QuestionCount.jsx';
import QuestionsResult from './pages/interview/QuestionsResult.jsx';
import SetupCheck from './pages/interview/SetupCheck.jsx';
import Preparation from './pages/interview/Preparation.jsx';
import RecordingReview from './pages/interview/RecordingReview.jsx';
import InterviewComplete from './pages/interview/InterviewComplete.jsx';
import ReportMainPage from './pages/report/ReportMainPage.jsx';
import IndividualReportPage from './pages/report/IndividualReportPage';
import IndividualReportDetailPage from './pages/report/IndividualReportDetailPage';
import IndividualReportFullPage from './pages/report/IndividualReportFullPage';
import TotalReportMenuPage from './pages/report/components/TotalReportMenuPage';
import TotalGazeReportPage from './pages/report/components/TotalGazeReportPage';
import TotalSpeechRatePage from './pages/report/components/TotalSpeechRatePage';
import TotalFillerPage from './pages/report/components/TotalFillerPage';
import TotalSilencePage from './pages/report/components/TotalSilencePage';
import TotalVoiceVolumePage from './pages/report/components/TotalVoiceVolumePage';
import SmileRatePage from './pages/report/components/SmileRatePage';
import TotalBlinkPage from './pages/report/components/TotalBlinkPage.jsx';
import TotalEndingBlurPage from './pages/report/components/TotalEndingBlurPage.jsx';
import TotalNodPage from './pages/report/components/TotalNodPage.jsx';
import TotalShoulderTiltPage from './pages/report/components/TotalShoulderTiltPage.jsx';
import TotalBodyShakePage from './pages/report/components/TotalBodyShakePage.jsx';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/main" element={<Main />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/settings/user-info" element={<UserInfoPage />} />
      <Route path="/settings/delete-account" element={<DeleteAccountPage />} />
      <Route path="/settings/resume" element={<ResumeManagePage />} />
      <Route path="/settings/analysis-guide" element={<AnalysisGuidePage />} />

      <Route path="/report" element={<ReportMainPage />} />
      <Route path="/report/individual" element={<IndividualReportPage />} />
      <Route
        path="/report/individual/detail/full/:id"
        element={<IndividualReportFullPage />}
      />
      <Route
        path="/report/individual/detail/:id"
        element={<IndividualReportDetailPage />}
      />
      <Route path="/report/total" element={<TotalReportMenuPage />} />
      <Route
        path="/report/total/eye-contact"
        element={<TotalGazeReportPage />}
      />
      <Route
        path="/report/total/speech-rate"
        element={<TotalSpeechRatePage />}
      />
      <Route path="/report/total/gaze" element={<TotalGazeReportPage />} />
      <Route path="/report/total/filler" element={<TotalFillerPage />} />
      <Route path="/report/total/silence" element={<TotalSilencePage />} />
      <Route
        path="/report/total/voice-volume"
        element={<TotalVoiceVolumePage />}
      />
      <Route path="/report/total/smile-rate" element={<SmileRatePage />} />
      <Route path="/report/total/blink" element={<TotalBlinkPage />} />
      <Route
        path="/report/total/ending-blur"
        element={<TotalEndingBlurPage />}
      />
      <Route path="/report/total/nod" element={<TotalNodPage />} />
      <Route
        path="/report/total/shoulder-tilt"
        element={<TotalShoulderTiltPage />}
      />
      <Route path="/report/total/body-shake" element={<TotalBodyShakePage />} />
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
  );
}

export default App;
