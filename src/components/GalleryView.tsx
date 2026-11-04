"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Camera,
  Layers,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  ImageIcon,
  Play,
} from "lucide-react";
import { MasterEditButton, MasterDeleteButton } from "@/components/MasterWriteModal";

export interface GalleryPhoto {
  id: string;
  pageId?: string;
  title: string;
  date: string;
  imageUrl: string;
}

export interface GalleryAlbum {
  title: string;
  date: string;
  coverImage: string;
  photos: GalleryPhoto[];
  pageId?: string;
}

function getYoutubeVideoId(url?: string): string | null {
  if (!url || !url.includes("youtu")) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=[&]?)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function getDisplayImageUrl(imageUrl: string): string {
  const ytId = getYoutubeVideoId(imageUrl);
  if (ytId) {
    return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  }
  return imageUrl;
}

export default function GalleryView({
  photos,
  canWrite = false,
  activeCategoryLabel = "전체 사진첩",
  isAllCategory = true,
}: {
  photos: GalleryPhoto[];
  canWrite?: boolean;
  activeCategoryLabel?: string;
  isAllCategory?: boolean;
}) {
  // 등록된 이름(title)을 기준으로 사진들을 앨범 형태로 그룹화
  const albums = useMemo(() => {
    const map = new Map<string, GalleryAlbum>();
    for (const photo of photos) {
      const rawTitle = (photo.title || "제목 없음").trim();
      if (!map.has(rawTitle)) {
        map.set(rawTitle, {
          title: rawTitle,
          date: photo.date,
          coverImage: photo.imageUrl,
          photos: [photo],
          pageId: photo.pageId,
        });
      } else {
        const existing = map.get(rawTitle)!;
        existing.photos.push(photo);
        // 더 최신 날짜가 있으면 갱신
        if (
          photo.date &&
          photo.date !== "날짜 없음" &&
          (!existing.date || existing.date === "날짜 없음" || photo.date > existing.date)
        ) {
          existing.date = photo.date;
        }
      }
    }
    return Array.from(map.values());
  }, [photos]);

  const [selectedAlbumTitle, setSelectedAlbumTitle] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // URL query parameter (?album=...) 연동 및 브라우저 뒤로가기 지원
  useEffect(() => {
    const applyFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const albumParam = params.get("album");
      if (albumParam) {
        setSelectedAlbumTitle(albumParam);
      } else {
        setSelectedAlbumTitle(null);
      }
    };

    applyFromUrl();
    window.addEventListener("popstate", applyFromUrl);
    return () => window.removeEventListener("popstate", applyFromUrl);
  }, []);

  const selectedAlbum = useMemo(() => {
    if (!selectedAlbumTitle) return null;
    return albums.find((a) => a.title === selectedAlbumTitle) || null;
  }, [albums, selectedAlbumTitle]);

  const handleOpenAlbum = (album: GalleryAlbum) => {
    setSelectedAlbumTitle(album.title);
    const url = new URL(window.location.href);
    url.searchParams.set("album", album.title);
    window.history.pushState({}, "", url.toString());
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleCloseAlbum = () => {
    setSelectedAlbumTitle(null);
    setLightboxIndex(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("album");
    window.history.pushState({}, "", url.toString());
  };

  // Lightbox 이전/다음 네비게이션
  const handlePrev = useCallback(() => {
    if (!selectedAlbum || lightboxIndex === null) return;
    setLightboxIndex((prev) =>
      prev === null ? 0 : (prev - 1 + selectedAlbum.photos.length) % selectedAlbum.photos.length
    );
  }, [selectedAlbum, lightboxIndex]);

  const handleNext = useCallback(() => {
    if (!selectedAlbum || lightboxIndex === null) return;
    setLightboxIndex((prev) =>
      prev === null ? 0 : (prev + 1) % selectedAlbum.photos.length
    );
  }, [selectedAlbum, lightboxIndex]);

  // 키보드 조작 (좌우 방향키, ESC)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, handlePrev, handleNext]);

  // 등록된 사진이 전혀 없을 때
  if (albums.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-stone-200/80 px-4">
        <ImageIcon className="mx-auto h-12 w-12 text-stone-300 mb-4" />
        <p className="text-stone-600 font-medium">
          {isAllCategory
            ? "등록된 사진이 없습니다."
            : `등록된 ${activeCategoryLabel} 활동 사진이 아직 없습니다.`}
        </p>
        {!isAllCategory && (
          <p className="text-xs text-stone-400 mt-2">
            노션 사진첩 제목에 &lsquo;{activeCategoryLabel}&rsquo;을 포함하여 등록하시면 이곳에 자동으로 표시됩니다.
          </p>
        )}
      </div>
    );
  }

  // 1. 특정 앨범을 클릭하여 해당 이름의 전체 사진을 보는 화면
  if (selectedAlbum) {
    const currentPhoto =
      lightboxIndex !== null ? selectedAlbum.photos[lightboxIndex] : null;
    const currentYtId = currentPhoto ? getYoutubeVideoId(currentPhoto.imageUrl) : null;

    return (
      <div className="space-y-6">
        {/* 상단: 목록으로 돌아가기 버튼 & 앨범 헤더 */}
        <div className="bg-white p-5 sm:p-7 rounded-3xl border border-stone-200/80 shadow-[0_2px_16px_rgba(0,0,0,0.03)]">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <button
              onClick={handleCloseAlbum}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 font-medium text-xs sm:text-sm transition-all shadow-2xs group cursor-pointer"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
              <span>전체 사진첩 목록으로 돌아가기</span>
            </button>

            {canWrite && selectedAlbum.photos[0] && (
              <div className="flex items-center gap-2">
                <MasterEditButton menuType="gallery" item={selectedAlbum.photos[0]} />
                <MasterDeleteButton
                  id={selectedAlbum.photos[0].pageId || selectedAlbum.photos[0].id}
                />
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-stone-100">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1">
              <Camera size={14} />
              <span>사진 앨범</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              {selectedAlbum.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 flex items-center gap-2">
              <span>{selectedAlbum.date}</span>
              <span>·</span>
              <span className="font-semibold text-amber-800">
                총 {selectedAlbum.photos.length}장의 사진
              </span>
            </p>
          </div>
        </div>

        {/* 앨범 전체 사진 그리드 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {selectedAlbum.photos.map((photo, idx) => {
            const isYt = Boolean(getYoutubeVideoId(photo.imageUrl));
            const displayImg = getDisplayImageUrl(photo.imageUrl);

            return (
              <div
                key={photo.id}
                onClick={() => setLightboxIndex(idx)}
                className="group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200/80 hover:border-amber-400 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
              >
                <div className="aspect-[4/3] bg-stone-100 relative overflow-hidden flex items-center justify-center">
                  {displayImg ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={displayImg}
                      alt={`${selectedAlbum.title} 사진 ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    />
                  ) : (
                    <ImageIcon className="text-stone-300" size={32} />
                  )}

                  {/* 사진 번호 배지 */}
                  <div className="absolute top-2.5 left-2.5 bg-black/55 backdrop-blur-md text-white text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full">
                    {idx + 1} / {selectedAlbum.photos.length}
                  </div>

                  {/* 유튜브 영상인 경우 재생 아이콘 */}
                  {isYt && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg">
                        <Play size={20} className="ml-0.5 fill-current" />
                      </div>
                    </div>
                  )}

                  {/* 호버 오버레이 */}
                  <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                    클릭하여 크게보기
                  </div>
                </div>

                {canWrite && (
                  <div
                    className="p-2.5 bg-white border-t border-stone-100 flex items-center justify-between text-xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-stone-400 text-[11px] font-mono truncate">
                      {photo.date}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <MasterEditButton menuType="gallery" item={photo} />
                      <MasterDeleteButton id={photo.pageId || photo.id} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 전체화면 라이트박스 모달 */}
        {lightboxIndex !== null && currentPhoto && (
          <div
            className="fixed inset-0 z-[100] flex flex-col bg-black/95 p-3 sm:p-6 backdrop-blur-md select-none animate-in fade-in duration-200"
            onClick={() => setLightboxIndex(null)}
          >
            {/* 상단 툴바 */}
            <div
              className="flex items-center justify-between text-white/90 pb-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="px-2.5 py-1 bg-white/10 rounded-full text-xs font-medium">
                  {lightboxIndex + 1} / {selectedAlbum.photos.length}
                </span>
                <h3 className="text-xs sm:text-sm font-semibold truncate max-w-[200px] sm:max-w-md text-stone-200">
                  {selectedAlbum.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={currentPhoto.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                  title="새 창에서 원본 보기"
                >
                  <ExternalLink size={18} />
                </a>
                <button
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                  onClick={() => setLightboxIndex(null)}
                  title="닫기 (ESC)"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* 메인 이미지 영역 */}
            <div
              className="relative flex-1 flex items-center justify-center min-h-0"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 이전 사진 버튼 */}
              {selectedAlbum.photos.length > 1 && (
                <button
                  onClick={handlePrev}
                  className="absolute left-1 sm:left-4 z-10 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/10 hover:border-white/30 backdrop-blur-sm transition-all cursor-pointer"
                  title="이전 사진 (←)"
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              {/* 이미지 또는 유튜브 영상 */}
              {currentYtId ? (
                <div className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl">
                  <iframe
                    src={`https://www.youtube.com/embed/${currentYtId}?autoplay=1`}
                    title={selectedAlbum.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={currentPhoto.imageUrl}
                  alt={`${selectedAlbum.title} 원본 ${lightboxIndex + 1}`}
                  className="max-w-full max-h-[82vh] object-contain rounded-xl shadow-2xl transition-transform"
                />
              )}

              {/* 다음 사진 버튼 */}
              {selectedAlbum.photos.length > 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-1 sm:right-4 z-10 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/10 hover:border-white/30 backdrop-blur-sm transition-all cursor-pointer"
                  title="다음 사진 (→)"
                >
                  <ChevronRight size={24} />
                </button>
              )}
            </div>

            {/* 하단 썸네일 스트립 (사진이 2장 이상일 때) */}
            {selectedAlbum.photos.length > 1 && (
              <div
                className="pt-3 flex items-center justify-center gap-1.5 overflow-x-auto max-w-2xl mx-auto px-2"
                onClick={(e) => e.stopPropagation()}
              >
                {selectedAlbum.photos.map((p, idx) => {
                  const thumbImg = getDisplayImageUrl(p.imageUrl);
                  const isCurrent = idx === lightboxIndex;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setLightboxIndex(idx)}
                      className={`relative w-12 h-10 sm:w-14 sm:h-11 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        isCurrent
                          ? "border-amber-400 scale-105 shadow-md"
                          : "border-transparent opacity-50 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumbImg}
                        alt="썸네일"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // 2. 갤러리 기본 화면: 등록된 이름별 '대표 사진' 목록
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-xs sm:text-sm text-stone-500 px-1">
        <span className="flex items-center gap-1.5 font-medium">
          <Layers size={15} className="text-amber-700" />
          <span>등록된 앨범</span>
          <strong className="text-amber-800 font-bold">{albums.length}개</strong>
        </span>
        <span className="text-stone-400 text-xs">대표 사진을 누르면 전체 사진이 열립니다</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {albums.map((album) => {
          const isYt = Boolean(getYoutubeVideoId(album.coverImage));
          const displayImg = getDisplayImageUrl(album.coverImage);
          const photoCount = album.photos.length;

          return (
            <div
              key={album.title}
              onClick={() => handleOpenAlbum(album)}
              className="group bg-white rounded-3xl overflow-hidden border border-stone-200/80 hover:border-amber-400 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
            >
              {/* 대표 사진 영역 */}
              <div className="aspect-[4/3] bg-stone-100 relative overflow-hidden flex items-center justify-center">
                {displayImg ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={displayImg}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                  />
                ) : (
                  <ImageIcon className="text-stone-300" size={36} />
                )}

                {/* 사진 매수 뱃지 (총 N장) */}
                <div className="absolute top-3 right-3 bg-black/65 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1.5">
                  <Camera size={13} className="text-amber-300" />
                  <span>{photoCount}장</span>
                </div>

                {/* 유튜브 영상일 때 재생 아이콘 */}
                {isYt && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg">
                      <Play size={22} className="ml-0.5 fill-current" />
                    </div>
                  </div>
                )}

                {/* 호버 시 앨범 열기 안내 오버레이 */}
                <div className="absolute inset-0 bg-stone-900/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-4 py-2 rounded-full bg-white/95 text-stone-900 text-xs sm:text-sm font-semibold shadow-md transform translate-y-1 group-hover:translate-y-0 transition-transform">
                    사진 {photoCount}장 모두 보기 →
                  </span>
                </div>
              </div>

              {/* 앨범 정보 영역 */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-mono text-stone-400">{album.date}</span>
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
                      사진 {photoCount}장
                    </span>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1">
                    {album.title}
                  </h3>
                </div>

                {/* 하단 관리자 버튼 (수정/삭제) */}
                {canWrite && album.photos[0] && (
                  <div
                    className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-end gap-1.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MasterEditButton menuType="gallery" item={album.photos[0]} />
                    <MasterDeleteButton
                      id={album.photos[0].pageId || album.photos[0].id}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
