import React from 'react';
import { useNavigate } from 'react-router-dom';
import InterviewTrendChart from './InterviewTrendChart';

export default function TotalGazeReportPage() {
  const navigate = useNavigate();

  const gazeData = JSON.parse(localStorage.getItem('cameraGazeTrend')) || [];

  return (
    <div style={styles.page}>
      <div style={styles.title}>누적 리포트 보기 · 전체 분석 · 시선처리</div>

      <InterviewTrendChart
        title="카메라 응시율"
        data={gazeData}
        yAxisLabel="시선처리율(%)"
        xAxisLabel="날짜"
        minValue={0}
        maxValue={100}
        standardType="line"
        standardValue={60}
        standardLabel="적정"
      />

      <div style={styles.buttonWrap}>
        <button
          style={styles.nextButton}
          onClick={() => navigate('/report/total/speech-rate')}
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
  nextButton: {
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
