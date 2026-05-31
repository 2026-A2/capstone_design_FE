import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getResumes } from '../../api/resumeApi';
import { useInterview } from '../../contexts/InterviewContext.jsx';

function Resume() {
  const navigate = useNavigate();
  const {
    resumeText,
    savedResumes,
    setResumeText,
    setIndustry,
    setQuestionType,
    setSavedResumes,
  } = useInterview();
  const [inputMode, setInputMode] = useState('direct');
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [loadState, setLoadState] = useState('idle');
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let ignore = false;

    const loadResumes = async () => {
      setLoadState('loading');
      setLoadError('');

      try {
        const resumes = await getResumes();
        if (!ignore) {
          setSavedResumes(resumes);
          setLoadState('success');
        }
      } catch (error) {
        console.error('[resume list:failure]', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        if (!ignore) {
          setLoadState('error');
          setLoadError('저장된 자소서를 불러오지 못했습니다.');
        }
      }
    };

    loadResumes();

    return () => {
      ignore = true;
    };
  }, [setSavedResumes]);

  const trimmedLength = resumeText.trim().length;
  const isValid = trimmedLength > 0 && trimmedLength <= 300;

  const handleSelectResume = (resume) => {
    setInputMode('saved');
    setSelectedResumeId(resume.id);
    setResumeText((resume.content || '').slice(0, 300));
  };

  const handleSavedMode = () => {
    setInputMode('saved');

    const selectedResume = savedResumes.find(
      (resume) => resume.id === selectedResumeId,
    );

    setResumeText((selectedResume?.content || '').slice(0, 300));
  };

  const handleDirectInput = (value) => {
    setInputMode('direct');
    setSelectedResumeId(null);
    setResumeText(value.slice(0, 300));
  };

  const handleNext = () => {
    if (!isValid) {
      return;
    }

    setQuestionType('resume');
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
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-6">
            <div className="flex rounded-[14px] bg-slate-100 p-1">
              <button
                type="button"
                className={`h-11 rounded-[11px] px-5 text-sm font-extrabold transition ${
                  inputMode === 'direct'
                    ? 'bg-[#263f98] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#263f98]'
                }`}
                onClick={() => setInputMode('direct')}
              >
                직접 입력
              </button>
              <button
                type="button"
                className={`h-11 rounded-[11px] px-5 text-sm font-extrabold transition ${
                  inputMode === 'saved'
                    ? 'bg-[#263f98] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#263f98]'
                }`}
                onClick={handleSavedMode}
              >
                저장된 자소서
              </button>
            </div>

            <span className={`text-sm font-bold ${trimmedLength > 300 ? 'text-red-500' : 'text-slate-500'}`}>
              {trimmedLength}/300자
            </span>
          </div>

          {inputMode === 'saved' && (
            <div className="mt-7">
              {loadState === 'loading' && (
                <div className="rounded-[16px] border border-slate-200 bg-slate-50 px-5 py-6 text-center text-sm font-bold text-slate-500">
                  저장된 자소서를 불러오는 중입니다.
                </div>
              )}

              {loadError && (
                <div className="rounded-[16px] border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-600">
                  {loadError}
                </div>
              )}

              {loadState !== 'loading' && savedResumes.length === 0 && (
                <div className="rounded-[16px] border border-slate-200 bg-slate-50 px-5 py-6 text-center">
                  <p className="text-sm font-bold text-slate-600">
                    저장된 자소서가 없습니다.
                  </p>
                  <button
                    type="button"
                    className="mt-4 h-11 rounded-[12px] bg-[#263f98] px-5 text-sm font-extrabold text-white transition hover:bg-[#1f347e]"
                    onClick={() => navigate('/settings/resume/new')}
                  >
                    자소서 등록하기
                  </button>
                </div>
              )}

              {savedResumes.length > 0 && (
                <div className="grid gap-3">
                  {savedResumes.map((resume) => (
                    <button
                      type="button"
                      key={resume.id}
                      className={`rounded-[16px] border px-5 py-4 text-left transition hover:border-[#263f98] hover:bg-[#f7f9ff] ${
                        selectedResumeId === resume.id
                          ? 'border-[#263f98] bg-[#f7f9ff] ring-4 ring-blue-100'
                          : 'border-slate-200 bg-white'
                      }`}
                      onClick={() => handleSelectResume(resume)}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <strong className="text-base font-extrabold text-slate-950">
                          {resume.title || '제목 없는 자소서'}
                        </strong>
                        <span className="text-xs font-bold text-slate-400">
                          {(resume.content || '').length}자
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-slate-500">
                        {resume.content || '내용 없음'}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {inputMode === 'direct' && (
            <div className="mt-7 rounded-[18px] border-2 border-dashed border-blue-500 bg-[#f7f9ff] p-4">
              <textarea
                value={resumeText}
                onChange={(e) => handleDirectInput(e.target.value)}
                placeholder="자소서 핵심 경험, 지원 동기, 성과를 입력해주세요."
                rows={10}
                className="min-h-[260px] w-full resize-none rounded-[14px] border border-transparent bg-white px-5 py-5 text-base leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          )}

          <p className="mt-4 text-sm font-medium text-slate-500">
            지원 형식 · 텍스트 직접 입력 또는 저장된 자소서 선택 · 최대 300자
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
