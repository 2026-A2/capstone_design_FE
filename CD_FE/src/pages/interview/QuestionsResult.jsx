import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInterview } from '../../contexts/InterviewContext.jsx'

const ANSWER_SECONDS = 180

function QuestionsResult() {
  const navigate = useNavigate()
  const { questions } = useInterview()
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [cameraState, setCameraState] = useState('loading')
  const [cameraError, setCameraError] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(ANSWER_SECONDS)

  const hasQuestions = questions.length > 0
  const isLastQuestion = currentQuestionIndex >= questions.length - 1
  const currentQuestion = hasQuestions ? questions[currentQuestionIndex] : ''
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const seconds = String(secondsLeft % 60).padStart(2, '0')

  useEffect(() => {
    if (!hasQuestions) {
      return
    }

    let isMounted = true

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        streamRef.current = stream

        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }

        setCameraState('ready')
        setCameraError('')
      } catch {
        if (!isMounted) {
          return
        }

        setCameraState('denied')
        setCameraError('웹캠을 불러오지 못했습니다. 브라우저 권한 설정을 확인해주세요.')
      }
    }

    startCamera()

    return () => {
      isMounted = false

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
    }
  }, [hasQuestions])

  useEffect(() => {
    if (!hasQuestions) {
      return undefined
    }

    setSecondsLeft(ANSWER_SECONDS)
    return undefined
  }, [currentQuestionIndex, hasQuestions])

  useEffect(() => {
    if (!hasQuestions) {
      return undefined
    }

    if (secondsLeft <= 0) {
      if (isLastQuestion) {
        navigate('/main')
      } else {
        setCurrentQuestionIndex((prev) => prev + 1)
      }

      return undefined
    }

    const timerId = window.setTimeout(() => {
      setSecondsLeft((prev) => prev - 1)
    }, 1000)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [hasQuestions, isLastQuestion, navigate, secondsLeft])

  const handleAdvanceQuestion = () => {
    if (isLastQuestion) {
      navigate('/main')
      return
    }

    setCurrentQuestionIndex((prev) => prev + 1)
  }

  if (!hasQuestions) {
    return (
      <div className="min-h-screen bg-[#efefef] px-6 py-12">
        <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">면접 질문이 아직 준비되지 않았습니다</h1>
          <p className="mt-3 text-gray-600">처음부터 다시 진행해서 질문을 생성해주세요.</p>
          <button
            type="button"
            onClick={() => navigate('/interview')}
            className="mt-6 rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-600"
          >
            면접 시작으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#efefef] px-6 py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex items-center justify-between rounded-3xl bg-white px-6 py-4 shadow-sm">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Interview In Progress</p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900">질문에 맞춰 차분히 답변해보세요</h1>
          </div>
          <p className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            질문 {currentQuestionIndex + 1} / {questions.length}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="flex min-h-[560px] flex-col rounded-3xl bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">Current Question</p>
            <div className="mt-4 inline-flex w-fit rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
              남은 시간 {minutes}:{seconds}
            </div>
            <div className="mt-6 flex flex-1 items-center justify-center rounded-3xl bg-gray-50 px-8 py-10 text-left">
              <p className="text-3xl font-bold leading-relaxed text-gray-900">{currentQuestion}</p>
            </div>

            <button
              type="button"
              onClick={handleAdvanceQuestion}
              className="mt-6 rounded-2xl bg-blue-500 px-6 py-4 text-lg font-semibold text-white transition hover:bg-blue-600"
            >
              {isLastQuestion ? '면접 종료' : '답변하기'}
            </button>
          </section>

          <section className="flex min-h-[560px] flex-col rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">Your Camera</p>
            <div className="mt-4 flex flex-1 items-center justify-center overflow-hidden rounded-3xl bg-gray-950">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full scale-x-[-1] object-cover"
              />
            </div>

            <div className="mt-4 rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-700">
              {cameraState === 'loading' && '카메라를 연결하는 중입니다...'}
              {cameraState === 'ready' && '카메라가 정상적으로 연결되었습니다. 시선을 유지하고 답변을 시작해보세요.'}
              {cameraState === 'denied' && cameraError}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default QuestionsResult
