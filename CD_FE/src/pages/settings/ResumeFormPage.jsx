import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ResumeFormPage.css';

export default function ResumeFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!isEditMode) return;

    const savedList = JSON.parse(localStorage.getItem('resumeList') || '[]');
    const targetResume = savedList.find(
      (resume) => String(resume.id) === String(id),
    );

    if (!targetResume) {
      alert('수정할 자소서를 찾을 수 없습니다.');
      navigate('/settings/resume');
      return;
    }

    setTitle(targetResume.title || '');
    setContent(targetResume.content || '');
  }, [id, isEditMode, navigate]);

  const handleSave = () => {
    if (title.trim().length === 0) {
      alert('자소서 제목을 입력해주세요.');
      return;
    }

    if (content.trim().length === 0) {
      alert('자소서 내용을 입력해주세요.');
      return;
    }

    const savedList = JSON.parse(localStorage.getItem('resumeList') || '[]');
    const now = new Date().toISOString();

    if (isEditMode) {
      const updatedList = savedList.map((resume) =>
        String(resume.id) === String(id)
          ? {
              ...resume,
              title: title.trim(),
              content: content.trim(),
              updatedAt: now,
            }
          : resume,
      );

      localStorage.setItem('resumeList', JSON.stringify(updatedList));
      alert('자소서가 수정되었습니다.');
      navigate('/settings/resume');
      return;
    }

    const newResume = {
      id: crypto.randomUUID(),
      title: title.trim(),
      content: content.trim(),
      createdAt: now,
      updatedAt: now,
      isDefault: savedList.length === 0,
    };

    localStorage.setItem(
      'resumeList',
      JSON.stringify([newResume, ...savedList]),
    );

    alert('자소서가 등록되었습니다.');
    navigate('/settings/resume');
  };

  return (
    <div className="resume-form-page">
      <div className="resume-form-container">
        <button
          type="button"
          className="resume-form-back-button"
          onClick={() => navigate('/settings/resume')}
        >
          ←
        </button>

        <div className="resume-form-header">
          <h1>{isEditMode ? '자소서 수정' : '새 자소서 등록'}</h1>
          <p>면접 질문 생성에 사용할 자기소개서 제목과 내용을 입력해주세요.</p>
        </div>

        <div className="resume-form-card">
          <label className="resume-form-label">
            자소서 제목
            <input
              type="text"
              value={title}
              maxLength={30}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 프론트엔드 개발자 자소서"
            />
          </label>

          <label className="resume-form-label">
            자소서 내용
            <textarea
              value={content}
              maxLength={300}
              onChange={(e) => setContent(e.target.value)}
              placeholder="면접에 사용할 자기소개서 내용을 입력해주세요."
            />
          </label>

          <div className="resume-form-count">{content.length}/300자</div>

          <div className="resume-form-button-row">
            <button
              type="button"
              className="resume-form-cancel-button"
              onClick={() => navigate('/settings/resume')}
            >
              취소
            </button>

            <button
              type="button"
              className="resume-form-save-button"
              onClick={handleSave}
              disabled={
                title.trim().length === 0 || content.trim().length === 0
              }
            >
              {isEditMode ? '수정 저장' : '등록'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
