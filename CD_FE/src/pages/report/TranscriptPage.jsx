import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import './TranscriptPage.css';
import { getIndividualReportDetail } from '../../api/reportApi';

export default function TranscriptPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [report, setReport] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(1);

  useEffect(() => {
    const fetchTranscript = async () => {
      const data = await getIndividualReportDetail(id);
      setReport(data);
    };

    fetchTranscript();
  }, [id]);

  const questions = useMemo(() => {
    const transcript = report?.transcript || {};

    return Object.entries(transcript).map(([key, value]) => ({
      id: Number(key),
      label: `Q${key}`,
      transcript: value,
    }));
  }, [report]);

  const currentQuestionData =
    questions.find((question) => question.id === currentQuestion) ||
    questions[0];

  const currentIndex = questions.findIndex(
    (question) => question.id === currentQuestionData?.id,
  );

  if (!report) {
    return (
      <div className="transcript-page">
        <div className="transcript-modal">
          <p>전사 내용을 불러오는 중입니다.</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="transcript-page">
        <div className="transcript-modal">
          <button className="transcript-close" onClick={() => navigate(-1)}>
            ×
          </button>
          <p>전사 내용이 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transcript-page">
      <div className="transcript-modal">
        <button className="transcript-close" onClick={() => navigate(-1)}>
          ×
        </button>

        <header className="transcript-header">
          <h2>
            발화 전사 <span>{id}회차</span>
          </h2>
          <p>문항별 전사 내용 · {questions.length}문항</p>
        </header>

        <div className="transcript-tabs">
          {questions.map((question) => (
            <button
              key={question.id}
              type="button"
              className={question.id === currentQuestionData.id ? 'active' : ''}
              onClick={() => setCurrentQuestion(question.id)}
            >
              {question.label}
            </button>
          ))}
        </div>

        <section className="question-card">
          <div className="question-badge">{currentQuestionData.label}</div>
          <div>
            <p className="question-category">문항별 발화 전사</p>
            <h3>{currentQuestionData.label} 전사 내용</h3>
          </div>
        </section>

        <section className="transcript-box">
          <div className="speech-content">
            <p>{currentQuestionData.transcript}</p>
          </div>
        </section>

        <footer className="transcript-footer">
          <button
            type="button"
            disabled={currentIndex <= 0}
            onClick={() => {
              const prevQuestion = questions[currentIndex - 1];
              if (prevQuestion) setCurrentQuestion(prevQuestion.id);
            }}
          >
            ‹ 이전 질문
          </button>

          <button
            type="button"
            className="next-btn"
            disabled={currentIndex >= questions.length - 1}
            onClick={() => {
              const nextQuestion = questions[currentIndex + 1];
              if (nextQuestion) setCurrentQuestion(nextQuestion.id);
            }}
          >
            다음 질문 →
          </button>
        </footer>
      </div>
    </div>
  );
}
