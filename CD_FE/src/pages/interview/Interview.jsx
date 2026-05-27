import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../../contexts/InterviewContext.jsx';

const questionTypes = [
  {
    id: 'resume',
    title: '자소서 기반',
    description: '업로드한 자소서의 경험 · 강점을 분석해 나만의 깊이 있는 맞춤형 질문을 만들어요.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
        <path
          d="M7 3h7l4 4v14H7V3Z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <path
          d="M14 3v5h4M9.5 13h5M9.5 17h5M9.5 9.5h2"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    ),
    tags: ['맞춤형 질문', '심층 인터뷰'],
    nextPath: '/interview/resume',
  },
  {
    id: 'industry',
    title: '산업 기반',
    description: '지원 산업 · 직무에서 자주 나오는 기출 패턴 질문으로 폭넓게 연습해요.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
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
    ),
    tags: ['범용 질문', '기출 패턴'],
    nextPath: '/industry',
  },
];

function Interview() {
  const navigate = useNavigate();
  const { setQuestionType } = useInterview();
  const [selectedType, setSelectedType] = useState('resume');

  const selectedQuestionType = questionTypes.find((type) => type.id === selectedType) || questionTypes[0];

  const handleStart = () => {
    setQuestionType(selectedQuestionType.id);
    navigate(selectedQuestionType.nextPath);
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

      <main className="mx-auto flex w-full max-w-[1060px] flex-col px-6 pb-16 pt-20 sm:px-8 lg:pt-[78px]">
        <section className="text-center">
          <h1 className="text-[26px] font-extrabold leading-tight tracking-normal text-[#202945] sm:text-[30px]">
            원하는 질문 유형은 어떻게 되시나요?
          </h1>
          <p className="mt-4 text-sm font-medium text-[#687085]">
            선택한 유형에 맞춰 AI가 맞춤 질문을 준비할게요.
          </p>
        </section>

        <section className="mt-14 grid gap-6 md:grid-cols-2">
          {questionTypes.map((type) => {
            const isSelected = selectedType === type.id;

            return (
              <button
                type="button"
                key={type.id}
                className={`relative flex min-h-[260px] flex-col rounded-[16px] border px-8 py-8 text-left transition hover:border-[#3142aa] hover:shadow-sm sm:min-h-[334px] ${
                  isSelected
                    ? 'border-2 border-[#3142aa] bg-[#e9edff]'
                    : 'border-[#dfe3ec] bg-white'
                }`}
                onClick={() => setSelectedType(type.id)}
              >
                <span
                  className={`flex h-[55px] w-[55px] items-center justify-center rounded-[11px] ${
                    isSelected ? 'bg-[#303aa3] text-white' : 'bg-[#e8ecff] text-[#303aa3]'
                  }`}
                >
                  {type.icon}
                </span>

                <span className="mt-7 block text-[26px] font-extrabold leading-none text-[#1f2948]">
                  {type.title}
                </span>
                <span className="mt-7 block max-w-[310px] text-[14px] font-medium leading-7 text-[#646c80]">
                  {type.description}
                </span>

                <span className="mt-5 flex flex-wrap gap-2">
                  {type.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`rounded-full px-3 py-1.5 text-xs font-extrabold ${
                        isSelected ? 'bg-white text-[#303aa3]' : 'bg-[#f6f7f9] text-[#687085]'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </span>

                <span
                  className={`absolute right-8 top-10 flex h-7 w-7 items-center justify-center rounded-full border text-sm font-extrabold ${
                    isSelected
                      ? 'border-[#303aa3] bg-[#303aa3] text-white'
                      : 'border-[#d9dee8] bg-white text-transparent'
                  }`}
                  aria-hidden="true"
                >
                  ✓
                </span>
              </button>
            );
          })}
        </section>

        <div className="mt-12 flex items-center justify-between gap-4 px-0 sm:mt-12 sm:px-5">
          <button
            type="button"
            className="flex h-[50px] items-center gap-2 rounded-full px-4 text-[15px] font-bold text-[#596274] transition hover:bg-white hover:text-[#263f98]"
            onClick={() => navigate('/main')}
          >
            <span className="text-xl leading-none" aria-hidden="true">
              ‹
            </span>
            이전
          </button>

          <button
            type="button"
            className="h-[50px] min-w-[182px] rounded-[22px] bg-[#263f98] px-8 text-[15px] font-extrabold text-white transition hover:bg-[#1f347e] focus:outline-none focus:ring-4 focus:ring-blue-100"
            onClick={handleStart}
          >
            다음 →
          </button>
        </div>
      </main>
    </div>
  );
}

export default Interview;
