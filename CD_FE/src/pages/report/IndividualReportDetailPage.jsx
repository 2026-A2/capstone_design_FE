import { useNavigate, useLocation, useParams } from 'react-router-dom';
import './IndividualReportDetailPage.css';
import { useEffect, useState } from 'react';
import { getIndividualReportSummary } from '../../api/reportApi';

export default function IndividualReportDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (location.state) {
        setReport(location.state);
        return;
      }

      const selectedReport = await getIndividualReportSummary(id);

      setReport(
        selectedReport || {
          id,
          title: '리포트 정보 없음',
          eyeContact: '-',
          speechSummary: '-',
          expressionSummary: '-',
          habitSummary: '-',
          postureSummary: '-',
        },
      );
    };

    fetchReport();
  }, [id, location.state]);

  if (!report) {
    return <div>로딩 중...</div>;
  }

  const detailItems = [
    { label: '시선 처리', value: report.eyeContact || '-', icon: '👀' },
    { label: '발화', value: report.speechSummary || '-', icon: '🎙️' },
    { label: '표정', value: report.expressionSummary || '-', icon: '🙂' },
    { label: '습관', value: report.habitSummary || '-', icon: '📌' },
    { label: '자세', value: report.postureSummary || '-', icon: '🧍' },
  ];

  return (
    <div className="detail-report-page">
      <div className="detail-report-container">
        <div className="detail-report-header">
          <button
            className="detail-back-icon-button"
            onClick={() => navigate('/report/individual')}
          >
            ←
          </button>

          <div>
            <h1>개별 리포트 요약</h1>
            <p>선택한 면접 회차의 주요 분석 결과를 확인하세요.</p>
          </div>
        </div>

        <div className="detail-report-box">
          <div className="detail-report-top">
            <div>
              <span className="detail-report-label">Interview Report</span>
              <h2>{report.title}</h2>
            </div>
          </div>

          <div className="detail-score-grid">
            {detailItems.map((item) => (
              <div className="detail-score-card" key={item.label}>
                <div className="detail-score-icon">{item.icon}</div>
                <div>
                  <strong>{item.label}</strong>
                  <p>{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="detail-button-wrap">
            <button
              className="detail-prev-button"
              onClick={() => navigate('/report/individual')}
            >
              뒤로가기
            </button>

            <button
              className="detail-main-button"
              onClick={() => {
                navigate(`/report/individual/detail/full/${report.id}`, {
                  state: report,
                });
              }}
            >
              상세 리포트 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
