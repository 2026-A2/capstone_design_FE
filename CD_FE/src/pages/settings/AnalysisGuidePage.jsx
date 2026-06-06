import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './AnalysisGuidePage.css';

const voiceGuides = [
  {
    title: '발화 속도',
    subtitle: 'Speech Pace',
    description: '면접 답변의 전달 속도를 SPM 기준으로 분석합니다.',
    criteria: [
      'faster-whisper STT로 답변 음성을 텍스트화',
      '전체 발화 시간을 기준으로 단어당 발화 속도 계산',
      'SPM(분당 단어 수) 단위 사용',
    ],
    ranges: [
      { label: '매우 느림 <200', tone: 'red' },
      { label: '느림 200-249', tone: 'yellow' },
      { label: '적정 250-350', tone: 'green' },
      { label: '빠름 351-450', tone: 'yellow' },
      { label: '매우 빠름 >450', tone: 'red' },
    ],
    note: '너무 느리면 준비가 부족해 보일 수 있고, 너무 빠르면 답변 내용이 전달되기 어렵습니다. 핵심 문장은 또렷하게 말하고 문장 사이에 짧은 쉼을 두는 것이 좋습니다.',
  },
  {
    title: '음량',
    subtitle: 'Volume',
    description: '녹음된 답변의 평균 음량을 dB 기준으로 확인합니다.',
    criteria: [
      'librosa RMS 기반으로 프레임별 음량 추출',
      '무음 구간을 제외한 평균 dB 산출',
      '평균 dB 기준으로 발성이 적절한지 판단',
    ],
    ranges: [
      { label: '매우 작음 <-50', tone: 'red' },
      { label: '작음 -50~-35', tone: 'yellow' },
      { label: '적정 -35~-20', tone: 'green' },
      { label: '큼 -20~-10', tone: 'yellow' },
      { label: '매우 큼 ≥-10', tone: 'red' },
    ],
    note: '소리가 작으면 자신감이 부족해 보일 수 있고, 너무 크면 공격적으로 느껴질 수 있습니다. 마이크와 일정한 거리를 유지하고 문장마다 음량 편차를 줄이는 연습이 필요합니다.',
  },
  {
    title: '침묵 구간',
    subtitle: 'Silence',
    description: '답변 중 긴 침묵이 얼마나 자주 발생하는지 분석합니다.',
    criteria: [
      '무음 상태 지속 시간이 3초 이상인 구간 측정',
      '3초 미만 구간은 일반적인 호흡으로 간주',
      '시작/마무리 구간의 침묵은 별도 확인',
    ],
    ranges: [{ label: '3초 기준 분석', tone: 'blue' }],
    levels: [
      { label: '적정', value: '3회 이하', tone: 'green' },
      { label: '주의', value: '4-6회', tone: 'yellow' },
      { label: '체크 필요', value: '7회 이상', tone: 'red' },
    ],
    note: '긴 침묵이 반복되면 답변 구조를 아직 정리하지 못한 인상을 줄 수 있습니다. 답변 전에 핵심 키워드를 먼저 잡고, 잠시 멈출 때는 자연스럽게 이어갈 문장을 준비해 보세요.',
  },
  {
    title: '필러어',
    subtitle: 'Filler Words',
    description: '불필요한 추임새나 반복 표현의 빈도를 확인합니다.',
    criteria: [
      'STT 결과에서 “음”, “어”, “그” 등 filler 표현 탐지',
      '답변 내 filler word 횟수 계산',
      '과도한 필러어는 사고 흐름이 불안정해 보일 수 있음',
    ],
    ranges: [{ label: '답변 내 사용 횟수', tone: 'blue' }],
    levels: [
      { label: '적정', value: '3회 이하', tone: 'green' },
      { label: '주의', value: '4-6회', tone: 'yellow' },
      { label: '체크 필요', value: '7회 이상', tone: 'red' },
    ],
    note: '필러어는 자연스러운 사고 과정에서 나올 수 있지만 반복되면 신뢰감을 낮출 수 있습니다. 생각을 정리할 때는 말을 채우기보다 짧게 멈추고 다음 문장을 이어가는 편이 더 좋습니다.',
  },
  {
    title: '전사 스크립트',
    subtitle: 'Transcript',
    description: '답변 음성을 텍스트로 변환해 내용 검토에 활용합니다.',
    criteria: [
      'faster-whisper large-v3-turbo 모델로 답변의 STT 수행',
      '전사 결과를 문장 단위로 제공',
      '말실수나 반복 표현, 문장 흐름을 검토',
    ],
    ranges: [],
    note: '전사 스크립트는 “내가 실제로 어떤 내용을 말했는지”를 복기하기 위한 보조 자료입니다. 핵심 근거가 빠졌는지, 같은 표현이 반복되는지, 결론이 명확한지 확인해 보세요.',
  },
];

