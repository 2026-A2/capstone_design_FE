import { useInterview } from '../../contexts/InterviewContext.jsx'

function QuestionsResult() {
  const { industry, resumeText, questionType, questionCount, questions } = useInterview()

  return (
    <div className="min-h-screen bg-[#efefef] px-6 py-12">
      <div className="mx-auto w-full max-w-3xl rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-center">생성된 면접 질문</h1>
        <p className="mt-2 text-center text-gray-700">질문 유형: {questionType || '미선택'}</p>
        {questionType === 'industry' && (
          <p className="text-center text-gray-700">산업: {industry || '미선택'} / 질문 개수: {questionCount || '미선택'}</p>
        )}
        {questionType === 'resume' && (
          <p className="text-center text-gray-700">자소서 길이: {resumeText.trim().length}자 / 질문 개수: {questionCount || '미선택'}</p>
        )}

        {questions.length === 0 ? (
          <p className="mt-6 text-center text-gray-600">아직 생성된 질문이 없습니다.</p>
        ) : (
          <ol className="mt-6 space-y-3 list-decimal list-inside">
            {questions.map((question, index) => (
              <li key={`${index}-${question}`} className="rounded border border-gray-200 bg-gray-50 px-4 py-3 text-left">
                {question}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}

export default QuestionsResult
