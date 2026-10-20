import { NextResponse } from 'next/server';
import { findMemberByEmail } from '@/lib/notion';
import { verifyPassword, createSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력해 주세요.' },
        { status: 400 }
      );
    }

    const member = await findMemberByEmail(email);
    if (!member || !verifyPassword(password, member.passwordHash)) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    const sessionUser = {
      id: member.id,
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
    };

    const token = createSessionToken(sessionUser);
    const response = NextResponse.json({ user: sessionUser });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 14, // 14 days
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error?.message || '로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
