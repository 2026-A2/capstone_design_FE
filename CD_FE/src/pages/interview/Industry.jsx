import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../../contexts/InterviewContext.jsx';

const jobExamples = [
  {
    title: '프론트엔드 개발자',
    description: 'React · TypeScript · UI',
    icon: '💻',
  },
  {
    title: '백엔드 개발자',
    description: 'API · DB · 인프라',
    icon: '⚙️',
  },
  {
    title: '데이터 분석가',
    description: 'SQL · Python · 통계',
    icon: '📊',
  },
  {
    title: '기획 / PM',
    description: '기획서 · 우선순위 · 조율',
    icon: '📋',
  },
  {
    title: 'UX/UI 디자이너',
    description: 'Figma · 사용자 리서치',
    icon: '🎨',
  },
  {
    title: '마케팅',
    description: '캠페인 · 데이터 분석',
    icon: '📣',
  },
  {
    title: '영업 / 세일즈',
    description: '고객 미팅 · 협상',
    icon: '🤝',
  },
  {
    title: 'CS / 운영',
    description: '고객 응대 · 프로세스',
    icon: '📞',
  },
  {
    title: 'HR / 인사',
    description: '채용 · 조직 문화',
    icon: '👥',
  },
  {
    title: '재무 / 회계',
    description: '재무제표 · 예산',
    icon: '💰',
  },
  {
    title: '법무 / 컴플라이언스',
    description: '계약 · 규제',
    icon: '⚖️',
  },
  {
    title: '기타 / 직접 입력',
    description: '위에 없는 직무',
    icon: '✏️',
  },
];

function Industry() {
  const navigate = useNavigate();
  const { industry, setIndustry, setQuestionType } = useInterview();
  const [jobName, setJobName] = useState(industry);

  const trimmedJobName = jobName.trim();
  const isValid = trimmedJobName.length > 0;

  const handleExampleSelect = (title) => {
    if (title === '기타 / 직접 입력') {
      setJobName('');
      return;
    }

    setJobName(title);
  };

  const handleNext = () => {
    if (!isValid) {
      return;
    }

    setQuestionType('industry');
    setIndustry(trimmedJobName);
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

      <main className="mx-auto flex max-w-[1400px] flex-col items-center px-6 py-16 sm:px-10">
        <div className="text-center">
          <h1 className="text-[32px] font-extrabold tracking-normal text-slate-950 sm:text-[38px]">
            어떤 직무로 면접을 보시나요?
          </h1>
          <p className="mt-3 text-base font-medium text-slate-600">
            입력한 직무에 맞는 질문이 준비됩니다.
          </p>
        </div>

        <div className="mt-12 w-full max-w-[620px]">
          <label className="sr-only" htmlFor="job-name">
            직무명 입력
          </label>
          <input
            id="job-name"
            type="text"
            value={jobName}
            onChange={(e) => setJobName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleNext();
              }
            }}
            placeholder="예: 프론트엔드 개발자, 데이터 분석가, 마케팅 매니저"
            className="h-[58px] w-full rounded-[14px] border border-slate-200 bg-white px-6 text-base font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#263f98] focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <section className="mt-9 grid w-full gap-5 md:grid-cols-2 xl:grid-cols-4">
          {jobExamples.map((job) => {
            const isSelected = job.title === trimmedJobName;

            return (
              <button
                type="button"
                key={job.title}
                className={`flex min-h-[118px] items-center gap-4 rounded-[14px] border bg-white px-6 py-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                  isSelected
                    ? 'border-[#263f98] bg-blue-50 ring-1 ring-[#263f98]'
                    : 'border-slate-200'
                }`}
                onClick={() => handleExampleSelect(job.title)}
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[12px] bg-slate-50 text-2xl">
                  {job.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-lg font-extrabold text-slate-950">{job.title}</span>
                  <span className="mt-2 block text-sm font-medium text-slate-500">{job.description}</span>
                </span>
              </button>
            );
          })}
        </section>

        <div className="mt-14 flex w-full max-w-[1200px] items-center justify-between gap-4">
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

export default Industry;
