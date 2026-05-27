import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInterview } from '../../contexts/InterviewContext.jsx'

const CALIBRATION_SECONDS = 10
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
  const streamRef = useRef(null)
  const recorderRef = useRef(null)
  const recordedChunksRef = useRef([])
  const recordTimerRef = useRef(null)
  const hasRequestedPermissionRef = useRef(false)
  const audioContextRef = useRef(null)
  const audioSourceRef = useRef(null)
  const micAnimationRef = useRef(null)
  const [permissionState, setPermissionState] = useState('idle')
  const [recordingState, setRecordingState] = useState('idle')
  const [recordingSecondsLeft, setRecordingSecondsLeft] = useState(CALIBRATION_SECONDS)
  const [errorMessage, setErrorMessage] = useState('')
  const [calibrationRecording, setCalibrationRecording] = useState(null)
  const [micLevel, setMicLevel] = useState(0)

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
    setCalibrationRecording(null)
    setRecordingState('idle')
    setRecordingSecondsLeft(CALIBRATION_SECONDS)
  }

  const stopMicLevelMeter = () => {
    if (micAnimationRef.current) {
      window.cancelAnimationFrame(micAnimationRef.current)
      micAnimationRef.current = null
    }

    if (audioSourceRef.current) {
      audioSourceRef.current.disconnect()
      audioSourceRef.current = null
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    setMicLevel(0)
  }

  const startMicLevelMeter = (stream) => {
    stopMicLevelMeter()

    if (!stream.getAudioTracks().length) {
      return
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext

    if (!AudioContext) {
      return
    }

    const audioContext = new AudioContext()
    const analyser = audioContext.createAnalyser()
    const source = audioContext.createMediaStreamSource(stream)

    analyser.fftSize = 1024
    analyser.smoothingTimeConstant = 0.82
    const samples = new Uint8Array(analyser.fftSize)

    source.connect(analyser)
    audioContextRef.current = audioContext
    audioSourceRef.current = source

    const updateMicLevel = () => {
      analyser.getByteTimeDomainData(samples)

      let sum = 0

      for (let index = 0; index < samples.length; index += 1) {
        const normalizedSample = (samples[index] - 128) / 128
        sum += normalizedSample * normalizedSample
      }

      const rms = Math.sqrt(sum / samples.length)
      const nextLevel = Math.min(100, Math.round(rms * 320))

      setMicLevel((currentLevel) => (
        Math.abs(currentLevel - nextLevel) > 1 ? nextLevel : currentLevel
      ))

      micAnimationRef.current = window.requestAnimationFrame(updateMicLevel)
    }

    updateMicLevel()
  }

  const stopStream = () => {
    stopMicLevelMeter()

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

      startMicLevelMeter(stream)
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

      setCalibrationRecording(recordedFile)
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
    if (!hasRequestedPermissionRef.current) {
      hasRequestedPermissionRef.current = true
      handleRequestPermission()
    }

    return () => {
      if (recordTimerRef.current) {
        window.clearInterval(recordTimerRef.current)
      }

      if (recorderRef.current && recorderRef.current.state !== 'inactive') {
        recorderRef.current.onstop = null
        recorderRef.current.stop()
      }

      stopMicLevelMeter()
      stopStream()
    }
  }, [])

  useEffect(() => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
    }
  }, [permissionState])

  return (
    <div className="min-h-screen bg-[#f6f7fa] text-[#1f2948]">
      <header className="border-b border-[#dde1ea] bg-white">
        <div className="flex h-[66px] items-center px-6">
          <button
            type="button"
            className="flex items-center gap-2 text-[15px] font-bold text-[#596274] transition hover:text-[#263f98]"
            onClick={() => navigate('/main')}
          >
            <span className="text-2xl leading-none" aria-hidden="true">
              ‹
            </span>
            나가기
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1450px] flex-col px-6 pb-12 pt-10 sm:px-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <section>
            <h1 className="text-[28px] font-extrabold leading-tight text-[#202945]">
              면접 환경을 점검할게요
            </h1>
            <p className="mt-2 text-sm font-medium text-[#687085]">
              조명 · 카메라 각도 · 마이크 입력이 모두 정상이어야 정확한 분석이 가능해요.
            </p>
          </section>
        </div>

        <section className="mt-8 grid gap-7 lg:grid-cols-[minmax(0,1fr)_450px]">
          <div className="relative flex min-h-[380px] overflow-hidden rounded-[20px] bg-[#1d2b61] sm:min-h-[520px]">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`h-full w-full scale-x-[-1] object-cover ${
                permissionState === 'granted' ? 'block' : 'hidden'
              }`}
            />

            {permissionState !== 'granted' && (
              <div className="flex h-full w-full items-center justify-center px-8 text-center text-sm font-bold text-white/75">
                {permissionState === 'loading'
                  ? '카메라와 마이크 권한을 요청하는 중입니다...'
                  : '카메라와 마이크 권한을 허용해주세요.'}
              </div>
            )}

            {recordingState === 'recording' && (
              <div className="absolute left-1/2 top-7 -translate-x-1/2 rounded-full bg-[#1f2948]/80 px-8 py-3 text-sm font-bold text-white">
                {recordingSecondsLeft}초간 무표정으로 정면을 응시해주세요
              </div>
            )}
          </div>

          <aside className="flex flex-col gap-4">
            <div className="rounded-[16px] border border-[#dfe3ec] bg-white px-6 py-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e9edff] text-sm font-extrabold text-[#3142aa]">
                    1
                  </span>
                  <h2 className="text-lg font-extrabold text-[#202945]">카메라 연결</h2>
                </div>
                <span className={`rounded-full px-4 py-1.5 text-xs font-extrabold ${
                  permissionState === 'granted'
                    ? 'bg-[#dff8e8] text-[#20a765]'
                    : 'bg-[#fff1df] text-[#d97819]'
                }`}>
                  {permissionState === 'granted' ? '정상' : '확인 중'}
                </span>
              </div>
              <p className="mt-4 text-sm font-medium leading-6 text-[#687085]">
                영상이 왼쪽 칸에 보이는지 확인해주세요. 다른 장치로 바꾸려면 시스템 설정에서 선택해주세요.
              </p>
              {permissionState === 'denied' && (
                <button
                  type="button"
                  className="mt-4 rounded-[12px] bg-[#263f98] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#1f347e]"
                  onClick={handleRequestPermission}
                >
                  권한 다시 요청
                </button>
              )}
            </div>

            <div className="rounded-[16px] border border-[#dfe3ec] bg-white px-6 py-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e9edff] text-sm font-extrabold text-[#3142aa]">
                    2
                  </span>
                  <h2 className="text-lg font-extrabold text-[#202945]">마이크 입력</h2>
                </div>
                <span className={`rounded-full px-4 py-1.5 text-xs font-extrabold ${
                  permissionState === 'granted' && micLevel > 0
                    ? 'bg-[#dff8e8] text-[#20a765]'
                    : permissionState === 'granted'
                      ? 'bg-[#eef2ff] text-[#4860d6]'
                      : 'bg-[#fff1df] text-[#d97819]'
                }`}>
                  {permissionState === 'granted' && micLevel > 0
                    ? '입력 중'
                    : permissionState === 'granted'
                      ? '대기'
                      : '확인 중'}
                </span>
              </div>
              <p className="mt-4 text-sm font-medium leading-6 text-[#687085]">
                한 문장 정도 말씀해보세요. 권장 입력 레벨은 60-80%입니다.
              </p>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#f0f2f7]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#21aa70] to-[#e9a326] transition-[width] duration-100 ease-out"
                  style={{ width: `${micLevel}%` }}
                />
              </div>
              <div className="mt-3 flex justify-between text-xs font-medium text-[#9299ab]">
                <span>0</span>
                <span>현재 {micLevel}% · 권장 60-80%</span>
                <span>100</span>
              </div>
            </div>

            <div className="rounded-[16px] border border-[#dfe3ec] bg-white px-6 py-6 shadow-sm">
              <div className="flex items-center gap-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e9edff] text-sm font-extrabold text-[#3142aa]">
                  3
                </span>
                <h2 className="text-lg font-extrabold text-[#202945]">얼굴 인식</h2>
              </div>
              <p className="mt-4 text-sm font-medium leading-6 text-[#687085]">
                {recordingState === 'recording' && `정면 응시 테스트 중입니다. ${recordingSecondsLeft}초 남았습니다.`}
                {recordingState === 'recorded' && '환경 점검 영상이 준비되었습니다.'}
                {recordingState !== 'recording' && recordingState !== 'recorded' && '10초간 무표정으로 정면을 응시해주세요.'}
              </p>
              <button
                type="button"
                onClick={handleStartCalibrationRecording}
                disabled={permissionState !== 'granted' || recordingState === 'recording'}
                className="mt-4 rounded-[12px] border border-[#dfe3ec] bg-white px-5 py-3 text-sm font-extrabold text-[#202945] transition hover:bg-[#f6f7fa] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
              >
                {recordingState === 'recorded' ? '다시 점검하기' : '얼굴 인식 점검'}
              </button>
            </div>
          </aside>
        </section>

        {errorMessage && (
          <p className="mt-6 text-center text-sm font-bold text-red-500">{errorMessage}</p>
        )}

        {questions.length > 0 && (
          <p className="mt-4 text-center text-sm font-medium text-[#687085]">
            면접 질문이 준비되었습니다. 환경 점검을 마치면 다음 단계로 이어갈 수 있어요.
          </p>
        )}

        <div className="mt-12 flex items-center justify-end gap-4">
          <button
            type="button"
            className="h-[54px] min-w-[116px] rounded-[14px] border border-[#dfe3ec] bg-white px-8 text-base font-extrabold text-[#202945] transition hover:bg-[#f6f7fa]"
            onClick={() => navigate('/interview/question-count')}
          >
            취소
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!calibrationRecording || loading || recordingState === 'recording'}
            className="h-[58px] min-w-[192px] rounded-[24px] bg-[#ff665b] px-10 text-[17px] font-extrabold text-white transition hover:bg-[#f05248] focus:outline-none focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading ? '면접 준비 중...' : '면접 시작 →'}
          </button>
        </div>
      </main>
    </div>
  )
}

export default SetupCheck
