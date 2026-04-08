import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInterview } from '../../contexts/InterviewContext.jsx'

const PREPARATION_SECONDS = 30

function Preparation() {
  const navigate = useNavigate()
  const { questions } = useInterview()
  const [secondsLeft, setSecondsLeft] = useState(PREPARATION_SECONDS)

  useEffect(() => {
    if (secondsLeft <= 0) {
      navigate('/interview/questions')
      return undefined
    }

    const timerId = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timerId)
          return 0
        }

        return prev - 1
      })
    }, 1000)

    return () => {
      window.clearInterval(timerId)
    }
  }, [navigate, secondsLeft])

  return (
    <div className="min-h-screen bg-[#efefef] px-6 py-10">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-4xl flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Interview Ready</p>
        <h1 className="mt-3 text-3xl font-bold text-gray-900">면접 준비 시간입니다</h1>
        <p className="mt-3 text-gray-600">호흡을 가다듬고 자세를 정리해보세요. 준비가 되면 바로 답변을 시작할 수 있어요.</p>
        {questions.length > 0 && (
          <p className="mt-2 text-sm text-gray-500">준비된 질문 {questions.length}개가 순서대로 진행됩니다.</p>
        )}

        <div className="mt-10 flex h-48 w-48 items-center justify-center rounded-full border-8 border-blue-100 bg-blue-50">
          <span className="text-6xl font-bold text-blue-600">{secondsLeft}</span>
        </div>

        <p className="mt-6 text-sm text-gray-500">카운트다운이 끝나면 자동으로 다음 화면으로 이동합니다.</p>

        <button
          type="button"
          onClick={() => navigate('/interview/questions')}
          className="mt-8 rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
        >
          바로 답변하기
        </button>
      </div>
    </div>
  )
}

export default Preparation
