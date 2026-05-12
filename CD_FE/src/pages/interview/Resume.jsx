import { useNavigate } from 'react-router-dom';
import { useInterview } from '../../contexts/InterviewContext.jsx';

function Resume() {
  const navigate = useNavigate();
  const { resumeText, setResumeText, setIndustry } = useInterview();

  const trimmedLength = resumeText.trim().length;
  const isValid = trimmedLength > 0 && trimmedLength <= 300;

  const handleNext = () => {
    if (!isValid) {
      return;
    }

    // Resume flow does not require industry input.
    setIndustry('');
    navigate('/interview/question-count');
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-[#efefef] text-center px-6">
      <h1 className="text-2xl font-bold">자소서 내용을 입력해주세요</h1>
      <p className="text-gray-700">최대 300자까지 입력할 수 있습니다.</p>

      <textarea
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value.slice(0, 300))}
        placeholder="자소서 핵심 경험, 지원 동기, 성과를 입력해주세요."
        rows={8}
        className="w-full max-w-2xl rounded border border-gray-300 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <p className="text-sm text-gray-600">{trimmedLength}/300자</p>

      <button
        type="button"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        onClick={handleNext}
        disabled={!isValid}
      >
        다음
      </button>
    </div>
  );
}

export default Resume;
