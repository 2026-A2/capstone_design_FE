import { useNavigate } from 'react-router-dom';

export default function DeleteAccountPage() {
  const navigate = useNavigate();

  const handleDeleteAccount = () => {
    const isConfirmed = window.confirm(
      '정말 회원탈퇴를 진행하시겠습니까? 탈퇴 후 계정 정보는 복구할 수 없습니다.',
    );

    if (!isConfirmed) return;

    localStorage.removeItem('token');
    alert('회원탈퇴가 완료되었습니다.');
    navigate('/');
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>회원탈퇴</h1>
        <p style={styles.subtitle}>탈퇴 전 아래 내용을 꼭 확인해주세요.</p>

        <div style={styles.card}>
          <p style={styles.warningTitle}>주의사항</p>

          <ul style={styles.list}>
            <li>탈퇴 후 계정 정보는 복구할 수 없습니다.</li>
            <li>저장된 면접 기록과 레포트가 삭제될 수 있습니다.</li>
            <li>동일 이메일로 재가입이 제한될 수 있습니다.</li>
          </ul>

          <button style={styles.deleteButton} onClick={handleDeleteAccount}>
            회원탈퇴
          </button>
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
    padding: '28px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
  },
  warningTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#dc2626',
    marginBottom: '16px',
  },
  list: {
    color: '#374151',
    lineHeight: '1.9',
    marginBottom: '28px',
  },
  deleteButton: {
    width: '100%',
    padding: '16px',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: '#dc2626',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
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
