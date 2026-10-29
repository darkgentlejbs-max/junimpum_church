import { NextResponse } from 'next/server';
import { getCurrentUser, isMasterRole, createSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';
import { findMemberByEmail } from '@/lib/notion';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null });
  }

  try {
    const liveMember = await findMemberByEmail(user.email);
    if (liveMember) {
      if (liveMember.status === '승인대기') {
        return NextResponse.json({ user: null });
      }
      let resolvedRole = liveMember.role || user.role;
      if (liveMember.name === '박은희' && resolvedRole === '교역자') {
        resolvedRole = '사모';
      }
      const updatedUser = {
        ...user,
        name: liveMember.name || user.name,
        role: resolvedRole,
        departments: liveMember.departments || user.departments || [],
      };
      const response = NextResponse.json({
        user: {
          ...updatedUser,
          isMaster: isMasterRole(resolvedRole),
        },
      });
      if (resolvedRole !== user.role || updatedUser.name !== user.name) {
        const newToken = createSessionToken(updatedUser);
        response.cookies.set(SESSION_COOKIE_NAME, newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 14,
        });
      }
      return response;
    }
  } catch {
    // Fallback to session user if Notion query fails
  }

  const fallbackRole = user.name === '박은희' && user.role === '교역자' ? '사모' : user.role;
  return NextResponse.json({
    user: {
      ...user,
      role: fallbackRole,
      isMaster: isMasterRole(fallbackRole),
    },
  });
}
