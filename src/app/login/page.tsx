"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LogIn, User, Lock, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "로그인에 실패했습니다.");
        setLoading(false);
        return;
      }

      window.dispatchEvent(new Event("auth-change"));
      router.push("/");
      router.refresh();
    } catch {
      setError("서버와 통신 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center bg-[#FAF9F6] px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-stone-200/60">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest block mb-2">
            Member Login
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-stone-900 mb-2">
            로그인
          </h1>
          <p className="text-sm text-stone-500">
            주님품교회 온라인 공동체에 오신 것을 환영합니다.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              아이디 (또는 이메일)
            </label>
            <div className="relative">
              <User
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
              />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="아이디 또는 이메일을 입력하세요"
                className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-amber-600 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              비밀번호
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-amber-600 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-xl bg-amber-800 text-white text-sm font-semibold hover:bg-amber-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                로그인 중...
              </>
            ) : (
              <>
                <LogIn size={16} />
                로그인하기
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-stone-100 text-center space-y-4">
          <p className="text-xs text-stone-500">
            아직 계정이 없으신가요?{" "}
            <Link
              href="/signup"
              className="font-semibold text-amber-800 hover:underline ml-1"
            >
              회원가입
            </Link>
          </p>

          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-400 hover:text-stone-600 transition-colors"
            >
              <ArrowLeft size={14} />
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
