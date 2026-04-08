import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInterview } from '../../contexts/InterviewContext.jsx'

const ANSWER_SECONDS = 180

function QuestionsResult() {
  const navigate = useNavigate()
  const {
    questions,
    currentQuestionIndex,
    questionRetryUsed,
    setCurrentQuestionIndex,
    setQuestionRecordings,
    resetInterview,
  } = useInterview()
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const recorderRef = useRef(null)
  const recordedChunksRef = useRef([])
  const pendingTransitionRef = useRef(null)
  const [cameraState, setCameraState] = useState('loading')
  const [cameraError, setCameraError] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(ANSWER_SECONDS)
  const [recordingState, setRecordingState] = useState('idle')

  const hasQuestions = questions.length > 0
  const isLastQuestion = currentQuestionIndex >= questions.length - 1
  const currentQuestion = hasQuestions ? questions[currentQuestionIndex] : ''
  const retryUsed = questionRetryUsed[currentQuestionIndex] ?? false
  const isTimerRunning = cameraState === 'ready' && recordingState === 'recording'
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const seconds = String(secondsLeft % 60).padStart(2, '0')

  const moveToNextStep = () => {
    if (pendingTransitionRef.current === 'review') {
      pendingTransitionRef.current = null
      navigate('/interview/review')
      return
    }

    if (pendingTransitionRef.current === 'next') {
      pendingTransitionRef.current = null

      if (isLastQuestion) {
        resetInterview()
        navigate('/main')
      } else {
        setCurrentQuestionIndex((prev) => prev + 1)
        navigate('/interview/questions')
      }
    }
  }

  const stopRecording = () => {
    const recorder = recorderRef.current

    if (!recorder || recorder.state === 'inactive') {
      moveToNextStep()
      return
    }

    recorder.stop()
    recorderRef.current = null
  }

  const startRecording = () => {
    const stream = streamRef.current

    if (!stream || typeof MediaRecorder === 'undefined') {
      setRecordingState('unsupported')
      setCameraError('이 브라우저에서는 녹화 기능을 지원하지 않습니다.')
      return
    }

    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop()
    }

    recordedChunksRef.current = []

    const recorder = new MediaRecorder(stream)

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data)
      }
    }

    recorder.onstart = () => {
      setRecordingState('recording')
    }

    recorder.onstop = () => {
      const recordedBlob = new Blob(recordedChunksRef.current, {
        type: recorder.mimeType || 'video/webm',
      })

      setQuestionRecordings((prev) => {
        const next = [...prev]
        next[currentQuestionIndex] = recordedBlob
        return next
      })
      recordedChunksRef.current = []
      setRecordingState('stopped')
      moveToNextStep()
    }

    recorder.onerror = () => {
      setRecordingState('error')
      setCameraError('녹화를 시작하지 못했습니다. 브라우저 권한과 지원 여부를 확인해주세요.')
    }

    recorderRef.current = recorder
    recorder.start()
  }

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
      if (recorderRef.current && recorderRef.current.state !== 'inactive') {
        recorderRef.current.onstop = null
        recorderRef.current.stop()
        recorderRef.current = null
      }

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
    if (!hasQuestions || cameraState !== 'ready') {
      return undefined
    }

    startRecording()

    return () => {
      stopRecording()
    }
  }, [cameraState, currentQuestionIndex, hasQuestions])

  useEffect(() => {
    if (!hasQuestions) {
      return undefined
    }

    if (!isTimerRunning) {
      return undefined
    }

    if (secondsLeft <= 0) {
      pendingTransitionRef.current = retryUsed ? 'next' : 'review'
      stopRecording()
      return undefined
    }

    const timerId = window.setTimeout(() => {
      setSecondsLeft((prev) => prev - 1)
    }, 1000)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [hasQuestions, isTimerRunning, retryUsed, secondsLeft])

  const handleAdvanceQuestion = () => {
    pendingTransitionRef.current = retryUsed ? 'next' : 'review'
    stopRecording()
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
          <section className="flex min-h-140 flex-col rounded-3xl bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">Current Question</p>
            <div className="mt-4 inline-flex w-fit rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
              {isTimerRunning ? `남은 시간 ${minutes}:${seconds}` : '카메라 연결 후 카운트다운이 시작됩니다'}
            </div>
            <div className="mt-6 flex flex-1 items-center justify-center rounded-3xl bg-gray-50 px-8 py-10 text-left">
              <p className="text-3xl font-bold leading-relaxed text-gray-900">{currentQuestion}</p>
            </div>

            <button
              type="button"
              onClick={handleAdvanceQuestion}
              className="mt-6 rounded-2xl bg-blue-500 px-6 py-4 text-lg font-semibold text-white transition hover:bg-blue-600"
            >
              {retryUsed ? (isLastQuestion ? '면접 종료' : '다음 질문으로') : '답변하기'}
            </button>
          </section>

          <section className="flex min-h-140 flex-col rounded-3xl bg-white p-6 shadow-sm">
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
              {cameraState === 'ready' && recordingState === 'recording' && '카메라가 정상적으로 연결되었고 녹화가 진행 중입니다.'}
              {cameraState === 'ready' && recordingState === 'stopped' && '현재 질문 녹화가 저장되었고, 다음 질문에서 다시 녹화가 시작됩니다.'}
              {cameraState === 'ready' && recordingState === 'idle' && '카메라가 정상적으로 연결되었습니다. 시선을 유지하고 답변을 시작해보세요.'}
              {cameraState === 'ready' && recordingState === 'unsupported' && cameraError}
              {cameraState === 'ready' && recordingState === 'error' && cameraError}
              {cameraState === 'denied' && cameraError}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default QuestionsResult
