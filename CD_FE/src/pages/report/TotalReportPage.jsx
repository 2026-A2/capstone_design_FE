import { useState } from 'react';
import InterviewTrendChart from './components/InterviewTrendChart';
import { getTrendResult } from './utils/reportStorage';

export default function TotalReportPage() {
  const [cameraData] = useState(() => getTrendResult('cameraGazeTrend'));

  return (
    <div style={styles.page}>
      <div style={styles.title}>누적 리포트 보기 - 전체 분석 - 시선처리</div>

      <InterviewTrendChart
        title="카메라 응시율"
        data={cameraData}
        standardLabel="적정"
        standardValue={60}
        minValue={0}
        maxValue={100}
      />
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#eff6ff',
    padding: '40px',
    boxSizing: 'border-box',
  },
  title: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: '20px',
  },
};
