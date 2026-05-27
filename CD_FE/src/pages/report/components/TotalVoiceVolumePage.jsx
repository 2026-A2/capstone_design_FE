import { useNavigate } from 'react-router-dom';
import InterviewTrendChart from './InterviewTrendChart';
import { useEffect, useState } from 'react';
import { getReportTrends } from '../../../api/reportApi';

export default function TotalVoiceVolumePage() {
  const navigate = useNavigate();

  const [voiceVolumeData, setVoiceVolumeData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trends = await getReportTrends();

        console.log('음성 크기 추세 응답:', trends);

        setVoiceVolumeData(trends.voiceVolumeTrend || []);
      } catch (error) {
        console.error('음성 크기 추세 조회 실패:', error);
        setVoiceVolumeData([]);
      }
    };

    fetchData();
  }, []);
  const currentStep = 3;
  const totalStep = 10;
  const progressPercent = (currentStep / totalStep) * 100;

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <div>
          <div style={styles.title}>
            누적 리포트 보기 · 전체 분석 · 음성 크기
          </div>
          <div style={styles.stepText}>
            {currentStep} / {totalStep} 단계
          </div>
        </div>

        <button
          type="button"
          style={styles.listButton}
          onClick={() => navigate('/report/total')}
        >
          ← 전체 분석 목록으로
        </button>
      </div>

      <div style={styles.progressBar}>
        <div
          style={{
            ...styles.progressFill,
            width: `${progressPercent}%`,
          }}
        />
      </div>

      <InterviewTrendChart
        data={voiceVolumeData}
        xKey="session"
        dataKey="avgVoiceVolume"
        lines={[
          {
            dataKey: 'avgVoiceVolume',
            name: '평균 음성 크기',
            stroke: '#2563eb',
          },
        ]}
        yLabel="음성 크기(dB)"
        minValue={-60}
        maxValue={0}
        standardMin={-35}
        standardMax={-20}
      />

      <div style={styles.infoBox}>
        <div style={styles.infoTitle}>분석 기준</div>
        <div style={styles.infoText}>
          음성 크기는 녹음 파일 내 최대 음량을 0dB로 둔 상대값 기준으로
          분석합니다. 면접에서는 -20~-35dB 범위가 가장 이상적인 정상 범위이며,
          -10dB 이상은 매우 큰 목소리, -50dB 미만은 전달력이 낮은 매우 작은
          목소리로 볼 수 있습니다.
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

  headerRow: {
    width: '760px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    margin: '0 auto 14px',
  },

  title: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: '8px',
  },

  stepText: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#6366f1',
  },

  listButton: {
    border: 'none',
    backgroundColor: 'transparent',
    color: '#6b7280',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    padding: 0,
    marginTop: '2px',
  },

  progressBar: {
    width: '760px',
    height: '10px',
    backgroundColor: '#e5e7eb',
    borderRadius: '999px',
    overflow: 'hidden',
    margin: '0 auto 28px',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: '999px',
    transition: 'width 0.3s ease',
  },

  infoBox: {
    width: '760px',
    backgroundColor: '#fff',
    padding: '18px 20px',
    borderRadius: '12px',
    margin: '18px auto 0',
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
    margin: '24px auto 0',
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
