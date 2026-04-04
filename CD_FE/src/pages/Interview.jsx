import { useNavigate } from 'react-router-dom'

function Interview() {
	const navigate = useNavigate()

	return (
		<div className="h-screen flex flex-col items-center justify-center gap-4 bg-[#efefef] text-center">
			<h1 className="text-2xl font-bold">원하는 질문 유형은 어떻게 되시나요?</h1>

			<button type="button" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
				자소서 기반
			</button>

			<button
				type="button"
				className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
				onClick={() => navigate('/industry')}
			>
				산업 기반
			</button>
		</div>
	)
}

export default Interview
