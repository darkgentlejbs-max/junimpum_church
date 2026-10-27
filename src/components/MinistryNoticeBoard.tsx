"use client";

import { useState } from "react";
import Link from "next/link";
import { Megaphone, Plus, ChevronDown, PenLine, Loader2, X } from "lucide-react";

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

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("전체");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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
        setError(data.error || "공지 등록에 실패했습니다.");
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
              사역 · 기관 공지사항 게시판
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
            <span>{isWriting ? "작성 닫기" : "공지 글쓰기"}</span>
          </button>
        ) : (
          <Link
            href="/login?redirect=/ministries#board"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-amber-50 text-stone-700 hover:text-amber-800 border border-stone-200/80 text-xs sm:text-sm font-semibold transition-colors"
          >
            <Plus size={15} />
            <span>공지 글쓰기 (로그인)</span>
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
              새 공지사항 작성 ({currentUser.name} {currentUser.role}님)
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
                공지 제목
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="공지사항 제목을 입력해 주세요"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-800 text-sm focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">
              공지 내용
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="상세 공지 내용이나 모임 안내를 작성해 주세요"
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
          <p className="text-sm text-stone-500">등록된 공지사항이 없습니다.</p>
          <p className="text-xs text-stone-400 mt-1">
            우측 상단의 &lsquo;공지 글쓰기&rsquo; 버튼 또는 노션에서 새 공지사항을 등록하실 수 있습니다.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-stone-100 border-t border-stone-100">
          {filteredNotices.map((notice) => {
            const isOpen = expandedId === notice.id;
            return (
              <li key={notice.id} className="py-3.5">
                <button
                  type="button"
                  onClick={() => setExpandedId(isOpen ? null : notice.id)}
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
                  <div className="mt-3 p-4 rounded-2xl bg-stone-50/80 border border-stone-200/60 text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">
                    <div className="flex items-center justify-between text-[11px] text-stone-400 mb-2 pb-2 border-b border-stone-200/60">
                      <span>작성자: {notice.author}</span>
                      <span>작성일: {notice.date}</span>
                    </div>
                    {notice.content || "상세 내용이 없습니다."}
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