const behaviorGuides = [
  {
    title: '카메라 응시율',
    subtitle: 'Camera Eye Contact',
    description: '면접 중 카메라를 응시한 시간의 비율을 분석합니다.',
    levels: [
      { label: '적정', value: '85% 이상', tone: 'green' },
      { label: '주의', value: '65-84%', tone: 'yellow' },
      { label: '확인 필요', value: '65% 미만', tone: 'red' },
    ],
    note: '응시율이 낮으면 자신감이 부족하거나 집중하지 않는 인상을 줄 수 있습니다. 화면보다 카메라를 의식하며 답변하는 연습이 필요합니다.',
  },
  {
    title: '눈 깜빡임',
    subtitle: 'Blink Rate',
    description: '분당 눈 깜빡임 횟수를 기반으로 긴장도를 추정합니다.',
    levels: [
      { label: '적정', value: '8-21회/분', tone: 'green' },
      { label: '주의', value: '22-35회/분', tone: 'yellow' },
      { label: '확인 필요', value: '8회 미만 또는 36회 초과', tone: 'red' },
    ],
    note: '깜빡임이 지나치게 많거나 적으면 긴장, 피로, 시선 불안정이 드러날 수 있습니다. 답변 전 호흡을 정리하고 시선을 안정적으로 유지해 보세요.',
  },
  {
    title: '몸 흔들림',
    subtitle: 'Body Movement',
    description: '상체 움직임을 통해 자세 안정성을 확인합니다.',
    levels: [
      { label: '적정', value: '안정 상태', tone: 'green' },
      { label: '주의', value: '짧고 작은 움직임', tone: 'yellow' },
      { label: '확인 필요', value: '반복적 큰 흔들림', tone: 'red' },
    ],
    note: '몸의 흔들림이 반복되면 산만하거나 불안정해 보일 수 있습니다. 허리를 세우고 어깨의 힘을 뺀 상태로 중심을 고정하는 연습이 좋습니다.',
  },
  {
    title: '어깨 안정성',
    subtitle: 'Shoulder Stability',
    description: '어깨 기울기와 흔들림을 통해 자세 균형을 분석합니다.',
    levels: [
      { label: '적정', value: '90% 이상', tone: 'green' },
      { label: '주의', value: '75-89%', tone: 'yellow' },
      { label: '확인 필요', value: '75% 미만', tone: 'red' },
    ],
    note: '어깨가 한쪽으로 기울거나 자주 움직이면 자세가 흐트러져 보입니다. 카메라 중앙에 앉고 양어깨가 수평이 되도록 확인해 보세요.',
  },
  {
    title: '고개 끄덕임',
    subtitle: 'Head Nod',
    description: '고개를 끄덕이는 빈도를 통해 반응의 자연스러움을 확인합니다.',
    levels: [
      { label: '적정', value: '분당 1회 이하', tone: 'green' },
      { label: '주의', value: '분당 2-5회', tone: 'blue' },
      { label: '확인 필요', value: '분당 6회 이상', tone: 'red' },
    ],
    note: '적절한 끄덕임은 경청과 공감을 보여주지만 과하면 습관적 반응처럼 보일 수 있습니다. 답변 중에는 핵심 문장에 맞춰 자연스럽게 반응하세요.',
  },
  {
    title: '미소율',
    subtitle: 'Smile Rate',
    description: '면접 중 자연스러운 미소가 유지된 비율을 분석합니다.',
    levels: [
      { label: '적정', value: '10-20%', tone: 'green' },
      { label: '주의', value: '5-9%', tone: 'yellow' },
      { label: '확인 필요', value: '5% 미만 또는 20% 이상', tone: 'red' },
    ],
    note: '미소가 너무 적으면 딱딱해 보이고, 너무 많으면 답변의 진정성이 약해질 수 있습니다. 인사와 마무리, 긍정적인 경험을 말할 때 자연스럽게 미소를 유지해 보세요.',
  },
];

const voiceSummary = [
  ['평균 SPM', '전체 음절 수 ÷ 전체 발화 시간'],
  ['평균 dB', '질문별 평균 dB의 산술 평균'],
  ['최대 / 최소 dB', '전체 질문 중 최대값 / 최소값'],
  ['dB 표준편차', '질문별 표준편차의 평균'],
  ['필러어 총수', '전체 답변에서 감지된 필러어 횟수 합산'],
  ['침묵 구간', '전체 답변의 침묵 구간 횟수 합산 및 평균 지속 시간'],
];

