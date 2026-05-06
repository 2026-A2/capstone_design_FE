import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './IndividualReportPage.css';
import { individualReports } from '../../mockdata/report/individualMock';

export default function IndividualReportPage() {
  const navigate = useNavigate();
  const [reportList, setReportList] = useState([]);

  useEffect(() => {
    const savedReports =
      JSON.parse(localStorage.getItem('individualReports')) ||
      individualReports;

    setReportList(savedReports);
  }, []);

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
          <div className="individual-report-notice">
            열람하고 싶은 리포트를 선택하세요.
          </div>

          <div className="individual-report-list">
            {reportList.length > 0 ? (
              reportList.map((report, index) => (
                <div
                  key={report.id || index}
                  className="individual-report-card"
                  onClick={() =>
                    navigate('/report/individual/detail', {
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
                    </div>
                  </div>

                  <div className="report-card-right">상세 보기 ›</div>
                </div>
              ))
            ) : (
              <div className="empty-report-box">
                <div className="empty-icon">📄</div>
                <h2>저장된 리포트가 없습니다</h2>
                <p>
                  면접을 완료하면 이곳에서 개별 리포트를 확인할 수 있습니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
