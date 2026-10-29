"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, X, Loader2 } from "lucide-react";

export interface MinistriesConfig {
  pageTitle: string;
  pageSubtitle: string;
  fellowshipsTitle: string;
  fellowshipsDesc: string;
  menTitle: string;
  womenTitle: string;
  schoolTitle: string;
  schoolDesc: string;
  schoolSubTitle: string;
  schoolTimePlace: string;
  worshipTitle: string;
  worshipDesc: string;
}

export default function MinistriesEditModal({
  initialConfig,
}: {
  initialConfig: MinistriesConfig;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<MinistriesConfig>(initialConfig);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "ministries", data: form }),
      });
      const json = await res.json();
      if (res.ok) {
        setOpen(false);
        router.refresh();
      } else {
        alert(json.error || "저장에 실패했습니다.");
      }
    } catch {
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setForm(initialConfig);
          setOpen(true);
        }}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs sm:text-sm font-semibold shadow-2xs transition-colors cursor-pointer"
      >
        <Pencil size={13} />
        <span>사역·기관 소개 문구 수정</span>
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
              <h3 className="text-lg font-bold text-stone-900">
                사역 및 기관 소개 문구 수정
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2">
                <p className="text-xs font-bold text-amber-800">1. 기관 (남선교회 · 여전도회)</p>
                <input
                  type="text"
                  value={form.fellowshipsTitle}
                  onChange={(e) =>
                    setForm({ ...form, fellowshipsTitle: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-semibold"
                  placeholder="섹션 제목 (예: 기관)"
                />
                <textarea
                  rows={2}
                  value={form.fellowshipsDesc}
                  onChange={(e) =>
                    setForm({ ...form, fellowshipsDesc: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs"
                  placeholder="기관 소개 설명"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={form.menTitle}
                    onChange={(e) => setForm({ ...form, menTitle: e.target.value })}
                    className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-semibold"
                    placeholder="남선교회 명칭"
                  />
                  <input
                    type="text"
                    value={form.womenTitle}
                    onChange={(e) => setForm({ ...form, womenTitle: e.target.value })}
                    className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-semibold"
                    placeholder="여전도회 명칭"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2">
                <p className="text-xs font-bold text-amber-800">2. 교회학교</p>
                <input
                  type="text"
                  value={form.schoolTitle}
                  onChange={(e) => setForm({ ...form, schoolTitle: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-semibold"
                  placeholder="교회학교 제목"
                />
                <textarea
                  rows={3}
                  value={form.schoolDesc}
                  onChange={(e) => setForm({ ...form, schoolDesc: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs"
                  placeholder="교회학교 소개 설명"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={form.schoolSubTitle}
                    onChange={(e) =>
                      setForm({ ...form, schoolSubTitle: e.target.value })
                    }
                    className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-semibold"
                    placeholder="부서명 (예: 학생부)"
                  />
                  <input
                    type="text"
                    value={form.schoolTimePlace}
                    onChange={(e) =>
                      setForm({ ...form, schoolTimePlace: e.target.value })
                    }
                    className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs"
                    placeholder="예배 시간 및 장소"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2">
                <p className="text-xs font-bold text-amber-800">3. 찬양팀</p>
                <input
                  type="text"
                  value={form.worshipTitle}
                  onChange={(e) => setForm({ ...form, worshipTitle: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-semibold"
                  placeholder="찬양팀 명칭"
                />
                <textarea
                  rows={2}
                  value={form.worshipDesc}
                  onChange={(e) => setForm({ ...form, worshipDesc: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs"
                  placeholder="찬양팀 소개 설명"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 text-sm font-medium hover:bg-stone-50 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-sm font-semibold disabled:opacity-60 cursor-pointer"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  <span>저장하기</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
