import { NextResponse } from "next/server";
import { getNews, getSchedule, getMinistryNotices } from "@/lib/notion";
import { isNewItem } from "@/components/NewBadge";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [rawNews, schedules, ministryNotices] = await Promise.all([
      getNews(),
      getSchedule(),
      getMinistryNotices(),
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

    const validMinistries = (ministryNotices || []).filter(
      (m: any) => m.id !== "empty"
    );

    // 최근 3일 이내 새 소식
    const recentNotices = notices.filter((n: any) =>
      isNewItem(n.date, n.createdTime, 3)
    );

    // 최근 3일 이내 생성되었거나 앞으로 3일 이내의 새 일정
    const recentSchedules = validSchedules.filter((s: any) =>
      isNewItem(s.date, s.createdTime, 3)
    );

    // 최근 3일 이내 새 사역/기관 공지
    const recentMinistries = validMinistries.filter((m: any) =>
      isNewItem(m.date, m.createdTime, 3)
    );

    const menNotices = recentMinistries.filter((m: any) => m.category === "남선교회");
    const womenNotices = recentMinistries.filter((m: any) => m.category === "여전도회");
    const schoolNotices = recentMinistries.filter((m: any) => m.category === "교회학교");
    const worshipNotices = recentMinistries.filter((m: any) => m.category === "찬양팀");

    const newNoticesCount = recentNotices.length;
    const newSchedulesCount = recentSchedules.length;
    const newMinistriesCount = recentMinistries.length;
    const totalNewCount = newNoticesCount + newSchedulesCount + newMinistriesCount;

    return NextResponse.json({
      hasNew: newNoticesCount + newSchedulesCount > 0,
      hasNewMinistries: newMinistriesCount > 0,
      totalNewCount,
      newNoticesCount,
      newSchedulesCount,
      newMinistriesCount,
      menNoticesCount: menNotices.length,
      womenNoticesCount: womenNotices.length,
      schoolNoticesCount: schoolNotices.length,
      worshipNoticesCount: worshipNotices.length,
      recentNotices: recentNotices.map((n: any) => ({
        id: n.id,
        title: n.title,
        date: n.date,
        createdTime: n.createdTime || n.date || "",
      })),
      recentSchedules: recentSchedules.map((s: any) => ({
        id: s.id,
        title: s.title,
        date: s.date,
        createdTime: s.createdTime || s.date || "",
      })),
      recentMinistries: recentMinistries.map((m: any) => ({
        id: m.id,
        title: m.title,
        category: m.category,
        date: m.date,
        createdTime: m.createdTime || m.date || "",
      })),
    });
  } catch (error) {
    console.error("Error in /api/news/notifications:", error);
    return NextResponse.json(
      {
        hasNew: false,
        hasNewMinistries: false,
        totalNewCount: 0,
        newNoticesCount: 0,
        newSchedulesCount: 0,
        newMinistriesCount: 0,
        menNoticesCount: 0,
        womenNoticesCount: 0,
        schoolNoticesCount: 0,
        worshipNoticesCount: 0,
        recentNotices: [],
        recentSchedules: [],
        recentMinistries: [],
      },
      { status: 200 }
    );
  }
}
