"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  KeyRound,
  User,
  Phone,
  Lock,
  CheckCircle2,
  Loader2,
  Search,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [tab, setTab] = useState<"reset" | "findId">("reset");

  // Password Reset states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Find ID states
  const [findName, setFindName] = useState("");
  const [findPhone, setFindPhone] = useState("");
  const [foundResult, setFoundResult] = useState<{
    foundId: string;
    name: string;
    role: string;
  } | null>(null);

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 4) {
      setError("새 비밀번호는 최소 4자 이상 입력해 주세요.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("새 비밀번호가 서로 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "reset-password",
          name,
          email,
          phone,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "비밀번호 변경에 실패했습니다.");
        setLoading(false);
        return;
      }

      setResetSuccess(true);
      setLoading(false);
    } catch {
      setError("서버와 통신 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  const handleFindIdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFoundResult(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "find-id",
          name: findName,
          phone: findPhone,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "아이디를 찾을 수 없습니다.");
        setLoading(false);
        return;
      }

      setFoundResult(data);
      setLoading(false);
    } catch {
      setError("서버와 통신 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center bg-[#FAF9F6] px-3 sm:px-4 py-10">
      <div className="w-full max-w-md bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-stone-200/60">
        <div className="text-center mb-6">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest block mb-2">
            Account Recovery
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-stone-900 mb-2">
            아이디 · 비밀번호 찾기
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            가입 시 등록한 정보로 아이디를 찾거나 새 비밀번호를 설정할 수 있습니다.
          </p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => {
              setTab("reset");
              setError("");
            }}
            className={`py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
              tab === "reset"
                ? "bg-white text-amber-800 shadow-xs"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            비밀번호 재설정
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("findId");
              setError("");
            }}
            className={`py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
              tab === "findId"
                ? "bg-white text-amber-800 shadow-xs"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            아이디 찾기
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-center">
            {error}
          </div>
        )}

        {tab === "reset" ? (
          resetSuccess ? (
            <div className="text-center py-6 space-y-5">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <CheckCircle2 size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-1.5">
                  비밀번호가 변경되었습니다!
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  새로 설정하신 비밀번호로 바로 로그인하실 수 있습니다.
                </p>
              </div>
              <Link
                href="/login"
                className="block w-full py-3.5 rounded-xl bg-amber-800 text-white text-sm font-semibold hover:bg-amber-900 transition-colors"
              >
                로그인하러 가기
              </Link>
            </div>
          ) : (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  이름 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                  />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="가입 시 입력한 이름 (예: 홍길동)"
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-amber-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  아이디 (또는 이메일) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <KeyRound
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                  />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="가입한 아이디 또는 이메일"
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-amber-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  연락처 <span className="text-stone-400 font-normal">(가입 시 등록한 경우 입력)</span>
                </label>
                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="010-0000-0000"
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-amber-600 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    새 비밀번호 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                    />
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="4자 이상"
                      className="w-full pl-10 pr-3 py-3 text-sm rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-amber-600 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    새 비밀번호 확인 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                    />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="다시 입력"
                      className="w-full pl-10 pr-3 py-3 text-sm rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-amber-600 transition-colors"
                    />
                  </div>
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
                    변경 처리 중...
                  </>
                ) : (
                  <>
                    <KeyRound size={16} />
                    새 비밀번호로 변경하기
                  </>
                )}
              </button>
            </form>
          )
        ) : (
          <div className="space-y-4">
            <form onSubmit={handleFindIdSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  이름 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                  />
                  <input
                    type="text"
                    required
                    value={findName}
                    onChange={(e) => setFindName(e.target.value)}
                    placeholder="가입 시 입력한 이름 (예: 홍길동)"
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-amber-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  연락처 <span className="text-stone-400 font-normal">(가입 시 등록한 경우 입력)</span>
                </label>
                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                  />
                  <input
                    type="tel"
                    value={findPhone}
                    onChange={(e) => setFindPhone(e.target.value)}
                    placeholder="010-0000-0000"
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
                    조회 중...
                  </>
                ) : (
                  <>
                    <Search size={16} />
                    내 아이디 찾기
                  </>
                )}
              </button>
            </form>

            {foundResult && (
              <div className="mt-5 p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-center space-y-3">
                <p className="text-xs sm:text-sm text-stone-700">
                  <strong>
                    {foundResult.name}
                    {foundResult.role}님
                  </strong>
                  의 가입 아이디는 다음과 같습니다:
                </p>
                <div className="py-2.5 px-4 bg-white rounded-xl border border-amber-200 font-mono text-base font-bold text-amber-900">
                  {foundResult.foundId}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setName(foundResult.name);
                    setEmail(foundResult.foundId);
                    setPhone(findPhone);
                    setTab("reset");
                  }}
                  className="text-xs font-semibold text-amber-800 hover:underline cursor-pointer"
                >
                  이 아이디로 비밀번호 재설정하기 &rarr;
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-stone-100 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-amber-800 transition-colors"
          >
            <ArrowLeft size={14} />
            로그인 화면으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
