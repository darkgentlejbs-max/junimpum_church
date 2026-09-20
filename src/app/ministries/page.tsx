import { Users, Music, BookOpen, Heart } from "lucide-react";

export default function MinistriesPage() {
  return (
    <div className="py-12 sm:py-16 bg-[#FAF9F6] min-h-screen text-stone-800">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest block mb-2">Community & Ministries</span>
          <h1 className="text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">사역 및 기관</h1>
          <p className="text-sm text-stone-500 mt-2">각자의 은사대로 교회를 세우고 이웃을 섬기는 사역 공동체입니다</p>
        </div>
        
        <div className="space-y-6 sm:space-y-8">
          {/* Sunday School */}
          <section id="school" className="scroll-mt-24 bg-white p-7 sm:p-9 rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.03)] border border-stone-200/80 flex flex-col md:flex-row gap-6 sm:gap-8 items-start hover:border-amber-300/80 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/70 text-amber-800 flex items-center justify-center shrink-0">
              <BookOpen size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-semibold mb-2 text-stone-900">교회학교</h2>
              <p className="text-stone-600 text-sm leading-relaxed mb-5">
                다음 세대를 하나님의 말씀과 사랑으로 양육하는 부서입니다. 
                아이들의 눈높이에 맞춘 예배와 성경 공부를 통해 신앙의 뿌리를 바르게 내릴 수 있도록 돕습니다.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-stone-50/80 p-3.5 rounded-xl border border-stone-100">
                  <h4 className="text-xs font-semibold text-stone-800 mb-0.5">유·초등부</h4>
                  <p className="text-xs text-stone-500">주일 오전 11:00 / 교육관 1층</p>
                </div>
                <div className="bg-stone-50/80 p-3.5 rounded-xl border border-stone-100">
                  <h4 className="text-xs font-semibold text-stone-800 mb-0.5">중·고등부</h4>
                  <p className="text-xs text-stone-500">주일 오전 11:00 / 교육관 2층</p>
                </div>
              </div>
            </div>
          </section>

          {/* Choir */}
          <section id="worship" className="scroll-mt-24 bg-white p-7 sm:p-9 rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.03)] border border-stone-200/80 flex flex-col md:flex-row gap-6 sm:gap-8 items-start hover:border-amber-300/80 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/70 text-amber-800 flex items-center justify-center shrink-0">
              <Music size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-semibold mb-2 text-stone-900">찬양대 및 찬양팀</h2>
              <p className="text-stone-600 text-sm leading-relaxed mb-5">
                정성어린 찬양으로 하나님께 영광을 돌리고, 성도들의 예배를 돕는 은혜의 사역입니다.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-stone-50/80 p-3.5 rounded-xl border border-stone-100">
                  <h4 className="text-xs font-semibold text-stone-800 mb-0.5">호산나 찬양대</h4>
                  <p className="text-xs text-stone-500">주일 대예배 찬양 담당 (주일 오후 1:30 연습)</p>
                </div>
                <div className="bg-stone-50/80 p-3.5 rounded-xl border border-stone-100">
                  <h4 className="text-xs font-semibold text-stone-800 mb-0.5">마라나타 찬양단</h4>
                  <p className="text-xs text-stone-500">주일 및 수요예배 찬양 인도</p>
                </div>
              </div>
            </div>
          </section>

          {/* Fellowships */}
          <section id="fellowships" className="scroll-mt-24 bg-white p-7 sm:p-9 rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.03)] border border-stone-200/80 flex flex-col md:flex-row gap-6 sm:gap-8 items-start hover:border-amber-300/80 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/70 text-amber-800 flex items-center justify-center shrink-0">
              <Users size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-semibold mb-2 text-stone-900">선교회 및 구역모임</h2>
              <p className="text-stone-600 text-sm leading-relaxed mb-5">
                성도 간의 진실한 교제와 기도를 통해 그리스도의 한 몸을 이루고 사랑을 나누는 기관입니다.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-stone-50 border border-stone-200/70 text-stone-700 rounded-lg text-xs font-medium">남선교회</span>
                <span className="px-3 py-1.5 bg-stone-50 border border-stone-200/70 text-stone-700 rounded-lg text-xs font-medium">여전도회</span>
                <span className="px-3 py-1.5 bg-stone-50 border border-stone-200/70 text-stone-700 rounded-lg text-xs font-medium">청년부</span>
                <span className="px-3 py-1.5 bg-stone-50 border border-stone-200/70 text-stone-700 rounded-lg text-xs font-medium">지역별 구역(목장)</span>
              </div>
            </div>
          </section>

          {/* Volunteering */}
          <section className="bg-white p-7 sm:p-9 rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.03)] border border-stone-200/80 flex flex-col md:flex-row gap-6 sm:gap-8 items-start hover:border-amber-300/80 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/70 text-amber-800 flex items-center justify-center shrink-0">
              <Heart size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-semibold mb-2 text-stone-900">봉사 및 구제 사역</h2>
              <p className="text-stone-600 text-sm leading-relaxed">
                그리스도의 따뜻한 손길이 되어 지역사회의 이웃을 돌보고, 국내외 선교지를 후원하며 하나님 나라를 확장해 갑니다.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
