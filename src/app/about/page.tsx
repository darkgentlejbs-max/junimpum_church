import { MapPin, Clock, Users, Target } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-12 text-secondary-900">교회 소개</h1>
        
        <section className="bg-white p-8 rounded-2xl shadow-sm mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 text-primary-600">환영합니다</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            대한예수교장로회(통합) 주님품교회에 오신 것을 환영합니다. <br/>
            우리는 <strong>믿음, 소망, 사랑</strong>을 바탕으로 세워지는 건강한 신앙 공동체입니다.<br/>
            주님의 따뜻한 품과 같은 교회가 되어, 상처입은 영혼을 위로하고 세상을 향해 복음의 빛을 발하는 사명을 감당하고자 합니다.
          </p>
        </section>

        <section id="worship-times" className="bg-white p-8 rounded-2xl shadow-sm mb-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <Clock className="text-primary-500 mr-3" size={28} />
            <h2 className="text-2xl font-bold text-gray-900">예배 시간 안내</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-primary-100 bg-primary-50/50">
                  <th className="py-4 px-6 text-secondary-800 font-semibold rounded-tl-lg">예배명</th>
                  <th className="py-4 px-6 text-secondary-800 font-semibold">시간</th>
                  <th className="py-4 px-6 text-secondary-800 font-semibold rounded-tr-lg">장소</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-900">주일 대예배</td>
                  <td className="py-4 px-6 text-gray-600">주일 오전 11:00</td>
                  <td className="py-4 px-6 text-gray-600">본당</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-900">수요 예배</td>
                  <td className="py-4 px-6 text-gray-600">수요일 오후 7:30</td>
                  <td className="py-4 px-6 text-gray-600">본당</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-900">새벽 기도회</td>
                  <td className="py-4 px-6 text-gray-600">평일 오전 5:00</td>
                  <td className="py-4 px-6 text-gray-600">본당</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-900">교회학교 예배</td>
                  <td className="py-4 px-6 text-gray-600">주일 오전 11:00</td>
                  <td className="py-4 px-6 text-gray-600">교육관</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="location" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center mb-6">
            <MapPin className="text-primary-500 mr-3" size={28} />
            <h2 className="text-2xl font-bold text-gray-900">오시는 길</h2>
          </div>
          <div className="bg-gray-100 w-full h-80 rounded-xl flex items-center justify-center mb-6 border border-gray-200">
            <div className="text-center text-gray-500">
              <MapPin size={48} className="mx-auto mb-2 opacity-50" />
              <span>지도 API 연동 영역 (카카오맵/네이버 지도)</span>
            </div>
          </div>
          <div className="space-y-2 text-gray-700">
            <p className="flex items-start">
              <strong className="w-20 text-gray-900 shrink-0">주소</strong>
              <span>대한예수교장로회 주님품교회<br/>(상세 주소는 추후 입력됩니다)</span>
            </p>
            <p className="flex items-start">
              <strong className="w-20 text-gray-900 shrink-0">대중교통</strong>
              <span>가까운 버스정류장 및 지하철역 안내</span>
            </p>
            <p className="flex items-start">
              <strong className="w-20 text-gray-900 shrink-0">주차안내</strong>
              <span>교회 주변 및 공영 주차장 이용 안내</span>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
