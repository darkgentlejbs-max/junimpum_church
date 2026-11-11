import Link from "next/link";
import { getGallery, findMemberByEmail } from "@/lib/notion";
import { getCurrentUser, isMasterRole } from "@/lib/auth";
import MasterWriteButton from "@/components/MasterWriteModal";
import GalleryView from "@/components/GalleryView";
import { isAnyVideoMedia } from "@/lib/media";

export const dynamic = "force-dynamic";

export default async function GalleryPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string }> | { category?: string };
}) {
  let activeCategory = "all";
  try {
    const resolvedParams = searchParams ? await Promise.resolve(searchParams) : {};
    if (resolvedParams && typeof resolvedParams === "object" && "category" in resolvedParams) {
      activeCategory = (resolvedParams as any).category || "all";
    }
  } catch {
    activeCategory = "all";
  }

  let allPhotos: any[] = [];
  let user: any = null;
  try {
    const [fetchedPhotos, fetchedUser] = await Promise.all([
      getGallery().catch(() => []),
      getCurrentUser().catch(() => null),
    ]);
    allPhotos = Array.isArray(fetchedPhotos) ? fetchedPhotos : [];
    user = fetchedUser;
  } catch {
    allPhotos = [];
    user = null;
  }

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
    { key: "video", label: "영상" },
    { key: "men", label: "남선교회" },
    { key: "women", label: "여전도회" },
    { key: "school", label: "학생부" },
    { key: "worship", label: "찬양팀(부따겸 찬양단)" },
  ];

  const photos = (allPhotos || []).filter((photo: any) => {
    if (!photo) return false;
    const title = photo.title || "";
    if (activeCategory === "video") {
      return (
        title.includes("영상") ||
        title.includes("[영상]") ||
        title.includes("동영상") ||
        title.includes("비디오") ||
        isAnyVideoMedia(photo.imageUrl, photo.fileName)
      );
    }
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
            {activeCategory === "all"
              ? "교회 사진첩"
              : activeCategory === "video"
              ? "교회 영상 갤러리"
              : `${activeCategoryObj.label} 갤러리`}
          </h1>
          <p className="text-sm text-stone-500 mt-2">
            {activeCategory === "video"
              ? "주님품교회의 은혜로운 영상과 순간들을 나눕니다"
              : "주님품교회의 은혜로운 순간들을 나눕니다"}
          </p>
          {canWrite && (
            <div className="mt-4">
              <MasterWriteButton
                menuType="gallery"
                buttonLabel={activeCategory === "video" ? "동영상 등록" : "사진 · 영상 글쓰기"}
                defaultCategory={
                  activeCategory === "video"
                    ? "영상"
                    : activeCategory === "men"
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

        <GalleryView
          photos={photos}
          canWrite={canWrite}
          activeCategoryLabel={activeCategoryObj.label}
          isAllCategory={activeCategory === "all"}
        />
      </div>
    </div>
  );
}
