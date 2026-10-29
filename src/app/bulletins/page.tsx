import { getBulletins, findMemberByEmail } from "@/lib/notion";
import { getCurrentUser, isMasterRole } from "@/lib/auth";
import { FileText, Download, Lock, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import MasterWriteButton, {
  MasterEditButton,
  MasterDeleteButton,
} from "@/components/MasterWriteModal";

export const dynamic = "force-dynamic";

export default async function BulletinsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="py-12 sm:py-20 bg-[#FAF9F6] min-h-[75vh] flex items-center justify-center text-stone-800 px-4">
        <div className="w-full max-w-md bg-white p-7 sm:p-10 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-stone-200/80 text-center">
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-amber-50 border border-amber-200/70 text-amber-800 flex items-center justify-center">
            <Lock size={24} />
          </div>
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest block mb-1.5">
            Members Only
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 mb-3">
            교인 전용 메뉴입니다
          </h1>
          <p className="text-sm text-stone-500 leading-relaxed mb-7 break-keep">
            주보 열람 및 다운로드는 <strong className="text-stone-800 font-semibold">회원가입이 완료된 성도님</strong>만 이용하실 수 있습니다. 로그인 후 이용해 주세요.
          </p>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <Link
              href="/login?redirect=/bulletins"
              className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-sm font-semibold transition-colors"
            >
              <LogIn size={16} />
              <span>로그인하기</span>
            </Link>
            <Link
              href="/signup"
              className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-700 text-sm font-semibold transition-colors"
            >
              <UserPlus size={16} />
              <span>회원가입</span>
            </Link>
          </div>

          <div className="mt-6 pt-5 border-t border-stone-100">
            <Link
              href="/news"
              className="text-xs text-stone-400 hover:text-amber-800 transition-colors underline underline-offset-4"
            >
              소식 및 일정으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const bulletins = await getBulletins();

  let liveRole = user.role;
  let canWrite = isMasterRole(user.role);
  if (user.email) {
    try {
      const liveMember = await findMemberByEmail(user.email);
      if (liveMember) {
        if (liveMember.role) liveRole = liveMember.role;
        if (isMasterRole(liveMember.role)) {
          canWrite = true;
        }
      }
    } catch {
      // ignore
    }
  }
  if (user.name === "박은희" && liveRole === "교역자") {
    liveRole = "사모";
    canWrite = true;
  }

  return (
    <div className="py-8 sm:py-16 bg-[#FAF9F6] min-h-screen text-stone-800">
      <div className="container mx-auto px-3 sm:px-6 max-w-4xl">
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest block mb-2">
            Weekly Bulletin
          </span>
          <h1 className="text-2xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
            주보 다운로드
          </h1>
          <p className="text-sm text-stone-500 mt-2">
            {user.name}{liveRole}님, 매주 발행되는 주보를 열람 및 다운로드하실 수 있습니다.
          </p>
        </div>

        {/* Bulletin List */}
        <div className="bg-white p-5 sm:p-9 rounded-2xl sm:rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.03)] border border-stone-200/80">
          <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#F1731C] text-white shadow-2xs flex items-center justify-center">
                <FileText size={16} />
              </div>
              <h2 className="text-xl font-semibold text-stone-900">주보 목록</h2>
            </div>
            {canWrite && (
              <MasterWriteButton menuType="bulletin" buttonLabel="주보 글쓰기" />
            )}
          </div>

          <div className="space-y-3">
            {bulletins.length > 0 ? (
              bulletins.map((bulletin: any) => (
                <div
                  key={bulletin.id}
                  className="flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-stone-100 bg-stone-50/50 hover:bg-stone-50 hover:border-amber-200/60 transition-colors group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <span className="text-xs text-stone-400 font-mono">
                      {bulletin.date}
                    </span>
                    <h3 className="text-base font-medium text-stone-800 group-hover:text-amber-800 transition-colors">
                      {bulletin.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 mt-3 sm:mt-0 shrink-0">
                    {canWrite && (
                      <>
                        <MasterEditButton menuType="bulletin" item={bulletin} />
                        <MasterDeleteButton id={bulletin.id} />
                      </>
                    )}
                    <a
                      href={bulletin.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 text-stone-600 rounded-lg text-sm font-medium hover:bg-stone-100 hover:text-stone-900 transition-colors shrink-0"
                    >
                      <Download size={16} />
                      <span>다운로드</span>
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-stone-500 text-sm">
                등록된 주보가 없습니다.
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/news"
            className="text-sm text-stone-500 hover:text-amber-800 transition-colors underline underline-offset-4"
          >
            소식 및 일정으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
