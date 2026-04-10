import React from 'react';
import { useNavigate } from 'react-router-dom';
import FillerBarChart from './FillerBarChart';

export default function TotalFillerPage() {
  const navigate = useNavigate();

  const fillerData = JSON.parse(localStorage.getItem('fillerTrend')) || [];

  return (
    <div style={styles.page}>
      <div style={styles.title}>누적 리포트 보기 · 전체 분석 · 필러어</div>

      <FillerBarChart
        data={fillerData}
        yAxisLabel="횟수"
        xAxisLabel="날짜"
        maxValue={10}
        warningValue={6}
      />

      <div style={styles.buttonWrap}>
        <button
          style={styles.prevButton}
          onClick={() => navigate('/report/total/speech-rate')}
        >
          이전
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
  },
  title: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e3a8a',
    marginBottom: '28px',
  },
  buttonWrap: {
    width: '760px',
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '24px',
  },
  prevButton: {
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '10px',
    cursor: 'pointer',
  },
};
