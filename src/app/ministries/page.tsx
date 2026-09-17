import { Users, Music, BookOpen, Heart } from "lucide-react";

export default function MinistriesPage() {
  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl font-bold text-center mb-12 text-secondary-900">사역 및 기관</h1>
        
        <div className="space-y-8">
          {/* Sunday School */}
          <section className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-start hover:shadow-md transition-shadow">
            <div className="bg-orange-100 p-5 rounded-2xl text-primary-600 shrink-0">
              <BookOpen size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">교회학교</h2>
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                다음 세대를 하나님의 말씀으로 양육하고 영적 리더로 세워가는 부서입니다. 
                아이들의 눈높이에 맞춘 예배와 공과공부를 통해 신앙의 기초를 다집니다.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-secondary-800 mb-1">유·초등부</h4>
                  <p className="text-sm text-gray-500">주일 오전 11시 / 교육관 1층</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-secondary-800 mb-1">중·고등부</h4>
                  <p className="text-sm text-gray-500">주일 오전 11시 / 교육관 2층</p>
                </div>
              </div>
            </div>
          </section>

          {/* Choir */}
          <section className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-start hover:shadow-md transition-shadow">
            <div className="bg-blue-100 p-5 rounded-2xl text-blue-600 shrink-0">
              <Music size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">찬양대 및 찬양단</h2>
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                아름다운 목소리와 악기로 하나님께 영광을 돌리며, 성도들의 예배를 돕는 은혜로운 사역을 감당합니다.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-secondary-800 mb-1">호산나 찬양대</h4>
                  <p className="text-sm text-gray-500">주일 대예배 찬양 담당<br/>(연습: 주일 오후 1시 30분)</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-secondary-800 mb-1">마라나타 찬양단</h4>
                  <p className="text-sm text-gray-500">주일 및 수요예배 준비 찬양</p>
                </div>
              </div>
            </div>
          </section>

          {/* Fellowships */}
          <section className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-start hover:shadow-md transition-shadow">
            <div className="bg-green-100 p-5 rounded-2xl text-green-600 shrink-0">
              <Users size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">선교회 및 구역모임</h2>
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                성도 간의 친밀한 교제와 나눔을 통해 그리스도의 사랑을 실천하며, 교회와 지역사회를 섬기는 기관입니다.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">남선교회</span>
                <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">여전도회</span>
                <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">청년부</span>
                <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">지역별 구역(목장)</span>
              </div>
            </div>
          </section>

          {/* Outreach / Volunteering */}
          <section className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-start hover:shadow-md transition-shadow">
            <div className="bg-rose-100 p-5 rounded-2xl text-rose-600 shrink-0">
              <Heart size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">봉사 및 구제 사역</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                예수님의 손과 발이 되어 지역 사회의 소외된 이웃을 돌보고, 국내외 선교지를 후원하며 하나님 나라를 확장해 나갑니다.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
