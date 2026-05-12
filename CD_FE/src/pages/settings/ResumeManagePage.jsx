import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResumeManagePage.css';

export default function ResumeManagePage() {
  const navigate = useNavigate();

  const [resumeList, setResumeList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    const savedList = JSON.parse(localStorage.getItem('resumeList') || '[]');

    const sortedList = [...savedList].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    setResumeList(sortedList);
    window.scrollTo(0, 0);

    if (sortedList.length > 0) {
      setSelectedId(sortedList[0].id);
      setEditContent(sortedList[0].content);
    }
  }, []);

  const selectedResume = resumeList.find((resume) => resume.id === selectedId);

  const saveToLocalStorage = (list) => {
    localStorage.setItem('resumeList', JSON.stringify(list));
  };

  const handleSelectResume = (resume) => {
    setSelectedId(resume.id);
    setEditContent(resume.content);
  };

  const handleSave = () => {
    if (!selectedId || editContent.trim().length === 0) return;

    const updatedList = resumeList.map((resume) =>
      resume.id === selectedId
        ? {
            ...resume,
            content: editContent.trim(),
            updatedAt: new Date().toISOString(),
          }
        : resume,
    );

    setResumeList(updatedList);
    saveToLocalStorage(updatedList);
    setEditContent(editContent.trim());

    alert('자소서가 수정되었습니다.');
  };

  const handleDelete = () => {
    if (!selectedId) return;

    const confirmed = window.confirm('선택한 자소서를 삭제하시겠습니까?');
    if (!confirmed) return;

    const filteredList = resumeList.filter(
      (resume) => resume.id !== selectedId,
    );

    const reorderedList = filteredList
      .slice()
      .reverse()
      .map((resume, index) => ({
        ...resume,
        session: index + 1,
        title: `${index + 1}회차 자소서`,
      }))
      .reverse();

    setResumeList(reorderedList);
    saveToLocalStorage(reorderedList);

    if (reorderedList.length > 0) {
      setSelectedId(reorderedList[0].id);
      setEditContent(reorderedList[0].content);
    } else {
      setSelectedId(null);
      setEditContent('');
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
            면접 회차별로 입력한 자기소개서를 확인하고 수정할 수 있습니다.
          </p>
        </div>

        {resumeList.length === 0 ? (
          <div className="resume-empty-card">
            <h2>저장된 자소서가 없습니다.</h2>
            <p>자소서 기반 면접을 진행하면 이곳에 회차별로 저장됩니다.</p>
            <button
              type="button"
              className="save-button"
              onClick={() => navigate('/interview/resume')}
            >
              자소서 입력하러 가기
            </button>
          </div>
        ) : (
          <div className="resume-manage-layout">
            <div className="resume-list-card">
              <div className="resume-list-header">
                <h2>저장된 자소서</h2>
                <span>{resumeList.length}개</span>
              </div>

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
                      {new Date(resume.createdAt).toLocaleDateString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="resume-card">
              <div className="resume-card-header">
                <div>
                  <h2>{selectedResume?.title}</h2>
                  <p>선택한 회차의 자소서 내용을 수정할 수 있습니다.</p>
                </div>

                <span className="char-count">{editContent.length}/300자</span>
              </div>

              <textarea
                className="resume-textarea"
                value={editContent}
                maxLength={300}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="자소서 내용을 입력해주세요."
              />

              <div className="resume-meta">
                최근 수정:{' '}
                {selectedResume?.updatedAt
                  ? new Date(selectedResume.updatedAt).toLocaleString()
                  : '-'}
              </div>

              <div className="resume-button-row">
                <button
                  type="button"
                  className="delete-button"
                  onClick={handleDelete}
                >
                  삭제
                </button>
                <button
                  type="button"
                  className="save-button"
                  onClick={handleSave}
                  disabled={editContent.trim().length === 0}
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
