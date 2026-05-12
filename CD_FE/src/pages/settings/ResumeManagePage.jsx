import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResumeManagePage.css';

export default function ResumeManagePage() {
  const navigate = useNavigate();

  const [resumeList, setResumeList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    const savedList = JSON.parse(localStorage.getItem('resumeList') || '[]');

    const sortedList = [...savedList].sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt) -
        new Date(a.updatedAt || a.createdAt),
    );

    setResumeList(sortedList);

    if (sortedList.length > 0) {
      setSelectedId(sortedList[0].id);
      setEditTitle(sortedList[0].title);
      setEditContent(sortedList[0].content);
    }

    window.scrollTo(0, 0);
  }, []);

  const selectedResume = resumeList.find((resume) => resume.id === selectedId);

  const saveToLocalStorage = (list) => {
    localStorage.setItem('resumeList', JSON.stringify(list));
  };

  const resetForm = () => {
    setSelectedId(null);
    setEditTitle('');
    setEditContent('');
  };

  const handleSelectResume = (resume) => {
    setSelectedId(resume.id);
    setEditTitle(resume.title);
    setEditContent(resume.content);
  };

  const handleSave = () => {
    if (editTitle.trim().length === 0) {
      alert('자소서 제목을 입력해주세요.');
      return;
    }

    if (editContent.trim().length === 0) {
      alert('자소서 내용을 입력해주세요.');
      return;
    }

    const now = new Date().toISOString();

    if (selectedId) {
      const updatedList = resumeList.map((resume) =>
        resume.id === selectedId
          ? {
              ...resume,
              title: editTitle.trim(),
              content: editContent.trim(),
              updatedAt: now,
            }
          : resume,
      );

      setResumeList(updatedList);
      saveToLocalStorage(updatedList);
      alert('자소서가 수정되었습니다.');
      return;
    }

    const newResume = {
      id: Date.now(),
      title: editTitle.trim(),
      content: editContent.trim(),
      createdAt: now,
      updatedAt: now,
    };

    const updatedList = [newResume, ...resumeList];

    setResumeList(updatedList);
    saveToLocalStorage(updatedList);
    setSelectedId(newResume.id);

    alert('자소서가 등록되었습니다.');
  };

  const handleDelete = () => {
    if (!selectedId) return;

    const confirmed = window.confirm('선택한 자소서를 삭제하시겠습니까?');
    if (!confirmed) return;

    const filteredList = resumeList.filter(
      (resume) => resume.id !== selectedId,
    );

    setResumeList(filteredList);
    saveToLocalStorage(filteredList);

    if (filteredList.length > 0) {
      setSelectedId(filteredList[0].id);
      setEditTitle(filteredList[0].title);
      setEditContent(filteredList[0].content);
    } else {
      resetForm();
    }

    alert('자소서가 삭제되었습니다.');
  };

  return (
    <div className="resume-manage-page">
      <div className="resume-manage-container">
        <button className="back-button" onClick={() => navigate('/main')}>
          ←
        </button>

        <div className="resume-title-area">
          <h1>자소서 관리</h1>
          <p className="resume-subtitle">
            면접에 사용할 자기소개서를 미리 등록하고 수정할 수 있습니다.
          </p>
        </div>

        <div className="resume-manage-layout">
          <div className="resume-list-card">
            <div className="resume-list-header">
              <h2>저장된 자소서</h2>
              <span>{resumeList.length}개</span>
            </div>

            <button
              type="button"
              className="new-resume-button"
              onClick={resetForm}
            >
              + 새 자소서 등록
            </button>

            {resumeList.length === 0 ? (
              <div className="resume-empty-message">
                <p>아직 등록된 자소서가 없습니다.</p>
                <p>오른쪽 입력칸에서 자소서를 등록해보세요.</p>
              </div>
            ) : (
              <div className="resume-list">
                {resumeList.map((resume) => (
                  <button
                    key={resume.id}
                    type="button"
                    className={
                      selectedId === resume.id
                        ? 'resume-list-item active'
                        : 'resume-list-item'
                    }
                    onClick={() => handleSelectResume(resume)}
                  >
                    <strong>{resume.title}</strong>

                    <p className="resume-preview">
                      {resume.content.slice(0, 32)}
                      {resume.content.length > 32 ? '...' : ''}
                    </p>

                    <span>
                      {new Date(
                        resume.updatedAt || resume.createdAt,
                      ).toLocaleDateString()}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="resume-card">
            <div className="resume-card-header">
              <div>
                <h2>{selectedId ? '자소서 수정' : '새 자소서 등록'}</h2>
                <p>자소서 제목과 내용을 입력해 저장할 수 있습니다.</p>
              </div>

              <span className="char-count">{editContent.length}/300자</span>
            </div>

            <input
              className="resume-title-input"
              value={editTitle}
              maxLength={30}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="예: 금융권 지원 자소서"
            />

            <textarea
              className="resume-textarea"
              value={editContent}
              maxLength={300}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="면접에 사용할 자기소개서 내용을 입력해주세요."
            />

            <div className="resume-meta">
              최근 수정:{' '}
              {selectedResume?.updatedAt
                ? new Date(selectedResume.updatedAt).toLocaleString()
                : selectedId
                  ? '-'
                  : '새 자소서 작성 중'}
            </div>

            <div className="resume-button-row">
              {selectedId && (
                <button
                  type="button"
                  className="delete-button"
                  onClick={handleDelete}
                >
                  삭제
                </button>
              )}

              <button
                type="button"
                className="save-button"
                onClick={handleSave}
                disabled={
                  editTitle.trim().length === 0 ||
                  editContent.trim().length === 0
                }
              >
                {selectedId ? '수정 저장' : '등록'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
