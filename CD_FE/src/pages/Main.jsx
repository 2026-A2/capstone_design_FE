import { useNavigate } from 'react-router-dom';

function Main() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-[#efefef]">
      <h1 className="text-3xl font-bold">웹캠으로 면접 때 버릇을 알아보자</h1>

      <button
        type="button"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        onClick={() => navigate('/interview')}
      >
        면접 시작
      </button>

      <button
        type="button"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        onClick={() => navigate('/report')}
      >
        누적 레포트 보기
      </button>

      {/* 아래 서브 메뉴 */}
      <div className="flex gap-3 mt-3">
        <button
          type="button"
          className="bg-white text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition"
          onClick={() => navigate('/settings/analysis-guide')}
        >
          분석 기준 안내
        </button>

        <button
          type="button"
          className="bg-white text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition"
          onClick={() => navigate('/settings/resume')}
        >
          자소서 관리
        </button>
      </div>
    </div>
  );
}

export default Main;
