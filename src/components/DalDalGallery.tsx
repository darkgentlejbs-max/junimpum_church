"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { BookOpen, X, Calendar, Layers } from "lucide-react";
import { MasterEditButton, MasterDeleteButton } from "@/components/MasterWriteModal";

export default function DalDalGallery({
  daldals,
  canWrite = false,
}: {
  daldals: any[];
  canWrite?: boolean;
}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("all");

  // 등록된 말씀 카드의 연도 목록 및 연도별 개수 계산
  const { years, yearCounts } = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of daldals) {
      const y = (item.date || "").slice(0, 4);
      if (y && /^\d{4}$/.test(y)) {
        counts[y] = (counts[y] || 0) + 1;
      }
    }
    const sorted = Object.keys(counts).sort((a, b) => b.localeCompare(a));
    return { years: sorted, yearCounts: counts };
  }, [daldals]);

  const filteredDaldals = useMemo(() => {
    if (selectedYear === "all") return daldals;
    return daldals.filter((item: any) => (item.date || "").startsWith(selectedYear));
  }, [daldals, selectedYear]);

  if (daldals.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-stone-200/60 max-w-3xl mx-auto">
        <BookOpen size={40} className="mx-auto text-stone-300 mb-4" />
        <p className="text-stone-500 text-sm">등록된 말씀 카드가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 연도별 필터 탭 & 총 개수 안내 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200/70 shadow-2xs">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-700">
          <Layers size={16} className="text-amber-800" />
          <span>
            총 <strong className="text-amber-900">{daldals.length}장</strong>의 말씀 카드
            {selectedYear !== "all" && (
              <span className="text-stone-400 font-normal ml-1">
                ({selectedYear}년 {filteredDaldals.length}장 선택됨)
              </span>
            )}
          </span>
        </div>

        {years.length > 1 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedYear("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedYear === "all"
                  ? "bg-amber-800 text-white shadow-2xs"
                  : "bg-stone-100 hover:bg-stone-200 text-stone-600"
              }`}
            >
              전체 ({daldals.length})
            </button>
            {years.map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedYear === yr
                    ? "bg-amber-800 text-white shadow-2xs"
                    : "bg-stone-100 hover:bg-stone-200 text-stone-600"
                }`}
              >
                {yr}년 ({yearCounts[yr]})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDaldals.map((item: any) => (
          <div 
            key={item.id} 
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200/60 hover:shadow-md hover:border-amber-200/80 transition-all group flex flex-col cursor-pointer"
            onClick={() => {
              if (item.imageUrl) setSelectedImage(item.imageUrl);
            }}
          >
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
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono text-amber-700 font-medium block">{item.date}</span>
                  {canWrite && (
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <MasterEditButton menuType="daldal" item={item} />
                      <MasterDeleteButton id={item.id} />
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-stone-800 line-clamp-2">{item.title}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-8 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 sm:top-8 sm:right-8 text-white/70 hover:text-white transition-colors cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>
          
          <div 
            className="relative w-full max-w-4xl max-h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={selectedImage} 
              alt="달달바이블 원본" 
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
