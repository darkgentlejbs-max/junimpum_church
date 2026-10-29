"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  UserPlus,
  User,
  KeyRound,
  Lock,
  Phone,
  Award,
  Users,
  Music,
  Check,
  Loader2,
} from "lucide-react";

const ROLES = ["성도", "새가족", "집사", "권사", "장로", "담임목사", "사모"];
const ORGANIZATIONS = ["남선교회", "여전도회", "학생부"];

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("성도");
  const [organization, setOrganization] = useState("");
  const [inPraiseTeam, setInPraiseTeam] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submittedUser, setSubmittedUser] = useState<{ name: string; role: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 4) {
      setError("비밀번호는 최소 4자 이상 입력해 주세요.");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 서로 일치하지 않습니다.");
      return;
    }

    setLoading(true);

    const departments: string[] = [];
    if (organization) departments.push(organization);
    if (inPraiseTeam) departments.push("찬양팀");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          role,
          departments,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "회원가입에 실패했습니다.");
        setLoading(false);
        return;
      }

      if (data.pendingApproval) {
        setSubmittedUser({ name, role });
        setLoading(false);
        return;
      }

      sessionStorage.setItem("welcome_user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("auth-change"));
      router.push("/");
      router.refresh();
    } catch {
      setError("서버와 통신 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  if (submittedUser) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#FAF9F6] px-4 py-12">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-amber-200/80 text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl border border-amber-200 bg-amber-50 flex items-center justify-center text-amber-800">
            <Check size={30} />
          </div>
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest block mb-2">
            Registration Submitted
          </span>
          <h1 className="text-2xl font-bold text-stone-900 mb-3 break-keep">
            회원가입 신청이 완료되었습니다
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed mb-6 break-keep">
            <strong className="text-stone-900">{submittedUser.name} {submittedUser.role}</strong>님, 주님품교회 온라인 공동체 가입 신청을 환영합니다.<br />
            안전한 교회 공동체 운영을 위해 <strong className="text-amber-800 font-semibold">마스터(관리자)의 승인 후</strong> 로그인하여 모든 메뉴를 이용하실 수 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/login"
              className="flex-1 py-3.5 rounded-xl bg-amber-800 text-white text-sm font-semibold hover:bg-amber-900 transition-colors"
            >
              로그인 화면으로
            </Link>
            <Link
              href="/"
              className="flex-1 py-3.5 rounded-xl bg-stone-100 text-stone-700 text-sm font-semibold hover:bg-stone-200 transition-colors"
            >
              홈으로 가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#FAF9F6] px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-stone-200/60">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold text-amber-800 uppercase tracking-widest block mb-2">
            Join Us
          </span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-stone-900 mb-2">
            회원가입
          </h1>
          <p className="text-sm text-stone-500">
            주님품교회 성도 등록을 환영합니다.
          </p>
          <p className="text-xs text-amber-800/80 mt-1 font-medium">
            * 가입 신청 후 마스터(관리자) 승인 시 로그인이 가능합니다.
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
                placeholder="홍길동"
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
                placeholder="쉬운 아이디(예: hong123) 또는 이메일"
                className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-amber-600 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                비밀번호 <span className="text-red-500">*</span>
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
                  placeholder="4자 이상"
                  className="w-full pl-10 pr-3 py-3 text-sm rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-amber-600 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                비밀번호 확인 <span className="text-red-500">*</span>
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
                  placeholder="비밀번호 재입력"
                  className="w-full pl-10 pr-3 py-3 text-sm rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-amber-600 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                연락처
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
                  className="w-full pl-10 pr-3 py-3 text-sm rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-amber-600 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                직분
              </label>
              <div className="relative">
                <Award
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-amber-600 transition-colors"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 소속기관 선택 */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700">
                <Users size={14} className="text-amber-700" />
                <span>
                  소속기관 <span className="text-stone-400 font-normal">(선택)</span>
                </span>
              </label>
              <span className="text-[11px] text-stone-400">
                선택하지 않아도 가입 가능합니다
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {ORGANIZATIONS.map((org) => {
                const selected = organization === org;
                return (
                  <button
                    key={org}
                    type="button"
                    onClick={() => setOrganization(selected ? "" : org)}
                    className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      selected
                        ? "bg-amber-800 text-white border-amber-800 shadow-2xs"
                        : "bg-stone-50/70 text-stone-600 border-stone-200 hover:border-amber-300 hover:bg-amber-50/50"
                    }`}
                  >
                    {selected && <Check size={14} />}
                    <span>{org}</span>
                  </button>
                );
              })}
            </div>

            {/* 찬양팀 복수 선택 */}
            <div className="mt-2.5">
              <button
                type="button"
                onClick={() => setInPraiseTeam(!inPraiseTeam)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer flex items-center justify-between ${
                  inPraiseTeam
                    ? "bg-amber-50 text-amber-900 border-amber-500 shadow-2xs"
                    : "bg-stone-50/50 text-stone-600 border-stone-200 hover:border-amber-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Music
                    size={15}
                    className={inPraiseTeam ? "text-amber-700" : "text-stone-400"}
                  />
                  <span>찬양팀 (복수 선택 가능)</span>
                </div>
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                    inPraiseTeam
                      ? "bg-amber-800 border-amber-800 text-white"
                      : "bg-white border-stone-300 text-transparent"
                  }`}
                >
                  <Check size={13} />
                </div>
              </button>
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
                가입 처리 중...
              </>
            ) : (
              <>
                <UserPlus size={16} />
                회원가입 신청
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-stone-100 text-center space-y-4">
          <p className="text-xs text-stone-500">
            이미 계정이 있으신가요?{" "}
            <Link
              href="/login"
              className="font-semibold text-amber-800 hover:underline ml-1"
            >
              로그인
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
