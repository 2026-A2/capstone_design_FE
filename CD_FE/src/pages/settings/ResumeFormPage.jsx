import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { createResume, getResume, updateResume } from '../../api/resumeApi';
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
  const [detailState, setDetailState] = useState(
    isEditMode && !targetResume ? 'loading' : 'success',
  );
  const [detailError, setDetailError] = useState('');
  const [saveState, setSaveState] = useState('idle');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (!isEditMode) {
      return undefined;
    }

    if (targetResume) {
      return undefined;
    }

    let ignore = false;

    const loadResume = async () => {
      setDetailState('loading');
      setDetailError('');

      try {
        const resume = await getResume(id);
        if (!ignore) {
          setSavedResumes((prev) => {
            const exists = prev.some(
              (item) => String(item.id) === String(resume.id),
            );

            if (exists) {
              return prev.map((item) =>
                String(item.id) === String(resume.id) ? resume : item,
              );
            }

            return [resume, ...prev];
          });
          setTitle(resume.title || '');
          setContent(resume.content || '');
          setDetailState('success');
        }
      } catch (error) {
        console.error('[resume detail:failure]', {
          id,
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        if (!ignore) {
          setDetailState('error');
          setDetailError('수정할 자소서를 불러오지 못했습니다.');
        }
      }
    };

    loadResume();

    return () => {
      ignore = true;
    };
  }, [id, isEditMode, setSavedResumes, targetResume]);

  const handleSave = async () => {
    if (saveState === 'loading') {
      return;
    }

    if (title.trim().length === 0) {
      alert('자소서 제목을 입력해주세요.');
      return;
    }

    if (content.trim().length === 0) {
      alert('자소서 내용을 입력해주세요.');
      return;
    }

    const now = new Date().toISOString();
    setSaveState('loading');
    setSaveError('');

    if (isEditMode) {
      try {
        const updatedResume = await updateResume({
          resumeId: id,
          title: title.trim(),
          content: content.trim(),
        });

        setSavedResumes((prev) =>
          prev.map((resume) =>
            String(resume.id) === String(id)
              ? {
                  ...resume,
                  ...updatedResume,
                  updatedAt: updatedResume.updatedAt ?? now,
                }
              : resume,
          ),
        );

        alert('자소서가 수정되었습니다.');
        navigate('/settings/resume');
      } catch (error) {
        console.error('[resume update:failure]', {
          id,
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        setSaveState('error');
        setSaveError('자소서 수정에 실패했습니다. 서버 연결 상태를 확인해주세요.');
      }
      return;
    }

    try {
      const createdResume = await createResume({
        title: title.trim(),
        content: content.trim(),
      });

      console.info('[resume create:success]', createdResume);

      const newResume = {
        ...createdResume,
        id: createdResume.id ?? createdResume.resume_id ?? crypto.randomUUID(),
        title: createdResume.title ?? title.trim(),
        content: createdResume.content ?? content.trim(),
        createdAt: createdResume.createdAt ?? createdResume.created_at ?? now,
        updatedAt: createdResume.updatedAt ?? createdResume.updated_at ?? now,
        isDefault: savedResumes.length === 0,
      };

      setSavedResumes((prev) => [newResume, ...prev]);

      alert('자소서가 등록되었습니다.');
      navigate('/settings/resume');
    } catch (error) {
      console.error('[resume create:failure]', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      setSaveState('error');
      setSaveError('자소서 등록에 실패했습니다. 서버 연결 상태를 확인해주세요.');
    }
  };

  if (isEditMode && detailState === 'loading') {
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
            <h1>자소서를 불러오는 중입니다</h1>
            <p>잠시만 기다려주세요.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isEditMode && detailState === 'error') {
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
            <p>{detailError || '목록으로 돌아가 다시 선택해주세요.'}</p>
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
          {saveError && (
            <p className="mb-4 text-sm font-semibold text-red-600">
              {saveError}
            </p>
          )}

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
                saveState === 'loading' ||
                title.trim().length === 0 ||
                content.trim().length === 0
              }
            >
              {saveState === 'loading'
                ? '저장 중...'
                : isEditMode
                  ? '수정 저장'
                  : '등록'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
