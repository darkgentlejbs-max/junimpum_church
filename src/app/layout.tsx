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
              <h4 className="text-sm font-medium text-stone-200 mb-4 tracking-wide">교회 안내</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                성도 여러분과 처음 방문하시는 모든 분들을 진심으로 축복하고 환영합니다.
              </p>
              <div className="mt-4">
                <Link href="/about#location" className="text-xs text-amber-500 hover:text-amber-400 transition-colors inline-flex items-center gap-1">
                  오시는 길 안내 &rarr;
                </Link>
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
