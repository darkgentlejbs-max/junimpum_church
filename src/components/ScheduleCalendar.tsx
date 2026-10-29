"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import ScheduleItem from "@/components/ScheduleItem";
import MasterWriteButton from "@/components/MasterWriteModal";

interface ScheduleData {
  id: string;
  title: string;
  date: string;
  type: string;
  location: string;
  content?: string;
}

function getTypeStyle(type?: string) {
  switch (type) {
    case "예배":
      return {
        pill: "bg-amber-100 text-amber-900 border-amber-200",
        dot: "bg-amber-600",
      };
    case "집회":
      return {
        pill: "bg-purple-100 text-purple-900 border-purple-200",
        dot: "bg-purple-600",
      };
    case "행사":
      return {
        pill: "bg-emerald-100 text-emerald-900 border-emerald-200",
        dot: "bg-emerald-600",
      };
    case "모임":
      return {
        pill: "bg-sky-100 text-sky-900 border-sky-200",
        dot: "bg-sky-600",
      };
    default:
      return {
        pill: "bg-stone-100 text-stone-700 border-stone-200",
        dot: "bg-stone-500",
      };
  }
}

function formatYMD(year: number, monthIndex: number, day: number) {
  const m = String(monthIndex + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

export default function ScheduleCalendar({
  schedules,
  canWrite = false,
}: {
  schedules: ScheduleData[];
  canWrite?: boolean;
}) {
  const validSchedules = useMemo(
    () => schedules.filter((s) => s.id !== "empty" && s.date && s.date !== "-"),
    [schedules]
  );

  const now = new Date();
  const todayYMD = formatYMD(now.getFullYear(), now.getMonth(), now.getDate());

  const [currentYear, setCurrentYear] = useState<number>(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(now.getMonth()); // 0-indexed
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // 날짜별 일정 그룹화
  const schedulesByDate = useMemo(() => {
    const map: Record<string, ScheduleData[]> = {};
    for (const item of validSchedules) {
      const dateKey = item.date.slice(0, 10);
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(item);
    }
    return map;
  }, [validSchedules]);

  // 현재 보고 있는 달(YYYY-MM)의 일정 목록
  const currentMonthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`;
  const currentMonthSchedules = useMemo(() => {
    return validSchedules
      .filter((s) => s.date.startsWith(currentMonthPrefix))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [validSchedules, currentMonthPrefix]);

  // 달력 그리드 계산
  const calendarDays = useMemo(() => {
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0(일) ~ 6(토)
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    const cells: {
      dateStr: string;
      day: number;
      isCurrentMonth: boolean;
      dayOfWeek: number;
    }[] = [];

    // 이전 달 빈 칸 채우기
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      cells.push({
        dateStr: formatYMD(prevYear, prevMonth, d),
        day: d,
        isCurrentMonth: false,
        dayOfWeek: cells.length % 7,
      });
    }

    // 이번 달 날짜 채우기
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({
        dateStr: formatYMD(currentYear, currentMonth, d),
        day: d,
        isCurrentMonth: true,
        dayOfWeek: cells.length % 7,
      });
    }

    // 다음 달 빈 칸 채우기 (7의 배수로 맞춤)
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      cells.push({
        dateStr: formatYMD(nextYear, nextMonth, d),
        day: d,
        isCurrentMonth: false,
        dayOfWeek: cells.length % 7,
      });
    }

    return cells;
  }, [currentYear, currentMonth]);

  const handlePrevMonth = () => {
    setSelectedDate(null);
    if (currentMonth === 0) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    setSelectedDate(null);
    if (currentMonth === 11) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleGoToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDate(todayYMD);
  };

  const displayedSchedules = selectedDate
    ? schedulesByDate[selectedDate] || []
    : currentMonthSchedules;

  const formatSelectedDateLabel = (ymd: string) => {
    const parts = ymd.split("-");
    if (parts.length !== 3) return ymd;
    const dt = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    const weekNames = ["주일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    return `${Number(parts[0])}년 ${Number(parts[1])}월 ${Number(parts[2])}일 (${weekNames[dt.getDay()]})`;
  };

  const weekHeaders = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="space-y-6">
      {/* 달력 상단 컨트롤 바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-50/80 px-4 py-3 rounded-2xl border border-stone-200/70">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="w-8 h-8 rounded-xl bg-white border border-stone-200/80 flex items-center justify-center text-stone-600 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200 transition-colors cursor-pointer"
            aria-label="이전 달"
          >
            <ChevronLeft size={16} />
          </button>
          <h3 className="text-base sm:text-lg font-bold text-stone-900 min-w-[110px] text-center">
            {currentYear}년 {currentMonth + 1}월
          </h3>
          <button
            type="button"
            onClick={handleNextMonth}
            className="w-8 h-8 rounded-xl bg-white border border-stone-200/80 flex items-center justify-center text-stone-600 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200 transition-colors cursor-pointer"
            aria-label="다음 달"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* 분류 범례 (모바일/PC) */}
          <div className="hidden sm:flex items-center gap-2.5 mr-2 text-[11px] text-stone-500 font-medium">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-600" /> 예배
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600" /> 행사
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-600" /> 집회
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-sky-600" /> 모임
            </span>
          </div>

          <button
            type="button"
            onClick={handleGoToday}
            className="px-3 py-1.5 rounded-xl bg-white border border-stone-200/80 text-xs font-semibold text-stone-700 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200 transition-colors cursor-pointer"
          >
            오늘
          </button>
          {selectedDate && (
            <button
              type="button"
              onClick={() => setSelectedDate(null)}
              className="px-3 py-1.5 rounded-xl bg-amber-100/80 text-xs font-semibold text-amber-900 hover:bg-amber-200/70 transition-colors cursor-pointer"
            >
              월 전체보기
            </button>
          )}
        </div>
      </div>

      {/* 달력 본체 */}
      <div className="rounded-2xl border border-stone-200/80 overflow-hidden bg-white">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 bg-stone-50 border-b border-stone-200/80">
          {weekHeaders.map((day, idx) => (
            <div
              key={day}
              className={`py-2.5 text-center text-xs font-bold tracking-wider ${
                idx === 0
                  ? "text-rose-600"
                  : idx === 6
                  ? "text-blue-600"
                  : "text-stone-600"
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 divide-x divide-y divide-stone-100">
          {calendarDays.map((cell) => {
            const daySchedules = schedulesByDate[cell.dateStr] || [];
            const isToday = cell.dateStr === todayYMD;
            const isSelected = cell.dateStr === selectedDate;
            const hasEvents = daySchedules.length > 0;

            return (
              <div
                key={cell.dateStr}
                onClick={() => {
                  if (!cell.isCurrentMonth) {
                    const [y, m] = cell.dateStr.split("-").map(Number);
                    setCurrentYear(y);
                    setCurrentMonth(m - 1);
                    setSelectedDate(cell.dateStr);
                  } else {
                    setSelectedDate(isSelected ? null : cell.dateStr);
                  }
                }}
                className={`min-h-[72px] sm:min-h-[96px] p-1.5 sm:p-2 transition-colors cursor-pointer flex flex-col justify-between ${
                  !cell.isCurrentMonth
                    ? "bg-stone-50/40 text-stone-300"
                    : isSelected
                    ? "bg-amber-50/70 ring-2 ring-inset ring-amber-500/70"
                    : hasEvents
                    ? "bg-white hover:bg-amber-50/30"
                    : "bg-white hover:bg-stone-50/70"
                }`}
              >
                {/* 상단: 날짜 숫자 및 오늘 표시 */}
                <div className="flex items-center justify-between">
                  <span
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold ${
                      isToday
                        ? "bg-amber-800 text-white font-bold shadow-2xs"
                        : !cell.isCurrentMonth
                        ? "text-stone-300"
                        : cell.dayOfWeek === 0
                        ? "text-rose-600"
                        : cell.dayOfWeek === 6
                        ? "text-blue-600"
                        : "text-stone-700"
                    }`}
                  >
                    {cell.day}
                  </span>
                  {hasEvents && (
                    <span className="sm:hidden flex items-center gap-0.5 pr-0.5">
                      {daySchedules.slice(0, 3).map((ev) => (
                        <span
                          key={ev.id}
                          className={`w-1.5 h-1.5 rounded-full ${getTypeStyle(ev.type).dot}`}
                        />
                      ))}
                    </span>
                  )}
                </div>

                {/* 하단: 일정 배지 표시 */}
                <div className="mt-1 space-y-1 overflow-hidden">
                  {daySchedules.slice(0, 2).map((ev) => {
                    const style = getTypeStyle(ev.type);
                    return (
                      <div
                        key={ev.id}
                        className={`px-1.5 py-0.5 rounded-md border text-[10px] sm:text-[11px] font-medium truncate leading-tight ${style.pill}`}
                        title={ev.title}
                      >
                        {ev.title}
                      </div>
                    );
                  })}
                  {daySchedules.length > 2 && (
                    <div className="text-[10px] text-amber-800 font-semibold pl-1">
                      +{daySchedules.length - 2}건 더보기
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 선택된 날짜 또는 해당 월의 상세 일정 목록 */}
      <div className="pt-2">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 px-1">
          <div className="flex items-center gap-2">
            <CalendarIcon size={15} className="text-amber-800" />
            <h4 className="text-sm sm:text-base font-bold text-stone-800">
              {selectedDate
                ? `${formatSelectedDateLabel(selectedDate)} 일정 (${displayedSchedules.length}건)`
                : `${currentYear}년 ${currentMonth + 1}월 전체 일정 (${displayedSchedules.length}건)`}
            </h4>
          </div>
          {canWrite && selectedDate && (
            <MasterWriteButton
              menuType="schedule"
              buttonLabel="선택 날짜에 일정 등록"
              defaultDate={selectedDate}
            />
          )}
        </div>

        {displayedSchedules.length === 0 ? (
          <div className="text-center py-8 bg-stone-50/70 rounded-2xl border border-stone-200/60 px-4">
            <p className="text-sm text-stone-500">
              {selectedDate
                ? "선택하신 날짜에 등록된 일정이 없습니다."
                : `${currentYear}년 ${currentMonth + 1}월에 등록된 일정이 없습니다.`}
            </p>
            {selectedDate && (
              <button
                type="button"
                onClick={() => setSelectedDate(null)}
                className="mt-2 text-xs font-semibold text-amber-800 hover:underline cursor-pointer"
              >
                {currentMonth + 1}월 전체 일정 보기
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {displayedSchedules.map((item) => (
              <ScheduleItem key={item.id} item={item} canWrite={canWrite} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
