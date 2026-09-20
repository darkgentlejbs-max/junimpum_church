import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const viewport: Viewport = {
  themeColor: "#FAF9F6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "주님품교회",
  applicationName: "주님품교회",
  appleWebApp: {
    capable: true,
    title: "주님품교회",
    statusBarStyle: "default",
  },
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
        {/* Header with Dropdown Navigation */}
        <Header />

        {/* Main Content */}
        <main className="flex-1 flex flex-col">{children}</main>

        {/* Footer */}
        <footer className="bg-stone-900 text-stone-400 py-14 mt-auto border-t border-stone-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-lg font-semibold text-stone-100 mb-2">주님품교회</h3>
              <p className="text-xs text-stone-400 mb-3">대한예수교장로회(통합)</p>
              <p className="text-xs text-stone-400 leading-relaxed max-w-xs">
                믿음, 소망, 사랑으로 세워지며 주님품처럼 따뜻한 쉼과 회복이 있는 공동체입니다.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-stone-200 mb-4 tracking-wide">예배 시간 안내</h4>
              <ul className="text-xs space-y-2.5 text-stone-400">
                <li className="grid grid-cols-[120px_1fr] gap-2"><span>주일 대예배</span><span className="text-stone-300">오전 11:00</span></li>
                <li className="grid grid-cols-[120px_1fr] gap-2"><span>수요예배</span><span className="text-stone-300">오후 7:30</span></li>
                <li className="grid grid-cols-[120px_1fr] gap-2"><span>금요 다함께 기도회</span><span className="text-stone-300">오후 8:30</span></li>
                <li className="grid grid-cols-[120px_1fr] gap-2"><span>새벽 기도회</span><span className="text-stone-300">오전 5:30</span></li>
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
