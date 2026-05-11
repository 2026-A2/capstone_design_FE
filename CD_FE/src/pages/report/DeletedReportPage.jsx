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
  'endingBlurTrend',
  'headNodTrend',
  'shoulderTiltTrend',
  'bodyShakeTrend',
];

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

export default function DeletedReportPage() {
  const navigate = useNavigate();

  const [deletedStorage, setDeletedStorage] = useState(getDeletedStorage);
  const [selectedRestoreIds, setSelectedRestoreIds] = useState([]);

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

    const restoreReports = deletedStorage.reports.filter((report) =>
      selectedRestoreIds.includes(report.id),
    );

    const restoreSessions = restoreReports.map(
      (report) => report.session || report.id,
    );

    const currentReports = getCurrentReports();

    const nextReportList = [...currentReports, ...restoreReports].sort(
      (a, b) => (a.session || a.id) - (b.session || b.id),
    );

    const nextDeletedReports = deletedStorage.reports.filter(
      (report) => !selectedRestoreIds.includes(report.id),
    );

    const nextDeletedTrends = { ...deletedStorage.trends };

    TREND_KEYS.forEach((key) => {
      const deletedTrendData = nextDeletedTrends[key] || [];

      const restoreTrendItems = deletedTrendData.filter((item) =>
        restoreSessions.includes(item.session),
      );

      const remainedDeletedTrendItems = deletedTrendData.filter(
        (item) => !restoreSessions.includes(item.session),
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
        {/* ✅ 헤더: 버튼 + 텍스트 가로 배치 */}
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
              {deletedStorage.reports.map((report, index) => (
                <label key={report.id || index} className="deleted-report-item">
                  <input
                    type="checkbox"
                    checked={selectedRestoreIds.includes(report.id)}
                    onChange={() => handleSelectRestore(report.id)}
                  />

                  <div className="deleted-report-number">
                    {report.session || report.id || index + 1}
                  </div>

                  <div className="deleted-report-content">
                    <h2>
                      {report.title ||
                        `${report.session || index + 1}회차 면접 리포트`}
                    </h2>

                    <p>
                      {report.eyeContact || '-'} · {report.speechSummary || '-'}{' '}
                      · {report.expressionSummary || '-'}
                    </p>

                    {report.date && (
                      <div className="deleted-report-date">{report.date}</div>
                    )}
                  </div>
                </label>
              ))}
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
