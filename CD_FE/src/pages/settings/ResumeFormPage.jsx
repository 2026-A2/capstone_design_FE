import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useInterview } from '../../contexts/InterviewContext.jsx';
import './ResumeFormPage.css';

export default function ResumeFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { savedResumes, setSavedResumes } = useInterview();

  const isEditMode = Boolean(id);
  const uploadedFileName = location.state?.uploadedFileName;
  const uploadedContent = location.state?.uploadedContent;
  const targetResume = savedResumes.find(
    (resume) => String(resume.id) === String(id),
  );

  const [title, setTitle] = useState(() => {
    if (isEditMode) return targetResume?.title || '';
    if (uploadedFileName) return uploadedFileName.replace(/\.txt$/i, '');
    return '';
  });
  const [content, setContent] = useState(() => {
    if (isEditMode) return targetResume?.content || '';
    if (uploadedContent) return String(uploadedContent).slice(0, 300);
    return '';
  });

  const handleSave = () => {
    if (title.trim().length === 0) {
      alert('자소서 제목을 입력해주세요.');
      return;
    }

    if (content.trim().length === 0) {
      alert('자소서 내용을 입력해주세요.');
      return;
    }

    const now = new Date().toISOString();

    if (isEditMode) {
      setSavedResumes((prev) =>
        prev.map((resume) =>
          String(resume.id) === String(id)
            ? {
                ...resume,
                title: title.trim(),
                content: content.trim(),
                updatedAt: now,
              }
            : resume,
        ),
      );

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
      isDefault: savedResumes.length === 0,
    };

    setSavedResumes((prev) => [newResume, ...prev]);

    alert('자소서가 등록되었습니다.');
    navigate('/settings/resume');
  };

  if (isEditMode && !targetResume) {
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
            <h1>자소서를 찾을 수 없습니다</h1>
            <p>목록으로 돌아가 다시 선택해주세요.</p>
          </div>
        </div>
      </div>
    );
  }

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
