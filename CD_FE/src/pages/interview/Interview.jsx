import { useNavigate } from 'react-router-dom'
import { useInterview } from '../../contexts/InterviewContext.jsx'

function Interview() {
	const navigate = useNavigate()
	const { setQuestionType } = useInterview()

	const handleIndustryBased = () => {
		setQuestionType('industry')
		navigate('/industry')
	}

	const handleResumeBased = () => {
		setQuestionType('resume')
		navigate('/interview/resume')
	}

	return (
		<div className="h-screen flex flex-col items-center justify-center gap-4 bg-[#efefef] text-center">
			<h1 className="text-2xl font-bold">원하는 질문 유형은 어떻게 되시나요?</h1>

			<button
				type="button"
				className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
				onClick={handleResumeBased}
			>
				자소서 기반
			</button>

			<button
				type="button"
				className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
				onClick={handleIndustryBased}
			>
				산업 기반
			</button>
		</div>
	)
}

export default Interview
