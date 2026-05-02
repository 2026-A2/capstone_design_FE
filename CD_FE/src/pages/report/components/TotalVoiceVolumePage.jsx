import { useNavigate } from 'react-router-dom';
import InterviewTrendChart from './InterviewTrendChart';

export default function TotalVoiceVolumePage() {
  const navigate = useNavigate();

  const voiceVolumeData =
    JSON.parse(localStorage.getItem('voiceVolumeTrend')) || [];

  return (
    <div style={styles.page}>
      <div style={styles.title}>누적 리포트 보기 · 전체 분석 · 음성 크기</div>

      <InterviewTrendChart
        data={voiceVolumeData}
        dataKey="voiceVolume"
        yLabel="음성 크기(dB)"
        minValue={0}
        maxValue={100}
        standardMin={50}
        standardMax={70}
      />

      <div style={styles.infoBox}>
        <div style={styles.infoTitle}>분석 기준</div>
        <div style={styles.infoText}>
          음성 크기는 면접 중 사용자의 평균 목소리 크기를 의미합니다. 일반적으로
          50~70dB 범위를 권장 기준으로 볼 수 있습니다.
        </div>
      </div>

      <div style={styles.buttonWrap}>
        <button
          type="button"
          style={styles.prevButton}
          onClick={() => navigate('/report/total/speech-rate')}
        >
          이전
        </button>

        <button
          type="button"
          style={styles.nextButton}
          onClick={() => navigate('/report/total/silence')}
        >
          다음
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f3f7fd',
    padding: '48px 40px 80px',
    boxSizing: 'border-box',
  },
  title: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: '28px',
  },
  infoBox: {
    width: '760px',
    backgroundColor: '#fff',
    padding: '18px 20px',
    borderRadius: '12px',
    marginTop: '18px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  infoTitle: {
    fontSize: '15px',
    fontWeight: '700',
    marginBottom: '6px',
  },
  infoText: {
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#374151',
  },
  buttonWrap: {
    width: '760px',
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '24px',
  },
  prevButton: {
    border: 'none',
    backgroundColor: '#6b7280',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '700',
  },
  nextButton: {
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '700',
  },
};
