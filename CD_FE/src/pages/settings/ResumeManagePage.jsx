import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ResumeManagePage.css';

export default function ResumeManagePage() {
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleUploadResume = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/plain') {
      alert('TXT 파일만 업로드할 수 있습니다.');
      e.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('10MB 이하의 파일만 업로드할 수 있습니다.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      navigate('/settings/resume/new', {
        state: {
          uploadedFileName: file.name,
          uploadedContent: reader.result,
        },
      });
    };

    reader.readAsText(file, 'UTF-8');
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
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[74px] max-w-[1640px] items-center justify-between px-6 sm:px-10 xl:px-12">
          <div className="flex h-full items-center gap-12">
            <button
              type="button"
              className="flex items-center gap-3 text-left"
              onClick={() => navigate('/main')}
            >
              <span className="h-7 w-7 rounded-md bg-[#263f98]" />
              <span className="text-xl font-extrabold text-[#1f3d91]">
                InterviewLens
              </span>
            </button>

            <nav className="hidden h-full items-center gap-9 text-base font-bold text-slate-600 md:flex">
              <button
                type="button"
                className={`h-full px-1 transition ${
                  location.pathname === '/interview'
                    ? 'border-b-[3px] border-[#263f98] text-[#263f98]'
                    : 'hover:text-[#263f98]'
                }`}
                onClick={() => navigate('/interview')}
              >
                면접 연습
              </button>

              <button
                type="button"
                className={`h-full px-1 transition ${
                  location.pathname.startsWith('/report')
                    ? 'border-b-[3px] border-[#263f98] text-[#263f98]'
                    : 'hover:text-[#263f98]'
                }`}
                onClick={() => navigate('/report')}
              >
                결과 리포트
              </button>

              <button
                type="button"
                className={`h-full px-1 transition ${
                  location.pathname.startsWith('/settings/resume')
                    ? 'border-b-[3px] border-[#263f98] text-[#263f98]'
                    : 'hover:text-[#263f98]'
                }`}
                onClick={() => navigate('/settings/resume')}
              >
                내 자소서
              </button>

              <button
                type="button"
                className={`h-full px-1 transition ${
                  location.pathname.startsWith('/settings/analysis-guide')
                    ? 'border-b-[3px] border-[#263f98] text-[#263f98]'
                    : 'hover:text-[#263f98]'
                }`}
                onClick={() => navigate('/settings/analysis-guide')}
              >
                분석 기준
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-5">
            <button
              type="button"
              aria-label="분석 기준 안내"
              className="h-8 w-8 rounded-full bg-slate-100 transition hover:bg-slate-200"
              onClick={() => navigate('/settings/analysis-guide')}
            />
            <button
              type="button"
              aria-label="내 자소서 관리"
              className="h-11 w-11 rounded-full bg-blue-100 transition hover:bg-blue-200"
              onClick={() => navigate('/settings/resume')}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1640px] px-6 py-7 sm:px-10 xl:px-12">
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
              <div className="resume-header-buttons">
                <label className="primary-add-button upload-label">
                  + TXT 파일 업로드
                  <input
                    type="file"
                    accept=".txt"
                    hidden
                    onChange={handleUploadResume}
                  />
                </label>

                <button
                  type="button"
                  className="primary-add-button"
                  onClick={() => navigate('/settings/resume/new')}
                >
                  + 새 자소서 등록
                </button>
              </div>
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
                <label className="primary-add-button upload-label">
                  + 자소서 업로드
                  <input
                    type="file"
                    accept=".txt"
                    hidden
                    onChange={handleUploadResume}
                  />
                </label>

                <button
                  type="button"
                  className="outline-button"
                  onClick={() => navigate('/settings/resume/new')}
                >
                  직접 입력
                </button>
              </div>

              <span className="empty-guide">지원 형식 · TXT · 최대 10MB</span>
            </section>
          ) : (
            <>
              <section className="resume-summary-row">
                <div className="summary-card">
                  <span>등록 자소서</span>
                  <strong>{resumeList.length}개</strong>
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

              <div className="resume-tip-box">
                <span className="resume-tip-icon">💡</span>
                <p>
                  ‘기본 자소서’로 설정하면 면접 시작 시 자동으로 선택되어 한
                  단계가 생략돼요. 자주 쓰는 자소서를 기본으로 두세요.
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
