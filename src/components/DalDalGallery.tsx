"use client";

import { useState } from "react";
import Image from "next/image";
import { BookOpen, X } from "lucide-react";

export default function DalDalGallery({ daldals }: { daldals: any[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (daldals.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-stone-200/60 max-w-3xl mx-auto">
        <BookOpen size={40} className="mx-auto text-stone-300 mb-4" />
        <p className="text-stone-500 text-sm">등록된 말씀 카드가 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {daldals.map((item: any) => (
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
                <span className="text-xs font-mono text-amber-700 font-medium mb-2 block">{item.date}</span>
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
            className="absolute top-4 right-4 sm:top-8 sm:right-8 text-white/70 hover:text-white transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>
          
          <div 
            className="relative w-full max-w-4xl max-h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImage} 
              alt="달달바이블 원본" 
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
