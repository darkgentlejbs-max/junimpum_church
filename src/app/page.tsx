"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, MapPin, Video, Clock } from "lucide-react";

export default function Home() {
  const navItems = [
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
      title: "소식 · 나눔",
      desc: "주보 다운로드, 교회 공지사항, 온라인 헌금",
      href: "/news",
    },
  ];

  return (
    <div className="bg-[#FAF9F6] text-stone-800">
      {/* Hero Section - Split Layout */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left: Church Image Showcase (100% Full Image, Uncropped, Warm Framing) */}
          <div className="lg:col-span-6 flex justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative w-full max-w-md lg:max-w-none bg-white p-3 sm:p-4 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.05)] border border-stone-200/80"
            >
              {/* Image Container: Aspect ratio adjusted so 100% of the building & cross are completely visible */}
              <div className="relative w-full h-[380px] sm:h-[460px] lg:h-[540px] rounded-2xl overflow-hidden bg-stone-50/80 flex items-center justify-center">
                <Image
                  src="/images/church-exterior.jpg"
                  alt="주님품교회 전경"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain object-center"
                  priority
                />
              </div>

              {/* Minimal caption */}
              <div className="flex items-center justify-between px-3 pt-3 pb-1 text-[11px] text-stone-400 font-medium">
                <span>대한예수교장로회(통합)</span>
                <span>주님품교회 전경</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Refined Headline & Sleek Editorial Navigation Bar */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {/* Subtle Tagline */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-amber-900 text-xs font-medium mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                대한예수교장로회(통합) 주님품교회
              </div>

              {/* Smaller, Elegant Headline */}
              <h1 className="text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight leading-snug mb-3">
                믿음 · 소망 · 사랑으로<br />
                <span className="text-amber-800 font-medium">세워져 가는 따뜻한 공동체</span>
              </h1>

              {/* Soft Subtitle */}
              <p className="text-stone-500 text-sm font-normal leading-relaxed mb-8 max-w-lg">
                하나님의 은혜와 사랑이 머무는 곳, 주님의 품처럼 따뜻한 안식과 회복이 있는 주님품교회에 오신 것을 진심으로 환영합니다.
              </p>

              {/* Right Navigation Bar (Refined & Minimalist List) */}
              <div className="border-t border-stone-200/80 divide-y divide-stone-200/70">
                {navItems.map((item) => (
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
                        <p className="text-xs text-stone-400 mt-0.5">
                          {item.desc}
                        </p>
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

      {/* Info Section: Worship & Location (Clean, Minimalist Cards) */}
      <section className="border-t border-stone-200/60 bg-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Worship Times */}
            <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-stone-200/70 hover:border-amber-300/80 transition-all">
              <div className="w-9 h-9 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center mb-4">
                <Clock size={18} />
              </div>
              <h3 className="text-sm font-semibold text-stone-900 mb-1.5">예배 시간 안내</h3>
              <p className="text-xs text-stone-500 mb-4 leading-relaxed">
                주일 대예배(오전 11시) 및 수요기도회, 새벽기도회 안내입니다.
              </p>
              <Link href="/about#worship-times" className="text-xs font-medium text-amber-800 hover:text-amber-900 inline-flex items-center gap-1">
                시간표 보기 &rarr;
              </Link>
            </div>

            {/* Card 2: Sermons */}
            <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-stone-200/70 hover:border-amber-300/80 transition-all">
              <div className="w-9 h-9 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center mb-4">
                <Video size={18} />
              </div>
              <h3 className="text-sm font-semibold text-stone-900 mb-1.5">말씀 영상</h3>
              <p className="text-xs text-stone-500 mb-4 leading-relaxed">
                주일 예배 설교와 은혜로운 찬양 영상을 온라인으로 나눕니다.
              </p>
              <Link href="/sermons" className="text-xs font-medium text-amber-800 hover:text-amber-900 inline-flex items-center gap-1">
                설교 시청하기 &rarr;
              </Link>
            </div>

            {/* Card 3: Location */}
            <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-stone-200/70 hover:border-amber-300/80 transition-all">
              <div className="w-9 h-9 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center mb-4">
                <MapPin size={18} />
              </div>
              <h3 className="text-sm font-semibold text-stone-900 mb-1.5">오시는 길</h3>
              <p className="text-xs text-stone-500 mb-4 leading-relaxed">
                대한예수교장로회(통합) 주님품교회 찾아오시는 길 안내입니다.
              </p>
              <Link href="/about#location" className="text-xs font-medium text-amber-800 hover:text-amber-900 inline-flex items-center gap-1">
                위치 안내 보기 &rarr;
              </Link>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
