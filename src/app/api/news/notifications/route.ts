import { NextResponse } from "next/server";
import { getNews, getSchedule } from "@/lib/notion";
import { isNewItem } from "@/components/NewBadge";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [rawNews, schedules] = await Promise.all([
      getNews(),
      getSchedule(),
    ]);

    // 사역/사이트 설정 제외
    const notices = (rawNews || []).filter(
      (n: any) =>
        n.id !== "empty" &&
        !n.title?.startsWith("[사역공지:") &&
        !n.title?.startsWith("[사이트설정:")
    );

    const validSchedules = (schedules || []).filter(
      (s: any) => s.id !== "empty" && s.date && s.date !== "-"
    );

    // 최근 7일 이내 새 소식
    const recentNotices = notices.filter((n: any) =>
      isNewItem(n.date, n.createdTime, 7)
    );

    // 최근 7일 이내 생성되었거나 앞으로 7일 이내의 새 일정
    const recentSchedules = validSchedules.filter((s: any) =>
      isNewItem(s.date, s.createdTime, 7)
    );

    const newNoticesCount = recentNotices.length;
    const newSchedulesCount = recentSchedules.length;
    const totalNewCount = newNoticesCount + newSchedulesCount;

    return NextResponse.json({
      hasNew: totalNewCount > 0,
      totalNewCount,
      newNoticesCount,
      newSchedulesCount,
      recentNotices: recentNotices.slice(0, 3).map((n: any) => ({
        id: n.id,
        title: n.title,
        date: n.date,
      })),
      recentSchedules: recentSchedules.slice(0, 3).map((s: any) => ({
        id: s.id,
        title: s.title,
        date: s.date,
      })),
    });
  } catch (error) {
    console.error("Error in /api/news/notifications:", error);
    return NextResponse.json(
      {
        hasNew: false,
        totalNewCount: 0,
        newNoticesCount: 0,
        newSchedulesCount: 0,
        recentNotices: [],
        recentSchedules: [],
      },
      { status: 200 }
    );
  }
}
