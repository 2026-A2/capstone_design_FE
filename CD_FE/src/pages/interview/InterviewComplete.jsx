import { useNavigate } from 'react-router-dom'

function InterviewComplete() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#efefef] px-6 py-12">
      <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Interview Complete</p>
        <h1 className="mt-3 text-3xl font-bold text-gray-900">마지막 질문까지 답변 완료되었습니다.</h1>
        <p className="mt-3 text-lg text-gray-700">모든 녹화 영상이 전송되었습니다.</p>

        <button
          type="button"
          onClick={() => navigate('/main')}
          className="mt-10 rounded-2xl bg-blue-500 px-6 py-4 text-lg font-semibold text-white transition hover:bg-blue-600"
        >
          나의 분석 보기
        </button>
      </div>
    </div>
  )
}

export default InterviewComplete
