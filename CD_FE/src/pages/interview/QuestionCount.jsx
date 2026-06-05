import { useInterview } from '../../contexts/InterviewContext.jsx';
import { useNavigate } from 'react-router-dom';

const countOptions = [1, 2, 3, 4];
const normalizeQuestionCount = (count) => {
  const value = Number(count);

  if (!Number.isInteger(value)) {
    return 4;
  }

  return Math.min(Math.max(value, 1), 4);
};

function QuestionCount() {
  const navigate = useNavigate();
  const {
    questionType,
    industry,
    resumeText,
    questionCount,
    setQuestionCount,
    loading,
    error,
  } = useInterview();

  const selectedCount = normalizeQuestionCount(questionCount);
  const isValid = selectedCount >= 1 && selectedCount <= 4;
  const hasValidBasis =
    questionType === 'industry'
      ? Boolean(industry)
      : questionType === 'resume'
        ? Boolean(resumeText.trim())
        : false;

  const basisLabel =
    questionType === 'industry'
      ? `선택한 산업: ${industry || '미선택'}`
      : questionType === 'resume'
        ? '자소서 기반 질문'
        : '질문 유형 미선택';

  const previousPath =
    questionType === 'industry'
      ? '/industry'
      : questionType === 'resume'
        ? '/interview/resume'
        : '/interview';

  const handleNext = () => {
    if (!isValid || !hasValidBasis || loading) {
      return;
    }

    setQuestionCount(String(selectedCount));
    navigate('/interview/setup');
  };

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

      <main className="mx-auto flex w-full max-w-[1260px] flex-col px-6 pb-16 pt-24 sm:px-8 lg:pt-[100px]">
        <section className="text-center">
          <h1 className="text-[30px] font-extrabold leading-tight tracking-normal text-[#202945] sm:text-[38px]">
            질문 개수를 선택해주세요
          </h1>

          <div className="mt-6 flex justify-center">
            <span className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#e9edff] px-6 py-2 text-sm font-extrabold text-[#263f98]">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                <path
                  d="M4 20h16M6 20V9l5-3v14M13 20V5l5 3v12"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
                <path
                  d="M8.5 12h.01M8.5 16h.01M15.5 12h.01M15.5 16h.01"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                />
              </svg>
              {basisLabel}
            </span>
          </div>

          <p className="mt-7 text-base font-medium text-[#687085]">
            질문 개수는 1개부터 4개까지 선택할 수 있습니다.
          </p>
        </section>

        <section className="mt-[88px] grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {countOptions.map((count) => {
            const isSelected = selectedCount === count;

            return (
              <button
                type="button"
                key={count}
                className={`flex min-h-[178px] items-center justify-center rounded-[16px] border bg-white transition hover:border-[#3142aa] hover:shadow-sm sm:min-h-[236px] ${
                  isSelected
                    ? 'border-2 border-[#3142aa] bg-[#e9edff] text-[#303aa3]'
                    : 'border-[#dfe3ec] text-[#1f2948]'
                }`}
                onClick={() => setQuestionCount(String(count))}
              >
                <span className="flex items-end gap-2">
                  <span className="text-[72px] font-extrabold leading-none sm:text-[82px]">
                    {count}
                  </span>
                  <span className="pb-3 text-[22px] font-extrabold leading-none">개</span>
                </span>
              </button>
            );
          })}
        </section>

        {(error || !hasValidBasis || !questionType) && (
          <div className="mt-8 text-center text-sm font-bold text-red-500">
            {error ||
              (!questionType
                ? '먼저 질문 유형을 선택해주세요.'
                : questionType === 'industry'
                  ? '먼저 산업을 선택해주세요.'
                  : '먼저 자소서를 입력해주세요.')}
          </div>
        )}

        <div className="mt-14 flex items-center justify-between gap-4 px-0 sm:px-5">
          <button
            type="button"
            className="flex h-[50px] items-center gap-2 rounded-full px-4 text-[15px] font-bold text-[#596274] transition hover:bg-white hover:text-[#263f98]"
            onClick={() => navigate(previousPath)}
          >
            <span className="text-xl leading-none" aria-hidden="true">
              ‹
            </span>
            이전
          </button>

          <button
            type="button"
            className="h-[58px] min-w-[226px] rounded-[24px] bg-[#ff665b] px-10 text-[17px] font-extrabold text-white transition hover:bg-[#f05248] focus:outline-none focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={!isValid || !hasValidBasis || loading}
            onClick={handleNext}
          >
            면접 시작 →
          </button>
        </div>
      </main>
    </div>
  );
}

export default QuestionCount;
