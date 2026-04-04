import { useNavigate } from 'react-router-dom'
import { useInterview } from '../../contexts/InterviewContext.jsx'

function Industry() {
  const navigate = useNavigate()
  const { setIndustry, setQuestionType } = useInterview()

  const handleIndustrySelect = (industry) => {
    setQuestionType('industry')
    setIndustry(industry)
    navigate('/interview/question-count')
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-[#efefef] text-center px-6">
      <h1 className="text-2xl font-bold">원하는 산업을 선택해주세요.</h1>

      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => handleIndustrySelect('IT')}
        >
          IT
        </button>
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => handleIndustrySelect('금융')}
        >
          금융
        </button>
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => handleIndustrySelect('마케팅')}
        >
          마케팅
        </button>
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => handleIndustrySelect('무역')}
        >
          무역
        </button>
      </div>

      <button
        type="button"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-gray-700"
        onClick={() => navigate('/industry/custom')}
      >
        원하는 산업이 없나요?
      </button>
    </div>
  )
}

export default Industry
