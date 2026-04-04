import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function IndustryCustom() {
  const navigate = useNavigate()
  const [industry, setIndustry] = useState('')

  const handleNext = () => {
    if (!industry.trim()) {
      return
    }
    navigate('/interview/question-count', { state: { industry: industry.trim() } })
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-[#efefef] text-center px-6">
      <h1 className="text-2xl font-bold">원하는 산업이 없나요?</h1>
      <p className="text-gray-700">희망하는 산업을 직접 입력해주세요.</p>
      <input
        type="text"
        value={industry}
        onChange={(e) => setIndustry(e.target.value)}
        placeholder="예: 반도체, 바이오, 교육"
        className="w-full max-w-md px-4 py-2 rounded border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="button"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        onClick={handleNext}
        disabled={!industry.trim()}
      >
        다음
      </button>
    </div>
  )
}

export default IndustryCustom
