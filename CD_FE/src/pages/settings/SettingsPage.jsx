import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>설정</h1>
        <p style={styles.subtitle}>계정 정보를 확인하고 관리할 수 있습니다.</p>

        <div style={styles.menuBox}>
          <div
            style={styles.menuItem}
            onClick={() => navigate('/settings/user')}
          >
            <span>유저 정보</span>
            <span style={styles.arrow}>›</span>
          </div>

          <div style={styles.menuItem} onClick={handleLogout}>
            <span>로그아웃</span>
            <span style={styles.arrow}>›</span>
          </div>

          <div
            style={{ ...styles.menuItem, ...styles.danger }}
            onClick={() => navigate('/settings/delete')}
          >
            <span>회원탈퇴</span>
            <span style={styles.arrow}>›</span>
          </div>
        </div>

        <button style={styles.backButton} onClick={() => navigate('/main')}>
          메인으로 돌아가기
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f3f7fd',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '80px',
  },
  container: {
    width: '600px',
  },
  title: {
    fontSize: '30px',
    fontWeight: '800',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '28px',
  },
  menuBox: {
    backgroundColor: '#fff',
    borderRadius: '18px',
    overflow: 'hidden',
    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
  },
  menuItem: {
    padding: '24px 28px',
    borderBottom: '1px solid #e5e7eb',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: '600',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  danger: {
    color: '#dc2626',
    borderBottom: 'none',
  },
  arrow: {
    color: '#9ca3af',
    fontSize: '26px',
  },
  backButton: {
    marginTop: '24px',
    width: '100%',
    padding: '16px',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: '#6b7280',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
  },
};
