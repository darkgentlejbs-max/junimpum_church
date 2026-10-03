import { getBulletins } from "@/lib/notion";
import { FileText, Download } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function BulletinsPage() {
  const bulletins = await getBulletins();

  return (
    <div className="py-12 sm:py-16 bg-[#FAF9F6] min-h-screen text-stone-800">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest block mb-2">Weekly Bulletin</span>
          <h1 className="text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">주보 다운로드</h1>
          <p className="text-sm text-stone-500 mt-2">매주 발행되는 주보를 확인하실 수 있습니다.</p>
        </div>

        {/* Bulletin List */}
        <div className="bg-white p-7 sm:p-9 rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.03)] border border-stone-200/80">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
            <div className="w-8 h-8 rounded-lg bg-amber-100/70 text-amber-800 flex items-center justify-center">
              <FileText size={16} />
            </div>
            <h2 className="text-xl font-semibold text-stone-900">주보 목록</h2>
          </div>

          <div className="space-y-3">
            {bulletins.length > 0 ? (
              bulletins.map((bulletin: any) => (
                <div key={bulletin.id} className="flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-stone-100 bg-stone-50/50 hover:bg-stone-50 hover:border-amber-200/60 transition-colors group">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <span className="text-xs text-stone-400 font-mono">{bulletin.date}</span>
                    <h3 className="text-base font-medium text-stone-800 group-hover:text-amber-800 transition-colors">
                      {bulletin.title}
                    </h3>
                  </div>
                  <a
                    href={bulletin.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 mt-3 sm:mt-0 bg-white border border-stone-200 text-stone-600 rounded-lg text-sm font-medium hover:bg-stone-100 hover:text-stone-900 transition-colors shrink-0"
                  >
                    <Download size={16} />
                    <span>다운로드</span>
                  </a>
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
          <Link href="/news" className="text-sm text-stone-500 hover:text-amber-800 transition-colors underline underline-offset-4">
            소식 및 일정으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
