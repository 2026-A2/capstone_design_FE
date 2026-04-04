import { useLocation } from 'react-router-dom'
import { useState } from 'react'

function QuestionCount() {
  const location = useLocation()
  const [questionCount, setQuestionCount] = useState('')
  const industry = location.state?.industry ?? '미선택'

  const isValid = Number(questionCount) >= 2 && Number(questionCount) <= 5

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-[#efefef] text-center px-6">
      <h1 className="text-2xl font-bold">질문 개수를 선택해주세요</h1>
      <p className="text-gray-700">선택한 산업: {industry}</p>
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

      <button
        type="button"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={!isValid}
      >
        다음
      </button>
    </div>
  )
}

export default QuestionCount
