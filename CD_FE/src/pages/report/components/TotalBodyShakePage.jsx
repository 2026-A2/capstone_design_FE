import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { getReportTrends } from '../../../api/reportApi';

export default function TotalBodyShakePage() {
  const navigate = useNavigate();
  const [bodyShakeData, setBodyShakeData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getReportTrends();

        console.log('몸 흔들림 추세 응답:', response);

        const trends = response?.data || response?.results || response || {};

        setBodyShakeData(trends.bodyShakeTrend || []);
      } catch (error) {
        console.error('몸 흔들림 추세 조회 실패:', error);
        setBodyShakeData([]);
      }
    };

    fetchData();
  }, []);

  const currentStep = 11;
  const totalStep = 11;
  const progressPercent = (currentStep / totalStep) * 100;

  const getBarColor = (value) => {
    if (value >= 3) return '#ef4444';
    if (value >= 2) return '#facc15';
    return '#22c55e';
  };

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <div>
          <div style={styles.title}>
            누적 리포트 보기 · 전체 분석 · 몸통 흔들림
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
            data={bodyShakeData}
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
              domain={[0, 4]}
              label={{
                value: '이탈횟수(회)',
                angle: -90,
                position: 'insideLeft',
              }}
            />

            <Tooltip formatter={(value) => [`${value}회`, '이탈횟수']} />

            <ReferenceLine
              y={1}
              strokeDasharray="5 5"
              label="권장 기준 1회 이하"
            />

            <Bar dataKey="value" barSize={42} radius={[8, 8, 0, 0]}>
              {bodyShakeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.value)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={styles.infoBox}>
        <div style={styles.infoTitle}>분석 기준</div>
        <div style={styles.infoText}>
          몸통 기울기 10° 이상 이탈 빈도입니다. 일반적으로 1회 이하는 안정적,
          1회 초과는 주의, 3회 이상은 개선이 필요한 수준으로 볼 수 있습니다.
        </div>
      </div>

      <div style={styles.buttonWrap}>
        <button
          type="button"
          style={styles.prevButton}
          onClick={() => navigate('/report/total/shoulder-tilt')}
        >
          이전
        </button>

        <button
          type="button"
          style={styles.nextButton}
          onClick={() => navigate('/report/total')}
        >
          완료
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
