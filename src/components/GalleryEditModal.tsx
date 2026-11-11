"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Pencil,
  X,
  Loader2,
  Upload,
  Trash2,
  RotateCcw,
  AlertTriangle,
  ImageIcon,
  Check,
  Camera,
  Play,
} from "lucide-react";
import { compressImage } from "@/lib/imageCompression";
import type { GalleryAlbum, GalleryPhoto } from "./GalleryView";

function isVideoMedia(url?: string, fileName?: string): boolean {
  if (!url && !fileName) return false;
  const str = `${fileName || ""} ${url || ""}`.toLowerCase();
  return (
    str.includes(".mp4") ||
    str.includes(".mov") ||
    str.includes(".webm") ||
    str.includes(".m4v") ||
    str.includes(".ogg")
  );
}

interface ExistingPhotoItem {
  id: string;
  originalIndex: number;
  fileName: string;
  imageUrl: string;
  isDeleted: boolean;
  overwrittenBy?: string; // name of new file replacing it
}

export default function GalleryEditModal({
  album,
  triggerButton,
}: {
  album: GalleryAlbum;
  triggerButton?: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [error, setError] = useState("");

  // Extract category if title starts with [분류]
  const rawTitle = album.title || "";
  let initialCategory = "전체";
  let initialBaseTitle = rawTitle;
  const match = rawTitle.match(/^\[(.*?)\]\s*(.*)$/);
  if (match) {
    initialCategory = match[1];
    initialBaseTitle = match[2];
  }

  const [category, setCategory] = useState(initialCategory);
  const [title, setTitle] = useState(initialBaseTitle);
  const [date, setDate] = useState(album.date || "");

  // Existing photos state
  const [photosState, setPhotosState] = useState<ExistingPhotoItem[]>([]);
  // Newly added files
  const [newFiles, setNewFiles] = useState<File[]>([]);

  // Duplicate overwrite confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    fileName: string;
    onConfirm: () => void;
    onCancel: () => void;
  } | null>(null);

  const initForm = () => {
    let cat = "전체";
    let bTitle = album.title || "";
    const m = (album.title || "").match(/^\[(.*?)\]\s*(.*)$/);
    if (m) {
      cat = m[1];
      bTitle = m[2];
    }
    setCategory(cat);
    setTitle(bTitle);
    setDate(album.date || "");

    const items: ExistingPhotoItem[] = album.photos.map((p, idx) => ({
      id: p.id,
      originalIndex: typeof p.index === "number" ? p.index : idx,
      fileName: p.fileName || `사진_${idx + 1}.jpg`,
      imageUrl: p.imageUrl,
      isDeleted: false,
    }));
    setPhotosState(items);
    setNewFiles([]);
    setError("");
    setProgressMsg("");
  };

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    initForm();
    setOpen(true);
  };

  // Toggle delete on existing photo
  const toggleDeletePhoto = (targetIdx: number) => {
    setPhotosState((prev) =>
      prev.map((item, i) =>
        i === targetIdx ? { ...item, isDeleted: !item.isDeleted, overwrittenBy: undefined } : item
      )
    );
  };

  // Add new files with duplicate check and overwrite prompt
  const handleSelectNewFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;
    e.target.value = ""; // reset input

    let filesToProcess = selected;
    if (category === "영상") {
      const nonVideos = selected.filter(
        (f) => !f.type.startsWith("video/") && !/\.(mp4|mov|webm|m4v|ogg)$/i.test(f.name)
      );
      if (nonVideos.length > 0) {
        alert("영상 항목에는 동영상 파일(.mp4, .mov 등)만 첨부하실 수 있습니다.");
        filesToProcess = selected.filter(
          (f) => f.type.startsWith("video/") || /\.(mp4|mov|webm|m4v|ogg)$/i.test(f.name)
        );
      }
    }
    if (filesToProcess.length === 0) return;

    // Process each file sequentially
    for (const file of filesToProcess) {
      // 1. Check if matches existing photo (not marked deleted)
      const existingIdx = photosState.findIndex(
        (p) => !p.isDeleted && p.fileName.toLowerCase() === file.name.toLowerCase()
      );

      // 2. Check if matches already added new file
      const newFileIdx = newFiles.findIndex(
        (f) => f.name.toLowerCase() === file.name.toLowerCase()
      );

      if (existingIdx !== -1 || newFileIdx !== -1) {
        // Ask user for overwrite confirmation
        const overwriteConfirmed = await new Promise<boolean>((resolve) => {
          setConfirmDialog({
            fileName: file.name,
            onConfirm: () => resolve(true),
            onCancel: () => resolve(false),
          });
        });

        setConfirmDialog(null);

        if (overwriteConfirmed) {
          if (existingIdx !== -1) {
            // Mark existing photo as replaced/deleted
            setPhotosState((prev) =>
              prev.map((p, i) =>
                i === existingIdx ? { ...p, isDeleted: true, overwrittenBy: file.name } : p
              )
            );
          }
          if (newFileIdx !== -1) {
            // Replace queued new file
            setNewFiles((prev) => prev.map((f, i) => (i === newFileIdx ? file : f)));
          } else {
            setNewFiles((prev) => [...prev, file]);
          }
        }
        // if user cancelled, skip this file
      } else {
        // No duplicate, add directly
        setNewFiles((prev) => [...prev, file]);
      }
    }
  };

  const handleRemoveNewFile = (idx: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("앨범 제목을 입력해 주세요.");
      return;
    }

    const keptPhotos = photosState.filter((p) => !p.isDeleted);
    if (keptPhotos.length === 0 && newFiles.length === 0) {
      setError("앨범에 최소 1장 이상의 사진이 남아 있어야 합니다.");
      return;
    }

    setSubmitting(true);
    setProgressMsg("");

    try {
      let finalTitle = title.trim();
      if (category && category !== "전체") {
        if (!finalTitle.includes(`[${category}]`)) {
          finalTitle = `[${category}] ${finalTitle}`;
        }
      }

      // 1. Compress & upload any new files
      const uploadedFiles: Array<{ fileUploadId: string; fileName: string }> = [];
      if (newFiles.length > 0) {
        const total = newFiles.length;
        for (let i = 0; i < total; i++) {
          const rawFile = newFiles[i];
          const isVideo = rawFile.type.startsWith("video/");
          setProgressMsg(
            total > 1
              ? `${isVideo ? "동영상" : "사진"} 최적화 중... (${i + 1}/${total})`
              : `${isVideo ? "동영상" : "사진"} 최적화 중...`
          );
          const compressed = await compressImage(rawFile, 1920, 1920, 0.82);

          setProgressMsg(
            total > 1
              ? `${isVideo ? "동영상" : "사진"} 업로드 중... (${i + 1}/${total})`
              : `서버로 ${isVideo ? "동영상" : "사진"} 업로드 중...`
          );
          const fd = new FormData();
          fd.append("file", compressed);

          const upRes = await fetch("/api/content/upload", {
            method: "POST",
            body: fd,
          });

          let upData: any = {};
          try {
            upData = await upRes.json();
          } catch {
            const errText = await upRes.text().catch(() => "");
            throw new Error(`파일 전송 실패 (${upRes.status}): ${errText.slice(0, 80)}`);
          }

          if (!upRes.ok || !upData.fileUploadId) {
            throw new Error(upData.error || `${rawFile.name} 업로드에 실패했습니다.`);
          }

          uploadedFiles.push({
            fileUploadId: upData.fileUploadId,
            fileName: upData.fileName || rawFile.name,
          });
        }
      }

      // 2. Build keptPhotoIndices from existing photos that are kept
      const keptPhotoIndices = keptPhotos.map((p) => p.originalIndex);

      setProgressMsg("앨범 정보 저장 중...");

      const pageId = album.photos[0]?.pageId || album.photos[0]?.id;
      const res = await fetch("/api/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          menuType: "gallery",
          id: pageId,
          title: finalTitle,
          date,
          keptPhotoIndices,
          uploadedFiles: uploadedFiles.length > 0 ? uploadedFiles : undefined,
        }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        const errText = await res.text().catch(() => "");
        throw new Error(`저장 실패 (${res.status}): ${errText.slice(0, 80)}`);
      }

      if (!res.ok) {
        throw new Error(data.error || "수정에 실패했습니다.");
      }

      setOpen(false);
      router.refresh();
    } catch (err: any) {
      console.error("Gallery edit error:", err);
      setError(err?.message || "저장 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
      setProgressMsg("");
    }
  };

  const keptCount = photosState.filter((p) => !p.isDeleted).length;
  const deletedCount = photosState.filter((p) => p.isDeleted).length;

  return (
    <>
      {triggerButton ? (
        <span onClick={handleOpen}>{triggerButton}</span>
      ) : (
        <button
          type="button"
          onClick={handleOpen}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 border border-stone-200/90 text-xs font-semibold transition-colors cursor-pointer"
        >
          <Pencil size={13} />
          <span>앨범 수정</span>
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/55 backdrop-blur-xs p-3 sm:p-5"
          onClick={() => !submitting && setOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-stone-200/80 max-h-[92vh] flex flex-col text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-stone-100 shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-50 rounded-xl text-amber-800">
                  <Camera size={18} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-stone-900">
                    사진 앨범 수정 · 관리
                  </h3>
                  <p className="text-xs text-stone-400">
                    사진을 선택하여 삭제하거나 새 사진을 추가 및 교체할 수 있습니다.
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={submitting}
                onClick={() => setOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer disabled:opacity-40"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium shrink-0">
                {error}
              </div>
            )}

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* Category & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    소속 분류
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:border-amber-600"
                  >
                    <option value="전체">전체 사진첩</option>
                    <option value="영상">영상 (동영상 전용)</option>
                    <option value="남선교회">남선교회</option>
                    <option value="여전도회">여전도회</option>
                    <option value="학생부">학생부</option>
                    <option value="찬양단">찬양팀(부따겸 찬양단)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    앨범 날짜
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  앨범 제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 2026 전교인 여름수련회"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:border-amber-600"
                />
              </div>

              {/* Existing Photos Section with Selection / Deletion */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-stone-800">
                      등록된 사진 관리
                    </label>
                    <span className="text-[11px] text-stone-500 font-medium">
                      (유지: {keptCount}장 {deletedCount > 0 && `· 삭제 예정: ${deletedCount}장`})
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() =>
                        setPhotosState((prev) => prev.map((p) => ({ ...p, isDeleted: false })))
                      }
                      className="text-stone-500 hover:text-amber-800 font-medium cursor-pointer"
                    >
                      모두 유지
                    </button>
                    <span>·</span>
                    <button
                      type="button"
                      onClick={() =>
                        setPhotosState((prev) => prev.map((p) => ({ ...p, isDeleted: true })))
                      }
                      className="text-stone-500 hover:text-red-600 font-medium cursor-pointer"
                    >
                      모두 삭제 선택
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto p-2.5 bg-stone-50 rounded-2xl border border-stone-200">
                  {photosState.map((photo, idx) => {
                    const isVideo = isVideoMedia(photo.imageUrl, photo.fileName);

                    return (
                      <div
                        key={photo.id}
                        className={`relative rounded-xl overflow-hidden border transition-all ${
                          photo.isDeleted
                            ? "border-red-300 bg-red-50/70 opacity-60"
                            : "border-stone-200 bg-white shadow-2xs hover:border-amber-400"
                        }`}
                      >
                        <div className="aspect-[4/3] bg-stone-100 relative overflow-hidden flex items-center justify-center">
                          {isVideo ? (
                            <video
                              src={photo.imageUrl}
                              preload="metadata"
                              muted
                              playsInline
                              className={`w-full h-full object-cover ${
                                photo.isDeleted ? "grayscale" : ""
                              }`}
                            />
                          ) : (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={photo.imageUrl}
                              alt={photo.fileName}
                              className={`w-full h-full object-cover ${
                                photo.isDeleted ? "grayscale" : ""
                              }`}
                            />
                          )}

                          {isVideo && (
                            <div className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 font-medium">
                              <Play size={8} className="fill-current" /> 동영상
                            </div>
                          )}

                          {photo.isDeleted && (
                            <div className="absolute inset-0 bg-red-900/60 flex flex-col items-center justify-center text-white text-[11px] font-bold">
                              <span>삭제 예정</span>
                              {photo.overwrittenBy && (
                                <span className="text-[9px] text-amber-200 mt-0.5 px-1 truncate max-w-full">
                                  ({photo.overwrittenBy}로 교체)
                                </span>
                              )}
                            </div>
                          )}

                          <div className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono">
                            #{idx + 1}
                          </div>
                        </div>

                        <div className="p-2 flex items-center justify-between gap-1">
                          <span className="text-[11px] text-stone-700 truncate font-medium" title={photo.fileName}>
                            {photo.fileName}
                          </span>

                          <button
                            type="button"
                            onClick={() => toggleDeletePhoto(idx)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 transition-colors cursor-pointer ${
                              photo.isDeleted
                                ? "bg-stone-200 hover:bg-stone-300 text-stone-700"
                                : "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                            }`}
                          >
                            {photo.isDeleted ? (
                              <span className="inline-flex items-center gap-0.5">
                                <RotateCcw size={10} /> 복구
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-0.5">
                                <Trash2 size={10} /> 삭제
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add New Photos Section */}
              <div className="pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-800">
                    새 사진 추가 (여러 장 선택 가능)
                  </label>
                  {newFiles.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setNewFiles([])}
                      className="text-[11px] text-stone-400 hover:text-red-500 cursor-pointer"
                    >
                      추가 취소
                    </button>
                  )}
                </div>

                {newFiles.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 p-2 bg-amber-50/60 rounded-xl border border-amber-200/80 mb-2 max-h-32 overflow-y-auto">
                    {newFiles.map((file, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-amber-200 rounded-lg text-xs text-stone-700 shadow-2xs"
                      >
                        <span className="truncate max-w-[130px] font-medium">{file.name}</span>
                        <span className="text-[10px] text-stone-400">
                          ({(file.size / 1024 / 1024).toFixed(1)}MB)
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveNewFile(i)}
                          className="text-stone-400 hover:text-red-600 font-bold ml-1 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <label className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-dashed border-amber-300 bg-amber-50/40 hover:bg-amber-50 text-amber-900 text-xs sm:text-sm font-semibold cursor-pointer transition-colors">
                  <Upload size={16} className="text-amber-700" />
                  <span>
                    {category === "영상"
                      ? "스마트폰 · PC에서 새 동영상 추가하기..."
                      : "스마트폰 · PC에서 새 사진 · 동영상 추가하기..."}
                  </span>
                  <input
                    type="file"
                    accept={
                      category === "영상"
                        ? "video/*,.mp4,.mov,.webm,.m4v,.ogg"
                        : "image/*,video/*"
                    }
                    multiple
                    onChange={handleSelectNewFiles}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-stone-400 mt-1">
                  {category === "영상"
                    ? "* 짧은 동영상(mp4, mov 등) 첨부 가능 · 이미 등록된 이름과 동일한 파일은 덮어쓰기 여부를 확인합니다."
                    : "* 사진 및 짧은 동영상(mp4, mov 등) 첨부 가능 · 이미 등록된 이름과 동일한 파일은 덮어쓰기 여부를 확인합니다."}
                </p>
              </div>

              {progressMsg && (
                <div className="text-xs text-amber-900 bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center gap-2">
                  <Loader2 size={15} className="animate-spin text-amber-700 shrink-0" />
                  <span className="font-medium">{progressMsg}</span>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                <span className="text-xs text-stone-500">
                  최종 사진: <strong>{keptCount + newFiles.length}장</strong>
                </span>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 disabled:opacity-60 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                  >
                    {submitting && <Loader2 size={14} className="animate-spin" />}
                    <span>{submitting ? "저장 중..." : "수정 내용 저장"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Overwrite Confirmation Dialog Modal */}
          {confirmDialog && (
            <div
              className="fixed inset-0 z-[140] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 text-center space-y-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-800 mx-auto">
                  <AlertTriangle size={24} />
                </div>

                <div>
                  <h4 className="text-base font-bold text-stone-900">
                    등록된 파일이 있습니다
                  </h4>
                  <p className="text-xs text-stone-600 mt-2 break-all leading-relaxed">
                    <span className="font-semibold text-amber-900">&lsquo;{confirmDialog.fileName}&rsquo;</span>
                    <br />
                    동일한 이름의 사진이 이미 존재합니다.
                    <br />
                    <strong>기존 사진을 새 사진으로 덮어쓰시겠습니까?</strong>
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={confirmDialog.onCancel}
                    className="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    아니오 (건너뛰기)
                  </button>
                  <button
                    type="button"
                    onClick={confirmDialog.onConfirm}
                    className="flex-1 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                  >
                    예 (덮어쓰기)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
