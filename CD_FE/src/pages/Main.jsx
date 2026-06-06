import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIndividualReportsFromApi } from '../api/reportApi';

const getReportCreatedAt = (report) =>
  report?.created_at ??
  report?.Created_at ??
  report?.Created_At ??
  report?.createdAt ??
  report?.report?.created_at ??
  report?.report?.Created_at ??
  report?.report?.Created_At ??
  report?.report?.createdAt ??
  report?.interview?.created_at ??
  report?.interview?.Created_at ??
  report?.interview?.Created_At ??
  report?.interview?.createdAt ??
  '';

const parseReportDate = (dateValue) => {
  if (!dateValue) {
    return null;
  }

  if (dateValue instanceof Date) {
    return Number.isNaN(dateValue.getTime()) ? null : dateValue;
  }

  if (typeof dateValue === 'string') {
    const dateMatch = dateValue.match(
      /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?)?/,
    );

    if (dateMatch) {
      const [, year, month, day, hour = '0', minute = '0', second = '0'] =
        dateMatch;

      return new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
        Number(second),
      );
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

const formatReportTime = (date) => {
  if (!date) {
    return '날짜 없음';
  }

  const today = getStartOfToday();
  const reportDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayDiff = Math.floor((today - reportDay) / (1000 * 60 * 60 * 24));

  if (dayDiff === 0) {
    return '오늘';
  }

  if (dayDiff === 1) {
    return '어제';
  }

  if (dayDiff > 1 && dayDiff < 7) {
    return `${dayDiff}일 전`;
  }

  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}.${String(date.getDate()).padStart(2, '0')}`;
};

const feedbackRules = [
  {
    tag: '시선',
    isWeak: (detail) => Number(detail?.eyeContactRate) < 85,
  },
  {
    tag: '발화 속도',
    isWeak: (detail) => {
      const value = Number(detail?.speechRate);
      return value > 0 && (value < 250 || value > 350);
    },
  },
  {
    tag: '음량',
    isWeak: (detail) => {
      const value = Number(detail?.voiceVolume);
      return value !== 0 && (value < -35 || value > -20);
    },
  },
  {
    tag: '침묵',
    isWeak: (detail) => Number(detail?.silenceCount) > 3,
  },
  {
    tag: '필러어',
    isWeak: (detail) => Number(detail?.fillerCount) > 3,
  },
  {
    tag: '표정',
    isWeak: (detail) => {
      const value = Number(detail?.smileRate);
      return value > 0 && (value < 10 || value > 20);
    },
  },
  {
    tag: '자세',
    isWeak: (detail) =>
      Number(detail?.bodyShake) > 0 || Number(detail?.shoulderTilt) < 90,
  },
];

const getFeedbackTags = (detail = {}) => {
  const tags = feedbackRules
    .filter((rule) => rule.isWeak(detail))
    .map((rule) => rule.tag);

  return tags.length > 0 ? tags.slice(0, 2) : ['상세 분석'];
};

const formatReportCard = (report, index) => {
  const createdAt = parseReportDate(getReportCreatedAt(report));
  const reportId = report.id ?? report.interview_id ?? report.session;

  return {
    id: reportId,
    sortTime: createdAt?.getTime() ?? 0,
    round: `${reportId ?? index + 1}회차`,
    time: formatReportTime(createdAt),
    title:
      report.title ||
      report.interviewTypeLabel ||
      report.interviewType ||
      '면접 리포트',
    summary: report.interviewTypeLabel
      ? `${report.interviewTypeLabel} 분석 완료`
      : '면접 분석 결과를 확인할 수 있습니다.',
    tags: getFeedbackTags(report.detail),
  };
};

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

function Main() {
  const navigate = useNavigate();
  const [recentReports, setRecentReports] = useState([]);
  const [isReportLoading, setIsReportLoading] = useState(true);
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
        setRecentReports(
          reportList
            .map(formatReportCard)
            .sort((a, b) => b.sortTime - a.sortTime)
            .slice(0, 3),
        );
      } catch (error) {
        console.error('메인 연습 통계 조회 실패:', error);
      } finally {
        if (isMounted) {
          setIsReportLoading(false);
        }
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

          {isReportLoading ? (
            <div className="rounded-[14px] border border-slate-200 bg-white px-6 py-10 text-center text-sm font-bold text-slate-500 shadow-sm">
              최근 리포트를 불러오는 중입니다.
            </div>
          ) : recentReports.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {recentReports.map((report) => (
                <button
                  type="button"
                  key={report.id ?? report.round}
                  className="min-h-[214px] rounded-[14px] border border-slate-200 bg-white px-6 py-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  onClick={() =>
                    navigate(
                      report.id ? `/report/individual/${report.id}` : '/report',
                    )
                  }
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
          ) : (
            <div className="rounded-[14px] border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
              <p className="text-base font-extrabold text-slate-950">
                아직 생성된 리포트가 없습니다.
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-500">
                면접 연습을 완료하면 최근 리포트가 표시됩니다.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Main;
