"use client";

import { useState } from "react";
import { MapPin, Clock, Copy, Check, Navigation, ExternalLink, Sparkles, History } from "lucide-react";

export default function AboutPage() {
  const [copied, setCopied] = useState(false);
  const address = "전남 여수시 여서동 7길 28";

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const kakaoMapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(address)}`;
  const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(address)}`;

  return (
    <div className="py-8 sm:py-16 bg-[#FAF9F6] min-h-screen text-stone-800">
      <div className="container mx-auto px-3 sm:px-6 max-w-4xl">
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest block mb-2">About Us</span>
          <h1 className="text-2xl sm:text-4xl font-semibold text-stone-900 tracking-tight">교회 소개</h1>
          <p className="text-sm text-stone-500 mt-2">대한예수교장로회(통합) 주님품교회를 소개합니다</p>
        </div>
        
        {/* Pastor Greeting Section */}
        <section id="greeting" className="bg-white p-5 sm:p-10 rounded-2xl sm:rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.03)] mb-5 sm:mb-8 border border-stone-200/80 scroll-mt-24">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center mr-3">
                <Sparkles size={18} />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-stone-900">
                목회자 인사말
              </h2>
            </div>
            <span className="text-xs font-serif italic text-amber-800/80 tracking-wider">
              God bless you
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-5">
            &ldquo;평안하시지요?&rdquo;
          </h3>

          <div className="text-stone-600 leading-relaxed text-sm sm:text-base space-y-5 mb-7 break-keep">
            <p>
              주님품교회를 방문해 주신 당신에게<br />
              하나님의 크신 은혜와 평강이 임하기를 축복합니다.
            </p>
            <p>
              교회의 궁극적인 목적은<br />
              <strong className="text-stone-800 font-semibold">&lsquo;하나님이 원하시고, 기뻐하시는 교회를 이루어 가는 것&rsquo;</strong>이며,<br />
              그 중심에는 <strong className="text-amber-800 font-semibold">&lsquo;한 영혼에 대한 소중함&rsquo;</strong>이 있습니다.
            </p>
            <p>
              그러므로 주님품교회는<br />
              한 영혼을 천하보다 귀하게 여기시는 하나님의 마음을 품고,<br />
              영혼을 귀하게 여기고, 영혼을 살리고, 세우는 사역을 통해서<br />
              행복한 성도들의 삶과 행복한 목회를 지향합니다.
            </p>
            <p>
              그 아름다운 비전에 함께 동참해 보십시오.<br />
              세상에서 힘들고 지친 당신이<br />
              주님품교회를 통해서 예수님을 만나 참 평안을 누리고,<br />
              참 쉼을 누릴 수 있기를 소망합니다.
            </p>
          </div>

          <div className="pt-5 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-sm sm:text-base font-semibold text-amber-800">
              따뜻하고, 평안한 주님품교회로 오세요.
            </p>
            <div className="text-right">
              <span className="text-sm text-stone-500 mr-2">주님품교회 담임목사</span>
              <span className="text-base sm:text-lg font-bold text-stone-900 tracking-widest">차 지 명</span>
            </div>
          </div>
        </section>

        {/* Church History Section */}
        <section id="history" className="bg-white p-5 sm:p-10 rounded-2xl sm:rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.03)] mb-5 sm:mb-8 border border-stone-200/80 scroll-mt-24">
          <div className="flex items-center mb-8">
            <div className="w-9 h-9 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center mr-3">
              <History size={18} />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-stone-900">교회연혁</h2>
          </div>
          
          <div className="relative pl-6 sm:pl-8 border-l-2 border-amber-200/80 space-y-8">
            {/* Timeline Item 1 */}
            <div className="relative group">
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-3.5 h-3.5 rounded-full bg-amber-500 border-4 border-white shadow-xs"></div>
              <div className="font-mono text-xs font-semibold text-amber-800 mb-1">현재</div>
              <h3 className="text-base font-semibold text-stone-900 mb-1">지역 사회를 섬기며 미래로 나아가는 교회</h3>
              <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                다음 세대 양육과 선교, 따뜻한 나눔과 구제 사역을 통해 하나님의 나라를 확장해 가고 있습니다.
              </p>
            </div>

            {/* Timeline Item 2 */}
            <div className="relative group">
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-3.5 h-3.5 rounded-full bg-stone-300 border-4 border-white shadow-xs"></div>
              <div className="font-mono text-xs font-semibold text-stone-500 mb-1">2026년</div>
              <h3 className="text-base font-semibold text-stone-900 mb-1">교회 홈페이지 새단장 및 온라인 사역 확대</h3>
              <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                성도들과의 소통 및 말씀 나눔을 위한 반응형 모바일/웹 홈페이지 구축.
              </p>
            </div>

            {/* Timeline Item 3 */}
            <div className="relative group">
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-3.5 h-3.5 rounded-full bg-stone-300 border-4 border-white shadow-xs"></div>
              <div className="font-mono text-xs font-semibold text-stone-500 mb-1">성전 입당</div>
              <h3 className="text-base font-semibold text-stone-900 mb-1">여서동 성전 입당 및 헌당</h3>
              <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                전남 여수시 여서동 7길 28로 입당하여 주님품 안에서 거룩한 예배 공동체로 서다.
              </p>
            </div>
          </div>
        </section>

        {/* Worship Times Section */}
        <section id="worship-times" className="bg-white p-5 sm:p-10 rounded-2xl sm:rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.03)] mb-5 sm:mb-8 border border-stone-200/80 scroll-mt-24">
          <div className="flex items-center mb-6">
            <div className="w-9 h-9 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center mr-3">
              <Clock size={18} />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-stone-900">예배 시간 안내</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/70">
                  <th className="py-3 px-3 sm:px-5 text-stone-700 font-medium text-xs sm:text-sm rounded-tl-xl">예배명</th>
                  <th className="py-3 px-3 sm:px-5 text-stone-700 font-medium text-xs sm:text-sm">시간</th>
                  <th className="py-3 px-3 sm:px-5 text-stone-700 font-medium text-xs sm:text-sm rounded-tr-xl">장소</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs sm:text-sm">
                <tr className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-3.5 px-3 sm:px-5 font-medium text-stone-900">주일 대예배</td>
                  <td className="py-3.5 px-3 sm:px-5 text-stone-600">주일 오전 11:00</td>
                  <td className="py-3.5 px-3 sm:px-5 text-stone-500">본당</td>
                </tr>
                <tr className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-3.5 px-3 sm:px-5 font-medium text-stone-900">수요예배</td>
                  <td className="py-3.5 px-3 sm:px-5 text-stone-600">수요일 오후 7:30</td>
                  <td className="py-3.5 px-3 sm:px-5 text-stone-500">본당</td>
                </tr>
                <tr className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-3.5 px-3 sm:px-5 font-medium text-stone-900">금요 다함께 기도회</td>
                  <td className="py-3.5 px-3 sm:px-5 text-stone-600">금요일 오후 8:30</td>
                  <td className="py-3.5 px-3 sm:px-5 text-stone-500">본당</td>
                </tr>
                <tr className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-3.5 px-3 sm:px-5 font-medium text-stone-900">새벽 기도회</td>
                  <td className="py-3.5 px-3 sm:px-5 text-stone-600">월-금 오전 5:30</td>
                  <td className="py-3.5 px-3 sm:px-5 text-stone-500">본당</td>
                </tr>
                <tr className="hover:bg-stone-50/50 transition-colors">
                  <td className="py-3.5 px-3 sm:px-5 font-medium text-stone-900">교회학교 예배</td>
                  <td className="py-3.5 px-3 sm:px-5 text-stone-600">주일 오전 11:00</td>
                  <td className="py-3.5 px-3 sm:px-5 text-stone-500">본관 1층</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Location Section */}
        <section id="location" className="bg-white p-5 sm:p-10 rounded-2xl sm:rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.03)] border border-stone-200/80 scroll-mt-24">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center mr-3">
                <MapPin size={18} />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-stone-900">오시는 길</h2>
            </div>
            
            {/* Direct Map Buttons */}
            <div className="flex items-center gap-2">
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
                  <div className="font-semibold text-stone-900 text-base">{address}</div>
                  <div className="text-xs text-stone-500 mt-0.5">대한예수교장로회(통합) 주님품교회</div>
                </div>
              </div>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 hover:text-stone-900 text-xs font-medium transition-colors self-start sm:self-auto"
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
                <strong className="text-stone-800 font-medium block mb-0.5">교통편 안내</strong>
                <p className="text-stone-500 leading-relaxed">
                  여서동 로터리 및 인근 버스정류장 하차 후 여서동 7길 방면 도보 3분
                </p>
              </div>
              <div>
                <strong className="text-stone-800 font-medium block mb-0.5">주차 안내</strong>
                <p className="text-stone-500 leading-relaxed">
                  교회 건물 주변 및 인근 공영주차장을 편리하게 이용하실 수 있습니다.
                </p>
              </div>
            </div>
          </div>

        </section>
      </div>
    </div>
  );
}
