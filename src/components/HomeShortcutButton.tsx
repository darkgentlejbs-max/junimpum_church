"use client";

import { useState, useEffect } from "react";
import { Smartphone, X, Share, MoreVertical, PlusSquare } from "lucide-react";

export default function HomeShortcutButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
      return;
    }
    setShowGuide(true);
  };

  return (
    <>
      <div className="mt-5 pt-4 border-t border-stone-200/70 flex flex-col sm:flex-row gap-2.5">
        <button
          type="button"
          onClick={handleInstallClick}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Smartphone size={16} />
          <span>스마트폰 홈 화면에 바로가기 추가</span>
        </button>

        <a
          href="https://blog.naver.com/jesusbosom"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#03C75A] hover:bg-[#02b350] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
        >
          <span className="w-4 h-4 rounded-xs bg-white text-[#03C75A] text-[10px] font-extrabold flex items-center justify-center leading-none">
            N
          </span>
          <span>네이버 블로그 바로가기</span>
        </a>
      </div>

      {showGuide && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setShowGuide(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200/80"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <img
                  src="/icon-192.png"
                  alt="주님품교회 아이콘"
                  className="w-9 h-9 rounded-xl border border-stone-200"
                />
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    스마트폰 바로가기 추가 방법
                  </h3>
                  <p className="text-xs text-stone-500">
                    바탕화면에 주님품교회 아이콘을 만들어 보세요
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60">
                <p className="font-bold text-amber-900 mb-1.5 flex items-center gap-1.5">
                  <MoreVertical size={15} className="text-amber-700" />
                  갤럭시 (안드로이드) 스마트폰
                </p>
                <p className="text-stone-600">
                  1. 인터넷 창 우측 상단(또는 하단)의 <strong>점 세 개(⋮)</strong> 또는 <strong>줄 세 개(≡)</strong> 메뉴를 누르세요.<br />
                  2. <strong>[홈 화면에 추가]</strong> 또는 <strong>[현재 페이지 추가 &rarr; 홈 화면]</strong>을 누르면 바탕화면에 바로가기 아이콘이 생성됩니다!
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
                <p className="font-bold text-stone-900 mb-1.5 flex items-center gap-1.5">
                  <Share size={15} className="text-stone-700" />
                  아이폰 (Safari 브라우저)
                </p>
                <p className="text-stone-600">
                  1. 화면 하단 가운데의 <strong>공유 버튼(네모 위 화살표 ⬆️)</strong>을 누르세요.<br />
                  2. 메뉴를 내려 <strong>[홈 화면에 추가 <PlusSquare size={12} className="inline" />]</strong>를 누른 뒤 우측 상단 <strong>[추가]</strong>를 누르면 완료됩니다!
                </p>
              </div>

              {isIOS && (
                <p className="text-[11px] text-stone-400 text-center">
                  ※ 카카오톡 안에서 열렸다면 우측 하단 <strong>[•••] &rarr; [다른 브라우저로 열기]</strong> 후 추가해 주세요.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="w-full mt-6 py-3 rounded-xl bg-amber-800 text-white text-sm font-semibold hover:bg-amber-900 transition-colors cursor-pointer"
            >
              확인했습니다
            </button>
          </div>
        </div>
      )}
    </>
  );
}
