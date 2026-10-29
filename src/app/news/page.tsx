import Link from "next/link";
import { Bell, FileText, Image as ImageIcon, Calendar } from "lucide-react";
import { getNews, getSchedule, findMemberByEmail } from "@/lib/notion";
import { getCurrentUser, isMasterRole } from "@/lib/auth";
import NoticeItem from "@/components/NoticeItem";
import ScheduleCalendar from "@/components/ScheduleCalendar";
import MasterWriteButton from "@/components/MasterWriteModal";

export const dynamic = 'force-dynamic';

export default async function NewsPage() {
  const [rawNotices, schedules, user] = await Promise.all([
    getNews(),
    getSchedule(),
    getCurrentUser(),
  ]);
  const notices = rawNotices.filter((n: any) => !n.title?.startsWith("[사역공지:"));

  let canWrite = isMasterRole(user?.role);
  if (!canWrite && user?.email) {
    try {
      const liveMember = await findMemberByEmail(user.email);
      if (liveMember && isMasterRole(liveMember.role)) {
        canWrite = true;
      }
    } catch {
      // ignore
    }
  }

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
    <div className="py-8 sm:py-16 bg-[#FAF9F6] min-h-screen text-stone-800">
      <div className="container mx-auto px-3 sm:px-6 max-w-5xl">
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest block mb-2">News & Schedule</span>
          <h1 className="text-2xl sm:text-4xl font-semibold text-stone-900 tracking-tight">소식 · 일정</h1>
          <p className="text-sm text-stone-500 mt-2">교회의 새로운 소식과 일정 안내입니다</p>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-5 sm:space-y-8">
          
          {/* Main Content Area (Notices) */}
          <section id="notices" className="bg-white p-5 sm:p-9 rounded-2xl sm:rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.03)] border border-stone-200/80">
            <div className="mb-5 sm:mb-6 pb-4 border-b border-stone-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100/70 text-amber-800 flex items-center justify-center shrink-0">
                    <Bell size={16} />
                  </div>
                  <h2 className="text-xl font-semibold text-stone-900">교회 소식</h2>
                </div>
                {canWrite && (
                  <MasterWriteButton menuType="news" buttonLabel="소식 글쓰기" />
                )}
              </div>
              <p className="text-xs sm:text-sm text-stone-500 pl-0 sm:pl-[44px] mt-1 sm:mt-0">우리는 부드럽고, 따뜻하고, 겸손한 주님품교회의 성도입니다.</p>
            </div>
            <ul className="divide-y divide-stone-100">
              {notices.map((notice: any) => (
                <NoticeItem key={notice.id} notice={notice} canWrite={canWrite} />
              ))}
            </ul>
          </section>

          {/* Schedule Section */}
          <section id="schedule" className="bg-white p-5 sm:p-9 rounded-2xl sm:rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.03)] border border-stone-200/80">
            <div className="mb-5 sm:mb-6 pb-4 border-b border-stone-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100/70 text-amber-800 flex items-center justify-center shrink-0">
                    <Calendar size={16} />
                  </div>
                  <h2 className="text-xl font-semibold text-stone-900">교회 일정</h2>
                </div>
                {canWrite && (
                  <MasterWriteButton menuType="schedule" buttonLabel="일정 글쓰기" />
                )}
              </div>
              <p className="text-xs sm:text-sm text-stone-500 pl-0 sm:pl-[44px] mt-1 sm:mt-0">달력에서 날짜를 클릭하시면 해당 날짜의 상세 일정을 확인하실 수 있습니다.</p>
            </div>
            
            <ScheduleCalendar schedules={schedules} canWrite={canWrite} />
          </section>

          {/* Quick Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/bulletins" className="bg-white p-5 rounded-2xl border border-stone-200/80 hover:border-amber-300/80 transition-all flex items-center gap-4 cursor-pointer group block">
              <div className="w-11 h-11 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600 group-hover:bg-amber-50 group-hover:text-amber-700 transition-colors shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-900 group-hover:text-amber-800 transition-colors">주보 다운로드</h3>
                <p className="text-xs text-stone-400 mt-0.5">매주 발행되는 주보 PDF 확인</p>
              </div>
            </Link>
            <Link href="/gallery" className="bg-white p-5 rounded-2xl border border-stone-200/80 hover:border-amber-300/80 transition-all flex items-center gap-4 cursor-pointer group block">
              <div className="w-11 h-11 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600 group-hover:bg-amber-50 group-hover:text-amber-700 transition-colors shrink-0">
                <ImageIcon size={20} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-900 group-hover:text-amber-800 transition-colors">교회 갤러리</h3>
                <p className="text-xs text-stone-400 mt-0.5">교회 행사 및 활동 사진 모음</p>
              </div>
            </Link>
            <a
              href="https://blog.naver.com/jesusbosom"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-5 rounded-2xl border border-stone-200/80 hover:border-[#03C75A]/60 transition-all flex items-center gap-4 cursor-pointer group block"
            >
              <div className="w-11 h-11 rounded-xl bg-[#03C75A]/10 flex items-center justify-center text-[#03C75A] group-hover:bg-[#03C75A] group-hover:text-white transition-colors shrink-0 font-extrabold text-lg">
                N
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-900 group-hover:text-[#03C75A] transition-colors">네이버 블로그</h3>
                <p className="text-xs text-stone-400 mt-0.5">주님품교회 공식 블로그 방문</p>
              </div>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
