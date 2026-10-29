import Link from "next/link";
import { getGallery, findMemberByEmail } from "@/lib/notion";
import { getCurrentUser, isMasterRole } from "@/lib/auth";
import { ImageIcon } from "lucide-react";
import MasterWriteButton, { MasterDeleteButton } from "@/components/MasterWriteModal";

export const dynamic = "force-dynamic";

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = params?.category || "all";
  const [allPhotos, user] = await Promise.all([getGallery(), getCurrentUser()]);

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

  const categories = [
    { key: "all", label: "전체 사진첩" },
    { key: "men", label: "남선교회" },
    { key: "women", label: "여전도회" },
    { key: "school", label: "학생부" },
    { key: "worship", label: "찬양팀(부따겸 찬양단)" },
  ];

  const photos = allPhotos.filter((photo: any) => {
    const title = photo.title || "";
    if (activeCategory === "worship") {
      return title.includes("찬양") || title.includes("부따겸");
    }
    if (activeCategory === "men") {
      return title.includes("남선교");
    }
    if (activeCategory === "women") {
      return title.includes("여전도");
    }
    if (activeCategory === "school") {
      return title.includes("학생부") || title.includes("교회학교");
    }
    return true;
  });

  const activeCategoryObj = categories.find((c) => c.key === activeCategory) || categories[0];

  return (
    <div className="py-8 sm:py-16 bg-[#FAF9F6] min-h-screen text-stone-800">
      <div className="container mx-auto px-3 sm:px-6 max-w-6xl">
        {/* Page Header */}
        <div className="text-center mb-6 sm:mb-10">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest block mb-2">
            Gallery
          </span>
          <h1 className="text-2xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
            {activeCategory === "all" ? "교회 사진첩" : `${activeCategoryObj.label} 갤러리`}
          </h1>
          <p className="text-sm text-stone-500 mt-2">
            주님품교회의 은혜로운 순간들을 나눕니다
          </p>
          {canWrite && (
            <div className="mt-4">
              <MasterWriteButton
                menuType="gallery"
                buttonLabel="사진 · 영상 글쓰기"
                defaultCategory={
                  activeCategory === "men"
                    ? "남선교회"
                    : activeCategory === "women"
                    ? "여전도회"
                    : activeCategory === "school"
                    ? "학생부"
                    : activeCategory === "worship"
                    ? "찬양단"
                    : "전체"
                }
              />
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 sm:mb-10">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <Link
                key={cat.key}
                href={cat.key === "all" ? "/gallery" : `/gallery?category=${cat.key}`}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-amber-800 text-white shadow-xs"
                    : "bg-white text-stone-600 border border-stone-200/80 hover:border-amber-300 hover:text-amber-800"
                }`}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200/80 px-4">
            <ImageIcon className="mx-auto h-12 w-12 text-stone-300 mb-4" />
            <p className="text-stone-600 font-medium">
              {activeCategory === "all"
                ? "등록된 사진이 없습니다."
                : `등록된 ${activeCategoryObj.label} 활동 사진이 아직 없습니다.`}
            </p>
            {activeCategory !== "all" && (
              <p className="text-xs text-stone-400 mt-2">
                노션 사진첩에 제목에 &lsquo;{activeCategory === "worship" ? "찬양단" : activeCategoryObj.label}&rsquo;을 포함하여 사진을 등록하시면 이곳에 자동으로 표시됩니다.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {photos.map((photo: any) => {
              // 유튜브 링크인지 확인하고 썸네일 추출
              const isYoutube = photo.imageUrl?.includes("youtu");
              let displayImg = photo.imageUrl;

              if (isYoutube) {
                const regExp =
                  /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                const match = photo.imageUrl.match(regExp);
                const videoId = match && match[2].length === 11 ? match[2] : null;
                if (videoId) {
                  displayImg = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                }
              }

              return (
                <a
                  href={photo.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={photo.id}
                  className="group bg-white rounded-3xl overflow-hidden border border-stone-200/80 hover:border-amber-300/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-md transition-all block cursor-pointer"
                >
                  <div className="aspect-[4/3] bg-stone-100 relative overflow-hidden flex items-center justify-center">
                    {displayImg ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={displayImg}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <ImageIcon className="text-stone-300" size={32} />
                    )}

                    {/* 유튜브 영상인 경우 재생 아이콘 표시 */}
                    {isYoutube && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg">
                          <svg
                            className="w-6 h-6 ml-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-stone-900 line-clamp-1">
                        {photo.title}
                      </h3>
                      <p className="text-sm text-stone-500 mt-1">{photo.date}</p>
                    </div>
                    {canWrite && <MasterDeleteButton id={photo.pageId || photo.id} />}
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
