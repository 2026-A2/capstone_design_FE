import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIndividualReportsFromApi } from '../api/reportApi';

const getReportCreatedAt = (report) =>
  report?.created_at ??
  report?.Created_at ??
  report?.Created_At ??
  report?.createdAt ??
  report?.date ??
  '';

const parseReportDate = (dateValue) => {
  if (!dateValue) {
    return null;
  }

  if (dateValue instanceof Date) {
    return Number.isNaN(dateValue.getTime()) ? null : dateValue;
  }

  if (typeof dateValue === 'string') {
    const dateOnlyMatch = dateValue.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (dateOnlyMatch) {
      const [, year, month, day] = dateOnlyMatch;
      return new Date(Number(year), Number(month) - 1, Number(day));
    }
  }

  const parsedDate = new Date(dateValue);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const getStartOfToday = () => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
};

const getStartOfWeek = (date) => {
  const start = new Date(date);
  const day = start.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + mondayOffset);
  start.setHours(0, 0, 0, 0);
  return start;
};

const isSameDay = (date, targetDate) =>
  date.getFullYear() === targetDate.getFullYear() &&
  date.getMonth() === targetDate.getMonth() &&
  date.getDate() === targetDate.getDate();

const buildStats = ({ totalPracticeCount, weeklyPracticeCount, hasTodayPractice }) => [
  {
    label: '총 연습 횟수',
    value: `${totalPracticeCount}회`,
    detail: `+${weeklyPracticeCount} 이번 주`,
    tone: 'text-blue-600',
  },
  {
    label: '이번 주 연습',
    value: `${weeklyPracticeCount}회`,
    detail: '이번 주 생성된 리포트',
    tone: 'text-emerald-500',
  },
  { label: '주요 개선 항목', value: '시선 처리', detail: '3회 연속 지적', tone: 'text-amber-500' },
  {
    label: '오늘의 연습',
    value: hasTodayPractice ? '완료' : '미완료',
    detail: hasTodayPractice ? '오늘 리포트 생성됨' : '지금 시작하기 ->',
    tone: hasTodayPractice ? 'text-emerald-500' : 'text-red-500',
  },
];

const reports = [
  {
    round: '12회차',
    time: '오늘 14:32',
    title: '프론트엔드 개발자 면접',
    summary: '필러어 줄이기 + 자세 유지에 집중',
    tags: ['자세', '시선'],
  },
  {
    round: '11회차',
    time: '2일 전',
    title: '프론트엔드 개발자 면접',
    summary: '발화 속도 안정 · 표정 다소 경직',
    tags: ['표정', '발화 속도'],
  },
  {
    round: '10회차',
    time: '1주 전',
    title: '프론트엔드 개발자 면접',
    summary: '전반적으로 안정 · 손동작 빈도 ↑',
    tags: ['습관', '손동작'],
  },
];

function Main() {
  const navigate = useNavigate();
  const [practiceSummary, setPracticeSummary] = useState({
    totalPracticeCount: 0,
    weeklyPracticeCount: 0,
    hasTodayPractice: false,
  });

  useEffect(() => {
    let isMounted = true;

    const loadPracticeSummary = async () => {
      try {
        const reportList = await getIndividualReportsFromApi();
        const today = getStartOfToday();
        const weekStart = getStartOfWeek(today);
        const nextWeekStart = new Date(weekStart);
        nextWeekStart.setDate(weekStart.getDate() + 7);

        const reportDates = reportList
          .map((report) => parseReportDate(getReportCreatedAt(report)))
          .filter(Boolean);

        if (!isMounted) {
          return;
        }

        setPracticeSummary({
          totalPracticeCount: reportList.length,
          weeklyPracticeCount: reportDates.filter(
            (date) => date >= weekStart && date < nextWeekStart,
          ).length,
          hasTodayPractice: reportDates.some((date) => isSameDay(date, today)),
        });
      } catch (error) {
        console.error('메인 연습 통계 조회 실패:', error);
      }
    };

    loadPracticeSummary();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => buildStats(practiceSummary), [practiceSummary]);

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[74px] max-w-[1640px] items-center justify-between px-6 sm:px-10 xl:px-12">
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
              <button
                type="button"
                className="h-full px-1 transition hover:text-[#263f98]"
                onClick={() => navigate('/settings/analysis-guide')}
              >
                분석 기준
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

      <main className="mx-auto max-w-[1640px] px-6 py-7 sm:px-10 xl:px-12">
        <section className="relative isolate min-h-[336px] overflow-hidden rounded-[24px] bg-[#263f98] px-8 py-12 text-white shadow-sm sm:px-14 lg:px-14">
          <div className="absolute -right-16 -top-32 h-[520px] w-[520px] rounded-full bg-[#4969df]" />
          <div className="absolute bottom-[-150px] right-[12%] h-[390px] w-[390px] rounded-full bg-[#7289df]" />

          <div className="relative z-[1] flex max-w-[620px] flex-col items-start">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-blue-50">
              <span className="h-2 w-2 rounded-full bg-[#ff6b61]" />
              AI 면접 분석
            </span>

            <h1 className="mt-7 text-[34px] font-extrabold leading-tight tracking-normal sm:text-[44px]">
              오늘도 면접 연습을
              <br />
              같이 한번 해볼까요?
            </h1>

            <p className="mt-7 text-sm font-medium leading-7 text-blue-100 sm:text-base">
              웹캠과 AI로 당신의 면접 태도를 분석하고, 맞춤형 피드백으로 성장을 도와드려요.
            </p>

            <div className="mt-7 flex w-full flex-col gap-4 sm:flex-row">
              <button
                type="button"
                className="flex h-[60px] items-center justify-center gap-3 rounded-[20px] bg-[#ff675e] px-9 text-base font-extrabold text-white transition hover:bg-[#f25750] sm:min-w-[217px]"
                onClick={() => navigate('/interview')}
              >
                <span className="h-0 w-0 border-b-[9px] border-l-[6px] border-r-[6px] border-b-white border-l-transparent border-r-transparent" />
                면접 시작
              </button>

              <button
                type="button"
                className="h-[60px] rounded-[14px] bg-white/10 px-9 text-base font-bold text-white transition hover:bg-white/15 sm:min-w-[165px]"
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
                className="min-h-[214px] rounded-[14px] border border-slate-200 bg-white px-6 py-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                onClick={() => navigate('/report')}
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-extrabold text-[#263f98]">
                    {report.round}
                  </span>
                  <span className="text-sm font-medium text-slate-500">{report.time}</span>
                </div>

                <p className="mt-4 text-base font-extrabold text-slate-950 sm:text-lg">{report.title}</p>
                <p className="mt-3 text-sm font-medium text-slate-600">{report.summary}</p>

                <span className="mt-6 inline-flex rounded-full bg-emerald-100 px-5 py-2 text-xs font-extrabold text-emerald-600">
                  ✓ 완료
                </span>

                <div className="mt-5 flex flex-wrap items-center gap-7">
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
