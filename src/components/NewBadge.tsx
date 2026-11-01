/**
 * 새로운 소식 및 일정 판별 유틸리티 & 'N' 뱃지 컴포넌트
 */

/**
 * 게시글 또는 일정이 새로운 항목인지 판별
 * @param dateStr 날짜 문자열 (예: '2026-11-01')
 * @param createdTimeStr 생성 일시 (예: Notion page.created_time ISO 문자열)
 * @param daysLimit 며칠 이내를 신규로 볼 것인지 (기본 7일)
 */
export function isNewItem(
  dateStr?: string,
  createdTimeStr?: string,
  daysLimit = 7
): boolean {
  const now = new Date().getTime();
  const limitMs = daysLimit * 24 * 60 * 60 * 1000;

  // 1. createdTime 기준 (최근 N일 이내 생성된 경우)
  if (createdTimeStr) {
    const created = new Date(createdTimeStr).getTime();
    if (!isNaN(created) && now - created >= 0 && now - created <= limitMs) {
      return true;
    }
  }

  // 2. dateStr 기준 (최근 N일 이내 날짜이거나, 또는 앞으로 N일 이내에 있는 새 일정)
  if (dateStr && dateStr !== "-" && dateStr !== "날짜 미정" && dateStr !== "날짜 없음") {
    const d = new Date(dateStr.slice(0, 10)).getTime();
    if (!isNaN(d)) {
      const diff = now - d;
      // 최근 N일 이내에 등록된 글/행사이거나
      if (diff >= 0 && diff <= limitMs) {
        return true;
      }
      // 앞으로 N일 이내에 있을 새 일정인 경우
      if (diff < 0 && Math.abs(diff) <= limitMs) {
        return true;
      }
    }
  }

  return false;
}

export default function NewBadge({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeStyles = {
    sm: "w-3.5 h-3.5 text-[9px]",
    md: "w-4 h-4 text-[10px]",
    lg: "w-5 h-5 text-xs",
  }[size];

  return (
    <span
      className={`inline-flex items-center justify-center bg-[#F1731C] text-white font-black leading-none rounded-full shadow-2xs select-none shrink-0 animate-in fade-in zoom-in-75 duration-300 ${sizeStyles} ${className}`}
      title="새로운 소식/일정 (NEW)"
    >
      N
    </span>
  );
}
