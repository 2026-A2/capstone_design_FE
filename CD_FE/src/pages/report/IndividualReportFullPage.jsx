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
        if (value >= 85) return 'good';
        if (value >= 65) return 'warning';
        return 'bad';
      case 'speechRate':
        if (value >= 250 && value <= 350) return 'good';
        if ((value >= 200 && value < 250) || (value > 350 && value <= 450))
          return 'warning';
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
        if (value >= -10) return 'bad';
        if (value >= -20) return 'warning';
        if (value >= -35) return 'good';
        if (value >= -50) return 'warning';
        return 'bad';
      case 'smileRate':
        if (value >= 11) return 'good';
        if (value >= 5 && value <= 10) return 'warning';
        return 'bad';
      case 'blinkCount':
        if (value >= 40 && value <= 60) return 'good';
        if (value > 60 && value <= 75) return 'warning';
        return 'bad';
      case 'nodCount':
        if (value <= 1) return 'good';
        if (value <= 5) return 'warning';
        return 'bad';
      case 'shoulderTilt':
        if (value >= 90) return 'good';
        if (value >= 75 && value < 90) return 'warning';
        return 'bad';
      case 'bodyShake':
        if (value <= 1) return 'good';
        if (value < 4) return 'warning';
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
      default:
        return '#e0e0e0';
    }
  };

  const getStatusTone = (status) => {
    switch (status) {
      case 'good':
        return 'good';
      case 'warning':
        return 'warning';
      case 'bad':
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
      default:
        return '';
    }
  };

  const getItemStatusLabel = (item) => {
    if (item.key === 'bodyShake') {
      switch (getStatusTone(item.status)) {
        case 'good':
          return '안정';
        case 'warning':
          return '보통';
        case 'bad':
          return '체크 필요';
        default:
          return '';
      }
    }

    if (item.key === 'nodCount') {
      switch (getStatusTone(item.status)) {
        case 'good':
          return '적음';
        case 'warning':
          return '보통';
        case 'bad':
          return '많음';
        default:
          return '';
      }
    }

    return getStatusLabel(item.status);
  };

  const getGuidelineForItem = (key) => {
    switch (key) {
      case 'eyeContactRate':
        return [
          {
            level: '적정',
            range: '≥ 85%',
            description: '충분한 카메라 응시율',
          },
          {
            level: '주의',
            range: '65~84%',
            description: '카메라 응시 개선 권장',
          },
          {
            level: '체크필요',
            range: '≤ 64%',
            description: '카메라 응시 개선 필요',
          },
        ];
      case 'speechRate':
        return [
          {
            level: '체크필요',
            range: '< 200 SPM',
            description: '매우 느림',
          },
          {
            level: '주의',
            range: '200-249 SPM',
            description: '느림',
          },
          {
            level: '적정',
            range: '250-350 SPM',
            description: '적정',
          },
          {
            level: '주의',
            range: '351-450 SPM',
            description: '빠름',
          },
          {
            level: '체크필요',
            range: '> 450 SPM',
            description: '매우 빠름',
          },
        ];
      case 'voiceVolume':
        return [
          {
            level: '체크필요',
            range: '< -50 dB',
            description: '매우 작음',
          },
          {
            level: '주의',
            range: '-50 ~ -35 dB',
            description: '작음',
          },
          {
            level: '적정',
            range: '-35 ~ -20 dB',
            description: '적정',
          },
          {
            level: '주의',
            range: '-20 ~ -10 dB',
            description: '큼',
          },
          {
            level: '체크필요',
            range: '≥ -10 dB',
            description: '매우 큼',
          },
        ];
      case 'silenceCount':
        return [
          {
            level: '적정',
            range: '≤ 3회',
            description: '침묵 구간 적절한 수준',
          },
          { level: '주의', range: '4~6회', description: '침묵 구간 개선 권장' },
          {
            level: '체크필요',
            range: '≥ 7회',
            description: '침묵 구간 개선 필요',
          },
        ];
      case 'fillerCount':
        return [
          {
            level: '적정',
            range: '≤ 3회',
            description: '필러어 사용횟수 적절한 수준',
          },
          {
            level: '주의',
            range: '4~6회',
            description: '필러어 사용횟수 감소 권장',
          },
          {
            level: '체크필요',
            range: '≥ 7회',
            description: '필러어 사용횟수 감소 필요',
          },
        ];
      case 'smileRate':
        return [
          { level: '적정', range: '11% 이상', description: '적절한 미소율' },
          { level: '주의', range: '5~10%', description: '미소율 개선 권장' },
          {
            level: '체크필요',
            range: '< 5%',
            description: '미소율 개선 필요',
          },
        ];
      case 'blinkCount':
        return [
          {
            level: '적정',
            range: '40~60회/분',
            description: '자연스러운 눈 깜빡임',
          },
          {
            level: '주의',
            range: '60~75회/분',
            description: '눈 깜빡임 횟수 조절 권장',
          },
          {
            level: '체크필요',
            range: '< 40 또는 > 75회/분',
            description: '눈 깜빡임 횟수 개선 필요',
          },
        ];
      case 'nodCount':
        return [
          {
            level: '적음',
            range: '≤ 1회/분',
            description: '고개 끄덕임 적음',
          },
          {
            level: '보통',
            range: '2~5회/분',
            description: '고개 끄덕임 보통',
          },
          {
            level: '많음',
            range: '≥ 6회/분',
            description: '고개 끄덕임 많음',
          },
        ];
      case 'shoulderTilt':
        return [
          {
            level: '적정',
            range: '≥ 90%',
            description: '어깨 기울기 적정',
          },
          {
            level: '주의',
            range: '75~89%',
            description: '어깨 기울기 개선 권장',
          },
          {
            level: '체크필요',
            range: '< 75%',
            description: '어깨 기울기 개선 필요',
          },
        ];
      case 'bodyShake':
        return [
          {
            level: '안정',
            range: '≤ 1회/분',
            description: '안정적인 자세 유지',
          },
          { level: '보통', range: '2~3회/분', description: '몸 흔들림 보통' },
          {
            level: '체크필요',
            range: '≥ 4회/분',
            description: '몸 흔들림 개선 필요',
          },
        ];
      default:
        return [];
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
        };
      }
    }

    return { description: '' };
  };

  const itemDefinitions = [
    {
      label: '카메라 응시율',
      key: 'eyeContactRate',
      unit: '%',
      icon: '📷',
      recommendedText: '85% 이상 권장',
      category: '시선처리',
    },
    {
      label: '발화 속도',
      key: 'speechRate',
      unit: 'SPM',
      icon: '🎙️',
      recommendedText: '250-350 SPM 권장',
      category: '발화',
    },
    {
      label: '음성 크기',
      key: 'voiceVolume',
      unit: 'dB',
      icon: '🔊',
      recommendedText: '-35~-20dB 권장',
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
      label: '필러어 사용',
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
      recommendedText: '11% 이상 권장',
      category: '표정',
    },
    {
      label: '눈 깜빡임',
      key: 'blinkCount',
      unit: '회/분',
      icon: '👁️',
      recommendedText: '분당 40~60회 권장',
      category: '습관',
    },
    {
      label: '고개 끄덕임',
      key: 'nodCount',
      unit: '회/분',
      icon: '👤',
      recommendedText: '분당 1회 이하 권장',
      category: '습관',
    },
    {
      label: '어깨 기울기',
      key: 'shoulderTilt',
      unit: '%',
      icon: '💪',
      recommendedText: '90-100% 권장',
      category: '자세',
    },
    {
      label: '몸 흔들림',
      key: 'bodyShake',
      unit: '회/분',
      icon: '🔄',
      recommendedText: '분당 1회 이하 권장',
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
    };
  });

  const clampPercent = (value) => Math.min(Math.max(value, 0), 100);

  const getMetricScale = (key) => {
    switch (key) {
      case 'speechRate':
        return { min: 0, max: 500, goodMin: 250, goodMax: 350 };
      case 'voiceVolume':
        return { min: -60, max: 0, goodMin: -35, goodMax: -20 };
      case 'silenceCount':
      case 'fillerCount':
        return { min: 0, max: 10, goodMin: 0, goodMax: 3 };
      case 'blinkCount':
        return { min: 0, max: 80, goodMin: 40, goodMax: 60 };
      case 'bodyShake':
        return { min: 0, max: 8, goodMin: 0, goodMax: 1 };
      case 'eyeContactRate':
        return { min: 0, max: 100, goodMin: 85, goodMax: 100 };
      case 'smileRate':
        return { min: 0, max: 100, goodMin: 11, goodMax: 100 };
      case 'nodCount':
        return { min: 0, max: 8, goodMin: 0, goodMax: 1 };
      case 'shoulderTilt':
        return { min: 0, max: 100, goodMin: 90, goodMax: 100 };
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
                    <div className="category-title-row">
                      <h4 className="category-title">{category}</h4>

                      {category === '발화' && (
                        <button
                          type="button"
                          className="category-transcript-button"
                          onClick={() =>
                            navigate(`/report/individual/${id}/transcript`)
                          }
                        >
                          전사 보기
                        </button>
                      )}
                    </div>
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
                                    {getItemStatusLabel(item)}
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
                                <div className="detail-content-wrapper">
                                  <div className="guideline-box">
                                    <h5>📋 권장기준</h5>
                                    <div className="guideline-items">
                                      {getGuidelineForItem(item.key).map(
                                        (guideline, idx) => (
                                          <div
                                            key={idx}
                                            className={`guideline-item guideline-${guideline.level.replace(/필요/g, '').trim()}`}
                                          >
                                            <div className="guideline-header">
                                              <span className="guideline-level">
                                                {guideline.level}
                                              </span>
                                              <span className="guideline-range">
                                                {guideline.range}
                                              </span>
                                            </div>
                                            <p className="guideline-description">
                                              {guideline.description}
                                            </p>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}
