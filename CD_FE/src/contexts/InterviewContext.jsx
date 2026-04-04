import { createContext, useContext, useMemo, useState } from 'react'

const InterviewContext = createContext(null)

function InterviewProvider({ children }) {
  const [questionType, setQuestionType] = useState('')
  const [industry, setIndustry] = useState('')
  const [questionCount, setQuestionCount] = useState('')

  const resetInterview = () => {
    setQuestionType('')
    setIndustry('')
    setQuestionCount('')
  }

  const value = useMemo(
    () => ({
      questionType,
      industry,
      questionCount,
      setQuestionType,
      setIndustry,
      setQuestionCount,
      resetInterview,
    }),
    [questionType, industry, questionCount],
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
