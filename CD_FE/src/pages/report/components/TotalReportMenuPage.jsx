import { useNavigate } from 'react-router-dom';
import './TotalReportMenuPage.css';

export default function TotalReportMenuPage() {
  const navigate = useNavigate();

  const analysisItems = [
    { title: '시선처리', path: '/report/total/eye-contact' },
    { title: '발화속도', path: '/report/total/speech-rate' },
    { title: '음성크기', path: '/report/total/voice-volume' },
    { title: '침묵구간', path: '/report/total/silence' },
    { title: '필러어', path: '/report/total/filler' },
    { title: '미소율', path: '/report/total/smile-rate' },
    { title: '눈 깜빡임', path: '/report/total/blink' },
    { title: '말끝흐림', path: '/report/total/ending-blur' },
    { title: '고개끄떡임', path: '/report/total/nod' },
    { title: '어깨기울기', path: '/report/total/shoulder-tilt' },
    { title: '몸통흔들림', path: '/report/total/body-shake' },
  ];

  return (
    <div className="total-menu-page">
      <div className="total-menu-container">
        <button className="total-menu-back" onClick={() => navigate('/report')}>
          ← 이전
        </button>

        <h1>전체 분석 보기</h1>
        <p className="total-menu-desc">
          누적 면접 데이터를 바탕으로 아래 순서대로 분석 결과를 확인할 수
          있습니다.
        </p>

        <div className="total-menu-grid">
          {analysisItems.map((item, index) => (
            <div
              key={item.title}
              className="total-menu-card"
              onClick={() => navigate(item.path)}
            >
              <div className="total-menu-number">{index + 1}</div>
              <div className="total-menu-title">{item.title}</div>
            </div>
          ))}
        </div>

        <button
          className="total-menu-start"
          onClick={() => navigate(analysisItems[0].path)}
        >
          처음부터 분석 보기
        </button>
      </div>
    </div>
  );
}
