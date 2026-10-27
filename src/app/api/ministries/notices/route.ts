import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getMinistryNotices, createMinistryNotice } from "@/lib/notion";

export async function GET() {
  try {
    const notices = await getMinistryNotices();
    return NextResponse.json({ notices });
  } catch (error) {
    console.error("Failed to fetch ministry notices:", error);
    return NextResponse.json(
      { error: "공지사항을 불러오지 못했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "로그인한 성도님만 공지사항을 작성하실 수 있습니다." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, category, content } = body;

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: "제목과 내용을 모두 입력해 주세요." },
        { status: 400 }
      );
    }

    const author = `${user.name} ${user.role}`;
    const created = await createMinistryNotice({
      title: title.trim(),
      category: category || "전체",
      content: content.trim(),
      author,
    });

    return NextResponse.json({ notice: created });
  } catch (error) {
    console.error("Failed to create ministry notice:", error);
    return NextResponse.json(
      { error: "공지사항 등록 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
