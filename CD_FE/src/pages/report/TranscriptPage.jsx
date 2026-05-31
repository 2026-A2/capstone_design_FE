import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import './TranscriptPage.css';

const getTranscriptSource = (data) =>
  data?.analysis_result?.speech?.transcript ||
  data?.speech?.transcript ||
  data?.transcript ||
  data?.transcripts ||
  {};

const toTranscriptItems = (data) => {
  const transcript = getTranscriptSource(data);
  const entries = Array.isArray(transcript)
    ? transcript.map((item, index) => [
        item?.question_order ?? item?.order ?? item?.id ?? index + 1,
        item,
      ])
    : Object.entries(transcript);

  return entries
    .map(([key, value]) => {
      const order = Number(key);
      const fallbackText =
        typeof value === 'string'
          ? value
          : value?.transcript || value?.content || value?.text || '';
      const question =
        typeof value === 'string'
          ? value
          : value?.question || value?.question_text || fallbackText;
      const answer =
        typeof value === 'string'
          ? value
          : value?.answer || value?.answer_text || fallbackText;

      return {
        id: Number.isNaN(order) ? key : order,
        label: `Q${key}`,
        question,
        answer,
      };
    })
    .filter(
      (item) =>
        item.question.trim().length > 0 || item.answer.trim().length > 0,
    )
    .sort((a, b) => Number(a.id) - Number(b.id));
};

export default function TranscriptPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [reportData, setReportData] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loadState, setLoadState] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let ignore = false;

    const loadTranscript = async () => {
      setLoadState('loading');
      setErrorMessage('');

      try {
        const response = await axiosInstance.get(`/interviews/${id}/report/`);

        if (ignore) return;

        setReportData(response.data);
        setSelectedIndex(0);

        if (response.data?.status === 'pending') {
          setLoadState('empty');
          setErrorMessage(
            response.data?.message || '분석이 아직 진행 중입니다.',
          );
          return;
        }

        setLoadState('success');
      } catch (error) {
        console.error('[transcript:failure]', {
          id,
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });

        if (!ignore) {
          setLoadState('error');
          setErrorMessage('전사 내용을 불러오지 못했습니다.');
        }
      }
    };

    loadTranscript();

    return () => {
      ignore = true;
    };
  }, [id]);

  const transcriptItems = useMemo(
    () => toTranscriptItems(reportData),
    [reportData],
  );
  const currentItem = transcriptItems[selectedIndex];
  const reportTitle =
    reportData?.title ||
    `${reportData?.interview_id ?? id}회차 결과 리포트`;

  if (loadState === 'loading') {
    return (
      <div className="transcript-page">
        <div className="transcript-modal transcript-state">
          <p>전사 내용을 불러오는 중입니다.</p>
        </div>
      </div>
    );
  }

  if (loadState === 'error' || transcriptItems.length === 0) {
    return (
      <div className="transcript-page">
        <div className="transcript-modal transcript-state">
          <button
            type="button"
            className="transcript-close"
            onClick={() => navigate(-1)}
          >
            ×
          </button>
          <p>{errorMessage || '전사 내용이 없습니다.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transcript-page">
      <div className="transcript-modal">
        <button
          type="button"
          className="transcript-close"
          onClick={() => navigate(-1)}
        >
          ×
        </button>

        <header className="transcript-header">
          <h2>
            발화 전사 <span>{transcriptItems.length}문항</span>
          </h2>
          <p>{reportTitle}</p>
        </header>

        <div className="transcript-tabs">
          {transcriptItems.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={index === selectedIndex ? 'active' : ''}
              onClick={() => setSelectedIndex(index)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <section className="question-card">
          <div className="question-badge">{currentItem.label}</div>
          <div>
            <p className="question-category">면접 질문</p>
            <h3>{currentItem.question}</h3>
          </div>
        </section>

        <section className="transcript-box">
          <p className="transcript-box-label">전사 내용</p>
          <div className="speech-content">
            <p>{currentItem.answer || '전사 내용이 없습니다.'}</p>
          </div>
        </section>

        <footer className="transcript-footer">
          <button
            type="button"
            disabled={selectedIndex <= 0}
            onClick={() => setSelectedIndex((prev) => Math.max(prev - 1, 0))}
          >
            ‹ 이전 질문 ({transcriptItems[Math.max(selectedIndex - 1, 0)]?.label})
          </button>

          <button
            type="button"
            className="next-btn"
            disabled={selectedIndex >= transcriptItems.length - 1}
            onClick={() =>
              setSelectedIndex((prev) =>
                Math.min(prev + 1, transcriptItems.length - 1),
              )
            }
          >
            다음 질문 (
            {
              transcriptItems[
                Math.min(selectedIndex + 1, transcriptItems.length - 1)
              ]?.label
            }
            ) →
          </button>
        </footer>
      </div>
    </div>
  );
}
