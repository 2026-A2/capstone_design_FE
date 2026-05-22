import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import { createInterviewSession } from '../api/interviewRecordingApi';

const InterviewContext = createContext(null);

function InterviewProvider({ children }) {
  const [questionType, setQuestionType] = useState('');
  const [industry, setIndustry] = useState('');
  const [resumeText, setResumeTextState] = useState('');
  const [questionCount, setQuestionCount] = useState('');
  const [interviewSession, setInterviewSession] = useState(null);
  const [finalReport, setFinalReport] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionRecordings, setQuestionRecordings] = useState([]);
  const [questionRetryUsed, setQuestionRetryUsed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // localStorage에서 resumeText 초기화
  useEffect(() => {
    const savedResume = localStorage.getItem('resume') || '';
    setResumeTextState(savedResume);
  }, []);

  // resumeText 변경 시 localStorage에 저장
  const setResumeText = (text) => {
    setResumeTextState(text);
    localStorage.setItem('resume', text);
  };

  const requestInterviewQuestions = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_AI_BASE_URL}/api/interview/questions`,
        {
          questionType,
          industry,
          resumeText,
          questionCount: Number(questionCount),
        },
      );

      const receivedQuestions = Array.isArray(response.data?.questions)
        ? response.data.questions.map((question, index) => ({
            id: index,
            order: index + 1,
            question_text: question,
            status: 'pending',
          }))
        : [];

      setQuestions(receivedQuestions);
      setCurrentQuestionIndex(0);
      setQuestionRecordings(new Array(receivedQuestions.length).fill(null));
      setQuestionRetryUsed(new Array(receivedQuestions.length).fill(false));
      return receivedQuestions;
    } catch (requestError) {
      setError('질문 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
      throw requestError;
    } finally {
      setLoading(false);
    }
  };

  const requestInterviewSession = async (sessionQuestions = questions) => {
    setLoading(true);
    setError('');

    try {
      const session = await createInterviewSession({
        questionType,
        questions: sessionQuestions,
      });
      const sessionQuestionsResponse =
        session.questions || session.question_list || session.data?.questions;

      if (Array.isArray(sessionQuestionsResponse)) {
        setQuestions((prev) =>
          prev.map((question, index) => ({
            ...question,
            id: sessionQuestionsResponse[index]?.id ?? question.id,
            status: sessionQuestionsResponse[index]?.status ?? question.status,
          })),
        );
      }

      setInterviewSession(session);
      setFinalReport(null);
      return session;
    } catch (requestError) {
      setError('면접 세션 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
      throw requestError;
    } finally {
      setLoading(false);
    }
  };

  const resetInterview = () => {
    setQuestionType('');
    setIndustry('');
    setResumeText('');
    setQuestionCount('');
    setInterviewSession(null);
    setFinalReport(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setQuestionRecordings([]);
    setQuestionRetryUsed([]);
    setLoading(false);
    setError('');
  };

  const value = useMemo(
    () => ({
      questionType,
      industry,
      resumeText,
      questionCount,
      interviewSession,
      finalReport,
      questions,
      currentQuestionIndex,
      questionRecordings,
      questionRetryUsed,
      loading,
      error,
      setQuestionType,
      setIndustry,
      setResumeText,
      setQuestionCount,
      setInterviewSession,
      setFinalReport,
      setQuestions,
      setCurrentQuestionIndex,
      setQuestionRecordings,
      setQuestionRetryUsed,
      setError,
      requestInterviewSession,
      requestInterviewQuestions,
      resetInterview,
    }),
    [
      questionType,
      industry,
      resumeText,
      questionCount,
      interviewSession,
      finalReport,
      questions,
      currentQuestionIndex,
      questionRecordings,
      questionRetryUsed,
      loading,
      error,
    ],
  );

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
}

function useInterview() {
  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error('useInterview must be used within InterviewProvider');
  }

  return context;
}

export { InterviewProvider, useInterview };
