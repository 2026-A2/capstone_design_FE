import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './AnalysisGuidePage.css';

const analysisGuides = [
  {
    category: '시선처리',
    categoryColor: '#667eea',
    items: [
      {
        title: '카메라 응시율',
        standard: '카메라 응시율 60% 이상 권장',
        description:
          '면접 중 카메라를 얼마나 안정적으로 바라보는지 분석합니다. 응시율이 낮으면 시선이 분산되어 보일 수 있습니다.',
      },
    ],
  },
  {
    category: '발화',
    categoryColor: '#f78e69',
    items: [
      {
        title: '발화 속도',
        standard: '200-260SPM(분당 200~260 단어) 권장',
        description:
          '말이 너무 빠르거나 느리지 않은지 확인합니다. 적절한 속도는 전달력을 높이는 데 도움이 됩니다.',
      },
      {
        title: '음성 크기',
        standard:
          '평균 -20~-35dB 권장, -10dB 이상은 매우 큰 목소리, -50dB 미만은 매우 작은 목소리로 볼 수 있음',
        description:
          '녹음 파일 내 최대 음량을 0dB로 둔 상대값 기준으로 분석합니다.',
      },
      {
        title: '침묵 구간',
        standard: '3회 이하 권장, 6회 초과 주의',
        description:
          '답변 중 긴 침묵(3초 이상)이 얼마나 발생했는지 분석합니다. 침묵이 많으면 답변 준비가 부족해 보일 수 있습니다.',
      },
      {
        title: '필러어',
        standard: '3회 이하 권장, 6회 초과 주의',
        description:
          '음, 어, 그 등의 불필요한 표현 사용 빈도를 분석합니다. 필러어가 많으면 답변이 불안정하게 들릴 수 있습니다.',
      },
      {
        title: '말끝흐림',
        standard: '20% 이하 안정적인 수준, 25% 이상은 주의가 필요한 상태',
        description:
          '답변 끝부분의 발음이나 음성이 흐려지는 정도를 분석합니다. 말끝이 흐리면 자신감이 부족해 보일 수 있습니다.',
      },
    ],
  },
  {
    category: '표정',
    categoryColor: '#6bc34a',
    items: [
      {
        title: '미소율',
        standard: '50%이상 권장, 시작 10초와 종료 10초 구간에서 미소 권장',
        description: '면접 중 미소가 얼마나 자연스럽게 나타나는지 분석합니다.',
      },
    ],
  },
  {
    category: '버릇',
    categoryColor: '#ab47bc',
    items: [
      {
        title: '눈 깜빡임',
        standard: '분당 15~20회 권장',
        description:
          '눈 깜빡임 빈도를 분석합니다. 지나치게 많으면 긴장한 인상을 줄 수 있습니다.',
      },

      {
        title: '고개 끄덕임',
        standard: '초기 자세 대비 턱-어깨 수직거리 80% 이상을 유지',
        description: '답변 중 고개 움직임을 분석합니다.',
      },
    ],
  },
  {
    category: '자세',
    categoryColor: '#29b6f6',
    items: [
      {
        title: '어깨 기울기',
        standard: '≥ 90% 안정, 75~89% 보통, < 75% 이탈',
        description: '어깨 라인이 평행 상태를 유지한 시간 비율입니다.',
      },
      {
        title: '몸통 흔들림',
        standard:
          '1회 이하는 안정적, 1회 초과는 주의, 3회 이상은 개선이 필요한 수준',
        description: '몸통 기울기 10° 이상 이탈 빈도입니다.',
      },
    ],
  },
];

export default function AnalysisGuidePage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="analysis-guide-page">
      <div className="analysis-guide-container">
        <div className="analysis-guide-header">
          <button
            className="analysis-guide-back-button"
            onClick={() => navigate('/main')}
          >
            ←
          </button>

          <div>
            <h1>분석 기준 안내</h1>
            <p>면접 분석에 사용되는 11가지 항목의 평가 기준입니다.</p>
          </div>
        </div>

        <div className="analysis-guide-grid">
          {analysisGuides.map((category) => (
            <div key={category.category} className="analysis-guide-section">
              <div
                className="category-header"
                style={{ borderLeftColor: category.categoryColor }}
              >
                <h3 style={{ color: category.categoryColor }}>
                  {category.category}
                </h3>
              </div>

              <div className="category-items">
                {category.items.map((item, itemIndex) => (
                  <div
                    key={item.title}
                    className="analysis-guide-card"
                    style={{
                      borderTop: `3px solid ${category.categoryColor}`,
                    }}
                  >
                    <div
                      className="analysis-guide-number"
                      style={{ background: category.categoryColor }}
                    >
                      {itemIndex + 1}
                    </div>

                    <div className="analysis-guide-content">
                      <h2>{item.title}</h2>
                      <strong style={{ color: category.categoryColor }}>
                        {item.standard}
                      </strong>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
