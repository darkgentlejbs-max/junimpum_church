import { NextResponse } from 'next/server';
import { getCurrentUser, isMasterRole, hashPassword } from '@/lib/auth';
import {
  findMemberByEmail,
  getAllMembers,
  updateMemberApproval,
  updateMemberInfo,
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
        { error: '마스터(담임목사 · 사모) 권한이 필요합니다.' },
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
        { error: '마스터(담임목사 · 사모) 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      id,
      approved,
      name,
      email,
      phone,
      role,
      departments,
      newPassword,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: '회원 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 단순 승인/승인취소 토글인 경우
    if (
      typeof approved === 'boolean' &&
      name === undefined &&
      email === undefined &&
      phone === undefined &&
      role === undefined &&
      departments === undefined &&
      !newPassword
    ) {
      await updateMemberApproval(id, approved);
      return NextResponse.json({ success: true });
    }

    // 회원 정보 수정인 경우
    const passwordHash =
      typeof newPassword === 'string' && newPassword.trim().length > 0
        ? hashPassword(newPassword.trim())
        : undefined;

    await updateMemberInfo({
      id,
      name,
      email,
      phone,
      role,
      departments,
      approved,
      passwordHash,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating member:', error);
    return NextResponse.json(
      { error: '회원 정보 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const isMaster = await checkMasterPermission();
    if (!isMaster) {
      return NextResponse.json(
        { error: '마스터(담임목사 · 사모) 권한이 필요합니다.' },
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
