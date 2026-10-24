"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";

export default function FloatingHomeButton() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 120);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = pathname === "/";

  // 메인 홈 화면에서는 스크롤을 내렸을 때만 표시하고, 다른 모든 하위 페이지에서는 항상 스크롤을 따라다니며 표시
  if (isHome && !scrolled) {
    return null;
  }

  const buttonClass =
    "fixed bottom-5 right-4 sm:bottom-8 sm:right-8 z-40 inline-flex items-center gap-1.5 px-3 py-1.5 bg-transparent text-sm font-medium text-stone-600 hover:text-amber-700 transition-colors cursor-pointer";

  if (isHome) {
    return (
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={buttonClass}
        aria-label="홈 화면 맨 위로 이동"
      >
        <Home size={15} />
        <span>홈으로 가기</span>
      </button>
    );
  }

  return (
    <Link
      href="/"
      className={buttonClass}
      aria-label="홈으로 가기"
    >
      <Home size={15} />
      <span>홈으로 가기</span>
    </Link>
  );
}
