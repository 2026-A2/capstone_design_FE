export default function ReportMainPage() {
  return (
    <div className="min-h-screen bg-[#efefef] flex items-start justify-center p-4">
      <div className="w-full max-w-[420px] bg-[#e9e9e9] rounded-sm p-4 shadow-sm">
        <h1 className="text-[22px] font-semibold text-[#bdbdbd] mb-4">
          누적 레포트(메인)
        </h1>

        <section className="bg-[#f3f3f3] p-8">
          <div className="bg-[#d9d9d9] min-h-[230px] flex flex-col items-center justify-center gap-9">
            <button
              type="button"
              className="w-[190px] h-[28px] bg-[#a9a9a9] text-[#222] text-sm font-medium hover:brightness-95 transition"
            >
              개별 레포트 보기
            </button>

            <button
              type="button"
              className="w-[190px] h-[28px] bg-[#a9a9a9] text-[#222] text-sm font-medium hover:brightness-95 transition"
            >
              전체 분석 보기
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
