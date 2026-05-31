import { useNavigate, useLocation, useParams } from 'react-router-dom';
import './IndividualReportDetailPage.css';
import { useEffect, useState } from 'react';
import { getIndividualReportDetail } from '../../api/reportApi';
import { getItemStatus, getStatusLabel } from './utils/reportStatus';

export default function IndividualReportDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [report, setReport] = useState(null);
  const [detailReport, setDetailReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const detailData = await getIndividualReportDetail(id);

        console.log('요약 리포트 상세 응답:', detailData);

        const reportData = detailData ||
          location.state || {
            id,
            title: '리포트 정보 없음',
            detail: {},
          };

        setReport(reportData);
        setDetailReport(detailData || null);
      } catch (error) {
        console.error('요약 리포트 조회 실패:', error);

        const fallbackReport = location.state || {
          id,
          title: '리포트 정보 없음',
          detail: {},
        };

        setReport(fallbackReport);
        setDetailReport(null);
      }
    };

    fetchReport();
  }, [id, location.state]);

  if (!report) {
    return <div>로딩 중...</div>;
  }

  const itemDefinitions = [
    {
      label: '카메라 응시율',
      key: 'eyeContactRate',
      unit: '%',
      icon: '👀',
      category: '시선 처리',
    },
    {
      label: '발화 속도',
      key: 'speechRate',
      unit: 'SPM',
      icon: '🎙️',
      category: '발화',
    },
    {
      label: '음성 크기',
      key: 'voiceVolume',
      unit: 'dB',
      icon: '🔊',
      category: '발화',
    },
    {
      label: '침묵 구간',
      key: 'silenceCount',
      unit: '회',
      icon: '⏸️',
      category: '발화',
    },
    {
      label: '필러 사용',
      key: 'fillerCount',
      unit: '회',
      icon: '💬',
      category: '발화',
    },
    {
      label: '미소율',
      key: 'smileRate',
      unit: '%',
      icon: '🙂',
      category: '표정',
    },
    {
      label: '눈 깜빡임',
      key: 'blinkCount',
      unit: '회/분',
      icon: '👁️',
      category: '습관',
    },
    {
      label: '고개 끄덕임',
      key: 'nodCount',
      unit: '%',
      icon: '🙆',
      category: '습관',
    },
    {
      label: '어깨 기울기',
      key: 'shoulderTilt',
      unit: '%',
      icon: '💪',
      category: '자세',
    },
    {
      label: '몸 흔들림',
      key: 'bodyShake',
      unit: '회',
      icon: '🔄',
      category: '자세',
    },
  ];

  const analysisItems = itemDefinitions.map((item) => {
    const value = report.detail?.[item.key];
    const status = getItemStatus(item.key, value);

    return {
      ...item,
      value,
      status,
    };
  });

  const goodItems = analysisItems.filter((item) => item.status === 'good');
  const improvementItems = analysisItems.filter(
    (item) => item.status === 'warning' || item.status === 'bad',
  );

  const categoryItems = [
    {
      label: '시선 처리',
      value: report.eyeContact || '-',
      icon: '👀',
    },
    {
      label: '발화',
      value: report.speechSummary || '-',
      icon: '🎙️',
    },
    {
      label: '표정',
      value: report.expressionSummary || '-',
      icon: '🙂',
    },
    {
      label: '습관',
      value: report.habitSummary || '-',
      icon: '📌',
    },
    {
      label: '자세',
      value: report.postureSummary || '-',
      icon: '🧍',
    },
  ];

  return (
    <div className="detail-report-page">
      <div className="detail-report-container">
        <div className="detail-report-header">
          <button
            className="detail-back-icon-button"
            onClick={() => navigate('/report/individual')}
          >
            ←
          </button>

          <div>
            <h1>개별 리포트 요약</h1>
            <p>선택한 면접 회차의 핵심 분석 결과를 한눈에 확인하세요.</p>
          </div>
        </div>

        <div className="detail-report-box">
          <div className="detail-report-top">
            <span className="detail-report-label">Interview Report</span>
            <h2>{report.title}</h2>
          </div>

          <div className="summary-dashboard">
            <div className="summary-main-card">
              <span>종합 요약</span>
              <h3>분석 결과가 준비되었습니다</h3>
              <p>
                강점과 개선 필요 항목, 카테고리별 핵심 요약을 먼저 확인한 뒤,
                상세 리포트에서 항목별 사용자 값과 권장 기준, 상세 분석을 확인할
                수 있습니다.
              </p>
            </div>

            <div className="summary-list-card good">
              <span>적정</span>
              {goodItems.length > 0 ? (
                goodItems.map((item) => (
                  <p key={item.key}>
                    {item.icon} {item.label}
                  </p>
                ))
              ) : (
                <p>아직 강점 항목이 없습니다.</p>
              )}
            </div>

            <div className="summary-list-card warning">
              <span>개선 필요</span>
              {improvementItems.length > 0 ? (
                improvementItems.map((item) => (
                  <p key={item.key}>
                    {item.icon} {item.label}
                    <em>{getStatusLabel(item.status)}</em>
                  </p>
                ))
              ) : (
                <p>개선 필요 항목이 없습니다.</p>
              )}
            </div>
          </div>

          <div className="detail-section-title">
            <h3>카테고리별 핵심 요약</h3>
            <p>각 영역의 대표 분석 결과입니다.</p>
          </div>

          <div className="detail-score-grid">
            {categoryItems.map((item) => (
              <div className="detail-score-card" key={item.label}>
                <div className="detail-score-icon">{item.icon}</div>
                <div className="detail-score-content">
                  <strong>{item.label}</strong>
                  <p>{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="detail-button-wrap">
            <button
              className="detail-prev-button"
              onClick={() => navigate('/report/individual')}
            >
              뒤로가기
            </button>

            <button
              className="detail-main-button"
              onClick={() => {
                navigate(`/report/individual/detail/full/${report.id}`, {
                  state: report,
                });
              }}
            >
              상세 리포트 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
