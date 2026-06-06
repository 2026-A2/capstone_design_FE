import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './IndividualReportPage.css';
import {
  getIndividualReports,
  deleteIndividualReport,
} from '../../api/reportApi';

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

const FILTER_LABELS = {
  all: '전체',
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

const getItemStatus = (key, value) => {
  // undefined, null, 그리고 NaN은 neutral로 처리
  if (value === undefined || value === null || Number.isNaN(value))
    return 'neutral';

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
      if (value >= 2 && value <= 3) return 'warning';
      return 'bad';
    default:
      return 'neutral';
  }
};

const getDeletedStorage = () => {
  try {
    const deletedStorage = JSON.parse(
      localStorage.getItem(DELETED_STORAGE_KEY) || 'null',
    );

    return deletedStorage || { reports: [], trends: {} };
  } catch {
    return { reports: [], trends: {} };
  }
};

const getDeletedSessions = () => {
  try {
    return JSON.parse(localStorage.getItem('deletedReportSessions') || '[]');
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

export default function IndividualReportPage() {
  const navigate = useNavigate();

  const [reportList, setReportList] = useState([]);
  const [deletedStorage, setDeletedStorage] = useState(getDeletedStorage);
  const [deletedSessions, setDeletedSessions] = useState(getDeletedSessions);
  const [selectedIds, setSelectedIds] = useState([]);

  const [selectedType, setSelectedType] = useState('all');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await getIndividualReports();

        console.log('리포트 목록 응답:', response);

        const reports = Array.isArray(response)
          ? response
          : response?.data || response?.results || response?.interviews || [];

        const savedDeletedSessions = getDeletedSessions();

        const visibleReports = reports.filter(
          (report) =>
            !savedDeletedSessions.some(
              (session) => String(session) === String(getReportId(report)),
            ),
        );

        setReportList(visibleReports);
        setDeletedSessions(savedDeletedSessions);
      } catch (error) {
        console.error('리포트 목록 조회 실패:', error);

        setReportList([]);
        setDeletedSessions(getDeletedSessions());
      }
    };

    fetchReports();
  }, []);

  const filteredReports = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    return reportList.filter((report, index) => {
      const reportSession = getReportId(report);

      if (
        deletedSessions.some(
          (session) => String(session) === String(reportSession),
        )
      ) {
        return false;
      }

      const reportType = getReportTypeKey(report);
      const typeMatched = selectedType === 'all' || reportType === selectedType;

      const title = getReportTitle(report, index);
      const date = getReportDate(report);
      const typeLabel = getReportTypeLabel(report);
      const summary = `${report.eyeContact || ''} ${report.speechSummary || ''} ${
        report.expressionSummary || ''
      } ${report.keyword || ''} ${report.keywords || ''} ${typeLabel}`;

      const searchMatched =
        keyword === '' ||
        title.toLowerCase().includes(keyword) ||
        date.toLowerCase().includes(keyword) ||
        summary.toLowerCase().includes(keyword);

      return typeMatched && searchMatched;
    });
  }, [reportList, selectedType, searchText, deletedSessions]);

  const getReportAnalysisSummary = (report) => {
    // API 데이터 디버깅: detail 필드 로깅
    if (
      !report.detail ||
      Object.values(report.detail).every((v) => v === undefined || v === null)
    ) {
      console.warn('[분석 요약] detail 필드 누락 또는 모두 undefined:', report);
    }

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

    // 디버깅: 요약 정보 로깅
    console.log(`[${report.title}] 분석 요약:`, analysisSummary);

    if (analysisSummary.total === 0) {
      // detail이 아예 없으면 기본값으로 계산 시도
      if (
        !report.detail ||
        Object.values(report.detail).every((v) => v === undefined || v === null)
      ) {
        console.warn(`[${report.title}] detail 데이터 없음 - 기본값 사용`);
        // 기본 분석 결과 반환 (실제 API 응답 후 수정 필요)
        return '분석 데이터를 로드 중입니다.';
      }
      return '상세 분석 결과를 확인할 수 있습니다.';
    }

    const checkCount = analysisSummary.warningCount + analysisSummary.badCount;

    return `전체 ${analysisSummary.total}개 분석 항목 · 적정 ${analysisSummary.goodCount}개 · 개선 필요 ${checkCount}개`;
  };

  const saveDeletedStorage = (nextStorage) => {
    localStorage.setItem(DELETED_STORAGE_KEY, JSON.stringify(nextStorage));
    setDeletedStorage(nextStorage);
  };

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      alert('삭제할 리포트를 선택해주세요.');
      return;
    }

    if (!window.confirm('선택한 리포트를 삭제하시겠습니까?')) return;
    try {
      await Promise.all(selectedIds.map((id) => deleteIndividualReport(id)));
    } catch (error) {
      console.error('리포트 삭제 실패:', error);
      alert('리포트 삭제 중 오류가 발생했습니다.');
      return;
    }
    const deletedReports = reportList.filter((report, index) =>
      selectedIds.includes(getReportId(report, index + 1)),
    );

    const sessionsToDelete = deletedReports.map(
      (report, index) => getReportId(report, index + 1),
    );

    const updatedDeletedSessions = [
      ...new Set([...deletedSessions, ...sessionsToDelete]),
    ];

    localStorage.setItem(
      'deletedReportSessions',
      JSON.stringify(updatedDeletedSessions),
    );

    setDeletedSessions(updatedDeletedSessions);

    const updatedReports = reportList.filter(
      (report, index) => !selectedIds.includes(getReportId(report, index + 1)),
    );

    const nextDeletedStorage = {
      reports: [...deletedStorage.reports, ...deletedReports],
      trends: { ...deletedStorage.trends },
    };

    TREND_KEYS.forEach((key) => {
      const data = JSON.parse(localStorage.getItem(key) || '[]');

      const deletedTrendItems = data.filter((item) =>
        isSameReportSession(item, sessionsToDelete),
      );

      const remainedTrendItems = data.filter(
        (item) => !isSameReportSession(item, sessionsToDelete),
      );

      nextDeletedStorage.trends[key] = [
        ...(nextDeletedStorage.trends[key] || []),
        ...deletedTrendItems,
      ];

      localStorage.setItem(key, JSON.stringify(remainedTrendItems));
    });

    localStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify(updatedReports));
    setReportList(updatedReports);
    saveDeletedStorage(nextDeletedStorage);

    setSelectedIds([]);
    alert('선택한 리포트가 삭제되었습니다.');
  };

  const handleDeleteAll = async () => {
    if (reportList.length === 0) {
      alert('삭제할 리포트가 없습니다.');
      return;
    }

    if (!window.confirm('전체 리포트를 삭제하시겠습니까?')) return;
    try {
      await Promise.all(
        reportList.map((report, index) =>
          deleteIndividualReport(getReportId(report, index + 1)),
        ),
      );
    } catch (error) {
      console.error('전체 리포트 삭제 실패:', error);
      alert('전체 리포트 삭제 중 오류가 발생했습니다.');
      return;
    }

    const sessionsToDelete = reportList.map(
      (report, index) => getReportId(report, index + 1),
    );

    const updatedDeletedSessions = [
      ...new Set([...deletedSessions, ...sessionsToDelete]),
    ];

    localStorage.setItem(
      'deletedReportSessions',
      JSON.stringify(updatedDeletedSessions),
    );

    setDeletedSessions(updatedDeletedSessions);

    const nextDeletedStorage = {
      reports: [...deletedStorage.reports, ...reportList],
      trends: { ...deletedStorage.trends },
    };

    TREND_KEYS.forEach((key) => {
      const data = JSON.parse(localStorage.getItem(key) || '[]');

      const deletedTrendItems = data.filter((item) =>
        isSameReportSession(item, sessionsToDelete),
      );

      nextDeletedStorage.trends[key] = [
        ...(nextDeletedStorage.trends[key] || []),
        ...deletedTrendItems,
      ];

      localStorage.setItem(key, JSON.stringify([]));
    });

    localStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify([]));
    setReportList([]);
    saveDeletedStorage(nextDeletedStorage);

    setSelectedIds([]);
    alert('전체 리포트가 삭제되었습니다.');
  };

  return (
    <div className="individual-report-page">
      <div className="individual-report-container">
        <div className="individual-report-header">
          <button
            className="individual-back-button"
            onClick={() => navigate('/report')}
          >
            ←
          </button>

          <div>
            <h1>개별 리포트 보기</h1>
            <p>면접 회차별 분석 결과를 선택해 자세히 확인하세요.</p>
          </div>
        </div>

        <div className="individual-report-box">
          <div className="individual-filter-area">
            <div className="individual-search-wrap">
              <span className="individual-search-icon">⌕</span>
              <input
                className="individual-search-input"
                type="text"
                placeholder="회차명 · 날짜 · 키워드로 검색"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />

              {searchText && (
                <button
                  className="clear-search-button"
                  type="button"
                  onClick={() => setSearchText('')}
                >
                  ×
                </button>
              )}
            </div>

            <div className="report-action-row">
              <div className="filter-buttons-wrapper">
                <button
                  className={selectedType === 'all' ? 'active' : ''}
                  onClick={() => setSelectedType('all')}
                >
                  전체
                </button>

                <button
                  className={selectedType === 'resume' ? 'active' : ''}
                  onClick={() => setSelectedType('resume')}
                >
                  자소서 기반 면접
                </button>

                <button
                  className={selectedType === 'job' ? 'active' : ''}
                  onClick={() => setSelectedType('job')}
                >
                  직무 기반 면접
                </button>
              </div>

              <div className="action-buttons-wrapper">
                {selectedIds.length > 0 && (
                  <span className="selected-count">
                    {selectedIds.length}개 선택됨
                  </span>
                )}

                <button type="button" onClick={handleDeleteSelected}>
                  선택 삭제
                </button>

                <button type="button" onClick={handleDeleteAll}>
                  전체 삭제
                </button>

              </div>
            </div>
          </div>

          <div className="individual-report-list">
            <div className="individual-list-summary">
              <span>총 {filteredReports.length}개 리포트</span>
              <span>{FILTER_LABELS[selectedType]}</span>
            </div>

            {filteredReports.length > 0 ? (
              filteredReports.map((report, index) => {
                const analysisSummary = getReportAnalysisSummary(report);
                const reportId = getReportId(report, index + 1);
                const reportTitle = getReportTitle(report, index);
                const reportDate = getReportDate(report);

                return (
                  <div
                    key={reportId}
                    className="individual-report-card"
                    onClick={() =>
                      navigate(`/report/individual/detail/full/${reportId}`, {
                        state: report,
                      })
                    }
                  >
                    <div className="report-card-left">
                      <input
                        type="checkbox"
                        className="report-checkbox"
                        checked={selectedIds.includes(reportId)}
                        onChange={() => handleSelect(reportId)}
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

                      <span className="detail-link">상세 보기 →</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-report-box">
                <div className="empty-icon">!</div>
                <h2>검색 결과가 없습니다</h2>
                <p>필터나 검색어를 다시 확인해 주세요.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
