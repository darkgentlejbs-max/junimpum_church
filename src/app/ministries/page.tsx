import Link from "next/link";
import { Users, Music, BookOpen, Heart, ImageIcon, ArrowUpRight } from "lucide-react";
import { getGallery } from "@/lib/notion";

export const dynamic = "force-dynamic";

export default async function MinistriesPage() {
  const allPhotos = await getGallery();
  const worshipPhotos = allPhotos.filter(
    (p: any) => p.title?.includes("찬양") || p.title?.includes("부따겸")
  );
  const menPhotos = allPhotos.filter(
    (p: any) => p.title?.includes("남선교")
  );
  const womenPhotos = allPhotos.filter(
    (p: any) => p.title?.includes("여전도")
  );

  return (
    <div className="py-8 sm:py-16 bg-[#FAF9F6] min-h-screen text-stone-800">
      <div className="container mx-auto px-3 sm:px-6 max-w-5xl">
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest block mb-2">Community & Ministries</span>
          <h1 className="text-2xl sm:text-4xl font-semibold text-stone-900 tracking-tight">사역 및 기관</h1>
          <p className="text-sm text-stone-500 mt-2">각자의 은사대로 교회를 세우고 이웃을 섬기는 사역 공동체입니다</p>
        </div>
        
        <div className="space-y-4 sm:space-y-8">
          {/* Sunday School */}
          <section id="school" className="scroll-mt-24 bg-white p-5 sm:p-9 rounded-2xl sm:rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.03)] border border-stone-200/80 flex flex-col md:flex-row gap-4 sm:gap-8 items-start hover:border-amber-300/80 transition-colors">
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
                  <p className="text-xs text-stone-500">주일 오전 11:00 / 본관 1층</p>
                </div>
                <div className="bg-stone-50/80 p-3.5 rounded-xl border border-stone-100">
                  <h4 className="text-xs font-semibold text-stone-800 mb-0.5">중·고등부</h4>
                  <p className="text-xs text-stone-500">주일 오전 11:00 / 본관 1층</p>
                </div>
              </div>
            </div>
          </section>

          {/* Choir */}
          <section id="worship" className="scroll-mt-24 bg-white p-5 sm:p-9 rounded-2xl sm:rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.03)] border border-stone-200/80 flex flex-col md:flex-row gap-4 sm:gap-8 items-start hover:border-amber-300/80 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/70 text-amber-800 flex items-center justify-center shrink-0">
              <Music size={24} />
            </div>
            <div className="flex-1 w-full">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-stone-900">찬양팀(부따겸 찬양단)</h2>
                  <p className="text-stone-600 text-sm leading-relaxed mt-1">
                    예배 찬양 인도
                  </p>
                </div>
                <Link
                  href="/gallery?category=worship"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200/70 text-amber-900 text-xs sm:text-sm font-semibold transition-colors"
                >
                  <ImageIcon size={15} className="text-amber-700" />
                  <span>갤러리</span>
                  <ArrowUpRight size={14} className="text-amber-700/80" />
                </Link>
              </div>

              {worshipPhotos.length > 0 && (
                <div className="mt-4 pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {worshipPhotos.slice(0, 6).map((photo: any) => (
                    <a
                      key={photo.id}
                      href={photo.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group rounded-2xl overflow-hidden border border-stone-200/80 bg-stone-50 block"
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-semibold text-stone-800 line-clamp-1">{photo.title}</p>
                        <p className="text-[11px] text-stone-400 mt-0.5">{photo.date}</p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Fellowships / 기관 */}
          <section id="fellowships" className="scroll-mt-24 bg-white p-5 sm:p-9 rounded-2xl sm:rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.03)] border border-stone-200/80 flex flex-col md:flex-row gap-4 sm:gap-8 items-start hover:border-amber-300/80 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/70 text-amber-800 flex items-center justify-center shrink-0">
              <Users size={24} />
            </div>
            <div className="flex-1 w-full">
              <h2 className="text-lg sm:text-xl font-semibold mb-2 text-stone-900">기관</h2>
              <p className="text-stone-600 text-sm leading-relaxed mb-5">
                성도 간의 진실한 교제와 기도를 통해 그리스도의 한 몸을 이루고 사랑을 나누는 기관입니다.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 남선교회 */}
                <div className="bg-stone-50/80 p-4 sm:p-5 rounded-2xl border border-stone-200/70 flex flex-col justify-between gap-4">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm sm:text-base font-semibold text-stone-900">남선교회</h4>
                    <Link
                      href="/gallery?category=men"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200/70 text-amber-900 text-xs font-semibold transition-colors"
                    >
                      <ImageIcon size={14} className="text-amber-700" />
                      <span>갤러리</span>
                      <ArrowUpRight size={13} className="text-amber-700/80" />
                    </Link>
                  </div>

                  {menPhotos.length > 0 && (
                    <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-stone-200/60">
                      {menPhotos.slice(0, 4).map((photo: any) => (
                        <a
                          key={photo.id}
                          href={photo.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group rounded-xl overflow-hidden border border-stone-200/80 bg-white block"
                        >
                          <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={photo.imageUrl}
                              alt={photo.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-2">
                            <p className="text-[11px] font-semibold text-stone-800 line-clamp-1">{photo.title}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* 여전도회 */}
                <div className="bg-stone-50/80 p-4 sm:p-5 rounded-2xl border border-stone-200/70 flex flex-col justify-between gap-4">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm sm:text-base font-semibold text-stone-900">여전도회</h4>
                    <Link
                      href="/gallery?category=women"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200/70 text-amber-900 text-xs font-semibold transition-colors"
                    >
                      <ImageIcon size={14} className="text-amber-700" />
                      <span>갤러리</span>
                      <ArrowUpRight size={13} className="text-amber-700/80" />
                    </Link>
                  </div>

                  {womenPhotos.length > 0 && (
                    <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-stone-200/60">
                      {womenPhotos.slice(0, 4).map((photo: any) => (
                        <a
                          key={photo.id}
                          href={photo.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group rounded-xl overflow-hidden border border-stone-200/80 bg-white block"
                        >
                          <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={photo.imageUrl}
                              alt={photo.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-2">
                            <p className="text-[11px] font-semibold text-stone-800 line-clamp-1">{photo.title}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
