"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin, Video, Clock, Pencil, X, Loader2 } from "lucide-react";

const DEFAULT_HOME = {
  badgeText: "대한예수교장로회(통합) 주님품교회",
  imageCaptionLeft: "대한예수교장로회(통합)",
  imageCaptionRight: "주님품교회 전경",
  headlineLine1: "믿음 · 소망 · 사랑으로",
  headlineLine2: "세워 가는 주님품 공동체",
  subtitle:
    "하나님의 은혜와 사랑이 머무는 곳,\n주님품처럼 따뜻한 안식과 회복이 있는\n주님품교회에 오신 것을 진심으로 환영합니다.",
  navItems: [
    {
      no: "01",
      title: "교회 소개",
      desc: "비전, 담임목사 인사말, 예배 시간 및 오시는 길",
      href: "/about",
    },
    {
      no: "02",
      title: "예배 · 말씀",
      desc: "주일 대예배 설교 영상 및 온라인 예배",
      href: "/sermons",
    },
    {
      no: "03",
      title: "사역 · 기관",
      desc: "교회학교, 찬양대, 선교회 및 봉사 부서",
      href: "/ministries",
    },
    {
      no: "04",
      title: "소식 · 일정",
      desc: "교회 소식, 교회 일정, 주보 다운로드",
      href: "/news",
    },
  ],
  cards: {
    worshipTitle: "예배 시간 안내",
    worshipDesc:
      "주일 대예배(오전 11시), 수요예배, 금요 다함께 기도회, 새벽기도회 안내입니다.",
    sermonTitle: "말씀 영상",
    sermonDesc: "주일 예배 설교와 은혜로운 찬양 영상을 온라인으로 나눕니다.",
    locationTitle: "오시는 길",
    locationAddress: "전남 여수시 여서동 7길 28",
    locationSub: "대한예수교장로회(통합) 주님품교회",
  },
};

