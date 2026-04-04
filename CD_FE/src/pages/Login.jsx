import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#efefef] text-center gap-4">
      <h1 className="text-3xl font-bold px-10">웹캠으로 면접 때 버릇을 알아보자</h1>
      <button
        type="button"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => navigate('/main')}
      >
        로그인
      </button>
      <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        회원가입
      </button>
    </div>
  )
}

export default Login