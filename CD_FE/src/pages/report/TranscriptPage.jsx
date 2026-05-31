import { useNavigate, useParams } from 'react-router-dom';
import './TranscriptPage.css';
import { useState } from 'react';

export default function TranscriptPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const questions = [
    {
      id: 1,
      label: 'Q1',
      text: '자기소개를 간단히 말씀해 주세요.',
    },
    {
      id: 2,
      label: 'Q2',
      text: '이전 프로젝트에서 팀원과 의견이 충돌했던 경험과, 그 상황을 어떻게 해결하셨는지 구체적으로 말씀해 주세요.',
    },
    {
      id: 3,
      label: 'Q3',
      text: '지원한 직무에서 본인의 강점이 어떻게 도움이 된다고 생각하시나요?',
    },
    {
      id: 4,
      label: 'Q4',
      text: '어려운 문제를 해결하기 위해 노력했던 경험을 말씀해 주세요.',
    },
    {
      id: 5,
      label: 'Q5',
      text: '마지막으로 하고 싶은 말을 말씀해 주세요.',
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(1);

  const currentQuestionData = questions.find(
    (question) => question.id === currentQuestion,
  );

  return (
    <div className="transcript-page">
      <div className="transcript-modal">
        <button className="transcript-close" onClick={() => navigate(-1)}>
          ×
        </button>

        <header className="transcript-header">
          <h2>
            발화 전사 <span>12회차</span>
          </h2>
          <p>프론트엔드 개발자 전사 · 5문항 · 오늘 14:32</p>
        </header>

        <div className="transcript-tabs">
          {questions.map((question) => (
            <button
              key={question.id}
              type="button"
              className={question.id === currentQuestion ? 'active' : ''}
              onClick={() => setCurrentQuestion(question.id)}
            >
              {question.label}
            </button>
          ))}
          <span className="filler-dot">필러어 감지</span>
        </div>

        <section className="question-card">
          <div className="question-badge">{currentQuestionData.label}</div>
          <div>
            <p className="question-category">
              프론트엔드 개발자 · 자기소개서 기반
            </p>
            <h3>{currentQuestionData.text}</h3>
          </div>
        </section>

        <section className="transcript-box">
          <div className="audio-row">
            <span className="audio-time">▶ 00:48 / 02:00</span>
            <button className="download-btn">↓ .txt 다운로드</button>
          </div>

          <div className="speech-content">
            <p>발화내용</p>
            <p>발화내용</p>
            <p>발화내용</p>
            <p>발화내용</p>
          </div>
        </section>

        <footer className="transcript-footer">
          <button
            type="button"
            onClick={() => setCurrentQuestion((prev) => Math.max(prev - 1, 1))}
          >
            ‹ 이전 질문 (Q{Math.max(currentQuestion - 1, 1)})
          </button>

          <button
            type="button"
            className="next-btn"
            onClick={() => setCurrentQuestion((prev) => Math.min(prev + 1, 5))}
          >
            다음 질문 (Q{Math.min(currentQuestion + 1, 5)}) →
          </button>
        </footer>
      </div>
    </div>
  );
}
