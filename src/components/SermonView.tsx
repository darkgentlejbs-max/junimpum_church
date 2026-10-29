"use client";

import { useState } from "react";
import { PlayCircle, Calendar, User, X } from "lucide-react";
import { MasterEditButton, MasterDeleteButton } from "@/components/MasterWriteModal";

function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|live|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

export default function SermonView({
  sermons,
  canWrite = false,
}: {
  sermons: any[];
  canWrite?: boolean;
}) {
  const [activeSermon, setActiveSermon] = useState<any | null>(null);
  const [playingInFeatured, setPlayingInFeatured] = useState(false);

  const featured = sermons[0];
  const featuredYtId = getYouTubeId(featured?.videoUrl || "");

  const handleSelectSermon = (sermon: any, isFeatured = false) => {
    if (!sermon?.videoUrl) {
      alert("아직 설교 영상 링크가 등록되지 않았습니다.");
      return;
    }
    const ytId = getYouTubeId(sermon.videoUrl);
    if (ytId) {
      if (isFeatured) {
        setPlayingInFeatured(true);
      } else {
        setActiveSermon(sermon);
      }
    } else {
      window.open(sermon.videoUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      {/* Featured Sermon */}
      <section className="mb-10 sm:mb-14">
        <div
          onClick={() => !playingInFeatured && handleSelectSermon(featured, true)}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.03)] overflow-hidden border border-stone-200/80 flex flex-col lg:flex-row cursor-pointer group"
        >
          <div className="w-full lg:w-3/5 aspect-video bg-stone-900 relative flex items-center justify-center group-hover:bg-stone-800 transition-colors overflow-hidden">
            {playingInFeatured && featuredYtId ? (
              <iframe
                src={`https://www.youtube.com/embed/${featuredYtId}?autoplay=1&rel=0`}
                title={featured.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <>
                {featuredYtId ? (
                  <img
                    src={`https://img.youtube.com/vi/${featuredYtId}/hqdefault.jpg`}
                    alt={featured.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 opacity-25 bg-[url('/images/church-exterior.jpg')] bg-cover bg-center"></div>
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <PlayCircle
                  className="text-white opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all relative z-10 drop-shadow-md"
                  size={64}
                />
              </>
            )}
          </div>
          <div className="w-full lg:w-2/5 p-5 sm:p-10 flex flex-col justify-between">
            <div>
              <span className="inline-block px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200/60 rounded-full text-xs font-medium mb-4">
                최근 주일 설교
              </span>
              <h2 className="text-xl sm:text-2xl font-semibold text-stone-900 mb-2 group-hover:text-amber-800 transition-colors">
                {featured.title}
              </h2>
              <p className="text-base sm:text-lg text-stone-700 font-medium mb-6">
                {featured.passage}
              </p>
              <div className="space-y-2 text-sm sm:text-base text-stone-600">
                <p className="flex items-center gap-2">
                  <Calendar size={18} className="text-stone-400" /> {featured.date}
                </p>
                <p className="flex items-center gap-2">
                  <User size={18} className="text-stone-400" /> {featured.preacher}
                </p>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-amber-700 group-hover:text-amber-800 flex items-center gap-1">
                {featured.videoUrl ? "설교 영상 시청하기 \u2192" : "영상 준비 중"}
              </span>
              {canWrite && (
                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <MasterEditButton menuType="sermon" item={featured} />
                  <MasterDeleteButton id={featured.id} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sermon Grid */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-stone-900">지난 설교 목록</h3>
        <span className="text-xs text-stone-400">
          총 {sermons[0]?.id === "empty" ? 0 : sermons.length}개의 말씀
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sermons.slice(1).map((sermon: any) => {
          const ytId = getYouTubeId(sermon.videoUrl || "");
          return (
            <div
              key={sermon.id}
              onClick={() => handleSelectSermon(sermon, false)}
              className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 hover:border-amber-300/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-md transition-all group cursor-pointer flex flex-col"
            >
              <div className="aspect-video bg-stone-100 relative flex items-center justify-center group-hover:bg-stone-200/70 transition-colors overflow-hidden">
                {ytId ? (
                  <>
                    <img
                      src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                      alt={sermon.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors" />
                    <PlayCircle
                      className="text-white opacity-90 group-hover:scale-110 transition-all relative z-10 drop-shadow-md"
                      size={44}
                    />
                  </>
                ) : (
                  <PlayCircle
                    className="text-amber-700/70 group-hover:text-amber-800 group-hover:scale-105 transition-all"
                    size={40}
                  />
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-semibold text-stone-800 group-hover:text-amber-800 transition-colors mb-1.5 line-clamp-1">
                    {sermon.title}
                  </h4>
                  <p className="text-sm text-stone-600 font-medium mb-4 line-clamp-1">
                    {sermon.passage}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-stone-500 pt-3 border-t border-stone-100">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} /> {sermon.date}
                  </span>
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <span>{sermon.preacher}</span>
                    {canWrite && (
                      <>
                        <MasterEditButton menuType="sermon" item={sermon} />
                        <MasterDeleteButton id={sermon.id} />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Modal for Past Sermons */}
      {activeSermon && (() => {
        const ytId = getYouTubeId(activeSermon.videoUrl || "");
        if (!ytId) return null;
        return (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xs p-4"
            onClick={() => setActiveSermon(null)}
          >
            <div
              className="w-full max-w-4xl bg-stone-900 rounded-2xl overflow-hidden shadow-2xl border border-stone-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-3.5 bg-stone-900 text-stone-200 border-b border-stone-800">
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-white">
                    {activeSermon.title}
                  </h3>
                  <p className="text-xs text-stone-400">
                    {activeSermon.passage} · {activeSermon.preacher} ({activeSermon.date})
                  </p>
                </div>
                <button
                  onClick={() => setActiveSermon(null)}
                  className="p-1.5 text-stone-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={22} />
                </button>
              </div>
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                  title={activeSermon.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}
