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

    setIndustry('');
    navigate('/interview/question-count');
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-[72px] max-w-[1640px] items-center justify-between px-6 sm:px-10 xl:px-12">
          <div className="flex h-full items-center gap-12">
            <button
              type="button"
              className="flex items-center gap-3 text-left"
              onClick={() => navigate('/main')}
            >
              <span className="h-7 w-7 rounded-md bg-[#263f98]" />
              <span className="text-xl font-extrabold text-[#1f3d91]">InterviewLens</span>
            </button>

            <nav className="hidden h-full items-center gap-9 text-base font-bold text-slate-600 md:flex">
              <button
                type="button"
                className="h-full border-b-[3px] border-[#263f98] px-1 text-[#263f98]"
                onClick={() => navigate('/interview')}
              >
                면접 연습
              </button>
              <button
                type="button"
                className="h-full px-1 transition hover:text-[#263f98]"
                onClick={() => navigate('/report')}
              >
                결과 리포트
              </button>
              <button
                type="button"
                className="h-full px-1 transition hover:text-[#263f98]"
                onClick={() => navigate('/settings/resume')}
              >
                내 자소서
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-5">
            <button
              type="button"
              aria-label="분석 기준 안내"
              className="h-8 w-8 rounded-full bg-slate-100 transition hover:bg-slate-200"
              onClick={() => navigate('/settings/analysis-guide')}
            />
            <button
              type="button"
              aria-label="내 자소서 관리"
              className="h-11 w-11 rounded-full bg-blue-100 transition hover:bg-blue-200"
              onClick={() => navigate('/settings/resume')}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-[1120px] flex-col items-center px-6 py-16 sm:px-10">
        <div className="text-center">
          <h1 className="text-[32px] font-extrabold tracking-normal text-slate-950 sm:text-[38px]">
            자소서를 등록해 주세요
          </h1>
          <p className="mt-3 text-base font-medium text-slate-600">
            자소서를 기반으로 맞춤 질문이 나옵니다.
          </p>
        </div>

        <section className="mt-12 w-full max-w-[980px] rounded-[24px] border border-slate-200 bg-white px-7 py-8 shadow-sm sm:px-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-[12px] bg-[#263f98] px-8 py-3 text-base font-extrabold text-white">
              자소서 입력
            </span>
            <span className={`text-sm font-bold ${trimmedLength > 300 ? 'text-red-500' : 'text-slate-500'}`}>
              {trimmedLength}/300자
            </span>
          </div>

          <div className="mt-7 rounded-[18px] border-2 border-dashed border-blue-500 bg-[#f7f9ff] p-4">
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value.slice(0, 300))}
              placeholder="자소서 핵심 경험, 지원 동기, 성과를 입력해주세요."
              rows={10}
              className="min-h-[260px] w-full resize-none rounded-[14px] border border-transparent bg-white px-5 py-5 text-base leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <p className="mt-4 text-sm font-medium text-slate-500">
            지원 형식 · 텍스트 직접 입력 · 최대 300자
          </p>

          <div className="mt-5 rounded-[12px] bg-blue-50 px-5 py-4 text-sm font-bold text-slate-600">
            자소서 키워드를 분석해 직무에 맞는 질문을 만들어드려요.
          </div>
        </section>

        <div className="mt-6 flex w-full max-w-[980px] items-center justify-between gap-4">
          <button
            type="button"
            className="h-[58px] min-w-[146px] rounded-[14px] border border-slate-200 bg-white px-8 text-base font-extrabold text-slate-600 transition hover:bg-slate-50"
            onClick={() => navigate('/interview')}
          >
            ← 이전
          </button>

          <button
            type="button"
            className="h-[58px] min-w-[210px] rounded-[14px] bg-[#263f98] px-10 text-base font-extrabold text-white transition hover:bg-[#1f347e] disabled:cursor-not-allowed disabled:bg-slate-300"
            onClick={handleNext}
            disabled={!isValid}
          >
            다음 →
          </button>
        </div>
      </main>
    </div>
  );
}

export default Resume;
