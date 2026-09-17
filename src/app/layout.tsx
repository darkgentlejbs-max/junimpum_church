import type { Metadata, Viewport } from "next";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";

export const viewport: Viewport = {
  themeColor: "#f59e0b",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "주님품교회",
  description: "대한예수교장로회(통합) 주님품교회입니다. 믿음, 소망, 사랑으로 세워가는 공동체.",
  keywords: ["주님품교회", "대한예수교장로회", "통합", "교회", "예배", "말씀", "기독교"],
  openGraph: {
    title: "주님품교회",
    description: "믿음 소망 사랑으로 세워가는 주님품교회",
    url: "https://junimpum.example.com",
    siteName: "주님품교회",
    images: [
      {
        url: "/images/church-exterior.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css" />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF9F6] text-stone-800">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-stone-200/80 bg-white/90 backdrop-blur-md">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
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
              <Link href="/about" className="hover:text-amber-700 transition-colors">교회소개</Link>
              <Link href="/sermons" className="hover:text-amber-700 transition-colors">예배/말씀</Link>
              <Link href="/ministries" className="hover:text-amber-700 transition-colors">사역/기관</Link>
              <Link href="/news" className="hover:text-amber-700 transition-colors">소식/나눔</Link>
            </nav>

            {/* Mobile Nav Toggle */}
            <button className="md:hidden p-2 text-stone-600 hover:text-amber-700 transition-colors" aria-label="메뉴 열기">
              <Menu size={22} />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">{children}</main>

        {/* Footer */}
        <footer className="bg-stone-900 text-stone-400 py-14 mt-auto border-t border-stone-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-lg font-semibold text-stone-100 mb-2">주님품교회</h3>
              <p className="text-xs text-stone-400 mb-3">대한예수교장로회(통합)</p>
              <p className="text-xs text-stone-400 leading-relaxed max-w-xs">
                믿음, 소망, 사랑으로 세워지며 주님의 품처럼 따뜻한 쉼과 회복이 있는 공동체입니다.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-stone-200 mb-4 tracking-wide">예배 시간 안내</h4>
              <ul className="text-xs space-y-2.5 text-stone-400">
                <li className="flex justify-between max-w-[200px]"><span>주일 대예배</span><span className="text-stone-300">오전 11:00</span></li>
                <li className="flex justify-between max-w-[200px]"><span>수요 기도회</span><span className="text-stone-300">오후 7:30</span></li>
                <li className="flex justify-between max-w-[200px]"><span>새벽 기도회</span><span className="text-stone-300">오전 5:00</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-stone-200 mb-4 tracking-wide">교회 위치</h4>
              <p className="text-xs text-stone-300 font-medium mb-1">
                전남 여수시 여서동 7길 28
              </p>
              <p className="text-xs text-stone-400 leading-relaxed mb-3">
                대한예수교장로회(통합) 주님품교회
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <a
                  href="https://map.kakao.com/link/search/%EC%A0%84%EB%82%A8%20%EC%97%AC%EC%88%98%EC%8B%9C%20%EC%97%AC%EC%84%9C%EB%8F%99%207%EA%B8%B8%2028"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-md bg-[#FEE500] text-[#191919] text-[11px] font-semibold hover:opacity-90 transition-opacity"
                >
                  카카오맵
                </a>
                <a
                  href="https://map.naver.com/v5/search/%EC%A0%84%EB%82%A8%20%EC%97%AC%EC%88%98%EC%8B%9C%20%EC%97%AC%EC%84%9C%EB%8F%99%207%EA%B8%B8%2028"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-md bg-[#03C75A] text-white text-[11px] font-semibold hover:opacity-90 transition-opacity"
                >
                  네이버지도
                </a>
              </div>
            </div>
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-8 border-t border-stone-800/80 text-[11px] text-stone-400 text-center">
            © {new Date().getFullYear()} 주님품교회. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
