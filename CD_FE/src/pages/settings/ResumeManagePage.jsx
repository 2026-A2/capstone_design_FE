import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../../contexts/InterviewContext';
import './ResumeManagePage.css';

export default function ResumeManagePage() {
  const navigate = useNavigate();
  const { resumeText: contextResumeText, setResumeText } = useInterview();
  const [resume, setResume] = useState('');

  useEffect(() => {
    // 초기 로드: InterviewContext에서 값을 가져와서 로컬 state에 설정
    setResume(contextResumeText);
    window.scrollTo(0, 0);
  }, [contextResumeText]);

  const handleSave = () => {
    // 저장 버튼 클릭 시에만 InterviewContext에 저장
    setResumeText(resume);
    alert('자소서가 저장되었습니다.');
  };

  const handleDelete = () => {
    const confirmed = window.confirm('저장된 자소서를 삭제하시겠습니까?');
    if (!confirmed) return;

    setResume('');
    setResumeText('');
    alert('자소서가 삭제되었습니다.');
  };

  return (
    <div className="resume-manage-page">
      <div className="resume-manage-container">
        <button className="back-button" onClick={() => navigate('/settings')}>
          ←
        </button>

        <h1>자소서 관리</h1>
        <p className="resume-subtitle">
          면접 시 입력한 자기소개서를 확인하고 관리할 수 있습니다.
        </p>

        <div className="resume-card">
          <div className="resume-card-header">
            <div>
              <h2>저장된 자소서</h2>
              <p>자소서 기반 질문 생성에 활용됩니다.</p>
            </div>

            <span className="char-count">{resume.length}/300자</span>
          </div>

          <textarea
            className="resume-textarea"
            value={resume}
            maxLength={300}
            onChange={(e) => setResume(e.target.value)}
            placeholder="아직 저장된 자소서가 없습니다."
          />

          <div className="resume-button-row">
            <button className="delete-button" onClick={handleDelete}>
              삭제
            </button>
            <button className="save-button" onClick={handleSave}>
              저장
            </button>
          </div>
        </div>

        <button className="main-button" onClick={() => navigate('/settings')}>
          설정으로 돌아가기
        </button>
      </div>
    </div>
  );
}
