import { useNavigate } from 'react-router-dom'
import { useInterview } from '../../contexts/InterviewContext.jsx'

function InterviewComplete() {
  const navigate = useNavigate()
  const { questions } = useInterview()
  const questionCount = questions.length || 4

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[74px] max-w-[1640px] items-center justify-between px-6 sm:px-10 xl:px-12">
          <div className="flex h-full items-center gap-12">
            <button
              type="button"
              className="flex items-center gap-3 text-left"
              onClick={() => navigate('/main')}
            >
              <span className="h-7 w-7 rounded-md bg-[#263f98]" />
              <span className="text-xl font-extrabold text-[#1f3d91]">
                InterviewLens
              </span>
            </button>

            <nav className="hidden h-full items-center gap-9 text-base font-bold text-slate-600 md:flex">
              <button
                type="button"
                className="h-full px-1 transition hover:text-[#263f98]"
                onClick={() => navigate('/interview')}
              >
                면접 연습
              </button>
              <button
                type="button"
                className="h-full px-1 transition hover:text-[#263f98]"
                onClick={() => navigate('/report')}
              >
                결과 리포트
              </button>
              <button
                type="button"
                className="h-full px-1 transition hover:text-[#263f98]"
                onClick={() => navigate('/settings/resume')}
              >
                내 자소서
              </button>
              <button
                type="button"
                className="h-full px-1 transition hover:text-[#263f98]"
                onClick={() => navigate('/settings/analysis-guide')}
              >
                분석 기준 안내
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-5">
            <button
              type="button"
              aria-label="분석 기준 안내"
              className="h-10 w-10 rounded-full bg-slate-100 transition hover:bg-slate-200"
              onClick={() => navigate('/settings/analysis-guide')}
            />
            <button
              type="button"
              aria-label="내 자소서 관리"
              className="h-11 w-11 rounded-full bg-[#5967d9] transition hover:bg-[#4b59cf]"
              onClick={() => navigate('/settings/resume')}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-74px)] max-w-[1640px] flex-col items-center px-6 py-20 text-center sm:px-10 xl:px-12">
        <div className="flex h-36 w-36 items-center justify-center rounded-full bg-[#d8fbe6]">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#1da36f]">
            <svg
              aria-hidden="true"
              className="h-11 w-11 text-white"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M5 12.5L9.4 17L19 7"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <h1 className="mt-12 text-4xl font-black text-[#1f2b4f] sm:text-5xl">
          수고하셨습니다.
        </h1>
        <p className="mt-5 text-lg font-semibold leading-8 text-slate-500">
          면접이 모두 끝났어요.
          <br />
          분석 완료 이후에, 결과 리포트를 확인하실 수 있어요.
        </p>

        <div className="mt-9 grid w-full max-w-[590px] gap-5 text-left sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
            <p className="text-sm font-bold text-slate-500">답변한 문항</p>
            <p className="mt-2 text-3xl font-black text-[#1f2b4f]">
              {questionCount} / {questionCount}
            </p>
            <p className="mt-4 text-sm font-semibold text-slate-400">
              모든 질문 응답
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
            <p className="text-sm font-bold text-slate-500">분석 진행</p>
            <p className="mt-2 flex items-center gap-2 text-2xl font-black text-[#1f2b4f]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b5f]" />
              진행 중
            </p>
            <p className="mt-4 text-sm font-semibold text-slate-400">
              n분 내 완료
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/main')}
          className="mt-16 flex w-full max-w-[335px] items-center justify-center gap-3 rounded-[28px] bg-[#ff665c] px-7 py-5 text-lg font-extrabold text-white shadow-sm transition hover:bg-[#f2554d]"
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M4 10.5L12 4L20 10.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.5 9.5V20H17.5V9.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 20V14H14V20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          종료하고 메인으로
        </button>

        <p className="mt-16 text-sm font-semibold text-slate-400">
          분석은 백그라운드에서 계속 진행돼요. 메인으로 돌아가도 결과는
          [결과 리포트] 탭에서 확인하실 수 있어요.
        </p>
      </main>
    </div>
  )
}

export default InterviewComplete
