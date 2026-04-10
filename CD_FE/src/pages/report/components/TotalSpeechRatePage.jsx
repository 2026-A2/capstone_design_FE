import React from 'react';
import { useNavigate } from 'react-router-dom';
import InterviewTrendChart from './InterviewTrendChart';

export default function TotalSpeechRatePage() {
  const navigate = useNavigate();

  const speechRateData =
    JSON.parse(localStorage.getItem('speechRateTrend')) || [];

  return (
    <div style={styles.page}>
      <div style={styles.title}>누적 리포트 보기 · 전체 분석 · 발화속도</div>

      <InterviewTrendChart
        title="발화속도"
        data={speechRateData}
        yAxisLabel="발화속도(spm)"
        xAxisLabel="날짜"
        minValue={0}
        maxValue={350}
        standardType="range"
        standardMin={200}
        standardMax={260}
      />

      <div style={styles.buttonWrap}>
        <button
          style={styles.prevButton}
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
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
  },
};
