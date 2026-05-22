import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResumeManagePage.css';

export default function ResumeManagePage() {
  const navigate = useNavigate();

  const [resumeList, setResumeList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const savedList = JSON.parse(localStorage.getItem('resumeList') || '[]');

    const sortedList = [...savedList].sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt) -
        new Date(a.updatedAt || a.createdAt),
    );

    setResumeList(sortedList);
    window.scrollTo(0, 0);
  }, []);

  const saveToLocalStorage = (list) => {
    localStorage.setItem('resumeList', JSON.stringify(list));
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('ko-KR').replaceAll(' ', '');
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm('선택한 자소서를 삭제하시겠습니까?');
    if (!confirmed) return;

    const filteredList = resumeList.filter((resume) => resume.id !== id);
    setResumeList(filteredList);
    saveToLocalStorage(filteredList);

    alert('자소서가 삭제되었습니다.');
  };

  const handleSetDefault = (id) => {
    const updatedList = resumeList.map((resume) => ({
      ...resume,
      isDefault: resume.id === id,
    }));

    setResumeList(updatedList);
    saveToLocalStorage(updatedList);
  };

  return (
    <div className="resume-manage-page">
      <div className="resume-manage-container">
        <header className="resume-manage-header">
          <div>
            <h1>내 자소서</h1>
            <p>
              자소서를 등록해두면 직무에 맞는 맞춤 질문을 받을 수 있어요. 면접
              시작 전에 빠르게 선택만 하면 됩니다.
            </p>
          </div>

          {resumeList.length > 0 && (
            <button
              type="button"
              className="primary-add-button"
              onClick={() => navigate('/settings/resume/new')}
            >
              + 새 자소서 등록
            </button>
          )}
        </header>

        {resumeList.length === 0 ? (
          <section className="resume-empty-box">
            <div className="empty-file-icon">📄</div>

            <h2>아직 등록된 자소서가 없어요</h2>
            <p>
              자소서를 등록하면 직무 분석 → 맞춤 질문 → 대답 연습까지 한 번에
              받을 수 있어요.
            </p>

            <div className="empty-button-row">
              <button
                type="button"
                className="primary-add-button"
                onClick={() => navigate('/settings/resume/new')}
              >
                + 자소서 업로드
              </button>

              <button
                type="button"
                className="outline-button"
                onClick={() => navigate('/settings/resume/new')}
              >
                직접 입력
              </button>
            </div>

            <span className="empty-guide">
              지원 형식 · PDF · DOCX · TXT · 최대 10MB
            </span>
          </section>
        ) : (
          <>
            <section className="resume-summary-row">
              <div className="summary-card">
                <span>등록 자소서</span>
                <strong>{resumeList.length}개</strong>
                <p>최대 5개 등록 가능</p>
              </div>

              <div className="summary-card">
                <span>기본 자소서</span>
                <strong>
                  {resumeList.find((resume) => resume.isDefault)?.title ||
                    '프로필엔드'}
                </strong>
                <p>면접 시작 시 자동 선택</p>
              </div>
            </section>

            <section className="resume-list-section">
              <div className="resume-list-top">
                <h2>자소서 목록</h2>
                <span>{resumeList.length}개</span>
              </div>

              <div className="resume-list">
                {resumeList.map((resume) => (
                  <article
                    key={resume.id}
                    className={
                      selectedId === resume.id
                        ? 'resume-list-item active'
                        : 'resume-list-item'
                    }
                    onClick={() => setSelectedId(resume.id)}
                  >
                    <div className="resume-file-icon">📄</div>

                    <div className="resume-info">
                      <div className="resume-title-row">
                        <h3>{resume.title}</h3>

                        {resume.isDefault && (
                          <span className="default-badge">기본</span>
                        )}
                      </div>

                      <p>{resume.content?.slice(0, 45) || '내용 없음'}</p>

                      <div className="resume-meta">
                        <span>등록 {formatDate(resume.createdAt)}</span>
                        <span>마지막 {formatDate(resume.updatedAt)}</span>
                        <span>{resume.content?.length || 0}자</span>
                      </div>
                    </div>

                    <div className="resume-actions">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/settings/resume/edit/${resume.id}`);
                        }}
                      >
                        편집
                      </button>

                      <button
                        type="button"
                        className="default-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetDefault(resume.id);
                        }}
                      >
                        기본 설정
                      </button>

                      <button
                        type="button"
                        className="danger-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(resume.id);
                        }}
                      >
                        삭제
                      </button>

                      <button
                        type="button"
                        className="interview-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/interview');
                        }}
                      >
                        면접 →
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
