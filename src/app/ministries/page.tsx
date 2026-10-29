import Link from "next/link";
import { Users, Music, BookOpen, ImageIcon, ArrowUpRight } from "lucide-react";
import {
  getGallery,
  getMinistryNotices,
  findMemberByEmail,
  getSiteConfig,
  DEFAULT_SITE_CONFIG,
} from "@/lib/notion";
import { getCurrentUser, canAccessDepartmentBoard, isMasterRole } from "@/lib/auth";
import MinistryNoticeBoard from "@/components/MinistryNoticeBoard";
import MinistriesEditModal from "@/components/MinistriesEditModal";
import { MasterEditButton, MasterDeleteButton } from "@/components/MasterWriteModal";

export const dynamic = "force-dynamic";

export default async function MinistriesPage() {
  const [allPhotos, ministryNotices, user, siteConfig] = await Promise.all([
    getGallery(),
    getMinistryNotices(),
    getCurrentUser(),
    getSiteConfig(),
  ]);

  const minCfg = {
    ...DEFAULT_SITE_CONFIG.ministries,
    ...(siteConfig?.ministries || {}),
  };

  let userDepts: string[] = user?.departments || [];
  let userRole: string = user?.role || "";
  let userName: string = user?.name || "";
  if (user?.email) {
    try {
      const liveMember = await findMemberByEmail(user.email);
      if (liveMember) {
        if (Array.isArray(liveMember.departments)) {
          userDepts = liveMember.departments;
        }
        if (liveMember.role) {
          userRole = liveMember.role;
        }
        if (liveMember.name) {
          userName = liveMember.name;
        }
      }
    } catch {
      // ignore
    }
  }

  if (userName === "박은희" && userRole === "교역자") {
    userRole = "사모";
  }

  const isMaster = isMasterRole(userRole);
  const currentUserInfo = user ? { name: userName, role: userRole } : null;

  const menPhotos = allPhotos.filter((p: any) => p.title?.includes("남선교"));
  const womenPhotos = allPhotos.filter((p: any) => p.title?.includes("여전도"));
  const schoolPhotos = allPhotos.filter(
    (p: any) => p.title?.includes("학생부") || p.title?.includes("교회학교")
  );
  const worshipPhotos = allPhotos.filter(
    (p: any) => p.title?.includes("찬양") || p.title?.includes("부따겸")
  );

  const menNotices = ministryNotices.filter((n: any) => n.category === "남선교회");
  const womenNotices = ministryNotices.filter((n: any) => n.category === "여전도회");
  const schoolNotices = ministryNotices.filter((n: any) => n.category === "교회학교");
  const worshipNotices = ministryNotices.filter((n: any) => n.category === "찬양팀");

  return (
    <div className="py-8 sm:py-16 bg-[#FAF9F6] min-h-screen text-stone-800">
      <div className="container mx-auto px-3 sm:px-6 max-w-5xl">
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest block mb-2">
            Community & Ministries
          </span>
          <h1 className="text-2xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
            {minCfg.pageTitle}
          </h1>
          <p className="text-sm text-stone-500 mt-2">{minCfg.pageSubtitle}</p>
          {isMaster && (
            <div className="mt-4">
              <MinistriesEditModal initialConfig={minCfg} />
            </div>
          )}
        </div>

        <div className="space-y-4 sm:space-y-8">
          {/* 1. 기관 (남선교회, 여전도회) */}
          <section
            id="fellowships"
            className="scroll-mt-24 bg-white p-5 sm:p-9 rounded-2xl sm:rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.03)] border border-stone-200/80 flex flex-col md:flex-row gap-4 sm:gap-8 items-start hover:border-amber-300/80 transition-colors"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100/70 text-amber-800 flex items-center justify-center shrink-0">
              <Users size={24} />
            </div>
            <div className="flex-1 w-full">
              <h2 className="text-lg sm:text-xl font-semibold mb-2 text-stone-900">
                {minCfg.fellowshipsTitle}
              </h2>
              <p className="text-stone-600 text-sm leading-relaxed mb-5 whitespace-pre-line">
                {minCfg.fellowshipsDesc}
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* 남선교회 */}
                <div
                  id="men"
                  className="scroll-mt-24 bg-stone-50/80 p-4 sm:p-5 rounded-2xl border border-stone-200/70 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base sm:text-lg font-semibold text-stone-900">
                        {minCfg.menTitle}
                      </h3>
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
                      <div className="grid grid-cols-2 gap-2.5 mt-3 pt-3 border-t border-stone-200/60">
                        {menPhotos.slice(0, 4).map((photo: any) => (
                          <div
                            key={photo.id}
                            className="group rounded-xl overflow-hidden border border-stone-200/80 bg-white flex flex-col"
                          >
                            <a
                              href={photo.imageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="aspect-[4/3] overflow-hidden bg-stone-100 block"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={photo.imageUrl}
                                alt={photo.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </a>
                            <div className="p-2 flex items-center justify-between gap-1">
                              <a
                                href={photo.imageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] font-semibold text-stone-800 line-clamp-1 flex-1"
                              >
                                {photo.title}
                              </a>
                              {isMaster && (
                                <div className="flex items-center gap-1 shrink-0">
                                  <MasterEditButton menuType="gallery" item={photo} />
                                  <MasterDeleteButton id={photo.pageId || photo.id} />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <MinistryNoticeBoard
                    department="남선교회"
                    initialNotices={menNotices}
                    currentUser={currentUserInfo}
                    canWrite={canAccessDepartmentBoard(userDepts, "남선교회", userRole)}
                  />
                </div>

                {/* 여전도회 */}
                <div
                  id="women"
                  className="scroll-mt-24 bg-stone-50/80 p-4 sm:p-5 rounded-2xl border border-stone-200/70 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base sm:text-lg font-semibold text-stone-900">
                        {minCfg.womenTitle}
                      </h3>
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
                      <div className="grid grid-cols-2 gap-2.5 mt-3 pt-3 border-t border-stone-200/60">
                        {womenPhotos.slice(0, 4).map((photo: any) => (
                          <div
                            key={photo.id}
                            className="group rounded-xl overflow-hidden border border-stone-200/80 bg-white flex flex-col"
                          >
                            <a
                              href={photo.imageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="aspect-[4/3] overflow-hidden bg-stone-100 block"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={photo.imageUrl}
                                alt={photo.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </a>
                            <div className="p-2 flex items-center justify-between gap-1">
                              <a
                                href={photo.imageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] font-semibold text-stone-800 line-clamp-1 flex-1"
                              >
                                {photo.title}
                              </a>
                              {isMaster && (
                                <div className="flex items-center gap-1 shrink-0">
                                  <MasterEditButton menuType="gallery" item={photo} />
                                  <MasterDeleteButton id={photo.pageId || photo.id} />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <MinistryNoticeBoard
                    department="여전도회"
                    initialNotices={womenNotices}
                    currentUser={currentUserInfo}
                    canWrite={canAccessDepartmentBoard(userDepts, "여전도회", userRole)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 2. 교회학교 */}
          <section
            id="school"
            className="scroll-mt-24 bg-white p-5 sm:p-9 rounded-2xl sm:rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.03)] border border-stone-200/80 flex flex-col md:flex-row gap-4 sm:gap-8 items-start hover:border-amber-300/80 transition-colors"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100/70 text-amber-800 flex items-center justify-center shrink-0">
              <BookOpen size={24} />
            </div>
            <div className="flex-1 w-full">
              <h2 className="text-lg sm:text-xl font-semibold mb-2 text-stone-900">
                {minCfg.schoolTitle}
              </h2>
              <p className="text-stone-600 text-sm leading-relaxed mb-5 whitespace-pre-line">
                {minCfg.schoolDesc}
              </p>

              <div className="bg-stone-50/80 p-4 sm:p-5 rounded-2xl border border-stone-200/70">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-stone-900 mb-0.5">
                      {minCfg.schoolSubTitle}
                    </h4>
                    <p className="text-xs text-stone-500">{minCfg.schoolTimePlace}</p>
                  </div>
                  <Link
                    href="/gallery?category=school"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200/70 text-amber-900 text-xs font-semibold transition-colors"
                  >
                    <ImageIcon size={14} className="text-amber-700" />
                    <span>갤러리</span>
                    <ArrowUpRight size={13} className="text-amber-700/80" />
                  </Link>
                </div>

                {schoolPhotos.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-stone-200/60 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {schoolPhotos.slice(0, 6).map((photo: any) => (
                      <div
                        key={photo.id}
                        className="group rounded-2xl overflow-hidden border border-stone-200/80 bg-white flex flex-col"
                      >
                        <a
                          href={photo.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="aspect-[4/3] overflow-hidden bg-stone-100 block"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo.imageUrl}
                            alt={photo.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </a>
                        <div className="p-3 flex items-center justify-between gap-1.5">
                          <a
                            href={photo.imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="min-w-0 flex-1 block"
                          >
                            <p className="text-xs font-semibold text-stone-800 line-clamp-1">
                              {photo.title}
                            </p>
                            <p className="text-[11px] text-stone-400 mt-0.5">
                              {photo.date}
                            </p>
                          </a>
                          {isMaster && (
                            <div className="flex items-center gap-1 shrink-0">
                              <MasterEditButton menuType="gallery" item={photo} />
                              <MasterDeleteButton id={photo.pageId || photo.id} />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <MinistryNoticeBoard
                  department="교회학교"
                  initialNotices={schoolNotices}
                  currentUser={currentUserInfo}
                  canWrite={canAccessDepartmentBoard(userDepts, "교회학교", userRole)}
                />
              </div>
            </div>
          </section>

          {/* 3. 찬양팀(부따겸 찬양단) */}
          <section
            id="worship"
            className="scroll-mt-24 bg-white p-5 sm:p-9 rounded-2xl sm:rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.03)] border border-stone-200/80 flex flex-col md:flex-row gap-4 sm:gap-8 items-start hover:border-amber-300/80 transition-colors"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100/70 text-amber-800 flex items-center justify-center shrink-0">
              <Music size={24} />
            </div>
            <div className="flex-1 w-full">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-stone-900">
                    {minCfg.worshipTitle}
                  </h2>
                  <p className="text-stone-600 text-sm leading-relaxed mt-1 whitespace-pre-line">
                    {minCfg.worshipDesc}
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

              <div className="bg-stone-50/80 p-4 sm:p-5 rounded-2xl border border-stone-200/70">
                {worshipPhotos.length > 0 && (
                  <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {worshipPhotos.slice(0, 6).map((photo: any) => (
                      <div
                        key={photo.id}
                        className="group rounded-2xl overflow-hidden border border-stone-200/80 bg-white flex flex-col"
                      >
                        <a
                          href={photo.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="aspect-[4/3] overflow-hidden bg-stone-100 block"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo.imageUrl}
                            alt={photo.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </a>
                        <div className="p-3 flex items-center justify-between gap-1.5">
                          <a
                            href={photo.imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="min-w-0 flex-1 block"
                          >
                            <p className="text-xs font-semibold text-stone-800 line-clamp-1">
                              {photo.title}
                            </p>
                            <p className="text-[11px] text-stone-400 mt-0.5">
                              {photo.date}
                            </p>
                          </a>
                          {isMaster && (
                            <div className="flex items-center gap-1 shrink-0">
                              <MasterEditButton menuType="gallery" item={photo} />
                              <MasterDeleteButton id={photo.pageId || photo.id} />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <MinistryNoticeBoard
                  department="찬양팀"
                  initialNotices={worshipNotices}
                  currentUser={currentUserInfo}
                  canWrite={canAccessDepartmentBoard(userDepts, "찬양팀", userRole)}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
