import { useNavigate } from 'react-router-dom';
import './ReportMainPage.css';

export default function ReportMainPage() {
  const navigate = useNavigate();

  return (
    <div className="report-main-container">
      <div className="report-box">
        <button
          className="report-button"
          onClick={() => navigate('/report/individual')}
        >
          개별 레포트 보기
        </button>

        <button
          className="report-button"
          onClick={() => navigate('/report/total')}
        >
          전체 분석 보기
        </button>
      </div>
    </div>
  );
}
