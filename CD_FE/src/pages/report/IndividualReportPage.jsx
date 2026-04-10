import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './IndividualReportPage.css';

export default function IndividualReportPage() {
  const navigate = useNavigate();
  const [reportList, setReportList] = useState([]);

  useEffect(() => {
    const savedReports =
      JSON.parse(localStorage.getItem('individualReports')) || [];

    console.log('불러온 레포트:', savedReports);
    setReportList(savedReports);
  }, []);

  return (
    <div className="individual-report-container">
      <div className="individual-report-title">
        누적 레포트 보기 - 개별 레포트
      </div>

      <div className="individual-report-box">
        <div className="individual-report-notice">
          열람하고 싶은 레포트를 선택하세요.
        </div>

        <div className="individual-report-list">
          {reportList.length > 0 ? (
            reportList.map((report) => (
              <div
                key={report.id}
                className="individual-report-item"
                onClick={() =>
                  navigate('/report/individual/detail', {
                    state: report,
                  })
                }
                style={{ cursor: 'pointer' }}
              >
                {report.title}
              </div>
            ))
          ) : (
            <div className="individual-report-empty">
              저장된 레포트가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
