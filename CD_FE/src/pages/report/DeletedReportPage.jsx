import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DeletedReportPage.css';

const REPORT_STORAGE_KEY = 'individualReports';
const DELETED_STORAGE_KEY = 'deletedReportsStorage';

const TREND_KEYS = [
  'eyeContactTrend',
  'speechRateTrend',
  'voiceVolumeTrend',
  'silenceTrend',
  'fillerTrend',
  'smileTrend',
  'blinkTrend',
  'nodTrend',
  'shoulderTiltTrend',
  'bodyShakeTrend',
];

const ANALYSIS_METRICS = [
  { key: 'eyeContactRate', label: '시선' },
  { key: 'speechRate', label: '발화' },
  { key: 'voiceVolume', label: '음성' },
  { key: 'silenceCount', label: '침묵' },
  { key: 'fillerCount', label: '필러' },
  { key: 'smileRate', label: '표정' },
  { key: 'blinkCount', label: '습관' },
  { key: 'nodCount', label: '반응' },
  { key: 'shoulderTilt', label: '자세' },
  { key: 'bodyShake', label: '흔들림' },
];

const FILTER_LABELS = {
  resume: '자소서 기반 면접',
  job: '직무 기반 면접',
};

const INTERVIEW_TYPE_LABELS = {
  RESUME: '자소서 기반 면접',
  JOB: '직무 기반 면접',
  INDUSTRY: '직무 기반 면접',
};

const INTERVIEW_TYPE_FILTERS = {
  RESUME: 'resume',
  JOB: 'job',
  INDUSTRY: 'job',
};

const getItemStatus = (key, value) => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return 'neutral';
  }

  switch (key) {
    case 'eyeContactRate':
      if (value >= 85) return 'good';
      if (value >= 65) return 'warning';
      return 'bad';
    case 'speechRate':
      if (value >= 250 && value <= 350) return 'good';
      if ((value >= 200 && value < 250) || (value > 350 && value <= 450))
        return 'warning';
      return 'bad';
    case 'silenceCount':
      if (value <= 3) return 'good';
      if (value <= 6) return 'warning';
      return 'bad';
    case 'fillerCount':
      if (value <= 3) return 'good';
      if (value <= 6) return 'warning';
      return 'bad';
    case 'voiceVolume':
      if (value >= -10) return 'bad';
      if (value >= -20) return 'warning';
      if (value >= -35) return 'good';
      if (value >= -50) return 'warning';
      return 'bad';
    case 'smileRate':
      if (value >= 11) return 'good';
      if (value >= 5 && value <= 10) return 'warning';
      return 'bad';
    case 'blinkCount':
      if (value >= 40 && value <= 60) return 'good';
      if (value > 60 && value <= 75) return 'warning';
      return 'bad';
    case 'nodCount':
      if (value <= 1) return 'good';
      if (value <= 5) return 'warning';
      return 'bad';
    case 'shoulderTilt':
      if (value >= 90) return 'good';
      if (value >= 75 && value < 90) return 'warning';
      return 'bad';
    case 'bodyShake':
      if (value <= 1) return 'good';
      if (value < 4) return 'warning';
      return 'bad';
    default:
      return 'neutral';
  }
};

const getDeletedStorage = () => {
  try {
    return (
      JSON.parse(localStorage.getItem(DELETED_STORAGE_KEY)) || {
        reports: [],
        trends: {},
      }
    );
  } catch {
    return {
      reports: [],
      trends: {},
    };
  }
};

