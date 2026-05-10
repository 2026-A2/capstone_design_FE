import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './IndividualReportPage.css';
import { individualReports } from '../../mockdata/report/individualMock';

const getInitialReports = () => {
  try {
    const savedReports = JSON.parse(
      localStorage.getItem('individualReports') || 'null',
    );

    return Array.isArray(savedReports) ? savedReports : individualReports;
  } catch {
    return individualReports;
  }
};

export default function IndividualReportPage() {
  const navigate = useNavigate();
  const [reportList] = useState(getInitialReports);

  const [selectedType, setSelectedType] = useState('all');
  const [searchText, setSearchText] = useState('');

  const filteredReports = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    return reportList.filter((report, index) => {
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
  }, [reportList, selectedType, searchText]);

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

            <div className="individual-filter-buttons">
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
                    <div className="report-number">{index + 1}</div>

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
