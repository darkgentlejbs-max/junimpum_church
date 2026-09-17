import { CreditCard, Bell, FileText, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function NewsPage() {
  const notices = [
    { id: 1, title: "추수감사주일 예배 및 성찬식 안내", date: "2026-09-17", isNew: true },
    { id: 2, title: "하반기 구역장/권찰 교육 일정 안내", date: "2026-09-10", isNew: false },
    { id: 3, title: "주님품교회 홈페이지 새단장 오픈", date: "2026-09-01", isNew: false },
    { id: 4, title: "가을맞이 전교인 체육대회 안내", date: "2026-08-25", isNew: false },
    { id: 5, title: "금요 심야 기도회 시간 변경 안내", date: "2026-08-15", isNew: false },
  ];

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl font-bold text-center mb-12 text-secondary-900">소식/나눔</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area (Notices) */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                <div className="flex items-center">
                  <Bell className="text-primary-500 mr-3" size={28} />
                  <h2 className="text-2xl font-bold text-gray-900">교회 소식</h2>
                </div>
                <Link href="#" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">더보기 &rarr;</Link>
              </div>
              <ul className="space-y-4">
                {notices.map((notice) => (
                  <li key={notice.id} className="group flex items-start sm:items-center flex-col sm:flex-row justify-between py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors cursor-pointer">
                    <div className="flex items-center mb-2 sm:mb-0">
                      {notice.isNew && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded mr-3 shrink-0">NEW</span>
                      )}
                      <span className="text-gray-800 font-medium group-hover:text-primary-600 transition-colors line-clamp-1">
                        {notice.title}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400 shrink-0">{notice.date}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Quick Menu Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="#" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-primary-300 hover:shadow-md transition-all group flex items-center">
                <div className="bg-blue-50 p-3 rounded-full mr-4 group-hover:bg-blue-100 transition-colors">
                  <FileText className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">주보 다운로드</h3>
                  <p className="text-xs text-gray-500 mt-1">매주 주보를 PDF로 제공합니다</p>
                </div>
              </Link>
              <Link href="#" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-primary-300 hover:shadow-md transition-all group flex items-center">
                <div className="bg-green-50 p-3 rounded-full mr-4 group-hover:bg-green-100 transition-colors">
                  <ImageIcon className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">교회 갤러리</h3>
                  <p className="text-xs text-gray-500 mt-1">교회 행사 및 모임 사진</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-6">
                <CreditCard className="text-primary-500 mr-3" size={24} />
                <h2 className="text-xl font-bold text-gray-900">온라인 헌금</h2>
              </div>
              <div className="text-sm text-gray-600 mb-6 leading-relaxed">
                정성껏 준비하신 예물을 온라인으로 드릴 수 있습니다. 송금 시 <strong className="text-gray-900">'이름+헌금종류'</strong>를 기재해 주세요.<br/>
                <span className="text-gray-400 text-xs mt-1 block">(예: 홍길동십일조, 홍길동감사)</span>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <span className="block text-xs font-semibold text-primary-600 mb-1">십일조 / 감사 / 주일 헌금</span>
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-lg text-secondary-900 font-mono">농협 000-0000-0000</strong>
                  </div>
                  <span className="block text-sm text-gray-500">예금주: 주님품교회</span>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <span className="block text-xs font-semibold text-primary-600 mb-1">건축 / 선교 / 구제 헌금</span>
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-lg text-secondary-900 font-mono">농협 111-1111-1111</strong>
                  </div>
                  <span className="block text-sm text-gray-500">예금주: 주님품교회</span>
                </div>
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}
