import { getDalDal } from "@/lib/notion";
import Image from "next/image";
import { BookOpen } from "lucide-react";

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
        {daldals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {daldals.map((item: any) => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200/60 hover:shadow-md hover:border-amber-200/80 transition-all group flex flex-col">
                <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden">
                  {item.imageUrl ? (
                    <Image 
                      src={item.imageUrl} 
                      alt={item.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400">
                      <BookOpen size={32} className="opacity-20" />
                    </div>
                  )}
                </div>
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono text-amber-700 font-medium mb-2 block">{item.date}</span>
                    <h3 className="text-sm font-semibold text-stone-800 line-clamp-2">{item.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200/60 max-w-3xl mx-auto">
            <BookOpen size={40} className="mx-auto text-stone-300 mb-4" />
            <p className="text-stone-500 text-sm">등록된 말씀 카드가 없습니다.</p>
          </div>
        )}

      </div>
    </div>
  );
}