const getCurrentReports = () => {
  try {
    return JSON.parse(localStorage.getItem(REPORT_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

const isSameReportSession = (item, sessions) =>
  sessions.some(
    (session) =>
      String(item.interview_id) === String(session) ||
      String(item.session) === String(session) ||
      String(item.id) === String(session),
  );

const getReportId = (report, fallback) =>
  report.interview_id ?? report.id ?? report.session ?? fallback;

const getReportDate = (report) =>
  report.created_at ?? report.createdAt ?? report.date ?? '';

const getReportTypeKey = (report) => {
  const rawType = report.interview_type ?? report.interviewType;

  if (INTERVIEW_TYPE_FILTERS[rawType]) {
    return INTERVIEW_TYPE_FILTERS[rawType];
  }

  if (report.type === 'industry') {
    return 'job';
  }

  return report.type || 'resume';
};

const getReportTypeLabel = (report) => {
  const rawType = report.interview_type ?? report.interviewType;

  return (
    INTERVIEW_TYPE_LABELS[rawType] ||
    report.interviewTypeLabel ||
    FILTER_LABELS[getReportTypeKey(report)] ||
    '면접'
  );
};

const getReportTitle = (report, index) => {
  const reportId = getReportId(report, index + 1);

  return `${reportId}회차 ${getReportTypeLabel(report)} 리포트`;
};

export default function DeletedReportPage() {
  const navigate = useNavigate();

  const [deletedStorage, setDeletedStorage] = useState(getDeletedStorage);
  const [selectedRestoreIds, setSelectedRestoreIds] = useState([]);

  const getReportAnalysisSummary = (report) => {
    const metricStatuses = ANALYSIS_METRICS.map((metric) => ({
      ...metric,
      status: getItemStatus(metric.key, report.detail?.[metric.key]),
      value: report.detail?.[metric.key],
    })).filter((metric) => metric.status !== 'neutral');

    const goodCount = metricStatuses.filter(
      (metric) => metric.status === 'good',
    ).length;
    const warningCount = metricStatuses.filter(
      (metric) => metric.status === 'warning',
    ).length;
    const badCount = metricStatuses.filter(
      (metric) => metric.status === 'bad',
    ).length;

    return {
      total: metricStatuses.length,
      goodCount,
      warningCount,
      badCount,
    };
  };

  const getReportDescription = (report) => {
    const analysisSummary = getReportAnalysisSummary(report);

    if (analysisSummary.total === 0) {
      return '상세 분석 결과를 확인할 수 있습니다.';
    }

    const checkCount = analysisSummary.warningCount + analysisSummary.badCount;

    return `전체 ${analysisSummary.total}개 분석 항목 · 적정 ${analysisSummary.goodCount}개 · 개선 필요 ${checkCount}개`;
  };

  const handleSelectRestore = (id) => {
    setSelectedRestoreIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const saveDeletedStorage = (nextStorage) => {
    localStorage.setItem(DELETED_STORAGE_KEY, JSON.stringify(nextStorage));
    setDeletedStorage(nextStorage);
  };

  const handleRestoreSelected = () => {
    if (selectedRestoreIds.length === 0) {
      alert('복구할 리포트를 선택해주세요.');
      return;
    }

    const restoreReports = deletedStorage.reports.filter((report, index) =>
      selectedRestoreIds.includes(getReportId(report, index + 1)),
    );
    const restoredSessions = restoreReports.map(
      (report, index) => getReportId(report, index + 1),
    );
    const deletedSessions =
      JSON.parse(localStorage.getItem('deletedReportSessions')) || [];

    const updatedDeletedSessions = deletedSessions.filter(
      (session) => !restoredSessions.includes(session),
    );

    localStorage.setItem(
      'deletedReportSessions',
      JSON.stringify(updatedDeletedSessions),
    );
    const restoreSessions = restoreReports.map(
      (report, index) => getReportId(report, index + 1),
    );

    const currentReports = getCurrentReports();

    const nextReportList = [...currentReports, ...restoreReports].sort(
      (a, b) => Number(getReportId(a, 0)) - Number(getReportId(b, 0)),
    );

    const nextDeletedReports = deletedStorage.reports.filter(
      (report, index) =>
        !selectedRestoreIds.includes(getReportId(report, index + 1)),
    );

    const nextDeletedTrends = { ...deletedStorage.trends };

    TREND_KEYS.forEach((key) => {
      const deletedTrendData = nextDeletedTrends[key] || [];

      const restoreTrendItems = deletedTrendData.filter((item) =>
        isSameReportSession(item, restoreSessions),
      );

      const remainedDeletedTrendItems = deletedTrendData.filter(
        (item) => !isSameReportSession(item, restoreSessions),
      );

      const currentTrendData = JSON.parse(localStorage.getItem(key)) || [];

      const nextTrendData = [...currentTrendData, ...restoreTrendItems].sort(
        (a, b) => a.session - b.session,
      );

      localStorage.setItem(key, JSON.stringify(nextTrendData));
      nextDeletedTrends[key] = remainedDeletedTrendItems;
    });

    const nextDeletedStorage = {
      reports: nextDeletedReports,
      trends: nextDeletedTrends,
    };

    localStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify(nextReportList));
    saveDeletedStorage(nextDeletedStorage);

    setSelectedRestoreIds([]);
    alert('선택한 리포트가 복구되었습니다.');
  };

  const handleClearTrash = () => {
    if (deletedStorage.reports.length === 0) {
      alert('삭제 보관함이 비어 있습니다.');
      return;
    }

    if (!window.confirm('삭제 보관함을 완전히 비우시겠습니까?')) return;

    const emptyStorage = {
      reports: [],
      trends: {},
    };

    localStorage.setItem(DELETED_STORAGE_KEY, JSON.stringify(emptyStorage));
    setDeletedStorage(emptyStorage);
    setSelectedRestoreIds([]);

    alert('삭제 보관함을 비웠습니다.');
  };

  return (
    <div className="deleted-report-page">
      <div className="deleted-report-container">
        <div className="deleted-report-header">
          <button
            className="deleted-back-button"
            type="button"
            onClick={() => navigate('/report/individual')}
          >
            ←
          </button>
          <div className="deleted-title-wrap">
            <h1>삭제 보관함</h1>
            <p>삭제한 리포트를 선택해서 다시 복구할 수 있습니다.</p>
          </div>
        </div>

        <div className="deleted-report-box">
          <div className="deleted-action-row">
            <button type="button" onClick={handleRestoreSelected}>
              선택 복구
            </button>
            <button
              type="button"
              className="danger-button"
              onClick={handleClearTrash}
            >
              보관함 비우기(영구 삭제)
            </button>
          </div>

          {deletedStorage.reports.length > 0 ? (
            <div className="deleted-report-list">
              <div className="deleted-list-summary">
                <span>총 {deletedStorage.reports.length}개 리포트</span>
              </div>

              {deletedStorage.reports.map((report, index) => {
                const analysisSummary = getReportAnalysisSummary(report);
                const reportId = getReportId(report, index + 1);
                const reportTitle = getReportTitle(report, index);
                const reportDate = getReportDate(report);

                return (
                  <div key={reportId} className="deleted-report-card">
                    <div className="report-card-left">
                      <input
                        type="checkbox"
                        className="report-checkbox"
                        checked={selectedRestoreIds.includes(reportId)}
                        onChange={() => handleSelectRestore(reportId)}
                        onClick={(e) => e.stopPropagation()}
                      />

                      <div className="report-number">
                        {reportId}
                      </div>

                      <div className="report-card-content">
                        <div className="report-title-row">
                          <h2>{reportTitle}</h2>
                          {reportDate && (
                            <span className="report-date">{reportDate}</span>
                          )}
                        </div>
                        <p>{getReportDescription(report)}</p>
                      </div>
                    </div>

                    <div className="report-card-right">
                      {analysisSummary.total > 0 ? (
                        <div className="report-analysis-preview">
                          <div className="report-score-chips">
                            <span className="score-chip good">
                              적정 {analysisSummary.goodCount}
                            </span>
                            <span className="score-chip warning">
                              주의 {analysisSummary.warningCount}
                            </span>
                            <span className="score-chip bad">
                              체크 {analysisSummary.badCount}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="report-ready-badge">상세 분석</span>
                      )}

                      <span className="detail-link">복구 →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-trash-box">
              <div className="empty-trash-icon">!</div>
              <h2>삭제 보관함이 비어 있습니다</h2>
              <p>삭제한 리포트가 있으면 이곳에서 복구할 수 있습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
