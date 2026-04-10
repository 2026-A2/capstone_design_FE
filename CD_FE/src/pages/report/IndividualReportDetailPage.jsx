import { useNavigate, useLocation } from 'react-router-dom';
import './IndividualReportDetailPage.css';

export default function IndividualReportDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const report = location.state || {
    title: '레포트 정보 없음',
    eyeContact: '-',
  };

  return (
    <div className="detail-report-container">
      <div className="detail-report-title">누적 레포트 보기 - 개별 레포트</div>

      <div className="detail-report-box">
        <div className="detail-report-header">{report.title}</div>

        <div className="detail-report-score">
          시선처리: <span>{report.eyeContact}</span>
          <span className="detail-report-note">
            {' '}
            (요약해서 보여주고 눌러야 상세)
          </span>
        </div>

        <div className="detail-report-list">
          <div className="detail-report-item">
            발화: {report.speechSummary || '-'}
          </div>

          <div className="detail-report-item">
            표정: {report.expressionSummary || '-'}
          </div>

          <div className="detail-report-item">
            버릇: {report.habitSummary || '-'}
          </div>

          <div className="detail-report-item">
            자세: {report.postureSummary || '-'}
          </div>
        </div>

        <div className="detail-report-button-row">
          <button
            className="detail-report-button secondary"
            onClick={() => navigate('/report/individual')}
          >
            뒤로가기
          </button>

          <button className="detail-report-button primary">
            텍스트 전문 보기
          </button>
        </div>
      </div>
    </div>
  );
}