const behaviorSummary = [
  ['카메라 응시율', '각 질문에서 화면 정면을 바라본 비율의 평균'],
  ['몸 흔들림', '모든 질문에서 흔들림 횟수를 합산 ÷ 전체 영상 시간(분)'],
  ['어깨 안정성', '각 질문에서 어깨가 수평을 유지한 비율의 평균'],
  ['눈 깜빡임', '모든 질문에서 깜빡임 횟수를 합산 ÷ 전체 영상 시간(분)'],
  [
    '고개 끄덕임',
    '모든 질문에서 고개를 끄덕인 횟수를 합산 ÷ 전체 영상 시간(분)',
  ],
  ['미소율', '각 질문에서 미소가 감지된 비율의 평균'],
];

function GuideCard({ guide, index, type }) {
  return (
    <article className="analysis-card">
      <div className="analysis-card-heading">
        <span className="analysis-card-number">{index + 1}</span>
        <div>
          <h3>{guide.title}</h3>
          <p>{guide.subtitle}</p>
        </div>
      </div>

      {type === 'voice' ? (
        <>
          <p className="analysis-card-description">{guide.description}</p>
          <ul className="analysis-bullet-list">
            {guide.criteria.map((criterion) => (
              <li key={criterion}>{criterion}</li>
            ))}
          </ul>
          {guide.ranges.length > 0 && (
            <div className="analysis-chip-row">
              {guide.ranges.map((range) => (
                <span
                  key={range.label}
                  className={`analysis-chip ${range.tone}`}
                >
                  {range.label}
                </span>
              ))}
            </div>
          )}
          {guide.levels && (
            <div className="analysis-level-list voice">
              {guide.levels.map((level) => (
                <div
                  key={`${level.label}-${level.value}`}
                  className="analysis-level-row"
                >
                  <span className={`analysis-dot ${level.tone}`} />
                  <strong>{level.label}</strong>
                  <span>{level.value}</span>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <p className="analysis-card-description">{guide.description}</p>
          <div className="analysis-level-list">
            {guide.levels.map((level) => (
              <div
                key={`${level.label}-${level.value}`}
                className="analysis-level-row"
              >
                <span className={`analysis-dot ${level.tone}`} />
                <strong>{level.label}</strong>
                <span>{level.value}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="analysis-note">
        <strong>{type === 'voice' ? '피드백 활용법' : '주의사항'}</strong>
        <p>{guide.note}</p>
      </div>
    </article>
  );
}

export default function AnalysisGuidePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('voice');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isVoice = activeTab === 'voice';
  const guides = isVoice ? voiceGuides : behaviorGuides;
  const summaryRows = isVoice ? voiceSummary : behaviorSummary;

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
              aria-label="자소서 관리"
              className="h-11 w-11 rounded-full bg-blue-100 transition hover:bg-blue-200"
              onClick={() => navigate('/settings/resume')}
            />
          </div>
        </div>
      </header>

      <main className="analysis-guide-shell">
        <section className="analysis-hero">
          <h1>{isVoice ? '음성 분석 기준 안내' : '행동 분석 기준 안내'}</h1>
          <p>
            {isVoice
              ? '전사 모델과 오디오 특성 분석을 기반으로 답변 속도, 음량, 침묵, 필러어를 평가합니다.'
              : '영상 프레임 분석 결과를 바탕으로 시선, 표정, 자세, 움직임의 안정성을 평가합니다.'}
          </p>
        </section>

        <div
          className="analysis-tab-panel"
          role="tablist"
          aria-label="분석 기준 유형"
        >
          <button
            type="button"
            className={isVoice ? 'active' : ''}
            onClick={() => setActiveTab('voice')}
          >
            음성 분석
            <span>{voiceGuides.length}</span>
          </button>
          <button
            type="button"
            className={!isVoice ? 'active' : ''}
            onClick={() => setActiveTab('behavior')}
          >
            행동 분석
            <span>{behaviorGuides.length}</span>
          </button>
        </div>

        <section className="analysis-section">
          <h2>{isVoice ? '5개 분석 항목' : '6개 행동 분석 항목'}</h2>
          <div className="analysis-card-grid">
            {guides.map((guide, index) => (
              <GuideCard
                key={guide.title}
                guide={guide}
                index={index}
                type={activeTab}
              />
            ))}
          </div>
        </section>

        <section className="analysis-section">
          <h2>{isVoice ? '종합 리포트 집계 방식' : '종합 리포트 집계 방식'}</h2>
          <p className="analysis-section-copy">
            {isVoice
              ? '질문별 음성 분석 결과는 면접 전체 단위로 다음과 같이 집계됩니다.'
              : '질문별 행동 분석 결과는 면접 전체 단위로 다음과 같이 집계됩니다.'}
          </p>
          <div className="analysis-summary-table">
            <div className="analysis-summary-row head">
              <span>항목</span>
              <span>집계 방식</span>
            </div>
            {summaryRows.map(([metric, method]) => (
              <div key={metric} className="analysis-summary-row">
                <strong>{metric}</strong>
                <span>{method}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
