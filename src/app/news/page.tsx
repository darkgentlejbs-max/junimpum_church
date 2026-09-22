import Link from "next/link";
import { Bell, FileText, Image as ImageIcon, Calendar } from "lucide-react";
import { getNews, getSchedule } from "@/lib/notion";
import NoticeItem from "@/components/NoticeItem";

export const dynamic = 'force-dynamic';

export default async function NewsPage() {
  const notices = await getNews();
  const schedules = await getSchedule();

  if (notices.length === 0) {
    notices.push({
      id: "empty",
      type: "공지",
      title: "등록된 소식이 없습니다.",
      date: "-"
    });
  }

  if (schedules.length === 0) {
    schedules.push({
      id: "empty",
      type: "안내",
      title: "등록된 일정이 없습니다.",
      date: "-",
      location: "-"
    });
  }

  return (
    <div className="py-12 sm:py-16 bg-[#FAF9F6] min-h-screen text-stone-800">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest block mb-2">News & Schedule</span>
          <h1 className="text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">소식 · 일정</h1>
          <p className="text-sm text-stone-500 mt-2">교회의 새로운 소식과 일정 안내입니다</p>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Main Content Area (Notices) */}
          <section id="notices" className="bg-white p-7 sm:p-9 rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.03)] border border-stone-200/80">
            <div className="mb-6 pb-4 border-b border-stone-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100/70 text-amber-800 flex items-center justify-center">
                    <Bell size={16} />
                  </div>
                  <h2 className="text-xl font-semibold text-stone-900">교회 소식</h2>
                </div>
              </div>
              <p className="text-sm text-stone-500 pl-[44px]">우리는 부드럽고, 따뜻하고, 겸손한 주님품교회의 성도입니다.</p>
            </div>
            <ul className="divide-y divide-stone-100">
              {notices.map((notice: any) => (
                <NoticeItem key={notice.id} notice={notice} />
              ))}
            </ul>
          </section>

          {/* Schedule Section */}
          <section id="schedule" className="bg-white p-7 sm:p-9 rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.03)] border border-stone-200/80">
            <div className="mb-6 pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100/70 text-amber-800 flex items-center justify-center">
                  <Calendar size={16} />
                </div>
                <h2 className="text-xl font-semibold text-stone-900">교회 일정</h2>
              </div>
              <p className="text-sm text-stone-500 pl-[44px]">주님품교회의 다가오는 주요 일정입니다.</p>
            </div>
            
            <div className="space-y-4">
              {schedules.map((item: any) => {
                const dateObj = new Date(item.date);
                const isInvalidDate = isNaN(dateObj.getTime());
                const month = isInvalidDate ? '-' : dateObj.getMonth() + 1;
                const day = isInvalidDate ? '-' : dateObj.getDate();
                const days = ['일', '월', '화', '수', '목', '금', '토'];
                const dayName = isInvalidDate ? '' : days[dateObj.getDay()];

                return (
                  <div key={item.id} className="flex items-center gap-5 p-4 rounded-2xl border border-stone-100 bg-stone-50/50 hover:bg-stone-50 hover:border-amber-200/60 transition-colors group">
                    <div className="flex flex-col items-center justify-center w-14 h-14 shrink-0 bg-white rounded-xl shadow-sm border border-stone-200/60 group-hover:border-amber-300 transition-colors">
                      <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">{month}월</span>
                      <span className="text-xl font-bold text-stone-800 leading-none mt-0.5">{day}</span>
                    </div>
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-stone-200/70 text-stone-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          {item.type}
                        </span>
                        <span className="text-xs text-stone-400 font-medium">{item.location}</span>
                      </div>
                      <h3 className="text-base font-semibold text-stone-900 group-hover:text-amber-800 transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    <div className="hidden sm:flex text-sm text-stone-400 font-medium w-12 justify-end">
                      {dayName ? `${dayName}요일` : ''}
                    </div>
                  </div>
                );
              })}
            </div>
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
            <Link href="/gallery" className="bg-white p-5 rounded-2xl border border-stone-200/80 hover:border-amber-300/80 transition-all flex items-center gap-4 cursor-pointer group block">
              <div className="w-11 h-11 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600 group-hover:bg-amber-50 group-hover:text-amber-700 transition-colors shrink-0">
                <ImageIcon size={20} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-900 group-hover:text-amber-800 transition-colors">교회 갤러리</h3>
                <p className="text-xs text-stone-400 mt-0.5">교회 행사 및 활동 사진 모음</p>
              </div>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
