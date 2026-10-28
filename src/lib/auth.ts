import crypto from 'crypto';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'junimpum_session';
const SECRET_KEY = process.env.AUTH_SECRET || process.env.NOTION_SECRET || 'junimpum-church-secret-key-2026';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  departments?: string[];
}

export function canAccessDepartmentBoard(
  departments: string[] | undefined,
  targetDepartment: string
): boolean {
  const list = Array.isArray(departments) ? departments : [];
  if (list.includes(targetDepartment)) return true;
  if (
    (targetDepartment === '교회학교' || targetDepartment === '학생부') &&
    (list.includes('학생부') || list.includes('교회학교'))
  ) {
    return true;
  }
  return false;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(':');
    if (!salt || !key) return false;
    const hashBuffer = crypto.scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(key, 'hex');
    if (hashBuffer.length !== keyBuffer.length) return false;
    return crypto.timingSafeEqual(hashBuffer, keyBuffer);
  } catch {
    return false;
  }
}

export function createSessionToken(user: SessionUser): string {
  const payload = {
    ...user,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 14, // 14 days
  };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(data)
    .digest('base64url');
  return `${data}.${signature}`;
}

export function verifySessionToken(token: string): SessionUser | null {
  try {
    const [data, signature] = token.split('.');
    if (!data || !signature) return null;

    const expectedSig = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(data)
      .digest('base64url');

    if (signature !== expectedSig) return null;

    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }

    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      role: payload.role,
      departments: Array.isArray(payload.departments) ? payload.departments : [],
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

export { SESSION_COOKIE_NAME };
