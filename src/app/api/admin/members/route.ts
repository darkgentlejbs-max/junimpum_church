import { NextResponse } from 'next/server';
import { getCurrentUser, isMasterRole } from '@/lib/auth';
import {
  findMemberByEmail,
  getAllMembers,
  updateMemberApproval,
  deleteMember,
} from '@/lib/notion';

async function checkMasterPermission(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  if (isMasterRole(user.role)) return true;

  try {
    const liveMember = await findMemberByEmail(user.email);
    if (liveMember && isMasterRole(liveMember.role)) {
      return true;
    }
  } catch {
    // ignore
  }
  return false;
}

export async function GET() {
  try {
    const isMaster = await checkMasterPermission();
    if (!isMaster) {
      return NextResponse.json(
        { error: '마스터(교역자) 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const members = await getAllMembers();
    return NextResponse.json({ members });
  } catch (error: any) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { error: '회원 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const isMaster = await checkMasterPermission();
    if (!isMaster) {
      return NextResponse.json(
        { error: '마스터(교역자) 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, approved } = body;

    if (!id || typeof approved !== 'boolean') {
      return NextResponse.json(
        { error: '회원 ID와 승인 상태값이 필요합니다.' },
        { status: 400 }
      );
    }

    await updateMemberApproval(id, approved);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating member approval:', error);
    return NextResponse.json(
      { error: '승인 상태 변경 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const isMaster = await checkMasterPermission();
    if (!isMaster) {
      return NextResponse.json(
        { error: '마스터(교역자) 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: '삭제할 회원 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    await deleteMember(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting member:', error);
    return NextResponse.json(
      { error: '회원 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
