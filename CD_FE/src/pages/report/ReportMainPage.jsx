import { useNavigate, useLocation } from 'react-router-dom';
import './ReportMainPage.css';

export default function ReportPage() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[74px] max-w-[1640px] items-center justify-between px-6 sm:px-10 xl:px-12">
          <div className="flex h-full items-center gap-12">
            <button
              type="button"
              className="flex items-center gap-3 text-left"
              onClick={() => navigate('/main')}
            >
              <span className="h-7 w-7 rounded-md bg-[#263f98]" />
              <span className="text-xl font-extrabold text-[#1f3d91]">
                InterviewLens
              </span>
            </button>

            <nav className="hidden h-full items-center gap-9 text-base font-bold text-slate-600 md:flex">
              <button
                type="button"
                className={`h-full px-1 transition ${location.pathname === '/interview' ? 'border-b-[3px] border-[#263f98] text-[#263f98]' : 'hover:text-[#263f98]'}`}
                onClick={() => navigate('/interview')}
              >
                면접 연습
              </button>
              <button
                type="button"
                className={`h-full px-1 transition ${location.pathname.startsWith('/report') ? 'border-b-[3px] border-[#263f98] text-[#263f98]' : 'hover:text-[#263f98]'}`}
                onClick={() => navigate('/report')}
              >
                결과 리포트
              </button>
              <button
                type="button"
                className={`h-full px-1 transition ${location.pathname.startsWith('/settings/resume') ? 'border-b-[3px] border-[#263f98] text-[#263f98]' : 'hover:text-[#263f98]'}`}
                onClick={() => navigate('/settings/resume')}
              >
                내 자소서
              </button>
              <button
                type="button"
                className={`h-full px-1 transition ${location.pathname.startsWith('/settings/analysis-guide') ? 'border-b-[3px] border-[#263f98] text-[#263f98]' : 'hover:text-[#263f98]'}`}
                onClick={() => navigate('/settings/analysis-guide')}
              >
                분석 기준
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-5">
            <button
              type="button"
              aria-label="분석 기준 안내"
              className="h-8 w-8 rounded-full bg-slate-100 transition hover:bg-slate-200"
              onClick={() => navigate('/settings/analysis-guide')}
            />
            <button
              type="button"
              aria-label="내 자소서 관리"
              className="h-11 w-11 rounded-full bg-blue-100 transition hover:bg-blue-200"
              onClick={() => navigate('/settings/resume')}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1640px] px-6 py-7 sm:px-10 xl:px-12">
        <div className="report-main-page-content">
          <div className="report-main-header">
            <h1>누적 리포트 보기</h1>
            <p>
              면접 결과를 개별 회차별로 확인하거나 전체 변화 추이를 분석할 수
              있습니다.
            </p>
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
                <li>10개 세부 항목별 권장 범위와 사용자 값</li>
                <li>
                  주요 분석 항목의 적정·주의·체크 필요 상태를 회차별로 확인
                </li>
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
                <li>10개 분석 항목의 회차별 변화</li>
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
      </main>
    </div>
  );
}
