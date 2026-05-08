import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useState } from 'react';
import './IndividualReportFullPage.css';
import { individualReports } from '../../mockdata/report/individualMock';
import { individualReportsDetail } from '../../mockdata/report/individualmockdetail';

export default function IndividualReportFullPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [expandedItems, setExpandedItems] = useState({});

  const report = location.state ||
    individualReports.find((item) => String(item.id) === id) || {
      title: '리포트 정보 없음',
      detail: {},
    };

  // individualReportsDetail에서 상세 정보를 추출하는 함수
  const getDetailFromMockData = (label) => {
    const detailReport = individualReportsDetail.find(
      (r) => String(r.id) === String(report.id),
    );
    if (!detailReport) return { description: '', detail: '' };

    for (const category of detailReport.categories) {
      const item = category.items.find((i) => i.label === label);
      if (item) {
        return {
          description: item.description,
          detail: item.detail,
        };
      }
    }
    return { description: '', detail: '' };
  };

  // 권장값과 함께 분석 항목 정의
  const itemDefinitions = [
    {
      label: '카메라 응시율',
      key: 'eyeContactRate',
      unit: '%',
      icon: '📷',
      recommendedText: '60% 이상 권장',
    },
    {
      label: '발화 속도',
      key: 'speechRate',
      unit: 'SPM',
      icon: '🎙️',
      recommendedText: '200-260 SPM 권장',
    },
    {
      label: '음성 크기',
      key: 'voiceVolume',
      unit: 'dB',
      icon: '🔊',
      recommendedText: '50-70 dB 권장',
    },
    {
      label: '침묵 구간',
      key: 'silenceCount',
      unit: '회',
      icon: '⏸️',
      recommendedText: '3회 이하 권장',
    },
    {
      label: '필러 사용',
      key: 'fillerCount',
      unit: '회',
      icon: '💬',
      recommendedText: '3회 이하 권장',
    },
    {
      label: '미소율',
      key: 'smileRate',
      unit: '%',
      icon: '😊',
      recommendedText: '50% 이상 권장',
    },
    {
      label: '눈 깜빡임',
      key: 'blinkCount',
      unit: '회/분',
      icon: '👁️',
      recommendedText: '분당 15-20회 권장',
    },
    {
      label: '문장 끝 흐릿함',
      key: 'endingBlurCount',
      unit: '%',
      icon: '📉',
      recommendedText: '0-25% 권장',
    },
    {
      label: '고개 끄덕임',
      key: 'nodCount',
      unit: '%',
      icon: '👤',
      recommendedText: '80-100% 권장',
    },
    {
      label: '어깨 기울기',
      key: 'shoulderTilt',
      unit: '%',
      icon: '💪',
      recommendedText: '80-100% 권장',
    },
    {
      label: '몸 흔들림',
      key: 'bodyShake',
      unit: '회',
      icon: '🔄',
      recommendedText: '1회 이하 권장',
    },
  ];

  // 각 항목에 대해 detail 값과 상세정보를 합쳐서 analysisItems 생성
  const analysisItems = itemDefinitions.map((def) => {
    const detailInfo = getDetailFromMockData(def.label);
    return {
      ...def,
      value: report.detail?.[def.key],
      description: detailInfo.description,
      detailContent: detailInfo.detail,
    };
  });

  const toggleItemExpand = (itemIndex) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemIndex]: !prev[itemIndex],
    }));
  };

  return (
    <div className="full-report-page">
      <div className="full-report-container">
        {/* Header */}
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

        {/* Main Content */}
        <div className="full-report-main">
          {/* Header Section */}
          <div className="score-header-section">
            <div className="score-info">
              <span className="score-label">Interview Report</span>
              <h2>{report.title}</h2>
            </div>
          </div>

          {/* Analysis Items */}
          <div className="analysis-container">
            <h3 className="analysis-title">분석 결과 요약</h3>
            <div className="analysis-items">
              {analysisItems.map((item, itemIndex) => {
                const isExpanded = expandedItems[itemIndex];
                return (
                  <div key={itemIndex} className="analysis-card">
                    {/* Card Header */}
                    <div
                      className="analysis-header"
                      onClick={() => toggleItemExpand(itemIndex)}
                    >
                      <div className="analysis-left">
                        <span className="analysis-icon">{item.icon}</span>
                        <div className="analysis-info">
                          <h4>{item.label}</h4>
                          <p>{item.description}</p>
                        </div>
                      </div>

                      <div className="analysis-right">
                        <div className="value-display">
                          <span className="value-number">
                            {item.value !== undefined ? item.value : '-'}
                          </span>
                          <span className="value-unit">{item.unit}</span>
                        </div>
                        <button className="expand-btn">
                          {isExpanded ? '▼' : '▶'}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Content */}
                    {isExpanded && (
                      <div className="analysis-detail">
                        <div className="detail-section">
                          <h5>권장 기준</h5>
                          <p>{item.recommendedText}</p>
                        </div>
                        <div className="detail-section">
                          <h5>상세 분석</h5>
                          <p>
                            {item.detailContent || '상세 분석 정보가 없습니다.'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="full-report-actions">
            <button
              className="action-btn back-btn"
              onClick={() => navigate('/report/individual')}
            >
              뒤로가기
            </button>
            <button
              className="action-btn download-btn"
              onClick={() =>
                alert('리포트 다운로드 기능은 추후 구현 예정입니다.')
              }
            >
              리포트 다운로드
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
