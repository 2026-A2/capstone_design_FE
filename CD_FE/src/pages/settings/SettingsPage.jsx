import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SettingsPage.css';

export default function SettingsPage() {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true',
  );

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    alert('로그아웃되었습니다.');
    navigate('/');
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1>설정</h1>
        <p className="settings-subtitle">
          계정 정보와 면접 분석 환경을 확인하고 관리할 수 있습니다.
        </p>

        <section className="settings-section">
          <div className="section-title">계정</div>

          <div className="settings-card">
            <button
              className="settings-item"
              onClick={() => navigate('/settings/user-info')}
            >
              <span>유저 정보</span>
              <span className="arrow">›</span>
            </button>

            <button className="settings-item" onClick={handleLogout}>
              <span>로그아웃</span>
              <span className="arrow">›</span>
            </button>

            <button
              className="settings-item danger"
              onClick={() => navigate('/settings/delete-account')}
            >
              <span>회원탈퇴</span>
              <span className="arrow">›</span>
            </button>
          </div>
        </section>

        <section className="settings-section">
          <div className="section-title">면접 설정</div>

          <div className="settings-card">
            <button
              className="settings-item"
              onClick={() => navigate('/settings/resume')}
            >
              <span>
                자소서 관리
                <small>면접 시 입력한 자소서를 확인하고 관리합니다.</small>
              </span>
              <span className="arrow">›</span>
            </button>

            <button
              className="settings-item"
              onClick={() => navigate('/settings/analysis-guide')}
            >
              <span>
                분석 기준 안내
                <small>면접 분석에 사용되는 권장 기준을 확인합니다.</small>
              </span>
              <span className="arrow">›</span>
            </button>
          </div>
        </section>

        <section className="settings-section">
          <div className="section-title">환경 설정</div>

          <div className="settings-card">
            <button
              className="settings-item"
              onClick={() => setDarkMode((prev) => !prev)}
            >
              <span>
                다크모드
                <small>화면 테마를 어둡게 변경합니다.</small>
              </span>

              <span className={`toggle ${darkMode ? 'on' : ''}`}>
                <span />
              </span>
            </button>
          </div>
        </section>

        <section className="settings-section">
          <div className="section-title">데이터 관리</div>

          <div className="settings-card">
            <button
              className="settings-item danger"
              onClick={() => navigate('/settings/report-reset')}
            >
              <span>
                리포트 초기화
                <small>
                  저장된 면접 리포트와 누적 그래프 데이터를 관리합니다.
                </small>
              </span>
              <span className="arrow">›</span>
            </button>
          </div>
        </section>

        <button className="main-button" onClick={() => navigate('/main')}>
          메인으로 돌아가기
        </button>
      </div>
    </div>
  );
}
