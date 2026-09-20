"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [ministryDropdownOpen, setMinistryDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/80 bg-white/95 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group py-2">
          <div className="relative h-10 w-36 sm:h-12 sm:w-44 transition-transform group-hover:scale-[1.02]">
            <Image
              src="/images/church-logo-header.png"
              alt="믿음 소망 사랑으로 세워가는 주님품교회"
              fill
              sizes="(max-width: 640px) 144px, 176px"
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

          <Link href="/sermons" className="hover:text-amber-700 transition-colors">
            예배/말씀
          </Link>

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
                <div className="my-1 border-t border-stone-100"></div>
                <Link
                  href="/ministries#fellowships"
                  className="block px-3.5 py-2 text-xs font-medium text-stone-700 hover:text-amber-800 hover:bg-amber-50/70 rounded-xl transition-colors"
                  onClick={() => setMinistryDropdownOpen(false)}
                >
                  남선교회
                </Link>
                <Link
                  href="/ministries#fellowships"
                  className="block px-3.5 py-2 text-xs font-medium text-stone-700 hover:text-amber-800 hover:bg-amber-50/70 rounded-xl transition-colors"
                  onClick={() => setMinistryDropdownOpen(false)}
                >
                  여전도회
                </Link>
              </div>
            )}
          </div>
          <Link href="/news" className="hover:text-amber-700 transition-colors">
            소식/나눔
          </Link>
          <Link href="/gallery" className="hover:text-amber-700 transition-colors">
            갤러리
          </Link>
        </nav>

        {/* Mobile Nav Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-stone-600 hover:text-amber-700 transition-colors"
          aria-label="메뉴 열기"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
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

          <div className="pt-2 border-t border-stone-100 space-y-3 text-sm font-medium text-stone-700">
            <Link
              href="/sermons"
              onClick={() => setMobileMenuOpen(false)}
              className="block hover:text-amber-700"
            >
              예배/말씀
            </Link>
            <div className="pt-2">
              <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-2">
                사역/기관
              </div>
              <div className="pl-3 space-y-2.5 border-l-2 border-amber-300">
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
                <Link
                  href="/ministries#fellowships"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-stone-700 hover:text-amber-700 font-medium"
                >
                  남선교회
                </Link>
                <Link
                  href="/ministries#fellowships"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-stone-700 hover:text-amber-700 font-medium"
                >
                  여전도회
                </Link>
              </div>
            </div>
            <Link
              href="/news"
              onClick={() => setMobileMenuOpen(false)}
              className="block hover:text-amber-700"
            >
              소식/나눔
            </Link>
            <Link
              href="/gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="block hover:text-amber-700"
            >
              갤러리
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
