import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { getInterviewFinalReport } from '../../api/interviewRecordingApi'
import { useInterview } from '../../contexts/InterviewContext.jsx'

const reportItems = [
  { key: 'focus_rate', label: '정면 응시율', unit: '%' },
  { key: 'left_gaze_rate', label: '좌측 시선', unit: '%' },
  { key: 'right_gaze_rate', label: '우측 시선', unit: '%' },
  { key: 'blinks_per_min', label: '분당 깜빡임', unit: '회' },
  { key: 'nod_count', label: '끄덕임', unit: '회' },
  { key: 'shoulder_stability', label: '어깨 안정도', unit: '%' },
  { key: 'lr_sway_count', label: '좌우 흔들림', unit: '회' },
  { key: 'fb_sway_count', label: '앞뒤 흔들림', unit: '회' },
  { key: 'total_smile_rate', label: '전체 미소율', unit: '%' },
]

const formatValue = (value, unit) => {
  if (typeof value === 'number') {
    return `${Number.isInteger(value) ? value : value.toFixed(1)}${unit}`
  }

  return value === undefined || value === null ? '-' : `${value}${unit}`
}

function InterviewComplete() {
  const navigate = useNavigate()
  const { interviewSession, finalReport, setFinalReport } = useInterview()
  const [reportState, setReportState] = useState('idle')
  const [reportError, setReportError] = useState('')

  const report = finalReport?.report
  const reportInterviewId = finalReport?.interview_id ?? interviewSession?.id

  const handleShowReport = async () => {
    if (!interviewSession?.id || reportState === 'loading') {
      return
    }

    setReportState('loading')
    setReportError('')

    try {
      const data = await getInterviewFinalReport(interviewSession.id)

      setFinalReport(data)
      setReportState('success')
    } catch {
      setReportState('error')
      setReportError('최종 리포트를 불러오지 못했습니다. 백엔드 API 연결 상태를 확인해주세요.')
    }
  }

  return (
    <div className="min-h-screen bg-[#efefef] px-6 py-12">
      <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Interview Complete</p>
        <h1 className="mt-3 text-3xl font-bold text-gray-900">마지막 질문까지 답변 완료되었습니다.</h1>
        <p className="mt-3 text-lg text-gray-700">모든 녹화 영상이 전송되었습니다.</p>

        {reportError && (
          <p className="mt-5 text-sm font-semibold text-red-600">
            {reportError}
          </p>
        )}

        {report && (
          <div className="mt-8 w-full text-left">
            <div className="rounded-2xl bg-blue-50 px-6 py-5 text-center">
              <p className="text-sm font-semibold text-blue-700">면접 ID {reportInterviewId}</p>
              <p className="mt-2 text-4xl font-bold text-blue-700">
                {formatValue(report.overall_score, '점')}
              </p>
              <p className="mt-1 text-sm font-semibold text-blue-600">전체 면접 점수</p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {reportItems.map((item) => (
                <div key={item.key} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-sm font-semibold text-gray-500">{item.label}</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {formatValue(report[item.key], item.unit)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-500">시작 10초 미소</p>
                <p className="mt-2 text-xl font-bold text-gray-900">
                  {report.start_smile_status ? '감지됨' : '미감지'}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-500">종료 10초 미소</p>
                <p className="mt-2 text-xl font-bold text-gray-900">
                  {report.end_smile_status ? '감지됨' : '미감지'}
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={report ? () => navigate('/main') : handleShowReport}
          disabled={!interviewSession?.id || reportState === 'loading'}
          className="mt-10 rounded-2xl bg-blue-500 px-6 py-4 text-lg font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {report
            ? '메인으로 이동'
            : reportState === 'loading'
              ? '리포트 불러오는 중...'
              : '나의 분석 보기'}
        </button>
      </div>
    </div>
  )
}

export default InterviewComplete
