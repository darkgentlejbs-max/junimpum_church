import { getDalDal } from "@/lib/notion";
import { BookOpen } from "lucide-react";
import DalDalGallery from "@/components/DalDalGallery";

export const dynamic = 'force-dynamic';

export default async function DalDalPage() {
  const daldals = await getDalDal();

  return (
    <div className="py-12 sm:py-16 bg-[#FAF9F6] min-h-screen text-stone-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest block mb-3">DalDal Bible</span>
          <h1 className="text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight mb-4 flex items-center justify-center gap-3">
            <BookOpen className="text-amber-700" size={32} />
            달달바이블
          </h1>
          <p className="text-stone-500 text-sm sm:text-base leading-relaxed">
            매일 아침 배달되는 은혜로운 말씀 카드입니다.<br className="hidden sm:block" />
            주님의 말씀으로 하루를 시작하세요.
          </p>
        </div>

        {/* Gallery Grid */}
        <DalDalGallery daldals={daldals} />

      </div>
    </div>
  );
}
