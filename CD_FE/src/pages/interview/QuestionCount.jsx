import { useInterview } from '../../contexts/InterviewContext.jsx'
import { useNavigate } from 'react-router-dom'

function QuestionCount() {
  const navigate = useNavigate()
  const {
    questionType,
    industry,
    resumeText,
    questionCount,
    setQuestionCount,
    loading,
    error,
    requestInterviewQuestions,
  } = useInterview()

  const isValid = Number(questionCount) >= 2 && Number(questionCount) <= 5
  const hasValidBasis =
    questionType === 'industry'
      ? Boolean(industry)
      : questionType === 'resume'
        ? Boolean(resumeText.trim())
        : false

  const handleNext = async () => {
    if (!isValid || !hasValidBasis) {
      return
    }

    try {
      await requestInterviewQuestions()
      navigate('/interview/setup')
    } catch {
      // Error message is managed by context state.
    }
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-[#efefef] text-center px-6">
      <h1 className="text-2xl font-bold">질문 개수를 선택해주세요</h1>

      {questionType === 'industry' && (
        <p className="text-gray-700">선택한 산업: {industry || '미선택'}</p>
      )}

      {questionType === 'resume' && (
        <p className="text-gray-700">입력한 자소서 길이: {resumeText.trim().length}자</p>
      )}

      <p className="text-gray-700">질문 개수는 2개부터 5개까지 입력할 수 있습니다.</p>

      <input
        type="number"
        min="2"
        max="5"
        value={questionCount}
        onChange={(e) => setQuestionCount(e.target.value)}
        placeholder="2~5"
        className="w-full max-w-xs px-4 py-2 rounded border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {!isValid && questionCount !== '' && (
        <p className="text-red-600">질문 개수는 2~5 사이로 입력해주세요.</p>
      )}

      {!hasValidBasis && questionType === 'industry' && (
        <p className="text-red-600">먼저 산업을 선택해주세요.</p>
      )}

      {!hasValidBasis && questionType === 'resume' && (
        <p className="text-red-600">먼저 자소서를 입력해주세요.</p>
      )}

      {!questionType && <p className="text-red-600">먼저 질문 유형을 선택해주세요.</p>}

      {error && <p className="text-red-600">{error}</p>}

      <button
        type="button"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={!isValid || !hasValidBasis || loading}
        onClick={handleNext}
      >
        {loading ? '질문 생성 중...' : '다음'}
      </button>
    </div>
  )
}

export default QuestionCount
