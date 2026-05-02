import { useNavigate } from 'react-router-dom';

export default function UserInfoPage() {
  const navigate = useNavigate();

  const user = {
    name: '테스트 유저',
    email: 'test@email.com',
    loginType: '일반 로그인',
    createdAt: '2026.05.01',
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>유저 정보</h1>
        <p style={styles.subtitle}>
          현재 로그인된 계정 정보를 확인할 수 있습니다.
        </p>

        <div style={styles.card}>
          <div style={styles.row}>
            <span style={styles.label}>이름</span>
            <span style={styles.value}>{user.name}</span>
          </div>

          <div style={styles.row}>
            <span style={styles.label}>이메일</span>
            <span style={styles.value}>{user.email}</span>
          </div>

          <div style={styles.row}>
            <span style={styles.label}>로그인 방식</span>
            <span style={styles.value}>{user.loginType}</span>
          </div>

          <div style={styles.row}>
            <span style={styles.label}>가입일</span>
            <span style={styles.value}>{user.createdAt}</span>
          </div>
        </div>

        <button style={styles.backButton} onClick={() => navigate('/settings')}>
          설정으로 돌아가기
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
  card: {
    backgroundColor: '#fff',
    borderRadius: '18px',
    padding: '12px 28px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '22px 0',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '17px',
  },
  label: {
    color: '#6b7280',
    fontWeight: '600',
  },
  value: {
    color: '#111827',
    fontWeight: '700',
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
