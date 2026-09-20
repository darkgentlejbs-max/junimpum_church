import { CreditCard, Bell, FileText, Image as ImageIcon } from "lucide-react";
import { getNews } from "@/lib/notion";
import NoticeItem from "@/components/NoticeItem";

export const revalidate = 60; // 60초마다 데이터 새로고침

export default async function NewsPage() {
  const notices = await getNews();

  if (notices.length === 0) {
    notices.push({
      id: "empty",
      type: "공지",
      title: "등록된 소식이 없습니다.",
      date: "-"
    });
  }

  return (
    <div className="py-12 sm:py-16 bg-[#FAF9F6] min-h-screen text-stone-800">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest block mb-2">News & Offering</span>
          <h1 className="text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">소식 · 나눔</h1>
          <p className="text-sm text-stone-500 mt-2">교회의 새로운 소식과 온라인 헌금 안내입니다</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area (Notices) */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white p-7 sm:p-9 rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.03)] border border-stone-200/80">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100/70 text-amber-800 flex items-center justify-center">
                    <Bell size={16} />
                  </div>
                  <h2 className="text-xl font-semibold text-stone-900">교회 공지사항</h2>
                </div>
              </div>
              <ul className="divide-y divide-stone-100">
                {notices.map((notice: any) => (
                  <NoticeItem key={notice.id} notice={notice} />
                ))}
              </ul>
            </section>

            {/* Quick Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200/80 hover:border-amber-300/80 transition-all flex items-center gap-4 cursor-pointer group">
                <div className="w-11 h-11 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600 group-hover:bg-amber-50 group-hover:text-amber-700 transition-colors shrink-0">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900 group-hover:text-amber-800 transition-colors">주보 다운로드</h3>
                  <p className="text-xs text-stone-400 mt-0.5">매주 발행되는 주보 PDF 확인</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-stone-200/80 hover:border-amber-300/80 transition-all flex items-center gap-4 cursor-pointer group">
                <div className="w-11 h-11 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600 group-hover:bg-amber-50 group-hover:text-amber-700 transition-colors shrink-0">
                  <ImageIcon size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900 group-hover:text-amber-800 transition-colors">교회 갤러리</h3>
                  <p className="text-xs text-stone-400 mt-0.5">교회 행사 및 활동 사진 모음</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area: Online Offering */}
          <div>
            <section className="bg-white p-7 rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.03)] border border-stone-200/80">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-100/70 text-amber-800 flex items-center justify-center">
                  <CreditCard size={16} />
                </div>
                <h2 className="text-lg font-semibold text-stone-900">온라인 헌금 안내</h2>
              </div>
              <p className="text-xs text-stone-500 mb-5 leading-relaxed">
                정성껏 준비하신 헌금을 온라인으로 드릴 수 있습니다. 입금 시 <strong className="text-stone-800 font-medium">‘이름+헌금구분’</strong>(예: 홍길동십일조, 홍길동감사)을 기재해 주세요.
              </p>
              
              <div className="space-y-3.5">
                <div className="bg-stone-50/80 p-4 rounded-xl border border-stone-200/70">
                  <span className="block text-[11px] font-semibold text-amber-800 mb-1">십일조 / 감사 / 주일 헌금</span>
                  <p className="text-sm font-mono font-medium text-stone-900">농협 000-0000-0000</p>
                  <span className="block text-[11px] text-stone-400 mt-0.5">예금주: 주님품교회</span>
                </div>
                
                <div className="bg-stone-50/80 p-4 rounded-xl border border-stone-200/70">
                  <span className="block text-[11px] font-semibold text-amber-800 mb-1">건축 / 선교 / 구제 헌금</span>
                  <p className="text-sm font-mono font-medium text-stone-900">농협 111-1111-1111</p>
                  <span className="block text-[11px] text-stone-400 mt-0.5">예금주: 주님품교회</span>
                </div>
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}
