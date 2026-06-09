import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIndividualReports } from '../../../api/reportApi';
import {
  ANALYSIS_METRICS,
  getItemStatus,
  getStatusLabel,
  getStatusTone,
} from '../utils/reportStatus';
import './TotalReportMenuPage.css';

const totalReportPaths = {
  eyeContactRate: '/report/total/eye-contact',
  speechRate: '/report/total/speech-rate',
  voiceVolume: '/report/total/voice-volume',
  silenceCount: '/report/total/silence',
  fillerCount: '/report/total/filler',
  smileRate: '/report/total/smile-rate',
  blinkCount: '/report/total/blink',
  nodCount: '/report/total/nod',
  shoulderTilt: '/report/total/shoulder-tilt',
  bodyShake: '/report/total/body-shake',
};

const getComparableDate = (date) => {
  if (!date) {
    return 0;
  }

  const timestamp = new Date(date).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const getLatestReport = (reports) => {
  if (!Array.isArray(reports) || reports.length === 0) {
    return null;
  }

  return [...reports].sort((a, b) => {
    const dateA = getComparableDate(a.date ?? a.created_at ?? a.createdAt);
    const dateB = getComparableDate(b.date ?? b.created_at ?? b.createdAt);

    if (dateA !== dateB) {
      return dateB - dateA;
    }

    return (
      Number(b.session ?? b.interview_id ?? b.id ?? 0) -
      Number(a.session ?? a.interview_id ?? a.id ?? 0)
    );
  })[0];
};

export default function TotalReportMenuPage() {
  const navigate = useNavigate();
  const [latestReport, setLatestReport] = useState(null);
  const [isLoadingLatest, setIsLoadingLatest] = useState(true);

  useEffect(() => {
    const fetchLatestReport = async () => {
      try {
        const response = await getIndividualReports();
        const reports = Array.isArray(response)
          ? response
          : response?.data || response?.results || response?.interviews || [];

        setLatestReport(getLatestReport(reports));
      } catch (error) {
        console.error('최신 리포트 조회 실패:', error);
        setLatestReport(null);
      } finally {
        setIsLoadingLatest(false);
      }
    };

    fetchLatestReport();
  }, []);

  const analysisItems = useMemo(
    () =>
      ANALYSIS_METRICS.map((metric) => {
        const value = latestReport?.detail?.[metric.key];
        const status = getItemStatus(metric.key, value);
        const tone = getStatusTone(status);

        return {
          ...metric,
          path: totalReportPaths[metric.key],
          value,
          status,
          tone,
        };
      }),
    [latestReport],
  );

  const statusSummary = useMemo(
    () =>
      analysisItems.reduce(
        (summary, item) => ({
          ...summary,
          [item.tone]: summary[item.tone] + 1,
        }),
        { good: 0, warning: 0, bad: 0, neutral: 0 },
      ),
    [analysisItems],
  );

  const latestReportDate =
    latestReport?.date ?? latestReport?.created_at ?? latestReport?.createdAt;

  const latestReportLabel = latestReportDate
    ? `최신 리포트 ${latestReportDate} 기준`
    : '최신 리포트 기준';

  return (
    <div className="total-menu-page">
      <div className="total-menu-container">
        <div className="total-menu-hero">
          <button
            className="total-menu-back"
            type="button"
            onClick={() => navigate('/report')}
          >
            ← 이전
          </button>

          <div className="total-menu-heading">
            <span className="total-menu-eyebrow">Cumulative Report</span>
            <h1>누적 분석 보기</h1>
            <p className="total-menu-desc">
              최신 면접 데이터의 상태를 기준으로 10개 분석 항목을 확인할 수
              있습니다.
              <br />각 항목을 클릭하면 해당 분석 페이지로 바로 이동할 수
              있습니다.
            </p>
          </div>

          <div className="total-menu-summary" aria-label="최신 리포트 상태 요약">
            <span className="total-menu-summary-date">
              {isLoadingLatest ? '최신 리포트 확인 중' : latestReportLabel}
            </span>
            <div className="total-menu-summary-chips">
              <span className="total-menu-status-chip good">
                적정 {statusSummary.good}
              </span>
              <span className="total-menu-status-chip warning">
                주의 {statusSummary.warning}
              </span>
              <span className="total-menu-status-chip bad">
                체크 필요 {statusSummary.bad}
              </span>
            </div>
          </div>
        </div>

        <div className="total-menu-grid">
          {analysisItems.map((item, index) => (
            <button
              type="button"
              key={item.title}
              className={`total-menu-card status-${item.tone}`}
              onClick={() => navigate(item.path)}
            >
              <div className="total-menu-card-top">
                <div className="total-menu-number">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <span className="total-menu-category">{item.category}</span>
                <span className="total-menu-arrow">→</span>
              </div>

              <div className="total-menu-card-body">
                <div className="total-menu-title">{item.title}</div>
                <div className="total-menu-card-meta">
                  <span className="total-menu-latest-value">
                    {item.value === undefined || item.value === null
                      ? '최신값 없음'
                      : `최신값 ${item.value}${item.unit}`}
                  </span>
                  <span className={`total-menu-status-badge ${item.tone}`}>
                    {getStatusLabel(item.status)}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          className="total-menu-start"
          onClick={() => navigate(analysisItems[0].path)}
        >
          처음부터 분석 보기
        </button>
      </div>
    </div>
  );
}
