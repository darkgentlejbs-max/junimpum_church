import { getSermons, findMemberByEmail } from "@/lib/notion";
import { getCurrentUser, isMasterRole } from "@/lib/auth";
import SermonView from "@/components/SermonView";
import MasterWriteButton from "@/components/MasterWriteModal";

export const dynamic = "force-dynamic";

export default async function SermonsPage() {
  const [sermons, user] = await Promise.all([getSermons(), getCurrentUser()]);

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
    <div className="py-8 sm:py-16 bg-[#FAF9F6] min-h-screen text-stone-800">
      <div className="container mx-auto px-3 sm:px-6 max-w-6xl">
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest block mb-2">
            Sermons & Worship
          </span>
          <h1 className="text-2xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
            예배 · 말씀
          </h1>
          <p className="text-sm text-stone-500 mt-2">
            매주 선포되는 하나님의 귀한 말씀을 함께 나눕니다
          </p>
          {canWrite && (
            <div className="mt-4">
              <MasterWriteButton menuType="sermon" buttonLabel="설교 글쓰기" />
            </div>
          )}
        </div>

        <SermonView sermons={sermons} canWrite={canWrite} />
      </div>
    </div>
  );
}
