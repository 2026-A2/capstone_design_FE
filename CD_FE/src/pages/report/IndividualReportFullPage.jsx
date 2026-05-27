import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './IndividualReportFullPage.css';
import { getIndividualReportDetail } from '../../api/reportApi';

const REPORT_CATEGORIES = ['시선처리', '발화', '표정', '습관', '자세'];

export default function IndividualReportFullPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [expandedItems, setExpandedItems] = useState({});
  const [report, setReport] = useState(null);
  const [detailReport, setDetailReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const detailData = await getIndividualReportDetail(id);

        console.log('상세 리포트 응답:', detailData);

        setReport(
          detailData || {
            id,
            title: '리포트 정보 없음',
            detail: {},
          },
        );

        setDetailReport(detailData || null);
      } catch (error) {
        console.error('상세 리포트 조회 실패:', error);

        setReport({
          id,
          title: '리포트 정보 없음',
          detail: {},
        });

        setDetailReport(null);
      }
    };

    fetchReport();
  }, [id]);

  if (!report) {
    return <div>로딩 중...</div>;
  }

  const getItemStatus = (key, value) => {
    if (value === undefined || value === null || Number.isNaN(value)) {
      return 'neutral';
    }

    switch (key) {
      case 'eyeContactRate':
        if (value >= 60) return 'good';
        if (value >= 50) return 'warning';
        return 'bad';
      case 'speechRate':
        if (value >= 200 && value <= 260) return 'good';
        if (value >= 180 && value <= 300) return 'warning';
        return 'bad';
      case 'silenceCount':
        if (value <= 3) return 'good';
        if (value <= 6) return 'warning';
        return 'bad';
      case 'fillerCount':
        if (value <= 3) return 'good';
        if (value <= 6) return 'warning';
        return 'bad';
      case 'voiceVolume':
        if (value >= -10) return 'voice-very-high';
        if (value >= -20) return 'voice-high';
        if (value >= -35) return 'good';
        if (value >= -50) return 'voice-low';
        return 'voice-very-low';
      case 'smileRate':
        if (value >= 50) return 'good';
        if (value >= 30) return 'warning';
        return 'bad';
      case 'blinkCount':
        if (value >= 15 && value <= 20) return 'good';
        if (value >= 10 && value <= 25) return 'warning';
        return 'bad';
      case 'nodCount':
        if (value >= 80 && value <= 100) return 'good';
        if (value >= 60 && value < 80) return 'warning';
        return 'bad';
      case 'shoulderTilt':
        if (value >= 80 && value <= 100) return 'good';
        if (value >= 60 && value < 80) return 'warning';
        return 'bad';
      case 'bodyShake':
        if (value <= 1) return 'good';
        if (value <= 3) return 'warning';
        return 'bad';
      default:
        return 'neutral';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good':
        return '#4CAF50';
      case 'warning':
        return '#FFC107';
      case 'bad':
        return '#F44336';
      case 'voice-very-high':
        return '#F44336';
      case 'voice-high':
        return '#FFC107';
      case 'voice-low':
        return '#FFC107';
      case 'voice-very-low':
        return '#F44336';
      default:
        return '#e0e0e0';
    }
  };

  const getStatusTone = (status) => {
    switch (status) {
      case 'good':
        return 'good';
      case 'warning':
      case 'voice-high':
      case 'voice-low':
        return 'warning';
      case 'bad':
      case 'voice-very-high':
      case 'voice-very-low':
        return 'bad';
      default:
        return 'neutral';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'good':
        return '적정';
      case 'warning':
        return '주의';
      case 'bad':
        return '체크 필요';
      case 'voice-very-high':
        return '매우 큼';
      case 'voice-high':
        return '큼';
      case 'voice-low':
        return '작음';
      case 'voice-very-low':
        return '매우 작음';
      default:
        return '';
    }
  };

  const getDetailFromData = (label) => {
    if (!detailReport?.categories) {
      return { description: '', detail: '' };
    }

    for (const category of detailReport.categories) {
      const item = category.items?.find((i) => i.label === label);

      if (item) {
        return {
          description: item.description,
          detail: item.detail,
        };
      }
    }

    return { description: '', detail: '' };
  };

  const itemDefinitions = [
    {
      label: '카메라 응시율',
      key: 'eyeContactRate',
      unit: '%',
      icon: '📷',
      recommendedText: '60% 이상 권장',
      category: '시선처리',
    },
    {
      label: '발화 속도',
      key: 'speechRate',
      unit: 'SPM',
      icon: '🎙️',
      recommendedText: '200-260 SPM 권장',
      category: '발화',
    },
    {
      label: '음성 크기',
      key: 'voiceVolume',
      unit: 'dB',
      icon: '🔊',
      recommendedText:
        '평균 -20~-35dB 권장, -10 이상: 매우 큼, -10~-20: 큼, -35~-50: 작음, -50 미만: 매우 작음',
      category: '발화',
    },
    {
      label: '침묵 구간',
      key: 'silenceCount',
      unit: '회',
      icon: '⏸️',
      recommendedText: '3회 이하 권장',
      category: '발화',
    },
    {
      label: '필러 사용',
      key: 'fillerCount',
      unit: '회',
      icon: '💬',
      recommendedText: '3회 이하 권장',
      category: '발화',
    },
    {
      label: '미소율',
      key: 'smileRate',
      unit: '%',
      icon: '😊',
      recommendedText: '50% 이상 권장, 면접시작·마무리 2회 권장',
      category: '표정',
    },
    {
      label: '눈 깜빡임',
      key: 'blinkCount',
      unit: '회/분',
      icon: '👁️',
      recommendedText: '분당 15-20회 권장',
      category: '습관',
    },
    {
      label: '고개 끄덕임',
      key: 'nodCount',
      unit: '%',
      icon: '👤',
      recommendedText: '80-100% 권장',
      category: '습관',
    },
    {
      label: '어깨 기울기',
      key: 'shoulderTilt',
      unit: '%',
      icon: '💪',
      recommendedText: '80-100% 권장',
      category: '자세',
    },
    {
      label: '몸 흔들림',
      key: 'bodyShake',
      unit: '회',
      icon: '🔄',
      recommendedText: '1회 이하 권장',
      category: '자세',
    },
  ];

  const analysisItems = itemDefinitions.map((def) => {
    const detailInfo = getDetailFromData(def.label);
    const value = report.detail?.[def.key];
    const status = getItemStatus(def.key, value);

    return {
      ...def,
      value,
      status,
      description: detailInfo.description,
      detailContent: detailInfo.detail,
    };
  });

  const clampPercent = (value) => Math.min(Math.max(value, 0), 100);

  const getMetricScale = (key) => {
    switch (key) {
      case 'speechRate':
        return { min: 0, max: 320, goodMin: 200, goodMax: 260 };
      case 'voiceVolume':
        return { min: -60, max: 0, goodMin: -35, goodMax: -20 };
      case 'silenceCount':
      case 'fillerCount':
        return { min: 0, max: 10, goodMin: 0, goodMax: 3 };
      case 'blinkCount':
        return { min: 0, max: 30, goodMin: 15, goodMax: 20 };
      case 'bodyShake':
        return { min: 0, max: 5, goodMin: 0, goodMax: 1 };
      case 'eyeContactRate':
        return { min: 0, max: 100, goodMin: 60, goodMax: 100 };
      case 'smileRate':
        return { min: 0, max: 100, goodMin: 50, goodMax: 100 };
      case 'nodCount':
      case 'shoulderTilt':
        return { min: 0, max: 100, goodMin: 80, goodMax: 100 };
      default:
        return { min: 0, max: 100, goodMin: 0, goodMax: 100 };
    }
  };

  const getMetricGauge = (item) => {
    const value = Number(item.value);
    const scale = getMetricScale(item.key);
    const scaleSize = scale.max - scale.min;
    const toPercent = (targetValue) =>
      clampPercent(((targetValue - scale.min) / scaleSize) * 100);

    const goodStart = toPercent(scale.goodMin);
    const goodEnd = toPercent(scale.goodMax);

    return {
      marker: Number.isNaN(value) ? 0 : toPercent(value),
      rangeStart: goodStart,
      rangeWidth: Math.max(goodEnd - goodStart, 2),
      minLabel: `${scale.min}${item.unit}`,
      maxLabel: `${scale.max}${item.unit}`,
    };
  };

  const goodCount = analysisItems.filter(
    (item) => getStatusTone(item.status) === 'good',
  ).length;
  const warningCount = analysisItems.filter(
    (item) => getStatusTone(item.status) === 'warning',
  ).length;
  const badCount = analysisItems.filter(
    (item) => getStatusTone(item.status) === 'bad',
  ).length;

  const categorySummaries = REPORT_CATEGORIES.map((category) => {
    const categoryItems = analysisItems.filter(
      (item) => item.category === category,
    );
    const needsCheck = categoryItems.filter(
      (item) => getStatusTone(item.status) !== 'good',
    ).length;

    return {
      category,
      count: categoryItems.length,
      needsCheck,
    };
  }).filter((category) => category.count > 0);

  const toggleItemExpand = (itemIndex) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemIndex]: !prev[itemIndex],
    }));
  };

  const toggleAllItems = () => {
    const isAllExpanded = analysisItems.every(
      (_, index) => expandedItems[index],
    );

    if (isAllExpanded) {
      setExpandedItems({});
      return;
    }

    setExpandedItems(
      analysisItems.reduce((acc, _, index) => {
        acc[index] = true;
        return acc;
      }, {}),
    );
  };

  const handleDownloadReport = () => {
    const categories = REPORT_CATEGORIES;

    let reportText = `${report.title}\n\n[분석 결과 상세]\n\n`;

    categories.forEach((category) => {
      const categoryItems = analysisItems.filter(
        (item) => item.category === category,
      );

      if (categoryItems.length === 0) return;

      reportText += `■ ${category}\n`;
      reportText += categoryItems
        .map(
          (item) => `
- ${item.label}
  값: ${item.value !== undefined ? item.value : '-'}${item.unit}
  상태: ${getStatusLabel(item.status)}
  권장 기준: ${item.recommendedText}
  상세 분석: ${item.detailContent || '상세 분석 정보가 없습니다.'}
`,
        )
        .join('');

      reportText += '\n';
    });

    const blob = new Blob([reportText], {
      type: 'text/plain;charset=utf-8',
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.title || 'interview-report'}.txt`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="full-report-page">
      <div className="full-report-container">
        <div className="full-report-header">
          <button
            className="full-back-button"
            onClick={() => navigate('/report/individual')}
          >
            ←
          </button>

          <div className="full-header-content">
            <h1>개별 리포트 상세</h1>
            <p>AI 면접 분석 결과를 상세히 확인하세요</p>
          </div>
        </div>

        <div className="full-report-main">
          <div className="score-header-section">
            <div className="score-info">
              <span className="score-label">Interview Report</span>
              <h2>{report.title}</h2>
            </div>

            <div className="score-summary">
              <div className="summary-pill good">
                <span>{goodCount}</span>
                <p>적정</p>
              </div>
              <div className="summary-pill warning">
                <span>{warningCount}</span>
                <p>주의</p>
              </div>
              <div className="summary-pill bad">
                <span>{badCount}</span>
                <p>체크 필요</p>
              </div>
            </div>
          </div>

          <div className="analysis-container">
            <div className="analysis-title-row">
              <h3 className="analysis-title">분석 결과 상세</h3>

              <button
                className="toggle-all-button"
                type="button"
                onClick={toggleAllItems}
              >
                {analysisItems.every((_, index) => expandedItems[index])
                  ? '전체 접기'
                  : '전체 펼치기'}
              </button>
            </div>

            <div className="category-overview">
              {categorySummaries.map((item) => (
                <div className="category-chip" key={item.category}>
                  <strong>{item.category}</strong>
                  <span>
                    {item.needsCheck > 0
                      ? `${item.needsCheck}개 확인 필요`
                      : '모두 적정'}
                  </span>
                </div>
              ))}
            </div>

            <div className="analysis-items">
              {REPORT_CATEGORIES.map((category) => {
                const categoryItems = analysisItems.filter(
                  (item) => item.category === category,
                );

                if (categoryItems.length === 0) return null;

                return (
                  <div key={category} className="analysis-category">
                    <h4 className="category-title">{category}</h4>
                    <div className="category-items">
                      {categoryItems.map((item) => {
                        const globalIndex = analysisItems.indexOf(item);
                        const isExpanded = expandedItems[globalIndex];
                        const metricGauge = getMetricGauge(item);

                        return (
                          <div key={globalIndex} className="analysis-card">
                            <button
                              type="button"
                              className="analysis-header"
                              onClick={() => toggleItemExpand(globalIndex)}
                              style={{
                                borderLeftColor: getStatusColor(item.status),
                                backgroundColor: `${getStatusColor(
                                  item.status,
                                )}15`,
                              }}
                            >
                              <div className="analysis-left">
                                <span className="analysis-icon">
                                  {item.icon}
                                </span>

                                <div className="analysis-info">
                                  <h4>{item.label}</h4>
                                  <p>{item.description}</p>
                                </div>
                              </div>

                              <div className="analysis-right">
                                <div
                                  className="status-badge"
                                  style={{
                                    backgroundColor: getStatusColor(
                                      item.status,
                                    ),
                                  }}
                                >
                                  <span className="status-text">
                                    {getStatusLabel(item.status)}
                                  </span>
                                </div>

                                <div className="value-display">
                                  <span className="value-number">
                                    {item.value !== undefined
                                      ? item.value
                                      : '-'}
                                  </span>
                                  <span className="value-unit">
                                    {item.unit}
                                  </span>
                                </div>

                                <span className="expand-btn">
                                  {isExpanded ? '▼' : '▶'}
                                </span>
                              </div>
                            </button>

                            <div className="metric-track-wrap">
                              <div
                                className="metric-track"
                                style={{
                                  '--range-start': `${metricGauge.rangeStart}%`,
                                  '--range-width': `${metricGauge.rangeWidth}%`,
                                  '--marker-left': `${metricGauge.marker}%`,
                                  '--marker-color': getStatusColor(item.status),
                                }}
                              >
                                <span className="metric-good-range" />
                                <span className="metric-marker" />
                              </div>

                              <div className="metric-labels">
                                <span>{metricGauge.minLabel}</span>
                                <strong>{item.recommendedText}</strong>
                                <span>{metricGauge.maxLabel}</span>
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="analysis-detail">
                                <div className="detail-section">
                                  <h5>상세 분석</h5>
                                  <p>
                                    {item.detailContent ||
                                      '상세 분석 정보가 없습니다.'}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="full-report-actions">
            <button
              className="action-btn back-btn"
              onClick={() => navigate('/report/individual')}
            >
              뒤로가기
            </button>

            <button
              className="action-btn download-btn"
              onClick={handleDownloadReport}
            >
              리포트 다운로드
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
