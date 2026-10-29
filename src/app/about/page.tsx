"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  Copy,
  Check,
  Navigation,
  ExternalLink,
  History,
  Pencil,
  Plus,
  Trash2,
  X,
  Loader2,
} from "lucide-react";

const DEFAULT_ABOUT = {
  pageTitle: "교회 소개",
  pageSubtitle: "대한예수교장로회(통합) 주님품교회를 소개합니다",
  greeting: {
    sectionTitle: "목회자 인사말",
    headline: "“평안하시지요?”",
    bodyText: `주님품교회를 방문해 주신 당신에게
하나님의 크신 은혜와 평강이 임하기를 축복합니다.

교회의 궁극적인 목적은
‘하나님이 원하시고, 기뻐하시는 교회를 이루어 가는 것’이며,
그 중심에는 ‘한 영혼에 대한 소중함’이 있습니다.

그러므로 주님품교회는
한 영혼을 천하보다 귀하게 여기시는 하나님의 마음을 품고,
영혼을 귀하게 여기고, 영혼을 살리고, 세우는 사역을 통해서
행복한 성도들의 삶과 행복한 목회를 지향합니다.

그 아름다운 비전에 함께 동참해 보십시오.
세상에서 힘들고 지친 당신이
주님품교회를 통해서 예수님을 만나 참 평안을 누리고,
참 쉼을 누릴 수 있기를 소망합니다.`,
    closing: "따뜻하고, 평안한 주님품교회로 오세요.",
    pastorRole: "주님품교회 담임목사",
    pastorName: "차 지 명",
  },
  history: [
    {
      period: "현재",
      title: "지역 사회를 섬기며 미래로 나아가는 교회",
      desc: "다음 세대 양육과 선교, 따뜻한 나눔과 구제 사역을 통해 하나님의 나라를 확장해 가고 있습니다.",
    },
    {
      period: "2026년",
      title: "교회 홈페이지 새단장 및 온라인 사역 확대",
      desc: "성도들과의 소통 및 말씀 나눔을 위한 반응형 모바일/웹 홈페이지 구축.",
    },
    {
      period: "성전 입당",
      title: "여서동 성전 입당",
      desc: "전남 여수시 여서동 7길 28로 입당하여 주님품 안에서 거룩한 예배 공동체로 서다.",
    },
  ],
  worshipTimes: [
    { name: "주일 대예배", time: "주일 오전 11:00", place: "본당" },
    { name: "수요예배", time: "수요일 오후 7:30", place: "본당" },
    { name: "금요 다함께 기도회", time: "금요일 오후 8:30", place: "본당" },
    { name: "새벽 기도회", time: "월-금 오전 5:30", place: "본당" },
    { name: "교회학교 예배", time: "주일 오전 11:00", place: "본관 1층" },
  ],
  location: {
    address: "전남 여수시 여서동 7길 28",
    churchName: "대한예수교장로회(통합) 주님품교회",
    transport: "여서동 로터리 및 인근 버스정류장 하차 후 여서동 7길 방면 도보 3분",
    parking: "교회 건물 주변 및 인근 공영주차장을 편리하게 이용하실 수 있습니다.",
  },
};

