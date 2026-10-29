"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PenLine, X, Loader2, Upload, Trash2 } from "lucide-react";

type MenuType = "sermon" | "daldal" | "news" | "schedule" | "bulletin" | "gallery";

interface Props {
  menuType: MenuType;
  buttonLabel?: string;
  defaultCategory?: string;
}

export default function MasterWriteButton({
  menuType,
  buttonLabel = "글쓰기",
  defaultCategory = "",
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(today);
  const [passage, setPassage] = useState("");
  const [preacher, setPreacher] = useState("담임목사");
  const [videoUrl, setVideoUrl] = useState("");
  const [type, setType] = useState(menuType === "schedule" ? "행사" : "공지");
  const [location, setLocation] = useState("본관 2층 대예배실");
  const [content, setContent] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [galleryDept, setGalleryDept] = useState(defaultCategory || "전체");
  const [file, setFile] = useState<File | null>(null);

  const resetForm = () => {
    setTitle("");
    setDate(today);
    setPassage("");
    setPreacher("담임목사");
    setVideoUrl("");
    setType(menuType === "schedule" ? "행사" : "공지");
    setLocation("본관 2층 대예배실");
    setContent("");
    setExternalUrl("");
    setFile(null);
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
    try {
      let finalTitle = title.trim();
      if (menuType === "gallery" && galleryDept && galleryDept !== "전체") {
        if (!finalTitle.includes(galleryDept)) {
          finalTitle = `[${galleryDept}] ${finalTitle}`;
        }
      }

      let res: Response;
      if (file && (menuType === "daldal" || menuType === "bulletin" || menuType === "gallery")) {
        const formData = new FormData();
        formData.append("menuType", menuType);
        formData.append("title", finalTitle);
        formData.append("date", date);
        formData.append("file", file);
        if (externalUrl.trim()) {
          formData.append("imageUrl", externalUrl.trim());
          formData.append("fileUrl", externalUrl.trim());
        }
        res = await fetch("/api/content", {
          method: "POST",
          body: formData,
        });
      } else {
        res = await fetch("/api/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
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
          }),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "등록에 실패했습니다.");
        setSubmitting(false);
        return;
      }

      resetForm();
      setOpen(false);
      router.refresh();
    } catch {
      setError("서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
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
        onClick={() => setOpen(true)}
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
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      {menuType === "bulletin" ? "주보 파일 첨부 (PDF 또는 이미지)" : "사진 · 이미지 파일 첨부"}
                    </label>
                    <label className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-dashed border-amber-300 bg-amber-50/40 hover:bg-amber-50 text-amber-900 text-xs sm:text-sm font-medium cursor-pointer transition-colors">
                      <Upload size={16} className="text-amber-700" />
                      <span className="truncate">
                        {file ? file.name : "스마트폰 · PC에서 파일 선택하기"}
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

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 disabled:opacity-60 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  <span>등록하기</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export function MasterDeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  if (!id || id === "empty" || id.startsWith("dummy-")) return null;

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("이 게시물을 삭제하시겠습니까?")) return;

    setDeleting(true);
    try {
      const res = await fetch("/api/content", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
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

  return (
    <button
      type="button"
      disabled={deleting}
      onClick={handleDelete}
      title="게시물 삭제"
      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/80 text-[11px] font-semibold transition-colors cursor-pointer shrink-0"
    >
      {deleting ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
      <span>삭제</span>
    </button>
  );
}
