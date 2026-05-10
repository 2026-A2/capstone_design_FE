import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { uploadInterviewVideos } from '../../api/interviewRecordingApi'
import { useInterview } from '../../contexts/InterviewContext.jsx'

function InterviewComplete() {
  const navigate = useNavigate()
  const {
    questionRecordings,
    questionType,
    resumeText,
    industry,
  } = useInterview()
  const [uploadState, setUploadState] = useState('idle')
  const [uploadError, setUploadError] = useState('')
  const recordedCount = questionRecordings.filter(Boolean).length

  const handleGoToAnalysis = async () => {
    if (recordedCount === 0 || uploadState === 'uploading') {
      return
    }

    setUploadState('uploading')
    setUploadError('')

    try {
      await uploadInterviewVideos({
        questionRecordings,
        questionType,
        resumeText,
        industry,
      })

      setUploadState('success')
      navigate('/main')
    } catch {
      setUploadState('error')
      setUploadError('녹화 영상 업로드에 실패했습니다. 백엔드 API 연결 상태를 확인해주세요.')
    }
  }

  return (
    <div className="min-h-screen bg-[#efefef] px-6 py-12">
      <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Interview Complete</p>
        <h1 className="mt-3 text-3xl font-bold text-gray-900">마지막 질문까지 답변 완료되었습니다.</h1>
        <p className="mt-3 text-lg text-gray-700">수고하셨습니다.</p>
        <p className="mt-3 text-sm text-gray-500">
          저장된 녹화 {recordedCount}개
        </p>
        {uploadError && (
          <p className="mt-4 text-sm font-semibold text-red-600">
            {uploadError}
          </p>
        )}

        <button
          type="button"
          onClick={handleGoToAnalysis}
          disabled={recordedCount === 0 || uploadState === 'uploading'}
          className="mt-10 rounded-2xl bg-blue-500 px-6 py-4 text-lg font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {uploadState === 'uploading' ? '녹화 업로드 중...' : '나의 분석 보기'}
        </button>
      </div>
    </div>
  )
}

export default InterviewComplete
