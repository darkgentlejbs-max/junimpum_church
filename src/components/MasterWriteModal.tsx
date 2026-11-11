"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PenLine, X, Loader2, Upload, Trash2, Pencil, Image as ImageIcon } from "lucide-react";
import { compressImage, compressImages } from "@/lib/imageCompression";

export type MenuType = "sermon" | "daldal" | "news" | "schedule" | "bulletin" | "gallery";

interface WriteProps {
  menuType: MenuType;
  buttonLabel?: string;
  defaultCategory?: string;
  defaultDate?: string;
}

export default function MasterWriteButton({
  menuType,
  buttonLabel = "글쓰기",
  defaultCategory = "",
  defaultDate,
}: WriteProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(defaultDate || today);
  const [passage, setPassage] = useState("");
  const [preacher, setPreacher] = useState("담임목사");
  const [videoUrl, setVideoUrl] = useState("");
  const [type, setType] = useState(menuType === "schedule" ? "행사" : "공지");
  const [location, setLocation] = useState("본관 2층 대예배실");
  const [content, setContent] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [galleryDept, setGalleryDept] = useState(defaultCategory || "전체");
  const [file, setFile] = useState<File | null>(null);
  const [editProgress, setEditProgress] = useState("");
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState("");

  const handleAppendGalleryFiles = (selected: File[]) => {
    if (selected.length === 0) return;

    let filesToProcess = selected;
    if (galleryDept === "영상") {
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

    setGalleryFiles((prev) => {
      let current = [...prev];
      for (const newFile of filesToProcess) {
        const existingIdx = current.findIndex(
          (f) => f.name.toLowerCase() === newFile.name.toLowerCase()
        );
        if (existingIdx !== -1) {
          const overwrite = window.confirm(
            `이미 첨부된 파일 '${newFile.name}'이(가) 있습니다. 덮어쓰시겠습니까?`
          );
          if (overwrite) {
            current[existingIdx] = newFile;
          }
        } else {
          current.push(newFile);
        }
      }
      return current;
    });
  };

  const resetForm = () => {
    setTitle("");
    setDate(defaultDate || today);
    setPassage("");
    setPreacher("담임목사");
    setVideoUrl("");
    setType(menuType === "schedule" ? "행사" : "공지");
    setLocation("본관 2층 대예배실");
    setContent("");
    setExternalUrl("");
    setFile(null);
    setGalleryFiles([]);
    setUploadProgress("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("제목을 입력해 주세요.");
      return;
    }

    setSubmitting(true);
    setUploadProgress("");
    try {
      let finalTitle = title.trim();
      if (menuType === "gallery" && galleryDept && galleryDept !== "전체") {
        if (!finalTitle.includes(galleryDept)) {
          finalTitle = `[${galleryDept}] ${finalTitle}`;
        }
      }

      const targetFiles: File[] =
        menuType === "gallery" && galleryFiles.length > 0
          ? galleryFiles
          : file
          ? [file]
          : [];

      if (menuType === "gallery" && galleryDept === "영상") {
        const hasExternalVideo = externalUrl.trim().length > 0;
        const hasVideoFile = targetFiles.some(
          (f) => f.type.startsWith("video/") || /\.(mp4|mov|webm|m4v|ogg)$/i.test(f.name)
        );
        if (!hasExternalVideo && !hasVideoFile) {
          setError("영상 항목에는 동영상 파일(.mp4, .mov 등) 또는 유튜브 영상 링크를 등록해 주세요.");
          setSubmitting(false);
          return;
        }
      }

      const uploadedFiles: Array<{ fileUploadId: string; fileName: string }> = [];

      // 1. 첨부 파일이 있는 경우: 각 파일을 개별 압축 후 개별 업로드 (Vercel 4.5MB 한도 완벽 방지)
      if (targetFiles.length > 0) {
        const total = targetFiles.length;
        for (let i = 0; i < total; i++) {
          const rawFile = targetFiles[i];
          const isVideo = rawFile.type.startsWith("video/");

          if (rawFile.size > 50 * 1024 * 1024) {
            throw new Error(`'${rawFile.name}' 파일이 너무 큽니다(50MB 초과). 짧은 동영상 또는 고화질 압축 영상을 올려주세요.`);
          }

          // 클라이언트 측 고화질 압축 (스마트폰 10MB 원본 -> 400KB~700KB, 영상은 원본 유지)
          setUploadProgress(
            total > 1
              ? `${isVideo ? "동영상" : "사진"} 최적화 중... (${i + 1}/${total})`
              : `${isVideo ? "동영상" : "사진"} 최적화 중...`
          );
          const compressed = await compressImage(rawFile, 1920, 1920, 0.82);

          // 단일 파일 업로드 전송
          setUploadProgress(
            total > 1
              ? `${isVideo ? "동영상" : "사진"} 서버 업로드 중... (${i + 1}/${total})`
              : `서버로 ${isVideo ? "동영상" : "사진"} 업로드 중...`
          );

          const fileFormData = new FormData();
          fileFormData.append("file", compressed);

          const upRes = await fetch("/api/content/upload", {
            method: "POST",
            body: fileFormData,
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

      // 2. 모든 파일 업로드 완료 후, 가벼운 JSON 요청으로 노션에 페이지 생성
      setUploadProgress("게시글 정보 저장 중...");

      const payloadBody = {
        menuType,
        title: finalTitle,
        date,
        passage,
        preacher,
        videoUrl,
        type,
        location,
        content,
        imageUrl: externalUrl.trim(),
        fileUrl: externalUrl.trim(),
        fileUploadId: uploadedFiles[0]?.fileUploadId,
        fileName: uploadedFiles[0]?.fileName,
        uploadedFiles: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      };

      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadBody),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        const errText = await res.text().catch(() => "");
        throw new Error(`게시글 등록 실패 (${res.status}): ${errText.slice(0, 80)}`);
      }

      if (!res.ok) {
        throw new Error(data.error || "등록에 실패했습니다.");
      }

      resetForm();
      setOpen(false);
      router.refresh();
    } catch (err: any) {
      console.error("Write error:", err);
      const msg = err?.message || (typeof err === "string" ? err : "");
      setError(msg || "등록 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
      setUploadProgress("");
    }
  };

  const getModalTitle = () => {
    switch (menuType) {
      case "sermon":
        return "주일 설교 글쓰기";
      case "daldal":
        return "달달바이블 글쓰기";
      case "news":
        return "교회 소식 글쓰기";
      case "schedule":
        return "교회 일정 등록";
      case "bulletin":
        return "주보 등록";
      case "gallery":
        return "갤러리 사진 · 영상 등록";
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setDate(defaultDate || today);
          setOpen(true);
        }}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs sm:text-sm font-semibold shadow-2xs transition-colors cursor-pointer"
      >
        <PenLine size={14} />
        <span>{buttonLabel}</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200/80 max-h-[90vh] overflow-y-auto text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900">{getModalTitle()}</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {menuType === "gallery" && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    소속 분류
                  </label>
                  <select
                    value={galleryDept}
                    onChange={(e) => setGalleryDept(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:border-amber-600"
                  >
                    <option value="전체">전체 사진첩</option>
                    <option value="영상">영상 (동영상 전용)</option>
                    <option value="남선교회">남선교회</option>
                    <option value="여전도회">여전도회</option>
                    <option value="학생부">학생부</option>
                    <option value="찬양단">찬양팀(부따겸 찬양단)</option>
                  </select>
                </div>
              )}

              {(menuType === "news" || menuType === "schedule") && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    분류
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:border-amber-600"
                  >
                    {menuType === "news" ? (
                      <>
                        <option value="공지">공지</option>
                        <option value="모임">모임</option>
                        <option value="예배">예배</option>
                        <option value="소식">소식</option>
                      </>
                    ) : (
                      <>
                        <option value="행사">행사</option>
                        <option value="예배">예배</option>
                        <option value="집회">집회</option>
                        <option value="모임">모임</option>
                        <option value="일반">일반</option>
                      </>
                    )}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력해 주세요"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  날짜
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:border-amber-600"
                />
              </div>

              {menuType === "sermon" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                        성경 본문
                      </label>
                      <input
                        type="text"
                        value={passage}
                        onChange={(e) => setPassage(e.target.value)}
                        placeholder="예: 요한복음 3:16"
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:border-amber-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                        설교자
                      </label>
                      <input
                        type="text"
                        value={preacher}
                        onChange={(e) => setPreacher(e.target.value)}
                        placeholder="담임목사"
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:border-amber-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      유튜브 영상 링크
                    </label>
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://youtu.be/..."
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </>
              )}

              {menuType === "schedule" && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    장소
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="본관 2층 대예배실"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:border-amber-600"
                  />
                </div>
              )}

              {(menuType === "news" || menuType === "schedule") && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    상세 내용
                  </label>
                  <textarea
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="내용을 입력해 주세요"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:border-amber-600 resize-y"
                  />
                </div>
              )}

              {(menuType === "daldal" || menuType === "bulletin" || menuType === "gallery") && (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-stone-700">
                        {menuType === "bulletin"
                          ? "주보 파일 첨부 (PDF 또는 이미지)"
                          : menuType === "gallery"
                          ? galleryDept === "영상"
                            ? "동영상 첨부 (스마트폰 영상 · PC 영상 파일)"
                            : "사진 · 짧은 동영상 첨부 (여러 개 선택 가능)"
                          : "사진 · 이미지 파일 첨부 (자동 최적화)"}
                      </label>
                      {menuType === "gallery" && galleryFiles.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setGalleryFiles([])}
                          className="text-[11px] text-stone-400 hover:text-red-500 underline cursor-pointer"
                        >
                          전체 취소
                        </button>
                      )}
                    </div>

                    {menuType === "gallery" && galleryFiles.length > 0 ? (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2.5 bg-stone-50 rounded-xl border border-amber-200">
                          {galleryFiles.map((f, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-xs text-stone-700 shadow-2xs"
                            >
                              <span className="truncate max-w-[130px] font-medium">{f.name}</span>
                              <span className="text-[10px] text-stone-400">
                                ({(f.size / 1024 / 1024).toFixed(1)}MB)
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setGalleryFiles((prev) => prev.filter((_, idx) => idx !== i))
                                }
                                className="text-stone-400 hover:text-red-600 font-bold ml-1 cursor-pointer"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        <label className="inline-flex items-center gap-1.5 text-xs text-amber-800 font-medium cursor-pointer hover:underline">
                          <Upload size={13} />
                          <span>
                            {galleryDept === "영상"
                              ? "동영상 더 추가하기..."
                              : "사진 · 동영상 더 추가하기..."}
                          </span>
                          <input
                            type="file"
                            accept={
                              menuType === "gallery"
                                ? galleryDept === "영상"
                                  ? "video/*,.mp4,.mov,.webm,.m4v,.ogg"
                                  : "image/*,video/*"
                                : "image/*"
                            }
                            multiple
                            onChange={(e) => {
                              const selected = Array.from(e.target.files || []);
                              if (selected.length > 0) {
                                handleAppendGalleryFiles(selected);
                              }
                              e.target.value = "";
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-dashed border-amber-300 bg-amber-50/40 hover:bg-amber-50 text-amber-900 text-xs sm:text-sm font-medium cursor-pointer transition-colors">
                        <Upload size={16} className="text-amber-700" />
                        <span className="truncate">
                          {menuType === "gallery"
                            ? galleryDept === "영상"
                              ? "스마트폰 · PC에서 동영상 파일 선택하기 (여러 개 가능)"
                              : "스마트폰 · PC에서 사진 · 동영상 선택하기 (여러 개 가능)"
                            : file
                            ? file.name
                            : "스마트폰 · PC에서 파일 선택하기"}
                        </span>
                        <input
                          type="file"
                          accept={
                            menuType === "bulletin"
                              ? ".pdf,image/*"
                              : menuType === "gallery"
                              ? galleryDept === "영상"
                                ? "video/*,.mp4,.mov,.webm,.m4v,.ogg"
                                : "image/*,video/*"
                              : "image/*"
                          }
                          multiple={menuType === "gallery"}
                          onChange={(e) => {
                            if (menuType === "gallery") {
                              const selected = Array.from(e.target.files || []);
                              handleAppendGalleryFiles(selected);
                              e.target.value = "";
                            } else {
                              setFile(e.target.files?.[0] || null);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      또는 외부 링크 직접 입력 {menuType === "gallery" && "(유튜브 링크 가능)"}
                    </label>
                    <input
                      type="url"
                      value={externalUrl}
                      onChange={(e) => setExternalUrl(e.target.value)}
                      placeholder={
                        menuType === "gallery"
                          ? "이미지 주소 또는 유튜브 영상 주소 (선택)"
                          : "파일/이미지 URL 주소 (선택)"
                      }
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </>
              )}

              {uploadProgress && (
                <div className="text-xs text-amber-900 bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center gap-2">
                  <Loader2 size={15} className="animate-spin text-amber-700 shrink-0" />
                  <span className="font-medium">{uploadProgress}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 disabled:opacity-60 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  <span>{submitting ? "처리 중..." : "등록하기"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

interface EditProps {
  menuType: MenuType;
  item: {
    id: string;
    pageId?: string;
    title?: string;
    date?: string;
    passage?: string;
    preacher?: string;
    videoUrl?: string;
    type?: string;
    location?: string;
    content?: string;
    imageUrl?: string;
    fileUrl?: string;
  };
}

export function MasterEditButton({ menuType, item }: EditProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const targetId = item.pageId || item.id;
  const today = new Date().toISOString().split("T")[0];

  const [title, setTitle] = useState(item.title || "");
  const [date, setDate] = useState(
    item.date && item.date !== "-" && item.date !== "날짜 없음" && item.date !== "날짜 미정"
      ? item.date
      : today
  );
  const [passage, setPassage] = useState(item.passage && item.passage !== "-" ? item.passage : "");
  const [preacher, setPreacher] = useState(
    item.preacher && item.preacher !== "-" ? item.preacher : "담임목사"
  );
  const [videoUrl, setVideoUrl] = useState(item.videoUrl || "");
  const [type, setType] = useState(item.type || (menuType === "schedule" ? "행사" : "공지"));
  const [location, setLocation] = useState(item.location && item.location !== "-" ? item.location : "");
  const [content, setContent] = useState(item.content || "");
  const [externalUrl, setExternalUrl] = useState(
    (item.imageUrl && !item.imageUrl.includes("amazonaws.com") ? item.imageUrl : "") ||
      (item.fileUrl && item.fileUrl !== "#" && !item.fileUrl.includes("amazonaws.com")
        ? item.fileUrl
        : "")
  );
  const [file, setFile] = useState<File | null>(null);
  const [editProgress, setEditProgress] = useState("");

  if (!targetId || targetId === "empty" || targetId.startsWith("dummy-")) return null;

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setTitle(item.title || "");
    setDate(
      item.date && item.date !== "-" && item.date !== "날짜 없음" && item.date !== "날짜 미정"
        ? item.date
        : today
    );
    setPassage(item.passage && item.passage !== "-" ? item.passage : "");
    setPreacher(item.preacher && item.preacher !== "-" ? item.preacher : "담임목사");
    setVideoUrl(item.videoUrl || "");
    setType(item.type || (menuType === "schedule" ? "행사" : "공지"));
    setLocation(item.location && item.location !== "-" ? item.location : "");
    setContent(item.content || "");
    setFile(null);
    setError("");
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError("");

    if (!title.trim()) {
      setError("제목을 입력해 주세요.");
      return;
    }

    setSubmitting(true);
    setEditProgress("");
    try {
      let uploadedFileId: string | undefined;
      let uploadedFileName: string | undefined;

      if (file && (menuType === "daldal" || menuType === "bulletin" || menuType === "gallery")) {
        setEditProgress("사진 용량 최적화 중...");
        const compressed = await compressImage(file, 1920, 1920, 0.82);
        setEditProgress("서버로 파일 업로드 중...");

        const fileFormData = new FormData();
        fileFormData.append("file", compressed);

        const upRes = await fetch("/api/content/upload", {
          method: "POST",
          body: fileFormData,
        });

        let upData: any = {};
        try {
          upData = await upRes.json();
        } catch {
          const errText = await upRes.text().catch(() => "");
          throw new Error(`파일 전송 실패 (${upRes.status}): ${errText.slice(0, 80)}`);
        }

        if (!upRes.ok || !upData.fileUploadId) {
          throw new Error(upData.error || `${file.name} 업로드에 실패했습니다.`);
        }

        uploadedFileId = upData.fileUploadId;
        uploadedFileName = upData.fileName || file.name;
      }

      setEditProgress("수정 사항 저장 중...");

      const payloadBody = {
        menuType,
        id: targetId,
        title: title.trim(),
        date,
        passage,
        preacher,
        videoUrl,
        type,
        location,
        content,
        imageUrl: externalUrl.trim(),
        fileUrl: externalUrl.trim(),
        fileUploadId: uploadedFileId,
        fileName: uploadedFileName,
      };

      const res = await fetch("/api/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadBody),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        const errText = await res.text().catch(() => "");
        throw new Error(`게시글 수정 실패 (${res.status}): ${errText.slice(0, 80)}`);
      }

      if (!res.ok) {
        throw new Error(data.error || "수정에 실패했습니다.");
      }

      setOpen(false);
      router.refresh();
    } catch (err: any) {
      console.error("Edit error:", err);
      const msg = err?.message || (typeof err === "string" ? err : "");
      setError(msg || "수정 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
      setEditProgress("");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        title="게시물 수정"
        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-stone-100 hover:bg-amber-50 text-stone-600 hover:text-amber-800 border border-stone-200/80 hover:border-amber-300 text-[11px] font-semibold transition-colors cursor-pointer shrink-0"
      >
        <Pencil size={11} />
        <span>수정</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
          }}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200/80 max-h-[90vh] overflow-y-auto text-left cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900">게시물 수정</h3>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                }}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {(menuType === "news" || menuType === "schedule") && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    분류
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:border-amber-600"
                  >
                    {menuType === "news" ? (
                      <>
                        <option value="공지">공지</option>
                        <option value="모임">모임</option>
                        <option value="예배">예배</option>
                        <option value="소식">소식</option>
                      </>
                    ) : (
                      <>
                        <option value="행사">행사</option>
                        <option value="예배">예배</option>
                        <option value="집회">집회</option>
                        <option value="모임">모임</option>
                        <option value="일반">일반</option>
                      </>
                    )}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력해 주세요"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  날짜
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:border-amber-600"
                />
              </div>

              {menuType === "sermon" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                        성경 본문
                      </label>
                      <input
                        type="text"
                        value={passage}
                        onChange={(e) => setPassage(e.target.value)}
                        placeholder="예: 요한복음 3:16"
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:border-amber-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                        설교자
                      </label>
                      <input
                        type="text"
                        value={preacher}
                        onChange={(e) => setPreacher(e.target.value)}
                        placeholder="담임목사"
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:border-amber-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      유튜브 영상 링크
                    </label>
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://youtu.be/..."
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </>
              )}

              {menuType === "schedule" && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    장소
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="본관 2층 대예배실"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:border-amber-600"
                  />
                </div>
              )}

              {(menuType === "news" || menuType === "schedule") && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    상세 내용
                  </label>
                  <textarea
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="내용을 입력해 주세요"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:border-amber-600 resize-y"
                  />
                </div>
              )}

              {(menuType === "daldal" || menuType === "bulletin" || menuType === "gallery") && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      {menuType === "bulletin"
                        ? "새 주보 파일로 교체 (변경 시에만 선택)"
                        : "새 사진 · 이미지 파일로 교체 (변경 시에만 선택)"}
                    </label>
                    <label className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-dashed border-amber-300 bg-amber-50/40 hover:bg-amber-50 text-amber-900 text-xs sm:text-sm font-medium cursor-pointer transition-colors">
                      <Upload size={16} className="text-amber-700" />
                      <span className="truncate">
                        {file ? file.name : "파일 변경 시 선택 (기존 파일 유지 시 비워두세요)"}
                      </span>
                      <input
                        type="file"
                        accept={menuType === "bulletin" ? ".pdf,image/*" : "image/*"}
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      또는 외부 링크 변경 {menuType === "gallery" && "(유튜브 링크 가능)"}
                    </label>
                    <input
                      type="url"
                      value={externalUrl}
                      onChange={(e) => setExternalUrl(e.target.value)}
                      placeholder="변경할 URL이 있을 경우 입력 (선택)"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </>
              )}

              {editProgress && (
                <div className="text-xs text-amber-900 bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center gap-2">
                  <Loader2 size={15} className="animate-spin text-amber-700 shrink-0" />
                  <span className="font-medium">{editProgress}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(false);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 disabled:opacity-60 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  <span>{submitting ? "처리 중..." : "수정 저장"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export function MasterDeleteButton({
  id,
  label = "삭제",
  confirmMessage,
  deleteFullPage = false,
}: {
  id: string;
  label?: string;
  confirmMessage?: string;
  deleteFullPage?: boolean;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!id || id === "empty" || id.startsWith("dummy-")) return null;

  const handleConfirmDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirmMessage) {
      const ok = window.confirm(confirmMessage);
      if (!ok) return;
    }

    setDeleting(true);
    try {
      const res = await fetch("/api/content", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, pageId: id, deleteFullPage }),
      });
      if (res.ok) {
        setConfirming(false);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "삭제에 실패했습니다.");
      }
    } catch {
      alert("서버 통신 중 오류가 발생했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  if (confirming) {
    return (
      <div
        className="inline-flex items-center gap-1 bg-red-50 border border-red-200 px-2 py-0.5 rounded-lg shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-[11px] text-red-700 font-semibold">삭제?</span>
        <button
          type="button"
          disabled={deleting}
          onClick={handleConfirmDelete}
          className="px-1.5 py-0.5 rounded bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold cursor-pointer"
        >
          {deleting ? "..." : "확인"}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setConfirming(false);
          }}
          className="px-1.5 py-0.5 rounded bg-white border border-stone-200 text-stone-600 text-[10px] font-semibold cursor-pointer"
        >
          취소
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirmMessage) {
          handleConfirmDelete(e);
        } else {
          setConfirming(true);
        }
      }}
      title="게시물 삭제"
      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/80 text-[11px] font-semibold transition-colors cursor-pointer shrink-0"
    >
      <Trash2 size={11} />
      <span>{label}</span>
    </button>
  );
}
