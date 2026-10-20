import { NextResponse } from 'next/server';
import { findMemberByEmail, createMember } from '@/lib/notion';
import { hashPassword, createSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, phone, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: '이름, 아이디(또는 이메일), 비밀번호를 모두 입력해 주세요.' },
        { status: 400 }
      );
    }

    if (password.length < 4) {
      return NextResponse.json(
        { error: '비밀번호는 최소 4자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    const existing = await findMemberByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: '이미 사용 중인 아이디(또는 이메일)입니다.' },
        { status: 409 }
      );
    }

    const passwordHash = hashPassword(password);
    const member = await createMember({
      name,
      email,
      passwordHash,
      phone: phone || '',
      role: role || '성도',
    });

    const token = createSessionToken(member);
    const response = NextResponse.json({ user: member });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 14, // 14 days
    });

    return response;
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error?.message || '회원가입 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