export default function AboutPage() {
  const [aboutData, setAboutData] = useState(DEFAULT_ABOUT);
  const [formState, setFormState] = useState(DEFAULT_ABOUT);
  const [canEdit, setCanEdit] = useState(false);
  const [editSection, setEditSection] = useState<
    "greeting" | "history" | "worship" | "location" | null
  >(null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/site-config", { cache: "no-store" })
      .then((r) => r.json())
      .then((res) => {
        if (res?.config?.about) {
          const raw = res.config.about;
          const merged = {
            ...DEFAULT_ABOUT,
            ...raw,
            greeting: {
              ...DEFAULT_ABOUT.greeting,
              ...(raw.greeting || {}),
            },
            history:
              Array.isArray(raw.history) && raw.history.length > 0
                ? raw.history
                : DEFAULT_ABOUT.history,
            worshipTimes:
              Array.isArray(raw.worshipTimes) && raw.worshipTimes.length > 0
                ? raw.worshipTimes
                : DEFAULT_ABOUT.worshipTimes,
            location: {
              ...DEFAULT_ABOUT.location,
              ...(raw.location || {}),
            },
          };
          setAboutData(merged);
          setFormState(merged);
        }
      })
      .catch(() => {});

    const checkUser = () => {
      fetch("/api/auth/me", { cache: "no-store" })
        .then((r) => r.json())
        .then((res) => {
          const u = res?.user;
          if (
            u &&
            (u.isMaster ||
              u.role === "담임목사" ||
              u.role === "사모" ||
              u.role === "교역자")
          ) {
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

  const address = aboutData.location.address;

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "about", data: formState }),
      });
      const json = await res.json();
      if (res.ok && json.data) {
        setAboutData(formState);
        setEditSection(null);
      } else {
        alert(json.error || "저장에 실패했습니다.");
      }
    } catch {
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const kakaoMapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(address)}`;
  const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(address)}`;

  const greetingParagraphs = (aboutData.greeting.bodyText || "")
    .split(/\n\s*\n/)
    .filter((p) => p.trim().length > 0);

  return (
    <div className="py-8 sm:py-16 bg-[#FAF9F6] min-h-screen text-stone-800">
      <div className="container mx-auto px-3 sm:px-6 max-w-4xl">
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest block mb-2">
            About Us
          </span>
          <h1 className="text-2xl sm:text-4xl font-semibold text-stone-900 tracking-tight">
            {aboutData.pageTitle}
          </h1>
          <p className="text-sm text-stone-500 mt-2">{aboutData.pageSubtitle}</p>
        </div>

        {/* Pastor Greeting Section */}
        <section
          id="greeting"
          className="bg-white p-5 sm:p-10 rounded-2xl sm:rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.03)] mb-5 sm:mb-8 border border-stone-200/80 scroll-mt-24"
        >
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100 flex-wrap gap-2">
            <div className="flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icon-192.png?v=2"
                alt="주님품교회 로고"
                className="w-9 h-9 rounded-xl border border-amber-200/70 object-cover mr-3 shadow-2xs"
              />
              <h2 className="text-xl sm:text-2xl font-semibold text-stone-900">
                {aboutData.greeting.sectionTitle}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-serif italic text-amber-800/80 tracking-wider">
                God bless you
              </span>
              {canEdit && (
                <button
                  type="button"
                  onClick={() => {
                    setFormState(aboutData);
                    setEditSection("greeting");
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-amber-50 text-stone-600 hover:text-amber-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Pencil size={12} />
                  <span>인사말 수정</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
            {/* Left: Greeting Text */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-5">
                  {aboutData.greeting.headline}
                </h3>

                <div className="text-stone-600 leading-relaxed text-sm sm:text-base space-y-4 sm:space-y-5 mb-6 break-keep">
                  {greetingParagraphs.map((para, idx) => (
                    <p key={idx} className="whitespace-pre-line">
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100">
                <p className="text-sm sm:text-base font-semibold text-amber-800 mb-2">
                  {aboutData.greeting.closing}
                </p>
                <div className="text-right">
                  <span className="text-xs sm:text-sm text-stone-500 mr-2">
                    {aboutData.greeting.pastorRole}
                  </span>
                  <span className="text-base sm:text-lg font-bold text-stone-900 tracking-widest">
                    {aboutData.greeting.pastorName}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Pastor Portrait Photo */}
            <div className="md:col-span-5 flex justify-center">
              <div className="w-full max-w-[300px] md:max-w-none rounded-2xl overflow-hidden shadow-sm border border-stone-200/80 bg-stone-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/pastor-profile.png"
                  alt="주님품교회 담임목사"
                  className="w-full h-auto object-cover block"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Church History Section */}
        <section
          id="history"
          className="bg-white p-5 sm:p-10 rounded-2xl sm:rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.03)] mb-5 sm:mb-8 border border-stone-200/80 scroll-mt-24"
        >
          <div className="flex items-center justify-between mb-8 flex-wrap gap-2">
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center mr-3">
                <History size={18} />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-stone-900">
                교회연혁
              </h2>
            </div>
            {canEdit && (
              <button
                type="button"
                onClick={() => {
                  setFormState(aboutData);
                  setEditSection("history");
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-amber-50 text-stone-600 hover:text-amber-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Pencil size={12} />
                <span>연혁 수정/추가</span>
              </button>
            )}
          </div>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-amber-200/80 space-y-8">
            {aboutData.history.map((item, idx) => (
              <div key={idx} className="relative group">
                <div
                  className={`absolute -left-[31px] sm:-left-[39px] top-1 w-3.5 h-3.5 rounded-full border-4 border-white shadow-xs ${
                    idx === 0 ? "bg-amber-500" : "bg-stone-300"
                  }`}
                />
                <div
                  className={`font-mono text-xs font-semibold mb-1 ${
                    idx === 0 ? "text-amber-800" : "text-stone-500"
                  }`}
                >
                  {item.period}
                </div>
                <h3 className="text-base font-semibold text-stone-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 leading-relaxed whitespace-pre-line">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Worship Times Section */}
        <section
          id="worship-times"
          className="bg-white p-5 sm:p-10 rounded-2xl sm:rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.03)] mb-5 sm:mb-8 border border-stone-200/80 scroll-mt-24"
        >
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center mr-3">
                <Clock size={18} />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-stone-900">
                예배 시간 안내
              </h2>
            </div>
            {canEdit && (
              <button
                type="button"
                onClick={() => {
                  setFormState(aboutData);
                  setEditSection("worship");
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-amber-50 text-stone-600 hover:text-amber-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Pencil size={12} />
                <span>예배 시간 수정/추가</span>
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/70">
                  <th className="py-3 px-3 sm:px-5 text-stone-700 font-medium text-xs sm:text-sm rounded-tl-xl">
                    예배명
                  </th>
                  <th className="py-3 px-3 sm:px-5 text-stone-700 font-medium text-xs sm:text-sm">
                    시간
                  </th>
                  <th className="py-3 px-3 sm:px-5 text-stone-700 font-medium text-xs sm:text-sm rounded-tr-xl">
                    장소
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs sm:text-sm">
                {aboutData.worshipTimes.map((row, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-3.5 px-3 sm:px-5 font-medium text-stone-900">
                      {row.name}
                    </td>
                    <td className="py-3.5 px-3 sm:px-5 text-stone-600">{row.time}</td>
                    <td className="py-3.5 px-3 sm:px-5 text-stone-500">{row.place}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Location Section */}
        <section
          id="location"
          className="bg-white p-5 sm:p-10 rounded-2xl sm:rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.03)] border border-stone-200/80 scroll-mt-24"
        >
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center mr-3">
                <MapPin size={18} />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-stone-900">
                오시는 길
              </h2>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {canEdit && (
                <button
                  type="button"
                  onClick={() => {
                    setFormState(aboutData);
                    setEditSection("location");
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-stone-100 hover:bg-amber-50 text-stone-600 hover:text-amber-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Pencil size={12} />
                  <span>오시는 길 수정</span>
                </button>
              )}
              <a
                href={kakaoMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FEE500] hover:bg-[#FDD800] text-[#191919] text-xs font-semibold shadow-xs transition-colors"
              >
                <span>카카오맵</span>
                <ExternalLink size={12} />
              </a>
              <a
                href={naverMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#03C75A] hover:bg-[#02b350] text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <span>네이버지도</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Interactive Embedded Live Map */}
          <div className="w-full h-80 rounded-2xl overflow-hidden mb-6 border border-stone-200/80 shadow-inner relative">
            <iframe
              title="주님품교회 위치 지도"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src="https://www.openstreetmap.org/export/embed.html?bbox=127.698,34.742,127.714,34.752&layer=mapnik&marker=34.7468,127.7060"
              className="w-full h-full"
            />
          </div>

          {/* Address & Transport Details */}
          <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/70 space-y-3.5 text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200/60">
              <div className="flex items-start gap-3">
                <Navigation size={18} className="text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-stone-900 text-base">
                    {aboutData.location.address}
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">
                    {aboutData.location.churchName}
                  </div>
                </div>
              </div>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 hover:text-stone-900 text-xs font-medium transition-colors self-start sm:self-auto cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check size={13} className="text-emerald-600" />
                    <span className="text-emerald-600">복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>주소 복사</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-600 pt-1">
              <div>
                <strong className="text-stone-800 font-medium block mb-0.5">
                  교통편 안내
                </strong>
                <p className="text-stone-500 leading-relaxed whitespace-pre-line">
                  {aboutData.location.transport}
                </p>
              </div>
              <div>
                <strong className="text-stone-800 font-medium block mb-0.5">
                  주차 안내
                </strong>
                <p className="text-stone-500 leading-relaxed whitespace-pre-line">
                  {aboutData.location.parking}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Edit Modal */}
      {editSection && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
          onClick={() => setEditSection(null)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200/80 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900">
                {editSection === "greeting" && "목회자 인사말 수정"}
                {editSection === "history" && "교회연혁 수정 및 추가"}
                {editSection === "worship" && "예배 시간 안내 수정 및 추가"}
                {editSection === "location" && "오시는 길 안내 수정"}
              </h3>
              <button
                type="button"
                onClick={() => setEditSection(null)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {editSection === "greeting" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">
                      인사말 제목
                    </label>
                    <input
                      type="text"
                      value={formState.greeting.headline}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          greeting: { ...formState.greeting, headline: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">
                      인사말 본문 (빈 줄로 문단 구분)
                    </label>
                    <textarea
                      rows={10}
                      value={formState.greeting.bodyText}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          greeting: { ...formState.greeting, bodyText: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">
                      맺음말
                    </label>
                    <input
                      type="text"
                      value={formState.greeting.closing}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          greeting: { ...formState.greeting, closing: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">
                        직함
                      </label>
                      <input
                        type="text"
                        value={formState.greeting.pastorRole}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            greeting: {
                              ...formState.greeting,
                              pastorRole: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">
                        성함
                      </label>
                      <input
                        type="text"
                        value={formState.greeting.pastorName}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            greeting: {
                              ...formState.greeting,
                              pastorName: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                      />
                    </div>
                  </div>
                </>
              )}

              {editSection === "history" && (
                <div className="space-y-3">
                  {formState.history.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={item.period}
                          onChange={(e) => {
                            const next = [...formState.history];
                            next[idx] = { ...next[idx], period: e.target.value };
                            setFormState({ ...formState, history: next });
                          }}
                          className="w-36 px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-bold text-amber-800"
                          placeholder="시기 (예: 2026년)"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const next = formState.history.filter((_, i) => i !== idx);
                            setFormState({ ...formState, history: next });
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 cursor-pointer"
                        >
                          <Trash2 size={12} />
                          <span>삭제</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const next = [...formState.history];
                          next[idx] = { ...next[idx], title: e.target.value };
                          setFormState({ ...formState, history: next });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-semibold"
                        placeholder="연혁 제목"
                      />
                      <textarea
                        rows={2}
                        value={item.desc}
                        onChange={(e) => {
                          const next = [...formState.history];
                          next[idx] = { ...next[idx], desc: e.target.value };
                          setFormState({ ...formState, history: next });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs"
                        placeholder="상세 설명"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setFormState({
                        ...formState,
                        history: [
                          ...formState.history,
                          { period: "연도 입력", title: "연혁 제목", desc: "" },
                        ],
                      })
                    }
                    className="w-full py-2.5 rounded-xl border border-dashed border-amber-300 bg-amber-50/40 hover:bg-amber-50 text-amber-800 text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>새 연혁 항목 추가</span>
                  </button>
                </div>
              )}

              {editSection === "worship" && (
                <div className="space-y-3">
                  {formState.worshipTimes.map((row, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={row.name}
                          onChange={(e) => {
                            const next = [...formState.worshipTimes];
                            next[idx] = { ...next[idx], name: e.target.value };
                            setFormState({ ...formState, worshipTimes: next });
                          }}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-semibold"
                          placeholder="예배명 (예: 주일 대예배)"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const next = formState.worshipTimes.filter(
                              (_, i) => i !== idx
                            );
                            setFormState({ ...formState, worshipTimes: next });
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 cursor-pointer"
                        >
                          <Trash2 size={12} />
                          <span>삭제</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={row.time}
                          onChange={(e) => {
                            const next = [...formState.worshipTimes];
                            next[idx] = { ...next[idx], time: e.target.value };
                            setFormState({ ...formState, worshipTimes: next });
                          }}
                          className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs"
                          placeholder="시간 (예: 주일 오전 11:00)"
                        />
                        <input
                          type="text"
                          value={row.place}
                          onChange={(e) => {
                            const next = [...formState.worshipTimes];
                            next[idx] = { ...next[idx], place: e.target.value };
                            setFormState({ ...formState, worshipTimes: next });
                          }}
                          className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-xs"
                          placeholder="장소 (예: 본당)"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setFormState({
                        ...formState,
                        worshipTimes: [
                          ...formState.worshipTimes,
                          { name: "새 예배", time: "시간 입력", place: "본당" },
                        ],
                      })
                    }
                    className="w-full py-2.5 rounded-xl border border-dashed border-amber-300 bg-amber-50/40 hover:bg-amber-50 text-amber-800 text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>새 예배 시간 추가</span>
                  </button>
                </div>
              )}

              {editSection === "location" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">
                      교회 주소
                    </label>
                    <input
                      type="text"
                      value={formState.location.address}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          location: { ...formState.location, address: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">
                      교회명 표기
                    </label>
                    <input
                      type="text"
                      value={formState.location.churchName}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          location: {
                            ...formState.location,
                            churchName: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">
                      교통편 안내
                    </label>
                    <textarea
                      rows={2}
                      value={formState.location.transport}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          location: {
                            ...formState.location,
                            transport: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">
                      주차 안내
                    </label>
                    <textarea
                      rows={2}
                      value={formState.location.parking}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          location: { ...formState.location, parking: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditSection(null)}
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
