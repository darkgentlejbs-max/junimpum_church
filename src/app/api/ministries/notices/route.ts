import { NextResponse } from "next/server";
import { getCurrentUser, canAccessDepartmentBoard } from "@/lib/auth";
import {
  getMinistryNotices,
  createMinistryNotice,
  updateMinistryNotice,
  deleteMinistryNotice,
  findMemberByEmail,
} from "@/lib/notion";

async function getLiveDepartments(email: string, fallback?: string[]) {
  try {
    const member = await findMemberByEmail(email);
    if (member && Array.isArray(member.departments)) {
      return member.departments;
    }
  } catch {
    // ignore
  }
  return Array.isArray(fallback) ? fallback : [];
}

export async function GET() {
  try {
    const notices = await getMinistryNotices();
    return NextResponse.json({ notices });
  } catch (error) {
    console.error("Failed to fetch ministry notices:", error);
    return NextResponse.json(
      { error: "게시글을 불러오지 못했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "로그인한 성도님만 글을 작성하실 수 있습니다." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, category, content } = body;
    const targetCategory = category || "전체";

    const userDepts = await getLiveDepartments(user.email, user.departments);
    if (!canAccessDepartmentBoard(userDepts, targetCategory)) {
      const displayLabel = targetCategory === "교회학교" ? "학생부" : targetCategory;
      return NextResponse.json(
        { error: `${displayLabel} 소속으로 등록된 회원만 작성하실 수 있습니다.` },
        { status: 403 }
      );
    }

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: "제목과 내용을 모두 입력해 주세요." },
        { status: 400 }
      );
    }

    const author = `${user.name} ${user.role}`;
    const created = await createMinistryNotice({
      title: title.trim(),
      category: targetCategory,
      content: content.trim(),
      author,
    });

    return NextResponse.json({ notice: created });
  } catch (error) {
    console.error("Failed to create ministry notice:", error);
    return NextResponse.json(
      { error: "게시글 등록 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "로그인한 성도님만 글을 수정하실 수 있습니다." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, title, category, content } = body;
    const targetCategory = category || "전체";

    const userDepts = await getLiveDepartments(user.email, user.departments);
    if (!canAccessDepartmentBoard(userDepts, targetCategory)) {
      const displayLabel = targetCategory === "교회학교" ? "학생부" : targetCategory;
      return NextResponse.json(
        { error: `${displayLabel} 소속으로 등록된 회원만 수정하실 수 있습니다.` },
        { status: 403 }
      );
    }

    if (!id || !title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: "제목과 내용을 모두 입력해 주세요." },
        { status: 400 }
      );
    }

    const updated = await updateMinistryNotice({
      id,
      title: title.trim(),
      category: targetCategory,
      content: content.trim(),
    });

    return NextResponse.json({ notice: updated });
  } catch (error) {
    console.error("Failed to update ministry notice:", error);
    return NextResponse.json(
      { error: "게시글 수정 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "로그인한 성도님만 글을 삭제하실 수 있습니다." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, category } = body;

    if (category) {
      const userDepts = await getLiveDepartments(user.email, user.departments);
      if (!canAccessDepartmentBoard(userDepts, category)) {
        const displayLabel = category === "교회학교" ? "학생부" : category;
        return NextResponse.json(
          { error: `${displayLabel} 소속으로 등록된 회원만 삭제하실 수 있습니다.` },
          { status: 403 }
        );
      }
    }

    if (!id) {
      return NextResponse.json(
        { error: "삭제할 게시글 정보가 없습니다." },
        { status: 400 }
      );
    }

    await deleteMinistryNotice(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete ministry notice:", error);
    return NextResponse.json(
      { error: "게시글 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
