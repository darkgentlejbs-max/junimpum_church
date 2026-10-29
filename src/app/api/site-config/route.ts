import { NextResponse } from "next/server";
import { getCurrentUser, isMasterRole } from "@/lib/auth";
import { findMemberByEmail, getSiteConfig, saveSiteConfig } from "@/lib/notion";

async function checkMasterPermission(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  if (isMasterRole(user.role)) return true;
  if (user.email) {
    try {
      const liveMember = await findMemberByEmail(user.email);
      if (liveMember && isMasterRole(liveMember.role)) return true;
    } catch {
      // ignore
    }
  }
  return false;
}

export async function GET() {
  try {
    const config = await getSiteConfig();
    return NextResponse.json({ config });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "설정을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const canWrite = await checkMasterPermission();
    if (!canWrite) {
      return NextResponse.json(
        { error: "담임목사님 및 사모님만 수정하실 수 있습니다." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { section, data } = body;
    if (!section || !["home", "about", "ministries"].includes(section) || !data) {
      return NextResponse.json(
        { error: "잘못된 요청입니다." },
        { status: 400 }
      );
    }

    const updated = await saveSiteConfig(section, data);
    return NextResponse.json({ ok: true, data: updated });
  } catch (error: any) {
    console.error("Save site config error:", error);
    return NextResponse.json(
      { error: error?.message || "저장 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
