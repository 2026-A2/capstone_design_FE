import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './AnalysisGuidePage.css';

const analysisGuides = [
  {
    category: '시선처리',
    categoryColor: '#667eea',
    items: [
      {
        title: '카메라 응시율',
        standard: '적정 85% 이상, 주의 65~84%, 체크 필요 64% 이하',
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
        standard:
          '매우 느림 < 200SPM, 느림 200~249SPM, 적정 250~350SPM, 빠름 351~450SPM, 매우 빠름 > 450SPM',
        description:
          '말이 너무 빠르거나 느리지 않은지 확인합니다. 적절한 속도는 전달력을 높이는 데 도움이 됩니다.',
      },
      {
        title: '음성 크기',
        standard:
          '매우 작음 < -50dB, 작음 -50~-35dB, 적정 -35~-20dB, 큼 -20~-10dB, 매우 큼 ≥ -10dB',
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
    ],
  },
  {
    category: '표정',
    categoryColor: '#6bc34a',
    items: [
      {
        title: '미소율',
        standard: '적정 10~20% 미만, 주의 5~9%, 체크 필요 5% 미만 또는 20% 이상',
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
        standard:
          '적정 분당 8~21회, 주의 분당 22~35회, 체크 필요 분당 8회 미만 또는 36회 초과',
        description:
          '눈 깜빡임 빈도를 분석합니다. 지나치게 많으면 긴장한 인상을 줄 수 있습니다.',
      },

      {
        title: '고개 끄덕임',
        standard: '적정 분당 1회 이하, 주의 분당 2~5회, 체크 필요 분당 6회 이상',
        description: '답변 중 고개 끄덕임 빈도를 분석합니다.',
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
        title: '몸 흔들림',
        standard:
          '적정 분당 1회 이하, 주의 분당 2~4회, 체크 필요 분당 5회 이상',
        description: '몸 흔들림 빈도를 분석합니다.',
      },
    ],
  },
];

export default function AnalysisGuidePage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[74px] max-w-[1640px] items-center justify-between px-6 sm:px-10 xl:px-12">
          <div className="flex h-full items-center gap-12">
            <button
              type="button"
              className="flex items-center gap-3 text-left"
              onClick={() => navigate('/main')}
            >
              <span className="h-7 w-7 rounded-md bg-[#263f98]" />
              <span className="text-xl font-extrabold text-[#1f3d91]">
                InterviewLens
              </span>
            </button>

            <nav className="hidden h-full items-center gap-9 text-base font-bold text-slate-600 md:flex">
              <button
                type="button"
                className={`h-full px-1 transition ${location.pathname === '/interview' ? 'border-b-[3px] border-[#263f98] text-[#263f98]' : 'hover:text-[#263f98]'}`}
                onClick={() => navigate('/interview')}
              >
                면접 연습
              </button>
              <button
                type="button"
                className={`h-full px-1 transition ${location.pathname.startsWith('/report') ? 'border-b-[3px] border-[#263f98] text-[#263f98]' : 'hover:text-[#263f98]'}`}
                onClick={() => navigate('/report')}
              >
                결과 리포트
              </button>
              <button
                type="button"
                className={`h-full px-1 transition ${location.pathname.startsWith('/settings/resume') ? 'border-b-[3px] border-[#263f98] text-[#263f98]' : 'hover:text-[#263f98]'}`}
                onClick={() => navigate('/settings/resume')}
              >
                내 자소서
              </button>
              <button
                type="button"
                className={`h-full px-1 transition ${location.pathname.startsWith('/settings/analysis-guide') ? 'border-b-[3px] border-[#263f98] text-[#263f98]' : 'hover:text-[#263f98]'}`}
                onClick={() => navigate('/settings/analysis-guide')}
              >
                분석 기준
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-5">
            <button
              type="button"
              aria-label="분석 기준 안내"
              className="h-8 w-8 rounded-full bg-slate-100 transition hover:bg-slate-200"
              onClick={() => navigate('/settings/analysis-guide')}
            />
            <button
              type="button"
              aria-label="내 자소서 관리"
              className="h-11 w-11 rounded-full bg-blue-100 transition hover:bg-blue-200"
              onClick={() => navigate('/settings/resume')}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1640px] px-6 py-7 sm:px-10 xl:px-12">
        <div className="analysis-guide-page-content">
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
      </main>
    </div>
  );
}
