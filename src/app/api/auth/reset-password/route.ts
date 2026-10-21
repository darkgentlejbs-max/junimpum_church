import { NextResponse } from 'next/server';
import {
  findMemberByEmail,
  findMemberByNameAndPhone,
  updateMemberPassword,
} from '@/lib/notion';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mode, name, email, phone, newPassword } = body;

    if (mode === 'find-id') {
      if (!name) {
        return NextResponse.json(
          { error: '이름을 입력해 주세요.' },
          { status: 400 }
        );
      }

      const member = await findMemberByNameAndPhone(name, phone || '');
      if (!member || !member.email) {
        return NextResponse.json(
          { error: '일치하는 회원 정보를 찾을 수 없습니다. 이름과 연락처를 다시 확인해 주세요.' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        foundId: member.email,
        name: member.name,
        role: member.role,
      });
    }

    // Default: reset-password
    if (!name || !email || !newPassword) {
      return NextResponse.json(
        { error: '이름, 아이디(또는 이메일), 새 비밀번호를 모두 입력해 주세요.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 4) {
      return NextResponse.json(
        { error: '새 비밀번호는 최소 4자 이상 입력해 주세요.' },
        { status: 400 }
      );
    }

    const member = await findMemberByEmail(email);
    if (!member || member.name.trim() !== name.trim()) {
      return NextResponse.json(
        { error: '입력하신 이름과 아이디(또는 이메일)가 일치하는 회원을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 가입 시 연락처를 등록한 회원의 경우 연락처 숫자 비교
    const storedPhoneDigits = (member.phone || '').replace(/\D/g, '');
    const inputPhoneDigits = (phone || '').replace(/\D/g, '');
    if (storedPhoneDigits && storedPhoneDigits !== inputPhoneDigits) {
      return NextResponse.json(
        { error: '가입 시 등록하신 연락처와 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    const newHash = hashPassword(newPassword);
    await updateMemberPassword(member.id, newHash);

    return NextResponse.json({
      success: true,
      name: member.name,
      role: member.role,
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: error?.message || '비밀번호 재설정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
