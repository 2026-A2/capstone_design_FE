import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInterview } from '../../contexts/InterviewContext.jsx'

function SetupCheck() {
  const navigate = useNavigate()
  const { questions } = useInterview()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const [permissionState, setPermissionState] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [capturedImage, setCapturedImage] = useState('')

  const stopStream = () => {
    if (!streamRef.current) {
      return
    }

    streamRef.current.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }

  const handleRequestPermission = async () => {
    setPermissionState('loading')
    setErrorMessage('')
    setCapturedImage('')

    try {
      stopStream()

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
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

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) {
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setErrorMessage('카메라 화면이 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.')
      return
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const context = canvas.getContext('2d')

    if (!context) {
      setErrorMessage('사진을 저장할 수 없습니다. 다시 시도해주세요.')
      return
    }

    context.save()
    context.translate(canvas.width, 0)
    context.scale(-1, 1)
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    context.restore()
    setCapturedImage(canvas.toDataURL('image/png'))
    setErrorMessage('')
  }

  useEffect(() => {
    return () => {
      stopStream()
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#efefef] px-6 py-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 rounded-3xl bg-white p-8 text-center shadow-sm">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Camera Check</p>
          <h1 className="text-3xl font-bold text-gray-900">초기 설정을 시작합니다. 카메라를 보고 웃어보세요!</h1>
          <p className="text-gray-600">카메라와 마이크 권한을 허용하면 실시간 화면을 확인하고 테스트 사진을 찍을 수 있어요.</p>
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
                {permissionState === 'granted' && '권한이 승인되었습니다. 미리보기가 정상적으로 보이는지 확인해주세요.'}
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
                onClick={handleCapture}
                disabled={permissionState !== 'granted'}
                className="rounded-xl bg-gray-900 px-4 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                사진 찍기
              </button>

              <button
                type="button"
                onClick={() => navigate('/interview/preparation')}
                disabled={!capturedImage}
                className="rounded-xl border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-800 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
              >
                다음
              </button>
            </div>
          </div>
        </div>

        <div className="w-full">
          <canvas ref={canvasRef} className="hidden" />

          <div className="mx-auto flex min-h-64 w-full max-w-2xl items-center justify-center overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-gray-50">
            {capturedImage ? (
              <img
                src={capturedImage}
                alt="웹캠 테스트 촬영 결과"
                className="h-full w-full object-cover"
              />
            ) : (
              <p className="px-6 text-sm text-gray-500">권한 승인 후 사진을 찍으면 이곳에 테스트 이미지가 표시됩니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SetupCheck
