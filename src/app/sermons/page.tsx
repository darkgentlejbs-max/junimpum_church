import { PlayCircle, Calendar, User } from "lucide-react";

export default function SermonsPage() {
  const sermons = [
    { id: 1, title: "믿음으로 세워지는 삶", date: "2026-09-13", preacher: "담임목사", passage: "히브리서 11:1-3" },
    { id: 2, title: "소망 중에 즐거워하며", date: "2026-09-06", preacher: "담임목사", passage: "로마서 12:12" },
    { id: 3, title: "사랑은 언제나 오래참고", date: "2026-08-30", preacher: "담임목사", passage: "고린도전서 13:4-7" },
    { id: 4, title: "주님의 품안에서", date: "2026-08-23", preacher: "담임목사", passage: "시편 91:1-4" },
    { id: 5, title: "성령의 열매", date: "2026-08-16", preacher: "담임목사", passage: "갈라디아서 5:22-23" },
    { id: 6, title: "반석 위에 지은 집", date: "2026-08-09", preacher: "담임목사", passage: "마태복음 7:24-27" },
  ];

  return (
    <div className="py-12 sm:py-16 bg-[#FAF9F6] min-h-screen text-stone-800">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest block mb-2">Sermons & Worship</span>
          <h1 className="text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">예배 · 말씀</h1>
          <p className="text-sm text-stone-500 mt-2">매주 선포되는 하나님의 귀한 말씀을 함께 나눕니다</p>
        </div>
        
        {/* Featured Sermon */}
        <section className="mb-14">
          <div className="bg-white rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.03)] overflow-hidden border border-stone-200/80 flex flex-col lg:flex-row cursor-pointer group">
            <div className="w-full lg:w-3/5 aspect-video bg-stone-900 relative flex items-center justify-center group-hover:bg-stone-800 transition-colors">
              <div className="absolute inset-0 opacity-25 bg-[url('/images/church-exterior.jpg')] bg-cover bg-center"></div>
              <PlayCircle className="text-white opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all relative z-10 drop-shadow-md" size={64} />
            </div>
            <div className="w-full lg:w-2/5 p-8 sm:p-10 flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200/60 rounded-full text-xs font-medium mb-4">
                  최근 주일 설교
                </span>
                <h2 className="text-2xl font-semibold text-stone-900 mb-3 group-hover:text-amber-800 transition-colors">
                  {sermons[0].title}
                </h2>
                <p className="text-sm text-amber-900/80 font-serif mb-5 italic">
                  "{sermons[0].passage}"
                </p>
                <div className="space-y-1.5 text-xs text-stone-500">
                  <p className="flex items-center gap-2">
                    <Calendar size={14} className="text-stone-400"/> {sermons[0].date}
                  </p>
                  <p className="flex items-center gap-2">
                    <User size={14} className="text-stone-400"/> {sermons[0].preacher}
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <span className="text-xs font-medium text-amber-700 group-hover:text-amber-800 flex items-center gap-1">
                  설교 영상 시청하기 &rarr;
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Sermon Grid */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-stone-900">지난 설교 목록</h3>
          <span className="text-xs text-stone-400">총 6개의 말씀</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sermons.slice(1).map((sermon) => (
            <div key={sermon.id} className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 hover:border-amber-300/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-md transition-all group cursor-pointer flex flex-col">
              <div className="aspect-video bg-stone-100 relative flex items-center justify-center group-hover:bg-stone-200/70 transition-colors">
                <PlayCircle className="text-amber-700/70 group-hover:text-amber-800 group-hover:scale-105 transition-all" size={40} />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-semibold text-stone-800 group-hover:text-amber-800 transition-colors mb-1.5 line-clamp-1">
                    {sermon.title}
                  </h4>
                  <p className="text-xs text-stone-500 font-serif mb-4 italic line-clamp-1">
                    {sermon.passage}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[11px] text-stone-400 pt-3 border-t border-stone-100">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {sermon.date}
                  </span>
                  <span>{sermon.preacher}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
