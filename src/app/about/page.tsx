import { MapPin, Clock } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-16 bg-[#FAF9F6] min-h-screen text-stone-800">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest block mb-2">About Us</span>
          <h1 className="text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">교회 소개</h1>
          <p className="text-sm text-stone-500 mt-2">대한예수교장로회(통합) 주님품교회를 소개합니다</p>
        </div>
        
        {/* Welcome Section */}
        <section className="bg-white p-8 sm:p-10 rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.03)] mb-8 border border-stone-200/80">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-stone-900">
            환영합니다
          </h2>
          <p className="text-stone-600 leading-relaxed text-base sm:text-lg">
            대한예수교장로회(통합) 주님품교회에 오신 것을 진심으로 환영합니다.<br/>
            우리는 <strong className="text-amber-800 font-semibold">믿음, 소망, 사랑</strong>으로 함께 지어져 가는 거룩하고 따뜻한 신앙 공동체입니다.<br/><br/>
            세상의 풍파 속에서 지친 영혼들이 주님의 품 안에서 참된 안식과 위로를 얻고, 말씀의 능력으로 새 힘을 얻어 세상을 향해 빛과 소금의 사명을 감당하는 교회가 되고자 합니다.
          </p>
        </section>

        {/* Worship Times Section */}
        <section id="worship-times" className="bg-white p-8 sm:p-10 rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.03)] mb-8 border border-stone-200/80">
          <div className="flex items-center mb-6">
            <div className="w-9 h-9 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center mr-3">
              <Clock size={18} />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-stone-900">예배 시간 안내</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/70">
                  <th className="py-3.5 px-5 text-stone-700 font-medium text-sm rounded-tl-xl">예배명</th>
                  <th className="py-3.5 px-5 text-stone-700 font-medium text-sm">시간</th>
                  <th className="py-3.5 px-5 text-stone-700 font-medium text-sm rounded-tr-xl">장소</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                <tr className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-4 px-5 font-medium text-stone-900">주일 대예배</td>
                  <td className="py-4 px-5 text-stone-600">주일 오전 11:00</td>
                  <td className="py-4 px-5 text-stone-500">본당</td>
                </tr>
                <tr className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-4 px-5 font-medium text-stone-900">수요 기도회</td>
                  <td className="py-4 px-5 text-stone-600">수요일 오후 7:30</td>
                  <td className="py-4 px-5 text-stone-500">본당</td>
                </tr>
                <tr className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-4 px-5 font-medium text-stone-900">새벽 기도회</td>
                  <td className="py-4 px-5 text-stone-600">월-금 오전 5:00</td>
                  <td className="py-4 px-5 text-stone-500">본당</td>
                </tr>
                <tr className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-4 px-5 font-medium text-stone-900">교회학교 예배</td>
                  <td className="py-4 px-5 text-stone-600">주일 오전 11:00</td>
                  <td className="py-4 px-5 text-stone-500">교육관</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Location Section */}
        <section id="location" className="bg-white p-8 sm:p-10 rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.03)] border border-stone-200/80">
          <div className="flex items-center mb-6">
            <div className="w-9 h-9 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center mr-3">
              <MapPin size={18} />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-stone-900">오시는 길</h2>
          </div>
          <div className="bg-stone-100 w-full h-72 rounded-2xl flex items-center justify-center mb-6 border border-stone-200/70">
            <div className="text-center text-stone-400">
              <MapPin size={40} className="mx-auto mb-2 opacity-40 text-amber-800" />
              <span className="text-sm font-medium">지도 API 연동 영역 (카카오맵 / 네이버 지도)</span>
            </div>
          </div>
          <div className="space-y-3 text-sm text-stone-600">
            <p className="flex items-start">
              <strong className="w-20 text-stone-900 shrink-0 font-medium">교회 위치</strong>
              <span>대한예수교장로회(통합) 주님품교회</span>
            </p>
            <p className="flex items-start">
              <strong className="w-20 text-stone-900 shrink-0 font-medium">대중교통</strong>
              <span>인근 버스 정류장 및 지하철역 하차 후 도보 안내</span>
            </p>
            <p className="flex items-start">
              <strong className="w-20 text-stone-900 shrink-0 font-medium">주차 안내</strong>
              <span>교회 전용 주차공간 및 주변 주차 구역 이용 가능</span>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
