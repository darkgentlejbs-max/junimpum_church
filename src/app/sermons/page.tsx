import { getSermons } from "@/lib/notion";
import SermonView from "@/components/SermonView";

export const dynamic = "force-dynamic";

export default async function SermonsPage() {
  const sermons = await getSermons();

  // 노션에 데이터가 하나도 없을 경우의 기본값
  if (sermons.length === 0) {
    sermons.push({
      id: "empty",
      title: "등록된 말씀이 없습니다",
      date: "-",
      preacher: "-",
      passage: "-",
      videoUrl: "",
    });
  }

  return (
    <div className="py-12 sm:py-16 bg-[#FAF9F6] min-h-screen text-stone-800">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest block mb-2">
            Sermons & Worship
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
            예배 · 말씀
          </h1>
          <p className="text-sm text-stone-500 mt-2">
            매주 선포되는 하나님의 귀한 말씀을 함께 나눕니다
          </p>
        </div>

        <SermonView sermons={sermons} />
      </div>
    </div>
  );
}
