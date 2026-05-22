import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadInterviewQuestionRecording } from '../../api/interviewRecordingApi'
import { useInterview } from '../../contexts/InterviewContext.jsx'

function RecordingReview() {
  const navigate = useNavigate()
  const {
    questions,
    interviewSession,
    currentQuestionIndex,
    questionRetryUsed,
    questionRecordings,
    setCurrentQuestionIndex,
    setQuestionRecordings,
    setQuestionRetryUsed,
  } = useInterview()
  const [uploadState, setUploadState] = useState('idle')
  const [uploadError, setUploadError] = useState('')

  const hasQuestions = questions.length > 0
  const isLastQuestion = currentQuestionIndex >= questions.length - 1
  const currentQuestion = questions[currentQuestionIndex]
  const currentQuestionOrder = currentQuestionIndex + 1
  const currentQuestionText =
    currentQuestion?.question_text || currentQuestion?.question || currentQuestion || ''
  const retryUsed = questionRetryUsed[currentQuestionIndex]
  const currentRecording = questionRecordings[currentQuestionIndex]
  const hasRecording = Boolean(currentRecording)
  const recordingUrl = useMemo(() => {
    if (!currentRecording) {
      return ''
    }

    return URL.createObjectURL(currentRecording)
  }, [currentRecording])

  useEffect(() => {
    return () => {
      if (recordingUrl) {
        URL.revokeObjectURL(recordingUrl)
      }
    }
  }, [recordingUrl])

  const handleNextQuestion = async () => {
    if (uploadState === 'uploading') {
      return
    }

    if (!interviewSession?.id) {
      setUploadState('error')
      setUploadError('면접 세션 정보가 없습니다. 카메라 설정 단계부터 다시 진행해주세요.')
      return
    }

    setUploadState('uploading')
    setUploadError('')

    try {
      await uploadInterviewQuestionRecording({
        recording: currentRecording,
        interviewId: interviewSession?.id,
        order: currentQuestionOrder,
        questionText: currentQuestionText,
      })

      setUploadState('success')
    } catch {
      setUploadState('error')
      setUploadError('녹화 영상 업로드에 실패했습니다. 백엔드 API 연결 상태를 확인해주세요.')
      return
    }

    if (isLastQuestion) {
      navigate('/interview/complete')
      return
    }

    setCurrentQuestionIndex((prev) => prev + 1)
    navigate('/interview/questions')
  }

  const handleRetry = () => {
    if (retryUsed) {
      return
    }

    setQuestionRecordings((prev) => {
      const next = [...prev]
      next[currentQuestionIndex] = null
      return next
    })
    setQuestionRetryUsed((prev) => {
      const next = [...prev]
      next[currentQuestionIndex] = true
      return next
    })
    navigate('/interview/questions')
  }

  if (!hasQuestions || !hasRecording) {
    return (
      <div className="min-h-screen bg-[#efefef] px-6 py-12">
        <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">확인할 녹화가 없습니다</h1>
          <p className="mt-3 text-gray-600">면접 화면으로 돌아가 다시 진행해주세요.</p>
          <button
            type="button"
            onClick={() => navigate('/interview/questions')}
            className="mt-6 rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-600"
          >
            면접 화면으로 이동
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#efefef] px-6 py-12">
      <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Recording Complete</p>
        <h1 className="mt-3 text-3xl font-bold text-gray-900">녹화가 완료되었습니다.</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-700">
          한번 더 녹화하면 직전의 영상은 폐기되며 복구할 수 없습니다.
        </p>
        <p className="mt-3 text-sm text-gray-500">
          질문 {currentQuestionIndex + 1} / {questions.length}
        </p>
        {uploadError && (
          <p className="mt-4 text-sm font-semibold text-red-600">
            {uploadError}
          </p>
        )}

        {recordingUrl && (
          <video
            src={recordingUrl}
            controls
            className="mt-8 aspect-video w-full max-w-2xl scale-x-[-1] rounded-3xl bg-gray-950 object-contain"
          />
        )}

        <div className="mt-10 flex w-full max-w-md flex-col gap-3">
          <button
            type="button"
            onClick={handleNextQuestion}
            disabled={uploadState === 'uploading'}
            className="rounded-2xl bg-blue-500 px-6 py-4 text-lg font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {uploadState === 'uploading'
              ? '녹화 업로드 중...'
              : isLastQuestion
                ? '면접 완료'
                : '다음 질문으로'}
          </button>

          <button
            type="button"
            onClick={handleRetry}
            disabled={retryUsed}
            className="rounded-2xl border border-gray-300 bg-white px-6 py-4 text-lg font-semibold text-gray-800 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
          >
            한번더
          </button>
        </div>
      </div>
    </div>
  )
}

export default RecordingReview
