import Image from "next/image";
import { getGallery } from "@/lib/notion";
import { ImageIcon } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const photos = await getGallery();

  return (
    <div className="py-12 sm:py-16 bg-[#FAF9F6] min-h-screen text-stone-800">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest block mb-2">Gallery</span>
          <h1 className="text-3xl sm:text-4xl font-semibold text-stone-900 tracking-tight">교회 사진첩</h1>
          <p className="text-sm text-stone-500 mt-2">주님품교회의 은혜로운 순간들을 나눕니다</p>
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200/80">
            <ImageIcon className="mx-auto h-12 w-12 text-stone-300 mb-4" />
            <p className="text-stone-500">등록된 사진이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {photos.map((photo: any) => {
              // 유튜브 링크인지 확인하고 썸네일 추출
              const isYoutube = photo.imageUrl?.includes('youtu');
              let displayImg = photo.imageUrl;
              
              if (isYoutube) {
                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                const match = photo.imageUrl.match(regExp);
                const videoId = (match && match[2].length === 11) ? match[2] : null;
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
                          <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-stone-900 line-clamp-1">{photo.title}</h3>
                    <p className="text-sm text-stone-500 mt-1">{photo.date}</p>
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
