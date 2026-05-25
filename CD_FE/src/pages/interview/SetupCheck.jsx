import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInterview } from '../../contexts/InterviewContext.jsx'

const CALIBRATION_SECONDS = 7
const CALIBRATION_VIDEO_CONSTRAINTS = {
  width: { ideal: 640 },
  height: { ideal: 360 },
  frameRate: { ideal: 24, max: 24 },
}
const RECORDER_OPTIONS = {
  videoBitsPerSecond: 700_000,
  audioBitsPerSecond: 64_000,
}
const WEBM_MIME_TYPES = [
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
  'video/webm',
]

const getSupportedWebmMimeType = () => {
  if (typeof MediaRecorder === 'undefined') {
    return ''
  }

  return WEBM_MIME_TYPES.find((mimeType) =>
    MediaRecorder.isTypeSupported(mimeType),
  ) || ''
}

const createCalibrationFile = (chunks, mimeType) => {
  const type = mimeType || 'video/webm'
  const blob = new Blob(chunks, { type })

  return new File([blob], 'interview-calibration.webm', {
    type,
    lastModified: Date.now(),
  })
}

function SetupCheck() {
  const navigate = useNavigate()
  const {
    questions,
    loading,
    requestInterviewQuestions,
    requestInterviewSession,
  } = useInterview()
  const videoRef = useRef(null)
  const previewRef = useRef(null)
  const streamRef = useRef(null)
  const recorderRef = useRef(null)
  const recordedChunksRef = useRef([])
  const recordTimerRef = useRef(null)
  const previewUrlRef = useRef('')
  const [permissionState, setPermissionState] = useState('idle')
  const [recordingState, setRecordingState] = useState('idle')
  const [recordingSecondsLeft, setRecordingSecondsLeft] = useState(CALIBRATION_SECONDS)
  const [errorMessage, setErrorMessage] = useState('')
  const [calibrationRecording, setCalibrationRecording] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')

  const clearPreviewUrl = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = ''
    }
    setPreviewUrl('')
  }

  const resetRecording = () => {
    if (recordTimerRef.current) {
      window.clearInterval(recordTimerRef.current)
      recordTimerRef.current = null
    }

    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.onstop = null
      recorderRef.current.stop()
    }

    recorderRef.current = null
    recordedChunksRef.current = []
    clearPreviewUrl()
    setCalibrationRecording(null)
    setRecordingState('idle')
    setRecordingSecondsLeft(CALIBRATION_SECONDS)

    if (previewRef.current) {
      previewRef.current.removeAttribute('src')
    }
  }

  const stopStream = () => {
    if (!streamRef.current) {
      return
    }

    streamRef.current.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }

  const handleRequestPermission = async () => {
    setPermissionState('loading')
    resetRecording()
    setErrorMessage('')

    try {
      stopStream()

      const stream = await navigator.mediaDevices.getUserMedia({
        video: CALIBRATION_VIDEO_CONSTRAINTS,
        audio: true,
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      setPermissionState('granted')
    } catch {
      stopStream()
      setPermissionState('denied')
      setErrorMessage('카메라 및 마이크 권한이 필요합니다. 브라우저 권한 설정을 확인해주세요.')
    }
  }

  const stopCalibrationRecording = () => {
    if (recordTimerRef.current) {
      window.clearInterval(recordTimerRef.current)
      recordTimerRef.current = null
    }

    const recorder = recorderRef.current

    if (!recorder || recorder.state === 'inactive') {
      return
    }

    recorder.stop()
  }

  const handleStartCalibrationRecording = () => {
    const stream = streamRef.current

    if (!stream || permissionState !== 'granted') {
      setErrorMessage('카메라와 마이크 권한을 먼저 허용해주세요.')
      return
    }

    if (typeof MediaRecorder === 'undefined') {
      setRecordingState('unsupported')
      setErrorMessage('이 브라우저에서는 녹화 기능을 지원하지 않습니다.')
      return
    }

    const mimeType = getSupportedWebmMimeType()

    if (!mimeType) {
      setRecordingState('unsupported')
      setErrorMessage('이 브라우저에서는 webm 녹화 형식을 지원하지 않습니다.')
      return
    }

    resetRecording()
    setErrorMessage('')
    setRecordingSecondsLeft(CALIBRATION_SECONDS)
    recordedChunksRef.current = []

    const recorder = new MediaRecorder(stream, {
      mimeType,
      ...RECORDER_OPTIONS,
    })

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data)
      }
    }

    recorder.onstart = () => {
      setRecordingState('recording')
      recordTimerRef.current = window.setInterval(() => {
        setRecordingSecondsLeft((prev) => {
          if (prev <= 1) {
            stopCalibrationRecording()
            return 0
          }

          return prev - 1
        })
      }, 1000)
    }

    recorder.onstop = () => {
      if (recordTimerRef.current) {
        window.clearInterval(recordTimerRef.current)
        recordTimerRef.current = null
      }

      const recordedFile = createCalibrationFile(
        recordedChunksRef.current,
        recorder.mimeType || mimeType,
      )
      const previewUrl = URL.createObjectURL(recordedFile)

      previewUrlRef.current = previewUrl
      setCalibrationRecording(recordedFile)
      setPreviewUrl(previewUrl)
      setRecordingState('recorded')
      setRecordingSecondsLeft(0)
      recordedChunksRef.current = []
    }

    recorder.onerror = () => {
      setRecordingState('error')
      setErrorMessage('테스트 녹화를 저장하지 못했습니다. 브라우저 권한과 지원 여부를 확인해주세요.')
    }

    recorderRef.current = recorder
    recorder.start(1000)
  }

  const handleNext = async () => {
    if (!calibrationRecording || loading || recordingState === 'recording') {
      return
    }

    setErrorMessage('')

    try {
      await requestInterviewQuestions()
      await requestInterviewSession({
        calibrationRecording,
      })
      stopStream()
      navigate('/interview/preparation')
    } catch {
      setErrorMessage('면접 질문 생성, 세션 생성 또는 캘리브레이션 업로드에 실패했습니다. 서버 연결 상태를 확인해주세요.')
    }
  }

  useEffect(() => {
    return () => {
      if (recordTimerRef.current) {
        window.clearInterval(recordTimerRef.current)
      }

      if (recorderRef.current && recorderRef.current.state !== 'inactive') {
        recorderRef.current.onstop = null
        recorderRef.current.stop()
      }

      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current)
        previewUrlRef.current = ''
      }
      stopStream()
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#efefef] px-6 py-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 rounded-3xl bg-white p-8 text-center shadow-sm">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Camera Check</p>
          <h1 className="text-3xl font-bold text-gray-900">초기 설정을 시작합니다. 카메라를 보고 웃어보세요!</h1>
          <p className="text-gray-600">카메라와 마이크 권한을 허용하면 5~10초의 테스트 영상을 녹화해 초기 환경을 확인할 수 있어요.</p>
          {questions.length > 0 && (
            <p className="text-sm text-gray-500">면접 질문이 준비되었습니다. 카메라 테스트를 마치면 다음 단계로 이어갈 수 있어요.</p>
          )}
        </div>

        <div className="grid w-full gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-950">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="aspect-video w-full scale-x-[-1] object-cover"
            />
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-gray-50 p-5 text-left">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-900">권한 상태</p>
              <p className="rounded-xl bg-white px-4 py-3 text-sm text-gray-700">
                {permissionState === 'idle' && '아직 권한을 요청하지 않았습니다.'}
                {permissionState === 'loading' && '카메라와 마이크 권한을 요청하는 중입니다...'}
                {permissionState === 'granted' && recordingState === 'idle' && '권한이 승인되었습니다. 테스트 녹화를 시작해주세요.'}
                {permissionState === 'granted' && recordingState === 'recording' && `테스트 녹화 중입니다. ${recordingSecondsLeft}초 남았습니다.`}
                {permissionState === 'granted' && recordingState === 'recorded' && '테스트 영상이 준비되었습니다. 다음 단계로 진행할 수 있어요.'}
                {permissionState === 'granted' && recordingState === 'unsupported' && '녹화 기능을 사용할 수 없습니다.'}
                {permissionState === 'granted' && recordingState === 'error' && '테스트 녹화 중 문제가 발생했습니다.'}
                {permissionState === 'denied' && '권한 요청이 거부되었습니다.'}
              </p>

              {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleRequestPermission}
                className="rounded-xl bg-blue-500 px-4 py-3 font-semibold text-white transition hover:bg-blue-600"
              >
                {permissionState === 'granted' ? '권한 다시 확인하기' : '카메라/마이크 권한 요청'}
              </button>

              <button
                type="button"
                onClick={handleStartCalibrationRecording}
                disabled={permissionState !== 'granted' || recordingState === 'recording'}
                className="rounded-xl bg-gray-900 px-4 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {recordingState === 'recorded' ? '테스트 영상 다시 찍기' : '테스트 영상 녹화'}
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!calibrationRecording || loading || recordingState === 'recording'}
                className="rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-800 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
              >
                {loading ? '면접 준비 중...' : '다음'}
              </button>
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="mx-auto flex min-h-64 w-full max-w-2xl items-center justify-center overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-gray-50">
            {calibrationRecording ? (
              <video
                ref={previewRef}
                src={previewUrl}
                controls
                playsInline
                className="h-full w-full object-cover"
              />
            ) : (
              <p className="px-6 text-sm text-gray-500">권한 승인 후 테스트 영상을 녹화하면 이곳에서 확인할 수 있습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SetupCheck
