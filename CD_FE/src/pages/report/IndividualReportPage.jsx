import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './IndividualReportPage.css';
import { getIndividualReports } from '../../api/reportApi';

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
  'nodTrend',
  'shoulderTiltTrend',
  'bodyShakeTrend',
];

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
      const reports = await getIndividualReports();
      const savedDeletedSessions = getDeletedSessions();

      const visibleReports = reports.filter(
        (report) => !savedDeletedSessions.includes(report.session ?? report.id),
      );

      setReportList(visibleReports);
      setDeletedSessions(savedDeletedSessions);
    };

    fetchReports();
  }, []);

  const filteredReports = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    return reportList.filter((report, index) => {
      const reportSession = report.session ?? report.id;

      if (deletedSessions.includes(reportSession)) {
        return false;
      }

      const reportType = report.type || 'resume';
      const typeMatched = selectedType === 'all' || reportType === selectedType;

      const title = report.title || `${index + 1}회차 면접`;
      const date = report.date || '';
      const summary = `${report.eyeContact || ''} ${report.speechSummary || ''} ${
        report.expressionSummary || ''
      } ${report.keyword || ''} ${report.keywords || ''}`;

      const searchMatched =
        keyword === '' ||
        title.toLowerCase().includes(keyword) ||
        date.toLowerCase().includes(keyword) ||
        summary.toLowerCase().includes(keyword);

      return typeMatched && searchMatched;
    });
  }, [reportList, selectedType, searchText, deletedSessions]);

  const saveDeletedStorage = (nextStorage) => {
    localStorage.setItem(DELETED_STORAGE_KEY, JSON.stringify(nextStorage));
    setDeletedStorage(nextStorage);
  };

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      alert('삭제할 리포트를 선택해주세요.');
      return;
    }

    if (!window.confirm('선택한 리포트를 삭제하시겠습니까?')) return;

    const deletedReports = reportList.filter((report) =>
      selectedIds.includes(report.id),
    );

    const sessionsToDelete = deletedReports.map(
      (report) => report.session ?? report.id,
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
      (report) => !selectedIds.includes(report.id),
    );

    const nextDeletedStorage = {
      reports: [...deletedStorage.reports, ...deletedReports],
      trends: { ...deletedStorage.trends },
    };

    TREND_KEYS.forEach((key) => {
      const data = JSON.parse(localStorage.getItem(key) || '[]');

      const deletedTrendItems = data.filter((item) =>
        sessionsToDelete.includes(item.session),
      );

      const remainedTrendItems = data.filter(
        (item) => !sessionsToDelete.includes(item.session),
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
    alert('선택한 리포트가 삭제 보관함으로 이동되었습니다.');
  };

  const handleDeleteAll = () => {
    if (reportList.length === 0) {
      alert('삭제할 리포트가 없습니다.');
      return;
    }

    if (!window.confirm('전체 리포트를 삭제하시겠습니까?')) return;

    const sessionsToDelete = reportList.map(
      (report) => report.session ?? report.id,
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
        sessionsToDelete.includes(item.session),
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
    alert('전체 리포트가 삭제 보관함으로 이동되었습니다.');
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
            <p>면접 회차별 분석 결과를 선택해서 자세히 확인하세요.</p>
          </div>
        </div>

        <div className="individual-report-box">
          <div className="individual-filter-area">
            <input
              className="individual-search-input"
              type="text"
              placeholder="회차명 · 날짜 · 키워드로 검색"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

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
                  className={selectedType === 'industry' ? 'active' : ''}
                  onClick={() => setSelectedType('industry')}
                >
                  산업 기반 면접
                </button>
              </div>

              <div className="action-buttons-wrapper">
                <button type="button" onClick={handleDeleteSelected}>
                  선택 삭제
                </button>

                <button type="button" onClick={handleDeleteAll}>
                  전체 삭제
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/report/individual/trash')}
                >
                  삭제 보관함
                </button>
              </div>
            </div>
          </div>

          <div className="individual-report-list">
            {filteredReports.length > 0 ? (
              filteredReports.map((report, index) => (
                <div
                  key={report.id || index}
                  className="individual-report-card"
                  onClick={() =>
                    navigate(`/report/individual/detail/${report.id}`, {
                      state: report,
                    })
                  }
                >
                  <div className="report-card-left">
                    <input
                      type="checkbox"
                      className="report-checkbox"
                      checked={selectedIds.includes(report.id)}
                      onChange={() => handleSelect(report.id)}
                      onClick={(e) => e.stopPropagation()}
                    />

                    <div className="report-number">
                      {report.session ?? index + 1}
                    </div>

                    <div className="report-card-content">
                      <h2>{report.title || `${index + 1}회차 면접`}</h2>
                      <p>
                        {report.eyeContact || '-'} ·{' '}
                        {report.speechSummary || '-'} ·{' '}
                        {report.expressionSummary || '-'}
                      </p>

                      {report.date && (
                        <div className="report-date">{report.date}</div>
                      )}
                    </div>
                  </div>

                  <div className="report-card-right">요약 보기 →</div>
                </div>
              ))
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
