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
  Pencil,
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

const ROLE_OPTIONS = ["성도", "새가족", "집사", "권사", "장로", "담임목사", "사모"];
const DEPARTMENT_OPTIONS = ["남선교회", "여전도회", "학생부", "찬양팀"];

export default function AdminMembersPage() {
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // 회원 정보 수정 모달 상태
  const [editingMember, setEditingMember] = useState<MemberItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editRole, setEditRole] = useState("성도");
  const [editDepartments, setEditDepartments] = useState<string[]>([]);
  const [editApproved, setEditApproved] = useState(true);
  const [editNewPassword, setEditNewPassword] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");

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

  const openEditModal = (member: MemberItem) => {
    setEditingMember(member);
    setEditName(member.name);
    setEditEmail(member.email);
    setEditPhone(member.phone || "");
    setEditRole(ROLE_OPTIONS.includes(member.role) ? member.role : "성도");
    setEditDepartments(Array.isArray(member.departments) ? member.departments : []);
    setEditApproved(member.approved);
    setEditNewPassword("");
    setEditError("");
  };

  const toggleEditDepartment = (dept: string) => {
    setEditDepartments((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    setEditError("");

    if (!editName.trim()) {
      setEditError("이름을 입력해 주세요.");
      return;
    }

    setSavingEdit(true);
    try {
      const res = await fetch("/api/admin/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingMember.id,
          name: editName.trim(),
          email: editEmail.trim(),
          phone: editPhone.trim(),
          role: editRole,
          departments: editDepartments,
          approved: editApproved,
          newPassword: editNewPassword.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setEditError(data.error || "회원 정보 수정에 실패했습니다.");
        setSavingEdit(false);
        return;
      }

      setMembers((prev) =>
        prev.map((m) =>
          m.id === editingMember.id
            ? {
                ...m,
                name: editName.trim(),
                email: editEmail.trim(),
                phone: editPhone.trim(),
                role: editRole,
                departments: editDepartments,
                approved: editApproved,
                status: editApproved ? "승인완료" : "승인대기",
              }
            : m
        )
      );
      setEditingMember(null);
      window.dispatchEvent(new Event("auth-change"));
    } catch {
      setEditError("서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setSavingEdit(false);
    }
  };

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

  const handleDelete = async (id: string) => {
    setProcessingId(id);
    try {
      const res = await fetch("/api/admin/members", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
        setConfirmDeleteId(null);
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
            담임목사 · 사모 전용 메뉴입니다
          </h1>
          <p className="text-sm text-stone-500 leading-relaxed mb-6">
            회원 승인 및 교인 명부 관리는 담임목사님 또는 사모님 계정으로 로그인 후 이용하실 수 있습니다.
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
              Member Management
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">
              회원관리 (가입 승인 · 수정 · 삭제)
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              새로 가입 신청한 성도님을 승인하거나 등록된 교인의 직분·소속기관·연락처 등 회원 정보를 수정 및 삭제합니다.
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

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          disabled={processingId === member.id}
                          onClick={() => handleApproval(member.id, true)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-800 text-white text-xs sm:text-sm font-semibold hover:bg-amber-900 transition-colors disabled:opacity-50 cursor-pointer"
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
                          onClick={() => openEditModal(member)}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs sm:text-sm font-semibold hover:bg-amber-50 hover:text-amber-800 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          <Pencil size={13} />
                          수정
                        </button>
                        {confirmDeleteId === member.id ? (
                          <div className="inline-flex items-center gap-1 bg-red-50 border border-red-200 px-2.5 py-1.5 rounded-xl">
                            <span className="text-xs font-bold text-red-700">삭제?</span>
                            <button
                              type="button"
                              disabled={processingId === member.id}
                              onClick={() => handleDelete(member.id)}
                              className="px-2 py-1 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 cursor-pointer"
                            >
                              확인
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-1 rounded-lg bg-white border border-stone-200 text-stone-600 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
                            >
                              취소
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={processingId === member.id}
                            onClick={() => setConfirmDeleteId(member.id)}
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs sm:text-sm font-semibold hover:bg-red-100 transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            <Trash2 size={14} />
                            삭제
                          </button>
                        )}
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
                    등록된 교인 목록 (승인 완료)
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

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          disabled={processingId === member.id}
                          onClick={() => openEditModal(member)}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200/80 text-xs font-semibold hover:bg-amber-100 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          <Pencil size={13} />
                          수정
                        </button>
                        <button
                          type="button"
                          disabled={processingId === member.id}
                          onClick={() => handleApproval(member.id, false)}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-stone-100 text-stone-600 text-xs font-semibold hover:bg-stone-200 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          <X size={13} />
                          승인취소
                        </button>
                        {confirmDeleteId === member.id ? (
                          <div className="inline-flex items-center gap-1 bg-red-50 border border-red-200 px-2.5 py-1.5 rounded-xl">
                            <span className="text-xs font-bold text-red-700">삭제?</span>
                            <button
                              type="button"
                              disabled={processingId === member.id}
                              onClick={() => handleDelete(member.id)}
                              className="px-2 py-1 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 cursor-pointer"
                            >
                              확인
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-1 rounded-lg bg-white border border-stone-200 text-stone-600 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
                            >
                              취소
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={processingId === member.id}
                            onClick={() => setConfirmDeleteId(member.id)}
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            <Trash2 size={13} />
                            삭제
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      {/* 회원 정보 수정 모달 */}
      {editingMember && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
          onClick={() => setEditingMember(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200/80 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900">
                회원 정보 수정 ({editingMember.name})
              </h3>
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {editError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-600">
                  {editError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    이름 *
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    직분 *
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:border-amber-600"
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    아이디
                  </label>
                  <input
                    type="text"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    연락처
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="010-0000-0000"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                  소속기관 (복수 선택 가능)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {DEPARTMENT_OPTIONS.map((dept) => {
                    const checked = editDepartments.includes(dept);
                    return (
                      <button
                        key={dept}
                        type="button"
                        onClick={() => toggleEditDepartment(dept)}
                        className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                          checked
                            ? "bg-amber-50 border-amber-500 text-amber-900"
                            : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        <span>{dept}</span>
                        {checked && <Check size={14} className="text-amber-700" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  가입 승인 상태
                </label>
                <select
                  value={editApproved ? "approved" : "pending"}
                  onChange={(e) => setEditApproved(e.target.value === "approved")}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:border-amber-600"
                >
                  <option value="approved">승인완료 (로그인 및 활동 가능)</option>
                  <option value="pending">승인대기</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  비밀번호 재설정 (변경 시에만 입력)
                </label>
                <input
                  type="password"
                  value={editNewPassword}
                  onChange={(e) => setEditNewPassword(e.target.value)}
                  placeholder="비워두시면 기존 비밀번호가 유지됩니다"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 text-sm font-medium hover:bg-stone-50 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-sm font-semibold disabled:opacity-60 cursor-pointer"
                >
                  {savingEdit && <Loader2 size={14} className="animate-spin" />}
                  <span>저장하기</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
