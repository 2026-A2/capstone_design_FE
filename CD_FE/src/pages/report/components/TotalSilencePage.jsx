import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { useEffect, useState } from 'react';
import { getReportTrends } from '../../../api/reportApi';

export default function TotalSilencePage() {
  const navigate = useNavigate();

  const [silenceData, setSilenceData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const trends = await getReportTrends();
      setSilenceData(trends.silenceTrend || []);
    };

    fetchData();
  }, []);

  const currentStep = 4;
  const totalStep = 11;
  const progressPercent = (currentStep / totalStep) * 100;

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <div>
          <div style={styles.title}>
            누적 리포트 보기 · 전체 분석 · 침묵 구간
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

      <div style={styles.chartBox}>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={silenceData}
            margin={{ top: 12, right: 20, left: 45, bottom: 16 }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="session"
              label={{
                value: '날짜',
                position: 'insideBottom',
                offset: -10,
              }}
            />

            <YAxis
              domain={[0, 10]}
              label={{
                value: '침묵 구간(회)',
                angle: -90,
                position: 'insideLeft',
              }}
            />

            <Tooltip formatter={(value) => [`${value}회`, '침묵 구간']} />

            <ReferenceLine
              y={3}
              strokeDasharray="5 5"
              label="권장 기준 3회 이하"
            />
            <ReferenceLine
              y={6}
              strokeDasharray="5 5"
              label="주의 기준 6회 초과"
            />

            <Bar dataKey="value" barSize={42} radius={[8, 8, 0, 0]}>
              {silenceData.map((entry, index) => {
                let color = '#22c55e';

                if (entry.value > 6) {
                  color = '#ef4444';
                } else if (entry.value > 3) {
                  color = '#facc15';
                }

                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={styles.infoBox}>
        <div style={styles.infoTitle}>분석 기준</div>
        <div style={styles.infoText}>
          침묵 구간은 면접 답변 중 3초 이상 말이 멈춘 횟수를 의미합니다.
          일반적으로 긴 침묵 구간은 3회 이하로 유지하는 것을 권장 기준으로 볼 수
          있습니다.
        </div>
      </div>

      <div style={styles.buttonWrap}>
        <button
          type="button"
          style={styles.prevButton}
          onClick={() => navigate('/report/total/voice-volume')}
        >
          이전
        </button>

        <button
          type="button"
          style={styles.nextButton}
          onClick={() => navigate('/report/total/filler')}
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

  chartBox: {
    width: '760px',
    height: '360px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    margin: '0 auto',
    boxSizing: 'border-box',
    boxShadow: '0 6px 18px rgba(15, 23, 42, 0.08)',
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
