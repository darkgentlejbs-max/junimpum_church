import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FAF9F6] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border border-stone-200/60 text-center">
        <h1 className="text-2xl font-semibold text-stone-900 mb-2">회원가입</h1>
        <p className="text-sm text-stone-500 mb-8">서비스 준비 중입니다.</p>
        
        <div className="bg-stone-50 rounded-2xl p-6 mb-8 text-sm text-stone-600">
          온라인 회원가입 기능은 현재 준비 중입니다. <br/><br/>
          새가족 등록 및 안내는 <strong>주일 예배 후 새가족부(본관 1층)</strong>를 방문해 주시면 친절하게 안내해 드리겠습니다.
        </div>

        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-amber-800 hover:text-amber-900 transition-colors">
          <ArrowLeft size={16} />
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
