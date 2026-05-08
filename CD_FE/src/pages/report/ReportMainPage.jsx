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
            <h2>개별 리포트</h2>
            <p>특정 면접 회차의 상세 결과를 한눈에 확인합니다.</p>
            <ul className="report-feature-list blue">
              <li>한 회차의 5개 카테고리 요약</li>
              <li>11개 세부 항목별 권장 범위와 사용자 값</li>
              <li>회차별 출처ㆍ정성 코멘트</li>
            </ul>
            <button>회차 선택하러 가기</button>
          </div>

          <div
            className="report-card"
            onClick={() => navigate('/report/total')}
          >
            <div className="report-card-icon">📊</div>
            <h2>누적 리포트</h2>
            <p>여러 회차에 걸친 변화 추이를 그래프로 비교합니다.</p>

            <ul className="report-feature-list orange">
              <li>11개 분석 항목의 회차별 변화</li>
              <li>권장 범위 밴드ㆍ임계값 점선 표시</li>
              <li>발전ㆍ정체ㆍ후퇴 구간 한눈에 파악</li>
            </ul>
            <button>전체 추이 분석</button>
          </div>
        </div>

        <div className="report-info-box">
          <strong>TIP</strong>
          <span>
            개별 리포트는 한 회차의 상세 분석, 누적 리포트는 누적 데이터를
            기반으로 한 변화 추이 확인에 적합합니다.
          </span>
        </div>
      </div>
    </div>
  );
}
