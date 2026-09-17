import type { Metadata, Viewport } from "next";
import "./globals.css";
import Link from "next/link";
import { Menu } from "lucide-react";

export const viewport: Viewport = {
  themeColor: "#f97316",
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
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary-600">주님품교회</span>
            </Link>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-700">
              <Link href="/about" className="hover:text-primary-600 transition-colors">교회소개</Link>
              <Link href="/sermons" className="hover:text-primary-600 transition-colors">예배/말씀</Link>
              <Link href="/ministries" className="hover:text-primary-600 transition-colors">사역/기관</Link>
              <Link href="/news" className="hover:text-primary-600 transition-colors">소식/나눔</Link>
            </nav>

            {/* Mobile Nav Toggle */}
            <button className="md:hidden p-2 text-gray-600 hover:text-primary-600">
              <Menu size={24} />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">{children}</main>

        {/* Footer */}
        <footer className="bg-secondary-800 text-gray-300 py-12 mt-auto">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">주님품교회</h3>
              <p className="text-sm">믿음 소망 사랑으로 세워가는 공동체</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">예배 시간</h4>
              <ul className="text-sm space-y-2">
                <li>주일예배: 오전 11:00</li>
                <li>수요예배: 오후 7:30</li>
                <li>새벽기도회: 오전 5:00</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">오시는 길</h4>
              <p className="text-sm">대한예수교장로회(통합)</p>
            </div>
          </div>
          <div className="container mx-auto px-4 mt-8 pt-8 border-t border-secondary-700 text-sm text-center">
            © {new Date().getFullYear()} 주님품교회. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