export default function Home() {
  const [homeData, setHomeData] = useState(DEFAULT_HOME);
  const [canEdit, setCanEdit] = useState(false);
  const [editModal, setEditModal] = useState<"hero" | "cards" | null>(null);
  const [formState, setFormState] = useState(DEFAULT_HOME);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/site-config", { cache: "no-store" })
      .then((r) => r.json())
      .then((res) => {
        if (res?.config?.home) {
          let loadedSubtitle = res.config.home.subtitle || DEFAULT_HOME.subtitle;
          if (
            loadedSubtitle ===
              "하나님의 은혜와 사랑이 머무는 곳, 주님품처럼 따뜻한 안식과 회복이 있는 주님품교회에 오신 것을 진심으로 환영합니다." ||
            loadedSubtitle ===
              "하나님의 은혜와 사랑이 머무는 곳,\n주님품처럼 따뜻한 안식과 회복이 있는 주님품교회에 오신 것을\n진심으로 환영합니다." ||
            loadedSubtitle ===
              "하나님의 은혜와 사랑이 머무는 곳,\n주님품처럼 따뜻한 안식과 회복이 있는\n주님품교회에 오신 것을\n진심으로 환영합니다."
          ) {
            loadedSubtitle = DEFAULT_HOME.subtitle;
          }
          let loadedHeadline2 =
            res.config.home.headlineLine2 || DEFAULT_HOME.headlineLine2;
          if (
            loadedHeadline2 === "세워져 가는 따뜻한 공동체" ||
            loadedHeadline2 === "세워 가는 따뜻한 공동체"
          ) {
            loadedHeadline2 = "세워 가는 주님품 공동체";
          }
          const merged = {
            ...DEFAULT_HOME,
            ...res.config.home,
            headlineLine2: loadedHeadline2,
            subtitle: loadedSubtitle,
            cards: { ...DEFAULT_HOME.cards, ...(res.config.home.cards || {}) },
            navItems:
              Array.isArray(res.config.home.navItems) && res.config.home.navItems.length > 0
                ? res.config.home.navItems
                : DEFAULT_HOME.navItems,
          };
          setHomeData(merged);
          setFormState(merged);
        }
      })
      .catch(() => {});

    const checkUser = () => {
      fetch("/api/auth/me", { cache: "no-store" })
        .then((r) => r.json())
        .then((res) => {
          const u = res?.user;
          if (u && (u.isMaster || u.role === "담임목사" || u.role === "사모" || u.role === "교역자")) {
            setCanEdit(true);
          } else {
            setCanEdit(false);
          }
        })
        .catch(() => {});
    };
    checkUser();
    window.addEventListener("auth-change", checkUser);
    return () => window.removeEventListener("auth-change", checkUser);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "home", data: formState }),
      });
      const json = await res.json();
      if (res.ok && json.data) {
        setHomeData(formState);
        setEditModal(null);
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
    <div className="bg-[#FAF9F6] text-stone-800">
      {/* Hero Section - Split Layout */}
      <section className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14 items-center">
          {/* Left: Church Image Showcase */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative w-full bg-white p-2 sm:p-4 rounded-2xl sm:rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.05)] border border-stone-200/80"
            >
              <div className="relative w-full aspect-[4/5] sm:aspect-auto sm:h-[420px] lg:h-[540px] rounded-xl sm:rounded-2xl overflow-hidden bg-stone-50/80 flex items-center justify-center">
                <Image
                  src="/images/church-exterior.jpg"
                  alt="주님품교회 전경"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover sm:object-contain object-center"
                  priority
                />
              </div>

              <div className="flex items-center justify-between px-2 sm:px-3 pt-2.5 pb-0.5 text-[11px] text-stone-400 font-medium">
                <span>{homeData.imageCaptionLeft}</span>
                <span>{homeData.imageCaptionRight}</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Refined Headline & Sleek Editorial Navigation Bar */}
          <div className="lg:col-span-6 px-1 sm:px-0">
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center justify-between gap-2 mb-5 flex-wrap">
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-sm sm:text-base font-semibold shadow-2xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/pck-logo.png"
                    alt="대한예수교장로회(통합)"
                    className="h-6 sm:h-7 w-auto object-contain shrink-0"
                  />
                  <span>{homeData.badgeText}</span>
                </div>
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormState(homeData);
                      setEditModal("hero");
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-amber-50 text-stone-600 hover:text-amber-800 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Pencil size={12} />
                    <span>메인 문구/메뉴 수정</span>
                  </button>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight leading-snug mb-3">
                {homeData.headlineLine1}
                <br />
                <span className="text-amber-800 font-medium">{homeData.headlineLine2}</span>
              </h1>

              <p className="text-stone-500 text-sm font-normal leading-relaxed mb-8 max-w-lg whitespace-pre-line break-keep">
                {homeData.subtitle
                  .split(/(주님품교회|환영합니다)/g)
                  .map((part, idx) =>
                    part === "주님품교회" || part === "환영합니다" ? (
                      <strong
                        key={idx}
                        className="text-base sm:text-lg font-semibold text-stone-600"
                      >
                        {part}
                      </strong>
                    ) : (
                      part
                    )
                  )}
              </p>

              {/* Right Navigation Bar */}
              <div className="border-t border-stone-200/80 divide-y divide-stone-200/70">
                {homeData.navItems.map((item) => (
                  <Link
                    key={item.no}
                    href={item.href}
                    className="group flex items-center justify-between py-4 px-2 -mx-2 rounded-xl transition-all duration-200 hover:bg-white hover:shadow-xs"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-xs font-mono font-semibold text-amber-700/70 pt-0.5">
                        {item.no}
                      </span>
                      <div>
                        <h2 className="text-base font-medium text-stone-800 group-hover:text-amber-800 transition-colors">
                          {item.title}
                        </h2>
                        <p className="text-xs text-stone-400 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center border border-stone-200 text-stone-400 group-hover:border-amber-600 group-hover:text-amber-700 group-hover:bg-amber-50/50 transition-all">
                      <ArrowUpRight size={15} />
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Info Section: Worship & Location */}
      <section className="border-t border-stone-200/60 bg-white py-8 sm:py-16">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          {canEdit && (
            <div className="flex justify-end mb-3">
              <button
                type="button"
                onClick={() => {
                  setFormState(homeData);
                  setEditModal("cards");
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-amber-50 text-stone-600 hover:text-amber-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Pencil size={12} />
                <span>하단 안내 카드 수정</span>
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Card 1: Worship Times */}
            <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-stone-200/70 hover:border-amber-300/80 transition-all">
              <div className="w-9 h-9 rounded-xl bg-[#F1731C] text-white shadow-2xs flex items-center justify-center mb-4">
                <Clock size={18} />
              </div>
              <h3 className="text-sm font-semibold text-stone-900 mb-1.5">
                {homeData.cards.worshipTitle}
              </h3>
              <p className="text-xs text-stone-500 mb-4 leading-relaxed">
                {homeData.cards.worshipDesc}
              </p>
              <Link
                href="/about#worship-times"
                className="text-xs font-medium text-amber-800 hover:text-amber-900 inline-flex items-center gap-1"
              >
                시간표 보기 &rarr;
              </Link>
            </div>

            {/* Card 2: Sermons */}
            <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-stone-200/70 hover:border-amber-300/80 transition-all">
              <div className="w-9 h-9 rounded-xl bg-[#F7B118] text-white shadow-2xs flex items-center justify-center mb-4">
                <Video size={18} />
              </div>
              <h3 className="text-sm font-semibold text-stone-900 mb-1.5">
                {homeData.cards.sermonTitle}
              </h3>
              <p className="text-xs text-stone-500 mb-4 leading-relaxed">
                {homeData.cards.sermonDesc}
              </p>
              <Link
                href="/sermons"
                className="text-xs font-medium text-amber-800 hover:text-amber-900 inline-flex items-center gap-1"
              >
                설교 시청하기 &rarr;
              </Link>
            </div>

            {/* Card 3: Location */}
            <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-stone-200/70 hover:border-amber-300/80 transition-all flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-[#F1731C] text-white shadow-2xs flex items-center justify-center mb-4">
                  <MapPin size={18} />
                </div>
                <h3 className="text-sm font-semibold text-stone-900 mb-1.5">
                  {homeData.cards.locationTitle}
                </h3>
                <p className="text-xs text-stone-700 font-medium mb-1">
                  {homeData.cards.locationAddress}
                </p>
                <p className="text-xs text-stone-400 mb-4 leading-relaxed">
                  {homeData.cards.locationSub}
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-stone-200/60 text-xs">
                <Link
                  href="/about#location"
                  className="font-medium text-amber-800 hover:text-amber-900 inline-flex items-center gap-1"
                >
                  지도 및 길찾기 &rarr;
                </Link>
                <div className="flex gap-1.5">
                  <a
                    href={`https://map.kakao.com/link/search/${encodeURIComponent(
                      homeData.cards.locationAddress
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-0.5 rounded bg-[#FEE500] text-[#191919] font-semibold text-[10px]"
                  >
                    카카오
                  </a>
                  <a
                    href={`https://map.naver.com/v5/search/${encodeURIComponent(
                      homeData.cards.locationAddress
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-0.5 rounded bg-[#03C75A] text-white font-semibold text-[10px]"
                  >
                    네이버
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Edit Modal */}
      {editModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
          onClick={() => setEditModal(null)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200/80 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900">
                {editModal === "hero" ? "메인 화면 문구 및 메뉴 수정" : "하단 안내 카드 수정"}
              </h3>
              <button
                type="button"
                onClick={() => setEditModal(null)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {editModal === "hero" ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">
                      상단 배지 문구
                    </label>
                    <input
                      type="text"
                      value={formState.badgeText}
                      onChange={(e) =>
                        setFormState({ ...formState, badgeText: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-amber-600"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">
                        메인 타이틀 (첫째 줄)
                      </label>
                      <input
                        type="text"
                        value={formState.headlineLine1}
                        onChange={(e) =>
                          setFormState({ ...formState, headlineLine1: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-amber-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">
                        메인 타이틀 (둘째 줄 강조)
                      </label>
                      <input
                        type="text"
                        value={formState.headlineLine2}
                        onChange={(e) =>
                          setFormState({ ...formState, headlineLine2: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-amber-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">
                      환영 인사말
                    </label>
                    <textarea
                      rows={3}
                      value={formState.subtitle}
                      onChange={(e) =>
                        setFormState({ ...formState, subtitle: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-amber-600"
                    />
                  </div>
                  <div className="pt-2 border-t border-stone-100 space-y-3">
                    <p className="text-xs font-bold text-stone-700">메인 메뉴 항목 (01 ~ 04)</p>
                    {formState.navItems.map((item, idx) => (
                      <div
                        key={item.no}
                        className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-amber-800">
                            {item.no}
                          </span>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const next = [...formState.navItems];
                              next[idx] = { ...next[idx], title: e.target.value };
                              setFormState({ ...formState, navItems: next });
                            }}
                            className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-semibold"
                            placeholder="메뉴 제목"
                          />
                        </div>
                        <input
                          type="text"
                          value={item.desc}
                          onChange={(e) => {
                            const next = [...formState.navItems];
                            next[idx] = { ...next[idx], desc: e.target.value };
                            setFormState({ ...formState, navItems: next });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs"
                          placeholder="메뉴 설명"
                        />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2">
                    <p className="text-xs font-bold text-amber-800">카드 1: 예배 시간 안내</p>
                    <input
                      type="text"
                      value={formState.cards.worshipTitle}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          cards: { ...formState.cards, worshipTitle: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-semibold"
                    />
                    <textarea
                      rows={2}
                      value={formState.cards.worshipDesc}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          cards: { ...formState.cards, worshipDesc: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs"
                    />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2">
                    <p className="text-xs font-bold text-amber-800">카드 2: 말씀 영상</p>
                    <input
                      type="text"
                      value={formState.cards.sermonTitle}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          cards: { ...formState.cards, sermonTitle: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-semibold"
                    />
                    <textarea
                      rows={2}
                      value={formState.cards.sermonDesc}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          cards: { ...formState.cards, sermonDesc: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs"
                    />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2">
                    <p className="text-xs font-bold text-amber-800">카드 3: 오시는 길</p>
                    <input
                      type="text"
                      value={formState.cards.locationTitle}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          cards: { ...formState.cards, locationTitle: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-semibold"
                      placeholder="카드 제목"
                    />
                    <input
                      type="text"
                      value={formState.cards.locationAddress}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          cards: { ...formState.cards, locationAddress: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs"
                      placeholder="주소"
                    />
                    <input
                      type="text"
                      value={formState.cards.locationSub}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          cards: { ...formState.cards, locationSub: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs"
                      placeholder="교회명"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditModal(null)}
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
    </div>
  );
}
