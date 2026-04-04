import { createContext, useContext, useMemo, useState } from 'react'
import axios from 'axios'

const InterviewContext = createContext(null)

function InterviewProvider({ children }) {
  const [questionType, setQuestionType] = useState('')
  const [industry, setIndustry] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [questionCount, setQuestionCount] = useState('')
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const requestInterviewQuestions = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await axios.post(`${import.meta.env.VITE_AI_BASE_URL}/api/interview/questions`, {
        questionType,
        industry,
        resumeText,
        questionCount: Number(questionCount),
      })

      const receivedQuestions = Array.isArray(response.data?.questions) ? response.data.questions : []
      setQuestions(receivedQuestions)
      return receivedQuestions
    } catch (requestError) {
      setError('질문 생성에 실패했습니다. 잠시 후 다시 시도해주세요.')
      throw requestError
    } finally {
      setLoading(false)
    }
  }

  const resetInterview = () => {
    setQuestionType('')
    setIndustry('')
    setResumeText('')
    setQuestionCount('')
    setQuestions([])
    setLoading(false)
    setError('')
  }

  const value = useMemo(
    () => ({
      questionType,
      industry,
      resumeText,
      questionCount,
      questions,
      loading,
      error,
      setQuestionType,
      setIndustry,
      setResumeText,
      setQuestionCount,
      setQuestions,
      setError,
      requestInterviewQuestions,
      resetInterview,
    }),
    [questionType, industry, resumeText, questionCount, questions, loading, error],
  )

  return <InterviewContext.Provider value={value}>{children}</InterviewContext.Provider>
}

function useInterview() {
  const context = useContext(InterviewContext)

  if (!context) {
    throw new Error('useInterview must be used within InterviewProvider')
  }

  return context
}

export { InterviewProvider, useInterview }
