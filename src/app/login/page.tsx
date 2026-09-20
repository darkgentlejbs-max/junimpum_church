import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FAF9F6] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border border-stone-200/60 text-center">
        <h1 className="text-2xl font-semibold text-stone-900 mb-2">로그인</h1>
        <p className="text-sm text-stone-500 mb-8">서비스 준비 중입니다.</p>
        
        <div className="bg-stone-50 rounded-2xl p-6 mb-8 text-sm text-stone-600">
          현재 주님품교회 홈페이지는 <strong>별도의 로그인 없이</strong> 모든 정보를 열람하실 수 있도록 개방되어 있습니다. <br/><br/>
          추후 교적 관리 및 성도 전용 게시판 기능이 도입될 때 로그인 기능이 활성화될 예정입니다.
        </div>

        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-amber-800 hover:text-amber-900 transition-colors">
          <ArrowLeft size={16} />
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
