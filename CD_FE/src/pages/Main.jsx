import { useNavigate } from 'react-router-dom';

function Main() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-[#efefef]">
      <h1 className="text-3xl font-bold">웹캠으로 면접 때 버릇을 알아보자</h1>
      <button
        type="button"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => navigate('/interview')}
      >
        면접 시작
      </button>
      <button
        type="button"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => navigate('/report')}
      >
        누적 레포트 보기
      </button>
      <button
        type="button"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        설정
      </button>
    </div>
  );
}

export default Main;
