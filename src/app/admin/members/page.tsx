"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  UserCheck,
  Clock,
  Trash2,
  Check,
  X,
  Phone,
  Users,
  Calendar,
  Loader2,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";

interface MemberItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  departments: string[];
  joinDate: string;
  status: "승인대기" | "승인완료";
  approved: boolean;
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/members", { cache: "no-store" });
      if (res.status === 403 || res.status === 401) {
        setUnauthorized(true);
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "회원 목록을 불러오지 못했습니다.");
      } else {
        setMembers(data.members || []);
      }
    } catch {
      setError("서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleApproval = async (id: string, approved: boolean) => {
    setProcessingId(id);
    try {
      const res = await fetch("/api/admin/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, approved }),
      });
      if (res.ok) {
        setMembers((prev) =>
          prev.map((m) =>
            m.id === id
              ? {
                  ...m,
                  approved,
                  status: approved ? "승인완료" : "승인대기",
                }
              : m
          )
        );
      } else {
        const data = await res.json();
        alert(data.error || "승인 상태 변경에 실패했습니다.");
      }
    } catch {
      alert("서버 통신 중 오류가 발생했습니다.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`'${name}' 회원의 가입 정보를 삭제하시겠습니까?`)) return;
    setProcessingId(id);
    try {
      const res = await fetch("/api/admin/members", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "삭제에 실패했습니다.");
      }
    } catch {
      alert("서버 통신 중 오류가 발생했습니다.");
    } finally {
      setProcessingId(null);
    }
  };

  if (unauthorized) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center bg-[#FAF9F6] px-4 py-16">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-stone-200/80 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-xl font-bold text-stone-900 mb-2">
            마스터(교역자) 전용 메뉴입니다
          </h1>
          <p className="text-sm text-stone-500 leading-relaxed mb-6">
            회원 승인 및 교인 명부 관리는 교역자(마스터) 계정으로 로그인 후 이용하실 수 있습니다.
          </p>
          <div className="flex gap-3">
            <Link
              href="/login?redirect=/admin/members"
              className="flex-1 py-3 rounded-xl bg-amber-800 text-white text-sm font-semibold hover:bg-amber-900 transition-colors"
            >
              로그인하기
            </Link>
            <Link
              href="/"
              className="flex-1 py-3 rounded-xl bg-stone-100 text-stone-700 text-sm font-semibold hover:bg-stone-200 transition-colors"
            >
              홈으로
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const pendingMembers = members.filter((m) => !m.approved);
  const approvedMembers = members.filter((m) => m.approved);

  return (
    <div className="min-h-[80vh] bg-[#FAF9F6] py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 uppercase tracking-widest mb-1.5">
              <ShieldCheck size={14} />
              Master Admin
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">
              회원가입 승인 및 교인 관리
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              새로 가입 신청한 성도님을 승인하거나 노션 교인 명부와 연동된 회원 현황을 관리합니다.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={fetchMembers}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-xs sm:text-sm font-semibold text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              새로고침
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-100 text-xs sm:text-sm font-semibold text-stone-700 hover:bg-stone-200 transition-colors"
            >
              <ArrowLeft size={15} />
              홈으로
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-3xl border border-stone-200/70 p-16 text-center">
            <Loader2 size={28} className="animate-spin text-amber-800 mx-auto mb-3" />
            <p className="text-sm text-stone-500 font-medium">
              교인 명부를 불러오는 중입니다...
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* 승인 대기 섹션 */}
            <section className="bg-white rounded-3xl border border-amber-200/90 shadow-xs overflow-hidden">
              <div className="px-6 py-4 bg-amber-50/70 border-b border-amber-200/70 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-amber-800" />
                  <h2 className="text-base sm:text-lg font-bold text-stone-900">
                    승인 대기 회원
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-800 text-white">
                    {pendingMembers.length}명
                  </span>
                </div>
              </div>

              {pendingMembers.length === 0 ? (
                <div className="p-10 text-center text-sm text-stone-400">
                  현재 승인 대기 중인 회원가입 신청이 없습니다.
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {pendingMembers.map((member) => (
                    <div
                      key={member.id}
                      className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-amber-50/20 transition-colors"
                    >
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-base font-bold text-stone-900">
                            {member.name}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900">
                            {member.role}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-300">
                            승인대기
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500">
                          <span>아이디: {member.email}</span>
                          {member.phone && (
                            <span className="inline-flex items-center gap-1">
                              <Phone size={12} />
                              {member.phone}
                            </span>
                          )}
                          {member.departments.length > 0 && (
                            <span className="inline-flex items-center gap-1 text-amber-800 font-medium">
                              <Users size={12} />
                              {member.departments.join(", ")}
                            </span>
                          )}
                          {member.joinDate && (
                            <span className="inline-flex items-center gap-1">
                              <Calendar size={12} />
                              신청일: {member.joinDate}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={processingId === member.id}
                          onClick={() => handleApproval(member.id, true)}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-800 text-white text-xs sm:text-sm font-semibold hover:bg-amber-900 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          {processingId === member.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Check size={15} />
                          )}
                          가입 승인
                        </button>
                        <button
                          type="button"
                          disabled={processingId === member.id}
                          onClick={() => handleDelete(member.id, member.name)}
                          className="inline-flex items-center gap-1 px-3.5 py-2.5 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs sm:text-sm font-semibold hover:bg-red-100 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          <Trash2 size={14} />
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 승인 완료 회원 목록 */}
            <section className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
              <div className="px-6 py-4 bg-stone-50 border-b border-stone-200/70 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck size={18} className="text-emerald-700" />
                  <h2 className="text-base sm:text-lg font-bold text-stone-900">
                    승인 완료 교인 목록
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    {approvedMembers.length}명
                  </span>
                </div>
              </div>

              {approvedMembers.length === 0 ? (
                <div className="p-10 text-center text-sm text-stone-400">
                  등록된 교인이 없습니다.
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {approvedMembers.map((member) => (
                    <div
                      key={member.id}
                      className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/60 transition-colors"
                    >
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-base font-bold text-stone-900">
                            {member.name}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
                            {member.role}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            승인완료
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500">
                          <span>아이디: {member.email}</span>
                          {member.phone && (
                            <span className="inline-flex items-center gap-1">
                              <Phone size={12} />
                              {member.phone}
                            </span>
                          )}
                          {member.departments.length > 0 && (
                            <span className="inline-flex items-center gap-1 text-amber-800 font-medium">
                              <Users size={12} />
                              {member.departments.join(", ")}
                            </span>
                          )}
                          {member.joinDate && (
                            <span className="inline-flex items-center gap-1">
                              <Calendar size={12} />
                              가입일: {member.joinDate}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={processingId === member.id}
                          onClick={() => handleApproval(member.id, false)}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-stone-100 text-stone-600 text-xs font-semibold hover:bg-stone-200 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          <X size={13} />
                          승인취소
                        </button>
                        <button
                          type="button"
                          disabled={processingId === member.id}
                          onClick={() => handleDelete(member.id, member.name)}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          <Trash2 size={13} />
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
