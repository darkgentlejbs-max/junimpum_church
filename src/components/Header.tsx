"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, X, ChevronDown, User as UserIcon, LogOut, Sparkles, Smartphone, Share, MoreVertical, PlusSquare, ShieldCheck } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [worshipDropdownOpen, setWorshipDropdownOpen] = useState(false);
  const [ministryDropdownOpen, setMinistryDropdownOpen] = useState(false);
  const [newsDropdownOpen, setNewsDropdownOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string; isMaster?: boolean } | null>(null);
  const [welcomeUser, setWelcomeUser] = useState<{ name: string; role: string } | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showShortcutGuide, setShowShortcutGuide] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
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
    }
  }, []);

  const handleShortcutClick = async () => {
    setMobileMenuOpen(false);
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
      return;
    }
    setShowShortcutGuide(true);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedWelcome = sessionStorage.getItem("welcome_user");
        if (storedWelcome) {
          sessionStorage.removeItem("welcome_user");
          const parsed = JSON.parse(storedWelcome);
          setWelcomeUser(parsed);
        }

        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user || null);
        }
      } catch {
        // ignore
      }
    };
    fetchUser();
    window.addEventListener("auth-change", fetchUser);
    return () => window.removeEventListener("auth-change", fetchUser);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setWelcomeUser(null);
    setMobileMenuOpen(false);
    router.refresh();
  };

  const getTimeGreeting = (name: string, role: string) => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const fullTitle = `${name}${role}님`;

    if (day === 0) {
      return {
        headline: `${fullTitle}, 복된 주일입니다!`,
        message:
          "따뜻한 주님품교회 홈페이지 방문을 환영합니다. 오늘도 예배를 통해 하나님의 크신 은혜와 사랑을 깊이 경험하는 복된 하루 되시길 축복합니다.",
      };
    }

    if (hour >= 5 && hour < 11) {
      return {
        headline: `${fullTitle}, 좋은 아침입니다!`,
        message:
          "따뜻한 주님품교회에 오신 것을 환영합니다. 오늘 하루도 주님의 말씀과 은혜로 힘차게 시작하시길 주님의 이름으로 축복합니다.",
      };
    }

    if (hour >= 11 && hour < 18) {
      return {
        headline: `${fullTitle}, 반갑습니다!`,
        message:
          "주님품교회 홈페이지 방문을 진심으로 환영합니다. 분주한 일상 속에서도 주님이 주시는 평안과 새 힘이 가득하시길 축복합니다.",
      };
    }

    return {
      headline: `${fullTitle}, 참 잘 오셨습니다!`,
      message:
        "오늘 하루도 참 수고 많으셨습니다. 따뜻한 주님품 안에서 평안한 쉼과 회복을 누리시길 주님의 이름으로 축복합니다.",
    };
  };

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/80 bg-white/95 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group py-2">
          <div className="relative h-10 w-36 sm:h-12 sm:w-44 transition-transform group-hover:scale-[1.02]">
            <Image
              src="/images/church-logo-header.png?v=2"
              alt="믿음 소망 사랑으로 세워가는 주님품교회"
              fill
              unoptimized
              sizes="(max-width: 640px) 288px, 352px"
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-9 text-sm font-medium text-stone-600">
          {/* Dropdown Menu for 교회소개 */}
          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 hover:text-amber-700 transition-colors py-4"
            >
              <span>교회소개</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 text-stone-400 ${
                  dropdownOpen ? "rotate-180 text-amber-700" : ""
                }`}
              />
            </Link>

            {/* Dropdown Menu Box */}
            {dropdownOpen && (
              <div className="absolute left-0 top-full -mt-1 w-44 rounded-2xl bg-white p-2 shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-stone-200/80 py-2.5 transition-all">
                <Link
                  href="/about#greeting"
                  className="block px-3.5 py-2 text-xs font-medium text-stone-700 hover:text-amber-800 hover:bg-amber-50/70 rounded-xl transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  목회자 인사말
                </Link>
                <Link
                  href="/about#history"
                  className="block px-3.5 py-2 text-xs font-medium text-stone-700 hover:text-amber-800 hover:bg-amber-50/70 rounded-xl transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  교회연혁
                </Link>
                <div className="my-1 border-t border-stone-100"></div>
                <Link
                  href="/about#worship-times"
                  className="block px-3.5 py-2 text-xs font-medium text-stone-700 hover:text-amber-800 hover:bg-amber-50/70 rounded-xl transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  예배안내
                </Link>
                <Link
                  href="/about#location"
                  className="block px-3.5 py-2 text-xs font-medium text-stone-700 hover:text-amber-800 hover:bg-amber-50/70 rounded-xl transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  오시는 길
                </Link>
              </div>
            )}
          </div>

          {/* Dropdown Menu for 예배/말씀 */}
          <div
            className="relative"
            onMouseEnter={() => setWorshipDropdownOpen(true)}
            onMouseLeave={() => setWorshipDropdownOpen(false)}
          >
            <Link
              href="/sermons"
              className="inline-flex items-center gap-1.5 hover:text-amber-700 transition-colors py-4"
            >
              <span>예배/말씀</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 text-stone-400 ${
                  worshipDropdownOpen ? "rotate-180 text-amber-700" : ""
                }`}
              />
            </Link>

            {/* Dropdown Menu Box */}
            {worshipDropdownOpen && (
              <div className="absolute left-0 top-full -mt-1 w-44 rounded-2xl bg-white p-2 shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-stone-200/80 py-2.5 transition-all">
                <Link
                  href="/sermons"
                  className="block px-3.5 py-2 text-xs font-medium text-stone-700 hover:text-amber-800 hover:bg-amber-50/70 rounded-xl transition-colors"
                  onClick={() => setWorshipDropdownOpen(false)}
                >
                  주일 설교
                </Link>
                <Link
                  href="/daldal"
                  className="block px-3.5 py-2 text-xs font-medium text-stone-700 hover:text-amber-800 hover:bg-amber-50/70 rounded-xl transition-colors"
                  onClick={() => setWorshipDropdownOpen(false)}
                >
                  달달바이블
                </Link>
              </div>
            )}
          </div>

          {/* Dropdown Menu for 사역/기관 */}
          <div
            className="relative"
            onMouseEnter={() => setMinistryDropdownOpen(true)}
            onMouseLeave={() => setMinistryDropdownOpen(false)}
          >
            <Link
              href="/ministries"
              className="inline-flex items-center gap-1.5 hover:text-amber-700 transition-colors py-4"
            >
              <span>사역/기관</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 text-stone-400 ${
                  ministryDropdownOpen ? "rotate-180 text-amber-700" : ""
                }`}
              />
            </Link>

            {/* Dropdown Menu Box */}
            {ministryDropdownOpen && (
              <div className="absolute left-0 top-full -mt-1 w-44 rounded-2xl bg-white p-2 shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-stone-200/80 py-2.5 transition-all">
                <Link
                  href="/ministries#men"
                  className="block px-3.5 py-2 text-xs font-medium text-stone-700 hover:text-amber-800 hover:bg-amber-50/70 rounded-xl transition-colors"
                  onClick={() => setMinistryDropdownOpen(false)}
                >
                  남선교회
                </Link>
                <Link
                  href="/ministries#women"
                  className="block px-3.5 py-2 text-xs font-medium text-stone-700 hover:text-amber-800 hover:bg-amber-50/70 rounded-xl transition-colors"
                  onClick={() => setMinistryDropdownOpen(false)}
                >
                  여전도회
                </Link>
                <div className="my-1 border-t border-stone-100"></div>
                <Link
                  href="/ministries#school"
                  className="block px-3.5 py-2 text-xs font-medium text-stone-700 hover:text-amber-800 hover:bg-amber-50/70 rounded-xl transition-colors"
                  onClick={() => setMinistryDropdownOpen(false)}
                >
                  교회학교
                </Link>
                <Link
                  href="/ministries#worship"
                  className="block px-3.5 py-2 text-xs font-medium text-stone-700 hover:text-amber-800 hover:bg-amber-50/70 rounded-xl transition-colors"
                  onClick={() => setMinistryDropdownOpen(false)}
                >
                  찬양팀
                </Link>
              </div>
            )}
          </div>
          {/* Dropdown Menu for 소식/일정 */}
          <div
            className="relative"
            onMouseEnter={() => setNewsDropdownOpen(true)}
            onMouseLeave={() => setNewsDropdownOpen(false)}
          >
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 hover:text-amber-700 transition-colors py-4"
            >
              <span>소식/일정</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 text-stone-400 ${
                  newsDropdownOpen ? "rotate-180 text-amber-700" : ""
                }`}
              />
            </Link>

            {/* Dropdown Menu Box */}
            {newsDropdownOpen && (
              <div className="absolute left-0 top-full -mt-1 w-44 rounded-2xl bg-white p-2 shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-stone-200/80 py-2.5 transition-all">
                <Link
                  href="/news#notices"
                  className="block px-3.5 py-2 text-xs font-medium text-stone-700 hover:text-amber-800 hover:bg-amber-50/70 rounded-xl transition-colors"
                  onClick={() => setNewsDropdownOpen(false)}
                >
                  교회 소식
                </Link>
                <Link
                  href="/news#schedule"
                  className="block px-3.5 py-2 text-xs font-medium text-stone-700 hover:text-amber-800 hover:bg-amber-50/70 rounded-xl transition-colors"
                  onClick={() => setNewsDropdownOpen(false)}
                >
                  교회 일정
                </Link>
                <div className="my-1 border-t border-stone-100"></div>
                <Link
                  href="/bulletins"
                  className="block px-3.5 py-2 text-xs font-medium text-stone-700 hover:text-amber-800 hover:bg-amber-50/70 rounded-xl transition-colors"
                  onClick={() => setNewsDropdownOpen(false)}
                >
                  주보
                </Link>
              </div>
            )}
          </div>
          <Link href="/gallery" className="hover:text-amber-700 transition-colors">
            갤러리
          </Link>
          <div className="flex flex-col items-start justify-center gap-1">
            <a
              href="https://blog.naver.com/jesusbosom"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[#03C75A] transition-colors leading-none"
            >
              <span className="w-4 h-4 rounded bg-[#03C75A] text-white text-[10px] font-extrabold flex items-center justify-center leading-none">
                N
              </span>
              <span>블로그</span>
            </a>
            <button
              type="button"
              onClick={handleShortcutClick}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 hover:text-amber-900 transition-colors leading-none cursor-pointer"
            >
              <Smartphone size={12} className="text-amber-700" />
              <span>스마트홈 바로가기</span>
            </button>
          </div>

          {/* Auth Links (Desktop) */}
          <div className="pl-4 ml-2 border-l border-stone-200 flex items-center space-x-3">
            {user ? (
              <>
                {(user.isMaster || user.role === "담임목사" || user.role === "사모" || user.role === "교역자") && (
                  <Link
                    href="/admin/members"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-100/80 border border-amber-300/80 px-2.5 py-1.5 rounded-full hover:bg-amber-200/80 transition-colors"
                    title="회원가입 승인 및 교인 관리"
                  >
                    <ShieldCheck size={13} />
                    <span>회원승인</span>
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setWelcomeUser({ name: user.name, role: user.role })}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-700 bg-amber-50/80 border border-amber-200/60 px-3 py-1.5 rounded-full hover:bg-amber-100/80 transition-colors cursor-pointer"
                >
                  <UserIcon size={13} className="text-amber-700" />
                  <span>
                    <strong className="font-semibold text-stone-900">{user.name}</strong>
                    <span className="text-amber-800 font-semibold">{user.role}</span>님
                  </span>
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 text-xs font-medium text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                  title="로그아웃"
                >
                  <LogOut size={13} />
                  <span>로그아웃</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-xs font-medium text-stone-500 hover:text-amber-700 transition-colors">
                  로그인
                </Link>
                <Link href="/signup" className="text-xs font-medium px-4 py-1.5 rounded-full bg-stone-100 text-stone-600 hover:bg-amber-100 hover:text-amber-800 transition-colors">
                  회원가입
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Quick Auth, Blog Link & Nav Toggle */}
        <div className="flex md:hidden items-center gap-1.5">
          <div className="flex flex-col items-end justify-center gap-1">
            {/* Row 1: Auth Links (Login / Signup or User Info) */}
            <div className="flex items-center gap-1">
              {user ? (
                <>
                  {(user.isMaster || user.role === "담임목사" || user.role === "사모" || user.role === "교역자") && (
                    <Link
                      href="/admin/members"
                      className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-800 text-white text-[10px] font-semibold leading-none"
                    >
                      <ShieldCheck size={10} />
                      <span>회원승인</span>
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => setWelcomeUser({ name: user.name, role: user.role })}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200/70 text-stone-800 text-[10px] font-semibold leading-none cursor-pointer"
                  >
                    <UserIcon size={10} className="text-amber-700" />
                    <span>
                      {user.name}
                      <span className="text-amber-800">{user.role}</span>님
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-500 hover:text-red-600 text-[10px] font-semibold leading-none cursor-pointer"
                  >
                    <LogOut size={10} />
                    <span>로그아웃</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-200/80 text-stone-700 text-[10px] font-semibold leading-none"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-100/80 border border-amber-200/80 text-amber-900 text-[10px] font-semibold leading-none"
                  >
                    회원가입
                  </Link>
                </>
              )}
            </div>

            {/* Row 2: Blog & Smart Home Shortcut */}
            <div className="flex items-center gap-1">
              <a
                href="https://blog.naver.com/jesusbosom"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#03C75A]/10 text-[#03C75A] text-[10px] font-semibold leading-none"
              >
                <span className="w-3 h-3 rounded-xs bg-[#03C75A] text-white text-[8px] font-extrabold flex items-center justify-center leading-none">
                  N
                </span>
                <span>블로그</span>
              </a>
              <button
                type="button"
                onClick={handleShortcutClick}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200/70 text-amber-800 text-[10px] font-semibold leading-none cursor-pointer"
              >
                <Smartphone size={10} className="text-amber-700" />
                <span>스마트홈 바로가기</span>
              </button>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-stone-600 hover:text-amber-700 transition-colors"
            aria-label="메뉴 열기"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200/80 bg-white px-5 py-6 space-y-4 shadow-lg">
          <div>
            <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-2">
              교회소개
            </div>
            <div className="pl-3 space-y-2.5 border-l-2 border-amber-300">
              <Link
                href="/about#greeting"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-stone-700 hover:text-amber-700 font-medium"
              >
                목회자 인사말
              </Link>
              <Link
                href="/about#history"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-stone-700 hover:text-amber-700 font-medium"
              >
                교회연혁
              </Link>
              <Link
                href="/about#worship-times"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-stone-700 hover:text-amber-700 font-medium"
              >
                예배안내
              </Link>
              <Link
                href="/about#location"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-stone-700 hover:text-amber-700 font-medium"
              >
                오시는 길
              </Link>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-100 space-y-3">
            <div className="pt-2">
              <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-2">
                예배/말씀
              </div>
              <div className="pl-3 space-y-2.5 border-l-2 border-amber-300">
                <Link
                  href="/sermons"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-stone-700 hover:text-amber-700 font-medium"
                >
                  주일 설교
                </Link>
                <Link
                  href="/daldal"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-stone-700 hover:text-amber-700 font-medium"
                >
                  달달바이블
                </Link>
              </div>
            </div>
            <div className="pt-2">
              <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-2">
                사역/기관
              </div>
              <div className="pl-3 space-y-2.5 border-l-2 border-amber-300">
                <Link
                  href="/ministries#men"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-stone-700 hover:text-amber-700 font-medium"
                >
                  남선교회
                </Link>
                <Link
                  href="/ministries#women"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-stone-700 hover:text-amber-700 font-medium"
                >
                  여전도회
                </Link>
                <Link
                  href="/ministries#school"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-stone-700 hover:text-amber-700 font-medium"
                >
                  교회학교
                </Link>
                <Link
                  href="/ministries#worship"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-stone-700 hover:text-amber-700 font-medium"
                >
                  찬양팀
                </Link>
              </div>
            </div>
            <div className="pt-2">
              <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-2">
                소식/일정
              </div>
              <div className="pl-3 space-y-2.5 border-l-2 border-amber-300">
                <Link
                  href="/news#notices"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-stone-700 hover:text-amber-700 font-medium"
                >
                  교회 소식
                </Link>
                <Link
                  href="/news#schedule"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-stone-700 hover:text-amber-700 font-medium"
                >
                  교회 일정
                </Link>
                <Link
                  href="/bulletins"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-stone-700 hover:text-amber-700 font-medium"
                >
                  주보
                </Link>
              </div>
            </div>
            <Link
              href="/gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="block hover:text-amber-700"
            >
              갤러리
            </Link>
            <div className="space-y-2.5 pt-1">
              <a
                href="https://blog.naver.com/jesusbosom"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 hover:text-[#03C75A] font-medium"
              >
                <span className="w-4 h-4 rounded bg-[#03C75A] text-white text-[10px] font-extrabold flex items-center justify-center leading-none">
                  N
                </span>
                <span>네이버 블로그</span>
              </a>
              <button
                type="button"
                onClick={handleShortcutClick}
                className="flex items-center gap-2 text-amber-800 hover:text-amber-900 font-medium cursor-pointer"
              >
                <span className="w-4 h-4 rounded bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Smartphone size={11} />
                </span>
                <span>스마트홈 바로가기</span>
              </button>
            </div>

            {/* Auth Links (Mobile) */}
            <div className="pt-4 mt-2 border-t border-stone-100 flex items-center gap-3">
              {user ? (
                <div className="w-full bg-amber-50/70 border border-amber-200/60 px-4 py-3.5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-stone-700">
                      <UserIcon size={16} className="text-amber-700" />
                      <span>
                        <strong className="font-semibold text-stone-900">{user.name}</strong>
                        <span className="text-amber-800 font-semibold">{user.role}</span>님
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {(user.isMaster || user.role === "담임목사" || user.role === "사모" || user.role === "교역자") && (
                        <Link
                          href="/admin/members"
                          onClick={() => setMobileMenuOpen(false)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-800 text-white text-xs font-semibold"
                        >
                          <ShieldCheck size={12} />
                          <span>회원승인</span>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <LogOut size={14} />
                        <span>로그아웃</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-amber-900/80 leading-relaxed pl-6">
                    {getTimeGreeting(user.name, user.role).message}
                  </p>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2.5 text-sm font-medium text-stone-600 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2.5 text-sm font-medium text-amber-800 bg-amber-100/70 rounded-xl hover:bg-amber-200/70 transition-colors"
                  >
                    회원가입
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>

      {/* Welcome Blessing Modal on Login / Signup */}
      {welcomeUser && (() => {
        const greeting = getTimeGreeting(welcomeUser.name, welcomeUser.role);
        return (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
            onClick={() => setWelcomeUser(null)}
          >
            <div
              className="w-full max-w-md bg-white rounded-3xl p-8 text-center shadow-2xl border border-amber-200/80 animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl border border-amber-200/70 overflow-hidden shadow-xs flex items-center justify-center bg-[#FAF9F6]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/icon-192.png?v=2"
                  alt="주님품교회 로고"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-3 break-keep">
                <span className="text-amber-800">{greeting.headline}</span>
              </h3>
              <p className="text-sm sm:text-base font-medium text-stone-600 leading-relaxed mb-7 break-keep">
                &ldquo;{greeting.message}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => setWelcomeUser(null)}
                className="w-full py-3.5 rounded-xl bg-amber-800 text-white text-sm font-semibold hover:bg-amber-900 transition-colors cursor-pointer"
              >
                아멘, 감사합니다
              </button>
            </div>
          </div>
        );
      })()}

      {/* Smart Home Shortcut Guide Modal */}
      {showShortcutGuide && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setShowShortcutGuide(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200/80"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <img
                  src="/icon-192.png?v=2"
                  alt="주님품교회 아이콘"
                  className="w-9 h-9 rounded-xl border border-stone-200"
                />
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    스마트홈 바로가기 추가 방법
                  </h3>
                  <p className="text-xs text-stone-500">
                    바탕화면에 주님품교회 아이콘을 만들어 보세요
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowShortcutGuide(false)}
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
              onClick={() => setShowShortcutGuide(false)}
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
