import { useNavigate } from 'react-router-dom';
import './ReportMainPage.css';

export default function ReportPage() {
  const navigate = useNavigate();

  return (
    <div className="report-main-page">
      <div className="report-main-container">
        <div className="report-main-header">
          <button className="back-button" onClick={() => navigate('/main')}>
            ←
          </button>
          <div>
            <h1>누적 리포트 보기</h1>
            <p>
              면접 결과를 개별 회차별로 확인하거나 전체 변화 추이를 분석할 수
              있습니다.
            </p>
          </div>
        </div>

        <div className="report-card-grid">
          <div
            className="report-card"
            onClick={() => navigate('/report/individual')}
          >
            <div className="report-card-icon">📄</div>
            <h2>개별 리포트 보기</h2>
            <p>
              면접 회차별 상세 결과를 확인하고 각 항목별 피드백을 볼 수
              있습니다.
            </p>
            <button>확인하기</button>
          </div>

          <div
            className="report-card"
            onClick={() => navigate('/report/total')}
          >
            <div className="report-card-icon">📊</div>
            <h2>전체 분석 보기</h2>
            <p>
              여러 면접 결과를 비교하여 시선, 발화, 표정 변화 추이를 확인합니다.
            </p>
            <button>분석 보기</button>
          </div>
        </div>

        <div className="report-info-box">
          <strong>TIP</strong>
          <span>
            개별 리포트는 한 회차의 상세 분석, 전체 분석은 누적 데이터를
            기반으로 한 변화 추이 확인에 적합합니다.
          </span>
        </div>
      </div>
    </div>
  );
}
