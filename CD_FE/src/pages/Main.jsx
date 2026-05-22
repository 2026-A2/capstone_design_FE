import { useNavigate } from 'react-router-dom';

const stats = [
  { label: '총 연습 횟수', value: '12회', detail: '+3 이번 주', tone: 'text-blue-600' },
  { label: '평균 점수', value: '84점', detail: '▲ 6점', tone: 'text-emerald-500' },
  { label: '주요 개선 항목', value: '시선 처리', detail: '3회 연속 지적', tone: 'text-amber-500' },
  { label: '오늘의 연습', value: '미완료', detail: '지금 시작하기 ->', tone: 'text-red-500' },
];

const reports = [
  {
    round: '12회차',
    time: '오늘 14:32',
    name: '변지은',
    score: '87점',
    color: 'border-emerald-500',
    tags: ['자세', '시선'],
  },
  {
    round: '11회차',
    time: '2일 전',
    name: '변지은',
    score: '79점',
    color: 'border-amber-500',
    tags: ['표정', '발화 속도'],
  },
  {
    round: '10회차',
    time: '1주 전',
    name: '변지은',
    score: '82점',
    color: 'border-blue-600',
    tags: ['습관', '손동작'],
  },
];

function Main() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[74px] max-w-[1640px] items-center justify-between px-6 sm:px-10 xl:px-12">
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
            <button
              type="button"
              className="h-full px-1 transition hover:text-[#263f98]"
              onClick={() => navigate('/settings/analysis-guide')}
            >
              분석 기준
            </button>
          </nav>

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

      <main className="mx-auto max-w-[1640px] px-6 py-7 sm:px-10 xl:px-12">
        <section className="relative isolate min-h-[410px] overflow-hidden rounded-[28px] bg-[#263f98] px-8 py-14 text-white shadow-sm sm:px-16 lg:px-[68px]">
          <div className="absolute -right-16 -top-32 h-[520px] w-[520px] rounded-full bg-[#4969df]" />
          <div className="absolute bottom-[-150px] right-[12%] h-[390px] w-[390px] rounded-full bg-[#7289df]" />

          <div className="relative z-[1] flex max-w-[620px] flex-col items-start">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-blue-50">
              <span className="h-2 w-2 rounded-full bg-[#ff6b61]" />
              AI 면접 분석
            </span>

            <h1 className="mt-8 text-[40px] font-extrabold leading-tight tracking-normal sm:text-[52px]">
              오늘도 면접 연습을
              <br />
              같이 한번 해볼까요?
            </h1>

            <p className="mt-8 text-base font-medium leading-7 text-blue-100">
              웹캠과 AI로 당신의 면접 태도를 분석하고, 맞춤형 피드백으로 성장을 도와드려요.
            </p>

            <div className="mt-8 flex w-full flex-col gap-4 sm:flex-row">
              <button
                type="button"
                className="flex h-[72px] items-center justify-center gap-3 rounded-[26px] bg-[#ff675e] px-10 text-lg font-extrabold text-white transition hover:bg-[#f25750] sm:min-w-[265px]"
                onClick={() => navigate('/interview')}
              >
                <span className="h-0 w-0 border-b-[9px] border-l-[6px] border-r-[6px] border-b-white border-l-transparent border-r-transparent" />
                면접 시작
              </button>

              <button
                type="button"
                className="h-[72px] rounded-[16px] bg-white/10 px-10 text-lg font-bold text-white transition hover:bg-white/15 sm:min-w-[205px]"
                onClick={() => navigate('/settings/resume')}
              >
                내 자소서 관리
              </button>
            </div>
          </div>
        </section>

        <section className="mt-9 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <button
              type="button"
              key={item.label}
              className="min-h-[148px] rounded-[18px] border border-slate-200 bg-white px-7 py-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              onClick={item.label === '오늘의 연습' ? () => navigate('/interview') : undefined}
            >
              <p className="text-sm font-bold text-slate-500">{item.label}</p>
              <p className="mt-4 text-[38px] font-extrabold leading-none text-slate-950">{item.value}</p>
              <p className={`mt-4 text-sm font-bold ${item.tone}`}>{item.detail}</p>
            </button>
          ))}
        </section>

        <section className="mt-9">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[28px] font-extrabold tracking-normal text-slate-950">최근 연습 리포트</h2>
            <button
              type="button"
              className="text-sm font-extrabold text-[#263f98] transition hover:text-blue-700"
              onClick={() => navigate('/report')}
            >
              {'전체 보기 ->'}
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {reports.map((report) => (
              <button
                type="button"
                key={report.round}
                className="min-h-[264px] rounded-[18px] border border-slate-200 bg-white px-7 py-7 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                onClick={() => navigate('/report')}
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-extrabold text-[#263f98]">
                    {report.round}
                  </span>
                  <span className="text-sm font-medium text-slate-500">{report.time}</span>
                </div>

                <p className="mt-4 text-xl font-extrabold text-slate-950">{report.name}</p>

                <div className="mt-5 flex items-center gap-5">
                  <span className={`flex h-[86px] w-[86px] items-center justify-center rounded-full border-[5px] ${report.color} text-[28px] font-extrabold`}>
                    {report.score}
                  </span>
                  <span className="text-sm font-bold text-slate-500">종합 점수</span>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-8">
                  <span className="text-sm font-bold text-slate-500">주요 피드백</span>
                  {report.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-[#ff675e]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Main;
