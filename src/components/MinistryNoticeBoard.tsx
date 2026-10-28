"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Megaphone,
  Plus,
  ChevronDown,
  PenLine,
  Loader2,
  X,
  Pencil,
  Trash2,
  Check,
} from "lucide-react";

interface MinistryNotice {
  id: string;
  title: string;
  category: string;
  content: string;
  author: string;
  date: string;
}

interface Props {
  initialNotices: MinistryNotice[];
  currentUser: { name: string; role: string } | null;
}

const CATEGORIES = ["전체", "교회학교", "찬양팀", "남선교회", "여전도회"];

export default function MinistryNoticeBoard({ initialNotices, currentUser }: Props) {
  const [notices, setNotices] = useState<MinistryNotice[]>(initialNotices);
  const [activeCategory, setActiveCategory] = useState("전체");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isWriting, setIsWriting] = useState(false);

  // 새 글 작성 상태
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("전체");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // 글 수정/삭제 상태
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("전체");
  const [editContent, setEditContent] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredNotices =
    activeCategory === "전체"
      ? notices
      : notices.filter((n) => n.category === activeCategory);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 모두 입력해 주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/ministries/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, content }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "게시글 등록에 실패했습니다.");
        setSubmitting(false);
        return;
      }

      setNotices([data.notice, ...notices]);
      setTitle("");
      setContent("");
      setCategory("전체");
      setIsWriting(false);
      setExpandedId(data.notice.id);
    } catch {
      setError("서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (notice: MinistryNotice) => {
    setEditingId(notice.id);
    setEditTitle(notice.title);
    setEditCategory(notice.category || "전체");
    setEditContent(notice.content);
    setEditError("");
    setConfirmDeleteId(null);
  };

  const handleUpdate = async (id: string) => {
    setEditError("");
    if (!editTitle.trim() || !editContent.trim()) {
      setEditError("제목과 내용을 모두 입력해 주세요.");
      return;
    }

    setEditSubmitting(true);
    try {
      const res = await fetch("/api/ministries/notices", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          title: editTitle,
          category: editCategory,
          content: editContent,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setEditError(data.error || "게시글 수정에 실패했습니다.");
        setEditSubmitting(false);
        return;
      }

      setNotices((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                title: data.notice.title,
                category: data.notice.category,
                content: data.notice.content,
              }
            : item
        )
      );
      setEditingId(null);
    } catch {
      setEditError("서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setEditError("");
    try {
      const res = await fetch("/api/ministries/notices", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (!res.ok) {
        setEditError(data.error || "게시글 삭제에 실패했습니다.");
        setDeletingId(null);
        return;
      }

      setNotices((prev) => prev.filter((item) => item.id !== id));
      setConfirmDeleteId(null);
      setExpandedId(null);
    } catch {
      setEditError("서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section
      id="board"
      className="scroll-mt-24 bg-white p-5 sm:p-9 rounded-2xl sm:rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.03)] border border-stone-200/80"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-100/70 text-amber-800 flex items-center justify-center shrink-0">
            <Megaphone size={22} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-stone-900">
              게시판
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              교회학교, 찬양팀, 남선교회, 여전도회의 공지사항과 모임 소식을 나눕니다.
            </p>
          </div>
        </div>

        {currentUser ? (
          <button
            type="button"
            onClick={() => {
              setIsWriting(!isWriting);
              setError("");
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            {isWriting ? <X size={15} /> : <PenLine size={15} />}
            <span>{isWriting ? "작성 닫기" : "글쓰기"}</span>
          </button>
        ) : (
          <Link
            href="/login?redirect=/ministries#board"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-amber-50 text-stone-700 hover:text-amber-800 border border-stone-200/80 text-xs sm:text-sm font-semibold transition-colors"
          >
            <Plus size={15} />
            <span>글쓰기 (로그인)</span>
          </Link>
        )}
      </div>

      {/* Write Form */}
      {isWriting && currentUser && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 sm:p-6 rounded-2xl bg-[#FAF9F6] border border-amber-200/80 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-stone-900">
              새 게시글 작성 ({currentUser.name} {currentUser.role}님)
            </h3>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                부서 · 기관 분류
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-800 text-sm focus:outline-none focus:border-amber-600"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-3">
              <label className="block text-xs font-medium text-stone-600 mb-1">
                제목
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력해 주세요"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-800 text-sm focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">
              내용
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="상세 내용이나 모임 안내를 작성해 주세요"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-800 text-sm focus:outline-none focus:border-amber-600 resize-y"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsWriting(false)}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 disabled:opacity-60 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              <span>등록하기</span>
            </button>
          </div>
        </form>
      )}

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 mb-5">
        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                active
                  ? "bg-amber-800 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-amber-50 hover:text-amber-800"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Notices List */}
      {filteredNotices.length === 0 ? (
        <div className="text-center py-12 bg-stone-50/60 rounded-2xl border border-stone-100">
          <p className="text-sm text-stone-500">등록된 게시글이 없습니다.</p>
          <p className="text-xs text-stone-400 mt-1">
            우측 상단의 &lsquo;글쓰기&rsquo; 버튼으로 새 게시글을 등록하실 수 있습니다.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-stone-100 border-t border-stone-100">
          {filteredNotices.map((notice) => {
            const isOpen = expandedId === notice.id;
            const isEditing = editingId === notice.id;
            const isConfirmingDelete = confirmDeleteId === notice.id;
            const isDeleting = deletingId === notice.id;

            return (
              <li key={notice.id} className="py-3.5">
                <button
                  type="button"
                  onClick={() => {
                    if (isOpen) {
                      setExpandedId(null);
                      setEditingId(null);
                      setConfirmDeleteId(null);
                    } else {
                      setExpandedId(notice.id);
                    }
                  }}
                  className="w-full text-left flex items-center justify-between gap-3 group cursor-pointer"
                >
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200/70 text-amber-800 text-[11px] font-semibold shrink-0">
                      {notice.category}
                    </span>
                    <span className="text-sm sm:text-base font-medium text-stone-800 group-hover:text-amber-800 transition-colors break-keep">
                      {notice.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="hidden sm:inline text-xs text-stone-400">
                      {notice.author}
                    </span>
                    <span className="text-xs font-mono text-stone-400">
                      {notice.date}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-stone-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-amber-700" : ""
                      }`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-3 p-4 sm:p-5 rounded-2xl bg-stone-50/80 border border-stone-200/60 text-xs sm:text-sm text-stone-700 leading-relaxed">
                    {editError && (
                      <div className="mb-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                        {editError}
                      </div>
                    )}

                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-medium text-stone-500 mb-1">
                              부서 · 기관 분류
                            </label>
                            <select
                              value={editCategory}
                              onChange={(e) => setEditCategory(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-stone-800 text-xs sm:text-sm focus:outline-none focus:border-amber-600"
                            >
                              {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="sm:col-span-3">
                            <label className="block text-[11px] font-medium text-stone-500 mb-1">
                              제목
                            </label>
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-stone-800 text-xs sm:text-sm focus:outline-none focus:border-amber-600"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-stone-500 mb-1">
                            내용
                          </label>
                          <textarea
                            rows={4}
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-stone-800 text-xs sm:text-sm focus:outline-none focus:border-amber-600 resize-y"
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="px-3.5 py-1.5 rounded-xl bg-stone-200/70 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
                          >
                            취소
                          </button>
                          <button
                            type="button"
                            disabled={editSubmitting}
                            onClick={() => handleUpdate(notice.id)}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-900 disabled:opacity-60 text-white text-xs font-semibold transition-colors cursor-pointer"
                          >
                            {editSubmitting ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <Check size={13} />
                            )}
                            <span>수정 저장</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-400 mb-3 pb-2.5 border-b border-stone-200/60">
                          <div className="flex items-center gap-3">
                            <span>작성자: {notice.author}</span>
                            <span>작성일: {notice.date}</span>
                          </div>

                          {currentUser && (
                            <div className="flex items-center gap-1.5">
                              {isConfirmingDelete ? (
                                <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
                                  <span className="text-red-700 font-medium">
                                    삭제할까요?
                                  </span>
                                  <button
                                    type="button"
                                    disabled={isDeleting}
                                    onClick={() => handleDelete(notice.id)}
                                    className="px-2 py-0.5 rounded bg-red-600 hover:bg-red-700 text-white font-semibold cursor-pointer"
                                  >
                                    {isDeleting ? "삭제중..." : "확인"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteId(null)}
                                    className="px-2 py-0.5 rounded bg-white border border-stone-200 text-stone-600 hover:bg-stone-100 cursor-pointer"
                                  >
                                    취소
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => startEdit(notice)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-stone-200/80 text-stone-600 hover:text-amber-800 hover:border-amber-300 transition-colors cursor-pointer"
                                  >
                                    <Pencil size={12} />
                                    <span>수정</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteId(notice.id)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-stone-200/80 text-stone-500 hover:text-red-600 hover:border-red-200 transition-colors cursor-pointer"
                                  >
                                    <Trash2 size={12} />
                                    <span>삭제</span>
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="whitespace-pre-wrap">
                          {notice.content || "상세 내용이 없습니다."}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
