import { useNavigate } from 'react-router-dom';
import InterviewTrendChart from './InterviewTrendChart';
import { useEffect, useState } from 'react';
import { getReportTrends } from '../../../api/reportApi';

export default function TotalBlinkPage() {
  const navigate = useNavigate();
  const [blinkData, setBlinkData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trends = await getReportTrends();

        console.log('눈 깜빡임 추세 응답:', trends);

        const chartData = (trends.blinkTrend || []).map((item) => ({
          session: item.date,
          value: item.value,
        }));

        setBlinkData(chartData);
      } catch (error) {
        console.error('눈 깜빡임 추세 조회 실패:', error);
        setBlinkData([]);
      }
    };

    fetchData();
  }, []);

  const currentStep = 7;
  const totalStep = 10;
  const progressPercent = (currentStep / totalStep) * 100;

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <div>
          <div style={styles.title}>
            누적 리포트 보기 · 전체 분석 · 눈 깜빡임
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
        data={blinkData}
        xKey="session"
        dataKey="value"
        yLabel="눈 깜빡임(회/분)"
        minValue={0}
        maxValue={30}
        standardMin={15}
        standardMax={20}
      />

      <div style={styles.infoBox}>
        <div style={styles.infoTitle}>분석 기준</div>

        <div style={styles.infoText}>
          눈 깜빡임은 면접 중 사용자의 긴장도와 집중 상태를 간접적으로 확인할 수
          있는 비언어적 지표입니다. 일반적으로 분당 15~20회 정도를 자연스러운
          범위로 보고, 이보다 지나치게 낮거나 높을 경우 긴장 또는 시선 처리
          불안정의 신호로 해석할 수 있습니다.
        </div>
      </div>

      <div style={styles.buttonWrap}>
        <button
          type="button"
          style={styles.prevButton}
          onClick={() => navigate('/report/total/smile-rate')}
        >
          이전
        </button>

        <button
          type="button"
          style={styles.nextButton}
          onClick={() => navigate('/report/total/nod')}
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
