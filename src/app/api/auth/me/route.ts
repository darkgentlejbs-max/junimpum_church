import { NextResponse } from 'next/server';
import { getCurrentUser, isMasterRole } from '@/lib/auth';
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
      return NextResponse.json({
        user: {
          ...user,
          role: liveMember.role || user.role,
          departments: liveMember.departments || user.departments || [],
          isMaster: isMasterRole(liveMember.role || user.role),
        },
      });
    }
  } catch {
    // Fallback to session user if Notion query fails
  }

  return NextResponse.json({
    user: {
      ...user,
      isMaster: isMasterRole(user.role),
    },
  });
}
